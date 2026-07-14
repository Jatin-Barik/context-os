export interface WindowApplication {
  name: string;
  confidence: number;
  category: 'editor' | 'browser' | 'communications' | 'productivity' | 'terminal' | 'media' | 'unknown';
  processName?: string;
}

export interface ClipboardSnapshot {
  kind: 'text' | 'image' | 'url' | 'file' | 'unknown';
  text: string;
  length: number;
  languageGuess: string;
}

export interface SelectedTextSnapshot {
  selection: string;
  length: number;
  languageGuess: string;
  available: boolean;
}

export interface BrowserContext {
  available: boolean;
  url?: string;
  domain?: string;
  title?: string;
}

export interface ScreenUnderstanding {
  wordCount: number;
  paragraphCount: number;
  language: string;
  containsTable: boolean;
  containsCode: boolean;
  containsForm: boolean;
  containsChart: boolean;
  containsError: boolean;
  containsEmail: boolean;
  containsTerminal: boolean;
  containsSpreadsheet: boolean;
}

export interface IntentSignal {
  intent: string;
  confidence: number;
  reason: string;
}

export interface ContextScore {
  ocrConfidence: number;
  windowConfidence: number;
  intentConfidence: number;
  completeness: number;
}

export interface ContextSnapshot {
  application: WindowApplication;
  windowTitle: string;
  windowProcess: string;
  timestamp: string;
  display: {
    name: string;
    resolution: string;
  };
  resolution: string;
  clipboard: ClipboardSnapshot;
  ocr: ScreenUnderstanding;
  selectedText: SelectedTextSnapshot;
  browser: BrowserContext;
  metadata: Record<string, unknown>;
  intent?: IntentSignal;
  summary?: string;
  score?: ContextScore;
}

export interface ContextEngineInput {
  windowTitle?: string;
  windowProcess?: string;
  ocrText?: string;
  ocrResult?: {
    text?: string;
    blocks?: Array<{ text?: string }>;
    language?: string;
    confidence?: number;
  };
  clipboardText?: string;
  selectedText?: string;
  browserContext?: BrowserContext;
  displayName?: string;
  resolution?: string;
  timestamp?: string;
  metadata?: Record<string, unknown>;
}
