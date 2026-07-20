import type { LocalModelId } from '@/models/localModels';
import type { ApplicationContext } from '@/integrations/core/ApplicationContext';

export interface AIModelMetadata {
  readonly id: LocalModelId;
  readonly name: string;
  readonly modality: 'text' | 'vision' | 'embedding';
  readonly provider: 'local-heuristic';
  readonly status: 'Ready' | 'Unavailable' | 'Loading';
  readonly sizeMb: number;
  readonly ramUsageMb: number;
  readonly downloadProgress: number;
  readonly errors: readonly string[];
}

export interface AIModel {
  load(): Promise<void>;
  infer(prompt: string): Promise<string>;
  dispose(): Promise<void>;
  metadata(): Promise<AIModelMetadata>;
  supportsVision(): boolean;
  supportsStreaming(): boolean;
}

export interface AIRequest {
  readonly context: ApplicationContext;
  readonly commandTitle: string;
  readonly commandSummary: string;
}

export interface AIStreamChunk {
  readonly text: string;
  readonly isFinal: boolean;
}

export interface AIResponseFollowUp {
  readonly title: string;
  readonly detail: string;
  readonly commandId?: string;
  readonly tags: readonly string[];
}

export interface AIExecutionMetrics {
  readonly modelId: LocalModelId;
  readonly modelName: string;
  readonly promptLength: number;
  readonly responseLength: number;
  readonly tokenCount: number;
  readonly inferenceTimeMs: number;
  readonly contextSize: number;
  readonly provider: string;
}

export interface AIExecutionResult {
  readonly prompt: string;
  readonly response: string;
  readonly formattedResponse: string;
  readonly followUps: readonly AIResponseFollowUp[];
  readonly metrics: AIExecutionMetrics;
  readonly model: AIModelMetadata;
}

export interface AIExecutionCallbacks {
  readonly onStart?: (prompt: string) => void;
  readonly onChunk?: (chunk: AIStreamChunk) => void;
  readonly onComplete?: (result: AIExecutionResult) => void;
  readonly onError?: (message: string) => void;
  readonly signal?: AbortSignal;
}

export interface AIService {
  explainScreen(request: AIRequest, callbacks?: AIExecutionCallbacks): Promise<AIExecutionResult>;
  cancelActiveRequest(): void;
}
