export type LocalModelId =
  | 'phi-3-mini'
  | 'gemma-3n'
  | 'qwen2.5-small'
  | 'florence-2'
  | 'moondream'
  | 'smolvlm'
  | 'bge-small'
  | 'nomic-embed-text';

export interface LocalModelRecord {
  readonly id: LocalModelId;
  readonly name: string;
  readonly modality: 'text' | 'vision' | 'embedding';
  readonly status: 'Ready' | 'Queued' | 'Available';
  readonly description: string;
}

export const LOCAL_MODELS: readonly LocalModelRecord[] = [
  {
    id: 'phi-3-mini',
    name: 'Phi-3 Mini',
    modality: 'text',
    status: 'Ready',
    description: 'Fast general-purpose text model for command responses and summaries.'
  },
  {
    id: 'gemma-3n',
    name: 'Gemma 3n',
    modality: 'text',
    status: 'Queued',
    description: 'Balanced local reasoning model for higher-quality generation.'
  },
  {
    id: 'qwen2.5-small',
    name: 'Qwen2.5 Small',
    modality: 'text',
    status: 'Available',
    description: 'Efficient multilingual model for structured assistance.'
  },
  {
    id: 'florence-2',
    name: 'Florence-2',
    modality: 'vision',
    status: 'Available',
    description: 'Local vision model for screenshot and image understanding.'
  },
  {
    id: 'moondream',
    name: 'Moondream',
    modality: 'vision',
    status: 'Queued',
    description: 'Compact visual grounding model for quick image descriptions.'
  },
  {
    id: 'smolvlm',
    name: 'SmolVLM',
    modality: 'vision',
    status: 'Queued',
    description: 'Small multimodal model for low-latency local vision tasks.'
  },
  {
    id: 'bge-small',
    name: 'bge-small',
    modality: 'embedding',
    status: 'Ready',
    description: 'Semantic embedding model for local memory and retrieval.'
  },
  {
    id: 'nomic-embed-text',
    name: 'nomic embed text',
    modality: 'embedding',
    status: 'Available',
    description: 'Alternate embedding backend for memory search and clustering.'
  }
] as const;

export function getLocalModel(modelId: LocalModelId): LocalModelRecord {
  const model = LOCAL_MODELS.find((entry) => entry.id === modelId);
  if (!model) {
    return LOCAL_MODELS[0];
  }

  return model;
}
