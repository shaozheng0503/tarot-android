// 洗牌动画:1.5s 内多张牌背依次闪烁,营造"洗牌"效果
import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  withDelay,
  withRepeat,
  Easing,
} from 'react-native-reanimated';
import { CardBack } from './CardBack';

interface Props {
  active: boolean;
  onComplete?: () => void;
}

const SHUFFLE_DURATION = 1500;

export function ShuffleDeck({ active, onComplete }: Props) {
  // 3 张牌背错位堆叠,各自做位移+旋转动画
  const offset1 = useSharedValue(0);
  const offset2 = useSharedValue(0);
  const offset3 = useSharedValue(0);
  const opacity = useSharedValue(0);

  useEffect(() => {
    if (!active) {
      opacity.value = 0;
      offset1.value = 0;
      offset2.value = 0;
      offset3.value = 0;
      return;
    }
    opacity.value = withTiming(1, { duration: 200 });

    // 每张牌做一次 0 → 大位移 → 0 的动画,错开时间
    const anim = (val: typeof offset1) => {
      val.value = withSequence(
        withTiming(-30, { duration: 200, easing: Easing.out(Easing.cubic) }),
        withTiming(30, { duration: 400, easing: Easing.inOut(Easing.cubic) }),
        withTiming(-15, { duration: 300, easing: Easing.inOut(Easing.cubic) }),
        withTiming(15, { duration: 300, easing: Easing.inOut(Easing.cubic) }),
        withTiming(0, { duration: 200, easing: Easing.in(Easing.cubic) }),
      );
    };
    anim(offset1);
    anim(offset2);
    anim(offset3);

    const timer = setTimeout(() => {
      opacity.value = withTiming(0, { duration: 300 });
      onComplete?.();
    }, SHUFFLE_DURATION);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  const wrapStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));
  const a1 = useAnimatedStyle(() => ({
    transform: [
      { translateX: offset1.value },
      { rotate: `${offset1.value * 0.5}deg` },
    ],
  }));
  const a2 = useAnimatedStyle(() => ({
    transform: [
      { translateX: offset2.value * 0.7 },
      { rotate: `${offset2.value * 0.3}deg` },
    ],
  }));
  const a3 = useAnimatedStyle(() => ({
    transform: [
      { translateX: offset3.value * 0.5 },
      { rotate: `${offset3.value * 0.2}deg` },
    ],
  }));

  if (!active) return null;

  return (
    <Animated.View style={[styles.wrap, wrapStyle]} pointerEvents="none">
      <Animated.View style={[styles.cardPos, styles.layer3, a3]}>
        <CardBack small />
      </Animated.View>
      <Animated.View style={[styles.cardPos, styles.layer2, a2]}>
        <CardBack small />
      </Animated.View>
      <Animated.View style={[styles.cardPos, styles.layer1, a1]}>
        <CardBack small />
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    height: 140,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardPos: {
    position: 'absolute',
  },
  layer1: { zIndex: 3 },
  layer2: { zIndex: 2, transform: [{ translateX: -6 }, { translateY: 4 }] },
  layer3: { zIndex: 1, transform: [{ translateX: 6 }, { translateY: -4 }] },
});
