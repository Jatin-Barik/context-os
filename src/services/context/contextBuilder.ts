import type { ContextScore, ContextSnapshot, ContextEngineInput, IntentSignal, ScreenUnderstanding, WindowApplication, ClipboardSnapshot, SelectedTextSnapshot, BrowserContext } from './contextTypes';
import { classifyClipboard } from './clipboardService';
import { inferIntent } from './intentDetector';
import { detectApplication } from './windowService';

function createScreenUnderstanding(input: ContextEngineInput): ScreenUnderstanding {
  const text = input.ocrText ?? input.ocrResult?.text ?? '';
  const normalized = text.toLowerCase();
  const wordCount = text.split(/\s+/).filter(Boolean).length;
  const paragraphCount = text.split(/\n\n+/).filter(Boolean).length || 1;

  return {
    wordCount,
    paragraphCount,
    language: input.ocrResult?.language ?? 'en',
    containsTable: normalized.includes('table') || normalized.includes('|') || normalized.includes('row'),
    containsCode: /\b(function|import|const|class|return|typescript|tsx|js|ts)\b/i.test(normalized),
    containsForm: normalized.includes('form') || normalized.includes('name') && normalized.includes('email'),
    containsChart: normalized.includes('chart') || normalized.includes('graph'),
    containsError: /error|exception|stack trace|typeerror|failed/i.test(normalized),
    containsEmail: /@/.test(normalized) || normalized.includes('regards') || normalized.includes('hello'),
    containsTerminal: /npm|yarn|bash|terminal|powershell|cmd/i.test(normalized),
    containsSpreadsheet: /sheet|spreadsheet|row|column/i.test(normalized)
  };
}

function createClipboard(input: ContextEngineInput): ClipboardSnapshot {
  const value = input.clipboardText ?? '';
  return classifyClipboard(value);
}

function createSelection(input: ContextEngineInput): SelectedTextSnapshot {
  const selection = input.selectedText ?? '';
  return {
    selection,
    length: selection.length,
    languageGuess: selection.length > 0 ? 'en' : 'unknown',
    available: selection.length > 0
  };
}

function createBrowser(input: ContextEngineInput): BrowserContext {
  const browserContext = input.browserContext;
  if (!browserContext?.available) {
    return { available: false };
  }

  return browserContext;
}

function deriveIntent(input: ContextEngineInput, ocr: ScreenUnderstanding): IntentSignal {
  return inferIntent(input.ocrText ?? input.ocrResult?.text ?? '', {
    ocr: {
      containsError: ocr.containsError,
      containsCode: ocr.containsCode,
      containsTable: ocr.containsTable,
      containsTerminal: ocr.containsTerminal,
      containsSpreadsheet: ocr.containsSpreadsheet,
      containsEmail: ocr.containsEmail,
      containsForm: ocr.containsForm
    },
    clipboard: { kind: createClipboard(input).kind }
  });
}

function createScore(ocr: ScreenUnderstanding, application: WindowApplication, intent: IntentSignal): ContextScore {
  const completeness = Math.min(100, Math.round((
    Number(Boolean(ocr.wordCount > 0)) * 20 +
    Number(Boolean(application.name)) * 20 +
    Number(Boolean(intent.intent)) * 20 +
    Number(Boolean(ocr.containsCode || ocr.containsError || ocr.containsTable)) * 20 +
    Number(Boolean(ocr.containsTerminal || ocr.containsSpreadsheet || ocr.containsEmail)) * 20
  )));

  return {
    ocrConfidence: Math.min(1, 0.6 + (ocr.wordCount > 0 ? 0.2 : 0) + (ocr.containsError ? 0.1 : 0)),
    windowConfidence: application.confidence,
    intentConfidence: intent.confidence,
    completeness
  };
}

export function buildContextSummary(context: Partial<ContextSnapshot>): string {
  const application = context.application?.name ?? 'Unknown app';
  const title = context.windowTitle ?? 'the current window';
  const clipboard = context.clipboard?.kind === 'url' ? 'Clipboard contains a URL.' : context.clipboard?.kind === 'text' ? 'Clipboard contains text.' : 'Clipboard is empty.';
  const stackTrace = context.ocr?.containsError ? 'The screen contains a stack trace.' : 'The screen appears to be informational.';
  const language = context.ocr?.containsCode ? 'Detected programming language: likely TypeScript or JavaScript.' : 'No strong code signal detected.';

  return `You are working in ${application} with ${title}. ${stackTrace} ${clipboard} ${language}`;
}

export function buildContext(input: ContextEngineInput): ContextSnapshot {
  const ocr = createScreenUnderstanding(input);
  const application = detectApplication(input.windowTitle ?? '', input.metadata ?? {});
  const clipboard = createClipboard(input);
  const selection = createSelection(input);
  const browser = createBrowser(input);
  const intent = deriveIntent(input, ocr);
  const score = createScore(ocr, application, intent);

  return {
    application,
    windowTitle: input.windowTitle ?? 'Unknown window',
    windowProcess: input.windowProcess ?? 'unknown',
    timestamp: input.timestamp ?? new Date().toISOString(),
    display: {
      name: input.displayName ?? 'Primary Display',
      resolution: input.resolution ?? 'Unknown'
    },
    resolution: input.resolution ?? 'Unknown',
    clipboard,
    ocr,
    selectedText: selection,
    browser,
    metadata: input.metadata ?? {},
    intent,
    summary: buildContextSummary({
      application,
      windowTitle: input.windowTitle ?? 'Unknown window',
      clipboard,
      ocr,
      intent
    }),
    score
  };
}
