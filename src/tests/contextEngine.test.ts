import { describe, expect, it } from 'vitest';
import { classifyClipboard } from '@/services/context/clipboardService';
import { buildContextSummary } from '@/services/context/contextBuilder';
import { inferIntent } from '@/services/context/intentDetector';
import { detectApplication } from '@/services/context/windowService';

describe('context engine heuristics', () => {
  it('detects known desktop applications from window metadata', () => {
    expect(detectApplication('auth.ts - Visual Studio Code')).toMatchObject({
      name: 'VS Code',
      confidence: expect.any(Number)
    });
  });

  it('classifies clipboard content by type', () => {
    expect(classifyClipboard('https://example.com/docs')).toMatchObject({
      kind: 'url',
      text: 'https://example.com/docs'
    });
  });

  it('infers debugging intent from error-like content', () => {
    const intent = inferIntent('TypeError: Cannot read property of undefined', {
      ocr: { containsError: true, containsCode: true, wordCount: 9 }
    });

    expect(intent.intent).toBe('Debugging Code');
    expect(intent.confidence).toBeGreaterThan(0.6);
  });

  it('builds a deterministic human-readable summary', () => {
    const summary = buildContextSummary({
      application: { name: 'VS Code', confidence: 0.92 },
      windowTitle: 'auth.ts - Visual Studio Code',
      clipboard: { kind: 'url', text: 'https://example.com/docs' },
      ocr: { containsCode: true, containsError: true, wordCount: 14, paragraphCount: 2, language: 'en' },
      intent: { intent: 'Debugging Code', confidence: 0.88, reason: 'Error-like content detected.' }
    } as never);

    expect(summary).toContain('VS Code');
    expect(summary).toContain('stack trace');
  });
});
