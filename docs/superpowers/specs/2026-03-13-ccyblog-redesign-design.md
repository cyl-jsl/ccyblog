# CCYBlog 全站設計翻新規格

## 概述

對 ccyblog 進行全面設計翻新，從目前的通用 Tailwind 模板風格，轉變為「文房書齋」調性——溫暖的米色底、serif 標題排版、紙張質感，營造「有溫度的個人空間」。

### 設計目標

- 首頁從無聊的列表變成有個性的雜誌社論式版面
- 整體視覺從灰色方框提升為有節奏感和層次的排版
- 加入含蓄低調的微互動，讓人覺得「舒服但說不出為什麼」
- 完整的暗色模式，使用暖棕色系維持書齋溫度

### 不變的部分

- 導航結構維持三項：Blog、Projects、About
- 技術棧不變：Astro + Tailwind CSS + Cloudflare Pages
- 內容模型不變（blog、projects collections）
- 路由結構不變（/blog、/blog/page/N、/blog/tags/[tag]、/blog/categories/[category]）

---

## 設計系統

### 色彩

#### 日間模式

| 用途 | 色碼 | 說明 |
|------|------|------|
| 頁面底色 | `#faf6f1` | 暖白/米色 |
| 區塊底色 | `#f3ece2` | 深一階米色，卡片/區塊用 |
| 主文字（標題） | `#3d3028` | 深棕，取代純黑 |
| 正文 | `#5a4d40` | 中深棕 |
| 次要文字 | `#9a8470` | 中棕，副標/日期 |
| 淡色文字 | `#b5a48e` | 淺棕，標籤/輔助 |
| 分隔線 | `#e8dfd3` | 主分隔線 |
| 淡分隔線 | `#f0e9df` | h2 底線、列表分隔 |
| 強調色 | `#c4a882` | 金棕，分隔裝飾/hover accent |
| blockquote 底色 | `#f5efe6` | 引言區塊背景 |
| 分類-技術 | `#efe8dd` 底 + `#9a8470` 字 | 金棕系 |
| 分類-日誌 | `#e8f0e4` 底 + `#6b8c5e` 字 | 草綠系 |

#### 暗色模式

| 用途 | 色碼 | 說明 |
|------|------|------|
| 頁面底色 | `#1c1917` | 暖黑，帶棕調 |
| 區塊底色 | `#262119` | 深棕 |
| 主文字 | `#e8dfd3` | 暖白 |
| 正文 | `#a89b8c` | 中亮棕 |
| 次要文字 | `#8a7e72` | 中棕 |
| 淡色文字 | `#6b6158` | 深棕，標籤/輔助 |
| 分隔線 | `#302a24` | 主分隔線 |
| 淡分隔線 | `#2a241e` | h2 底線、列表分隔 |
| 強調色 | `#d4a86a` | 加亮金棕，保持可讀性 |
| blockquote 底色 | `#262119` | 同區塊底色 |
| 程式碼底色 | `#131110` | 極深棕 |
| 分類-技術 | `#302a24` 底 + `#b5a48e` 字 | |
| 分類-日誌 | `#1e2a1a` 底 + `#8aab7f` 字 | |

**原則**：暗色模式全面使用 stone/棕色系，不使用冷灰色。

### 字體

| 用途 | 字體 | 說明 |
|------|------|------|
| 標題 | `Georgia, 'Noto Serif TC', serif` | 書卷氣 |
| 正文 | `'Inter', 'Noto Sans TC', sans-serif` | 維持可讀性 |
| 日期/代碼 | `'JetBrains Mono', monospace` | 手工記錄感 |

### 字體載入策略

- Inter、JetBrains Mono：透過 Google Fonts CDN 載入，僅載入 latin + latin-ext subset
- Noto Serif TC、Noto Sans TC：透過 Google Fonts CDN 載入（Google Fonts 已對 CJK 字體做自動 unicode-range subset）
- 所有字體使用 `font-display: swap` 避免 FOIT
- Georgia 為系統字體，無需載入

### 動效原則

- 所有過渡 `200-300ms ease`，不超過 `400ms`
- hover 效果限於：微透明度變化、1-2px 位移、色彩漸變
- 無 transform scale、無彈跳、無入場動畫
- 目標是「舒服但說不出為什麼」

---

## 頁面設計

### Header（全站共用）

- 黏性置頂，背景 `#faf6f1`（暗色 `#1c1917`）+ `backdrop-blur`
- 左側：「CCY」以 Georgia serif 顯示，letter-spacing: 1px（從「CCY Blog」簡化為「CCY」）
- 右側：Blog / Projects / About 導航 + 搜尋圖示 + 主題切換
- 當前頁面導航項：深棕色 + 金棕底線（`border-bottom: 1.5px solid #c4a882`）
- 非當前頁面：次要文字色 `#9a8470`
- 底部分隔線 `1px solid #e8dfd3`

### Footer（全站共用）

- 極簡：左側版權「© 2026 CCY」、右側 RSS + GitHub 連結
- 文字色 `#b5a48e`，頂部分隔線

---

### 首頁（/）

採用**雜誌社論式**佈局，由上到下四個區段：

#### Masthead 區

- 置中對齊
- 上方小字 label：「Writings & Works」（10px, letter-spacing: 4px, uppercase, `#b5a48e`）— 裝飾性英文 label，非翻譯遺漏
- 主標語：Georgia serif 28px，`#3d3028`，font-weight: normal
  - 內容：「在混亂中找到秩序，然後寫下來。」
- 副標：13px，`#9a8470`
  - 內容：「寫程式、做工具、偶爾記錄一些還沒想通的事情。」
- 底部金棕細線裝飾（40px 寬，`#c4a882`）

#### 精選 + 近期文章區

- **左大右小不對稱佈局**（Tailwind arbitrary: `flex-[13]` / `flex-[7]`，中間用 1px 垂直分隔線）
- 左側「精選文章」：
  - label：10px uppercase `#b5a48e`
  - 標題：Georgia 20px `#3d3028`
  - 摘要：13px `#9a8470`
  - 日期（monospace）+ 分類 pill
  - 精選文章由 frontmatter `featured: true` 決定（需新增欄位）
  - **Fallback**：若無文章被標記 featured，取最新一篇；若多篇被標記，取最新一篇
  - 精選文章不會出現在右側近期列表中（避免重複）
- 右側「近期文章」：
  - 4 篇最新文章的標題 + 日期列表（排除精選文章後取前 4 篇）
  - Georgia 14px 標題、monospace 10px 日期
  - 每篇之間用淡分隔線

#### 裝飾分隔線

- 「✦」符號居中，兩側細線延伸

#### 精選作品區

- label：10px uppercase `#b5a48e`
- 三欄等寬卡片，背景 `#f3ece2`，圓角 8px
- 每張卡片：Georgia 14px 標題、11px 描述、技術 pill 標籤
- 顯示 `featured: true` 的專案，按 `order` 排序取前 3 個；不足 3 個時自動縮減欄數（2 欄或 1 欄）

---

### 文章列表頁（/blog）

移除 sidebar，改為更寬敞的單欄佈局：

#### 頁面頂部

- Georgia serif 標題「所有文章」
- **分類篩選 tab**：「全部 (N)」「技術 (N)」「日誌 (N)」（數字為動態計算的文章數量）
  - 當前 tab：深棕色 + 金棕底線
  - 其他 tab：次要文字色
  - Tab 連結到 /blog（全部）、/blog/categories/tech、/blog/categories/journal
  - 底部分隔線

#### 文章列表

- **列表式**（非卡片網格），每篇文章一行
- 每篇包含：
  - 日期（monospace 10px `#b5a48e`）+ 分類 pill + 分類色彩
  - 標題：Georgia 17px `#3d3028`
  - 摘要：12px `#9a8470`
  - 標籤：9px `#b5a48e`（比現在更小、更不搶眼）
- 每篇之間用淡分隔線 `#f0e9df`
- 列表末尾用「· · ·」省略符號

#### 分頁器

- 當前頁：深棕底反白數字（`#3d3028` 底 + `#faf6f1` 字），28px 方塊圓角 4px
- 其他頁碼：純文字 `#9a8470`
- 沿用 /blog/page/N 靜態路由

---

### 文章閱讀頁（/blog/[slug]）

#### 整體佈局

- 外框寬度：**960px**（max-width）
- 左右頁邊距：**40px**（可用空間 880px）
- 正文欄寬：**640px**（flex: 0 1 640px）
- 正文 ↔ 目錄間距：**60px**
- 目錄欄寬：**180px**（640 + 60 + 180 = 880px，剛好填滿可用空間）
- 正文和目錄使用 flex 佈局，justify-content: center

#### 文章頭部

- 與正文同欄，**左對齊後加 padding-left: 24px 微推**
- 「← 返回文章列表」連結（11px `#9a8470`）
- 日期（monospace）+ 分類 pill + 閱讀時間
- 標題：Georgia **30px**，font-weight: **normal**，`#3d3028`
- 副標（description）：14px `#9a8470`
- 底部全寬分隔線

#### 正文排版

- 正文字色：`#5a4d40`（比標題淡，比灰深）
- 行高：**1.85**（比一般 1.6 更鬆，適合長文）
- h2：Georgia 20px，font-weight: normal，底部 1px 淡分隔線
- h3：Georgia 16px
- blockquote：左邊線 3px `#c4a882` + 底色 `#f5efe6`，圓角右側
- 程式碼區塊：深棕底 `#2d2a24` + 暖色文字 `#d4c8b8`。語法高亮沿用 Shiki 的 `github-light` / `github-dark` 主題（已在 astro.config.mjs 設定），但覆寫 code block 的背景色和圓角以融入書齋風格
- 列表行高：2
- 連結色：`#c4a882`，hover 加深

#### 目錄（TOC）

- 右側 sticky（top: 80px）
- label：10px uppercase「目錄」
- 左邊線 1px `#e8dfd3` 連接各標題
- 當前閱讀段落的標題色加深為 `#3d3028`，其餘 `#9a8470`
- 字體 12px
- 窄螢幕（< lg）隱藏

#### 文章底部

- 標籤：pill 式，10px，`#f3ece2` 底色
- 上一篇/下一篇：分隔線後左右分佈，10px label + Georgia 13px 標題。位於 640px 正文欄內（與正文同寬）

---

### 作品集頁（/projects）

- Georgia serif 標題「作品」
- 兩欄網格（sm:grid-cols-2）
- 卡片風格與首頁精選作品一致：
  - `#f3ece2` 底色，圓角 8px
  - Georgia 14px 標題、11px 描述
  - 技術 pill 標籤
  - Live Demo / GitHub 連結

### 關於頁（/about）

- 正文 640px 居中
- 排版風格與文章閱讀頁一致（serif 標題、1.85 行高、`#5a4d40` 正文色）
- 無 TOC

### 標籤頁（/blog/tags/[tag]）& 分類頁（/blog/categories/[category]）

- 沿用文章列表頁的列表式排版
- 頂部：「← 返回文章列表」+ 標籤/分類名稱 + 文章數量
- 不顯示分類 tab（已是篩選結果）

---

## 資料模型變更

### blog collection 新增欄位

```typescript
featured: z.boolean().default(false)  // 首頁精選文章
```

### projects collection 無變更

已有 `featured` 和 `order` 欄位。

---

## 響應式策略

| 斷點 | 佈局 |
|------|------|
| 基礎（< 640px） | 單欄，TOC 隱藏，精選+近期改為上下堆疊，作品單欄 |
| sm（640px+） | 作品兩欄 |
| lg（1024px+） | 文章頁顯示 TOC，首頁精選+近期左右分欄 |

---

## 檔案影響範圍

### 修改

- `src/styles/global.css` — 全面替換色彩系統、排版、prose 樣式
- `src/layouts/BaseLayout.astro` — 頁面底色、容器寬度
- `src/layouts/PostLayout.astro` — 文章頁佈局（960px 外框、640px 正文、頭部 padding-left）
- `src/components/Header.astro` — 導航樣式（serif logo、金棕底線、背景色）
- `src/components/Footer.astro` — 極簡化
- `src/components/PostCard.astro` — 改為列表項目式（非卡片），用於列表頁
- `src/components/ProjectCard.astro` — 米色卡片風格
- `src/components/TableOfContents.astro` — 左邊線、輕量化
- `src/components/BlogListPage.astro` — 移除 sidebar，改為分類 tab + 列表式
- `src/components/ThemeToggle.astro` — 圖示色彩適配
- `src/components/Search.astro` — 模態視窗配色適配（背景 `#faf6f1` / dark `#1c1917`，輸入框底色 `#f3ece2` / dark `#262119`，邊框用分隔線色）
- `src/pages/index.astro` — 全面重寫為雜誌社論式
- `src/pages/blog/index.astro` — 配合 BlogListPage 改動
- `src/pages/blog/page/[page].astro` — 配合 BlogListPage 改動（分頁路由）
- `src/pages/blog/[...slug].astro` — 配合 PostLayout 改動
- `src/pages/blog/tags/[tag].astro` — 列表式排版
- `src/pages/blog/categories/[category].astro` — 列表式排版
- `src/pages/projects.astro` — 卡片風格更新
- `src/pages/about.astro` — 排版更新
- `src/content.config.ts` — blog collection 新增 `featured` 欄位

### 新增

- 無新增檔案（所有改動在現有檔案上進行）

### 刪除

- `src/components/TagList.astro` — 標籤列表改為在 PostLayout 內 inline 實作（pill 式 10px），不再需要獨立元件

---

## 視覺參考

mockup 檔案保存在 `.superpowers/brainstorm/35133-1773384471/`：

- `mood-direction.html` — 調性方向選擇（選定 A 文房書齋）
- `homepage-approaches.html` — 首頁方案選擇（選定 A 雜誌社論式）
- `homepage-detail.html` — 首頁完整佈局
- `blog-list-detail.html` — 文章列表頁
- `post-detail-v7.html` — 文章閱讀頁（最終版）
- `dark-mode.html` — 暗色模式配色
