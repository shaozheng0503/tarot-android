# ✦ 塔罗 Tarot(Android)

> 一款用 React Native 构建的中文塔罗牌占卜 Android 应用

![React Native](https://img.shields.io/badge/React_Native-0.85-61dafb?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8_strict-3178c6?logo=typescript&logoColor=white)
![Platform](https://img.shields.io/badge/Platform-Android-3ddc84?logo=android&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-yellow)
![Status](https://img.shields.io/badge/Status-MCP-success)

让直觉为你揭晓答案。

---

## 📑 目录

- [✨ 功能特性](#-功能特性)
- [📱 截图](#-截图)
- [🛠️ 技术栈](#-技术栈)
- [📁 项目结构](#-项目结构)
- [🏛️ 架构设计](#-架构设计)
- [🚀 快速开始](#-快速开始)
- [🧪 开发指南](#-开发指南)
- [📜 牌库版权](#-牌库版权)
- [🗺️ 路线图](#-路线图)
- [🤝 贡献](#-贡献)
- [📄 License](#-license)

---

## ✨ 功能特性

- **78 张全牌库** · 完整大阿卡纳(22)+小阿卡纳(56)
  - 权杖(火)/ 圣杯(水)/ 宝剑(风)/ 星币(土)各 14 张
- **正逆位解读** · 每张牌都有正位 + 逆位的关键词与释义(逆位概率 30%,贴近传统)
- **元素与占星对应** · 每张牌标注四元素(火/水/风/土);大阿卡纳标注行星/星座(Golden Dawn 体系)
- **六种牌阵**
  - **单牌指引** — 快速问答,获得当下的指引
  - **三牌阵** — 过去 · 现在 · 未来
  - **关系之镜** — 你 · 对方 · 关系
  - **现状·阻碍·建议** — 解决具体难题
  - **五牌星形** — 现状/挑战/行动/外部影响/结果
  - **凯尔特十字** — 经典 10 张牌深度牌阵
- **一键复制 / 分享解读** · 把问题、牌阵、每张牌的位置/正逆位/元素/关键词/释义整理成结构化文本,直接粘贴给任意 AI 做深度解读(无需截图 OCR)
- **每日一卡** · 首页「今日运势」,按日期确定性抽牌,同一天结果固定,自动归档到历史
- **牌库图鉴** · 独立 Tab,按大阿卡纳 + 四花色浏览全部 78 张牌,单卡详情含正逆位完整释义,可单独复制
- **无障碍友好**
  - 牌面带 `accessibilityLabel`,读屏软件可朗读牌名/正逆位/元素
  - 尊重系统「减少动效」设置,自动关闭翻牌/呼吸等动画
  - 渲染异常有 ErrorBoundary 兜底,不会整屏白屏
- **仪式感交互**
  - 洗牌动画(Reanimated 4 驱动,1.5s)
  - 逐张翻牌瀑布(随牌数自适应间隔)
  - 震动反馈(Haptic Feedback)
- **本地历史记录**
  - 每次抽牌自动保存
  - 最多保留 500 条
  - 长按删除单条 / 一键清空
- **经典 RWS 牌面**
  - 78 张 Rider-Waite-Smith 真实牌图(350×600,~7.4MB)
  - 逆位自动旋转 180° 呈现
  - 缺图时回退到程序化牌面(花色 pip 点阵 + 占星符号),永不开天窗
- **复制自带引导 Prompt**
  - 复制/分享的文本开头自带塔罗师角色 prompt,粘进任意 AI 直接出高质量解读

---

## 📱 截图

> 启动 app 后可见主界面:

```
┌─────────────────────────────┐
│                             │
│       ✦ 塔 罗 ✦             │
│     让直觉为你揭晓答案        │
│                             │
│  ─── 想了解的事情(可选)───  │
│  ┌─────────────────────────┐│
│  │ 默念你的问题...           ││
│  └─────────────────────────┘│
│                             │
│  ─── 选择牌阵 ───           │
│  ┌─────────────────────────┐│
│  │ 单牌指引           1 张  ││
│  │ 从牌组中抽取一张牌...     ││
│  │                    开始 →││
│  └─────────────────────────┘│
│  ┌─────────────────────────┐│
│  │ 三牌阵(过去·现在·未来) 3 张││
│  │ 三张牌分别代表过去...     ││
│  │                    开始 →││
│  └─────────────────────────┘│
│                             │
│    ✦ 占卜  ❖ 图鉴  ⏳ 历史   │
└─────────────────────────────┘
```

> 抽牌界面(单牌示例):

```
┌─────────────────────────────┐
│       单牌指引              │
│   "我最近的工作会顺利吗?"    │
│                             │
│       ✦ 解读 ✦             │
│                             │
│         ┌───────┐           │
│         │  ☉    │           │
│         │ 太阳  │           │
│         │       │           │
│         │   ☉   │           │
│         │ 19    │           │
│         │  ✦正位✦│          │
│         └───────┘           │
│                             │
│  太阳                       │
│  ✦ 成功  ✦ 快乐  ✦ 活力     │
│  光明、喜悦与成功,事情清晰...  │
│                             │
│  [   再抽一次  ]  [ 返回首页] │
│                             │
│     ✦ 已自动保存到历史 ✦     │
└─────────────────────────────┘
```

---

## 🛠️ 技术栈

| 层 | 选型 | 版本 | 说明 |
|---|---|---|---|
| **框架** | React Native | 0.85.3 | 跨平台原生 |
| **语言** | TypeScript | 5.8 (strict) | 类型安全 |
| **导航** | React Navigation | v7 | Stack + Bottom Tabs |
| **状态** | Zustand | 5 | 轻量,API 简洁 |
| **持久化** | AsyncStorage | 3 | 历史记录 |
| **动画** | Reanimated | 4 + worklets | 60fps 流畅 |
| **手势** | Gesture Handler | 3 | RN 标准 |
| **触感** | Haptic Feedback | 3 | 抽牌震动 |
| **ID 生成** | nanoid | 5 | 短 ID,无 native |
| **构建** | Gradle | 9.3.1 | Android 构建 |
| **SDK** | compileSdk | 36 | minSdk 24 |

---

## 📁 项目结构

```
tarot-android/
├── android/                  # 原生 Android 工程(由 RN 模板生成)
├── ios/                      # iOS 工程(本项目不交付,已在 .gitignore)
├── assets/
│   └── cards/                # 牌图占位(当前用程序化渲染,无外部资源)
│       ├── major/            # 大阿卡纳
│       └── minor/            # 小阿卡纳
│           ├── wands/
│           ├── cups/
│           ├── swords/
│           └── pentacles/
├── scripts/
│   └── fetch-cards.mjs       # 拉取 Rider-Waite 公共领域牌图的脚本(可选)
├── src/
│   ├── components/           # 复用 UI 组件
│   │   ├── CardView.tsx      # 单张牌面(支持翻牌/正逆位/大小)
│   │   ├── CardBack.tsx      # 牌背
│   │   ├── ShuffleDeck.tsx   # 洗牌动画(Reanimated)
│   │   ├── SpreadLayout.tsx  # 牌阵布局(单/三)
│   │   └── HistoryItem.tsx   # 历史条目
│   ├── screens/              # 4 个页面
│   │   ├── HomeScreen.tsx
│   │   ├── ReadingScreen.tsx
│   │   ├── HistoryScreen.tsx
│   │   └── HistoryDetailScreen.tsx
│   ├── navigation/
│   │   └── RootNavigator.tsx # 根导航(Stack + Tabs)
│   ├── store/
│   │   └── useHistoryStore.ts # Zustand 历史状态
│   ├── data/
│   │   ├── cards.ts          # 78 张牌元数据(中文名/关键词/解读)
│   │   └── spreads.ts        # 牌阵定义
│   ├── types/
│   │   └── index.ts          # 全局类型
│   ├── theme/
│   │   └── colors.ts         # 紫黑金主题色 + 间距 + 字号
│   └── utils/
│       ├── shuffle.ts        # Fisher-Yates 洗牌 + 抽牌
│       └── uuid.ts           # nanoid 包装
├── App.tsx                   # 根组件
├── index.js                  # 入口(顶部 import gesture-handler)
├── package.json
├── tsconfig.json
├── babel.config.js           # 含 worklets/plugin
└── metro.config.js
```

---

## 🏛️ 架构设计

### 数据流

```
┌──────────────┐
│  HomeScreen  │ 选择牌阵 + 输入问题
└──────┬───────┘
       │ navigate('Reading', { spreadType, question })
       ▼
┌──────────────┐
│ ReadingScreen│ ① startReading() → drawCards(78 张, n 张)
│              │ ② phase: shuffling → 显示 ShuffleDeck 动画
│              │ ③ 1.5s 后 → phase: revealing → 逐张 setFaceUp
│              │ ④ phase: done → 显示解读 + 自动保存
└──────┬───────┘
       │ addEntry({ id, timestamp, spreadType, question, cards })
       ▼
┌──────────────────┐
│ useHistoryStore  │ Zustand + AsyncStorage
│ (persist)        │ key: 'tarot-history-v1'
└──────┬───────────┘
       │ 自动反应
       ▼
┌──────────────┐
│HistoryScreen │ 列出所有历史 → 点击进入
└──────┬───────┘
       │ navigate('HistoryDetail', { entryId })
       ▼
┌───────────────────┐
│HistoryDetailScreen│ 复盘历史牌面 + 解读
└───────────────────┘
```

### 关键设计决策

- **为什么用 Zustand 而不用 Redux?** MVP 阶段状态很简单(一个 history 数组),Zustand 3 行代码搞定,Redux 需要 actions / reducers / store / Provider 一堆样板。
- **为什么用 AsyncStorage 而不是 SQLite?** MVP 阶段数据量小(最多 500 条),JSON 序列化 + AsyncStorage 性能足够,且无 native 依赖。
- **为什么牌面用程序化渲染?** 体积小、零外部依赖、不会因为图源失效而坏掉。后续如需切到 Rider-Waite 真图,只需在 `CardView.tsx` 加个 `<Image source={card.image} />` 分支。
- **为什么用 Reanimated 4?** 4.0 把 worklets 拆成了独立包,启动更快,API 更清晰。

### 抽牌算法

```typescript
// Fisher-Yates 洗牌 → 抽 N 张 → 每张独立判定正逆位
function drawCards(deck, count, positions) {
  return shuffle(deck).slice(0, count).map((card, idx) => ({
    cardId: card.id,
    orientation: Math.random() < 0.5 ? 'upright' : 'reversed',
    position: positions?.[idx],
  }));
}
```

逆位概率固定 50%,符合塔罗传统(虽然真实占卜中逆位概率通常视为 30-50% 区间)。

---

## 🚀 快速开始

### 1. 环境要求

| 工具 | 版本 |
|---|---|
| Node | ≥ 22.11 |
| JDK | 17 |
| Android SDK | Platform 36 + Build Tools 36 |
| NDK | 27.1.12297006 |
| Xcode(可选) | 16+(本项目不交付 iOS) |

### 2. 安装

```bash
git clone https://github.com/shaozheng0503/tarot-android.git
cd tarot-android
npm install
```

### 3. 启动 Metro(开发服务)

```bash
npm start
```

### 4. 构建并安装到设备

新开一个终端:

```bash
npm run android
# 等同于: npx react-native run-android
```

会触发 `gradlew installDebug`,自动构建并安装到连接的设备/模拟器。

### 5. 仅构建 APK

```bash
cd android
./gradlew assembleDebug
# 产物: android/app/build/outputs/apk/debug/app-debug.apk
```

### 6. 安装 APK 到设备

```bash
adb install android/app/build/outputs/apk/debug/app-debug.apk
```

### 7. 常见问题

**Q: `gradle` 第一次跑巨慢,正常吗?**
A: 正常。首次会下载 Gradle 9.3.1(约 100MB)+ 所有依赖,5-15 分钟不等。后续增量构建会快很多。

**Q: `Could not find tools.jar` 错误?**
A: 安装 JDK 17 并设置 `JAVA_HOME`:
```bash
export JAVA_HOME="/opt/homebrew/opt/openjdk@17"
export PATH="$JAVA_HOME/bin:$PATH"
```

**Q: `SDK location not found`?**
A: 在 `android/local.properties` 写入 SDK 路径(注意此文件已在 .gitignore):
```properties
sdk.dir=/Users/yourname/Library/Android/sdk
```

**Q: 模拟器连接不上?**
A: 确认 `adb devices` 能看到设备。如使用物理机,需开启 USB 调试并允许。

---

## 🧪 开发指南

### 添加新牌

在 `src/data/cards.ts` 追加:

```typescript
{
  id: 'major-22',  // 唯一 id
  number: 22,      // 大阿卡纳 0-21,小阿卡纳 1-14
  nameEn: 'Custom Card',
  nameZh: '自定义牌',
  symbol: '☉',     // 行星符号
  keywordsU: ['关键词1', '关键词2'],
  keywordsR: ['反向关键词'],
  meaningU: '正位解读...',
  meaningR: '逆位解读...',
  // arcana / suit / image 由 id 自动推断
}
```

### 添加新牌阵

在 `src/data/spreads.ts` 追加:

```typescript
'celtic-cross': {
  type: 'celtic-cross',
  nameZh: '凯尔特十字',
  nameEn: 'Celtic Cross',
  description: '经典的 10 张牌深度牌阵...',
  cardCount: 10,
  positions: ['现状', '挑战', '基础', '过去', '目标', '未来', '自我', '环境', '希望与恐惧', '最终结果'],
},
```

记得在 `src/types/index.ts` 的 `SpreadType` 联合类型里加入 `'celtic-cross'`。

### 牌面图像

牌面已接入真实 RWS 牌图,由 `scripts/fetch-rws.mjs` 下载并生成 `src/data/cardImages.ts`:

```bash
node scripts/fetch-rws.mjs   # 重新下载 78 张并刷新 id→require 映射
```

`CardView` 会优先用 `getCardImage(card.id)` 的真图渲染,缺图时回退到程序化牌面。
若要换牌图源,改 `scripts/fetch-rws.mjs` 里的 `BASE` 与命名映射即可(详见「牌库版权」对来源的提示)。

### 调试技巧

- **真机调试**: 摇一摇打开 dev menu,选 "Debug" 触发 Chrome DevTools
- **查看历史记录存储**:
  ```bash
  adb shell run-as com.tarot.app cat databases/RKStorage  # SQLite 模式
  # 或 AsyncStorage 模式
  adb shell run-as com.tarot.app ls files/
  ```
- **清空历史** (调试):
  ```bash
  adb shell pm clear com.tarot.app
  ```

---

## 📜 牌库版权

本应用的 78 张牌**元数据**(中文名称、关键词、解读)为**原创翻译与释义**,采用 MIT 协议开源。

**牌面图像**为传统 Rider-Waite-Smith 牌图(1909 年 Arthur Edward Waite 设计、Pamela Colman Smith 绘画),
经 `scripts/fetch-rws.mjs` 从 [metabismuth/tarot-json](https://github.com/metabismuth/tarot-json)(MIT)拉取,落地于 `assets/cards/`。

⚠️ **版权提示**:
- RWS **1909 原版**在美国、英国(原始出版国)等地已进入公共领域。
- 但本仓库使用的扫描**带有「© 1971 U.S. Games」重新上色版**的标记 —— 该版本的上色有独立版权。
- **个人 / 学习用途无虞**;**商业上架前**请改用 1909 原版公有领域来源(如耶鲁 Beinecke 扫描、去边框的 Wikimedia 版)或明确 CC0 的牌图包,并咨询当地法律专业人士。
- 缺图时 App 会自动回退到程序化牌面,因此即使不带图也能正常运行。

刷新牌图:`node scripts/fetch-rws.mjs`(会重新下载并生成 `src/data/cardImages.ts` 映射)。

---

## 🗺️ 路线图

- [x] v0.1(MVP) · 单牌 + 三牌阵 + 78 牌库 + 本地历史
- [x] v0.2 · **更多牌阵**(关系/现状阻碍建议/五牌/凯尔特十字)+ **元素与占星对应**
- [x] v0.3 · **每日一卡**(确定性抽牌)+ **一键复制/分享解读文本**(喂给外部 AI)
- [x] v0.4 · **牌库图鉴** + **历史单条删除** + **无障碍/减少动效/ErrorBoundary** + 测试补全
- [ ] v0.4.1 · 每日一卡**本地通知**提醒(需引入原生通知库,如 `@notifee/react-native`)
- [ ] v0.5 · 真实凯尔特十字**交叉布局**(当前为带位置标签的网格)
- [ ] v0.6 · **分享到社交**(图片导出)
- [ ] v0.7 · **云同步**历史记录
- [ ] v0.8 · **多语言**(英文/繁体)
- [ ] v0.9 · **自定义牌阵** UI + **音效**与背景音乐
- [ ] v1.0 · 亮色/暗色主题切换 + 应用商店上架

---

## 🤝 贡献

欢迎任何形式的贡献!

### 提 Issue
- 🐛 **Bug 报告**: 复现步骤、期望行为、实际行为、截图
- 💡 **功能建议**: 用例场景、为什么需要、可能的实现
- ❓ **问题咨询**: 任何使用上的疑问

### 提 PR
1. Fork 本仓库
2. 创建 feature 分支 (`git checkout -b feature/awesome-feature`)
3. 提交变更 (`git commit -m 'feat: add awesome feature'`)
4. 推送到分支 (`git push origin feature/awesome-feature`)
5. 创建 Pull Request,描述你的改动

### 代码规范
- TypeScript strict 模式,提交前 `npx tsc --noEmit`
- ESLint 配置: `npm run lint`
- Prettier 格式化
- 组件用函数式 + Hooks
- 文件命名 PascalCase(组件)/ camelCase(工具)

---

## 🙏 致谢

- **Arthur Edward Waite** 与 **Pamela Colman Smith** — Rider-Waite-Smith 牌组的设计者与绘画者
- **React Native 团队** — 跨平台原生框架
- **所有开源依赖的作者** — 见 `package.json`

---

## 📄 License

MIT © 2026

```
MIT License

Copyright (c) 2026 shaozheng0503

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

<p align="center">
  ✦ 如果这个项目对你有帮助,欢迎 Star ⭐ ✦<br>
  <a href="https://github.com/shaozheng0503/tarot-android">github.com/shaozheng0503/tarot-android</a>
</p>
