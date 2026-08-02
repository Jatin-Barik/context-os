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
  readonly version: string;
  readonly sizeMb: number;
  readonly ramUsageMb: number;
  readonly locked?: boolean;
  readonly defaultInstalledVersion?: string;
}

export const LOCAL_MODELS: readonly LocalModelRecord[] = [
  {
    id: 'phi-3-mini',
    name: 'Phi-3 Mini',
    modality: 'text',
    status: 'Ready',
    description: 'Fast general-purpose text model for command responses and summaries.',
    version: '3.0.0',
    sizeMb: 820,
    ramUsageMb: 420,
    locked: true
  },
  {
    id: 'gemma-3n',
    name: 'Gemma 3n',
    modality: 'text',
    status: 'Queued',
    description: 'Balanced local reasoning model for higher-quality generation.',
    version: '2.0.0',
    sizeMb: 960,
    ramUsageMb: 540,
    defaultInstalledVersion: '1.9.0'
  },
  {
    id: 'qwen2.5-small',
    name: 'Qwen2.5 Small',
    modality: 'text',
    status: 'Available',
    description: 'Efficient multilingual model for structured assistance.',
    version: '2.5.0',
    sizeMb: 760,
    ramUsageMb: 380
  },
  {
    id: 'florence-2',
    name: 'Florence-2',
    modality: 'vision',
    status: 'Available',
    description: 'Local vision model for screenshot and image understanding.',
    version: '2.0.0',
    sizeMb: 1200,
    ramUsageMb: 780
  },
  {
    id: 'moondream',
    name: 'Moondream',
    modality: 'vision',
    status: 'Queued',
    description: 'Compact visual grounding model for quick image descriptions.',
    version: '1.5.0',
    sizeMb: 650,
    ramUsageMb: 360
  },
  {
    id: 'smolvlm',
    name: 'SmolVLM',
    modality: 'vision',
    status: 'Queued',
    description: 'Small multimodal model for low-latency local vision tasks.',
    version: '1.0.0',
    sizeMb: 700,
    ramUsageMb: 390
  },
  {
    id: 'bge-small',
    name: 'bge-small',
    modality: 'embedding',
    status: 'Ready',
    description: 'Semantic embedding model for local memory and retrieval.',
    version: '1.0.0',
    sizeMb: 260,
    ramUsageMb: 180,
    defaultInstalledVersion: '0.9.0'
  },
  {
    id: 'nomic-embed-text',
    name: 'nomic embed text',
    modality: 'embedding',
    status: 'Available',
    description: 'Alternate embedding backend for memory search and clustering.',
    version: '1.0.0',
    sizeMb: 220,
    ramUsageMb: 160
  }
] as const;

export function getLocalModel(modelId: LocalModelId): LocalModelRecord {
  const model = LOCAL_MODELS.find((entry) => entry.id === modelId);
  if (!model) {
    return LOCAL_MODELS[0];
  }

  return model;
}
