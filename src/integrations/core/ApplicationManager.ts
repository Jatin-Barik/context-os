import { ApplicationAdapter } from './ApplicationAdapter';
import { ApplicationContext } from './ApplicationContext';
import { ApplicationDetector } from './ApplicationDetector';
import { ApplicationRegistry, InstalledAdapterSnapshot } from './ApplicationRegistry';
import { CommandResolver } from './CommandResolver';
import { SuggestionEngine } from './SuggestionEngine';
import type { ApplicationCommand, ApplicationContextInput, ApplicationMetadata, ApplicationSuggestion } from './ApplicationTypes';

function buildHealth(adapter: ApplicationAdapter | null, metadata: ApplicationMetadata): { status: 'healthy' | 'degraded' | 'unavailable'; detail: string } {
  if (!adapter) {
    return { status: 'unavailable', detail: `No adapter registered for ${metadata.preferredAdapterId}.` };
  }

  if (!adapter.isSupported(metadata)) {
    return { status: 'degraded', detail: `${adapter.getDisplayName()} loaded, but it is not the best match for the current window.` };
  }

  return { status: 'healthy', detail: `${adapter.getDisplayName()} is active.` };
}

export interface ApplicationResolutionResult {
  readonly context: ApplicationContext;
  readonly adapter: ApplicationAdapter | null;
  readonly installedAdapters: readonly InstalledAdapterSnapshot[];
}

export class ApplicationManager {
  private readonly registry: ApplicationRegistry;
  private readonly detector: ApplicationDetector;
  private readonly commandResolver: CommandResolver;
  private readonly suggestionEngine: SuggestionEngine;

  constructor(registry: ApplicationRegistry, detector = new ApplicationDetector(), commandResolver = new CommandResolver(), suggestionEngine = new SuggestionEngine()) {
    this.registry = registry;
    this.detector = detector;
    this.commandResolver = commandResolver;
    this.suggestionEngine = suggestionEngine;
  }

  async resolve(input: ApplicationContextInput): Promise<ApplicationResolutionResult> {
    const detected = this.detector.detect(input);
    const adapter = await this.registry.resolve(detected.preferredAdapterId) ?? await this.registry.resolve('generic');
    const activeAdapter = adapter ?? null;

    if (!activeAdapter) {
      const fallbackContext: ApplicationContext = {
        adapterId: 'generic',
        adapterName: 'Generic Adapter',
        applicationName: detected.name,
        iconKey: 'generic',
        contentType: 'general',
        language: input.currentLanguage,
        intent: input.currentIntent,
        summary: input.currentImageSummary || input.currentIntent,
        selectedText: input.selectedText,
        clipboardText: input.clipboardText,
        currentUrl: input.currentUrl,
        currentFileName: input.currentFileName,
        currentErrorMessage: input.currentErrorMessage,
        currentTableSummary: input.currentTableSummary,
        currentImageSummary: input.currentImageSummary,
        capturedAt: input.capturedAt,
        metadata: detected,
        supportedCommands: [],
        suggestions: [],
        health: { status: 'unavailable', detail: 'No application adapter is available.' },
        detectionTimeMs: detected.detectionTimeMs,
        executionTimeMs: 0
      };

      return { context: fallbackContext, adapter: null, installedAdapters: await this.registry.listInstalledAdapters() };
    }

    await activeAdapter.initialize(input, detected);
    const startedAt = performance.now();
    const extractedContext = await activeAdapter.extractContext(input, detected);
    const supportedCommands = activeAdapter.getSupportedCommands(extractedContext);
    const contextWithCommands: ApplicationContext = {
      ...extractedContext,
      adapterId: detected.preferredAdapterId,
      adapterName: activeAdapter.getDisplayName(),
      iconKey: activeAdapter.getIcon(),
      supportedCommands,
      suggestions: activeAdapter.getSuggestions({
        ...extractedContext,
        supportedCommands,
        suggestions: extractedContext.suggestions
      }),
      health: buildHealth(activeAdapter, detected),
      detectionTimeMs: detected.detectionTimeMs,
      executionTimeMs: Math.max(0, Math.round(performance.now() - startedAt))
    };

    this.registry.setActiveAdapter(detected.preferredAdapterId);
    return {
      context: contextWithCommands,
      adapter: activeAdapter,
      installedAdapters: await this.registry.listInstalledAdapters()
    };
  }

  resolveCommands(context: ApplicationContext, query: string): readonly ApplicationCommand[] {
    return this.commandResolver.resolveCommands(context, query);
  }

  resolveCommand(context: ApplicationContext, commandId: string): ApplicationCommand | null {
    return this.commandResolver.resolveCommand(context, commandId);
  }

  getSuggestions(context: ApplicationContext): readonly ApplicationSuggestion[] {
    return this.suggestionEngine.getSuggestions(context);
  }

  listInstalledAdapters(): Promise<readonly InstalledAdapterSnapshot[]> {
    return this.registry.listInstalledAdapters();
  }

  getActiveAdapterId(): string | null {
    return this.registry.getActiveAdapterId();
  }

  async dispose(): Promise<void> {
    await this.registry.dispose();
  }
}

export function createDefaultApplicationManager(): ApplicationManager {
  const registry = new ApplicationRegistry();

  registry.register('generic', async () => new (await import('../adapters/generic/GenericAdapter')).GenericAdapter(), {
    displayName: 'Generic Adapter',
    iconKey: 'generic'
  });
  registry.register('chrome', async () => new (await import('../adapters/chrome/ChromeAdapter')).ChromeAdapter(), {
    displayName: 'Chrome Adapter',
    iconKey: 'browser'
  });
  registry.register('vscode', async () => new (await import('../adapters/vscode/VSCodeAdapter')).VSCodeAdapter(), {
    displayName: 'VS Code Adapter',
    iconKey: 'code'
  });

  return new ApplicationManager(registry);
}

let sharedApplicationManager: ApplicationManager | null = null;

export function getSharedApplicationManager(): ApplicationManager {
  if (!sharedApplicationManager) {
    sharedApplicationManager = createDefaultApplicationManager();
  }

  return sharedApplicationManager;
}
