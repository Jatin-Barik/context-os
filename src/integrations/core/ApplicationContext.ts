import type { ApplicationCommand, ApplicationContentType, ApplicationHealth, ApplicationIconKey, ApplicationMetadata, ApplicationSuggestion } from './ApplicationTypes';

export interface ApplicationContext {
  readonly adapterId: string;
  readonly adapterName: string;
  readonly applicationName: string;
  readonly iconKey: ApplicationIconKey;
  readonly contentType: ApplicationContentType;
  readonly language: string;
  readonly intent: string;
  readonly summary: string;
  readonly selectedText: string;
  readonly clipboardText: string;
  readonly currentUrl: string;
  readonly currentFileName: string;
  readonly currentErrorMessage: string;
  readonly currentTableSummary: string;
  readonly currentImageSummary: string;
  readonly capturedAt: string;
  readonly metadata: ApplicationMetadata;
  readonly supportedCommands: readonly ApplicationCommand[];
  readonly suggestions: readonly ApplicationSuggestion[];
  readonly health: ApplicationHealth;
  readonly detectionTimeMs: number;
  readonly executionTimeMs: number;
}
