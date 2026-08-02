import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { useShellStore } from '@/store/shellStore';
import { LOCAL_MODELS, type LocalModelId } from '@/models/localModels';

export interface ManagedLocalModelState {
  readonly installed: boolean;
  readonly installedVersion: string | null;
  readonly downloadProgress: number;
  readonly installedAt: string | null;
  readonly updatedAt: string | null;
}

export interface ManagedLocalModelSnapshot {
  readonly id: LocalModelId;
  readonly name: string;
  readonly modality: 'text' | 'vision' | 'embedding';
  readonly status: 'Ready' | 'Queued' | 'Available';
  readonly description: string;
  readonly version: string;
  readonly sizeMb: number;
  readonly ramUsageMb: number;
  readonly locked: boolean;
  readonly installed: boolean;
  readonly installedVersion: string | null;
  readonly downloadProgress: number;
  readonly updateAvailable: boolean;
  readonly installedAt: string | null;
  readonly updatedAt: string | null;
  readonly active: boolean;
}

interface ModelManagerState {
  models: Record<LocalModelId, ManagedLocalModelState>;
  installModel: (modelId: LocalModelId) => void;
  deleteModel: (modelId: LocalModelId) => void;
  updateModel: (modelId: LocalModelId) => void;
  activateModel: (modelId: LocalModelId) => void;
  resetModels: () => void;
}

const FALLBACK_MODEL_ID: LocalModelId = 'phi-3-mini';

function createInitialModels(): Record<LocalModelId, ManagedLocalModelState> {
  const now = new Date().toISOString();

  return LOCAL_MODELS.reduce((accumulator, model) => {
    const installed = model.status === 'Ready' || model.locked === true;
    accumulator[model.id] = {
      installed,
      installedVersion: installed ? (model.defaultInstalledVersion ?? model.version) : null,
      downloadProgress: installed ? 1 : 0,
      installedAt: installed ? now : null,
      updatedAt: installed ? now : null
    };
    return accumulator;
  }, {} as Record<LocalModelId, ManagedLocalModelState>);
}

function getNextActiveModelId(models: Record<LocalModelId, ManagedLocalModelState>): LocalModelId {
  const installedModel = LOCAL_MODELS.find((model) => models[model.id]?.installed && !model.locked);
  return installedModel?.id ?? FALLBACK_MODEL_ID;
}

function createSnapshot(modelId: LocalModelId, models: Record<LocalModelId, ManagedLocalModelState>): ManagedLocalModelSnapshot {
  const model = LOCAL_MODELS.find((entry) => entry.id === modelId);
  if (!model) {
    throw new Error(`Unknown model: ${modelId}`);
  }

  const state = models[modelId];
  const activeModelId = useShellStore.getState().currentModelId;

  return {
    ...model,
    locked: model.locked === true,
    installed: state.installed,
    installedVersion: state.installedVersion,
    downloadProgress: state.downloadProgress,
    updateAvailable: state.installed && state.installedVersion !== model.version,
    installedAt: state.installedAt,
    updatedAt: state.updatedAt,
    active: activeModelId === modelId
  };
}

export function getModelSnapshots(models: Record<LocalModelId, ManagedLocalModelState>): ManagedLocalModelSnapshot[] {
  return LOCAL_MODELS.map((model) => createSnapshot(model.id, models));
}

export const useModelManagerStore = create<ModelManagerState>()(
  persist(
    (set, get) => ({
      models: createInitialModels(),
      installModel: (modelId) =>
        set((state) => {
          const model = LOCAL_MODELS.find((entry) => entry.id === modelId);
          if (!model) {
            return state;
          }

          const now = new Date().toISOString();
          return {
            models: {
              ...state.models,
              [modelId]: {
                installed: true,
                installedVersion: model.version,
                downloadProgress: 1,
                installedAt: state.models[modelId]?.installedAt ?? now,
                updatedAt: now
              }
            }
          };
        }),
      deleteModel: (modelId) =>
        set((state) => {
          const model = LOCAL_MODELS.find((entry) => entry.id === modelId);
          if (!model || model.locked) {
            return state;
          }

          const nextModels = {
            ...state.models,
            [modelId]: {
              installed: false,
              installedVersion: null,
              downloadProgress: 0,
              installedAt: null,
              updatedAt: new Date().toISOString()
            }
          };

          const currentModelId = useShellStore.getState().currentModelId;
          if (currentModelId === modelId) {
            useShellStore.getState().setCurrentModelId(getNextActiveModelId(nextModels));
          }

          return { models: nextModels };
        }),
      updateModel: (modelId) =>
        set((state) => {
          const model = LOCAL_MODELS.find((entry) => entry.id === modelId);
          const current = state.models[modelId];
          if (!model || !current?.installed) {
            return state;
          }

          return {
            models: {
              ...state.models,
              [modelId]: {
                ...current,
                installedVersion: model.version,
                downloadProgress: 1,
                updatedAt: new Date().toISOString()
              }
            }
          };
        }),
      activateModel: (modelId) => {
        const { installModel } = get();
        const modelState = get().models[modelId];

        if (!modelState.installed) {
          installModel(modelId);
        }

        useShellStore.getState().setCurrentModelId(modelId);
      },
      resetModels: () => set({ models: createInitialModels() })
    }),
    {
      name: 'contextos-model-manager',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ models: state.models })
    }
  )
);

export function selectManagedModels(): ManagedLocalModelSnapshot[] {
  return getModelSnapshots(useModelManagerStore.getState().models);
}