// 洗牌动画:5 张牌背错位堆叠,扇形展开 + 交错旋转,2.0s
import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  Easing,
  type SharedValue,
} from 'react-native-reanimated';
import { CardBack } from './CardBack';
import { colors } from '../theme/colors';

interface Props {
  active: boolean;
  onComplete?: () => void;
}

const SHUFFLE_DURATION = 2000;
const NUM_CARDS = 5;

type CardState = { x: number; y: number; rot: number; scale: number };

export function ShuffleDeck({ active, onComplete }: Props) {
  // 每张牌一个 shared value(用 useSharedValue 固定 5 次,符合 hooks 规则)
  const s0 = useSharedValue<CardState>({ x: 0, y: 0, rot: 0, scale: 1 });
  const s1 = useSharedValue<CardState>({ x: 0, y: 0, rot: 0, scale: 1 });
  const s2 = useSharedValue<CardState>({ x: 0, y: 0, rot: 0, scale: 1 });
  const s3 = useSharedValue<CardState>({ x: 0, y: 0, rot: 0, scale: 1 });
  const s4 = useSharedValue<CardState>({ x: 0, y: 0, rot: 0, scale: 1 });
  const states = [s0, s1, s2, s3, s4];
  const opacity = useSharedValue(0);

  useEffect(() => {
    if (!active) {
      opacity.value = 0;
      states.forEach(t => { t.value = { x: 0, y: 0, rot: 0, scale: 1 }; });
      return;
    }
    opacity.value = withTiming(1, { duration: 200 });

    states.forEach((t, i) => {
      const seed = (i * 7919 + 13) % 100;
      const dir = i % 2 === 0 ? 1 : -1;
      const phase1X = dir * (40 + (seed % 30));
      const phase1Rot = dir * (15 + (seed % 10));
      const phase2X = -dir * (30 + (seed % 20));
      const phase2Rot = -dir * (10 + (seed % 8));

      t.value = withSequence(
        withTiming({ x: phase1X, y: -8, rot: phase1Rot, scale: 1 }, {
          duration: 300,
          easing: Easing.out(Easing.cubic),
        }),
        withTiming({ x: phase2X, y: 6, rot: phase2Rot, scale: 0.95 }, {
          duration: 450,
          easing: Easing.inOut(Easing.cubic),
        }),
        withTiming({ x: phase1X * 0.6, y: -4, rot: phase1Rot * 0.5, scale: 1.05 }, {
          duration: 450,
          easing: Easing.inOut(Easing.cubic),
        }),
        withTiming({ x: 0, y: 0, rot: 0, scale: 1 }, {
          duration: 800,
          easing: Easing.in(Easing.cubic),
        }),
      );
    });

    const timer = setTimeout(() => {
      opacity.value = withTiming(0, { duration: 250 });
      onComplete?.();
    }, SHUFFLE_DURATION);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  const wrapStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  if (!active) return null;

  return (
    <Animated.View style={[styles.wrap, wrapStyle]} pointerEvents="none">
      {states.map((t, i) => {
        const baseOffset = (i - (NUM_CARDS - 1) / 2) * 3;
        return (
          <CardLayer
            key={i}
            t={t}
            zIndex={NUM_CARDS - i}
            baseOffsetX={baseOffset}
            baseOffsetY={Math.abs(baseOffset) * 0.5}
          />
        );
      })}
      {/* 中心光晕 */}
      <View style={styles.glowCenter} />
    </Animated.View>
  );
}

interface LayerProps {
  t: SharedValue<CardState>;
  zIndex: number;
  baseOffsetX: number;
  baseOffsetY: number;
}

function CardLayer({ t, zIndex, baseOffsetX, baseOffsetY }: LayerProps) {
  const style = useAnimatedStyle(() => ({
    transform: [
      { translateX: t.value.x + baseOffsetX },
      { translateY: t.value.y + baseOffsetY },
      { rotate: `${t.value.rot}deg` },
      { scale: t.value.scale },
    ],
  }));
  return (
    <Animated.View
      style={[
        styles.cardPos,
        { zIndex },
        style,
      ]}
    >
      <CardBack small />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    height: 160,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardPos: {
    position: 'absolute',
  },
  glowCenter: {
    position: 'absolute',
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.gold,
    opacity: 0.15,
  },
});
