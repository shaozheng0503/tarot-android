// 牌阵布局:单张居中 / 横向一排 / 网格(5 张以上)
// 翻牌错开:每张牌按索引延迟翻开
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, fontSize, spacing } from '../theme/colors';
import type { DrawnCard, SpreadType } from '../types';
import { CardView } from './CardView';
import { getCard } from '../data/cards';
import { getSpread } from '../data/spreads';

interface Props {
  spreadType: SpreadType;
  drawn: DrawnCard[];
  faceUp: boolean[];
  onCardPress?: (idx: number) => void;
}

const FLIP_STAGGER_MS = 350;
const FLIP_STAGGER_DENSE_MS = 200; // 牌多时缩短间隔,避免等待过久

export function SpreadLayout({ spreadType, drawn, faceUp, onCardPress }: Props) {
  if (drawn.length === 0) return null;
  const layout = getSpread(spreadType).layout;
  const stagger = drawn.length > 5 ? FLIP_STAGGER_DENSE_MS : FLIP_STAGGER_MS;

  // 单张:居中大牌
  if (layout === 'single') {
    const d = drawn[0];
    const card = getCard(d.cardId);
    if (!card) return null;
    return (
      <View style={styles.singleWrap}>
        {d.position && <Text style={styles.positionLabel}>{d.position}</Text>}
        <CardView
          card={card}
          orientation={d.orientation}
          faceUp={faceUp[0]}
          onPress={onCardPress ? () => onCardPress(0) : undefined}
          flipDelay={0}
        />
      </View>
    );
  }

  const isGrid = layout === 'grid';

  return (
    <View style={isGrid ? styles.gridWrap : styles.rowWrap}>
      {drawn.map((d, idx) => {
        const card = getCard(d.cardId);
        if (!card) return null;
        return (
          <View key={idx} style={isGrid ? styles.gridSlot : styles.rowSlot}>
            {d.position && (
              <Text style={styles.positionLabel} numberOfLines={1}>
                {d.position}
              </Text>
            )}
            <CardView
              card={card}
              orientation={d.orientation}
              faceUp={faceUp[idx]}
              onPress={onCardPress ? () => onCardPress(idx) : undefined}
              small={!isGrid}
              tiny={isGrid}
              flipDelay={idx * stagger}
            />
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  singleWrap: {
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  rowWrap: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.md,
  },
  rowSlot: {
    alignItems: 'center',
  },
  gridWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    paddingVertical: spacing.md,
  },
  gridSlot: {
    alignItems: 'center',
    width: 78,
    marginHorizontal: spacing.xs,
    marginBottom: spacing.md,
  },
  positionLabel: {
    color: colors.gold,
    fontSize: fontSize.caption,
    fontWeight: '600',
    marginBottom: spacing.xs,
    letterSpacing: 1,
    textAlign: 'center',
  },
});
