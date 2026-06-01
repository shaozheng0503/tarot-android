// 塔罗牌核心类型定义

export type Arcana = 'major' | 'minor';
export type Suit = 'wands' | 'cups' | 'swords' | 'pentacles';
export type Orientation = 'upright' | 'reversed';

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
}

export interface DrawnCard {
  cardId: string;
  orientation: Orientation;
  position?: string;
}

export type SpreadType = 'single' | 'three-card';

export interface Reading {
  id: string;
  timestamp: number;
  spreadType: SpreadType;
  question?: string;
  cards: DrawnCard[];
}

export interface HistoryEntry extends Reading {
  // 后续可加 AI 生成的 summary
  summary?: string;
}

export type RootStackParamList = {
  MainTabs: undefined;
  Reading: { spreadType: SpreadType; question?: string };
  HistoryDetail: { entryId: string };
};

export type MainTabParamList = {
  HomeTab: undefined;
  HistoryTab: undefined;
};
