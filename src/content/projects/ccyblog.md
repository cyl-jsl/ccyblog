---
title: "CCY Blog"
description: "使用 Astro 5 + Tailwind CSS 4 打造的個人部落格，支援深色模式、Pagefind 全文搜尋、RSS 訂閱。"
url: "https://ccyblog.pages.dev"
github: "https://github.com/cyl-jsl/ccyblog"
tech:
  [
    "Astro 5",
    "Tailwind CSS 4",
    "TypeScript",
    "MDX",
    "Pagefind",
    "Cloudflare Pages",
  ]
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

- 這個站不只是內容展示頁，而是把技術文章、作品集與個人定位整合成同一個資訊架構，反映我對產品敘事與內容系統的理解
- 用 Astro Content Collections、型別約束與共用 layout 管理內容，讓新增文章與作品時維持一致性，也降低後續維護成本
- 把全文搜尋、RSS、Sitemap、OG metadata 和 Cloudflare Pages 部署流程整合進同一套靜態站工作流，展示我對內容平台基礎設施的掌握
- Lighthouse 效能 95+、響應式設計與中文閱讀體驗的細節處理，代表我做的不只是能上線的頁面，而是可長期經營的個人產品
- 已上線運行於 ccyblog.pages.dev，並持續迭代作品呈現、索引品質與搜尋體驗
