// ReadingScreen: 抽牌 + 翻牌动画 + 解读展示 + 保存历史
import React, { useEffect, useRef, useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import HapticFeedback from 'react-native-haptic-feedback';
import { colors, fontSize, radius, spacing } from '../theme/colors';
import { drawCards } from '../utils/shuffle';
import { genId } from '../utils/uuid';
import { ALL_CARDS, getCard } from '../data/cards';
import { getSpread } from '../data/spreads';
import { ShuffleDeck } from '../components/ShuffleDeck';
import { SpreadLayout } from '../components/SpreadLayout';
import { useHistoryStore } from '../store/useHistoryStore';
import type { DrawnCard, RootStackParamList, HistoryEntry } from '../types';

type Props = NativeStackScreenProps<RootStackParamList, 'Reading'>;

type Phase = 'idle' | 'shuffling' | 'revealing' | 'done';

export function ReadingScreen({ route, navigation }: Props) {
  const { spreadType, question } = route.params;
  const spread = getSpread(spreadType);
  const [phase, setPhase] = useState<Phase>('idle');
  const [drawn, setDrawn] = useState<DrawnCard[]>([]);
  const [faceUp, setFaceUp] = useState<boolean[]>([]);
  const [savedId, setSavedId] = useState<string | null>(null);
  const addEntry = useHistoryStore(s => s.addEntry);
  const startTimeRef = useRef<number>(0);
  const drawnRef = useRef<DrawnCard[]>([]);

  const startReading = () => {
    if (phase !== 'idle' && phase !== 'done') return;
    const cards = drawCards(ALL_CARDS, spread.cardCount, spread.positions);
    drawnRef.current = cards;
    setDrawn(cards);
    setFaceUp(cards.map(() => false));
    setSavedId(null);
    startTimeRef.current = Date.now();
    setPhase('shuffling');
    HapticFeedback.trigger('impactMedium');
  };

  // 洗牌完成 → 逐张翻牌
  const onShuffleComplete = () => {
    setPhase('revealing');
    const cards = drawnRef.current;
    cards.forEach((_, idx) => {
      setTimeout(() => {
        setFaceUp(prev => {
          const next = [...prev];
          next[idx] = true;
          return next;
        });
        HapticFeedback.trigger('selection');
      }, 250 + idx * 400);
    });
    // 最后一张翻完 → done
    setTimeout(() => {
      setPhase('done');
      HapticFeedback.trigger('notificationSuccess');
      // 自动保存
      if (cards.length > 0) saveReading(cards);
    }, 250 + cards.length * 400 + 300);
  };

  const saveReading = (cardsToSave: DrawnCard[]) => {
    const id = genId();
    const entry: HistoryEntry = {
      id,
      timestamp: startTimeRef.current || Date.now(),
      spreadType,
      question,
      cards: cardsToSave,
    };
    addEntry(entry);
    setSavedId(id);
  };

  // 初次进入自动开始
  useEffect(() => {
    startReading();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.scroll}>
        {/* 顶部信息 */}
        <View style={styles.header}>
          <Text style={styles.spreadName}>{spread.nameZh}</Text>
          {question ? (
            <Text style={styles.question} numberOfLines={3}>"{question}"</Text>
          ) : null}
        </View>

        {/* 阶段文案 */}
        <View style={styles.phaseBox}>
          {phase === 'shuffling' && (
            <Text style={styles.phaseText}>✦ 牌组正在洗牌 ✦</Text>
          )}
          {phase === 'revealing' && (
            <Text style={styles.phaseText}>✦ 牌面即将揭晓 ✦</Text>
          )}
          {phase === 'done' && (
            <Text style={styles.phaseText}>✦ 解读 ✦</Text>
          )}
        </View>

        {/* 洗牌动画 / 牌阵 */}
        {phase === 'shuffling' ? (
          <ShuffleDeck active onComplete={onShuffleComplete} />
        ) : (
          <SpreadLayout
            spreadType={spreadType}
            drawn={drawn}
            faceUp={faceUp}
            onCardPress={idx => {
              // 允许点击未翻开的牌提前翻开
              if (!faceUp[idx] && phase === 'revealing') {
                setFaceUp(prev => {
                  const next = [...prev];
                  next[idx] = true;
                  return next;
                });
              }
            }}
          />
        )}

        {/* 解读区 */}
        {phase === 'done' && drawn.length > 0 && (
          <View style={styles.interpretSection}>
            {drawn.map((d, idx) => {
              const card = getCard(d.cardId);
              if (!card) return null;
              const isR = d.orientation === 'reversed';
              return (
                <View key={idx} style={styles.interpretCard}>
                  <View style={styles.interpretHeader}>
                    <Text style={styles.interpretName}>
                      {d.position && <Text style={styles.interpretPosition}>{d.position} · </Text>}
                      {card.nameZh}
                    </Text>
                    <Text style={[styles.interpretOrient, isR && styles.interpretOrientR]}>
                      {isR ? '逆位' : '正位'}
                    </Text>
                  </View>
                  <View style={styles.kwRow}>
                    {(isR ? card.keywordsReversed : card.keywordsUpright).map((kw, i) => (
                      <View key={i} style={styles.kwChip}>
                        <Text style={styles.kwText}>{kw}</Text>
                      </View>
                    ))}
                  </View>
                  <Text style={styles.interpretText}>
                    {isR ? card.meaningReversed : card.meaningUpright}
                  </Text>
                </View>
              );
            })}

            {savedId && (
              <Text style={styles.savedHint}>已自动保存到历史记录 ✦</Text>
            )}

            <View style={styles.actionRow}>
              <Pressable
                onPress={() => {
                  setPhase('idle');
                  setDrawn([]);
                  setFaceUp([]);
                  setSavedId(null);
                  setTimeout(startReading, 50);
                }}
                style={({ pressed }) => [styles.actionBtn, styles.actionPrimary, pressed && styles.pressed]}
              >
                <Text style={styles.actionPrimaryText}>再抽一次</Text>
              </Pressable>
              <Pressable
                onPress={() => navigation.goBack()}
                style={({ pressed }) => [styles.actionBtn, styles.actionSecondary, pressed && styles.pressed]}
              >
                <Text style={styles.actionSecondaryText}>返回首页</Text>
              </Pressable>
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bgPrimary },
  scroll: { padding: spacing.md, paddingBottom: spacing.xxl },
  header: {
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  spreadName: {
    color: colors.gold,
    fontSize: fontSize.title,
    fontWeight: '700',
    letterSpacing: 2,
  },
  question: {
    color: colors.textSecondary,
    fontSize: fontSize.body,
    fontStyle: 'italic',
    marginTop: spacing.xs,
    textAlign: 'center',
  },
  phaseBox: {
    alignItems: 'center',
    marginVertical: spacing.md,
  },
  phaseText: {
    color: colors.gold,
    fontSize: fontSize.bodyLarge,
    letterSpacing: 3,
  },
  interpretSection: {
    marginTop: spacing.lg,
  },
  interpretCard: {
    backgroundColor: colors.bgCard,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderLeftWidth: 3,
    borderLeftColor: colors.gold,
  },
  interpretHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  interpretName: {
    color: colors.textPrimary,
    fontSize: fontSize.bodyLarge,
    fontWeight: '700',
  },
  interpretPosition: {
    color: colors.gold,
    fontWeight: '600',
  },
  interpretOrient: {
    color: colors.gold,
    fontSize: fontSize.caption,
    fontWeight: '600',
  },
  interpretOrientR: {
    color: colors.reversed,
  },
  kwRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: spacing.sm,
  },
  kwChip: {
    backgroundColor: colors.bgDeep,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    marginRight: spacing.xs,
    marginBottom: spacing.xs,
    borderWidth: 1,
    borderColor: colors.border,
  },
  kwText: {
    color: colors.goldBright,
    fontSize: fontSize.caption,
  },
  interpretText: {
    color: colors.textPrimary,
    fontSize: fontSize.body,
    lineHeight: 22,
  },
  savedHint: {
    color: colors.gold,
    fontSize: fontSize.caption,
    textAlign: 'center',
    marginTop: spacing.sm,
    letterSpacing: 1,
  },
  actionRow: {
    flexDirection: 'row',
    marginTop: spacing.lg,
    gap: spacing.sm,
  },
  actionBtn: {
    flex: 1,
    paddingVertical: spacing.md,
    borderRadius: radius.md,
    alignItems: 'center',
  },
  actionPrimary: {
    backgroundColor: colors.gold,
  },
  actionPrimaryText: {
    color: colors.bgPrimary,
    fontSize: fontSize.bodyLarge,
    fontWeight: '700',
  },
  actionSecondary: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.gold,
  },
  actionSecondaryText: {
    color: colors.gold,
    fontSize: fontSize.bodyLarge,
    fontWeight: '600',
  },
  pressed: { opacity: 0.7 },
});
