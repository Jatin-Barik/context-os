import type { ApplicationAdapter } from '../../core/ApplicationAdapter';
import type { ApplicationContext } from '../../core/ApplicationContext';
import type { ApplicationCommand, ApplicationContextInput, ApplicationMetadata, ApplicationSuggestion } from '../../core/ApplicationTypes';
import { createCommandResult, createSuggestion } from '../../shared/commandHelpers';
import { createUniversalCommands } from '../../shared/baseCommands';

export class GenericAdapter implements ApplicationAdapter {
  private initialized = false;

  async initialize(): Promise<void> {
    this.initialized = true;
  }

  isSupported(metadata: ApplicationMetadata): boolean {
    return metadata.kind === 'generic' || metadata.preferredAdapterId === 'generic';
  }

  isActive(metadata: ApplicationMetadata): boolean {
    return metadata.preferredAdapterId === 'generic';
  }

  async extractContext(input: ApplicationContextInput, metadata: ApplicationMetadata): Promise<ApplicationContext> {
    const summary = input.currentImageSummary || input.currentIntent || 'General desktop activity detected.';
    return {
      adapterId: 'generic',
      adapterName: this.getDisplayName(),
      applicationName: metadata.name,
      iconKey: this.getIcon(),
      contentType: 'general',
      language: input.currentLanguage || 'unknown',
      intent: input.currentIntent || 'Reading Research',
      summary,
      selectedText: input.selectedText,
      clipboardText: input.clipboardText,
      currentUrl: input.currentUrl,
      currentFileName: input.currentFileName,
      currentErrorMessage: input.currentErrorMessage,
      currentTableSummary: input.currentTableSummary,
      currentImageSummary: input.currentImageSummary,
      capturedAt: input.capturedAt,
      metadata,
      supportedCommands: [],
      suggestions: [],
      health: {
        status: this.initialized ? 'healthy' : 'degraded',
        detail: this.initialized ? 'Generic adapter ready.' : 'Adapter was not initialized yet.'
      },
      detectionTimeMs: metadata.detectionTimeMs,
      executionTimeMs: 0
    };
  }

  getSupportedCommands(context: ApplicationContext): readonly ApplicationCommand[] {
    return createUniversalCommands();
  }

  getSuggestions(context: ApplicationContext): readonly ApplicationSuggestion[] {
    return [
      createSuggestion('Summarize Screen', 'Create a concise summary of the current screen.', 'summarize-screen', ['summary']),
      createSuggestion('Generate Notes', 'Turn the current screen into structured notes.', 'generate-notes', ['notes']),
      createSuggestion('Explain Screen', 'Explain the active desktop context.', 'explain-screen', ['understanding'])
    ];
  }

  getIcon() {
    return 'generic' as const;
  }

  getDisplayName() {
    return 'Generic Adapter';
  }

  async dispose(): Promise<void> {
    this.initialized = false;
  }
}
