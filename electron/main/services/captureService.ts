import { desktopCapturer, ipcMain } from 'electron';
import { readFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import type { CaptureResult, OcrResult } from '../../../src/shared/bridge';

export function registerCaptureHandlers(): void {
  ipcMain.handle('contextos:capture:get-displays', async () => {
    const sources = await desktopCapturer.getSources({ types: ['screen', 'window'], fetchWindowIcons: false });
    return sources.map((source) => ({
      id: source.id,
      name: source.name,
      thumbnail: source.thumbnail?.toDataURL() ?? '',
      displayId: source.display_id ?? '',
      isWindow: source.id.startsWith('window:')
    }));
  });

  ipcMain.handle('contextos:capture:screen', async (_event, options?: { sourceId?: string; displayId?: string }) => {
    const sources = await desktopCapturer.getSources({ types: ['screen', 'window'], fetchWindowIcons: false });
    const targetSource = sources.find((item) => item.id === options?.sourceId || item.display_id === options?.displayId)
      ?? sources.find((item) => item.name.toLowerCase().includes('screen'))
      ?? sources[0];

    if (!targetSource) {
      throw new Error('No screen sources were available for capture.');
    }

    const thumbnail = targetSource.thumbnail;
    if (!thumbnail) {
      throw new Error('The selected capture source did not produce a thumbnail.');
    }

    const size = thumbnail.getSize();
    return {
      dataUrl: thumbnail.toDataURL(),
      mimeType: 'image/png',
      displayId: targetSource.display_id ?? options?.displayId ?? 'screen',
      width: size.width,
      height: size.height,
      capturedAt: new Date().toISOString()
    } satisfies CaptureResult;
  });

  ipcMain.handle('contextos:capture:ocr', async (_event, dataUrl?: string) => {
    if (!dataUrl) {
      throw new Error('A capture image is required for OCR processing.');
    }

    const currentDir = dirname(fileURLToPath(import.meta.url));
    const fallbackPath = join(currentDir, '../../../public/ocr-stub.json');
    const file = await readFile(fallbackPath, 'utf8');
    const stub = JSON.parse(file) as OcrResult;
    const startedAt = Date.now();

    return {
      ...stub,
      processingTimeMs: Date.now() - startedAt,
      source: 'local-stub'
    } satisfies OcrResult;
  });
}
