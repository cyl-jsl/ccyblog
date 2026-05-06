---
title: "FFXIV Treasure Map Router"
description: "Final Fantasy XIV 藏寶圖路線規劃 Discord 機器人，自動計算最佳行進路線與跨區傳送策略。"
github: "https://github.com/cyl-jsl/ffxiv-map"
tech: ["Node.js", "TypeScript", "Discord.js", "Sharp", "Vitest"]
featured: true
order: 5
---

## 問題

FF14 的藏寶圖活動中，玩家需要在多個地圖間移動挖寶。手動規劃路線既費時又容易走冤枉路，尤其是涉及跨區傳送時，判斷最佳傳送點更加複雜。

## 方案

開發 Discord 機器人，輸入寶藏座標後自動規劃最佳路線：

- **路線演算法**：計算所有寶藏點的最優訪問順序，最小化總移動距離
- **跨區傳送邏輯**：自動判斷何時應使用傳送、傳送到哪個點最划算
- **覆寫規則系統**：針對特殊地形的手動路徑規則
- **圖像生成**：Sharp 繪製標註路線的地圖圖片
- **資料驅動**：JSON 定義地圖資料，無需資料庫

## 成果

- 比手動規劃平均節省 30%+ 移動時間
- 支援多張地圖的連續路線規劃
- 視覺化路線圖輸出，一目瞭然
- 完整測試覆蓋（Vitest）
