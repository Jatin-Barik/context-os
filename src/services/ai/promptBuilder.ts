import type { AIRequest } from './types';

const MAX_PROMPT_LENGTH = 1800;

function compact(value: string, limit: number): string {
  const normalized = String(value).replace(/\s+/g, ' ').trim();
  if (normalized.length <= limit) {
    return normalized;
  }

  return `${normalized.slice(0, Math.max(0, limit - 1)).trimEnd()}…`;
}

function getWindowTitle(context: AIRequest['context']): string {
  const legacyContext = context as unknown as { windowTitle?: string; appName?: string; metadata?: { windowTitle?: string } };
  return legacyContext.metadata?.windowTitle ?? legacyContext.windowTitle ?? legacyContext.appName ?? context.applicationName;
}

function getLegacyContext(context: AIRequest['context']): {
  appName?: string;
  currentLanguage?: string;
  currentIntent?: string;
  currentFileName?: string;
} {
  return context as unknown as {
    appName?: string;
    currentLanguage?: string;
    currentIntent?: string;
    currentFileName?: string;
  };
}

function getApplicationName(context: AIRequest['context']): string {
  const legacyContext = getLegacyContext(context);
  return context.applicationName || legacyContext.appName || 'Unknown application';
}

function getAdapterName(context: AIRequest['context']): string {
  const legacyContext = getLegacyContext(context);
  return context.adapterName || legacyContext.appName || 'Unknown adapter';
}

function getLanguage(context: AIRequest['context']): string {
  const legacyContext = getLegacyContext(context);
  return context.language || legacyContext.currentLanguage || 'unknown';
}

function getIntent(context: AIRequest['context']): string {
  const legacyContext = getLegacyContext(context);
  return context.intent || legacyContext.currentIntent || 'unknown';
}

function getContentType(context: AIRequest['context']): string {
  const legacyContext = getLegacyContext(context);
  if (context.contentType) {
    return context.contentType;
  }

  if (legacyContext.currentFileName?.match(/\.(ts|tsx|js|jsx|json|md|css|scss|html)$/i)) {
    return 'editor';
  }

  return 'general';
}

export function buildPrompt(request: AIRequest): string {
  const { context, commandTitle, commandSummary } = request;
  const lines = [
    'You are ContextOS running fully on device. Respond clearly and concisely.',
    `User command: ${commandTitle}`,
    `Command summary: ${commandSummary}`,
    `Application: ${getApplicationName(context)}`,
    `Adapter: ${getAdapterName(context)}`,
    `Content type: ${getContentType(context)}`,
    `Window title: ${getWindowTitle(context)}`,
    `Detected language: ${compact(getLanguage(context), 80)}`,
    `Intent: ${compact(getIntent(context), 120)}`,
    `Context summary: ${compact(context.summary || 'No summary available.', 420)}`,
    `Clipboard: ${compact(context.clipboardText || 'Not available.', 300)}`,
    `Selected text: ${compact(context.selectedText || 'Not available.', 300)}`,
    `Current URL: ${compact(context.currentUrl || 'Not available.', 250)}`,
    `Detected file or process: ${compact(context.currentFileName || context.metadata.processName || 'unknown', 160)}`,
    `Error output: ${compact(context.currentErrorMessage || 'Not available.', 240)}`,
    `Table summary: ${compact(context.currentTableSummary || 'Not available.', 240)}`,
    `Visible content: ${compact(context.currentImageSummary || 'Not available.', 260)}`,
    `Captured at: ${context.capturedAt}`
  ];

  return lines.join('\n').slice(0, MAX_PROMPT_LENGTH);
}
