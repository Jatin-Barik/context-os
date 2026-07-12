import type { RuntimeStatus } from '@shared/bridge';

export async function loadRuntimeStatus(): Promise<RuntimeStatus> {
  return window.contextos.getRuntimeStatus();
}
