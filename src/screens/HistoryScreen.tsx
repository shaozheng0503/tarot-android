// 历史记录列表
import React from 'react';
import {
  View, Text, StyleSheet, FlatList, Pressable, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { CompositeScreenProps } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { colors, fontSize, radius, spacing } from '../theme/colors';
import { useHistoryStore } from '../store/useHistoryStore';
import { HistoryItem } from '../components/HistoryItem';
import type { RootStackParamList, MainTabParamList } from '../types';

type Props = CompositeScreenProps<
  BottomTabScreenProps<MainTabParamList, 'HistoryTab'>,
  NativeStackScreenProps<RootStackParamList>
>;

export function HistoryScreen({ navigation }: Props) {
  const history = useHistoryStore(s => s.history);
  const clear = useHistoryStore(s => s.clear);

  const handleClear = () => {
    if (history.length === 0) return;
    Alert.alert('清空历史', '确定要清空所有历史记录吗?此操作不可恢复。', [
      { text: '取消', style: 'cancel' },
      { text: '清空', style: 'destructive', onPress: () => clear() },
    ]);
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>历史记录</Text>
        {history.length > 0 && (
          <Pressable onPress={handleClear} hitSlop={10}>
            <Text style={styles.clearBtn}>清空</Text>
          </Pressable>
        )}
      </View>
      {history.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyIcon}>✦</Text>
          <Text style={styles.emptyText}>暂无历史记录</Text>
          <Text style={styles.emptyHint}>回到首页开始第一次占卜</Text>
        </View>
      ) : (
        <FlatList
          data={history}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <HistoryItem
              entry={item}
              onPress={() => navigation.navigate('HistoryDetail', { entryId: item.id })}
            />
          )}
          contentContainerStyle={styles.list}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bgPrimary },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  title: {
    color: colors.gold,
    fontSize: fontSize.heading,
    fontWeight: '300',
    letterSpacing: 3,
  },
  clearBtn: {
    color: colors.danger,
    fontSize: fontSize.body,
    fontWeight: '600',
  },
  list: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: spacing.xxl,
  },
  emptyIcon: {
    color: colors.gold,
    fontSize: 64,
    marginBottom: spacing.md,
  },
  emptyText: {
    color: colors.textPrimary,
    fontSize: fontSize.bodyLarge,
    fontWeight: '600',
    marginBottom: spacing.xs,
  },
  emptyHint: {
    color: colors.textMuted,
    fontSize: fontSize.body,
  },
});
