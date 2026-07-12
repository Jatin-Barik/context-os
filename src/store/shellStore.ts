import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { AppInfo } from '@shared/bridge';
import type { LocalModelId } from '@/models/localModels';

export type PageId = 'home' | 'history' | 'memory' | 'settings' | 'models' | 'extensions' | 'about';
export type ThemeMode = 'midnight' | 'aurora';

export interface NotificationItem {
  id: string;
  title: string;
  detail: string;
  createdAt: string;
}

export interface PromptRecord {
  id: string;
  commandId: string;
  title: string;
  summary: string;
  createdAt: string;
}

export interface GeneratedAction {
  id: string;
  title: string;
  detail: string;
  tags: string[];
  createdAt: string;
}

export interface ContextSnapshot {
  id: string;
  appName: string;
  windowTitle: string;
  selectedText: string;
  clipboardText: string;
  currentUrl: string;
  currentFileName: string;
  currentLanguage: string;
  currentErrorMessage: string;
  currentTableSummary: string;
  currentImageSummary: string;
  capturedAt: string;
}

interface ShellState {
  appInfo: AppInfo | null;
  activePage: PageId;
  themeMode: ThemeMode;
  searchQuery: string;
  currentModelId: LocalModelId;
  paletteVisible: boolean;
  notificationsVisible: boolean;
  recentPrompts: PromptRecord[];
  generatedActions: GeneratedAction[];
  recentContexts: ContextSnapshot[];
  notifications: NotificationItem[];
  setAppInfo: (appInfo: AppInfo) => void;
  setActivePage: (page: PageId) => void;
  setThemeMode: (themeMode: ThemeMode) => void;
  toggleThemeMode: () => void;
  setSearchQuery: (searchQuery: string) => void;
  setCurrentModelId: (modelId: LocalModelId) => void;
  openPalette: () => void;
  closePalette: () => void;
  togglePalette: () => void;
  toggleNotifications: () => void;
  closeNotifications: () => void;
  recordPrompt: (prompt: PromptRecord) => void;
  recordGeneratedAction: (action: GeneratedAction) => void;
  recordContext: (context: ContextSnapshot) => void;
  clearLocalData: () => void;
}

const defaultContexts: ContextSnapshot[] = [];
const defaultNotifications: NotificationItem[] = [
  {
    id: 'local-mode',
    title: 'Local-first mode is active',
    detail: 'Core inference stays on device and no cloud model is enabled.',
    createdAt: new Date().toISOString()
  },
  {
    id: 'palette-ready',
    title: 'Palette is ready',
    detail: 'Press Ctrl + Space to open the assistant anywhere in the app.',
    createdAt: new Date().toISOString()
  },
  {
    id: 'model-ready',
    title: 'Phi-3 Mini is available',
    detail: 'The current text model is ready for the first local workflows.',
    createdAt: new Date().toISOString()
  }
];

export const useShellStore = create<ShellState>()(
  persist(
    (set) => ({
      appInfo: null,
      activePage: 'home',
      themeMode: 'midnight',
      searchQuery: '',
      currentModelId: 'phi-3-mini',
      paletteVisible: false,
      notificationsVisible: false,
      recentPrompts: [],
      generatedActions: [],
      recentContexts: defaultContexts,
      notifications: defaultNotifications,
      setAppInfo: (appInfo) => set({ appInfo }),
      setActivePage: (activePage) => set({ activePage }),
      setThemeMode: (themeMode) => set({ themeMode }),
      toggleThemeMode: () =>
        set((state) => ({ themeMode: state.themeMode === 'midnight' ? 'aurora' : 'midnight' })),
      setSearchQuery: (searchQuery) => set({ searchQuery }),
      setCurrentModelId: (currentModelId) => set({ currentModelId }),
      openPalette: () => set({ paletteVisible: true }),
      closePalette: () => set({ paletteVisible: false }),
      togglePalette: () => set((state) => ({ paletteVisible: !state.paletteVisible })),
      toggleNotifications: () => set((state) => ({ notificationsVisible: !state.notificationsVisible })),
      closeNotifications: () => set({ notificationsVisible: false }),
      recordPrompt: (prompt) =>
        set((state) => ({ recentPrompts: [prompt, ...state.recentPrompts].slice(0, 20) })),
      recordGeneratedAction: (action) =>
        set((state) => ({ generatedActions: [action, ...state.generatedActions].slice(0, 20) })),
      recordContext: (context) =>
        set((state) => ({ recentContexts: [context, ...state.recentContexts].slice(0, 20) })),
      clearLocalData: () =>
        set({ recentPrompts: [], generatedActions: [], recentContexts: defaultContexts, searchQuery: '' })
    }),
    {
      name: 'contextos-shell',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        activePage: state.activePage,
        themeMode: state.themeMode,
        currentModelId: state.currentModelId,
        recentPrompts: state.recentPrompts,
        generatedActions: state.generatedActions,
        recentContexts: state.recentContexts
      })
    }
  )
);
