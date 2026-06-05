// 首页:呼吸 logo + 问题输入 + 罗马数字牌阵卡 + 错开入场动画
import React, { useEffect, useState } from 'react';
import {
  View, Text, TextInput, Pressable, StyleSheet,
  ScrollView, KeyboardAvoidingView, Platform, StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  withSequence,
  withDelay,
  withSpring,
  Easing,
} from 'react-native-reanimated';
import type { CompositeScreenProps } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { colors, fontSize, radius, spacing } from '../theme/colors';
import { SPREADS, SPREAD_ORDER } from '../data/spreads';
import { DailyBanner } from '../components/DailyBanner';
import { useReduceMotion } from '../hooks/useReduceMotion';
import type { RootStackParamList, MainTabParamList, SpreadType } from '../types';

type Props = CompositeScreenProps<
  BottomTabScreenProps<MainTabParamList, 'HomeTab'>,
  NativeStackScreenProps<RootStackParamList>
>;

const ROMAN: Record<number, string> = {
  1: 'I', 2: 'II', 3: 'III', 4: 'IV', 5: 'V',
  6: 'VI', 7: 'VII', 8: 'VIII', 9: 'IX', 10: 'X',
};

export function HomeScreen({ navigation }: Props) {
  const [question, setQuestion] = useState('');

  const handleStart = (spreadType: SpreadType) => {
    navigation.navigate('Reading', {
      spreadType,
      question: question.trim() || undefined,
    });
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor={colors.bgPrimary} />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <BreathingLogo />

          <AnimatedEntry delay={300}>
            <Text style={styles.tagline}>让 直 觉 为 你 揭 晓 答 案</Text>
          </AnimatedEntry>

          <AnimatedEntry delay={400}>
            <DailyBanner onPress={() => navigation.navigate('Daily')} />
          </AnimatedEntry>

          <AnimatedEntry delay={450}>
            <View style={styles.questionBlock}>
              <View style={styles.labelRow}>
                <Text style={styles.labelIcon}>✎</Text>
                <Text style={styles.label}>想了解的事情</Text>
                <Text style={styles.labelOptional}>·可选</Text>
              </View>
              <View style={styles.inputWrap}>
                <TextInput
                  style={styles.input}
                  placeholder="默念你的问题,或留空让牌面说话..."
                  placeholderTextColor={colors.textMuted}
                  value={question}
                  onChangeText={setQuestion}
                  multiline
                  maxLength={200}
                  textAlignVertical="top"
                />
                {question.length > 0 && (
                  <View style={styles.counter}>
                    <Text style={styles.counterText}>{question.length}/200</Text>
                  </View>
                )}
              </View>
            </View>
          </AnimatedEntry>

          <AnimatedEntry delay={600}>
            <View style={styles.labelRow}>
              <Text style={styles.labelIcon}>✦</Text>
              <Text style={styles.label}>选择牌阵</Text>
            </View>
          </AnimatedEntry>

          {SPREAD_ORDER.map((type, idx) => {
            const spread = SPREADS[type];
            return (
              <AnimatedEntry key={spread.type} delay={750 + idx * 120}>
                <SpreadCard
                  roman={ROMAN[spread.cardCount] || String(spread.cardCount)}
                  name={spread.nameZh}
                  badge={`${spread.cardCount} 张`}
                  description={spread.description}
                  onPress={() => handleStart(spread.type)}
                />
              </AnimatedEntry>
            );
          })}

          <AnimatedEntry delay={1500}>
            <View style={styles.footerRow}>
              <View style={styles.divider} />
              <Text style={styles.footer}>78 张全牌库 · 正逆位 · 解读内置</Text>
              <View style={styles.divider} />
            </View>
          </AnimatedEntry>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// 呼吸 logo:中央 ✦ 缩放/透明度呼吸 + 外圈 6 颗小星星慢速反向旋转
function BreathingLogo() {
  const breath = useSharedValue(0);
  const haloRot = useSharedValue(0);
  const appear = useSharedValue(0);
  const reduceMotion = useReduceMotion();

  useEffect(() => {
    if (reduceMotion) {
      appear.value = 1;
      breath.value = 0.5;
      return;
    }
    appear.value = withTiming(1, { duration: 800 });
    breath.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 1800, easing: Easing.inOut(Easing.quad) }),
        withTiming(0, { duration: 1800, easing: Easing.inOut(Easing.quad) }),
      ),
      -1,
      false,
    );
    haloRot.value = withRepeat(
      withTiming(360, { duration: 24000, easing: Easing.linear }),
      -1,
      false,
    );
  }, [appear, breath, haloRot, reduceMotion]);

  const centerStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: 0.9 + breath.value * 0.18 },
    ],
    opacity: appear.value,
  }));
  const haloStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${haloRot.value}deg` }],
    opacity: 0.7 + breath.value * 0.3,
  }));
  const glowStyle = useAnimatedStyle(() => {
    const scale = 1 + breath.value * 0.4;
    return {
      transform: [{ scale }],
      opacity: 0.18 + breath.value * 0.22,
    };
  });

  // 6 颗小星星的角度
  const stars = Array.from({ length: 6 }, (_, i) => (i * 60 * Math.PI) / 180);
  const radius = 60;

  return (
    <View style={logoStyles.wrap}>
      {/* 最外层光晕 */}
      <Animated.View style={[logoStyles.outerGlow, glowStyle]} />
      {/* 旋转的星星环 */}
      <Animated.View style={[logoStyles.haloRing, haloStyle]}>
        {stars.map((angle, i) => {
          const x = Math.cos(angle) * radius;
          const y = Math.sin(angle) * radius;
          return (
            <Text
              key={i}
              style={[
                logoStyles.starOnRing,
                { left: x + 30, top: y + 30 },
              ]}
            >
              ✦
            </Text>
          );
        })}
      </Animated.View>
      {/* 中央 logo ✦ */}
      <Animated.View style={centerStyle}>
        <Text style={logoStyles.brand}>✦</Text>
        <Text style={logoStyles.brandText}>塔罗</Text>
      </Animated.View>
    </View>
  );
}

// 入场动画包装器:从下方渐入
function AnimatedEntry({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const t = useSharedValue(0);
  const reduceMotion = useReduceMotion();
  useEffect(() => {
    if (reduceMotion) {
      t.value = 1;
      return;
    }
    t.value = withDelay(
      delay,
      withSpring(1, { damping: 14, stiffness: 100, mass: 0.8 }),
    );
  }, [delay, t, reduceMotion]);
  const style = useAnimatedStyle(() => ({
    opacity: t.value,
    transform: [{ translateY: (1 - t.value) * 20 }],
  }));
  return <Animated.View style={style}>{children}</Animated.View>;
}

interface SpreadCardProps {
  roman: string;
  name: string;
  badge: string;
  description: string;
  onPress: () => void;
}

function SpreadCard({ roman, name, badge, description, onPress }: SpreadCardProps) {
  const pressed = useSharedValue(0);
  const pressStyle = useAnimatedStyle(() => ({
    transform: [{ scale: 1 - pressed.value * 0.02 }],
  }));
  return (
    <Pressable
      onPressIn={() => {
        pressed.value = withTiming(1, { duration: 100 });
      }}
      onPressOut={() => {
        pressed.value = withTiming(0, { duration: 200 });
      }}
      onPress={onPress}
    >
      <Animated.View style={[styles.spreadCard, pressStyle]}>
        {/* 左侧罗马数字 */}
        <View style={styles.romanCol}>
          <Text style={styles.roman}>{roman}</Text>
        </View>
        {/* 中间内容 */}
        <View style={styles.spreadContent}>
          <View style={styles.spreadHeader}>
            <Text style={styles.spreadName} numberOfLines={1}>{name}</Text>
            <View style={styles.spreadBadge}>
              <Text style={styles.spreadBadgeText}>{badge}</Text>
            </View>
          </View>
          <Text style={styles.spreadDesc} numberOfLines={2}>{description}</Text>
          <Text style={styles.spreadArrow}>开始 →</Text>
        </View>
      </Animated.View>
    </Pressable>
  );
}

const logoStyles = StyleSheet.create({
  wrap: {
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.lg,
  },
  outerGlow: {
    position: 'absolute',
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: colors.gold,
    opacity: 0.18,
  },
  haloRing: {
    position: 'absolute',
    width: 120,
    height: 120,
    alignItems: 'center',
    justifyContent: 'center',
  },
  starOnRing: {
    position: 'absolute',
    color: colors.gold,
    fontSize: 12,
    opacity: 0.6,
    textShadowColor: colors.gold,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 4,
  },
  brand: {
    color: colors.gold,
    fontSize: 80,
    fontWeight: '300',
    textAlign: 'center',
    textShadowColor: colors.gold,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 16,
  },
  brandText: {
    color: colors.gold,
    fontSize: fontSize.title,
    fontWeight: '300',
    textAlign: 'center',
    letterSpacing: 12,
    marginTop: -10,
    textShadowColor: colors.goldDark,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 6,
  },
});

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.bgPrimary,
  },
  scroll: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  tagline: {
    color: colors.textSecondary,
    fontSize: fontSize.body,
    textAlign: 'center',
    letterSpacing: 4,
    marginBottom: spacing.xl,
  },
  questionBlock: {
    marginBottom: spacing.xl,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  labelIcon: {
    color: colors.gold,
    fontSize: fontSize.bodyLarge,
    marginRight: 6,
  },
  label: {
    color: colors.gold,
    fontSize: fontSize.body,
    fontWeight: '600',
    letterSpacing: 1,
  },
  labelOptional: {
    color: colors.textMuted,
    fontSize: fontSize.caption,
    marginLeft: 6,
  },
  inputWrap: {
    position: 'relative',
  },
  input: {
    backgroundColor: colors.bgCard,
    borderRadius: radius.md,
    padding: spacing.md,
    paddingRight: 50,
    color: colors.textPrimary,
    fontSize: fontSize.body,
    minHeight: 80,
    borderWidth: 1,
    borderColor: colors.border,
    lineHeight: 22,
  },
  counter: {
    position: 'absolute',
    right: spacing.md,
    bottom: spacing.sm,
  },
  counterText: {
    color: colors.textMuted,
    fontSize: 11,
  },
  spreadCard: {
    flexDirection: 'row',
    backgroundColor: colors.bgCard,
    borderRadius: radius.lg,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  romanCol: {
    width: 64,
    backgroundColor: colors.bgDeep,
    alignItems: 'center',
    justifyContent: 'center',
    borderRightWidth: 1,
    borderRightColor: colors.border,
  },
  roman: {
    color: colors.gold,
    fontSize: 26,
    fontWeight: '300',
    letterSpacing: 1,
  },
  spreadContent: {
    flex: 1,
    padding: spacing.md,
  },
  spreadHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  spreadName: {
    flex: 1,
    color: colors.goldBright,
    fontSize: fontSize.title,
    fontWeight: '700',
  },
  spreadBadge: {
    marginLeft: spacing.sm,
    backgroundColor: colors.gold,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radius.sm,
  },
  spreadBadgeText: {
    color: colors.bgPrimary,
    fontSize: fontSize.caption,
    fontWeight: '700',
  },
  spreadDesc: {
    color: colors.textSecondary,
    fontSize: fontSize.body,
    lineHeight: 20,
    marginBottom: spacing.xs,
  },
  spreadArrow: {
    color: colors.gold,
    fontSize: fontSize.body,
    textAlign: 'right',
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.lg,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: colors.divider,
  },
  footer: {
    color: colors.textMuted,
    fontSize: fontSize.caption,
    textAlign: 'center',
    marginHorizontal: spacing.md,
    letterSpacing: 1,
  },
});
