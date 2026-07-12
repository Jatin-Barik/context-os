import { describe, expect, it } from 'vitest';
import { getCommands, searchCommands } from '@/features/palette/commandRegistry';

describe('commandRegistry', () => {
  it('exposes the expected command set', () => {
    const commands = getCommands();
    expect(commands).toHaveLength(14);
    expect(commands[0]?.title).toBe('Explain this');
  });

  it('finds commands by query text', () => {
    const results = searchCommands('stack trace');
    expect(results.map((command) => command.id)).toContain('fix-error');
  });
});
