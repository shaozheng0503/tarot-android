// 首页「今日运势」入口横幅。不直接揭晓牌面,点击进入后再翻牌,保留仪式感。
import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { colors, fontSize, radius, spacing } from '../theme/colors';
import { dateKey } from '../utils/dailyCard';
import { useDailyStore } from '../store/useDailyStore';

interface Props {
  onPress: () => void;
}

export function DailyBanner({ onPress }: Props) {
  const today = dateKey(new Date());
  const revealedToday = useDailyStore(s => Boolean(s.revealed[today]));
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={revealedToday ? '今日运势,今天已翻开,点击回看' : '今日运势,翻开今天的一张牌'}
      style={({ pressed }) => [styles.banner, pressed && styles.pressed]}
    >
      <View style={styles.badge}>
        <Text style={styles.badgeIcon}>{revealedToday ? '✓' : '✦'}</Text>
      </View>
      <View style={styles.content}>
        <Text style={styles.title}>今日运势</Text>
        <Text style={styles.subtitle}>
          {revealedToday ? `${today} · 今天已翻开,点击回看` : `${today} · 翻开属于今天的一张牌`}
        </Text>
      </View>
      <Text style={styles.arrow}>→</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.bgCard,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.gold,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.xl,
  },
  pressed: { opacity: 0.8 },
  badge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.bgDeep,
    borderWidth: 1,
    borderColor: colors.goldDark,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  badgeIcon: {
    color: colors.goldBright,
    fontSize: 20,
    textShadowColor: colors.gold,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
  },
  content: { flex: 1 },
  title: {
    color: colors.goldBright,
    fontSize: fontSize.bodyLarge,
    fontWeight: '700',
    letterSpacing: 1,
  },
  subtitle: {
    color: colors.textSecondary,
    fontSize: fontSize.caption,
    marginTop: 2,
  },
  arrow: {
    color: colors.gold,
    fontSize: fontSize.title,
    marginLeft: spacing.sm,
  },
});
