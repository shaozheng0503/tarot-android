// 牌阵定义
import type { SpreadType } from '../types';

/** 牌面排布方式:单张居中 / 横向一排 / 网格 */
export type SpreadLayoutKind = 'single' | 'row' | 'grid';

export interface Spread {
  type: SpreadType;
  nameZh: string;
  nameEn: string;
  description: string;
  cardCount: number;
  positions: string[];
  layout: SpreadLayoutKind;
}

export const SPREADS: Record<SpreadType, Spread> = {
  single: {
    type: 'single',
    nameZh: '单牌指引',
    nameEn: 'Single Card',
    description: '从牌组中抽取一张牌,获得当下的指引与启示。适合快速问答。',
    cardCount: 1,
    positions: ['指引'],
    layout: 'single',
  },
  'three-card': {
    type: 'three-card',
    nameZh: '三牌阵(过去·现在·未来)',
    nameEn: 'Past Present Future',
    description: '三张牌分别代表过去、现在与未来,呈现事情发展的脉络。',
    cardCount: 3,
    positions: ['过去', '现在', '未来'],
    layout: 'row',
  },
  love: {
    type: 'love',
    nameZh: '关系之镜',
    nameEn: 'Relationship',
    description: '看清一段关系:你的状态、对方的状态,以及关系的走向。',
    cardCount: 3,
    positions: ['你', '对方', '关系'],
    layout: 'row',
  },
  situation: {
    type: 'situation',
    nameZh: '现状·阻碍·建议',
    nameEn: 'Situation · Obstacle · Advice',
    description: '解决具体难题:看清现状、识别阻碍、获得行动建议。',
    cardCount: 3,
    positions: ['现状', '阻碍', '建议'],
    layout: 'row',
  },
  'five-card': {
    type: 'five-card',
    nameZh: '五牌星形',
    nameEn: 'Five Card',
    description: '更立体地展开一件事:现状、挑战、可采取的行动、外部影响与最终结果。',
    cardCount: 5,
    positions: ['现状', '挑战', '行动', '外部影响', '结果'],
    layout: 'grid',
  },
  'celtic-cross': {
    type: 'celtic-cross',
    nameZh: '凯尔特十字',
    nameEn: 'Celtic Cross',
    description: '经典 10 张牌深度牌阵,全面剖析一个议题的内外因、过去未来与最终走向。',
    cardCount: 10,
    positions: [
      '现状',
      '挑战',
      '根基',
      '过去',
      '目标',
      '近未来',
      '自我',
      '环境',
      '希望与恐惧',
      '最终结果',
    ],
    layout: 'grid',
  },
};

/** 首页展示顺序 */
export const SPREAD_ORDER: SpreadType[] = [
  'single',
  'three-card',
  'love',
  'situation',
  'five-card',
  'celtic-cross',
];

export function getSpread(type: SpreadType): Spread {
  return SPREADS[type];
}
