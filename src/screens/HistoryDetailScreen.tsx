// 单条历史详情
import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { colors, fontSize, radius, spacing } from '../theme/colors';
import { useHistoryStore } from '../store/useHistoryStore';
import { getCard } from '../data/cards';
import { getSpread } from '../data/spreads';
import { CardView } from '../components/CardView';
import type { RootStackParamList } from '../types';

type Props = NativeStackScreenProps<RootStackParamList, 'HistoryDetail'>;

function formatDate(ts: number): string {
  const d = new Date(ts);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

export function HistoryDetailScreen({ route, navigation }: Props) {
  const { entryId } = route.params;
  const entry = useHistoryStore(s => s.history.find(e => e.id === entryId));

  if (!entry) {
    return (
      <SafeAreaView style={styles.safe} edges={['top']}>
        <View style={styles.headerRow}>
          <Pressable onPress={() => navigation.goBack()} hitSlop={10}>
            <Text style={styles.back}>‹ 返回</Text>
          </Pressable>
        </View>
        <View style={styles.empty}>
          <Text style={styles.emptyText}>记录不存在或已被删除</Text>
        </View>
      </SafeAreaView>
    );
  }

  const spread = getSpread(entry.spreadType);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.headerRow}>
        <Pressable onPress={() => navigation.goBack()} hitSlop={10}>
          <Text style={styles.back}>‹ 返回</Text>
        </Pressable>
        <Text style={styles.headerTitle}>{spread.nameZh}</Text>
        <View style={{ width: 50 }} />
      </View>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.date}>{formatDate(entry.timestamp)}</Text>

        {entry.question && (
          <View style={styles.qBox}>
            <Text style={styles.qLabel}>问题</Text>
            <Text style={styles.qText}>"{entry.question}"</Text>
          </View>
        )}

        {/* 牌面展示 */}
        <View style={entry.spreadType === 'single' ? styles.cardsRowSingle : styles.cardsRow}>
          {entry.cards.map((d, idx) => {
            const card = getCard(d.cardId);
            if (!card) return null;
            return (
              <View key={idx} style={entry.spreadType === 'single' ? null : styles.cardSlot}>
                {d.position && <Text style={styles.positionLabel}>{d.position}</Text>}
                <CardView card={card} orientation={d.orientation} faceUp small={entry.spreadType !== 'single'} />
              </View>
            );
          })}
        </View>

        {/* 解读 */}
        {entry.cards.map((d, idx) => {
          const card = getCard(d.cardId);
          if (!card) return null;
          const isR = d.orientation === 'reversed';
          return (
            <View key={idx} style={styles.cardDetail}>
              <View style={styles.cardDetailHeader}>
                <Text style={styles.cardName}>
                  {d.position && <Text style={styles.cardPos}>{d.position} · </Text>}
                  {card.nameZh}
                </Text>
                <Text style={[styles.cardOrient, isR && styles.cardOrientR]}>
                  {isR ? '逆位' : '正位'}
                </Text>
              </View>
              <View style={styles.kwRow}>
                {(isR ? card.keywordsReversed : card.keywordsUpright).map((kw, i) => (
                  <View key={i} style={styles.kwChip}>
                    <Text style={styles.kwText}>{kw}</Text>
                  </View>
                ))}
              </View>
              <Text style={styles.meaning}>
                {isR ? card.meaningReversed : card.meaningUpright}
              </Text>
            </View>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bgPrimary },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
  },
  back: { color: colors.gold, fontSize: fontSize.body, fontWeight: '600' },
  headerTitle: { color: colors.gold, fontSize: fontSize.bodyLarge, fontWeight: '700' },
  scroll: { padding: spacing.lg, paddingBottom: spacing.xxl },
  date: {
    color: colors.textMuted,
    fontSize: fontSize.caption,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  qBox: {
    backgroundColor: colors.bgCard,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.lg,
    borderLeftWidth: 3,
    borderLeftColor: colors.gold,
  },
  qLabel: {
    color: colors.gold,
    fontSize: fontSize.caption,
    fontWeight: '600',
    marginBottom: spacing.xs,
    letterSpacing: 1,
  },
  qText: {
    color: colors.textPrimary,
    fontSize: fontSize.body,
    fontStyle: 'italic',
  },
  cardsRowSingle: {
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  cardsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: spacing.lg,
  },
  cardSlot: { alignItems: 'center' },
  positionLabel: {
    color: colors.gold,
    fontSize: fontSize.caption,
    marginBottom: spacing.xs,
    fontWeight: '600',
  },
  cardDetail: {
    backgroundColor: colors.bgCard,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderLeftWidth: 3,
    borderLeftColor: colors.gold,
  },
  cardDetailHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  cardName: {
    color: colors.textPrimary,
    fontSize: fontSize.bodyLarge,
    fontWeight: '700',
  },
  cardPos: { color: colors.gold, fontWeight: '600' },
  cardOrient: {
    color: colors.gold,
    fontSize: fontSize.caption,
    fontWeight: '600',
  },
  cardOrientR: { color: colors.reversed },
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
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  emptyText: { color: colors.textMuted, fontSize: fontSize.body },
});
