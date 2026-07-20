import type { ApplicationContext } from './ApplicationContext';
import type { ApplicationCommand, ApplicationContextInput, ApplicationIconKey, ApplicationMetadata, ApplicationSuggestion } from './ApplicationTypes';

export interface ApplicationAdapter {
  initialize(input: ApplicationContextInput, metadata: ApplicationMetadata): Promise<void>;
  isSupported(metadata: ApplicationMetadata): boolean;
  isActive(metadata: ApplicationMetadata): boolean;
  extractContext(input: ApplicationContextInput, metadata: ApplicationMetadata): Promise<ApplicationContext>;
  getSupportedCommands(context: ApplicationContext): readonly ApplicationCommand[];
  getSuggestions(context: ApplicationContext): readonly ApplicationSuggestion[];
  getIcon(): ApplicationIconKey;
  getDisplayName(): string;
  dispose(): Promise<void>;
}
