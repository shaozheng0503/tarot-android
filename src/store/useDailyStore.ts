// 每日一卡状态:记录每天是否已翻开(dateKey → 对应历史记录 id),
// 用于首页"今日已翻"标记,以及避免同一天重复存入历史。
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface DailyState {
  /** dateKey(YYYY-MM-DD) → 当天每日一卡的历史记录 id */
  revealed: Record<string, string>;
  markRevealed: (dateKey: string, entryId: string) => void;
  getEntryId: (dateKey: string) => string | undefined;
}

export const useDailyStore = create<DailyState>()(
  persist(
    (set, get) => ({
      revealed: {},
      markRevealed: (dateKey, entryId) =>
        set(state => ({ revealed: { ...state.revealed, [dateKey]: entryId } })),
      getEntryId: dateKey => get().revealed[dateKey],
    }),
    {
      name: 'tarot-daily-v1',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
