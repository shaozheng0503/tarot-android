// 牌面 + 牌背:3D 翻牌动画(rotateY 0→180°)
// 翻牌瞬间附带光晕闪烁(scale + opacity 闪光)
import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ViewStyle, Pressable } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  withDelay,
  Easing,
  withSpring,
} from 'react-native-reanimated';
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
  /** 翻牌延迟(ms),用于多张牌依次翻开 */
  flipDelay?: number;
}

const NORMAL = { w: 120, h: 200 };
const SMALL = { w: 80, h: 130 };

export function CardView({ card, orientation, faceUp, onPress, small, style, flipDelay = 0 }: Props) {
  const dim = small ? SMALL : NORMAL;
  const isReversed = orientation === 'reversed';
  const accent = getSuitColor(card.suit);

  // 翻牌角度:0 = 牌背,180 = 牌面
  const rotation = useSharedValue(faceUp ? 180 : 0);
  // 闪光效果:翻牌瞬间 0 → 1 → 0
  const flash = useSharedValue(0);
  // 入场:scale 0.6 → 1
  const appear = useSharedValue(0);

  useEffect(() => {
    // 入场动画
    appear.value = withDelay(
      flipDelay,
      withSpring(1, { damping: 12, stiffness: 180, mass: 0.6 }),
    );
  }, [flipDelay, appear]);

  useEffect(() => {
    if (faceUp) {
      // 翻牌(延迟以错开)
      rotation.value = withDelay(
        flipDelay,
        withTiming(180, { duration: 800, easing: Easing.inOut(Easing.cubic) }),
      );
      // 翻完瞬间闪光
      flash.value = withDelay(
        flipDelay + 400,
        withSequence(
          withTiming(1, { duration: 250, easing: Easing.out(Easing.cubic) }),
          withTiming(0, { duration: 500, easing: Easing.in(Easing.cubic) }),
        ),
      );
    } else {
      rotation.value = withTiming(0, { duration: 400 });
    }
  }, [faceUp, flipDelay, rotation, flash]);

  const wrapperStyle = useAnimatedStyle(() => ({
    transform: [
      { perspective: 1200 },
      { rotateY: `${rotation.value}deg` },
      { scale: 0.85 + appear.value * 0.15 },
    ],
    opacity: appear.value,
  }));

  const flashStyle = useAnimatedStyle(() => ({
    opacity: flash.value * 0.85,
  }));

  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      style={({ pressed }) => [
        { width: dim.w, height: dim.h },
        pressed && onPress ? { transform: [{ scale: 0.95 }] } : null,
        style,
      ]}
    >
      <Animated.View style={[styles.flipWrap, { width: dim.w, height: dim.h }, wrapperStyle]}>
        {/* 牌背(rotation 0) */}
        <View style={[styles.face, styles.absolute]}>
          <CardBack small={small} />
        </View>

        {/* 牌面(rotation 180) */}
        <View style={[styles.face, styles.absolute, { transform: [{ rotateY: '180deg' }] }]}>
          <View style={[styles.card, small ? styles.cardSmall : styles.cardNormal, { borderColor: accent }]}>
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
          </View>
        </View>

        {/* 翻牌闪光层(覆盖在牌面之上) */}
        <Animated.View
          pointerEvents="none"
          style={[
            styles.absolute,
            styles.flashLayer,
            flashStyle,
          ]}
        />
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  flipWrap: {
    position: 'relative',
  },
  face: {
    backfaceVisibility: 'hidden',
  },
  absolute: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  flashLayer: {
    backgroundColor: '#fff8e7',
    borderRadius: radius.card,
  },
  card: {
    flex: 1,
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
    width: '100%',
    height: '100%',
  },
  cardSmall: {
    width: '100%',
    height: '100%',
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
