---
title: "從 MCP 到 Agent Skill——當「給 AI 接工具」不再是唯一解"
description: "用一個 Redmine 自動化專案的實作歷程，拆解 MCP 與 Agent Skill 兩種模式的取捨，以及社群正在發生的思維轉變。"
pubDate: 2026-03-16
category: "技術"
tags: ["Claude Code", "Agent Skill", "MCP", "Redmine", "AI Agent"]
draft: false
---

想讓 AI 幫忙登工時、查議題、建專案——這件事，第一反應是寫一個 MCP Server。

Redmine 有完整的 REST API，MCP 有標準的 tool definition 規格，看起來就是把 API endpoint 映射成 tool，加上認證，收工。

但我沒有走這條路。

原因很單純——省錢。每天用 AI 操作 Redmine，如果每次都要啟動 MCP Server、載入一整包 tool schema，那些 token 是實打實的成本。而且評估了一下，Redmine 的 API 結構並不複雜，至少對我自己的使用情境來說相對單純：登工時、查議題、偶爾建個子專案。這種量級的需求，真的需要一個完整的 MCP Server 嗎？

我決定試另一條路——只用 Skill 來指導 AI agent 操作 API，看看能走多遠。

這篇文章記錄的就是這段過程，途中踩過的坑，以及走完之後對 MCP 和 Skill 兩種模式逐漸清晰的理解。

## MCP 的繁榮，和繁榮底下的裂痕

MCP 在 2024 年底由 Anthropic 推出後，生態爆發式成長。到 2026 年初，非官方索引已收錄超過 16,000 個 MCP Server。數字很漂亮，但裡面藏著一個不太好看的事實：大量 Server 只是把現有 REST API 套上一層 JSON-RPC。

Jlowin 寫了一篇 [Stop Converting Your REST APIs to MCP](https://www.jlowin.dev/blog/stop-converting-rest-apis-to-mcp)，標題已經說完了。MCP 的設計意圖是 action-oriented RPC——面向動作的遠端呼叫，不是把 REST 的 resource-centric 思維原封不動搬過來。但實際上，多數人就是這樣做的。包括我原本打算做的 Redmine MCP。

然後是 context 的問題。

GitHub 官方 MCP 載入後，光是 tool schema 就吃掉數萬 token。Simon Willison [直接點出](https://simonwillison.net/2025/Oct/16/claude-skills/)：「加幾個 MCP 之後，留給 LLM 真正做事的空間已經不多了。」Perplexity CTO Denis Yarats 在 2026 年 3 月的 Ask 大會上走得更遠——宣布內部放棄 MCP，改回 API 和 CLI。理由很實際：tool definition 吃 context、認證機制笨重、大部分 MCP 功能根本用不到。

社群開始出現一個詞：**configuration complexity fatigue**。有人拿 Kubernetes 當年的複雜性蔓延來類比——協定本身不複雜，但圍繞它長出來的生態讓事情變複雜了。

這些批評不代表 MCP 沒用。MCP 在需要即時雙向通訊、多模型共享工具、標準化 transport 的場景下依然是正解。問題在於：不是每個場景都需要這些。

拿 Redmine 來說——我只有一個 agent（Claude Code），API 已經存在，操作需要的不是「連接」而是「判斷」。這時候 MCP 解決的是一個我根本沒有的問題。

## 思維的切換：不是接工具，是給知識

MCP 的思維是：幫 AI 打造一把錘子。定義 tool、寫 handler、管理 transport。

Skill 的思維不一樣。它問的問題是：AI 已經有手了（Bash、Read、Write），我怎麼教它什麼時候該用哪把錘子、力道多大、打哪裡？

這個區別看起來微妙，但在實作上差異巨大。

MCP 把每個操作封裝成 tool，tool schema 常駐在 context 裡，模型從中選擇呼叫。Skill 不封裝操作——它給模型一份操作手冊，模型讀完之後自己用現有工具組合出操作。

Simon Willison 抓到了 Skill 模式真正的殺手鐧：**progressive discovery**。不是一次把所有資訊灌進 context，而是先給最少量的入口資訊，需要時再載入細節。LLM 會自己跑 `cli-tool --help`，你不用花 token 把每個參數都描述一遍。

社群裡有人用了一個比喻，我覺得精準：

> Skill = competence（能力），MCP = clearance（授權）。你兩個都需要，但順序搞反了問題就來了。

對 redmine-skills 這個專案來說，啟示很明確：Redmine REST API 早就在那裡，我不需要用 MCP 把它重新描述一次。我需要的是告訴 AI——使用者說「登工時」的時候，去讀工時 API 文件，然後用 CLI 執行。

## 七次 commit 的真實演進

redmine-skills 不是一次設計到位的。它經歷了七次 commit，每一次改動背後都是踩到了具體的坑。

### Phase 1：骨架搭建

前四次 commit 建立了整個架構的骨幹。

從設計規格開始——先寫 `SKILL.md`，定義意圖路由表和操作原則。這是整個 Skill 的入口，只有 79 行。裡面最關鍵的是一張表：

| 使用者意圖 | 載入的 Reference |
|-----------|-----------------|
| 工時登打、查詢工時 | `references/api-time-entries.md` |
| 建立/查詢/更新議題 | `references/api-issues.md` |
| 專案、子專案、成員管理 | `references/api-projects.md` |
| 分頁處理、批次操作 | `references/api-common.md` |

一張路由表取代了二十個 MCP tool definition。AI 根據使用者意圖載入對應文件，不用的不載入。這就是 progressive discovery 在實踐中的樣子。

四份 reference 各自獨立：工時 120 行、議題 187 行、專案 169 行、通用 148 行。加上安裝指引和 README，骨架就這樣。

### Phase 2：安全轉折

第五次 commit（`499871d`）是整個專案最關鍵的改動。commit message 寫著：

```
security: add CLI wrapper, remove API key from conversation context
```

最初的做法很直覺——在 reference 裡寫 curl 範例，讓 AI 直接呼叫 API。能跑。但有一個問題：

**API Key 出現在對話上下文裡。**

老實說，一開始我沒太在意。反正只是在本機跑，也沒仔細評估 API Key 曝露在 AI agent 對話中會有什麼嚴重後果。

但後來公司遭遇了一次蠻嚴重的資安事件。

細節不能說，但那次事件讓所有人開始重新檢視「什麼東西存在哪裡」這個問題。所有 session 記錄都保留在本機——這件事本來覺得無所謂，現在看起來卻不一樣了。在這個時代，方便性和安全性之間的平衡，比想像中更難拿捏。

而且我打算把這個專案分享給公司同仁使用。一旦不只是自己在跑，API Key 曝露的問題就從「無所謂」升級成「一定要解決」。

解法是寫一個 CLI wrapper。188 行 Python，零外部依賴，只用標準函式庫：

```python
#!/usr/bin/env python3
"""Redmine API CLI — 安全封裝層"""
import json, os, sys, urllib.error, urllib.request
```

wrapper 做三件事：

**認證內部化**——自己讀 `~/.redmine.json`，在 process 記憶體裡組合認證 header。API Key 不出現在命令列（避免 shell history 洩漏），不出現在對話上下文（避免記錄洩漏）。

**回應淨化**——遞迴掃描 API 回應，把 `api_key`、`password`、`token`、`secret` 等欄位自動替換為 `[REDACTED]`。

**安全禁令**——`SKILL.md` 裡加上明確的規則：禁止用 Read 工具讀 `~/.redmine.json`，禁止用 cat 讀，禁止在對話中複述或推測 Key 內容。

MCP 社群也在頻繁討論認證問題——有人發現開發者用臨時的加密做法，導致不安全的 secret 向下傳播。Skill + CLI 的組合天然避開了這個坑：認證邏輯在 wrapper 裡，AI 碰不到。

### Phase 3：生產打磨

最後四次 commit 是在真實使用中磨出來的修正。

移除過度設計的 `chmod 600` 檔案權限檢查——在某些環境下反而導致錯誤。跨平台修正——Windows 上 `python3` 這個指令不存在。加入 stdin 支援——大段 JSON payload 不用塞在命令列參數裡。還有一個看似小但影響巨大的修正：強制 UTF-8 編碼。

```python
if hasattr(sys.stdout, "reconfigure"):
    sys.stdin.reconfigure(encoding="utf-8")
    sys.stdout.reconfigure(encoding="utf-8")
    sys.stderr.reconfigure(encoding="utf-8")
```

Windows 預設的 cp950 編碼讓中文回應全部變成亂碼。這三行解決了。

每一次 commit 都不是「最佳實踐」驅動的。是真的碰到問題，才改的。

## 設計解剖：為什麼這樣做

### 一個入口 + 四份文件，不是一個大檔案

把所有 API 細節塞進一個 SKILL.md 會超載 context。拆成四個獨立 Skill 又浪費 metadata 和路由成本。

折衷方案：一個 SKILL.md 當入口（79 行），帶一張路由表，按使用者意圖載入對應 reference。複合意圖時依序載入多份。AI 處理「幫我在專案 A 建一張議題，然後登 2 小時工時」這種請求時，先載入議題文件，再載入工時文件。不需要的永遠不載入。

### 三級安全分級——AI 自己判斷風險

```
✅ GET 操作：直接執行並回報
⚠️ 低風險寫入（POST/PUT 工時、更新議題狀態）：顯示摘要後執行
🔴 高風險（DELETE、建立/刪除專案）：等使用者明確確認
```

這不是 MCP 的 tool confirmation 機制。那是在協定層做的——每次呼叫都彈確認，或者全部自動通過，沒有中間地帶。

Skill 的做法不一樣。分級邏輯寫在操作手冊裡，AI 讀完之後自己判斷當前操作屬於哪一級。這給了 AI **判斷力**，不只是執行力。查工時不用問、登工時說一聲、刪專案等你點頭。

### 零依賴的 CLI wrapper

188 行 Python3，只用 `urllib`、`json`、`os`、`sys`。不需要 `pip install` 任何東西。支援四種呼叫模式：

```bash
# 直接查詢
python bin/redmine-api GET /users/current.json

# 帶 JSON payload
python bin/redmine-api POST /time_entries.json '{"time_entry":{...}}'

# 從 stdin 讀取大 payload
echo '{"..."}' | python bin/redmine-api POST /issues.json

# 上傳檔案
python bin/redmine-api upload /path/to/file.pdf
```

錯誤回傳是結構化的 JSON，帶中文訊息。AI 能直接解讀失敗原因，不需要使用者去猜 HTTP 401 是什麼意思。

## MCP 和 Skill 各自的位置

寫完這個專案之後，我不覺得 MCP 和 Skill 是競爭關係。但我確實覺得很多人——包括最初的我——把 MCP 用在了不需要它的地方。

| 面向 | MCP 適合 | Skill 適合 |
|------|---------|-----------|
| 連接模式 | 即時雙向通訊、多模型共用工具 | 單一 agent 深度操作 |
| API 狀態 | 需要新建工具介面 | 已有 CLI 或 REST 可用 |
| 決策密度 | 參數明確、直接呼叫 | 需要情境判斷和風險分級 |
| Context 成本 | 所有 tool schema 常駐 | 按需載入 reference |
| 認證處理 | 協定層管理（仍在演進中） | CLI 封裝，天然隔離 |

兩者可以疊加。Skill 負責策略編排，MCP 提供底層連接。但對「已有 REST API，想讓單一 agent 操作」這類場景——也就是 16,000 個 MCP Server 裡很大一部分在做的事——Skill + CLI 是更輕、更省 context、更好維護的選擇。

redmine-skills 全部 1024 行，零外部依賴，macOS、Linux、Windows 通用。同樣的功能用 MCP 實作，光是 transport 層和 tool definition 的程式碼量就不止這個數。

## 給想做類似事情的人

一個可以直接用的判斷框架：

- **你的 API 已有 CLI 或 REST endpoint？** 先考慮 Skill。不要為了 MCP 而 MCP。
- **需要多個 AI 模型共用同一組工具？** 這是 MCP 的主場。標準協定的價值在於通用性。
- **操作需要情境判斷，不只是呼叫？** Skill 的路由表 + reference 模式讓 AI 帶著判斷力執行。
- **兩個都需要？** Skill 當大腦，MCP 當手腳。

現在我每天下班前的流程是這樣的：開一個 Claude Code 的 agent 窗口，請 AI 總結今天所有的 session 記錄，然後根據內容登打工時。整個過程不到兩分鐘，以前手動操作 Redmine 網頁至少要花十分鐘以上——回想今天做了什麼、分配時數、填欄位、選活動類型。現在這些判斷 AI 都能處理。

有個同事聽了之後說，他想要 AI 監控他的螢幕，下班自動把工時打上去。我笑了一下，但也沒辦法馬上否定這個想法。這條路走下去，終點在哪裡還真不好說。

回頭看，最初想寫 MCP 的衝動來自一個假設：讓 AI 操作外部系統，就得給它一個標準化的工具介面。這個假設在某些場景下成立，但不是所有場景。有時候 AI 需要的不是更多工具，而是更好的判斷。

---

*本文提到的 [redmine-skills](https://github.com/ccy/redmine-skills) 專案已開源。*

**延伸閱讀：**
- [Stop Converting Your REST APIs to MCP](https://www.jlowin.dev/blog/stop-converting-rest-apis-to-mcp) — Jlowin
- [Claude Skills are awesome, maybe a bigger deal than MCP](https://simonwillison.net/2025/Oct/16/claude-skills/) — Simon Willison
- [MCP vs Agent Skills: Why They're Different, Not Competing](https://dev.to/phil-whittaker/mcp-vs-agent-skills-why-theyre-different-not-competing-2bc1) — Phil Whittaker
- [Skills explained: How Skills compares to prompts, Projects, MCP, and subagents](https://claude.com/blog/skills-explained) — Claude Blog
