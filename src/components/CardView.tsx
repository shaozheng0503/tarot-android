// 牌面 + 牌背:绕竖轴的 scaleX 翻牌(不依赖 backfaceVisibility,真图必定显示)。
// 翻到侧立(scaleX≈0)的瞬间切换正/反面内容,因此永远不会看到镜像或被裁掉的正面。
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ViewStyle, Pressable, Image } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
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
const HALF_MS = 230; // 翻到侧立用时(总翻牌 ≈ 2×)

export function CardView({ card, orientation, faceUp, onPress, small, tiny, style, flipDelay = 0 }: Props) {
  const dim = tiny ? TINY : small ? SMALL : NORMAL;
  const compact = small || tiny;
  const isReversed = orientation === 'reversed';
  const accent = getSuitColor(card.suit);
  const glyph = cardGlyph(card);
  const showPips = card.arcana === 'minor' && card.number >= 1 && card.number <= 10 && !compact;
  const image = getCardImage(card.id);
  const reduceMotion = useReduceMotion();

  const a11yLabel = faceUp
    ? `${card.nameZh},${isReversed ? '逆位' : '正位'},元素${card.element}${card.astro ? `,${card.astro}` : ''}`
    : '未翻开的塔罗牌';

  // showFront: 当前显示正面还是牌背(在翻牌侧立瞬间切换)
  const [showFront, setShowFront] = useState(faceUp);
  const flip = useSharedValue(faceUp ? 1 : 0); // 0=背面朝前,1=正面朝前
  const appear = useSharedValue(0);

  // 入场动画
  useEffect(() => {
    if (reduceMotion) { appear.value = 1; return; }
    appear.value = withDelay(flipDelay, withSpring(1, { damping: 12, stiffness: 180, mass: 0.6 }));
  }, [flipDelay, appear, reduceMotion]);

  // 翻牌:scaleX 1→0→1,到 0(侧立)时切换正反面内容
  useEffect(() => {
    if (reduceMotion) {
      flip.value = faceUp ? 1 : 0;
      setShowFront(faceUp);
      return;
    }
    let timer: ReturnType<typeof setTimeout> | undefined;
    if (faceUp) {
      flip.value = withDelay(flipDelay, withTiming(1, {
        duration: HALF_MS * 2,
        easing: Easing.inOut(Easing.cubic),
      }));
      timer = setTimeout(() => setShowFront(true), flipDelay + HALF_MS);
    } else {
      flip.value = withTiming(0, { duration: HALF_MS * 2, easing: Easing.inOut(Easing.cubic) });
      timer = setTimeout(() => setShowFront(false), HALF_MS);
    }
    return () => { if (timer) clearTimeout(timer); };
  }, [faceUp, flipDelay, flip, reduceMotion]);

  const animStyle = useAnimatedStyle(() => {
    // scaleX = |cos(flip·π)|:flip 0 或 1 时为 1(正对),0.5 时为 0(侧立)
    const sx = Math.abs(Math.cos(flip.value * Math.PI));
    return {
      opacity: appear.value,
      transform: [
        { perspective: 900 },
        { scale: 0.9 + appear.value * 0.1 },
        { scaleX: Math.max(0.002, sx) },
      ],
    };
  });

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
      <Animated.View style={[{ width: dim.w, height: dim.h }, animStyle]}>
        {showFront ? (
          image ? (
            <Image
              source={image}
              resizeMode="cover"
              accessible={false}
              style={[styles.cardImage, { borderColor: accent }, isReversed && styles.reversedImage]}
            />
          ) : (
            <View style={[styles.card, { borderColor: accent }]}>
              <View style={styles.topRow}>
                <Text style={[styles.symbol, compact && styles.symbolSmall, { color: accent }]}>{glyph}</Text>
                <View style={styles.nameWrap}>
                  <Text style={[styles.nameZh, compact && styles.nameZhSmall]} numberOfLines={1}>{card.nameZh}</Text>
                  {!compact && <Text style={styles.nameEn} numberOfLines={1}>{card.nameEn}</Text>}
                </View>
                <Text style={[styles.symbol, compact && styles.symbolSmall, { color: accent }]}>{glyph}</Text>
              </View>
              <Text style={[styles.number, compact && styles.numberSmall, { color: accent }]}>
                {card.arcana === 'major' ? card.number : `${card.number}`}
              </Text>
              <View style={styles.centerSymbol}>
                {showPips ? (
                  <MinorPips glyph={glyph} count={card.number} color={accent} />
                ) : (
                  <Text style={[styles.bigSymbol, compact && styles.bigSymbolSmall, tiny && styles.bigSymbolTiny, { color: accent, textShadowColor: accent }]}>{glyph}</Text>
                )}
              </View>
              {!compact && (
                <Text style={[styles.astro, { color: accent }]} numberOfLines={1}>
                  {card.element}{card.astro ? ` · ${card.astro}` : ''}
                </Text>
              )}
              <View style={styles.bottomRow}>
                <Text style={[styles.orientation, isReversed && { color: colors.reversed }]}>
                  {isReversed ? '✦ 逆位 ✦' : '✦ 正位 ✦'}
                </Text>
              </View>
            </View>
          )
        ) : (
          <CardBack small={compact} style={styles.fillSize} />
        )}
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
  fillSize: {
    width: '100%',
    height: '100%',
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
