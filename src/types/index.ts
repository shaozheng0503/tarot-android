// 塔罗牌核心类型定义

export type Arcana = 'major' | 'minor';
export type Suit = 'wands' | 'cups' | 'swords' | 'pentacles';
export type Orientation = 'upright' | 'reversed';

/** 四元素 */
export type Element = '火' | '水' | '风' | '土';

export type SuitSymbol = '☉' | '☽' | '☿' | '♀' | '♂' | '♃' | '♄';

export interface TarotCard {
  id: string;
  arcana: Arcana;
  suit?: Suit;
  number: number;
  nameEn: string;
  nameZh: string;
  keywordsUpright: string[];
  keywordsReversed: string[];
  meaningUpright: string;
  meaningReversed: string;
  symbol: SuitSymbol | '✦';
  /** 元素归属:火/水/风/土 */
  element: Element;
  /** 占星对应(大阿卡纳为行星/星座;小阿卡纳为空,展示时回退到花色) */
  astro: string;
}

export interface DrawnCard {
  cardId: string;
  orientation: Orientation;
  position?: string;
}

export type SpreadType =
  | 'single'
  | 'three-card'
  | 'love'
  | 'situation'
  | 'five-card'
  | 'celtic-cross';

export interface Reading {
  id: string;
  timestamp: number;
  spreadType: SpreadType;
  question?: string;
  cards: DrawnCard[];
}

export interface HistoryEntry extends Reading {
  /** 区分普通占卜与每日一卡 */
  kind?: 'reading' | 'daily';
  // 后续可加 AI 生成的 summary
  summary?: string;
}

export type RootStackParamList = {
  MainTabs: undefined;
  Reading: { spreadType: SpreadType; question?: string };
  HistoryDetail: { entryId: string };
  Daily: undefined;
  CardDetail: { cardId: string };
};

export type MainTabParamList = {
  HomeTab: undefined;
  LibraryTab: undefined;
  HistoryTab: undefined;
};
