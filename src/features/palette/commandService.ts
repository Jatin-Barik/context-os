import type { CommandExecutionContext, CommandResult, IntentCommand } from './commandRegistry';
import { getCommandById } from './commandRegistry';
import { useShellStore } from '@/store/shellStore';
import { useCommandPaletteStore } from './commandPaletteStore';

export interface CommandService {
  executeCommand: (commandId: string) => void;
}

export function createCommandService(): CommandService {
  const shellStore = useShellStore.getState();
  const paletteStore = useCommandPaletteStore.getState();

  const executeCommand = (commandId: string): void => {
    const command = getCommandById(commandId as Parameters<typeof getCommandById>[0]);
    const result = command.run({
      appInfo: shellStore.appInfo,
      latestContext: shellStore.recentContexts[0] ?? null
    });
    const timestamp = new Date().toISOString();

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

    paletteStore.pushRecentCommand({
      id: command.id,
      title: command.title,
      category: command.category,
      timestamp
    });

    if (command.id === 'generate-tests') {
      shellStore.setActivePage('history');
    }

    shellStore.closePalette();
  };

  return { executeCommand };
}
