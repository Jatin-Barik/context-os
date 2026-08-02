import { useCommandPaletteStore } from './commandPaletteStore';
import { useShellStore } from '@/store/shellStore';
import { captureContext } from '@/services/context/contextCaptureService';
import { createAIService } from '@/services/ai/aiService';
import { getSharedApplicationManager } from '@/integrations/core/ApplicationManager';
import type { ApplicationContextInput } from '@/integrations/core/ApplicationTypes';
import type { ApplicationContext } from '@/integrations/core/ApplicationContext';

export interface CommandExecutionOutcome {
  keepPaletteOpen: boolean;
}

export interface CommandService {
  executeCommand: (commandId: string) => Promise<CommandExecutionOutcome>;
  cancelActiveExecution: () => void;
}

function toShellContextSnapshot(context: Awaited<ReturnType<typeof captureContext>>['context']) {
  return {
    id: crypto.randomUUID(),
    appName: context.application.name,
    windowTitle: context.windowTitle,
    selectedText: context.selectedText.selection || '',
    clipboardText: context.clipboard.text,
    currentUrl: context.browser.available ? context.browser.url ?? '' : '',
    currentFileName: context.windowProcess,
    currentLanguage: context.ocr.language,
    currentIntent: context.intent?.intent ?? 'Unknown',
    currentErrorMessage: context.ocr.containsError ? context.ocr.language : '',
    currentTableSummary: context.ocr.containsTable ? 'Table detected' : '',
    currentImageSummary: context.summary ?? context.windowTitle,
    capturedAt: context.timestamp
  };
}

function toApplicationContextInputFromCapture(
  context: Awaited<ReturnType<typeof captureContext>>['context'],
  appInfo: ReturnType<typeof useShellStore.getState>['appInfo']
): ApplicationContextInput {
  return {
    appInfo,
    windowTitle: context.windowTitle,
    windowProcess: context.windowProcess,
    selectedText: context.selectedText.selection || '',
    clipboardText: context.clipboard.text,
    currentUrl: context.browser.available ? context.browser.url ?? '' : '',
    currentFileName: context.windowProcess,
    currentLanguage: context.ocr.language,
    currentIntent: context.intent?.intent ?? 'Unknown',
    currentErrorMessage: context.ocr.containsError ? context.ocr.text : '',
    currentTableSummary: context.ocr.containsTable ? 'Table detected' : '',
    currentImageSummary: context.summary ?? context.windowTitle,
    capturedAt: context.timestamp,
    metadata: {
      platform: appInfo?.platform ?? window.navigator.platform,
      userAgent: window.navigator.userAgent,
      captureSource: context.windowTitle
    }
  };
}

function toApplicationContextInputFromShell(shellContext: ReturnType<typeof useShellStore.getState>['recentContexts'][number] | null, appInfo: ReturnType<typeof useShellStore.getState>['appInfo']): ApplicationContextInput {
  return {
    appInfo,
    windowTitle: shellContext?.windowTitle ?? appInfo?.name ?? 'Unknown window',
    windowProcess: shellContext?.appName ?? appInfo?.name ?? 'unknown',
    selectedText: shellContext?.selectedText ?? '',
    clipboardText: shellContext?.clipboardText ?? '',
    currentUrl: shellContext?.currentUrl ?? '',
    currentFileName: shellContext?.currentFileName ?? '',
    currentLanguage: shellContext?.currentLanguage ?? 'unknown',
    currentIntent: shellContext?.currentIntent ?? 'Reading Research',
    currentErrorMessage: shellContext?.currentErrorMessage ?? '',
    currentTableSummary: shellContext?.currentTableSummary ?? '',
    currentImageSummary: shellContext?.currentImageSummary ?? '',
    capturedAt: shellContext?.capturedAt ?? new Date().toISOString(),
    metadata: {
      appName: shellContext?.appName ?? appInfo?.name ?? 'unknown',
      currentUrl: shellContext?.currentUrl ?? '',
      currentFileName: shellContext?.currentFileName ?? '',
      currentLanguage: shellContext?.currentLanguage ?? '',
      currentIntent: shellContext?.currentIntent ?? '',
      currentImageSummary: shellContext?.currentImageSummary ?? '',
      source: 'command-service'
    }
  };
}

function toShellContextSnapshotFromApplication(context: ApplicationContext) {
  return {
    id: crypto.randomUUID(),
    appName: context.applicationName,
    windowTitle: context.metadata.windowTitle,
    selectedText: context.selectedText,
    clipboardText: context.clipboardText,
    currentUrl: context.currentUrl,
    currentFileName: context.currentFileName,
    currentLanguage: context.language,
    currentIntent: context.intent,
    currentErrorMessage: context.currentErrorMessage,
    currentTableSummary: context.currentTableSummary,
    currentImageSummary: context.currentImageSummary,
    capturedAt: context.capturedAt
  };
}

export function createCommandService(): CommandService {
  const aiService = createAIService();
  const applicationManager = getSharedApplicationManager();

  const executeCommand = async (commandId: string): Promise<CommandExecutionOutcome> => {
    const shellStore = useShellStore.getState();
    const paletteStore = useCommandPaletteStore.getState();
    const timestamp = new Date().toISOString();
    const currentShellContext = shellStore.recentContexts[0] ?? null;
    const activeApplicationInput = toApplicationContextInputFromShell(currentShellContext, shellStore.appInfo);
    const resolution = await applicationManager.resolve(activeApplicationInput);
    const command = applicationManager.resolveCommand(resolution.context, commandId);

    if (!command) {
      throw new Error(`Unknown command: ${commandId}`);
    }

    paletteStore.pushRecentCommand({ id: command.id, title: command.title, category: command.category, timestamp });

    if (command.id !== 'explain-screen') {
      const result = command.run(resolution.context);

      shellStore.recordPrompt({
        id: crypto.randomUUID(),
        commandId: command.id,
        title: command.title,
        summary: result.summary,
        createdAt: timestamp
      });

      shellStore.recordGeneratedAction({
        id: crypto.randomUUID(),
        title: result.title,
        detail: result.detail,
        tags: result.tags,
        createdAt: timestamp
      });

      if (command.id === 'generate-tests') {
        shellStore.setActivePage('history');
      }

      shellStore.closePalette();
      return { keepPaletteOpen: false };
    }

    const captureSession = await captureContext({
      appInfo: shellStore.appInfo
    });

    const applicationInput = toApplicationContextInputFromCapture(captureSession.context, shellStore.appInfo);
    const applicationResolution = await applicationManager.resolve(applicationInput);
    shellStore.recordContext(toShellContextSnapshotFromApplication(applicationResolution.context));

    try {
      const aiResult = await aiService.explainScreen(
        {
          context: applicationResolution.context,
          commandTitle: command.title,
          commandSummary: command.description
        },
        {
          onStart: (prompt) => shellStore.startAIExecution(command.title, prompt),
          onChunk: ({ text }) => shellStore.appendAIResponseChunk(text),
          onComplete: (result) => {
            shellStore.completeAIExecution(result.formattedResponse, [...result.followUps], result.metrics);
            shellStore.recordPrompt({
              id: crypto.randomUUID(),
              commandId: command.id,
              title: command.title,
              summary: result.formattedResponse.split('\n')[0] ?? result.formattedResponse,
              createdAt: timestamp
            });
            shellStore.recordGeneratedAction({
              id: crypto.randomUUID(),
              title: 'Local screen explanation ready',
              detail: result.formattedResponse,
              tags: ['local-ai', 'streaming', 'context'],
              createdAt: timestamp
            });
          },
          onError: (message) => shellStore.failAIExecution(message)
        }
      );

      return { keepPaletteOpen: true };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to explain the screen.';
      if (message === 'cancelled') {
        shellStore.cancelAIExecution();
        return { keepPaletteOpen: true };
      }

      shellStore.failAIExecution(message);
      return { keepPaletteOpen: true };
    }
  };

  const cancelActiveExecution = (): void => {
    aiService.cancelActiveRequest();
    useShellStore.getState().cancelAIExecution();
  };

  return { executeCommand, cancelActiveExecution };
}
