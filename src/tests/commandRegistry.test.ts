import { describe, expect, it } from 'vitest';
import { getCommands, searchCommands } from '@/features/palette/commandRegistry';

describe('commandRegistry', () => {
  it('exposes the expected command set', () => {
    const commands = getCommands();
    expect(commands.length).toBeGreaterThan(10);
    expect(commands[0]?.title).toBe('Explain Screen');
  });

  it('finds commands by fuzzy query text', () => {
    const results = searchCommands('exp scr');
    expect(results.map((command) => command.id)).toContain('explain-screen');
  });
});
