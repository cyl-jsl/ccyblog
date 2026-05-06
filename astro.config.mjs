// @ts-check
import { defineConfig } from "astro/config";

import tailwindcss from "@tailwindcss/vite";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import cloudflare from "@astrojs/cloudflare";
import { createSitemapLastmodMap } from "./src/utils/sitemap-lastmod.mjs";

const sitemapLastmodMapPromise = createSitemapLastmodMap({
  blogContentDir: new URL("./src/content/blog/", import.meta.url),
  pageFiles: {
    home: new URL("./src/pages/index.astro", import.meta.url),
    about: new URL("./src/pages/about.astro", import.meta.url),
    projects: new URL("./src/pages/projects.astro", import.meta.url),
    blogIndex: new URL("./src/pages/blog/index.astro", import.meta.url),
    blogPagination: new URL(
      "./src/pages/blog/page/[page].astro",
      import.meta.url,
    ),
  },
});

// https://astro.build/config
export default defineConfig({
  site: "https://ccyblog.pages.dev",
  output: "static",

  vite: {
    plugins: [tailwindcss()],
  },

  integrations: [
    mdx(),
    sitemap({
      async serialize(item) {
        const sitemapLastmodMap = await sitemapLastmodMapPromise;
        const pathname = new URL(item.url).pathname;
        const lastmod = sitemapLastmodMap.get(pathname);

        return lastmod ? { ...item, lastmod } : item;
      },
    }),
  ],
  adapter: cloudflare(),

  markdown: {
    shikiConfig: {
      themes: {
        light: "github-light",
        dark: "github-dark",
      },
    },
  },
});
