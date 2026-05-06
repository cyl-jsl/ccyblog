---
title: "Redmine Skills"
description: "Claude Code Agent Skill，讓 AI 透過自然語言操作 Redmine REST API——工時登打、議題管理、專案建置。"
github: "https://github.com/cyl-jsl/redmine-skills"
image: "/project-covers/redmine-skills.svg"
tech: ["Python", "Claude Agent Skill", "Redmine REST API"]
featured: true
order: 3
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

- 把高摩擦的 Redmine REST API 操作重新包成自然語言工作流，展示我在內部工具、workflow automation 與企業整合上的產品化能力
- 不把 AI 當成直接執行的黑盒，而是加入風險分級、確認流程與批次驗證，把可靠性與治理一起納入設計
- 用 reference routing 控制 context 成本，再以 wrapper 隔離憑證與請求細節，讓 Skill 在可維護的前提下持續擴充 API surface
- 這個專案重點不只是「可以呼叫 Redmine」，而是把 AI tooling、安全邊界與系統整合做成一個可長期維護的工作流介面
