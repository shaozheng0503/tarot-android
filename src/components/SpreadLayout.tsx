// 牌阵布局:1 张居中 / 3 张横向
// 翻牌错开:每张牌延迟 350ms 翻开
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, fontSize, spacing } from '../theme/colors';
import type { DrawnCard, SpreadType } from '../types';
import { CardView } from './CardView';
import { getCard } from '../data/cards';

interface Props {
  spreadType: SpreadType;
  drawn: DrawnCard[];
  faceUp: boolean[];
  onCardPress?: (idx: number) => void;
}

const FLIP_STAGGER_MS = 350;

export function SpreadLayout({ spreadType, drawn, faceUp, onCardPress }: Props) {
  if (drawn.length === 0) return null;

  if (spreadType === 'single') {
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

  // 三牌阵
  return (
    <View style={styles.threeWrap}>
      {drawn.map((d, idx) => {
        const card = getCard(d.cardId);
        if (!card) return null;
        return (
          <View key={idx} style={styles.threeCardSlot}>
            {d.position && <Text style={styles.positionLabel}>{d.position}</Text>}
            <CardView
              card={card}
              orientation={d.orientation}
              faceUp={faceUp[idx]}
              onPress={onCardPress ? () => onCardPress(idx) : undefined}
              small
              flipDelay={idx * FLIP_STAGGER_MS}
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
  threeWrap: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.md,
  },
  threeCardSlot: {
    alignItems: 'center',
  },
  positionLabel: {
    color: colors.gold,
    fontSize: fontSize.body,
    fontWeight: '600',
    marginBottom: spacing.xs,
    letterSpacing: 2,
  },
});
