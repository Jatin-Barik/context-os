import type { ApplicationAdapter } from '../../core/ApplicationAdapter';
import type { ApplicationContext } from '../../core/ApplicationContext';
import type { ApplicationCommand, ApplicationContextInput, ApplicationMetadata, ApplicationSuggestion } from '../../core/ApplicationTypes';
import { createCommandResult, createSuggestion } from '../../shared/commandHelpers';
import { createUniversalCommands } from '../../shared/baseCommands';

function buildCodeSummary(input: ApplicationContextInput): string {
  return input.currentErrorMessage || input.currentImageSummary || input.currentIntent || 'Code editor context detected.';
}

function createVSCodeCommands(): readonly ApplicationCommand[] {
  return [
    {
      id: 'explain-error',
      title: 'Explain Error',
      description: 'Explain the current stack trace or error message.',
      aliases: ['debug', 'stack trace', 'error'],
      category: 'Developer',
      shortcut: '',
      run: (context) => createCommandResult('Error analysis staged', 'Prepared a debugging plan for the current error.', context.metadata.fileName ?? context.summary, ['code', 'debugging'])
    },
    {
      id: 'explain-code',
      title: 'Explain Code',
      description: 'Explain the selected or visible code.',
      aliases: ['code explanation', 'explain code'],
      category: 'Developer',
      shortcut: '',
      run: (context) => createCommandResult('Code explanation ready', 'Prepared a code explanation for the current editor context.', context.metadata.fileName ?? context.summary, ['code', 'explain'])
    },
    {
      id: 'refactor-code',
      title: 'Refactor Code',
      description: 'Refactor the current code into a cleaner shape.',
      aliases: ['refactor', 'cleanup'],
      category: 'Developer',
      shortcut: '',
      run: (context) => createCommandResult('Refactor draft ready', 'Prepared a refactor flow for the current code.', context.metadata.fileName ?? context.summary, ['code', 'refactor'])
    },
    {
      id: 'generate-tests',
      title: 'Generate Tests',
      description: 'Generate tests for the active file or selection.',
      aliases: ['tests', 'coverage'],
      category: 'Developer',
      shortcut: '',
      run: (context) => createCommandResult('Test plan drafted', 'Outlined regression checks for the current code context.', context.metadata.fileName ?? context.summary, ['code', 'tests'])
    },
    {
      id: 'generate-docs',
      title: 'Generate Docs',
      description: 'Generate documentation for the current code.',
      aliases: ['docs', 'documentation'],
      category: 'Developer',
      shortcut: '',
      run: (context) => createCommandResult('Docs drafted', 'Prepared documentation output for the current code.', context.metadata.fileName ?? context.summary, ['code', 'docs'])
    },
    {
      id: 'optimize-code',
      title: 'Optimize Code',
      description: 'Optimize the code for readability or performance.',
      aliases: ['optimize', 'performance'],
      category: 'Developer',
      shortcut: '',
      run: (context) => createCommandResult('Optimization draft ready', 'Prepared optimization suggestions for the current file.', context.metadata.fileName ?? context.summary, ['code', 'optimize'])
    },
    {
      id: 'generate-commit-message',
      title: 'Generate Commit Message',
      description: 'Draft a commit message from the current code changes.',
      aliases: ['commit', 'message'],
      category: 'Developer',
      shortcut: '',
      run: (context) => createCommandResult('Commit message drafted', 'Prepared a commit message for the current code context.', context.metadata.fileName ?? context.summary, ['code', 'git'])
    }
  ] as const;
}

export class VSCodeAdapter implements ApplicationAdapter {
  private initialized = false;

  async initialize(): Promise<void> {
    this.initialized = true;
  }

  isSupported(metadata: ApplicationMetadata): boolean {
    return metadata.kind === 'editor' || metadata.name.toLowerCase().includes('visual studio code') || metadata.windowTitle.toLowerCase().includes('visual studio code') || Boolean(metadata.fileName?.match(/\.(ts|tsx|js|jsx|json|md|css|scss|html)$/i));
  }

  isActive(metadata: ApplicationMetadata): boolean {
    return metadata.preferredAdapterId === 'vscode';
  }

  async extractContext(input: ApplicationContextInput, metadata: ApplicationMetadata): Promise<ApplicationContext> {
    const summary = buildCodeSummary(input);
    return {
      adapterId: 'vscode',
      adapterName: this.getDisplayName(),
      applicationName: 'VS Code',
      iconKey: this.getIcon(),
      contentType: 'editor',
      language: input.currentLanguage || 'unknown',
      intent: input.currentIntent || 'Debugging Code',
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
        workspace: input.currentFileName || metadata.workspace,
        fileName: input.currentFileName || metadata.fileName,
        language: input.currentLanguage || metadata.language,
        intent: input.currentIntent || metadata.intent,
        terminalOutput: input.currentErrorMessage || undefined,
        selectedCode: input.selectedText || undefined,
        visibleCode: input.currentImageSummary || undefined
      },
      supportedCommands: [],
      suggestions: [],
      health: {
        status: this.initialized ? 'healthy' : 'degraded',
        detail: this.initialized ? 'VS Code adapter ready.' : 'VS Code adapter has not initialized yet.'
      },
      detectionTimeMs: metadata.detectionTimeMs,
      executionTimeMs: 0
    };
  }

  getSupportedCommands(context: ApplicationContext): readonly ApplicationCommand[] {
    return [...createUniversalCommands(), ...createVSCodeCommands()];
  }

  getSuggestions(context: ApplicationContext): readonly ApplicationSuggestion[] {
    return [
      createSuggestion('Explain Error', 'Analyze the current stack trace or runtime error.', 'explain-error', ['debugging', 'error']),
      createSuggestion('Refactor Code', 'Improve readability and structure of the current file.', 'refactor-code', ['code', 'refactor']),
      createSuggestion('Generate Tests', 'Draft tests for the active file or selection.', 'generate-tests', ['tests']),
      createSuggestion('Generate Commit Message', 'Summarize the current changes into a commit message.', 'generate-commit-message', ['git'])
    ];
  }

  getIcon() {
    return 'code' as const;
  }

  getDisplayName() {
    return 'VS Code Adapter';
  }

  async dispose(): Promise<void> {
    this.initialized = false;
  }
}
