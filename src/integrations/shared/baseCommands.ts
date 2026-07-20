import type { ApplicationContext, ApplicationCommand } from '../core/ApplicationTypes';
import { createCommandResult } from './commandHelpers';

function baseSummary(context: ApplicationContext): string {
  return context.summary || `${context.applicationName} is active.`;
}

export function createUniversalCommands(): readonly ApplicationCommand[] {
  return [
    {
      id: 'explain-screen',
      title: 'Explain Screen',
      description: 'Explain the visible context using the current application adapter.',
      aliases: ['explain', 'screen', 'understand'],
      category: 'Understanding',
      shortcut: '⌘/Ctrl + 1',
      run: (context) => createCommandResult('Explained current screen', baseSummary(context), `Explained the current screen for ${context.applicationName}.`, ['screen', 'context'])
    },
    {
      id: 'summarize-screen',
      title: 'Summarize Screen',
      description: 'Condense the current application context into a short summary.',
      aliases: ['summary', 'brief', 'compress'],
      category: 'Writing',
      shortcut: '⌘/Ctrl + 2',
      run: (context) => createCommandResult('Prepared summary', baseSummary(context), context.summary, ['summary', 'draft'])
    },
    {
      id: 'translate',
      title: 'Translate',
      description: 'Translate the visible text while preserving tone and meaning.',
      aliases: ['language', 'localize'],
      category: 'Writing',
      shortcut: '⌘/Ctrl + 3',
      run: (context) => createCommandResult('Translation draft ready', 'Prepared a translation flow for the current text.', context.metadata.currentUrl || context.summary, ['translate', 'language'])
    },
    {
      id: 'generate-notes',
      title: 'Generate Notes',
      description: 'Turn the current adapter context into structured notes.',
      aliases: ['notes', 'summary'],
      category: 'Planning',
      shortcut: '⌘/Ctrl + 4',
      run: (context) => createCommandResult('Notes draft ready', 'Prepared a structured notes draft from the active context.', context.summary, ['notes', 'planning'])
    },
    {
      id: 'search-history',
      title: 'Search History',
      description: 'Jump to the recent command history view.',
      aliases: ['history', 'recent'],
      category: 'Navigation',
      shortcut: '⌘/Ctrl + 5',
      run: () => createCommandResult('History view opened', 'Opened the history view for recent commands and prompts.', 'Review recent commands from the shell history.', ['history', 'navigation'])
    },
    {
      id: 'settings',
      title: 'Settings',
      description: 'Open the settings workspace for privacy and controls.',
      aliases: ['preferences', 'privacy', 'controls'],
      category: 'Navigation',
      shortcut: '⌘/Ctrl + ,',
      run: (context) => createCommandResult('Settings opened', 'Opened the settings area for privacy and local controls.', context.applicationName, ['settings', 'privacy'])
    },
    {
      id: 'quit',
      title: 'Quit ContextOS',
      description: 'Exit the application gracefully.',
      aliases: ['exit', 'quit app'],
      category: 'System',
      shortcut: '⌘/Ctrl + Q',
      run: () => createCommandResult('ContextOS will close', 'The app is prepared to exit gracefully.', 'No local AI or desktop capture task is running.', ['quit', 'system'])
    }
  ] as const;
}
