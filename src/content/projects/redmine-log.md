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
