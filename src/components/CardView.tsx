// 牌面 + 牌背:3D 翻牌动画(rotateY 0→180°)
// 翻牌瞬间附带光晕闪烁(scale + opacity 闪光)
import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ViewStyle, Pressable, Image } from 'react-native';
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
import { cardGlyph } from '../data/correspondences';
import { getCardImage } from '../data/cardImages';
import { useReduceMotion } from '../hooks/useReduceMotion';

interface Props {
  card: TarotCard;
  orientation: Orientation;
  faceUp: boolean;
  onPress?: () => void;
  small?: boolean;
  /** 更小的尺寸,用于 5 张以上的网格牌阵 */
  tiny?: boolean;
  style?: ViewStyle;
  /** 翻牌延迟(ms),用于多张牌依次翻开 */
  flipDelay?: number;
}

const NORMAL = { w: 120, h: 200 };
const SMALL = { w: 80, h: 130 };
const TINY = { w: 62, h: 102 };

export function CardView({ card, orientation, faceUp, onPress, small, tiny, style, flipDelay = 0 }: Props) {
  const dim = tiny ? TINY : small ? SMALL : NORMAL;
  const compact = small || tiny;
  const isReversed = orientation === 'reversed';
  const accent = getSuitColor(card.suit);
  const reduceMotion = useReduceMotion();
  const glyph = cardGlyph(card);
  // 小阿卡纳 Ace–10 用花色 pip 点阵呈现(仅正常尺寸,避免小牌拥挤)
  const showPips = card.arcana === 'minor' && card.number >= 1 && card.number <= 10 && !compact;
  // 优先使用真实牌图(RWS);缺图则回退到程序化牌面
  const image = getCardImage(card.id);

  const a11yLabel = faceUp
    ? `${card.nameZh},${isReversed ? '逆位' : '正位'},元素${card.element}${card.astro ? `,${card.astro}` : ''}`
    : '未翻开的塔罗牌';

  // 翻牌角度:0 = 牌背,180 = 牌面
  const rotation = useSharedValue(faceUp ? 180 : 0);
  // 闪光效果:翻牌瞬间 0 → 1 → 0
  const flash = useSharedValue(0);
  // 入场:scale 0.6 → 1
  const appear = useSharedValue(0);

  useEffect(() => {
    // 入场动画(减少动效时直接到位)
    if (reduceMotion) {
      appear.value = 1;
      return;
    }
    appear.value = withDelay(
      flipDelay,
      withSpring(1, { damping: 12, stiffness: 180, mass: 0.6 }),
    );
  }, [flipDelay, appear, reduceMotion]);

  useEffect(() => {
    // 减少动效:直接定位,不播放翻牌与闪光
    if (reduceMotion) {
      rotation.value = faceUp ? 180 : 0;
      flash.value = 0;
      return;
    }
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
  }, [faceUp, flipDelay, rotation, flash, reduceMotion]);

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
      accessible
      accessibilityRole={onPress ? 'button' : 'image'}
      accessibilityLabel={a11yLabel}
      style={({ pressed }) => [
        { width: dim.w, height: dim.h },
        pressed && onPress ? { transform: [{ scale: 0.95 }] } : null,
        style,
      ]}
    >
      <Animated.View style={[styles.flipWrap, { width: dim.w, height: dim.h }, wrapperStyle]}>
        {/* 牌背(rotation 0) */}
        <View style={[styles.face, styles.absolute]}>
          <CardBack small={compact} />
        </View>

        {/* 牌面(rotation 180):优先真实牌图,逆位旋转 180° */}
        <View style={[styles.face, styles.absolute, { transform: [{ rotateY: '180deg' }] }]}>
          {image ? (
            <Image
              source={image}
              resizeMode="cover"
              accessible={false}
              style={[styles.cardImage, { borderColor: accent }, isReversed && styles.reversedImage]}
            />
          ) : (
          <View style={[styles.card, { borderColor: accent }]}>
            {/* 顶部条:符号 + 牌名 */}
            <View style={styles.topRow}>
              <Text style={[styles.symbol, compact && styles.symbolSmall, { color: accent }]}>
                {glyph}
              </Text>
              <View style={styles.nameWrap}>
                <Text style={[styles.nameZh, compact && styles.nameZhSmall]} numberOfLines={1}>
                  {card.nameZh}
                </Text>
                {!compact && (
                  <Text style={styles.nameEn} numberOfLines={1}>{card.nameEn}</Text>
                )}
              </View>
              <Text style={[styles.symbol, compact && styles.symbolSmall, { color: accent }]}>
                {glyph}
              </Text>
            </View>

            {/* 牌号 */}
            <Text style={[styles.number, compact && styles.numberSmall, { color: accent }]}>
              {card.arcana === 'major' ? card.number : `${card.number}`}
            </Text>

            {/* 中央:小牌花色 pip 点阵 / 其它单字形 */}
            <View style={styles.centerSymbol}>
              {showPips ? (
                <MinorPips glyph={glyph} count={card.number} color={accent} />
              ) : (
                <Text
                  style={[
                    styles.bigSymbol,
                    compact && styles.bigSymbolSmall,
                    tiny && styles.bigSymbolTiny,
                    { color: accent, textShadowColor: accent },
                  ]}
                >
                  {glyph}
                </Text>
              )}
            </View>

            {/* 元素 / 占星(仅正常尺寸展示,避免小牌拥挤) */}
            {!compact && (
              <Text style={[styles.astro, { color: accent }]} numberOfLines={1}>
                {card.element}{card.astro ? ` · ${card.astro}` : ''}
              </Text>
            )}

            {/* 底部条:正/逆位标记 */}
            <View style={styles.bottomRow}>
              <Text style={[styles.orientation, isReversed && { color: colors.reversed }]}>
                {isReversed ? '✦ 逆位 ✦' : '✦ 正位 ✦'}
              </Text>
            </View>
          </View>
          )}
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

// 小阿卡纳点阵:Ace 用单个大字形,2–10 排成居中网格
function MinorPips({ glyph, count, color }: { glyph: string; count: number; color: string }) {
  if (count === 1) {
    return <Text style={[styles.pipAce, { color, textShadowColor: color }]}>{glyph}</Text>;
  }
  return (
    <View style={styles.pipGrid}>
      {Array.from({ length: count }).map((_, i) => (
        <Text key={i} style={[styles.pip, { color }]}>{glyph}</Text>
      ))}
    </View>
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
  cardImage: {
    width: '100%',
    height: '100%',
    borderRadius: radius.card,
    borderWidth: 2,
    backgroundColor: colors.bgCard,
  },
  reversedImage: {
    transform: [{ rotate: '180deg' }],
  },
  card: {
    flex: 1,
    width: '100%',
    height: '100%',
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
    fontSize: fontSize.caption,
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
    fontSize: 12,
  },
  number: {
    fontSize: fontSize.body,
    textAlign: 'center',
    marginTop: 2,
    fontWeight: '600',
  },
  numberSmall: {
    fontSize: 10,
    marginTop: 0,
  },
  centerSymbol: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bigSymbol: {
    fontSize: 56,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 12,
  },
  bigSymbolSmall: {
    fontSize: 34,
    textShadowRadius: 8,
  },
  bigSymbolTiny: {
    fontSize: 26,
    textShadowRadius: 6,
  },
  pipGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    maxWidth: 100,
  },
  pip: {
    fontSize: 20,
    marginHorizontal: 2,
    marginVertical: 1,
  },
  pipAce: {
    fontSize: 56,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 12,
  },
  astro: {
    fontSize: 10,
    textAlign: 'center',
    marginBottom: 2,
    letterSpacing: 0.5,
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
