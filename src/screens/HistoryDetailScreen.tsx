// 单条历史详情
import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { colors, fontSize, radius, spacing } from '../theme/colors';
import { useHistoryStore } from '../store/useHistoryStore';
import { getSpread } from '../data/spreads';
import { SpreadLayout } from '../components/SpreadLayout';
import { Interpretation } from '../components/Interpretation';
import { ShareActions } from '../components/ShareActions';
import { formatReadingText, formatTimestamp } from '../utils/formatReading';
import type { RootStackParamList } from '../types';

type Props = NativeStackScreenProps<RootStackParamList, 'HistoryDetail'>;

export function HistoryDetailScreen({ route, navigation }: Props) {
  const { entryId } = route.params;
  const entry = useHistoryStore(s => s.history.find(e => e.id === entryId));
  const removeEntry = useHistoryStore(s => s.removeEntry);

  const handleDelete = () => {
    Alert.alert('删除记录', '确定要删除这条记录吗?此操作不可恢复。', [
      { text: '取消', style: 'cancel' },
      {
        text: '删除',
        style: 'destructive',
        onPress: () => {
          removeEntry(entryId);
          navigation.goBack();
        },
      },
    ]);
  };

  if (!entry) {
    return (
      <SafeAreaView style={styles.safe} edges={['top']}>
        <View style={styles.headerRow}>
          <Pressable onPress={() => navigation.goBack()} hitSlop={10}>
            <Text style={styles.back}>‹ 返回</Text>
          </Pressable>
        </View>
        <View style={styles.empty}>
          <Text style={styles.emptyText}>记录不存在或已被删除</Text>
        </View>
      </SafeAreaView>
    );
  }

  const spread = getSpread(entry.spreadType);
  const isDaily = entry.kind === 'daily';
  const titleName = isDaily ? '今日运势' : spread.nameZh;
  const faceUp = entry.cards.map(() => true);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.headerRow}>
        <Pressable onPress={() => navigation.goBack()} hitSlop={10}>
          <Text style={styles.back}>‹ 返回</Text>
        </Pressable>
        <Text style={styles.headerTitle}>{titleName}</Text>
        <Pressable onPress={handleDelete} hitSlop={10}>
          <Text style={styles.delete}>删除</Text>
        </Pressable>
      </View>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.date}>{formatTimestamp(entry.timestamp)}</Text>

        {entry.question && (
          <View style={styles.qBox}>
            <Text style={styles.qLabel}>问题</Text>
            <Text style={styles.qText}>"{entry.question}"</Text>
          </View>
        )}

        {/* 牌面 */}
        <SpreadLayout spreadType={entry.spreadType} drawn={entry.cards} faceUp={faceUp} />

        {/* 解读 */}
        <View style={styles.interpret}>
          <Interpretation drawn={entry.cards} />
        </View>

        <ShareActions
          getText={() => formatReadingText(entry, isDaily ? { spreadName: '今日运势' } : undefined)}
        />
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
  delete: { color: colors.danger, fontSize: fontSize.body, fontWeight: '600' },
  scroll: { padding: spacing.lg, paddingBottom: spacing.xxl },
  date: {
    color: colors.textMuted,
    fontSize: fontSize.caption,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  qBox: {
    backgroundColor: colors.bgCard,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.lg,
    borderLeftWidth: 3,
    borderLeftColor: colors.gold,
  },
  qLabel: {
    color: colors.gold,
    fontSize: fontSize.caption,
    fontWeight: '600',
    marginBottom: spacing.xs,
    letterSpacing: 1,
  },
  qText: {
    color: colors.textPrimary,
    fontSize: fontSize.body,
    fontStyle: 'italic',
  },
  interpret: { marginTop: spacing.md },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  emptyText: { color: colors.textMuted, fontSize: fontSize.body },
});
