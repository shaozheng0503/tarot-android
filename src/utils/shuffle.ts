// Fisher-Yates 洗牌算法 + 抽牌工具
import type { TarotCard, DrawnCard, Orientation } from '../types';

/**
 * 原地洗牌,返回新数组(不修改原数组)
 */
export function shuffle<T>(arr: readonly T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** 逆位出现概率(传统占卜常取 30% 左右,而非对半) */
export const REVERSED_PROBABILITY = 0.3;

/**
 * 独立判定每张牌的正逆位
 */
export function rollOrientation(): Orientation {
  return Math.random() < REVERSED_PROBABILITY ? 'reversed' : 'upright';
}

/**
 * 从牌组中抽 N 张,每张独立判定正逆位
 * 可选传入位置标签数组(用于三牌阵)
 */
export function drawCards(
  deck: TarotCard[],
  count: number,
  positions?: string[],
): DrawnCard[] {
  const picked = shuffle(deck).slice(0, count);
  return picked.map((card, idx) => ({
    cardId: card.id,
    orientation: rollOrientation(),
    position: positions?.[idx],
  }));
}
