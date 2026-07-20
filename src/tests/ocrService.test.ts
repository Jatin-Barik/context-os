import { describe, expect, it } from 'vitest';
import { recognizeText } from '../../electron/main/services/ocrService';

describe('ocr service', () => {
  it('returns structured OCR output from the bundled stub fallback', async () => {
    const result = await recognizeText('stub:contextos-capture');

    expect(result.source).toBe('stub');
    expect(result.text).toContain('ContextOS capture preview');
    expect(result.blocks.length).toBeGreaterThan(0);
    expect(result.paragraphs.length).toBeGreaterThan(0);
    expect(result.tables).toEqual([]);
    expect(result.layout.orientation).toBe('square');
  });
});
