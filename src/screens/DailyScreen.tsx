// 今日运势:按日期确定性抽出的「每日一卡」,同一天结果固定。
import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import HapticFeedback from 'react-native-haptic-feedback';
import { colors, fontSize, spacing } from '../theme/colors';
import { getDailyDraw, dateKey } from '../utils/dailyCard';
import { getCard } from '../data/cards';
import { genId } from '../utils/uuid';
import { formatReadingText } from '../utils/formatReading';
import { CardView } from '../components/CardView';
import { Interpretation } from '../components/Interpretation';
import { ShareActions } from '../components/ShareActions';
import { useHistoryStore } from '../store/useHistoryStore';
import { useDailyStore } from '../store/useDailyStore';
import type { DrawnCard, HistoryEntry, RootStackParamList } from '../types';

type Props = NativeStackScreenProps<RootStackParamList, 'Daily'>;

export function DailyScreen({ navigation }: Props) {
  const today = useMemo(() => new Date(), []);
  const key = dateKey(today);
  const draw = useMemo<DrawnCard>(
    () => ({ ...getDailyDraw(today), position: '今日指引' }),
    [today],
  );
  const card = getCard(draw.cardId);

  const addEntry = useHistoryStore(s => s.addEntry);
  const markRevealed = useDailyStore(s => s.markRevealed);
  const alreadyRevealed = useDailyStore(s => Boolean(s.revealed[key]));

  // 已翻过的日子直接展示牌面;新的一天才播放翻牌并存入历史(每天仅一次)
  const [faceUp, setFaceUp] = useState(alreadyRevealed);

  useEffect(() => {
    if (alreadyRevealed) return;
    const t = setTimeout(() => {
      setFaceUp(true);
      HapticFeedback.trigger('notificationSuccess');
      const id = genId();
      const entry: HistoryEntry = {
        id,
        timestamp: today.getTime(),
        spreadType: 'single',
        kind: 'daily',
        cards: [draw],
      };
      addEntry(entry);
      markRevealed(key, id);
    }, 450);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const buildText = () =>
    formatReadingText(
      { spreadType: 'single', cards: [draw], timestamp: today.getTime() },
      { spreadName: '今日运势' },
    );

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.headerRow}>
        <Pressable onPress={() => navigation.goBack()} hitSlop={10}>
          <Text style={styles.back}>‹ 返回</Text>
        </Pressable>
        <Text style={styles.headerTitle}>今日运势</Text>
        <View style={{ width: 50 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.date}>{dateKey(today)}</Text>
        <Text style={styles.lead}>✦ 这是属于今天的一张牌 ✦</Text>

        {card && (
          <View style={styles.cardWrap}>
            <CardView card={card} orientation={draw.orientation} faceUp={faceUp} />
          </View>
        )}

        {faceUp && (
          <View style={styles.interpret}>
            <Interpretation drawn={[draw]} />
            <ShareActions getText={buildText} />
            <Text style={styles.note}>每日 0 点更新 · 同一天结果固定</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bgPrimary },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
  },
  back: { color: colors.gold, fontSize: fontSize.body, fontWeight: '600' },
  headerTitle: { color: colors.gold, fontSize: fontSize.bodyLarge, fontWeight: '700' },
  scroll: { padding: spacing.lg, paddingBottom: spacing.xxl },
  date: {
    color: colors.textMuted,
    fontSize: fontSize.caption,
    textAlign: 'center',
    letterSpacing: 1,
  },
  lead: {
    color: colors.gold,
    fontSize: fontSize.bodyLarge,
    textAlign: 'center',
    letterSpacing: 2,
    marginTop: spacing.xs,
    marginBottom: spacing.lg,
  },
  cardWrap: {
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  interpret: { marginTop: spacing.sm },
  note: {
    color: colors.textMuted,
    fontSize: 11,
    textAlign: 'center',
    marginTop: spacing.md,
    letterSpacing: 0.5,
  },
});
