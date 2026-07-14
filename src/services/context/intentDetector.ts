export interface IntentHint {
  intent: string;
  confidence: number;
  reason: string;
}

export interface IntentDetectorInput {
  ocr?: {
    containsError?: boolean;
    containsCode?: boolean;
    containsTable?: boolean;
    containsTerminal?: boolean;
    containsSpreadsheet?: boolean;
    containsEmail?: boolean;
    containsForm?: boolean;
    wordCount?: number;
  };
  clipboard?: {
    kind?: string;
  };
}

export function inferIntent(text: string, input: IntentDetectorInput = {}): IntentHint {
  const normalized = text.toLowerCase();

  if (input.ocr?.containsError || normalized.includes('error') || normalized.includes('typeerror')) {
    return {
      intent: 'Debugging Code',
      confidence: 0.91,
      reason: 'Error-like content detected.'
    };
  }

  if (input.ocr?.containsCode || normalized.includes('function') || normalized.includes('import')) {
    return {
      intent: 'Reading Documentation',
      confidence: 0.74,
      reason: 'Code-oriented content detected.'
    };
  }

  if (input.ocr?.containsSpreadsheet || input.ocr?.containsTable || normalized.includes('row')) {
    return {
      intent: 'Viewing Spreadsheet',
      confidence: 0.83,
      reason: 'Tabular content detected.'
    };
  }

  if (input.ocr?.containsEmail || normalized.includes('hello') || normalized.includes('regards')) {
    return {
      intent: 'Writing Email',
      confidence: 0.78,
      reason: 'Email-like patterns detected.'
    };
  }

  if (input.ocr?.containsTerminal || normalized.includes('npm') || normalized.includes('bash')) {
    return {
      intent: 'Terminal Work',
      confidence: 0.81,
      reason: 'Terminal-related content detected.'
    };
  }

  return {
    intent: 'Reading Research',
    confidence: 0.62,
    reason: 'General desktop context detected.'
  };
}
