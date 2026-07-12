export const appBridgeChannels = {
  appInfo: 'contextos:app-info',
  runtimeStatus: 'contextos:runtime-status',
  readClipboard: 'contextos:clipboard:read',
  openExternal: 'contextos:external:open',
  setPaletteVisible: 'contextos:palette:set-visible'
} as const;

export interface AppInfo {
  name: string;
  version: string;
  platform: NodeJS.Platform;
  electron: string;
  chrome: string;
  node: string;
}

export interface RuntimeStatus {
  cpuCount: number;
  systemMemoryUsedMb: number;
  systemMemoryTotalMb: number;
  appMemoryMb: number;
  gpuStatus: string;
  uptimeSeconds: number;
}

export interface ContextosBridge {
  getAppInfo: () => Promise<AppInfo>;
  getRuntimeStatus: () => Promise<RuntimeStatus>;
  readClipboard: () => Promise<string>;
  openExternal: (url: string) => Promise<boolean>;
  onPaletteOpen: (listener: () => void) => () => void;
  onPaletteVisibleChange: (listener: (visible: boolean) => void) => () => void;
}

declare global {
  interface Window {
    contextos: ContextosBridge;
  }
}
