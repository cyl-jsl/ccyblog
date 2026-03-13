# Blog Writing Style Guide Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 為 blog-post skill 新增兩份寫作風格參考檔案，並修改 SKILL.md 在撰寫階段按需載入。

**Architecture:** 在 `~/.claude/skills/blog-post/references/` 下新增 `writing-style.md`（正面指引）和 `ai-guardrails.md`（反面護欄），SKILL.md Step 3 加入讀取指令。Progressive Disclosure——只在撰寫時載入。

**Spec:** `docs/superpowers/specs/2026-03-13-blog-writing-style-guide-design.md`

---

## Chunk 1: Create Reference Files and Update SKILL.md

### Task 1: Create references directory

**Files:**
- Create: `~/.claude/skills/blog-post/references/` (directory)

- [ ] **Step 1: Create directory**

```bash
mkdir -p ~/.claude/skills/blog-post/references
```

---

### Task 2: Create writing-style.md

**Files:**
- Create: `~/.claude/skills/blog-post/references/writing-style.md`

- [ ] **Step 1: Write the file**

```markdown
# Writing Style Guide

## Voice Profile

依文章 category 選擇語氣：

| category | 語氣 | 像是 |
|----------|------|------|
| `技術` | 專業但親切。用「你」跟讀者對話，有深度但不故作高深 | Dan Abramov — 建立心智模型，不只教步驟 |
| `日誌` | 像跟同事聊天。輕鬆、真實、可以開玩笑 | Julia Evans — 「我搞了半天終於懂了，來跟你說」 |

未列出的 category，預設採用「技術」語氣，但仍遵守以下所有原則。

---

## Writing Principles

### 1. 展示思考過程，不只呈現結論

帶讀者走一遍「為什麼」和「怎麼想到的」。可以展示錯誤嘗試和修正過程——這正是人類寫作跟 AI 生成最大的差異。

### 2. 具體優先於抽象

用真實場景、程式碼、數據、錯誤訊息說話。少用空泛形容，多用可驗證的事實。

與其說「這個方法效能很好」，不如說「用這個方法後，回應時間從 800ms 降到 120ms」。

### 3. 個人經驗是骨架

文章要有「我」的存在感。讀起來是一個人在分享，不是教科書在授課。

AI 無法捏造個人經歷。遇到需要真實經驗支撐的段落，插入佔位符：

```html
<!-- TODO: 補充你實際遇到這個 bug 的情境 -->
<!-- TODO: 補充你選擇這個方案的理由和當時的考量 -->
```

佔位符要具體描述需要什麼類型的經驗，不要只寫「補充個人經驗」。

---

## Chinese Quality

### 語感

基於余光中〈怎樣改進英式中文〉：

- **主動句優先**：「他被懷疑偷東西」→「他有偷東西的嫌疑」
- **動詞要有力**：「進行研究」→「研究」；「作出貢獻」→「貢獻」
- **精簡「的」字**：能用「而」「且」替代的就替代；能省略的就省略
- **拒絕偽術語**：「具有很高的知名度」→「很有名」；「可讀性頗高」→「很好讀」

### 排版

基於 [chinese-copywriting-guidelines](https://github.com/sparanoid/chinese-copywriting-guidelines)：

- 中英文之間加一個半形空格：`在 LeanCloud 上`
- 中文與數字之間加一個半形空格：`花了 5000 元`
- 使用全形標點：。，、：；！？「」『』
- 正體中文引號用「」，巢狀用『』
- 專有名詞保持官方大小寫：GitHub、TypeScript、macOS
- 破折號用 `——`（兩個 U+2014），省略號用 `……`（兩個 U+2026）

### 節奏

- 長短句交替。不要每句都差不多長。
- 一個逗號斷句不超過 25 字。
- 段落長度要有變化。三段以上長度相近就該調整。

---

## Structure Philosophy

- 不強制「引言 → 本文 → 結論」三段式
- 可以從一個問題、一段經歷、一個觀察直接切入
- 章節服務於內容，不是為了視覺整齊
- 清單和表格只在真正適合的地方用，不是預設格式
```

- [ ] **Step 2: Verify file exists and content is correct**

```bash
cat ~/.claude/skills/blog-post/references/writing-style.md | head -5
```

Expected: 顯示檔案前 5 行，確認格式正確。

---

### Task 3: Create ai-guardrails.md

**Files:**
- Create: `~/.claude/skills/blog-post/references/ai-guardrails.md`

- [ ] **Step 1: Write the file**

```markdown
# AI Guardrails

## Core Directive

> 寫出來的文字，讀者不該察覺是 AI 寫的。

## Scope

- 程式碼區塊內的內容不受詞彙護欄約束
- 引用英文原文、error message 等非中文段落，不適用中文排版規則

---

## Vocabulary Guardrails

### English

**Tier 1 — 禁用（出現即改）：**

delve, tapestry, realm, beacon, embark, landscape（非地理用途）, testament, vibrant, intricate, pivotal, meticulous/meticulously, seamless/seamlessly, leverage（動詞）, harness, unlock, unleash, foster, underscore, showcase, groundbreaking, transformative, unprecedented, unparalleled, paradigm, synergy, treasure trove, game-changer, holistic, cutting-edge, ever-evolving

**Tier 2 — 警戒（有明確技術語境可用，否則替換）：**

comprehensive, robust, innovative, crucial, vital, critical, enhance, optimize, streamline, scalable, data-driven, intuitive, dynamic, compelling, noteworthy, multifaceted, nuanced

### 中文

**Tier 1 — 禁用：**

- AI 套話：「值得注意的是」「不可否認」「總結來說」「綜上所述」「眾所周知」「無疑地」「毫無疑問」「讓我們一起來看看」「在當今……的時代」
- 歐化句式：「被 X 所 Y」「基於這個原因」「具有很高的 Z 度」「它是重要的去……」
- 空洞收尾：「讓我們拭目以待」「期待未來更多的可能性」「相信在不久的將來」

**Tier 2 — 警戒（技術文脈可用，不該密集出現）：**

- 萬能動詞：「進行」「作出」「實現」「針對」
- 成語堆砌：單篇不超過 2 個成語
- 連接詞套路：「首先/其次/最後」「一方面/另一方面」

---

## Structure Guardrails

- **反均勻性**：句子長度和段落長度必須有明顯變化
- **反公式化**：禁止「首先/其次/最後」遞進套路；不需要每段都有主題句
- **反過度格式**：清單和表格只在真正適合的地方使用，不是預設呈現方式
- **反預告式開頭**：禁止「在這篇文章中，我們將探討……」式的開場

---

## Tone Guardrails

- **反諂媚**：禁止「Great question!」「這是一個很好的觀察」式語句
- **反對沖**：有觀點就表態；不要每個論點都「一方面……另一方面……」
- **反空洞正面**：不用 exciting / groundbreaking / game-changing 等無根據的正面形容
- **反過度禮貌**：不需要「感謝閱讀」「希望這篇文章對你有幫助」式收尾

---

## Self-Check

撰寫完成後，逐項執行：

1. **禁用詞掃描**：全文搜尋 Tier 1 禁用詞（中英文），有則替換
2. **節奏檢查**：連續三段以上長度相近 → 調整
3. **開頭檢查**：第一段是否直接進入內容（非預告或定義式開場）
4. **佔位符確認**：需要個人經驗的位置是否都標記了 `<!-- TODO -->`
5. **冗長句檢查**：找出單一子句超過 30 字且無逗號斷句的句子，拆分或改寫
```

- [ ] **Step 2: Verify file exists and content is correct**

```bash
cat ~/.claude/skills/blog-post/references/ai-guardrails.md | head -5
```

Expected: 顯示檔案前 5 行，確認格式正確。

---

### Task 4: Update SKILL.md Step 3

**Files:**
- Modify: `~/.claude/skills/blog-post/SKILL.md:59-61`

- [ ] **Step 1: Read current SKILL.md**

確認 Step 3 的現有內容。

- [ ] **Step 2: Add read instructions at the beginning of Step 3**

在 `### Step 3: Write Article` 之後、`Generate the full markdown article` 之前，插入：

```markdown
**Writing Style:** Before writing, read these reference files and follow them throughout:
1. `~/.claude/skills/blog-post/references/writing-style.md` — voice, principles, Chinese quality
2. `~/.claude/skills/blog-post/references/ai-guardrails.md` — vocabulary/structure/tone guardrails + self-check

```

- [ ] **Step 3: Verify the modification**

```bash
cat ~/.claude/skills/blog-post/SKILL.md
```

Expected: Step 3 開頭出現讀取指令，其餘 Step 1/2/4 不變。

- [ ] **Step 4: Commit all changes**

```bash
git add ~/.claude/skills/blog-post/references/writing-style.md
git add ~/.claude/skills/blog-post/references/ai-guardrails.md
git add ~/.claude/skills/blog-post/SKILL.md
git commit -m "feat(blog-post): add writing style guide and AI guardrails"
```
