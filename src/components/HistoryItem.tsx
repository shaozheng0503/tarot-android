// 历史记录条目
import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { colors, fontSize, radius, spacing } from '../theme/colors';
import type { HistoryEntry } from '../types';
import { getCard } from '../data/cards';
import { getSpread } from '../data/spreads';

interface Props {
  entry: HistoryEntry;
  onPress: () => void;
  onLongPress?: () => void;
}

function formatDate(ts: number): string {
  const d = new Date(ts);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const hh = String(d.getHours()).padStart(2, '0');
  const mm = String(d.getMinutes()).padStart(2, '0');
  return `${y}-${m}-${day} ${hh}:${mm}`;
}

export function HistoryItem({ entry, onPress, onLongPress }: Props) {
  const spreadLabel = entry.kind === 'daily'
    ? '今日运势'
    : getSpread(entry.spreadType)?.nameZh ?? '占卜';
  const cardNames = entry.cards
    .map(c => {
      const card = getCard(c.cardId);
      if (!card) return '?';
      return card.nameZh + (c.orientation === 'reversed' ? '·逆' : '');
    })
    .join(' · ');

  return (
    <Pressable
      onPress={onPress}
      onLongPress={onLongPress}
      accessibilityRole="button"
      accessibilityHint={onLongPress ? '长按可删除此记录' : undefined}
      style={({ pressed }) => [styles.item, pressed && styles.pressed]}
    >
      <View style={styles.headerRow}>
        <Text style={styles.spreadType}>{spreadLabel}</Text>
        <Text style={styles.date}>{formatDate(entry.timestamp)}</Text>
      </View>
      {entry.question ? (
        <Text style={styles.question} numberOfLines={2}>
          {entry.question}
        </Text>
      ) : null}
      <Text style={styles.cards} numberOfLines={2}>{cardNames}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  item: {
    backgroundColor: colors.bgCard,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderLeftWidth: 3,
    borderLeftColor: colors.gold,
  },
  pressed: {
    backgroundColor: colors.bgDeep,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  spreadType: {
    color: colors.gold,
    fontSize: fontSize.body,
    fontWeight: '700',
  },
  date: {
    color: colors.textMuted,
    fontSize: fontSize.caption,
  },
  question: {
    color: colors.textSecondary,
    fontSize: fontSize.body,
    fontStyle: 'italic',
    marginBottom: spacing.xs,
  },
  cards: {
    color: colors.textPrimary,
    fontSize: fontSize.body,
  },
});
