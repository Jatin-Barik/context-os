import type { ApplicationCommand, ApplicationCommandResult, ApplicationSuggestion } from '../core/ApplicationTypes';

export function createCommandResult(title: string, summary: string, detail: string, tags: readonly string[]): ApplicationCommandResult {
  return { title, summary, detail, tags };
}

export function createSuggestion(title: string, detail: string, commandId: string, tags: readonly string[]): ApplicationSuggestion {
  return { title, detail, commandId, tags };
}

function scoreCommand(command: ApplicationCommand, query: string): number {
  const haystack = [command.title, command.description, command.category, ...command.aliases].join(' ').toLowerCase();

  if (haystack.includes(query)) {
    return 20;
  }

  const queryTerms = query.split(/\s+/).filter(Boolean);
  return queryTerms.reduce((score, term) => {
    if (haystack.includes(term)) {
      return score + 4;
    }

    return score + (haystack.includes(term.slice(0, 2)) ? 2 : 0);
  }, 0);
}

export function searchCommands(commands: readonly ApplicationCommand[], query: string): ApplicationCommand[] {
  const normalized = query.trim().toLowerCase();

  if (!normalized) {
    return [...commands];
  }

  const terms = normalized.split(/\s+/).filter(Boolean);
  return commands.filter((command) => {
    const haystack = [command.title, command.description, command.category, ...command.aliases].join(' ').toLowerCase();
    return terms.every((term) => haystack.includes(term)) || terms.every((term) => haystack.includes(term.slice(0, 2)) || haystack.includes(term));
  }).sort((left, right) => scoreCommand(right, normalized) - scoreCommand(left, normalized));
}
