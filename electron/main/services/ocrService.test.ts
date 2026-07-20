import { describe, expect, it } from 'vitest';
import { recognizeText } from './ocrService';

describe('ocrService', () => {
  it('returns structured OCR data for the bundled stub image payload', async () => {
    const result = await recognizeText('stub:contextos-capture');

    expect(result.text).toContain('ContextOS capture preview');
    expect(result.blocks.length).toBeGreaterThan(0);
    expect(result.paragraphs.length).toBeGreaterThan(0);
    expect(result.layout.orientation).toBe('square');
    expect(result.source).toBe('stub');
  });
});
