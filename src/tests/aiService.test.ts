import { describe, expect, it } from 'vitest';
import { createAIService } from '@/services/ai/aiService';
import { buildPrompt } from '@/services/ai/promptBuilder';
import { formatResponse } from '@/services/ai/responseFormatter';
import type { ContextSnapshot } from '@/store/shellStore';

const sampleContext: ContextSnapshot = {
  id: 'context-1',
  appName: 'VS Code',
  windowTitle: 'auth.ts - Visual Studio Code',
  selectedText: 'TypeError: Cannot read property',
  clipboardText: 'const value = 42;',
  currentUrl: 'https://example.com',
  currentFileName: 'auth.ts',
  currentLanguage: 'TypeScript',
  currentIntent: 'Debugging Code',
  currentErrorMessage: 'TypeError: Cannot read property of undefined',
  currentTableSummary: 'No table detected',
  currentImageSummary: 'Code editor with a stack trace and failing function.',
  capturedAt: '2026-07-20T00:00:00.000Z'
};

describe('AI workflow services', () => {
  it('builds a bounded prompt with the expected context fields', () => {
    const prompt = buildPrompt({
      context: sampleContext,
      commandTitle: 'Explain this screen',
      commandSummary: 'Capture the screen, extract OCR, build context, and generate a local explanation.'
    });

    expect(prompt).toContain('Application: VS Code');
    expect(prompt).toContain('Intent: Debugging Code');
    expect(prompt).toContain('Detected language: TypeScript');
    expect(prompt.length).toBeLessThan(1800);
  });

  it('formats markdown-like output for the response panel', () => {
    const formatted = formatResponse('```md\n- one\n- two\n```');

    expect(formatted).toContain('• one');
    expect(formatted).toContain('• two');
    expect(formatted).not.toContain('```');
  });

  it('streams a local response and returns follow-up actions', async () => {
    const aiService = createAIService({ modelId: 'phi-3-mini' });
    const chunks: string[] = [];

    const result = await aiService.explainScreen(
      {
        context: sampleContext,
        commandTitle: 'Explain this screen',
        commandSummary: 'Capture the screen, extract OCR, build context, and generate a local explanation.'
      },
      {
        onChunk: (chunk) => chunks.push(chunk.text)
      }
    );

    expect(result.formattedResponse).toContain('Screen Summary');
    expect(result.followUps.length).toBeGreaterThan(0);
    expect(result.metrics.modelId).toBe('phi-3-mini');
    expect(chunks.length).toBeGreaterThan(0);
  });
});
