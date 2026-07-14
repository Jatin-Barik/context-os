import { contextBridge, ipcRenderer } from 'electron';
import { appBridgeChannels, type ContextosBridge } from '../../src/shared/bridge';

const bridge: ContextosBridge = {
  getAppInfo: async () => ipcRenderer.invoke(appBridgeChannels.appInfo),
  getRuntimeStatus: async () => ipcRenderer.invoke(appBridgeChannels.runtimeStatus),
  readClipboard: async () => ipcRenderer.invoke(appBridgeChannels.readClipboard),
  openExternal: async (url: string) => ipcRenderer.invoke(appBridgeChannels.openExternal, url),
  getDisplays: async () => ipcRenderer.invoke(appBridgeChannels.getDisplays),
  captureScreen: async (options) => ipcRenderer.invoke(appBridgeChannels.captureScreen, options),
  captureOcr: async (dataUrl: string) => ipcRenderer.invoke(appBridgeChannels.captureOcr, dataUrl),
  onPaletteOpen: (listener) => {
    const handler = (): void => listener();
    ipcRenderer.on('contextos:palette:open', handler);
    return () => ipcRenderer.removeListener('contextos:palette:open', handler);
  },
  onPaletteVisibleChange: (listener) => {
    const handler = (_event: Electron.IpcRendererEvent, visible: boolean): void => listener(visible);
    ipcRenderer.on('contextos:palette:state', handler);
    return () => ipcRenderer.removeListener('contextos:palette:state', handler);
  }
};

contextBridge.exposeInMainWorld('contextos', bridge);
