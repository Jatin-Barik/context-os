import type { ApplicationContext, ApplicationSuggestion } from './ApplicationTypes';

export class SuggestionEngine {
  getSuggestions(context: ApplicationContext): readonly ApplicationSuggestion[] {
    return context.suggestions;
  }
}
