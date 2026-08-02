import { beforeEach, describe, expect, it } from 'vitest';
import { useShellStore } from '@/store/shellStore';
import { getModelSnapshots, useModelManagerStore } from '@/store/modelManagerStore';

describe('modelManagerStore', () => {
  beforeEach(() => {
    localStorage.clear();
    useShellStore.setState({ currentModelId: 'phi-3-mini' });
    useModelManagerStore.getState().resetModels();
  });

  it('installs and activates an available model', () => {
    useModelManagerStore.getState().activateModel('gemma-3n');

    const snapshots = getModelSnapshots(useModelManagerStore.getState().models);
    const gemma = snapshots.find((model) => model.id === 'gemma-3n');

    expect(gemma?.installed).toBe(true);
    expect(gemma?.active).toBe(true);
    expect(useShellStore.getState().currentModelId).toBe('gemma-3n');
  });

  it('updates an installed model to the catalog version', () => {
    const before = getModelSnapshots(useModelManagerStore.getState().models).find((model) => model.id === 'bge-small');
    expect(before?.updateAvailable).toBe(true);

    useModelManagerStore.getState().updateModel('bge-small');

    const after = getModelSnapshots(useModelManagerStore.getState().models).find((model) => model.id === 'bge-small');
    expect(after?.installedVersion).toBe(after?.version);
    expect(after?.updateAvailable).toBe(false);
  });

  it('keeps the fallback model when deleting the active optional model', () => {
    useModelManagerStore.getState().activateModel('bge-small');
    useModelManagerStore.getState().deleteModel('bge-small');

    const snapshots = getModelSnapshots(useModelManagerStore.getState().models);
    const bge = snapshots.find((model) => model.id === 'bge-small');
    const fallback = snapshots.find((model) => model.id === 'phi-3-mini');

    expect(bge?.installed).toBe(false);
    expect(useShellStore.getState().currentModelId).toBe('phi-3-mini');
    expect(fallback?.active).toBe(true);
  });
});
