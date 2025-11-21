# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

ABC Learning Game - 互動式字母學習應用,使用 Vue 3 + Vite 建構。兒童可透過視覺圖像、文字提示和語音朗讀學習字母,並透過小遊戲強化記憶。

## Development Commands

```bash
# 啟動開發伺服器
npm run dev

# 建構生產版本
npm run build

# 預覽建構結果
npm run preview
```

## Architecture

### Component Hierarchy

```
App.vue (root)
├── LetterGrid.vue - 字母卡片網格視圖
│   └── LetterCard.vue - 單一字母卡片 (可點擊)
└── DetailView.vue - 字母詳細視圖
```

### State Management

採用 Vue 3 Composition API 的 ref/computed 管理狀態,未使用 Vuex 或 Pinia:

- `App.vue` 管理全域狀態:
  - `currentView`: 'grid' | 'detail' - 視圖切換
  - `selectedLetter`: 當前選中的字母物件

### Data Structure

字母資料集中管理於 `src/data/alphabet.js`:

```javascript
{
  letter: String,   // 大寫字母
  word: String,     // 關聯單字
  image: String,    // 圖片路徑 (import 或 placeholder)
  color: String     // 卡片背景色 (hex)
}
```

目前僅 A-G 有實際圖片資源 (`src/assets/images/`),其餘使用 SVG placeholder。

### Key Features

1. **LetterCard 互動**:
   - 點擊卡片觸發 `@select` 事件傳遞至 LetterGrid → App
   - App 更新 `selectedLetter` 並切換至 DetailView

2. **DetailView 雙模式**:
   - **Normal Mode**: 顯示大字母、圖片、單字。點擊任意處觸發 Web Speech API 朗讀
   - **Game Mode**: "找出對應字母" 遊戲,從 4 個選項中選擇正確圖片
   - 使用 Web Audio API 產生 success/error 音效 (非播放音檔)

3. **Speech Synthesis**:
   - `speakWord()` 使用 `window.speechSynthesis` 朗讀單字
   - 自動在進入 DetailView 時觸發 (500ms delay)
   - 監聽 `props.item` 變化以支援 Next Letter 功能

4. **Audio Feedback**:
   - `playSound(type)`: 使用 AudioContext + Oscillator 產生音效
   - 無外部音訊檔案依賴

### View Transitions

使用 Vue `<transition name="fade">` 處理 LetterGrid ↔ DetailView 切換,DetailView 為 `position: fixed` 全螢幕覆蓋。

### Styling Conventions

- CSS 變數定義於 `src/style.css`
- 各組件使用 `scoped` 樣式避免污染
- 響應式設計透過 `@media (max-width: 600px)` 調整字型與佈局
- 動畫: `@keyframes popIn/slideDown` 提升互動體驗

### Important Implementation Notes

- 所有圖片透過 Vite 的 ES module import 載入 (不使用 public 目錄)
- 不需要 router,純靠條件渲染切換視圖
- 未使用 TypeScript,純 JavaScript + Vue SFC
- 未配置測試框架
- 無後端 API 整合,純靜態前端應用
