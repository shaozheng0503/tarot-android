// 塔罗主题:紫黑金
// 灵感来自传统塔罗牌面配色:深邃的紫黑色背景 + 金色装饰

export const colors = {
  // 背景层
  bgDeep: '#0d0420',      // 最深,接近黑紫
  bgPrimary: '#1a0a2e',   // 主背景
  bgCard: '#241340',      // 卡片背景

  // 文字
  textPrimary: '#fff8e7', // 米白,主文字
  textSecondary: '#b8a8d4',
  textMuted: '#7a6b94',

  // 强调色
  gold: '#c9a227',        // 主金色
  goldBright: '#e8c547',  // 高亮金
  goldDark: '#8a6d18',    // 暗金

  // 牌面专属(按花色)
  suitWands: '#e85d3a',    // 火 - 红橙
  suitCups: '#4a90e2',     // 水 - 蓝
  suitSwords: '#9ba3b4',   // 风 - 银灰
  suitPentacles: '#5cb85c',// 土 - 绿

  // 状态
  success: '#4caf50',
  danger: '#e74c3c',
  reversed: '#8e6c8a',     // 逆位标记色

  // 边框/分隔
  border: '#3d2659',
  divider: '#2d1b4e',
} as const;

// 获取花色颜色
export function getSuitColor(suit: string | undefined): string {
  switch (suit) {
    case 'wands':
      return colors.suitWands;
    case 'cups':
      return colors.suitCups;
    case 'swords':
      return colors.suitSwords;
    case 'pentacles':
      return colors.suitPentacles;
    default:
      return colors.gold;
  }
}

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

export const fontSize = {
  caption: 12,
  body: 14,
  bodyLarge: 16,
  title: 20,
  heading: 28,
  display: 36,
} as const;

export const radius = {
  sm: 6,
  md: 12,
  lg: 20,
  card: 16,
} as const;
