import { BrowserWindow, shell } from 'electron';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const currentDir = dirname(fileURLToPath(import.meta.url));
const isDev = !appIsPackaged();

function appIsPackaged(): boolean {
  return process.env.NODE_ENV === 'production' || process.env.VITE_DEV_SERVER_URL === undefined;
}

export function createMainWindow(): BrowserWindow {
  const window = new BrowserWindow({
    width: 1440,
    height: 960,
    minWidth: 1200,
    minHeight: 780,
    backgroundColor: '#070b12',
    title: 'ContextOS',
    titleBarStyle: 'hiddenInset',
    vibrancy: 'under-window',
    trafficLightPosition: { x: 16, y: 18 },
    webPreferences: {
      preload: join(currentDir, '../preload/index.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false,
      spellcheck: false
    }
  });

  if (isDev && process.env.VITE_DEV_SERVER_URL) {
    void window.loadURL(process.env.VITE_DEV_SERVER_URL);
    window.webContents.openDevTools({ mode: 'detach' });
  } else {
    void window.loadFile(join(currentDir, '../renderer/index.html'));
  }

  window.webContents.setWindowOpenHandler(({ url }) => {
    void shell.openExternal(url);
    return { action: 'deny' };
  });

  return window;
}
