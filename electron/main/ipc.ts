import { app, BrowserWindow, clipboard, ipcMain, shell } from 'electron';
import os from 'node:os';
import { appBridgeChannels } from '../../src/shared/bridge';

export function registerMainIpc(window: BrowserWindow): void {
  ipcMain.handle(appBridgeChannels.appInfo, () => {
    return {
      name: 'ContextOS',
      version: '0.1.0',
      platform: process.platform,
      electron: process.versions.electron,
      chrome: process.versions.chrome,
      node: process.versions.node
    };
  });

  ipcMain.handle(appBridgeChannels.runtimeStatus, async () => {
    const memoryInfo = await process.getProcessMemoryInfo();
    const totalMemoryBytes = os.totalmem();
    const freeMemoryBytes = os.freemem();
    const featureStatus = app.getGPUFeatureStatus();
    const enabledFeatures = Object.values(featureStatus).filter(
      (value) => value === 'enabled' || value === 'hardware_accelerated'
    ).length;
    const gpuStatus = enabledFeatures > 0 ? 'Hardware acceleration ready' : 'Software fallback';

    return {
      cpuCount: os.cpus().length,
      systemMemoryUsedMb: Math.round((totalMemoryBytes - freeMemoryBytes) / 1024 / 1024),
      systemMemoryTotalMb: Math.round(totalMemoryBytes / 1024 / 1024),
      appMemoryMb: Math.round(memoryInfo.residentSet / 1024),
      gpuStatus,
      uptimeSeconds: Math.round(process.uptime())
    };
  });

  ipcMain.handle(appBridgeChannels.readClipboard, () => clipboard.readText());

  ipcMain.handle(appBridgeChannels.openExternal, (_event, url: string) => {
    void shell.openExternal(url);
    return true;
  });

  ipcMain.handle(appBridgeChannels.setPaletteVisible, (_event, visible: boolean) => {
    window.webContents.send('contextos:palette:state', visible);
    return visible;
  });
}
