---
title: "CCY Blog"
description: "使用 Astro 5 + Tailwind CSS 4 打造的個人部落格，支援深色模式、Pagefind 全文搜尋、RSS 訂閱。"
url: "https://ccyblog.pages.dev"
github: "https://github.com/cyl-jsl/ccyblog"
tech: ["Astro 5", "Tailwind CSS 4", "TypeScript", "MDX", "Pagefind", "Cloudflare Pages"]
featured: true
order: 6
---

## 問題

需要一個兼具技術文章、個人日誌和作品集功能的個人網站，既要效能好又要維護方便，同時支援中文排版。

## 方案

選用 Astro 作為靜態網站框架，搭配 Tailwind CSS 4：

- **內容管理**：Astro Content Collections + Markdown/MDX，schema 驗證確保內容格式一致
- **全文搜尋**：Pagefind 靜態索引，Cmd/Ctrl+K 快速搜尋
- **主題切換**：深色/淺色模式，localStorage 記憶偏好
- **SEO 完整**：Open Graph、Twitter Card、Sitemap、RSS Feed
- **部署**：Cloudflare Pages，全球 CDN 加速

## 成果

- Lighthouse 效能分數 95+
- 支援文章分頁、標籤過濾、目錄導航
- 閱讀時間估算
- 響應式設計，手機體驗流暢
- 已上線運行：ccyblog.pages.dev
