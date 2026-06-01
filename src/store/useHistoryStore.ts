// 历史记录状态管理:Zustand + AsyncStorage 持久化
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { HistoryEntry } from '../types';

interface HistoryState {
  history: HistoryEntry[];
  addEntry: (entry: HistoryEntry) => void;
  removeEntry: (id: string) => void;
  clear: () => void;
}

export const useHistoryStore = create<HistoryState>()(
  persist(
    (set) => ({
      history: [],
      addEntry: (entry) => set((state) => ({
        history: [entry, ...state.history].slice(0, 500), // 最多保留 500 条
      })),
      removeEntry: (id) => set((state) => ({
        history: state.history.filter((e) => e.id !== id),
      })),
      clear: () => set({ history: [] }),
    }),
    {
      name: 'tarot-history-v1',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
