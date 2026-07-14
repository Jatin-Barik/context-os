export const appBridgeChannels = {
  appInfo: 'contextos:app-info',
  runtimeStatus: 'contextos:runtime-status',
  readClipboard: 'contextos:clipboard:read',
  openExternal: 'contextos:external:open',
  setPaletteVisible: 'contextos:palette:set-visible',
  getDisplays: 'contextos:capture:get-displays',
  captureScreen: 'contextos:capture:screen',
  captureOcr: 'contextos:capture:ocr'
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

export interface DisplaySource {
  id: string;
  name: string;
  thumbnail: string;
  displayId: string;
  isWindow: boolean;
}

export interface CaptureResult {
  dataUrl: string;
  mimeType: string;
  displayId: string;
  width: number;
  height: number;
  capturedAt: string;
}

export interface OcrBlock {
  text: string;
  confidence: number;
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface OcrResult {
  text: string;
  blocks: OcrBlock[];
  language: string;
  confidence: number;
  processingTimeMs: number;
  source: string;
}

export interface ContextosBridge {
  getAppInfo: () => Promise<AppInfo>;
  getRuntimeStatus: () => Promise<RuntimeStatus>;
  readClipboard: () => Promise<string>;
  openExternal: (url: string) => Promise<boolean>;
  getDisplays: () => Promise<DisplaySource[]>;
  captureScreen: (options?: { sourceId?: string; displayId?: string }) => Promise<CaptureResult>;
  captureOcr: (dataUrl: string) => Promise<OcrResult>;
  onPaletteOpen: (listener: () => void) => () => void;
  onPaletteVisibleChange: (listener: (visible: boolean) => void) => () => void;
}

declare global {
  interface Window {
    contextos: ContextosBridge;
  }
}
