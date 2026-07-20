import type { AppInfo } from '@shared/bridge';
import { detectApplication } from '@/services/context/windowService';
import type { ApplicationContextInput, ApplicationMetadata, ApplicationKind } from './ApplicationTypes';

function detectKind(name: string, windowTitle: string, currentUrl: string, currentFileName: string, currentLanguage: string): ApplicationKind {
  const normalized = `${name} ${windowTitle} ${currentUrl} ${currentFileName} ${currentLanguage}`.toLowerCase();

  if (/chrome|edge|brave|arc|opera/.test(normalized) || /^https?:\/\//i.test(currentUrl)) {
    return 'browser';
  }

  if (/visual studio code|vscode|\.ts$|\.tsx$|\.js$|\.jsx$|\.md$/.test(normalized)) {
    return 'editor';
  }

  if (/excel|sheet|spreadsheet/.test(normalized)) {
    return 'productivity';
  }

  if (/terminal|powershell|cmd|bash/.test(normalized)) {
    return 'terminal';
  }

  if (/slack|discord|mail|email/.test(normalized)) {
    return 'communications';
  }

  return 'generic';
}

function inferAdapterId(kind: ApplicationKind, name: string): string {
  if (kind === 'browser') {
    return 'chrome';
  }

  if (kind === 'editor') {
    return 'vscode';
  }

  return name.toLowerCase().includes('chrome') ? 'chrome' : name.toLowerCase().includes('visual studio code') ? 'vscode' : 'generic';
}

export class ApplicationDetector {
  detect(input: ApplicationContextInput): ApplicationMetadata {
    const startedAt = performance.now();
    const windowDetection = detectApplication(input.windowTitle, input.metadata ?? {});
    const detectedName = input.appInfo?.name ?? windowDetection.name ?? input.windowProcess ?? 'Unknown';
    const kind = detectKind(detectedName, input.windowTitle, input.currentUrl, input.currentFileName, input.currentLanguage);
    const preferredAdapterId = inferAdapterId(kind, detectedName);
    const processName = input.windowProcess || input.appInfo?.name || detectedName;
    const executable = `${processName}.exe`;

    return {
      name: detectedName,
      kind,
      confidence: windowDetection.confidence,
      processName,
      executable,
      windowTitle: input.windowTitle,
      browserName: kind === 'browser' ? detectedName : undefined,
      currentUrl: input.currentUrl || undefined,
      workspace: input.currentFileName || undefined,
      fileName: input.currentFileName || undefined,
      language: input.currentLanguage || undefined,
      intent: input.currentIntent || undefined,
      selectedCode: input.selectedText || undefined,
      visibleCode: input.currentImageSummary || undefined,
      visibleContent: input.currentImageSummary || undefined,
      terminalOutput: input.currentErrorMessage || undefined,
      platform: input.appInfo?.platform ?? `${input.metadata.platform ?? ''}`,
      preferredAdapterId,
      detectionTimeMs: Math.max(0, Math.round(performance.now() - startedAt))
    };
  }
}
