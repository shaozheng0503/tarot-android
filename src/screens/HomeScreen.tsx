// 首页:选择牌阵 + 输入问题
import React, { useState } from 'react';
import {
  View, Text, TextInput, Pressable, StyleSheet,
  ScrollView, KeyboardAvoidingView, Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { CompositeScreenProps } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { colors, fontSize, radius, spacing } from '../theme/colors';
import { SPREADS, getSpread } from '../data/spreads';
import type { RootStackParamList, MainTabParamList } from '../types';

type Props = CompositeScreenProps<
  BottomTabScreenProps<MainTabParamList, 'HomeTab'>,
  NativeStackScreenProps<RootStackParamList>
>;

export function HomeScreen({ navigation }: Props) {
  const [question, setQuestion] = useState('');

  const handleStart = (spreadType: 'single' | 'three-card') => {
    navigation.navigate('Reading', {
      spreadType,
      question: question.trim() || undefined,
    });
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.heroBlock}>
            <Text style={styles.brand}>✦ 塔罗 ✦</Text>
            <Text style={styles.tagline}>让直觉为你揭晓答案</Text>
          </View>

          <View style={styles.questionBlock}>
            <Text style={styles.label}>想了解的事情(可选)</Text>
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
          </View>

          <Text style={styles.label}>选择牌阵</Text>
          {(Object.values(SPREADS)).map(spread => (
            <Pressable
              key={spread.type}
              onPress={() => handleStart(spread.type)}
              style={({ pressed }) => [
                styles.spreadCard,
                pressed && styles.spreadCardPressed,
              ]}
            >
              <View style={styles.spreadHeader}>
                <Text style={styles.spreadName}>{spread.nameZh}</Text>
                <Text style={styles.spreadBadge}>{spread.cardCount} 张</Text>
              </View>
              <Text style={styles.spreadDesc}>{spread.description}</Text>
              <Text style={styles.spreadArrow}>开始 →</Text>
            </Pressable>
          ))}

          <Text style={styles.footer}>
            78 张全牌库 · 正逆位 · 解读内置
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.bgPrimary,
  },
  scroll: {
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  heroBlock: {
    alignItems: 'center',
    marginVertical: spacing.xl,
  },
  brand: {
    color: colors.gold,
    fontSize: fontSize.display,
    fontWeight: '300',
    letterSpacing: 8,
    textShadowColor: colors.goldDark,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
  },
  tagline: {
    color: colors.textSecondary,
    fontSize: fontSize.body,
    marginTop: spacing.sm,
    letterSpacing: 2,
  },
  questionBlock: {
    marginBottom: spacing.lg,
  },
  label: {
    color: colors.gold,
    fontSize: fontSize.body,
    fontWeight: '600',
    marginBottom: spacing.sm,
    letterSpacing: 1,
  },
  input: {
    backgroundColor: colors.bgCard,
    borderRadius: radius.md,
    padding: spacing.md,
    color: colors.textPrimary,
    fontSize: fontSize.body,
    minHeight: 80,
    borderWidth: 1,
    borderColor: colors.border,
  },
  spreadCard: {
    backgroundColor: colors.bgCard,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  spreadCardPressed: {
    backgroundColor: colors.bgDeep,
    borderColor: colors.gold,
  },
  spreadHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  spreadName: {
    color: colors.goldBright,
    fontSize: fontSize.title,
    fontWeight: '700',
  },
  spreadBadge: {
    color: colors.bgPrimary,
    backgroundColor: colors.gold,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radius.sm,
    fontSize: fontSize.caption,
    fontWeight: '700',
    overflow: 'hidden',
  },
  spreadDesc: {
    color: colors.textSecondary,
    fontSize: fontSize.body,
    lineHeight: 20,
    marginBottom: spacing.sm,
  },
  spreadArrow: {
    color: colors.gold,
    fontSize: fontSize.body,
    textAlign: 'right',
  },
  footer: {
    color: colors.textMuted,
    fontSize: fontSize.caption,
    textAlign: 'center',
    marginTop: spacing.lg,
    letterSpacing: 1,
  },
});
