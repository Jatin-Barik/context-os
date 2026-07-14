import { create } from 'zustand';

export interface RecentCommandEntry {
  id: string;
  title: string;
  category: string;
  timestamp: string;
}

interface CommandPaletteState {
  query: string;
  selectedIndex: number;
  recentCommands: RecentCommandEntry[];
  setQuery: (query: string) => void;
  setSelectedIndex: (selectedIndex: number) => void;
  resetSelection: () => void;
  pushRecentCommand: (entry: RecentCommandEntry) => void;
  clearRecentCommands: () => void;
}

export const useCommandPaletteStore = create<CommandPaletteState>((set) => ({
  query: '',
  selectedIndex: 0,
  recentCommands: [],
  setQuery: (query) => set({ query, selectedIndex: 0 }),
  setSelectedIndex: (selectedIndex) => set({ selectedIndex }),
  resetSelection: () => set({ selectedIndex: 0 }),
  pushRecentCommand: (entry) =>
    set((state) => ({
      recentCommands: [entry, ...state.recentCommands].slice(0, 6)
    })),
  clearRecentCommands: () => set({ recentCommands: [] })
}));
