// 牌面:程序化渲染(无图片依赖)
// 显示: 顶部花色符号 + 牌名 + 牌号 + 中央符号 + 底部解读预览
import React from 'react';
import { View, Text, StyleSheet, ViewStyle, Pressable } from 'react-native';
import { colors, getSuitColor, radius, fontSize, spacing } from '../theme/colors';
import type { TarotCard, Orientation } from '../types';
import { CardBack } from './CardBack';

interface Props {
  card: TarotCard;
  orientation: Orientation;
  faceUp: boolean;
  onPress?: () => void;
  small?: boolean;
  style?: ViewStyle;
}

export function CardView({ card, orientation, faceUp, onPress, small, style }: Props) {
  const isReversed = orientation === 'reversed';
  const accent = getSuitColor(card.suit);

  if (!faceUp) {
    return (
      <Pressable onPress={onPress} disabled={!onPress}>
        <CardBack style={style} small={small} />
      </Pressable>
    );
  }

  const dim = small ? styles.cardSmall : styles.cardNormal;
  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      style={({ pressed }) => [
        styles.card,
        dim,
        { borderColor: accent },
        pressed && onPress ? { transform: [{ scale: 0.97 }] } : null,
        style,
      ]}
    >
      {/* 顶部条:符号 + 牌名 */}
      <View style={styles.topRow}>
        <Text style={[styles.symbol, small && styles.symbolSmall, { color: accent }]}>
          {card.symbol}
        </Text>
        <View style={styles.nameWrap}>
          <Text style={[styles.nameZh, small && styles.nameZhSmall]} numberOfLines={1}>
            {card.nameZh}
          </Text>
          {!small && (
            <Text style={styles.nameEn} numberOfLines={1}>{card.nameEn}</Text>
          )}
        </View>
        <Text style={[styles.symbol, small && styles.symbolSmall, { color: accent }]}>
          {card.symbol}
        </Text>
      </View>

      {/* 牌号 */}
      <Text style={[styles.number, small && styles.numberSmall, { color: accent }]}>
        {card.arcana === 'major' ? card.number : `${card.number}`}
      </Text>

      {/* 中央主符号 */}
      <View style={styles.centerSymbol}>
        <Text
          style={[
            styles.bigSymbol,
            small && styles.bigSymbolSmall,
            { color: accent, textShadowColor: accent },
          ]}
        >
          {card.symbol}
        </Text>
      </View>

      {/* 底部条:正/逆位标记 */}
      <View style={styles.bottomRow}>
        <Text style={[styles.orientation, isReversed && { color: colors.reversed }]}>
          {isReversed ? '✦ 逆位 ✦' : '✦ 正位 ✦'}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.bgCard,
    borderRadius: radius.card,
    borderWidth: 2,
    padding: spacing.sm,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 8,
  },
  cardNormal: {
    width: 120,
    height: 200,
  },
  cardSmall: {
    width: 80,
    height: 130,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  nameWrap: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  nameZh: {
    color: colors.textPrimary,
    fontSize: fontSize.bodyLarge,
    fontWeight: '700',
  },
  nameZhSmall: {
    fontSize: fontSize.body,
  },
  nameEn: {
    color: colors.textMuted,
    fontSize: 9,
    fontStyle: 'italic',
  },
  symbol: {
    fontSize: 18,
  },
  symbolSmall: {
    fontSize: 14,
  },
  number: {
    fontSize: fontSize.body,
    textAlign: 'center',
    marginTop: 2,
    fontWeight: '600',
  },
  numberSmall: {
    fontSize: fontSize.caption,
    marginTop: 0,
  },
  centerSymbol: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bigSymbol: {
    fontSize: 64,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 12,
  },
  bigSymbolSmall: {
    fontSize: 36,
    textShadowRadius: 8,
  },
  bottomRow: {
    alignItems: 'center',
  },
  orientation: {
    color: colors.gold,
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 1,
  },
});
