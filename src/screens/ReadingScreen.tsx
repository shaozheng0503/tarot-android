// ReadingScreen: 抽牌 + 翻牌动画 + 解读展示 + 保存历史 + 复制/分享
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
import { formatReadingText } from '../utils/formatReading';
import { ALL_CARDS } from '../data/cards';
import { getSpread } from '../data/spreads';
import { ShuffleDeck } from '../components/ShuffleDeck';
import { SpreadLayout } from '../components/SpreadLayout';
import { Interpretation } from '../components/Interpretation';
import { ShareActions } from '../components/ShareActions';
import { useHistoryStore } from '../store/useHistoryStore';
import type { DrawnCard, RootStackParamList, HistoryEntry } from '../types';

type Props = NativeStackScreenProps<RootStackParamList, 'Reading'>;

type Phase = 'idle' | 'shuffling' | 'revealing' | 'done';

const REVEAL_LEAD_MS = 250;     // 第一张翻开前的留白
const REVEAL_TAIL_MS = 500;     // 最后一张翻完到进入 done 的缓冲

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

  // 洗牌完成 → 依次翻牌(由 CardView 的 flipDelay 形成瀑布,这里只负责触感与收尾)
  const onShuffleComplete = () => {
    setPhase('revealing');
    const cards = drawnRef.current;
    const stagger = cards.length > 5 ? 200 : 400;
    // 先让牌阵以"牌背"挂载,下一帧再统一翻开,确保翻牌动画完整播放
    const FLIP_START = 80;
    setTimeout(() => setFaceUp(cards.map(() => true)), FLIP_START);
    cards.forEach((_, idx) => {
      setTimeout(
        () => HapticFeedback.trigger('selection'),
        FLIP_START + REVEAL_LEAD_MS + idx * stagger,
      );
    });
    setTimeout(() => {
      setPhase('done');
      HapticFeedback.trigger('notificationSuccess');
      if (cards.length > 0) saveReading(cards);
    }, FLIP_START + REVEAL_LEAD_MS + cards.length * stagger + REVEAL_TAIL_MS);
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

  const buildShareText = () =>
    formatReadingText({
      spreadType,
      question,
      cards: drawnRef.current,
      timestamp: startTimeRef.current || undefined,
    });

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
          />
        )}

        {/* 解读区 */}
        {phase === 'done' && drawn.length > 0 && (
          <View style={styles.interpretSection}>
            <Interpretation drawn={drawn} />

            <ShareActions getText={buildShareText} />

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
  savedHint: {
    color: colors.gold,
    fontSize: fontSize.caption,
    textAlign: 'center',
    marginTop: spacing.md,
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
