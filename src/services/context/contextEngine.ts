import type { ContextEngineInput, ContextSnapshot } from './contextTypes';
import { buildContext } from './contextBuilder';

export class ContextEngine {
  async build(input: ContextEngineInput): Promise<ContextSnapshot> {
    return buildContext(input);
  }
}
