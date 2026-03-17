---
title: "Redmine Skills"
description: "Claude Code Agent Skill，讓 AI 透過自然語言操作 Redmine REST API——工時登打、議題管理、專案建置。"
github: "https://github.com/ccy/redmine-skills"
tech: ["Python", "Claude Agent Skill", "Redmine REST API"]
featured: true
order: 5
---

## 問題

Redmine 操作繁瑣——工時登打要找議題、選活動類型、填時數；議題管理要在網頁間來回切換。即使用 CLI 工具，仍需記指令格式和參數。

## 方案

設計一個 Claude Code Agent Skill，讓 AI 理解自然語言並直接操作 Redmine API：

- **意圖路由**：AI 根據使用者意圖按需載入對應 API reference，不浪費 context
- **安全分級**：GET 直接執行、低風險 PUT 摘要後執行、工時與 DELETE 需使用者確認
- **零接觸憑證**：API Key 透過 CLI wrapper 內部處理，永不出現在對話中
- **批次驗證**：批次寫入後自動查詢確認結果正確
- **跨 process 限流**：連續請求間隔至少 0.5 秒，防止觸發伺服器速率限制

## 成果

- 用自然語言完成所有 Redmine 操作——「幫我登今天 4 小時開發在 #1234」
- 安全設計：回應淨化、強制 HTTPS、DELETE 互動確認、可選審計日誌
- 模組化架構：新增 API 操作只需加一個 reference 檔案和路由表一行
