import { app, BrowserWindow, globalShortcut, ipcMain } from 'electron';
import { registerMainIpc } from './ipc';
import { createMainWindow } from './window';

let mainWindow: BrowserWindow | null = null;

const gotSingleInstanceLock = app.requestSingleInstanceLock();

if (!gotSingleInstanceLock) {
  app.quit();
}

function bootstrap(): void {
  mainWindow = createMainWindow();
  registerMainIpc(mainWindow);

  globalShortcut.register('CommandOrControl+Space', () => {
    if (mainWindow?.isMinimized()) {
      mainWindow.restore();
    }

    if (mainWindow?.isVisible()) {
      mainWindow.webContents.send('contextos:palette:open');
      mainWindow.focus();
      return;
    }

    mainWindow?.show();
    mainWindow?.focus();
    mainWindow?.webContents.send('contextos:palette:open');
  });

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      mainWindow = createMainWindow();
      registerMainIpc(mainWindow);
    }
  });
}

app.whenReady().then(bootstrap);

app.on('window-all-closed', () => {
  globalShortcut.unregisterAll();
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('will-quit', () => {
  globalShortcut.unregisterAll();
  ipcMain.removeAllListeners();
});
