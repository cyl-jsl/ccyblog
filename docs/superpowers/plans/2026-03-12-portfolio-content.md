# Portfolio 作品集內容填充 Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 將 5 個真實專案（chain_chains、makeitcount、ffxiv-map、redmine-log、ccyblog）填入 CCY Blog 的作品集頁面，替換掉現有的 2 個假範例。

**Architecture:** 每個作品是一個獨立的 Markdown 檔案，位於 `src/content/projects/`，遵循 Astro Content Collections schema（title、description、url、github、image、tech、featured、order）。內容使用「問題→方案→成果」結構撰寫。

**Tech Stack:** Astro Content Collections、Markdown

---

## File Structure

```
src/content/projects/
├── chain-chains.md     (CREATE) — 加密資產追蹤儀表板
├── makeitcount.md      (CREATE) — AI Discord 記帳機器人
├── ffxiv-map.md        (CREATE) — FF14 藏寶圖路線規劃 Discord Bot
├── redmine-log.md      (CREATE) — Redmine 工時自動化 CLI
├── ccyblog.md          (CREATE) — 個人部落格（替換 sample-project.md）
├── sample-project.md   (DELETE) — 移除假資料
└── cli-tool.md         (DELETE) — 移除假資料
```

No test files needed — this is pure content, validated by Astro build.

---

## Chunk 1: Content Files

### Schema Reference

每個 `.md` 檔案的 frontmatter 必須符合此 schema：

```yaml
---
title: string          # 專案名稱
description: string    # 一句話描述（顯示在卡片上）
url: string?           # Live demo URL（可選）
github: string?        # GitHub repo URL（可選）
image: string?         # 封面圖路徑（可選）
tech: string[]         # 技術標籤
featured: boolean      # 是否精選（首頁顯示）
order: number          # 排序（小的排前面）
---
```

Content body 使用以下結構：
```markdown
## 問題
（這個專案要解決什麼問題？）

## 方案
（怎麼做的？技術選型、架構設計）

## 成果
（做出了什麼？量化成果或功能亮點）
```

---

### Task 1: chain_chains — 加密資產追蹤儀表板

**Files:**
- Create: `src/content/projects/chain-chains.md`

- [ ] **Step 1: 建立 chain-chains.md**

```markdown
---
title: "Chain Chains"
description: "多鏈加密資產投資組合追蹤儀表板，即時監控跨鏈錢包資產分佈與代幣組合。"
github: "https://github.com/cyl-jsl/chain_chains"
tech: ["Next.js 15", "React 19", "TypeScript", "Tailwind CSS 4", "Zustand", "SWR", "IndexedDB"]
featured: true
order: 1
---

## 問題

加密貨幣投資者通常持有分散在多條鏈上的資產，缺乏一個統一的儀表板來即時追蹤跨鏈的資產分佈與價值變動。

## 方案

使用 Next.js 15 + React 19 打造現代化的單頁儀表板應用：

- **狀態管理**：Zustand 管理全域錢包狀態，SWR 處理資料同步與快取
- **本地快取**：IndexedDB 儲存歷史資料，減少 API 呼叫
- **視覺設計**：暗色主題儀表板風格，多層資料視覺化
- **響應式**：Tailwind CSS 4 實現全裝置適配

## 成果

- 支援多鏈錢包的即時資產追蹤
- 跨鏈資產分佈視覺化
- 代幣組合分析
- 本地快取機制，提升載入速度
```

- [ ] **Step 2: 驗證檔案格式**

Run: `cd /Users/ccy/repos/sideprojects/ccyblog && pnpm build 2>&1 | tail -5`
Expected: Build 成功（或至少 projects collection 無錯誤）

- [ ] **Step 3: Commit**

```bash
git add src/content/projects/chain-chains.md
git commit -m "content: add chain_chains portfolio project"
```

---

### Task 2: makeitcount — AI Discord 記帳機器人

**Files:**
- Create: `src/content/projects/makeitcount.md`

- [ ] **Step 1: 建立 makeitcount.md**

```markdown
---
title: "MakeItCount"
description: "AI 驅動的 Discord 記帳機器人，用自然語言記帳，支援群組分帳、預算管理與月報圖表。"
github: "https://github.com/cyl-jsl/makeitcount"
tech: ["Node.js", "TypeScript", "Discord.js", "Claude API", "PostgreSQL", "Prisma", "Chart.js"]
featured: true
order: 2
---

## 問題

傳統記帳 App 操作繁瑣——打開 App、選分類、輸金額、選帳戶。對於習慣在 Discord 社群溝通的使用者，需要一個更自然的記帳方式。室友之間的分帳更是常見痛點。

## 方案

打造一個 Discord 機器人，核心用 Claude Haiku API 解析自然語言：

- **自然語言記帳**：直接說「午餐 85 元」，AI 自動辨識金額、日期、分類
- **智慧分類**：14 大類 + 30 子分類，AI 自動歸類
- **分帳系統**：支援均分與自訂分攤，Greedy Debt Minimization 演算法最小化結清次數
- **多帳戶**：現金、銀行、信用卡、電子支付
- **資料層**：PostgreSQL + Prisma ORM，完整 CRUD
- **圖表報表**：Chart.js + chartjs-node-canvas 生成月度收支圓餅圖

## 成果

- 自然語言輸入準確率高，大幅降低記帳摩擦力
- 分帳結清演算法將 N 筆債務簡化為最少轉帳次數
- 支援 Slash Commands + @mention 兩種互動模式
- 完整的月報生成，含圖表視覺化
```

- [ ] **Step 2: 驗證檔案格式**

Run: `cd /Users/ccy/repos/sideprojects/ccyblog && pnpm build 2>&1 | tail -5`
Expected: Build 成功

- [ ] **Step 3: Commit**

```bash
git add src/content/projects/makeitcount.md
git commit -m "content: add makeitcount portfolio project"
```

---

### Task 3: ffxiv-map — FF14 藏寶圖路線規劃 Bot

**Files:**
- Create: `src/content/projects/ffxiv-map.md`

- [ ] **Step 1: 建立 ffxiv-map.md**

```markdown
---
title: "FFXIV Treasure Map Router"
description: "Final Fantasy XIV 藏寶圖路線規劃 Discord 機器人，自動計算最佳行進路線與跨區傳送策略。"
github: "https://github.com/cyl-jsl/ffxiv-map"
tech: ["Node.js", "TypeScript", "Discord.js", "Sharp", "Vitest"]
featured: true
order: 3
---

## 問題

FF14 的藏寶圖活動中，玩家需要在多個地圖間移動挖寶。手動規劃路線既費時又容易走冤枉路，尤其是涉及跨區傳送時，判斷最佳傳送點更加複雜。

## 方案

開發 Discord 機器人，輸入寶藏座標後自動規劃最佳路線：

- **路線演算法**：計算所有寶藏點的最優訪問順序，最小化總移動距離
- **跨區傳送邏輯**：自動判斷何時應使用傳送、傳送到哪個點最划算
- **覆寫規則系統**：針對特殊地形的手動路徑規則
- **圖像生成**：Sharp 繪製標註路線的地圖圖片
- **資料驅動**：JSON 定義地圖資料，無需資料庫

## 成果

- 比手動規劃平均節省 30%+ 移動時間
- 支援多張地圖的連續路線規劃
- 視覺化路線圖輸出，一目瞭然
- 完整測試覆蓋（Vitest）
```

- [ ] **Step 2: 驗證檔案格式**

Run: `cd /Users/ccy/repos/sideprojects/ccyblog && pnpm build 2>&1 | tail -5`
Expected: Build 成功

- [ ] **Step 3: Commit**

```bash
git add src/content/projects/ffxiv-map.md
git commit -m "content: add ffxiv-map portfolio project"
```

---

### Task 4: redmine-log — Redmine 工時自動化 CLI

**Files:**
- Create: `src/content/projects/redmine-log.md`

- [ ] **Step 1: 建立 redmine-log.md**

```markdown
---
title: "Redmine Log"
description: "Redmine 工時自動化 CLI 工具，支援別名模糊匹配、批次登打，並整合 Claude MCP/Skill。"
github: "https://github.com/cyl-jsl/redmine-log"
tech: ["Node.js", "TypeScript", "Commander", "Claude MCP", "Vitest"]
featured: true
order: 4
---

## 問題

每天在 Redmine 手動填寫工時是重複且乏味的工作——需要打開瀏覽器、找到正確的議題、選擇活動類型、輸入時數和備註。工程師每天花 5-10 分鐘在這件事上。

## 方案

打造一個 CLI 工具，一行指令完成工時記錄：

- **別名系統**：設定縮寫（如 `dev` → 「開發」），不用記完整名稱
- **模糊匹配**：Levenshtein 距離演算法，打錯字也能找到正確的活動類型
- **批次匯入**：CSV 檔案一次登打整週工時
- **查詢功能**：快速檢視今日、本週或任意範圍的工時
- **AI 整合**：透過 Claude MCP Server + Skill，可用自然語言登打工時
- **本地快取**：24 小時 TTL 快取專案與活動清單，減少 API 呼叫

## 成果

- 工時登打從 5 分鐘縮短到 10 秒
- 已發佈到 npm，可全域安裝使用
- Claude 整合讓登打工時變成「跟 AI 說一句話」
- 完整 CLI 體驗：彩色輸出、錯誤提示、互動確認
```

- [ ] **Step 2: 驗證檔案格式**

Run: `cd /Users/ccy/repos/sideprojects/ccyblog && pnpm build 2>&1 | tail -5`
Expected: Build 成功

- [ ] **Step 3: Commit**

```bash
git add src/content/projects/redmine-log.md
git commit -m "content: add redmine-log portfolio project"
```

---

### Task 5: ccyblog — 個人部落格（替換假資料）

**Files:**
- Create: `src/content/projects/ccyblog.md`
- Delete: `src/content/projects/sample-project.md`
- Delete: `src/content/projects/cli-tool.md`

- [ ] **Step 1: 建立 ccyblog.md**

```markdown
---
title: "CCY Blog"
description: "使用 Astro 5 + Tailwind CSS 4 打造的個人部落格，支援深色模式、Pagefind 全文搜尋、RSS 訂閱。"
url: "https://ccyblog.pages.dev"
github: "https://github.com/cyl-jsl/ccyblog"
tech: ["Astro 5", "Tailwind CSS 4", "TypeScript", "MDX", "Pagefind", "Cloudflare Pages"]
featured: true
order: 5
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
```

- [ ] **Step 2: 刪除假資料**

```bash
cd /Users/ccy/repos/sideprojects/ccyblog
rm src/content/projects/sample-project.md
rm src/content/projects/cli-tool.md
```

- [ ] **Step 3: 驗證 build**

Run: `cd /Users/ccy/repos/sideprojects/ccyblog && pnpm build 2>&1 | tail -10`
Expected: Build 成功，無 missing content 錯誤

- [ ] **Step 4: Commit**

```bash
git add -A src/content/projects/
git commit -m "content: replace sample projects with ccyblog, remove fake data"
```

---

## Chunk 2: Final Validation & Deploy

### Task 6: 完整建置驗證 + 部署

**Files:** None (validation only)

- [ ] **Step 1: 完整 build**

Run: `cd /Users/ccy/repos/sideprojects/ccyblog && pnpm build 2>&1 | tail -20`
Expected: Build 成功，5 個 project 頁面生成

- [ ] **Step 2: 確認作品集頁面內容**

Run: `ls /Users/ccy/repos/sideprojects/ccyblog/dist/projects/ 2>/dev/null || echo "check dist structure"`
Expected: 確認 projects 頁面已生成

- [ ] **Step 3: 部署到 Cloudflare Pages**

Run: `cd /Users/ccy/repos/sideprojects/ccyblog && npx wrangler pages deploy dist --project-name ccyblog --branch main`
Expected: 部署成功，顯示新的 URL

- [ ] **Step 4: Push to GitHub**

```bash
cd /Users/ccy/repos/sideprojects/ccyblog
git push origin main
```

- [ ] **Step 5: 更新 Obsidian 副業本**

Update `/Users/ccy/Documents/Obsidian Vault/副業本/CCY-Blog.md`:
- 勾選「替換範例文章為真實技術文章」相關的待辦
- 新增完成的作品列表

Update `/Users/ccy/Documents/Obsidian Vault/副業本/01-第一週-武裝自己.md`:
- 確認 Portfolio 任務的狀態反映最新進度
