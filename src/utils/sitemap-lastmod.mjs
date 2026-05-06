import path from "node:path";
import { readdir, readFile, stat } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const MARKDOWN_EXTENSION_PATTERN = /\.(md|mdx)$/i;
const FRONTMATTER_PATTERN = /^---\s*\n([\s\S]*?)\n---/;
const POSTS_PER_PAGE = 10;
const CATEGORY_SLUGS = {
  技術: "tech",
  日誌: "journal",
};

function matchFrontmatterValue(frontmatter, field) {
  return frontmatter.match(new RegExp(`^${field}:\\s*(.+)$`, "m"))?.[1]?.trim();
}

function stripQuotes(value) {
  return value?.replace(/^['"]|['"]$/g, "");
}

function parseDate(value) {
  if (!value) {
    return undefined;
  }

  const parsedDate = new Date(`${stripQuotes(value)}T00:00:00.000Z`);
  return Number.isNaN(parsedDate.valueOf()) ? undefined : parsedDate;
}

function latestDate(currentDate, nextDate) {
  if (!currentDate) {
    return nextDate;
  }

  if (!nextDate) {
    return currentDate;
  }

  return currentDate > nextDate ? currentDate : nextDate;
}

function latestDateFrom(values) {
  return values.reduce(
    (currentDate, nextDate) => latestDate(currentDate, nextDate),
    undefined,
  );
}

function assignLatestDate(lastmodMap, key, nextDate) {
  if (!nextDate) {
    return;
  }

  lastmodMap.set(key, latestDate(lastmodMap.get(key), nextDate));
}

function parseFrontmatter(content) {
  const frontmatter = content.match(FRONTMATTER_PATTERN)?.[1];
  if (!frontmatter) {
    return undefined;
  }

  const tagsValue = matchFrontmatterValue(frontmatter, "tags");
  let tags = [];

  if (tagsValue) {
    try {
      tags = JSON.parse(tagsValue);
    } catch {
      tags = [];
    }
  }

  return {
    pubDate: parseDate(matchFrontmatterValue(frontmatter, "pubDate")),
    updatedDate: parseDate(matchFrontmatterValue(frontmatter, "updatedDate")),
    category: stripQuotes(matchFrontmatterValue(frontmatter, "category")),
    tags,
    draft: matchFrontmatterValue(frontmatter, "draft") === "true",
  };
}

async function collectMarkdownFiles(directoryPath) {
  const directoryEntries = await readdir(directoryPath, {
    withFileTypes: true,
  });

  const nestedFiles = await Promise.all(
    directoryEntries.map(async (entry) => {
      const entryPath = path.join(directoryPath, entry.name);

      if (entry.isDirectory()) {
        return collectMarkdownFiles(entryPath);
      }

      return MARKDOWN_EXTENSION_PATTERN.test(entry.name) ? [entryPath] : [];
    }),
  );

  return nestedFiles.flat();
}

async function loadBlogPosts(blogContentDir) {
  const blogContentPath = fileURLToPath(blogContentDir);
  const markdownFiles = await collectMarkdownFiles(blogContentPath);

  const posts = await Promise.all(
    markdownFiles.map(async (filePath) => {
      const fileContent = await readFile(filePath, "utf8");
      const frontmatter = parseFrontmatter(fileContent);

      if (!frontmatter?.pubDate || frontmatter.draft) {
        return undefined;
      }

      return {
        slug: path
          .relative(blogContentPath, filePath)
          .replace(MARKDOWN_EXTENSION_PATTERN, "")
          .split(path.sep)
          .join("/"),
        pubDate: frontmatter.pubDate,
        lastmod: frontmatter.updatedDate ?? frontmatter.pubDate,
        category: frontmatter.category,
        tags: frontmatter.tags,
      };
    }),
  );

  return posts
    .filter(Boolean)
    .sort(
      (leftPost, rightPost) =>
        rightPost.pubDate.valueOf() - leftPost.pubDate.valueOf(),
    );
}

async function getFileLastmod(fileUrl) {
  if (!fileUrl) {
    return undefined;
  }

  return (await stat(fileUrl)).mtime;
}

export async function createSitemapLastmodMap({
  blogContentDir,
  pageFiles = {},
}) {
  const posts = await loadBlogPosts(blogContentDir);
  const sitemapLastmodMap = new Map();

  const [
    homeFileDate,
    aboutFileDate,
    projectsFileDate,
    blogIndexFileDate,
    blogPaginationFileDate,
  ] = await Promise.all([
    getFileLastmod(pageFiles.home),
    getFileLastmod(pageFiles.about),
    getFileLastmod(pageFiles.projects),
    getFileLastmod(pageFiles.blogIndex),
    getFileLastmod(pageFiles.blogPagination),
  ]);

  const latestPostDate = latestDateFrom(posts.map((post) => post.lastmod));

  assignLatestDate(
    sitemapLastmodMap,
    "/",
    latestDate(homeFileDate, latestPostDate),
  );
  assignLatestDate(sitemapLastmodMap, "/about/", aboutFileDate);
  assignLatestDate(sitemapLastmodMap, "/projects/", projectsFileDate);
  assignLatestDate(
    sitemapLastmodMap,
    "/blog/",
    latestDate(blogIndexFileDate, latestPostDate),
  );

  const categoryLastmodMap = new Map();
  const tagLastmodMap = new Map();

  for (const post of posts) {
    assignLatestDate(sitemapLastmodMap, `/blog/${post.slug}/`, post.lastmod);

    if (post.category) {
      const categorySlug = CATEGORY_SLUGS[post.category] ?? post.category;
      assignLatestDate(
        categoryLastmodMap,
        `/blog/categories/${categorySlug}/`,
        post.lastmod,
      );
    }

    for (const tag of post.tags) {
      assignLatestDate(
        tagLastmodMap,
        `/blog/tags/${encodeURIComponent(tag)}/`,
        post.lastmod,
      );
    }
  }

  for (const [pathname, lastmod] of categoryLastmodMap) {
    assignLatestDate(sitemapLastmodMap, pathname, lastmod);
  }

  for (const [pathname, lastmod] of tagLastmodMap) {
    assignLatestDate(sitemapLastmodMap, pathname, lastmod);
  }

  const totalPages = Math.ceil(posts.length / POSTS_PER_PAGE);
  for (let pageNumber = 2; pageNumber <= totalPages; pageNumber += 1) {
    const pagePosts = posts.slice(
      (pageNumber - 1) * POSTS_PER_PAGE,
      pageNumber * POSTS_PER_PAGE,
    );
    const pageLastmod = latestDate(
      blogPaginationFileDate,
      latestDateFrom(pagePosts.map((post) => post.lastmod)),
    );
    assignLatestDate(
      sitemapLastmodMap,
      `/blog/page/${pageNumber}/`,
      pageLastmod,
    );
  }

  return sitemapLastmodMap;
}
