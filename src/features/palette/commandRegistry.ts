import type { AppInfo } from '@shared/bridge';
import type { ContextSnapshot } from '@/store/shellStore';

export type IntentCommandId =
  | 'explain-screen'
  | 'summarize-screen'
  | 'rewrite'
  | 'translate'
  | 'explain-error'
  | 'generate-tests'
  | 'extract-table'
  | 'generate-notes'
  | 'search-history'
  | 'settings'
  | 'quit';

export interface CommandExecutionContext {
  appInfo: AppInfo | null;
  latestContext: ContextSnapshot | null;
}

export interface CommandResult {
  title: string;
  summary: string;
  detail: string;
  tags: string[];
}

export interface IntentCommand {
  id: IntentCommandId;
  title: string;
  description: string;
  aliases: string[];
  category: string;
  shortcut: string;
  run: (context: CommandExecutionContext) => CommandResult;
}

const COMMANDS: IntentCommand[] = [
  {
    id: 'explain-screen',
    title: 'Explain Screen',
    description: 'Capture the screen, extract OCR, build context, and generate a local explanation.',
    aliases: ['explain', 'screen', 'understand'],
    category: 'Understanding',
    shortcut: '⌘/Ctrl + 1',
    run: ({ latestContext }) => ({
      title: 'Explained current screen',
      summary: `Mapped the current screen context for ${latestContext?.appName ?? 'the active app'}.`,
      detail: latestContext?.windowTitle ?? 'No live window capture yet. Once screen capture is connected, this command will summarize the visible context.',
      tags: ['screen', 'context']
    })
  },
  {
    id: 'summarize-screen',
    title: 'Summarize Screen',
    description: 'Condense the active content into a short, readable summary.',
    aliases: ['summary', 'brief', 'compress'],
    category: 'Writing',
    shortcut: '⌘/Ctrl + 2',
    run: ({ latestContext }) => ({
      title: 'Prepared summary',
      summary: 'Created a condensed summary draft from the current context.',
      detail: latestContext?.selectedText || latestContext?.clipboardText || 'No visible text has been captured yet.',
      tags: ['summary', 'draft']
    })
  },
  {
    id: 'translate',
    title: 'Translate',
    description: 'Translate the visible text into another language.',
    aliases: ['language', 'localize'],
    category: 'Writing',
    shortcut: '⌘/Ctrl + 3',
    run: ({ latestContext }) => ({
      title: 'Translation draft ready',
      summary: 'Prepared a translation flow for the current text.',
      detail: latestContext?.clipboardText || 'Text translation will use the selected region once OCR and selection capture are live.',
      tags: ['translate', 'language']
    })
  },
  {
    id: 'rewrite',
    title: 'Rewrite',
    description: 'Rewrite the selected content into a crisp, professional tone.',
    aliases: ['rewrite', 'professional', 'polish'],
    category: 'Writing',
    shortcut: '⌘/Ctrl + 4',
    run: ({ latestContext }) => ({
      title: 'Rewrite draft ready',
      summary: 'Drafted a more professional version of the current text.',
      detail: latestContext?.selectedText || 'Select text in any supported app to rewrite it.',
      tags: ['writing', 'tone']
    })
  },
  {
    id: 'generate-notes',
    title: 'Generate Notes',
    description: 'Turn the current context into structured notes.',
    aliases: ['notes', 'summary', 'notes'],
    category: 'Planning',
    shortcut: '⌘/Ctrl + 5',
    run: ({ latestContext }) => ({
      title: 'Notes draft ready',
      summary: 'Prepared a structured notes draft from the active context.',
      detail: latestContext?.windowTitle || 'Capture a surface to generate notes from the current context.',
      tags: ['notes', 'planning']
    })
  },
  {
    id: 'extract-table',
    title: 'Extract Table',
    description: 'Turn a visible table into structured data.',
    aliases: ['table', 'json', 'csv'],
    category: 'Extraction',
    shortcut: '⌘/Ctrl + 6',
    run: ({ latestContext }) => ({
      title: 'Table extraction staged',
      summary: 'Prepared structured extraction for the visible table.',
      detail: latestContext?.currentTableSummary || 'Once table OCR is wired in, this will emit rows and columns as structured data.',
      tags: ['table', 'structured-data']
    })
  },
  {
    id: 'explain-error',
    title: 'Explain Error',
    description: 'Analyze the current error message and suggest a fix path.',
    aliases: ['debug', 'stack trace', 'error'],
    category: 'Debugging',
    shortcut: '⌘/Ctrl + 7',
    run: ({ latestContext }) => ({
      title: 'Error analysis staged',
      summary: 'Interpreted the latest error context and prepared a debugging plan.',
      detail: latestContext?.currentErrorMessage || 'No active error context yet. Capture stack traces from supported apps to enable this flow.',
      tags: ['debugging', 'stack-trace']
    })
  },
  {
    id: 'generate-tests',
    title: 'Generate Tests',
    description: 'Create a test plan for the current code or behavior.',
    aliases: ['tests', 'coverage'],
    category: 'Engineering',
    shortcut: '⌘/Ctrl + 8',
    run: ({ latestContext }) => ({
      title: 'Test plan drafted',
      summary: 'Outlined regression checks and test cases for the current context.',
      detail: latestContext?.currentFileName || 'Connect to the active file in VS Code to generate targeted tests.',
      tags: ['testing', 'quality']
    })
  },
  {
    id: 'search-history',
    title: 'Search History',
    description: 'Jump to the recent command history view.',
    aliases: ['history', 'recent'],
    category: 'Navigation',
    shortcut: '⌘/Ctrl + 9',
    run: ({ latestContext }) => ({
      title: 'History view opened',
      summary: 'Opened the history view for recent commands and prompts.',
      detail: latestContext?.windowTitle || 'Review recent commands from the shell history.',
      tags: ['history', 'navigation']
    })
  },
  {
    id: 'settings',
    title: 'Settings',
    description: 'Open the settings workspace for privacy and controls.',
    aliases: ['preferences', 'privacy', 'controls'],
    category: 'Navigation',
    shortcut: '⌘/Ctrl + ,',
    run: ({ latestContext }) => ({
      title: 'Settings opened',
      summary: 'Opened the settings area for privacy and local controls.',
      detail: latestContext?.appName || 'Open settings from the shared shell navigation.',
      tags: ['settings', 'privacy']
    })
  },
  {
    id: 'quit',
    title: 'Quit ContextOS',
    description: 'Exit the application gracefully.',
    aliases: ['exit', 'quit app'],
    category: 'System',
    shortcut: '⌘/Ctrl + Q',
    run: () => ({
      title: 'ContextOS will close',
      summary: 'The app is prepared to exit gracefully.',
      detail: 'No local AI or desktop capture task is running.',
      tags: ['quit', 'system']
    })
  }
];

export function getCommands(): IntentCommand[] {
  return COMMANDS;
}

export function searchCommands(query: string): IntentCommand[] {
  const normalized = query.trim().toLowerCase();

  if (!normalized) {
    return COMMANDS.slice(0, 8);
  }

  const terms = normalized.split(/\s+/).filter(Boolean);

  return COMMANDS.filter((command) => {
    const searchable = [command.title, command.description, command.category, ...command.aliases].join(' ').toLowerCase();
    const haystack = `${command.title} ${command.description} ${command.category} ${command.aliases.join(' ')}`.toLowerCase();

    return terms.every((term) => haystack.includes(term)) || fuzzyMatch(terms, haystack);
  }).sort((left, right) => {
    const leftScore = scoreCommand(left, normalized);
    const rightScore = scoreCommand(right, normalized);
    return rightScore - leftScore;
  });
}

function fuzzyMatch(terms: string[], haystack: string): boolean {
  return terms.every((term) => haystack.includes(term.slice(0, 2)) || haystack.includes(term));
}

function scoreCommand(command: IntentCommand, query: string): number {
  const haystack = [command.title, command.description, command.category, ...command.aliases].join(' ').toLowerCase();

  if (haystack.includes(query)) {
    return 20;
  }

  const queryTerms = query.split(/\s+/).filter(Boolean);
  return queryTerms.reduce((score, term) => {
    if (haystack.includes(term)) {
      return score + 4;
    }
    return score + (haystack.includes(term.slice(0, 2)) ? 2 : 0);
  }, 0);
}

export function getCommandById(commandId: IntentCommandId): IntentCommand {
  const command = COMMANDS.find((entry) => entry.id === commandId);
  if (!command) {
    throw new Error(`Unknown command: ${commandId}`);
  }

  return command;
}
