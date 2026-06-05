import { shuffle, rollOrientation, REVERSED_PROBABILITY } from '../src/utils/shuffle';
import { getDailyDraw, dateKey, hashString } from '../src/utils/dailyCard';
import { formatReadingText, formatCardText } from '../src/utils/formatReading';
import { ALL_CARDS, CARDS_BY_ID, getCard, CARD_GROUPS } from '../src/data/cards';

describe('shuffle', () => {
  it('保留所有元素且不改变原数组', () => {
    const src = Array.from({ length: 20 }, (_, i) => i);
    const out = shuffle(src);
    expect(out).toHaveLength(src.length);
    expect([...out].sort((a, b) => a - b)).toEqual(src);
    expect(src).toEqual(Array.from({ length: 20 }, (_, i) => i)); // 原数组未被改动
  });

  it('rollOrientation 只返回合法朝向', () => {
    for (let i = 0; i < 100; i++) {
      expect(['upright', 'reversed']).toContain(rollOrientation());
    }
  });

  it('逆位概率为 0.3', () => {
    expect(REVERSED_PROBABILITY).toBe(0.3);
  });
});

describe('每日一卡', () => {
  it('dateKey 格式为 YYYY-MM-DD', () => {
    expect(dateKey(new Date(2026, 5, 5))).toBe('2026-06-05');
  });

  it('hashString 对同一字符串确定', () => {
    expect(hashString('2026-06-05')).toBe(hashString('2026-06-05'));
  });

  it('同一天结果完全一致', () => {
    const a = getDailyDraw(new Date(2026, 5, 5));
    const b = getDailyDraw(new Date(2026, 5, 5, 23, 59));
    expect(a).toEqual(b);
  });

  it('抽出的牌一定存在于牌库', () => {
    for (let m = 0; m < 12; m++) {
      const draw = getDailyDraw(new Date(2026, m, 15));
      expect(CARDS_BY_ID[draw.cardId]).toBeDefined();
      expect(['upright', 'reversed']).toContain(draw.orientation);
    }
  });
});

describe('牌面元素与占星', () => {
  it('每张牌都有元素;大阿卡纳有占星对应', () => {
    for (const card of ALL_CARDS) {
      expect(['火', '水', '风', '土']).toContain(card.element);
      if (card.arcana === 'major') {
        expect(card.astro.length).toBeGreaterThan(0);
      }
    }
  });
});

describe('formatReadingText(喂给 AI 的文本)', () => {
  it('包含问题、牌阵、位置、正逆位、元素与页脚', () => {
    const fool = getCard('major-00')!;
    const text = formatReadingText({
      spreadType: 'three-card',
      question: '我该换工作吗?',
      timestamp: new Date(2026, 5, 5, 14, 30).getTime(),
      cards: [
        { cardId: 'major-00', orientation: 'upright', position: '过去' },
        { cardId: 'major-19', orientation: 'reversed', position: '现在' },
      ],
    });
    expect(text).toContain('三牌阵');
    expect(text).toContain('我该换工作吗?');
    expect(text).toContain('[过去]');
    expect(text).toContain(fool.nameZh);
    expect(text).toContain('正位');
    expect(text).toContain('逆位');
    expect(text).toContain('元素/占星');
    expect(text).toContain('粘贴给 AI');
  });
});

describe('formatCardText(图鉴单卡)', () => {
  it('包含中文名、正位、逆位与元素', () => {
    const text = formatCardText('major-00');
    expect(text).toContain('愚者');
    expect(text).toContain('正位');
    expect(text).toContain('逆位');
    expect(text).toContain('元素');
  });

  it('未知 id 返回空串', () => {
    expect(formatCardText('not-a-card')).toBe('');
  });
});

describe('图鉴分组', () => {
  it('五组共覆盖全部 78 张牌,无遗漏无重复', () => {
    const total = CARD_GROUPS.reduce((n, g) => n + g.cards.length, 0);
    expect(total).toBe(ALL_CARDS.length);
    expect(ALL_CARDS.length).toBe(78);
    expect(CARD_GROUPS).toHaveLength(5);
  });
});
