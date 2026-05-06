import { getCollection } from "astro:content";
import type { APIContext } from "astro";
import { categoryToSlug } from "../utils/category";

const POSTS_PER_PAGE = 10;

export async function GET(context: APIContext) {
  const posts = (await getCollection("blog", ({ data }) => !data.draft)).sort(
    (leftPost, rightPost) =>
      rightPost.data.pubDate.valueOf() - leftPost.data.pubDate.valueOf(),
  );

  const pathnames = new Set(["/", "/about/", "/projects/", "/blog/"]);

  for (const post of posts) {
    pathnames.add(`/blog/${post.id}/`);
    pathnames.add(`/blog/categories/${categoryToSlug(post.data.category)}/`);

    for (const tag of post.data.tags) {
      pathnames.add(`/blog/tags/${encodeURIComponent(tag)}/`);
    }
  }

  const totalPages = Math.ceil(posts.length / POSTS_PER_PAGE);
  for (let pageNumber = 2; pageNumber <= totalPages; pageNumber += 1) {
    pathnames.add(`/blog/page/${pageNumber}/`);
  }

  const sitemapText = Array.from(pathnames)
    .map((pathname) => new URL(pathname, context.site!).toString())
    .join("\n");

  return new Response(`${sitemapText}\n`, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
}
