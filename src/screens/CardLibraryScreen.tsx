// 牌库图鉴:按大阿卡纳 + 四花色分组,浏览全部 78 张牌。
// 使用轻量静态 chip(不带翻牌动画),点击进入单卡详情。
import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { CompositeScreenProps } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { colors, fontSize, radius, spacing, getSuitColor, getElementColor } from '../theme/colors';
import { CARD_GROUPS } from '../data/cards';
import type { TarotCard, RootStackParamList, MainTabParamList } from '../types';

type Props = CompositeScreenProps<
  BottomTabScreenProps<MainTabParamList, 'LibraryTab'>,
  NativeStackScreenProps<RootStackParamList>
>;

export function CardLibraryScreen({ navigation }: Props) {
  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>牌库图鉴</Text>
        <Text style={styles.count}>78 张</Text>
      </View>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {CARD_GROUPS.map(group => (
          <View key={group.title} style={styles.group}>
            <Text style={styles.groupTitle}>{group.title}</Text>
            <View style={styles.grid}>
              {group.cards.map(card => (
                <CardChip
                  key={card.id}
                  card={card}
                  onPress={() => navigation.navigate('CardDetail', { cardId: card.id })}
                />
              ))}
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

function CardChip({ card, onPress }: { card: TarotCard; onPress: () => void }) {
  const accent = getSuitColor(card.suit);
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${card.nameZh},元素${card.element}`}
      style={({ pressed }) => [styles.chip, { borderColor: accent }, pressed && styles.pressed]}
    >
      <View style={[styles.elementDot, { backgroundColor: getElementColor(card.element) }]}>
        <Text style={styles.elementDotText}>{card.element}</Text>
      </View>
      <Text style={[styles.chipSymbol, { color: accent }]}>{card.symbol}</Text>
      <Text style={styles.chipName} numberOfLines={1}>{card.nameZh}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bgPrimary },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  title: {
    color: colors.gold,
    fontSize: fontSize.heading,
    fontWeight: '300',
    letterSpacing: 3,
  },
  count: { color: colors.textMuted, fontSize: fontSize.caption },
  scroll: { paddingHorizontal: spacing.md, paddingBottom: spacing.xxl },
  group: { marginBottom: spacing.lg },
  groupTitle: {
    color: colors.goldBright,
    fontSize: fontSize.bodyLarge,
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: spacing.sm,
    marginLeft: spacing.xs,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  chip: {
    width: 80,
    height: 86,
    margin: spacing.xs,
    borderRadius: radius.md,
    borderWidth: 1,
    backgroundColor: colors.bgCard,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  pressed: { opacity: 0.7, backgroundColor: colors.bgDeep },
  elementDot: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 16,
    height: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  elementDotText: {
    color: colors.bgPrimary,
    fontSize: 9,
    fontWeight: '700',
  },
  chipSymbol: {
    fontSize: 26,
    marginBottom: 4,
    textShadowColor: colors.bgDeep,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 6,
  },
  chipName: {
    color: colors.textPrimary,
    fontSize: fontSize.caption,
    fontWeight: '600',
    textAlign: 'center',
  },
});
