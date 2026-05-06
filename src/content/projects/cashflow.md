---
title: "Cashflow"
description: "本地運行的個人金流管理工具，回答「我還有多少錢可以動」，支援信用卡帳單、分期追蹤、現金流預測與 AI Agent 自然語言介面。"
github: "https://github.com/cyl-jsl/cashflow-release"
image: "/project-covers/cashflow.svg"
tech:
  [
    "FastAPI",
    "SQLite",
    "SQLAlchemy",
    "React",
    "TypeScript",
    "Vite",
    "Tailwind CSS",
    "TanStack Query",
  ]
featured: true
order: 1
---

## 問題

每個月繳卡費前都要把銀行帳戶、現金、信用卡帳單逐一拿出來算，才能知道自己到底有多少錢可以動。台灣信用卡的結帳日、繳費日、消費分期、帳單分期、循環利息——這些東西沒有任何現成工具能完整處理。

## 方案

打造一個本地運行的前瞻性現金流引擎，核心回答三個問題：我現在能動多少錢？月底會剩多少？我想花 X 元，可行嗎？

- **帳戶管理**：銀行、現金、多帳戶餘額追蹤，過期餘額警示
- **收支預測**：週期性收入和固定支出自動推進，可動用金額即時計算
- **信用卡完整生命週期**：結帳日/繳費日、消費分期、帳單分期、循環利息、結轉
- **規劃工具**：消費可行性試算、儲蓄目標評估、情境模擬比較
- **AI Agent 介面**：Claude Code Skill 作為自然語言操作層，直接對話查詢和管理金流
- **API-first 架構**：前後端完全解耦，REST API 獨立可用

## 成果

- 72 小時內從設計文件到公開發布，累積 126 commits，展示從需求收斂、系統設計到實作交付的完整節奏
- 在進入開發前先做 6 輪設計審查，把帳務規則、信用卡生命週期與資料模型先講清楚，降低後期返工風險
- 以整數（分）建模所有金額，並把結帳日、繳費日、分期與利息拆成明確的領域邏輯，處理一般記帳工具常忽略的複雜邊界
- 採 API-first 前後端分離架構，搭配 SQLite WAL mode，兼顧低維運成本、資料可靠性與後續擴充空間
- [開發紀實](/blog/cashflow-72-hours) ｜ [技術深潛](/blog/cashflow-installment-snapshot)
