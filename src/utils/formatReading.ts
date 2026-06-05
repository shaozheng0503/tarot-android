// 把一次占卜整理成结构化纯文本,便于一键复制/分享后粘贴给任意 AI 解读。
// 文本里包含问题、牌阵、每张牌的位置/正逆位/元素/占星/关键词/释义,
// AI 无需再 OCR 截图即可直接理解牌面。
import type { DrawnCard, Reading } from '../types';
import { getCard } from '../data/cards';
import { getSpread } from '../data/spreads';
import { SUIT_ZH } from '../data/correspondences';

function pad2(n: number): string {
  return String(n).padStart(2, '0');
}

export function formatTimestamp(ts: number): string {
  const d = new Date(ts);
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())} ${pad2(d.getHours())}:${pad2(d.getMinutes())}`;
}

/** 单张牌的占星/元素标签,例如「火 · ☉ 太阳」或「火 · 权杖」 */
export function cardAstroLabel(cardId: string): string {
  const card = getCard(cardId);
  if (!card) return '';
  const tail = card.astro || (card.suit ? SUIT_ZH[card.suit] : '');
  return tail ? `${card.element} · ${tail}` : card.element;
}

/** 图鉴单卡的完整资料(含正逆位),便于单独复制喂给 AI。 */
export function formatCardText(cardId: string): string {
  const card = getCard(cardId);
  if (!card) return '';
  const lines: string[] = [];
  lines.push(`✦ ${card.nameZh} ${card.nameEn}`);
  lines.push(`元素/占星:${cardAstroLabel(cardId)}`);
  lines.push('');
  lines.push(`【正位】${card.keywordsUpright.join('、')}`);
  lines.push(card.meaningUpright);
  lines.push('');
  lines.push(`【逆位】${card.keywordsReversed.join('、')}`);
  lines.push(card.meaningReversed);
  return lines.join('\n').trim();
}

interface FormatOptions {
  /** 牌阵中文名;不传则按 spreadType 查表 */
  spreadName?: string;
  timestamp?: number;
}

/**
 * 把一次占卜(或任意 DrawnCard 列表)整理为可直接喂给 AI 的文本。
 */
export function formatReadingText(
  reading: Pick<Reading, 'spreadType' | 'question' | 'cards'> & { timestamp?: number },
  options: FormatOptions = {},
): string {
  const spread = getSpread(reading.spreadType);
  const spreadName = options.spreadName ?? spread?.nameZh ?? '塔罗占卜';
  const ts = options.timestamp ?? reading.timestamp;

  const lines: string[] = [];
  lines.push(`✦ 塔罗占卜 · ${spreadName}`);
  if (reading.question) lines.push(`问题:${reading.question}`);
  if (ts) lines.push(`时间:${formatTimestamp(ts)}`);
  lines.push('');

  reading.cards.forEach((d: DrawnCard, idx) => {
    const card = getCard(d.cardId);
    if (!card) return;
    const isR = d.orientation === 'reversed';
    const orient = isR ? '逆位' : '正位';
    const pos = d.position ? `[${d.position}] ` : '';
    const keywords = (isR ? card.keywordsReversed : card.keywordsUpright).join('、');
    const meaning = isR ? card.meaningReversed : card.meaningUpright;

    lines.push(`${idx + 1}. ${pos}${card.nameZh}(${orient})`);
    lines.push(`   元素/占星:${cardAstroLabel(d.cardId)}`);
    lines.push(`   关键词:${keywords}`);
    lines.push(`   牌意:${meaning}`);
    lines.push('');
  });

  lines.push('—— 由「塔罗占卜」生成,可直接粘贴给 AI 做深度解读 ——');
  return lines.join('\n').trim();
}
