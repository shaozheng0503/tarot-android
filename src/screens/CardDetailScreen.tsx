// 单卡详情:大牌面 + 元素占星 + 正位/逆位完整释义 + 一键复制。
import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { colors, fontSize, radius, spacing, getElementColor } from '../theme/colors';
import { getCard } from '../data/cards';
import { SUIT_ZH, ELEMENT_NATURE } from '../data/correspondences';
import { formatCardText } from '../utils/formatReading';
import { CardView } from '../components/CardView';
import { ShareActions } from '../components/ShareActions';
import type { RootStackParamList } from '../types';

type Props = NativeStackScreenProps<RootStackParamList, 'CardDetail'>;

export function CardDetailScreen({ route, navigation }: Props) {
  const { cardId } = route.params;
  const card = getCard(cardId);

  if (!card) {
    return (
      <SafeAreaView style={styles.safe} edges={['top']}>
        <View style={styles.headerRow}>
          <Pressable onPress={() => navigation.goBack()} hitSlop={10}>
            <Text style={styles.back}>‹ 返回</Text>
          </Pressable>
        </View>
        <View style={styles.empty}>
          <Text style={styles.emptyText}>未找到这张牌</Text>
        </View>
      </SafeAreaView>
    );
  }

  const astroTail = card.astro || (card.suit ? SUIT_ZH[card.suit] : '');
  const elementColor = getElementColor(card.element);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.headerRow}>
        <Pressable onPress={() => navigation.goBack()} hitSlop={10}>
          <Text style={styles.back}>‹ 返回</Text>
        </Pressable>
        <Text style={styles.headerTitle} numberOfLines={1}>{card.nameZh}</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.cardWrap}>
          <CardView card={card} orientation="upright" faceUp />
        </View>

        <Text style={styles.nameEn}>{card.nameEn}</Text>

        {/* 元素 / 占星 */}
        <View style={styles.metaRow}>
          <View style={[styles.elementChip, { borderColor: elementColor }]}>
            <Text style={[styles.elementText, { color: elementColor }]}>{card.element}</Text>
          </View>
          {astroTail ? <Text style={styles.astroText}>{astroTail}</Text> : null}
          <Text style={styles.natureText}>{ELEMENT_NATURE[card.element]}</Text>
        </View>

        {/* 正位 */}
        <Section
          label="正位"
          labelColor={colors.gold}
          keywords={card.keywordsUpright}
          meaning={card.meaningUpright}
        />
        {/* 逆位 */}
        <Section
          label="逆位"
          labelColor={colors.reversed}
          keywords={card.keywordsReversed}
          meaning={card.meaningReversed}
        />

        <ShareActions getText={() => formatCardText(cardId)} />
      </ScrollView>
    </SafeAreaView>
  );
}

function Section({
  label, labelColor, keywords, meaning,
}: { label: string; labelColor: string; keywords: string[]; meaning: string }) {
  return (
    <View style={styles.section}>
      <Text style={[styles.sectionLabel, { color: labelColor }]}>✦ {label}</Text>
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
  headerTitle: { color: colors.gold, fontSize: fontSize.bodyLarge, fontWeight: '700', flex: 1, textAlign: 'center' },
  headerSpacer: { width: 50 },
  scroll: { padding: spacing.lg, paddingBottom: spacing.xxl },
  cardWrap: { alignItems: 'center', marginBottom: spacing.sm },
  nameEn: {
    color: colors.textMuted,
    fontSize: fontSize.caption,
    fontStyle: 'italic',
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flexWrap: 'wrap',
    marginBottom: spacing.lg,
  },
  elementChip: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  elementText: { fontSize: 13, fontWeight: '700' },
  astroText: {
    color: colors.textSecondary,
    fontSize: fontSize.body,
    marginRight: spacing.sm,
    letterSpacing: 0.5,
  },
  natureText: { color: colors.textMuted, fontSize: fontSize.caption },
  section: {
    backgroundColor: colors.bgCard,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderLeftWidth: 3,
    borderLeftColor: colors.border,
  },
  sectionLabel: {
    fontSize: fontSize.bodyLarge,
    fontWeight: '700',
    letterSpacing: 2,
    marginBottom: spacing.sm,
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
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  emptyText: { color: colors.textMuted, fontSize: fontSize.body },
});
