import type { AppInfo } from '@shared/bridge';

export type ApplicationKind = 'browser' | 'editor' | 'productivity' | 'terminal' | 'communications' | 'media' | 'generic';

export type ApplicationContentType = 'browser' | 'editor' | 'document' | 'spreadsheet' | 'terminal' | 'communication' | 'general';

export type ApplicationIconKey = 'browser' | 'code' | 'generic' | 'terminal' | 'document' | 'spreadsheet' | 'chat';

export interface ApplicationCommandResult {
  readonly title: string;
  readonly summary: string;
  readonly detail: string;
  readonly tags: readonly string[];
}

export interface ApplicationCommand {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly aliases: readonly string[];
  readonly category: string;
  readonly shortcut: string;
  readonly run: (context: ApplicationContext) => ApplicationCommandResult;
}

export interface ApplicationSuggestion {
  readonly title: string;
  readonly detail: string;
  readonly commandId: string;
  readonly tags: readonly string[];
}

export interface ApplicationMetadata {
  readonly name: string;
  readonly kind: ApplicationKind;
  readonly confidence: number;
  readonly processName: string;
  readonly executable: string;
  readonly windowTitle: string;
  readonly browserName?: string;
  readonly currentUrl?: string;
  readonly workspace?: string;
  readonly fileName?: string;
  readonly language?: string;
  readonly intent?: string;
  readonly platform?: string;
  readonly selectedCode?: string;
  readonly visibleCode?: string;
  readonly visibleContent?: string;
  readonly terminalOutput?: string;
  readonly preferredAdapterId: string;
  readonly detectionTimeMs: number;
}

export interface ApplicationContextInput {
  readonly appInfo: AppInfo | null;
  readonly windowTitle: string;
  readonly windowProcess: string;
  readonly selectedText: string;
  readonly clipboardText: string;
  readonly currentUrl: string;
  readonly currentFileName: string;
  readonly currentLanguage: string;
  readonly currentIntent: string;
  readonly currentErrorMessage: string;
  readonly currentTableSummary: string;
  readonly currentImageSummary: string;
  readonly capturedAt: string;
  readonly metadata: Record<string, unknown>;
}

export interface ApplicationHealth {
  readonly status: 'healthy' | 'degraded' | 'unavailable';
  readonly detail: string;
}
