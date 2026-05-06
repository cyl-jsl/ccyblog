---
title: "Chain Chains"
description: "多鏈加密資產投資組合追蹤儀表板，即時監控跨鏈錢包資產分佈與代幣組合。"
github: "https://github.com/cyl-jsl/chain_chains"
image: "/project-covers/chain-chains.svg"
tech:
  [
    "Next.js 15",
    "React 19",
    "TypeScript",
    "Tailwind CSS 4",
    "Zustand",
    "SWR",
    "IndexedDB",
  ]
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
