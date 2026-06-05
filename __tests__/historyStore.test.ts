import { useHistoryStore } from '../src/store/useHistoryStore';
import type { HistoryEntry } from '../src/types';

const mk = (id: string): HistoryEntry => ({
  id,
  timestamp: 1,
  spreadType: 'single',
  cards: [],
});

beforeEach(() => {
  useHistoryStore.setState({ history: [] });
});

describe('useHistoryStore', () => {
  it('addEntry 把新记录放最前,并最多保留 500 条', () => {
    for (let i = 0; i < 510; i++) {
      useHistoryStore.getState().addEntry(mk(`e${i}`));
    }
    const history = useHistoryStore.getState().history;
    expect(history).toHaveLength(500);
    expect(history[0].id).toBe('e509'); // 最新在最前
    expect(history.some(e => e.id === 'e0')).toBe(false); // 最旧的被裁掉
  });

  it('removeEntry 只删除指定记录', () => {
    useHistoryStore.getState().addEntry(mk('a'));
    useHistoryStore.getState().addEntry(mk('b'));
    useHistoryStore.getState().removeEntry('a');
    expect(useHistoryStore.getState().history.map(e => e.id)).toEqual(['b']);
  });

  it('clear 清空全部', () => {
    useHistoryStore.getState().addEntry(mk('a'));
    useHistoryStore.getState().clear();
    expect(useHistoryStore.getState().history).toHaveLength(0);
  });
});
