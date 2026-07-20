import type { AppInfo, CaptureResult, DisplaySource, OcrResult } from '@shared/bridge';
import { buildContext } from './contextBuilder';
import type { ContextSnapshot, ContextEngineInput } from './contextTypes';

export interface CaptureContextRequest {
  readonly appInfo: AppInfo | null;
  readonly sourceId?: string;
}

export interface CaptureContextResult {
  readonly capture: CaptureResult;
  readonly ocr: OcrResult;
  readonly context: ContextSnapshot;
  readonly display: DisplaySource | null;
  readonly clipboardText: string;
}

function ensureBridge(): NonNullable<Window['contextos']> {
  if (!window.contextos?.captureScreen || !window.contextos?.captureOcr || !window.contextos?.getDisplays || !window.contextos?.readClipboard) {
    throw new Error('Capture bridge is not available in this runtime.');
  }

  return window.contextos;
}

export async function captureContext(request: CaptureContextRequest): Promise<CaptureContextResult> {
  const bridge = ensureBridge();
  const sources = await bridge.getDisplays();
  const selectedDisplay = sources.find((source) => source.id === request.sourceId)
    ?? sources.find((source) => source.name.toLowerCase().includes('screen'))
    ?? sources[0]
    ?? null;
  const capture = await bridge.captureScreen({ sourceId: selectedDisplay?.id });
  const clipboardText = await bridge.readClipboard();
  const ocr = await bridge.captureOcr(capture.dataUrl);

  const input: ContextEngineInput = {
    windowTitle: selectedDisplay?.name ?? request.appInfo?.name ?? 'Current desktop',
    windowProcess: selectedDisplay?.isWindow ? selectedDisplay.name : (request.appInfo?.name ?? 'desktop'),
    ocrText: ocr.text,
    ocrResult: ocr,
    clipboardText,
    selectedText: ocr.text,
    displayName: selectedDisplay?.name ?? 'Primary Display',
    resolution: `${capture.width}x${capture.height}`,
    timestamp: capture.capturedAt,
    metadata: {
      platform: request.appInfo?.platform ?? window.navigator.platform,
      userAgent: window.navigator.userAgent,
      captureSource: selectedDisplay?.name ?? 'Current desktop'
    }
  };

  const context = buildContext(input);

  return {
    capture,
    ocr,
    context,
    display: selectedDisplay,
    clipboardText
  };
}
