---
title: "Astro 入門指南：打造高效能靜態網站"
description: "深入了解 Astro 框架的核心概念、Content Collections 與 Islands Architecture。"
pubDate: 2026-03-08
category: "技術"
tags: ["astro", "javascript", "frontend"]
---

## 什麼是 Astro？

Astro 是一個現代的靜態網站生成器，專為內容驅動的網站設計。它的核心理念是「送出更少的 JavaScript」。

## 核心特色

### Islands Architecture

Astro 採用 Islands Architecture（島嶼架構），只在需要互動的元件上載入 JavaScript：

```astro
---
// 靜態元件 - 零 JS
import Header from '../components/Header.astro';
// 互動元件 - 按需載入 JS
import Counter from '../components/Counter.tsx';
---

<Header />
<Counter client:visible />
```

### Content Collections

Content Collections 提供型別安全的內容管理：

```typescript
import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  schema: z.object({
    title: z.string(),
    pubDate: z.coerce.date(),
    tags: z.array(z.string()),
  }),
});

export const collections = { blog };
```

### 查詢內容

使用 `getCollection` 查詢所有文章：

```typescript
import { getCollection } from 'astro:content';

const posts = await getCollection('blog');
const sortedPosts = posts.sort(
  (a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf()
);
```

## 效能比較

| 框架 | 首次載入 JS | Build 速度 |
|------|------------|-----------|
| Astro | ~0 KB | 快 |
| Next.js | ~80 KB | 中 |
| Gatsby | ~70 KB | 慢 |

## 結論

如果你的網站以內容為主（部落格、文件、行銷頁面），Astro 是一個絕佳的選擇。它的零 JS 預設策略能帶來極佳的效能體驗。

> **提示：** 使用 `pnpm create astro@latest` 就能快速開始。
