import { useEffect, useState } from 'react';
import type { RuntimeStatus } from '@shared/bridge';
import { loadRuntimeStatus } from '@/services/runtimeStatusService';

interface UseRuntimeStatusResult {
  runtimeStatus: RuntimeStatus | null;
  refreshRuntimeStatus: () => Promise<void>;
}

export function useRuntimeStatus(): UseRuntimeStatusResult {
  const [runtimeStatus, setRuntimeStatus] = useState<RuntimeStatus | null>(null);

  async function refreshRuntimeStatus(): Promise<void> {
    const status = await loadRuntimeStatus();
    setRuntimeStatus(status);
  }

  useEffect(() => {
    void refreshRuntimeStatus();
  }, []);

  return { runtimeStatus, refreshRuntimeStatus };
}
