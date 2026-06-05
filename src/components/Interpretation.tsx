// 解读区:逐张展示牌名 / 正逆位 / 元素·占星 / 关键词 / 释义。
// 被 ReadingScreen、HistoryDetailScreen、DailyScreen 复用,保证三处样式一致。
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, fontSize, radius, spacing, getElementColor } from '../theme/colors';
import { getCard } from '../data/cards';
import { SUIT_ZH } from '../data/correspondences';
import type { DrawnCard } from '../types';

interface Props {
  drawn: DrawnCard[];
}

export function Interpretation({ drawn }: Props) {
  return (
    <>
      {drawn.map((d, idx) => {
        const card = getCard(d.cardId);
        if (!card) return null;
        const isR = d.orientation === 'reversed';
        const keywords = isR ? card.keywordsReversed : card.keywordsUpright;
        const meaning = isR ? card.meaningReversed : card.meaningUpright;
        const astroTail = card.astro || (card.suit ? SUIT_ZH[card.suit] : '');
        const elementColor = getElementColor(card.element);

        return (
          <View key={idx} style={styles.card}>
            <View style={styles.header}>
              <Text style={styles.name}>
                {d.position && <Text style={styles.position}>{d.position} · </Text>}
                {card.nameZh}
              </Text>
              <Text style={[styles.orient, isR && styles.orientR]}>
                {isR ? '逆位' : '正位'}
              </Text>
            </View>

            {/* 元素 / 占星 */}
            <View style={styles.metaRow}>
              <View style={[styles.elementChip, { borderColor: elementColor }]}>
                <Text style={[styles.elementText, { color: elementColor }]}>{card.element}</Text>
              </View>
              {astroTail ? <Text style={styles.astroText}>{astroTail}</Text> : null}
            </View>

            <View style={styles.kwRow}>
              {keywords.map((kw, i) => (
                <View key={i} style={styles.kwChip}>
                  <Text style={styles.kwText}>{kw}</Text>
                </View>
              ))}
            </View>

            <Text style={styles.meaning}>{meaning}</Text>
          </View>
        );
      })}
    </>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.bgCard,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderLeftWidth: 3,
    borderLeftColor: colors.gold,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  name: {
    flex: 1,
    color: colors.textPrimary,
    fontSize: fontSize.bodyLarge,
    fontWeight: '700',
  },
  position: { color: colors.gold, fontWeight: '600' },
  orient: {
    color: colors.gold,
    fontSize: fontSize.caption,
    fontWeight: '600',
    marginLeft: spacing.sm,
  },
  orientR: { color: colors.reversed },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  elementChip: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  elementText: {
    fontSize: 12,
    fontWeight: '700',
  },
  astroText: {
    color: colors.textSecondary,
    fontSize: fontSize.caption,
    letterSpacing: 0.5,
  },
  kwRow: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: spacing.sm },
  kwChip: {
    backgroundColor: colors.bgDeep,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    marginRight: spacing.xs,
    marginBottom: spacing.xs,
    borderWidth: 1,
    borderColor: colors.border,
  },
  kwText: { color: colors.goldBright, fontSize: fontSize.caption },
  meaning: { color: colors.textPrimary, fontSize: fontSize.body, lineHeight: 22 },
});
