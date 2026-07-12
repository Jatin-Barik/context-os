import type { AppInfo } from '@shared/bridge';
import type { ContextSnapshot } from '@/store/shellStore';

export type IntentCommandId =
  | 'explain-this'
  | 'summarize'
  | 'rewrite'
  | 'translate'
  | 'fix-error'
  | 'generate-tests'
  | 'explain-formula'
  | 'extract-table'
  | 'create-todos'
  | 'reply-professionally'
  | 'generate-docs'
  | 'explain-image'
  | 'convert-markdown'
  | 'convert-json';

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
  run: (context: CommandExecutionContext) => CommandResult;
}

const COMMANDS: IntentCommand[] = [
  {
    id: 'explain-this',
    title: 'Explain this',
    description: 'Break down the visible screen content into a concise explanation.',
    aliases: ['explain', 'what is this', 'understand'],
    category: 'Understanding',
    run: ({ latestContext }) => ({
      title: 'Explained current screen',
      summary: `Mapped the current screen context for ${latestContext?.appName ?? 'the active app'}.`,
      detail:
        latestContext?.windowTitle ??
        'No live window capture yet. Once screen understanding is connected, this command will summarize the visible context.',
      tags: ['screen', 'context']
    })
  },
  {
    id: 'summarize',
    title: 'Summarize',
    description: 'Condense the active content into a short, readable summary.',
    aliases: ['summary', 'brief', 'compress'],
    category: 'Writing',
    run: ({ latestContext }) => ({
      title: 'Prepared summary',
      summary: 'Created a condensed summary draft from the current context.',
      detail: latestContext?.selectedText || latestContext?.clipboardText || 'No visible text has been captured yet.',
      tags: ['summary', 'draft']
    })
  },
  {
    id: 'rewrite',
    title: 'Rewrite professionally',
    description: 'Rewrite the selected content into a crisp, professional tone.',
    aliases: ['rewrite', 'professional', 'polish'],
    category: 'Writing',
    run: ({ latestContext }) => ({
      title: 'Rewrite draft ready',
      summary: 'Drafted a more professional version of the current text.',
      detail: latestContext?.selectedText || 'Select text in any supported app to rewrite it.',
      tags: ['writing', 'tone']
    })
  },
  {
    id: 'translate',
    title: 'Translate',
    description: 'Translate the visible text into another language.',
    aliases: ['language', 'localize'],
    category: 'Writing',
    run: ({ latestContext }) => ({
      title: 'Translation draft ready',
      summary: 'Prepared a translation flow for the current text.',
      detail: latestContext?.clipboardText || 'Text translation will use the selected region once OCR and selection capture are live.',
      tags: ['translate', 'language']
    })
  },
  {
    id: 'fix-error',
    title: 'Explain error',
    description: 'Analyze the current error message and suggest a fix path.',
    aliases: ['debug', 'stack trace', 'error'],
    category: 'Debugging',
    run: ({ latestContext }) => ({
      title: 'Error analysis staged',
      summary: 'Interpreted the latest error context and prepared a debugging plan.',
      detail: latestContext?.currentErrorMessage || 'No active error context yet. Capture stack traces from supported apps to enable this flow.',
      tags: ['debugging', 'stack-trace']
    })
  },
  {
    id: 'generate-tests',
    title: 'Generate tests',
    description: 'Create a test plan for the current code or behavior.',
    aliases: ['tests', 'coverage'],
    category: 'Engineering',
    run: ({ latestContext }) => ({
      title: 'Test plan drafted',
      summary: 'Outlined regression checks and test cases for the current context.',
      detail: latestContext?.currentFileName || 'Connect to the active file in VS Code to generate targeted tests.',
      tags: ['testing', 'quality']
    })
  },
  {
    id: 'explain-formula',
    title: 'Explain formula',
    description: 'Break down a spreadsheet formula into plain language.',
    aliases: ['formula', 'excel', 'sheet'],
    category: 'Spreadsheet',
    run: ({ latestContext }) => ({
      title: 'Formula explanation ready',
      summary: 'Prepared a line-by-line explanation for the current formula.',
      detail: latestContext?.currentTableSummary || 'Connect spreadsheet context to inspect formulas directly.',
      tags: ['excel', 'formula']
    })
  },
  {
    id: 'extract-table',
    title: 'Extract table',
    description: 'Turn a visible table into structured data.',
    aliases: ['table', 'json', 'csv'],
    category: 'Extraction',
    run: ({ latestContext }) => ({
      title: 'Table extraction staged',
      summary: 'Prepared structured extraction for the visible table.',
      detail: latestContext?.currentTableSummary || 'Once table OCR is wired in, this will emit rows and columns as structured data.',
      tags: ['table', 'structured-data']
    })
  },
  {
    id: 'create-todos',
    title: 'Create TODOs',
    description: 'Generate an action list from the current context.',
    aliases: ['todo', 'tasks', 'next steps'],
    category: 'Planning',
    run: ({ latestContext }) => ({
      title: 'Action items drafted',
      summary: 'Produced a concise task list from the current context.',
      detail: latestContext?.windowTitle || 'Task extraction works best once screen capture is connected to the active window.',
      tags: ['todo', 'planning']
    })
  },
  {
    id: 'reply-professionally',
    title: 'Reply professionally',
    description: 'Draft a professional reply for email or chat.',
    aliases: ['reply', 'email', 'message'],
    category: 'Communication',
    run: ({ latestContext }) => ({
      title: 'Reply drafted',
      summary: 'Prepared a professional response from the current message context.',
      detail: latestContext?.clipboardText || 'Capture a message thread to draft a reply from the selected text.',
      tags: ['email', 'communication']
    })
  },
  {
    id: 'generate-docs',
    title: 'Generate documentation',
    description: 'Turn code or behavior into documentation notes.',
    aliases: ['docs', 'doc', 'document'],
    category: 'Engineering',
    run: ({ latestContext }) => ({
      title: 'Documentation draft ready',
      summary: 'Outlined the documentation structure from the current context.',
      detail: latestContext?.currentFileName || 'Hook this command to the active code file for targeted docs generation.',
      tags: ['docs', 'engineering']
    })
  },
  {
    id: 'explain-image',
    title: 'Explain image',
    description: 'Describe the visible image or screenshot in plain language.',
    aliases: ['image', 'vision', 'screenshot'],
    category: 'Vision',
    run: ({ latestContext }) => ({
      title: 'Image explanation staged',
      summary: 'Prepared a vision prompt for the active image.',
      detail: latestContext?.currentImageSummary || 'Connect a local vision model to analyze visible imagery.',
      tags: ['vision', 'image']
    })
  },
  {
    id: 'convert-markdown',
    title: 'Convert to markdown',
    description: 'Transform selected content into clean markdown.',
    aliases: ['markdown', 'md'],
    category: 'Conversion',
    run: ({ latestContext }) => ({
      title: 'Markdown draft ready',
      summary: 'Converted the current content into a markdown-shaped draft.',
      detail: latestContext?.selectedText || 'Select text to convert it into markdown formatting.',
      tags: ['markdown', 'conversion']
    })
  },
  {
    id: 'convert-json',
    title: 'Convert to JSON',
    description: 'Normalize structured content into JSON output.',
    aliases: ['json', 'serialize'],
    category: 'Conversion',
    run: ({ latestContext }) => ({
      title: 'JSON draft ready',
      summary: 'Prepared a JSON-shaped output plan from the current context.',
      detail: latestContext?.currentTableSummary || 'Use table extraction or selected text as the source for JSON conversion.',
      tags: ['json', 'structured-data']
    })
  }
];

export function getCommands(): IntentCommand[] {
  return COMMANDS;
}

export function searchCommands(query: string): IntentCommand[] {
  const normalized = query.trim().toLowerCase();

  if (!normalized) {
    return COMMANDS;
  }

  return COMMANDS.filter((command) => {
    const searchable = [command.title, command.description, command.category, ...command.aliases].join(' ').toLowerCase();
    return searchable.includes(normalized);
  });
}

export function getCommandById(commandId: IntentCommandId): IntentCommand {
  const command = COMMANDS.find((entry) => entry.id === commandId);
  if (!command) {
    throw new Error(`Unknown command: ${commandId}`);
  }

  return command;
}
