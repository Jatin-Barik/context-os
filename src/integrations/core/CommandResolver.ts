import type { ApplicationCommand, ApplicationContext } from './ApplicationTypes';
import { searchCommands } from '../shared/commandHelpers';

export class CommandResolver {
  resolveCommands(context: ApplicationContext, query: string): ApplicationCommand[] {
    return searchCommands(context.supportedCommands, query);
  }

  resolveCommand(context: ApplicationContext, commandId: string): ApplicationCommand | null {
    return context.supportedCommands.find((command) => command.id === commandId) ?? null;
  }
}
