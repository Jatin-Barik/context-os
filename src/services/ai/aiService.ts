import type { LocalModelId } from '@/models/localModels';
import { useShellStore } from '@/store/shellStore';
import { buildPrompt } from './promptBuilder';
import { formatResponse } from './responseFormatter';
import { HeuristicLocalAIModel } from './localModel';
import type { AIExecutionCallbacks, AIExecutionResult, AIModelMetadata, AIRequest, AIResponseFollowUp, AIService } from './types';

export interface AIServiceOptions {
  readonly modelId?: LocalModelId;
}

let activeAbortController: AbortController | null = null;

function estimateTokens(text: string): number {
  return Math.max(1, Math.ceil(text.trim().split(/\s+/).filter(Boolean).length / 0.75));
}

function chunkText(text: string, chunkSize = 72): string[] {
  const chunks: string[] = [];
  for (let index = 0; index < text.length; index += chunkSize) {
    chunks.push(text.slice(index, index + chunkSize));
  }

  return chunks;
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms);
  });
}

function buildFollowUps(result: AIRequest): AIResponseFollowUp[] {
  const content = `${result.context.summary} ${result.context.currentImageSummary} ${result.context.currentErrorMessage} ${result.context.intent}`.toLowerCase();
  const hasError = result.context.contentType === 'editor' || /error|exception|stack trace|failed/i.test(content);
  const hasCode = result.context.contentType === 'editor' || /typescript|javascript|tsx|jsx|code|import|function|class/i.test(content);
  const hasBrowser = result.context.contentType === 'browser';

  if (hasError) {
    return [
      { title: 'Explain Error', detail: 'Inspect the stack trace and identify the likely failure point.', commandId: 'explain-error', tags: ['debugging', 'error'] },
      { title: 'Generate Tests', detail: 'Create regression checks for the current failure.', commandId: 'generate-tests', tags: ['tests', 'quality'] },
      { title: 'Summarize Screen', detail: 'Condense the current debugging context into a short brief.', commandId: 'summarize-screen', tags: ['summary'] }
    ];
  }

  if (hasCode) {
    return [
      { title: 'Rewrite', detail: 'Polish the selected code or text into a clearer version.', commandId: 'rewrite', tags: ['writing', 'code'] },
      { title: 'Generate Tests', detail: 'Create checks for the code or behavior on screen.', commandId: 'generate-tests', tags: ['tests', 'quality'] },
      { title: 'Generate Notes', detail: 'Capture the current code context in structured notes.', commandId: 'generate-notes', tags: ['notes'] }
    ];
  }

  if (hasBrowser) {
    return [
      { title: 'Summarize Article', detail: 'Summarize the current page or article.', commandId: 'summarize-article', tags: ['browser', 'summary'] },
      { title: 'Extract Key Points', detail: 'Pull the important points from the page.', commandId: 'extract-key-points', tags: ['browser', 'highlights'] },
      { title: 'Generate Flashcards', detail: 'Turn the current page into study flashcards.', commandId: 'generate-flashcards', tags: ['browser', 'study'] }
    ];
  }

  return [
    { title: 'Summarize Screen', detail: 'Create a concise summary of the current screen content.', commandId: 'summarize-screen', tags: ['summary'] },
    { title: 'Generate Notes', detail: 'Turn the screen into structured notes.', commandId: 'generate-notes', tags: ['notes'] },
    { title: 'Translate', detail: 'Translate visible text while preserving meaning and tone.', commandId: 'translate', tags: ['translate'] }
  ];
}

function createMetrics(model: AIModelMetadata, prompt: string, response: string, contextSize: number, inferenceTimeMs: number) {
  return {
    modelId: model.id,
    modelName: model.name,
    promptLength: prompt.length,
    responseLength: response.length,
    tokenCount: estimateTokens(response),
    inferenceTimeMs,
    contextSize,
    provider: model.provider
  };
}

function streamResponse(text: string, callbacks: AIExecutionCallbacks): Promise<void> {
  const chunks = chunkText(text);
  return chunks.reduce<Promise<void>>(async (previous, chunk, index) => {
    await previous;
    if (callbacks.signal?.aborted) {
      throw new Error('cancelled');
    }

    callbacks.onChunk?.({ text: chunk, isFinal: index === chunks.length - 1 });
    if (!callbacks.signal?.aborted && index < chunks.length - 1) {
      await sleep(18);
    }
  }, Promise.resolve());
}

export function createAIService(options: AIServiceOptions = {}): AIService {
  const shellStore = useShellStore.getState();
  const modelId = options.modelId ?? shellStore.currentModelId;
  const model = new HeuristicLocalAIModel(modelId);

  return {
    async explainScreen(request: AIRequest, callbacks: AIExecutionCallbacks = {}): Promise<AIExecutionResult> {
      activeAbortController?.abort();
      activeAbortController = new AbortController();

      const signal = callbacks.signal ?? activeAbortController.signal;
      const prompt = buildPrompt(request);
      callbacks.onStart?.(prompt);

      const startedAt = performance.now();
      await model.load();

      if (signal.aborted) {
        throw new Error('cancelled');
      }

      const rawResponse = await model.infer(prompt);
      const formattedResponse = formatResponse(rawResponse);
      const followUps = buildFollowUps(request);
      await streamResponse(formattedResponse, { ...callbacks, signal });

      const modelMetadata = await model.metadata();
      const metrics = createMetrics(modelMetadata, prompt, formattedResponse, JSON.stringify(request.context).length, Math.round(performance.now() - startedAt));
      const result: AIExecutionResult = {
        prompt,
        response: formattedResponse,
        formattedResponse,
        followUps,
        metrics,
        model: modelMetadata
      };

      callbacks.onComplete?.(result);
      return result;
    },
    cancelActiveRequest(): void {
      activeAbortController?.abort();
      activeAbortController = null;
    }
  };
}
