// 元素与占星对应表
// 大阿卡纳:Golden Dawn 体系的行星/星座归属
// 小阿卡纳:由花色推导元素(权杖火/圣杯水/宝剑风/星币土)
import type { Element, Suit } from '../types';

/** 花色 → 元素 */
export const SUIT_ELEMENT: Record<Suit, Element> = {
  wands: '火',
  cups: '水',
  swords: '风',
  pentacles: '土',
};

/** 花色 → 中文名 */
export const SUIT_ZH: Record<Suit, string> = {
  wands: '权杖',
  cups: '圣杯',
  swords: '宝剑',
  pentacles: '星币',
};

interface MajorCorrespondence {
  element: Element;
  astro: string; // 含符号 + 中文名,便于直接展示/复制
}

/** 大阿卡纳编号(0-21) → 元素 + 占星对应 */
export const MAJOR_CORRESPONDENCE: Record<number, MajorCorrespondence> = {
  0: { element: '风', astro: '♅ 天王星' },
  1: { element: '风', astro: '☿ 水星' },
  2: { element: '水', astro: '☽ 月亮' },
  3: { element: '土', astro: '♀ 金星' },
  4: { element: '火', astro: '♈ 白羊座' },
  5: { element: '土', astro: '♉ 金牛座' },
  6: { element: '风', astro: '♊ 双子座' },
  7: { element: '水', astro: '♋ 巨蟹座' },
  8: { element: '火', astro: '♌ 狮子座' },
  9: { element: '土', astro: '♍ 处女座' },
  10: { element: '火', astro: '♃ 木星' },
  11: { element: '风', astro: '♎ 天秤座' },
  12: { element: '水', astro: '♆ 海王星' },
  13: { element: '水', astro: '♏ 天蝎座' },
  14: { element: '火', astro: '♐ 射手座' },
  15: { element: '土', astro: '♑ 摩羯座' },
  16: { element: '火', astro: '♂ 火星' },
  17: { element: '风', astro: '♒ 水瓶座' },
  18: { element: '水', astro: '♓ 双鱼座' },
  19: { element: '火', astro: '☉ 太阳' },
  20: { element: '火', astro: '♇ 冥王星' },
  21: { element: '土', astro: '♄ 土星' },
};

/** 元素 → 一句话性格,用于展示/解读文本里补充语境 */
export const ELEMENT_NATURE: Record<Element, string> = {
  火: '热情 · 行动 · 创造',
  水: '情感 · 直觉 · 关系',
  风: '思维 · 沟通 · 抉择',
  土: '物质 · 务实 · 根基',
};
