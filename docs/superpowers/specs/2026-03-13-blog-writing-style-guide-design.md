# Blog Writing Style Guide — Design Spec

## 背景

ccyblog 的 blog-post skill 有完整的發文工作流程（發想 → 大綱 → 撰寫 → 部署），但缺少寫作風格指引。AI 自由發揮時會產生典型的「AI 感」文字——用詞空泛、結構公式化、語氣諂媚、中文歐化。

## 目標

為 blog-post skill 新增寫作風格參考資料，讓 AI 在撰寫階段（Step 3）能產出接近人類寫作品質的中文技術文章。

## 非目標

- 不建立獨立的 writing-style skill（這些指引專為 blog-post 服務）
- 不改動 blog-post skill 的工作流程（Step 1/2/4 不動）
- 不追求完全消除 AI 感（最終仍需人工校潤）

---

## 架構設計

### 檔案結構

```
~/.claude/skills/blog-post/
├── SKILL.md                    ← 現有，僅修改 Step 3
└── references/
    ├── writing-style.md        ← 核心風格原則
    └── ai-guardrails.md        ← AI 護欄與自檢
```

### 載入機制

- **Progressive Disclosure**：SKILL.md 在 session 啟動時以 metadata 預載；references/ 僅在 Step 3 撰寫時才讀取
- **SKILL.md 改動範圍**：只在 Step 3 開頭加入讀取指令，其餘不動

### SKILL.md Step 3 新增內容

```markdown
撰寫前，先讀取以下參考資料：
1. ~/.claude/skills/blog-post/references/writing-style.md（寫作風格原則）
2. ~/.claude/skills/blog-post/references/ai-guardrails.md（AI 護欄與自檢）
依據這兩份指引撰寫全文。
```

---

## writing-style.md 設計

### 模組結構

```
## Voice Profile
## Writing Principles
## Chinese Quality
## Structure Philosophy
```

### Voice Profile

依文章類型定義語氣：

| 類型 | category 值 | 語氣定位 | 參考對象 |
|------|------------|---------|---------|
| 技術文 | `技術` | 專業但親切，用「你」對話，有深度但不故作高深 | Dan Abramov (overreacted.io) |
| 日誌文 | `日誌` | 像跟同事聊天，分享真實經歷與感受 | Julia Evans (jvns.ca) |

未來新增文類時，在此表格 append 一行即可。

**Fallback**：遇到表格中未定義的 category 時，預設採用「技術文」的語氣，但仍遵守所有寫作原則與護欄。

### Writing Principles

三個核心原則（原則導向，非規則窮舉）：

1. **展示思考過程，不只呈現結論**
   - 帶讀者走一遍「為什麼」和「怎麼想到的」
   - 可以展示錯誤嘗試和修正過程

2. **具體優先於抽象**
   - 用真實場景、程式碼、數據、錯誤訊息說話
   - 少用空泛形容，多用可驗證的事實

3. **個人經驗是骨架**
   - 文章要有「我」的存在感，讀起來是一個人在分享
   - AI 無法捏造的部分，使用 `<!-- TODO: 補充個人經驗 -->` 佔位符
   - 佔位符應描述需要什麼類型的經驗（例如 `<!-- TODO: 補充你實際遇到這個 bug 的情境 -->`）

### Chinese Quality

三個子模組：

**語感**（基於余光中〈怎樣改進英式中文〉）：
- 避免被動句濫用：「被 X 所 Y」→ 改用主動句
- 避免萬能動詞+抽象名詞：「進行研究」→「研究」；「作出貢獻」→「貢獻」
- 避免「的」字濫用：能用「而」「且」「之」替代的就替代
- 避免偽術語：「具有很高的知名度」→「很有名」

**排版**（基於 chinese-copywriting-guidelines）：
- 中英文之間加一個半形空格
- 中文與數字之間加一個半形空格
- 使用全形標點（。，、：；！？「」）
- 正體中文引號用「」和『』
- 專有名詞保持官方大小寫（GitHub 非 github）
- 破折號用 `——`（兩個），省略號用 `……`（兩個）

**節奏**：
- 長短句交替，避免每句都差不多長
- 一個逗號斷句不超過 25 字
- 段落長度要有變化——不是每段都三行

### Structure Philosophy

- 不強制「引言→本文→結論」三段式
- 可以從一個問題、一段經歷、一個觀察直接切入
- 章節服務於內容，不是為了視覺整齊
- 不是所有東西都要做成清單或表格

---

## ai-guardrails.md 設計

### 模組結構

```
## Core Directive
## Vocabulary Guardrails
## Structure Guardrails
## Tone Guardrails
## Self-Check
```

### Core Directive

一句話總綱：

> 寫出來的文字，讀者不該察覺是 AI 寫的。

### Scope

- 程式碼區塊（code block）內的內容不受詞彙護欄約束
- 引用英文原文、error message 等非中文段落，不適用中文排版規則

### Vocabulary Guardrails

#### English

**Tier 1 — 禁用（出現即改）：**
delve, tapestry, realm, beacon, embark, landscape（非地理用途）, testament, vibrant, intricate, pivotal, meticulous/meticulously, seamless/seamlessly, leverage（動詞）, harness, unlock, unleash, foster, underscore, showcase, groundbreaking, transformative, unprecedented, unparalleled, paradigm, synergy, treasure trove, game-changer, holistic, cutting-edge, ever-evolving

**Tier 2 — 警戒（有明確技術語境可用，否則替換）：**
comprehensive, robust, innovative, crucial, vital, critical, enhance, optimize, streamline, scalable, data-driven, intuitive, dynamic, compelling, noteworthy, multifaceted, nuanced

#### 中文

**Tier 1 — 禁用：**
- AI 套話：「值得注意的是」「不可否認」「總結來說」「綜上所述」「眾所周知」「無疑地」「毫無疑問」「讓我們一起來看看」「在當今...的時代」
- 歐化句式：「被 X 所 Y」「基於這個原因」「具有很高的 Z 度」「它是重要的去...」
- 空洞收尾：「讓我們拭目以待」「期待未來更多的可能性」「相信在不久的將來」

**Tier 2 — 警戒（技術文脈可用，但不該密集出現）：**
- 萬能動詞：「進行」「作出」「實現」「針對」
- 成語堆砌：單篇不該出現超過 2 個成語
- 連接詞套路：「首先/其次/最後」「一方面/另一方面」

### Structure Guardrails

- **反均勻性**：句子長度和段落長度必須有明顯變化
- **反公式化**：禁止「首先/其次/最後」遞進套路；不需要每段都有主題句
- **反過度格式**：清單和表格只在真正適合的地方使用，不是預設呈現方式
- **反預告式開頭**：禁止「在這篇文章中，我們將探討...」式的開場

### Tone Guardrails

- **反諂媚**：禁止「Great question!」「這是一個很好的觀察」式語句
- **反對沖**：有觀點就表態；不要每個論點都「一方面...另一方面...」
- **反空洞正面**：不用 exciting / groundbreaking / game-changing 等無根據的正面形容
- **反過度禮貌**：不需要「感謝閱讀」「希望這篇文章對你有幫助」式收尾

### Self-Check

撰寫完成後，執行以下自檢：

1. **禁用詞掃描**：全文搜尋 Tier 1 禁用詞，有則替換
2. **節奏檢查**：連續三段以上長度相近→調整
3. **開頭檢查**：第一段是否直接進入內容（非預告或定義式開場）
4. **佔位符確認**：需要個人經驗的位置是否都標記了 `<!-- TODO -->`
5. **冗長句檢查**：找出單一子句超過 30 字且無逗號斷句的句子，拆分或改寫

---

## 模組化與擴充性

### 新增文類

在 writing-style.md 的 Voice Profile 表格新增一行即可，其餘模組不受影響。

### 新增禁用詞

在 ai-guardrails.md 對應的 Tier 下 append，不影響其他模組。

### 替換中文排版規範

替換 writing-style.md 的 Chinese Quality > 排版 子區塊，其餘不動。

### 新增寫作原則

在 writing-style.md 的 Writing Principles append，編號順延。

---

## 實作範圍

1. 建立 `~/.claude/skills/blog-post/references/` 目錄
2. 撰寫 `references/writing-style.md`
3. 撰寫 `references/ai-guardrails.md`
4. 修改 `SKILL.md` Step 3，加入讀取指令
