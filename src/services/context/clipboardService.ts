export interface ClipboardClassification {
  kind: 'text' | 'image' | 'url' | 'file' | 'unknown';
  text: string;
  length: number;
  languageGuess: string;
}

export function classifyClipboard(value: string): ClipboardClassification {
  const trimmed = value.trim();
  if (!trimmed) {
    return { kind: 'unknown', text: '', length: 0, languageGuess: 'unknown' };
  }

  if (/^https?:\/\//i.test(trimmed) || /^www\./i.test(trimmed)) {
    return { kind: 'url', text: trimmed, length: trimmed.length, languageGuess: 'en' };
  }

  if (/^[A-Za-z]:\\/.test(trimmed) || /^\\\\/.test(trimmed)) {
    return { kind: 'file', text: trimmed, length: trimmed.length, languageGuess: 'en' };
  }

  if (trimmed.length > 0 && trimmed.length < 250) {
    return { kind: 'text', text: trimmed, length: trimmed.length, languageGuess: 'en' };
  }

  return { kind: 'text', text: trimmed, length: trimmed.length, languageGuess: 'en' };
}
