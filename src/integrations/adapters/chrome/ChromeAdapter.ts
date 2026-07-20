import type { ApplicationAdapter } from '../../core/ApplicationAdapter';
import type { ApplicationContext } from '../../core/ApplicationContext';
import type { ApplicationCommand, ApplicationContextInput, ApplicationMetadata, ApplicationSuggestion } from '../../core/ApplicationTypes';
import { createCommandResult, createSuggestion } from '../../shared/commandHelpers';
import { createUniversalCommands } from '../../shared/baseCommands';

function buildBrowserSummary(input: ApplicationContextInput): string {
  return input.currentImageSummary || input.currentIntent || 'Browser content detected.';
}

function createChromeCommands(): readonly ApplicationCommand[] {
  return [
    {
      id: 'summarize-article',
      title: 'Summarize Article',
      description: 'Summarize the current web page or article.',
      aliases: ['summarize page', 'article'],
      category: 'Browser',
      shortcut: '',
      run: (context) => createCommandResult('Article summarized', 'Summarized the current page content.', `Summarized ${context.metadata.currentUrl ?? context.applicationName}.`, ['browser', 'summary'])
    },
    {
      id: 'translate-page',
      title: 'Translate Page',
      description: 'Translate the visible browser page.',
      aliases: ['translate page'],
      category: 'Browser',
      shortcut: '',
      run: (context) => createCommandResult('Translation ready', 'Prepared a browser translation flow.', context.metadata.currentUrl ?? context.summary, ['browser', 'translate'])
    },
    {
      id: 'extract-key-points',
      title: 'Extract Key Points',
      description: 'Pull the most important points from the page.',
      aliases: ['key points', 'highlights'],
      category: 'Browser',
      shortcut: '',
      run: (context) => createCommandResult('Key points extracted', 'Identified the major points from the current page.', context.summary, ['browser', 'highlights'])
    },
    {
      id: 'identify-topic',
      title: 'Identify Topic',
      description: 'Identify the topic of the current article or page.',
      aliases: ['topic'],
      category: 'Browser',
      shortcut: '',
      run: (context) => createCommandResult('Topic identified', 'Detected the likely topic of the current page.', context.summary, ['browser', 'topic'])
    },
    {
      id: 'generate-flashcards',
      title: 'Generate Flashcards',
      description: 'Turn the current page into flashcards.',
      aliases: ['flashcards'],
      category: 'Browser',
      shortcut: '',
      run: (context) => createCommandResult('Flashcards drafted', 'Created flashcards from the current browser context.', context.summary, ['browser', 'flashcards'])
    },
    {
      id: 'extract-tables',
      title: 'Extract Tables',
      description: 'Extract visible tables from the page.',
      aliases: ['tables', 'rows', 'columns'],
      category: 'Browser',
      shortcut: '',
      run: (context) => createCommandResult('Tables extracted', 'Prepared table extraction from the page context.', context.metadata.currentUrl ?? context.summary, ['browser', 'tables'])
    }
  ] as const;
}

export class ChromeAdapter implements ApplicationAdapter {
  private initialized = false;

  async initialize(): Promise<void> {
    this.initialized = true;
  }

  isSupported(metadata: ApplicationMetadata): boolean {
    return metadata.kind === 'browser' || metadata.name.toLowerCase().includes('chrome') || metadata.name.toLowerCase().includes('edge') || metadata.name.toLowerCase().includes('brave') || metadata.name.toLowerCase().includes('arc') || metadata.name.toLowerCase().includes('opera');
  }

  isActive(metadata: ApplicationMetadata): boolean {
    return metadata.preferredAdapterId === 'chrome';
  }

  async extractContext(input: ApplicationContextInput, metadata: ApplicationMetadata): Promise<ApplicationContext> {
    const summary = buildBrowserSummary(input);
    return {
      adapterId: 'chrome',
      adapterName: this.getDisplayName(),
      applicationName: metadata.browserName ?? metadata.name,
      iconKey: this.getIcon(),
      contentType: 'browser',
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
      metadata: {
        ...metadata,
        browserName: metadata.browserName ?? metadata.name,
        currentUrl: input.currentUrl || metadata.currentUrl,
        workspace: input.currentFileName || metadata.workspace,
        fileName: input.currentFileName || metadata.fileName,
        language: input.currentLanguage || metadata.language,
        intent: input.currentIntent || metadata.intent
      },
      supportedCommands: [],
      suggestions: [],
      health: {
        status: this.initialized ? 'healthy' : 'degraded',
        detail: this.initialized ? 'Chrome adapter ready.' : 'Chrome adapter has not initialized yet.'
      },
      detectionTimeMs: metadata.detectionTimeMs,
      executionTimeMs: 0
    };
  }

  getSupportedCommands(context: ApplicationContext): readonly ApplicationCommand[] {
    return [...createUniversalCommands(), ...createChromeCommands()];
  }

  getSuggestions(context: ApplicationContext): readonly ApplicationSuggestion[] {
    return [
      createSuggestion('Summarize Article', 'Summarize the current article or page.', 'summarize-article', ['reading', 'summary']),
      createSuggestion('Extract Key Points', 'Extract the most important points from the page.', 'extract-key-points', ['reading', 'highlights']),
      createSuggestion('Generate Notes', 'Convert the page into study notes.', 'generate-notes', ['notes']),
      createSuggestion('Generate Flashcards', 'Turn the page into study flashcards.', 'generate-flashcards', ['study'])
    ];
  }

  getIcon() {
    return 'browser' as const;
  }

  getDisplayName() {
    return 'Chrome Adapter';
  }

  async dispose(): Promise<void> {
    this.initialized = false;
  }
}
