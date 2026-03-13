# AI Agent Skills 框架技術文章系列 — 實作計畫

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 在 ccyblog 上發佈 13 篇技術文章系列「打造 AI Agent Skills 框架：企業級系統的設計決策與教訓」

**Architecture:** 每篇文章為獨立 Markdown 檔案，透過共用 tag 串聯。每篇使用 @blog-post skill 撰寫，撰寫前需讀取指定的源碼素材。全系列遵循統一的泛化術語對照表。

**Tech Stack:** Astro 5.x Content Collections, Markdown, Mermaid diagrams

**Spec:** `docs/superpowers/specs/2026-03-12-ai-agent-skills-blog-series-design.md`

**Source Chronicle:** `/Users/ccy/repos/ksi/skills4ifa/archive/development-chronicle.md`

---

## Shared References

以下資源在多個 Task 中重複使用：

- **泛化術語對照表**：Spec §4.5 — 每篇文章完成後必須檢查
- **Frontmatter 模板**：Spec §4.2
- **必要 tag**：每篇文章必須包含 `ai-agent-skills-series` tag，其餘 tags 視內容調整
- **編年史**：`/Users/ccy/repos/ksi/skills4ifa/archive/development-chronicle.md`
- **Skills 根目錄**：`/Users/ccy/repos/ksi/skills4ifa/skills/`
- **Docs 根目錄**：`/Users/ccy/repos/ksi/skills4ifa/docs/`
- **前端知識庫**：`/Users/ccy/repos/ksi/skills4ifa/skills/developing-ifa-views/ifa-frontend-docs.md`
- **CLAUDE.md**：`/Users/ccy/repos/ksi/skills4ifa/CLAUDE.md`

### 系列導航區塊模板

每篇文章底部統一放置：

```markdown
---

> **本文是「打造 AI Agent Skills 框架」系列的第 N/13 篇**
>
> ← 上一篇：[篇名](/blog/ai-skills-XX)
> → 下一篇：[篇名](/blog/ai-skills-XX)
>
> [📚 回到系列目錄](/blog/ai-skills-00-index)
```

**邊界處理**：第 1 篇省略「← 上一篇」行；第 13 篇省略「→ 下一篇」行。

### 檔名慣例

`src/content/blog/ai-skills-{NN}-{slug}.md`，其中 NN = 00（索引）到 13。

---

## Chunk 1: Infrastructure

### Task 0a: 安裝 Mermaid 渲染支援

**Files:**
- Modify: `package.json`（新增依賴）
- Modify: `astro.config.mjs`（新增 remark plugin）

- [ ] **Step 1: 安裝 remark-mermaidjs**

```bash
cd /Users/ccy/repos/sideprojects/ccyblog
pnpm add remark-mermaidjs
```

- [ ] **Step 2: 配置 Astro remark plugin**

在 `astro.config.mjs` 的 `markdown.remarkPlugins` 中加入 `remarkMermaid`。若 `remarkPlugins` 不存在則新增。

- [ ] **Step 3: 驗證** — 建立一個含 Mermaid 的測試 Markdown 檔，執行 `pnpm build` 確認圖表正確渲染。驗證後刪除測試檔。

- [ ] **Step 4: Commit**

```bash
git add package.json pnpm-lock.yaml astro.config.mjs
git commit -m "feat: add Mermaid diagram support via remark-mermaidjs"
```

---

### Task 0b: 建立系列索引頁

**Files:**
- Create: `src/content/blog/ai-skills-00-index.md`

- [ ] **Step 1: 建立索引文章**

```markdown
---
title: "打造 AI Agent Skills 框架：系列目錄"
description: "13 篇文章，記錄從零建立企業級 AI Agent 技能框架的設計決策與教訓"
pubDate: 2026-03-13
category: "技術"
tags: ["ai-agent", "skills-framework", "design-decisions", "ai-agent-skills-series"]
draft: false
---

## 系列簡介

一位工程師花了 22 個活躍開發日，在一個 400+ 頁面的企業前端系統上，從零建立了 14 個結構化技能的 AI Agent 框架。本系列記錄這段旅程中的設計決策與教訓。

## 文章目錄

### 導論
1. [當 AI 遇上 400+ 頁面的企業系統](/blog/ai-skills-01-introduction) — 為什麼 prompt engineering 不夠用

### 基礎設計層
2. [TDD for Documentation](/blog/ai-skills-02-tdd-for-docs) — 用測試驅動設計 AI 技能
3. [漸進式披露](/blog/ai-skills-03-progressive-disclosure) — 讓 AI 只讀該讀的
4. [Skills vs Docs 職責分離](/blog/ai-skills-04-skills-vs-docs) — 知識該放哪裡

### 行為控制層
5. [HARD-GATE](/blog/ai-skills-05-hard-gate) — 從建議到不可跨越的行為閘門
6. [會話分離](/blog/ai-skills-06-session-separation) — 結構性消滅幻覺
7. [Orchestrator](/blog/ai-skills-07-orchestrator) — AI 的任務路由器

### 品質保證層
8. [規格書解碼器](/blog/ai-skills-08-spec-decoder) — 從人類語言到程式碼鏈
9. [品質根因診斷](/blog/ai-skills-09-root-cause) — 修 Code 之前先修生態系
10. [回歸測試與驗證閘門](/blog/ai-skills-10-regression-verification) — Skills 的品質保證

### 生態系治理層
11. [收斂審查](/blog/ai-skills-11-convergence-review) — 14 個 Skills 的系統性治理
12. [從個人工具到團隊基建](/blog/ai-skills-12-team-adoption) — 導入與推廣

### 展望
13. [AI Skills 框架的未解問題](/blog/ai-skills-13-outlook) — 邊界與未來方向
```

- [ ] **Step 2: Commit**

```bash
git add src/content/blog/ai-skills-00-index.md
git commit -m "content: add AI Agent Skills series index page"
```

---

## Chunk 2: Foundation Layer (#1-#4)

### Task 1: #1 導論 — 當 AI 遇上 400+ 頁面的企業系統

**Files:**
- Create: `src/content/blog/ai-skills-01-introduction.md`

**Source materials to read:**
- 編年史 Week 1: 02-02（Day 0 構想）、02-04（MVP 測試 72 分）
- `/Users/ccy/repos/ksi/skills4ifa/archive/logs/2026-02-02-session.md`（最早的 session 記錄）
- `/Users/ccy/repos/ksi/skills4ifa/archive/logs/2026-02-02-findings.md`（最早的 findings）

**Writing instructions:**
- [ ] **Step 1: Read source materials** — 讀取上述檔案，提取以下數據點：
  - 系統規模數字（頁面/元件/版型）
  - MVP 測試的具體分數和 3 個嚴重幻覺的類型描述
  - Day 0 的初始規劃（7 個 Skills 優先順序）
  - 從「問題觀察」到「決定建框架」的心路轉折
- [ ] **Step 2: Draft article** — 使用 @blog-post skill 撰寫，遵循 Spec §3 #1 的演化弧結構
- [ ] **Step 3: Terminology check** — 對照 Spec §4.5 術語表，確認無專有名詞洩漏
- [ ] **Step 4: Add series navigation** — 加入底部導航區塊（無「上一篇」，下一篇指向 #2）
- [ ] **Step 5: Commit**

```bash
git add src/content/blog/ai-skills-01-introduction.md
git commit -m "content: add AI Skills #1 — introduction"
```

---

### Task 2: #2 TDD for Documentation — 用測試驅動設計 AI 技能

**Files:**
- Create: `src/content/blog/ai-skills-02-tdd-for-docs.md`

**Source materials to read:**
- 編年史 02-02: TDD RED/GREEN Phase
- 編年史 02-04: MVP 測試分析與 skill 改善（commit `4738fb3`）
- 編年史 02-06~07: 回歸測試框架建立
- `/Users/ccy/repos/ksi/skills4ifa/archive/logs/2026-02-02-session.md`（6 類預期失敗點的原始記錄）
- `/Users/ccy/repos/ksi/skills4ifa/skills/developing-ifa-views/SKILL.md`（REFACTOR 後的成熟版，對比 v1 的行數差）

**Writing instructions:**
- [ ] **Step 1: Read source materials** — 提取：
  - RED Phase 的 6 類失敗點具體描述
  - GREEN Phase 的最小化 Skill 範例
  - 643 行 → 302 行的 REFACTOR 具體做法
  - 回歸測試暴露的退化案例
- [ ] **Step 2: Draft article** — 使用 @blog-post skill，重點呈現 before/after 對比
- [ ] **Step 3: Terminology check**
- [ ] **Step 4: Add series navigation**
- [ ] **Step 5: Commit**

```bash
git add src/content/blog/ai-skills-02-tdd-for-docs.md
git commit -m "content: add AI Skills #2 — TDD for Documentation"
```

---

### Task 3: #3 漸進式披露 — 讓 AI 只讀該讀的

**Files:**
- Create: `src/content/blog/ai-skills-03-progressive-disclosure.md`

**Source materials to read:**
- 編年史 02-03: Progressive Disclosure 重構（commits `ca36e9d`, `95d9866`）
- 編年史 02-04: 643→302 行精簡（commit `cd257c6`）
- 編年史 02-25: Gotchas Only 原則（commit `ec1d416`）
- `/Users/ccy/repos/ksi/skills4ifa/skills/developing-ifa-views/SKILL.md`（三層載入架構的實際結構）
- `/Users/ccy/repos/ksi/skills4ifa/skills/developing-ifa-views/layouts/`（Layer 2 子檔案）
- `/Users/ccy/repos/ksi/skills4ifa/skills/styling-ifa-views/SKILL.md`（Styling Skill，延伸案例素材）
- `/Users/ccy/repos/ksi/skills4ifa/skills/styling-ifa-views/patterns-and-intent.md`（無截圖推論版面意圖）

**Writing instructions:**
- [ ] **Step 1: Read source materials** — 提取：
  - v1→v2→v3 的三次演化具體內容
  - 三層載入的實際檔案結構
  - 統一引用語法 `→ 搜索 {檔案}「標題」` 的設計理由
  - Styling Skill 的 layout-intent-guide 如何用規則推論 grid 佈局
- [ ] **Step 2: Draft article** — 使用 @blog-post skill，含三層架構示意圖
- [ ] **Step 3: Terminology check**
- [ ] **Step 4: Add series navigation**
- [ ] **Step 5: Commit**

```bash
git add src/content/blog/ai-skills-03-progressive-disclosure.md
git commit -m "content: add AI Skills #3 — progressive disclosure"
```

---

### Task 4: #4 Skills vs Docs 職責分離 — 知識該放哪裡

**Files:**
- Create: `src/content/blog/ai-skills-04-skills-vs-docs.md`

**Source materials to read:**
- 編年史 02-09: 概念收斂 Phase 2.9（commits `bcc1026`, `40f22d7`）
- 編年史 02-07: Props 修正（commit `f80f7b3`）— 跨 Skill 不一致的具體案例
- `/Users/ccy/repos/ksi/skills4ifa/CLAUDE.md`（Skills↔Docs 職責分離規則段落）
- `/Users/ccy/repos/ksi/skills4ifa/skills/developing-ifa-views/SKILL.md`（Gotcha/Flow/Red Flag 實例）
- `/Users/ccy/repos/ksi/skills4ifa/skills/developing-ifa-views/ifa-frontend-docs.md`（Domain-WHAT/HOW/RULE 實例）

**Writing instructions:**
- [ ] **Step 1: Read source materials** — 提取：
  - Phase 1 → Phase 2 的轉折事件（Props 修正暴露的跨 Skill 不一致）
  - 「快速判定規則」的原文
  - Skills 放什麼 vs Docs 放什麼的具體分類表
  - 交叉引用語法的雙向結構
- [ ] **Step 2: Draft article** — 使用 @blog-post skill，含職責分離判定表
- [ ] **Step 3: Terminology check**
- [ ] **Step 4: Add series navigation**
- [ ] **Step 5: Commit**

```bash
git add src/content/blog/ai-skills-04-skills-vs-docs.md
git commit -m "content: add AI Skills #4 — Skills vs Docs separation"
```

---

## Chunk 3: Behavior Control Layer (#5-#7)

### Task 5: #5 HARD-GATE — 從建議到不可跨越的行為閘門

**Files:**
- Create: `src/content/blog/ai-skills-05-hard-gate.md`

**Source materials to read:**
- 編年史 02-13: HARD-GATE 全面部署（commits `99e2e43` ~ `a16b9ed`，共 6 個）
- `/Users/ccy/repos/ksi/skills4ifa/skills/orchestrating-ifa-workflow/SKILL.md`（HARD-GATE + 15 個 Red Flags）
- `/Users/ccy/repos/ksi/skills4ifa/skills/developing-ifa-views/SKILL.md`（HARD-GATE 段落）
- `/Users/ccy/repos/ksi/skills4ifa/skills/executing-ifa-plans/SKILL.md`（HARD-GATE 段落）
- `/Users/ccy/repos/ksi/skills4ifa/skills/verifying-ifa-output/SKILL.md`（HARD-GATE 段落）
- `/Users/ccy/repos/ksi/skills4ifa/skills/planning-ifa-development/SKILL.md`（HARD-GATE 段落）

**Writing instructions:**
- [ ] **Step 1: Read source materials** — 提取：
  - 每個 Skill 的 HARD-GATE 具體內容（禁止什麼）
  - Red Flags 表格（「念頭」→「現實」）的精選 3-5 條
  - 四層防線的具體攔截路徑
  - v1 建議式 → v2 HARD-GATE 的轉折事件描述
- [ ] **Step 2: Draft article** — 使用 @blog-post skill，含 HARD-GATE 語法範例和四層防線流程圖
- [ ] **Step 3: Terminology check** — 特別注意泛化 HARD-GATE 內提及的專有名詞
- [ ] **Step 4: Add series navigation**
- [ ] **Step 5: Commit**

```bash
git add src/content/blog/ai-skills-05-hard-gate.md
git commit -m "content: add AI Skills #5 — HARD-GATE"
```

---

### Task 6: #6 會話分離 — 結構性消滅幻覺

**Files:**
- Create: `src/content/blog/ai-skills-06-session-separation.md`

**Source materials to read:**
- 編年史 02-13: planning/executing Skills 建立（commits `0454cc6`）
- 編年史 02-23: Session-Aware Planning（commit `7ccc1d9`）
- 編年史 02-25: plan 瘦身 63%（commit `2977b43`）
- `/Users/ccy/repos/ksi/skills4ifa/skills/planning-ifa-development/SKILL.md`（Planning 窗口流程）
- `/Users/ccy/repos/ksi/skills4ifa/skills/executing-ifa-plans/SKILL.md`（Executing 窗口流程 + STOP 點）
- `/Users/ccy/repos/ksi/skills4ifa/CLAUDE.md`（§Session Management 段落）

**Writing instructions:**
- [ ] **Step 1: Read source materials** — 提取：
  - 三窗口模式的具體職責劃分
  - plan 文件從「自包含」到「決策 Only」的瘦身過程（具體刪了什麼）
  - STOP 點的觸發條件
  - 窗口切換建議 vs 強制的閾值條件
- [ ] **Step 2: Draft article** — 使用 @blog-post skill，含三窗口模式圖
- [ ] **Step 3: Terminology check**
- [ ] **Step 4: Add series navigation**
- [ ] **Step 5: Commit**

```bash
git add src/content/blog/ai-skills-06-session-separation.md
git commit -m "content: add AI Skills #6 — session separation"
```

---

### Task 7: #7 Orchestrator — AI 的任務路由器

**Files:**
- Create: `src/content/blog/ai-skills-07-orchestrator.md`

**Source materials to read:**
- 編年史 02-13: orchestrating-ifa-workflow 建立（commit `ff5ffe4`）+ 路由重構（`41ff5d9`）
- 編年史 02-26: 跨窗口技能路由修復（commit `27483d6`）
- `/Users/ccy/repos/ksi/skills4ifa/skills/orchestrating-ifa-workflow/SKILL.md`（完整路由表 + 15 Red Flags）

**Writing instructions:**
- [ ] **Step 1: Read source materials** — 提取：
  - 4 種任務類型的路由表完整內容
  - 15 個禁止念頭的精選 5-7 條
  - v1 隱式路由的失敗案例
  - 跨窗口技能路由修復的 bug 描述（02-26）
- [ ] **Step 2: Draft article** — 使用 @blog-post skill，含路由表和調度流程圖
- [ ] **Step 3: Terminology check** — 路由表中可能有大量專有名詞需要泛化
- [ ] **Step 4: Add series navigation**
- [ ] **Step 5: Commit**

```bash
git add src/content/blog/ai-skills-07-orchestrator.md
git commit -m "content: add AI Skills #7 — Orchestrator"
```

---

## Chunk 4: Quality Assurance Layer (#8-#10)

### Task 8: #8 規格書解碼器 — 從人類語言到程式碼鏈

**Files:**
- Create: `src/content/blog/ai-skills-08-spec-decoder.md`

**Source materials to read:**
- 編年史 02-24: writing-ifa-specs 建立（commits `15e0e01`, `3628656`）
- 編年史 02-11: 幻覺防禦（commit `7c5fb53`）
- 編年史 02-25~26: HWS 模板（commits `25400ee`, `b40a420`, `8b26c49`）
- 編年史 02-25: plan-template 重構（commit `d47e59c`）
- `/Users/ccy/repos/ksi/skills4ifa/skills/writing-ifa-specs/SKILL.md`（信心標記系統 + 強制輸出格式）
- `/Users/ccy/repos/ksi/skills4ifa/skills/developing-ifa-views/SKILL.md`（隱含慣例解碼表段落）
- `/Users/ccy/repos/ksi/skills4ifa/docs/spec-writer-guide.md`（規格書撰寫指南）

**Writing instructions:**
- [ ] **Step 1: Read source materials** — 提取：
  - 10 條隱含慣例解碼的完整列表（精選 2-3 條展開）
  - 信心標記 ✅🔵❓ 的完整定義
  - 禁止推論清單的具體欄位
  - 強制輸出的四段結構
- [ ] **Step 2: Draft article** — 使用 @blog-post skill，含信心標記流程圖
- [ ] **Step 3: Terminology check** — 隱含慣例解碼表需要大量泛化
- [ ] **Step 4: Add series navigation**
- [ ] **Step 5: Commit**

```bash
git add src/content/blog/ai-skills-08-spec-decoder.md
git commit -m "content: add AI Skills #8 — spec decoder"
```

---

### Task 9: #9 品質根因診斷 — 修 Code 之前先修生態系

**Files:**
- Create: `src/content/blog/ai-skills-09-root-cause.md`

**Source materials to read:**
- 編年史 02-12: triaging-quality-issues 建立（commits `e3101b9`, `c172976`）
- 編年史 02-13: 6 類生態系問題修復（commit `f8cc4b1`）
- `/Users/ccy/repos/ksi/skills4ifa/skills/triaging-quality-issues/SKILL.md`（五層根因分析 + Dual Fix + HARD-GATE）

**Writing instructions:**
- [ ] **Step 1: Read source materials** — 提取：
  - 五層根因分析的完整表格（層級/名稱/檢查對象/根因例）
  - Dual Fix 的具體案例（code fix + ecosystem fix 各修了什麼）
  - HARD-GATE 的具體禁止內容
  - 6 類生態系問題的分類
- [ ] **Step 2: Draft article** — 使用 @blog-post skill，含五層分析 + Dual Fix 圖
- [ ] **Step 3: Terminology check**
- [ ] **Step 4: Add series navigation**
- [ ] **Step 5: Commit**

```bash
git add src/content/blog/ai-skills-09-root-cause.md
git commit -m "content: add AI Skills #9 — root cause diagnosis"
```

---

### Task 10: #10 回歸測試與驗證閘門 — Skills 的品質保證

**Files:**
- Create: `src/content/blog/ai-skills-10-regression-verification.md`

**Source materials to read:**
- 編年史 02-06~07: 回歸測試 Sub-missions 5a-5d（commits `476b7bc` ~ `d9e273d`）
- 編年史 02-13: verifying-ifa-output 建立（commit `7597674`）
- `/Users/ccy/repos/ksi/skills4ifa/skills/verifying-ifa-output/SKILL.md`（三階段驗證 + 四維度 + HARD-GATE）
- `/Users/ccy/repos/ksi/skills4ifa/archive/validations/`（回歸測試結果 — 含 `g05-regression-*.md` 檔案）

**Writing instructions:**
- [ ] **Step 1: Read source materials** — 提取：
  - Sub-mission 5a→5d 的回歸迭代過程
  - Baseline 重新生成的次數和每次暴露的問題
  - 驗證報告的四維度結構（欄位/事件/邏輯/不應存在）
  - ⚠️ 偏差 vs ❌ 缺失的設計理由
  - testing-workflow → verifying-ifa-output 的重構原因
- [ ] **Step 2: Draft article** — 使用 @blog-post skill，含 baseline 比對流程圖和四維度驗證結構
- [ ] **Step 3: Terminology check**
- [ ] **Step 4: Add series navigation**
- [ ] **Step 5: Commit**

```bash
git add src/content/blog/ai-skills-10-regression-verification.md
git commit -m "content: add AI Skills #10 — regression testing and verification"
```

---

## Chunk 5: Ecosystem Governance + Outlook (#11-#13)

### Task 11: #11 收斂審查 — 14 個 Skills 的系統性治理

**Files:**
- Create: `src/content/blog/ai-skills-11-convergence-review.md`

**Source materials to read:**
- 編年史 02-24: 14 Skills 全量審查（commits `f24255c`, `312f8b5`）+ 三階段收斂（`2650be2` ~ `c6d1ac9`）
- 編年史 02-25: 架構重構 2.17（commits `ec1d416` ~ `70a4b07`）
- 編年史 03-12: 規格書術語統一（commits `3114304` ~ `27a2e36`，共 8 個）
- 編年史 02-14~22: 10 天空白期
- `/Users/ccy/repos/ksi/skills4ifa/archive/validations/`（收斂審查報告 — 注意：此目錄主要含回歸測試報告，47 項發現的詳細資料需從編年史 02-24 的 commit `312f8b5` 和 git diff 中提取）

**Writing instructions:**
- [ ] **Step 1: Read source materials** — 提取：
  - 47 項發現的分類框架和精選案例
  - 三階段收斂的排序邏輯（為什麼先做 Critical + Quick Wins）
  - 4 個超標 Skill 瘦身的具體數據
  - 12/13 回歸通過 + 1 個缺口的修補過程
  - 術語統一的三代命名演化
  - 10 天空白期的敘事價值（沉澱後的全量審查效果）
- [ ] **Step 2: Draft article** — 使用 @blog-post skill
- [ ] **Step 3: Terminology check**
- [ ] **Step 4: Add series navigation**
- [ ] **Step 5: Commit**

```bash
git add src/content/blog/ai-skills-11-convergence-review.md
git commit -m "content: add AI Skills #11 — convergence review"
```

---

### Task 12: #12 從個人工具到團隊基建 — 導入與推廣

**Files:**
- Create: `src/content/blog/ai-skills-12-team-adoption.md`

**Source materials to read:**
- 編年史 03-02: 安裝流程（commits `e3f14d8` ~ `cf96712`）
- 編年史 03-04~05: 教育訓練 + Feedback Workflow（commits `a237aaf` ~ `d04a120`）
- 編年史 02-13: publish.sh（commit `680b1af`）
- 編年史 03-12: syncing-spec-changes（commits `9d813d6` ~ `040052e`）
- `/Users/ccy/repos/ksi/skills4ifa/skills/submitting-skill-feedback/SKILL.md`（反饋提交流程）
- `/Users/ccy/repos/ksi/skills4ifa/README.md`（安裝/使用/Skills 總覽）

**Writing instructions:**
- [ ] **Step 1: Read source materials** — 提取：
  - 安裝流程的 before/after（手動 → 腳本化，100% 達成率）
  - publish.sh 的開發庫/發佈庫分離機制
  - 版本偵測的 .skills4ifa-meta 機制
  - 教育訓練的 2 小時工作坊結構
  - 「刻意出錯」示範腳本的設計理由
  - 反饋迴路的完整流程
  - syncing-spec-changes 的靜態依賴表設計
- [ ] **Step 2: Draft article** — 使用 @blog-post skill
- [ ] **Step 3: Terminology check** — 特別注意 GitLab → 版本控制平台
- [ ] **Step 4: Add series navigation**
- [ ] **Step 5: Commit**

```bash
git add src/content/blog/ai-skills-12-team-adoption.md
git commit -m "content: add AI Skills #12 — team adoption"
```

---

### Task 13: #13 展望 — AI Skills 框架的未解問題

**Files:**
- Create: `src/content/blog/ai-skills-13-outlook.md`

**Source materials to read:**
- 全系列已完成的 12 篇文章（回顧）
- 編年史 02-04: MVP 使用 Copilot Agent Mode / Claude Sonnet 4.5（模型差異經驗）
- `/Users/ccy/repos/ksi/skills4ifa/CLAUDE.md`（框架治理原則的最終狀態）

**Writing instructions:**
- [ ] **Step 1: Read source materials** — 提取：
  - 模型差異的實際經驗（Copilot Agent Mode vs Claude Code）
  - 框架目前的已知限制
  - 5 個未解方向的具體思考
- [ ] **Step 2: Draft article** — 使用 @blog-post skill，Spec §3 #13 的五個方向全部涵蓋
- [ ] **Step 3: Terminology check**
- [ ] **Step 4: Add series navigation**（無「下一篇」，只有「上一篇」和「回到目錄」）
- [ ] **Step 5: Update index page** — 確認所有 13 篇連結都可用
- [ ] **Step 6: Commit**

```bash
git add src/content/blog/ai-skills-13-outlook.md
git commit -m "content: add AI Skills #13 — outlook"
```

---

## Post-Series Checklist

- [ ] 全系列 13 篇 + 索引頁，共 14 個 Markdown 檔案
- [ ] 每篇底部都有系列導航區塊
- [ ] 索引頁所有連結都指向正確的 slug
- [ ] 全系列無專有名詞洩漏（對照 Spec §4.5 泛化術語表）
- [ ] 每篇至少包含一張 Mermaid 圖表（依 Spec §7 圖表清單）
- [ ] 所有文章 `draft: false`，準備發佈
