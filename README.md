# 塔罗 ✦ Tarot(Android)

一款用 React Native 构建的塔罗牌占卜 Android 应用。

> 让直觉为你揭晓答案

## ✨ 功能特性

- **78 张全牌库**:完整大阿卡纳(22)+小阿卡纳(56,权杖/圣杯/宝剑/星币各 14 张)
- **正逆位解读**:每张牌都有正位与逆位关键词、释义
- **两种牌阵**:
  - 单牌指引(快速问答)
  - 三牌阵(过去·现在·未来)
- **洗牌 + 翻牌动画**:Reanimated 驱动的流畅动画
- **震动反馈**:haptic-feedback 增加仪式感
- **本地历史记录**:AsyncStorage 持久化,最多 500 条
- **程序化牌面**:牌图由 React Native 视图渲染(深紫金主题),无外部图片依赖

## 🛠️ 技术栈

| 层 | 选型 |
|---|---|
| 框架 | React Native 0.85 + TypeScript (strict) |
| 导航 | React Navigation v7 (Stack + Bottom Tabs) |
| 状态 | Zustand 5 + persist 中间件 |
| 存储 | @react-native-async-storage/async-storage 3 |
| 动画 | react-native-reanimated 4 + worklets |
| 手势 | react-native-gesture-handler 3 |
| 触感 | react-native-haptic-feedback 3 |
| ID | nanoid 5 |

## 📁 目录结构

```
src/
├── components/     复用组件 (CardView, CardBack, ShuffleDeck, SpreadLayout, HistoryItem)
├── screens/        4 个页面 (Home, Reading, History, HistoryDetail)
├── navigation/     根导航
├── store/          Zustand 历史 store
├── data/           78 张牌元数据 + 牌阵定义
├── types/          全局类型
├── theme/          颜色 / 间距 / 字号
└── utils/          shuffle, uuid
```

## 🚀 运行

### 环境要求
- Node ≥ 22.11
- JDK 17
- Android SDK Platform 36 + Build Tools 36 + NDK 27.1

### 步骤

```bash
# 1. 安装依赖
npm install

# 2. 启动 Metro(开发模式)
npm start

# 3. 在另一个终端构建并安装到设备/模拟器
npm run android
```

或直接出 APK:

```bash
cd android
./gradlew assembleDebug
# 产物: android/app/build/outputs/apk/debug/app-debug.apk
```

## 📜 牌库版权说明

本应用的 78 张牌**元数据**(名称、关键词、解读)为原创中文翻译与释义。**牌面图像采用程序化渲染**(React Native 视图),不依赖任何外部塔罗牌图。

如需切换为传统 Rider-Waite-Smith 牌图(1909,公共领域),可:
1. 运行 `node scripts/fetch-cards.mjs`(从 Wikimedia Commons 自动拉取,需网络通畅)
2. 在 `src/components/CardView.tsx` 中启用 `<Image source={card.image} />` 替换当前 JSX

## 🚧 不在 MVP 范围(后续可加)

- AI 解读(接 LLM API 生成个性化解读)
- 多语言
- 自定义牌阵
- 分享到社交(图片导出)
- 云同步历史
- 每日一卡推送
- 暗色/亮色主题切换
- 音效

## 📄 License

MIT
