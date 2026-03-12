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
