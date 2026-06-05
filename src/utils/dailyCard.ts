// 每日一卡:同一天结果固定(按日期做确定性抽牌,不依赖随机数)
/* eslint-disable no-bitwise */ // 哈希需要位运算
import type { DrawnCard } from '../types';
import { ALL_CARDS } from '../data/cards';
import { REVERSED_PROBABILITY } from './shuffle';

/** 本地日期键,例如 2026-06-05 */
export function dateKey(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/** xfnv1a 字符串哈希 → 32 位无符号整数 */
export function hashString(str: string): number {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/**
 * 根据日期确定性地抽出"今日一卡"。
 * 同一天多次调用结果完全一致;逆位概率与正常抽牌保持一致(约 30%)。
 */
export function getDailyDraw(date: Date): DrawnCard {
  const seed = hashString(dateKey(date));
  const index = seed % ALL_CARDS.length;
  // 用哈希的高位再取一个 0-99 的值判定正逆位,与日期同样确定
  const orientationRoll = ((seed >>> 8) % 100) / 100;
  return {
    cardId: ALL_CARDS[index].id,
    orientation: orientationRoll < REVERSED_PROBABILITY ? 'reversed' : 'upright',
  };
}
