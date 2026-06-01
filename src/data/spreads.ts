// 牌阵定义
import type { SpreadType } from '../types';

export interface Spread {
  type: SpreadType;
  nameZh: string;
  nameEn: string;
  description: string;
  cardCount: number;
  positions: string[];
}

export const SPREADS: Record<SpreadType, Spread> = {
  single: {
    type: 'single',
    nameZh: '单牌指引',
    nameEn: 'Single Card',
    description: '从牌组中抽取一张牌,获得当下的指引与启示。适合快速问答。',
    cardCount: 1,
    positions: ['指引'],
  },
  'three-card': {
    type: 'three-card',
    nameZh: '三牌阵(过去·现在·未来)',
    nameEn: 'Three Card Spread',
    description: '三张牌分别代表过去、现在与未来,呈现事情发展的脉络。',
    cardCount: 3,
    positions: ['过去', '现在', '未来'],
  },
};

export function getSpread(type: SpreadType): Spread {
  return SPREADS[type];
}
