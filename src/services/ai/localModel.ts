import { getLocalModel, type LocalModelId } from '@/models/localModels';
import { useModelManagerStore } from '@/store/modelManagerStore';
import type { AIModel, AIModelMetadata } from './types';

type ParsedPrompt = Record<string, string>;

function parsePrompt(prompt: string): ParsedPrompt {
  return prompt.split('\n').reduce<ParsedPrompt>((accumulator, line) => {
    const separatorIndex = line.indexOf(':');
    if (separatorIndex === -1) {
      return accumulator;
    }

    const key = line.slice(0, separatorIndex).trim().toLowerCase();
    const value = line.slice(separatorIndex + 1).trim();
    if (key && value) {
      accumulator[key] = value;
    }

    return accumulator;
  }, {});
}

function generateFollowUpLines(parsed: ParsedPrompt): string[] {
  const lines: string[] = [];
  const isCode = /typescript|javascript|tsx|jsx|code/i.test(parsed['ocr summary'] ?? '');
  const hasError = /error|exception|stack trace|failed/i.test(parsed['ocr summary'] ?? '');
  const hasText = Boolean((parsed['selected text'] ?? '').trim());

  lines.push(isCode ? 'The screen appears to contain code or a development surface.' : 'The screen is a general productivity or communication surface.');
  lines.push(parsed['window title'] ? `Active window: ${parsed['window title']}` : 'Active window: not detected.');
  lines.push(parsed['ocr summary'] ? `OCR summary: ${parsed['ocr summary']}` : 'OCR summary: no extracted text available.');

  if (hasError) {
    lines.push('Focus on the failure message and isolate the first actionable stack frame.');
  }

  if (hasText) {
    lines.push(`Selected text: ${parsed['selected text']}`);
  }

  return lines;
}

function buildFollowUps(parsed: ParsedPrompt): Array<{ title: string; detail: string; commandId: string; tags: string[] }> {
  const ocr = parsed['ocr summary'] ?? '';
  const isCode = /typescript|javascript|tsx|jsx|code/i.test(ocr);
  const hasError = /error|exception|stack trace|failed/i.test(ocr);
  const followUps = hasError
    ? [
        { title: 'Explain Error', detail: 'Interpret the stack trace or error text from the current screen.', commandId: 'explain-error', tags: ['debugging', 'error'] },
        { title: 'Generate Tests', detail: 'Create targeted regression tests for the current failure.', commandId: 'generate-tests', tags: ['tests', 'quality'] },
        { title: 'Summarize Screen', detail: 'Condense the current debugging context into a short brief.', commandId: 'summarize-screen', tags: ['summary'] }
      ]
    : isCode
      ? [
          { title: 'Rewrite', detail: 'Polish the selected code or text into a clearer version.', commandId: 'rewrite', tags: ['writing', 'code'] },
          { title: 'Generate Tests', detail: 'Create checks for the code or behavior currently on screen.', commandId: 'generate-tests', tags: ['tests'] },
          { title: 'Generate Notes', detail: 'Capture the current coding context in structured notes.', commandId: 'generate-notes', tags: ['notes'] }
        ]
      : [
          { title: 'Summarize Screen', detail: 'Create a concise summary of the current screen content.', commandId: 'summarize-screen', tags: ['summary'] },
          { title: 'Generate Notes', detail: 'Turn the screen into structured notes.', commandId: 'generate-notes', tags: ['notes'] },
          { title: 'Translate', detail: 'Translate visible text while preserving meaning and tone.', commandId: 'translate', tags: ['translate'] }
        ];

  return followUps;
}

function buildResponse(parsed: ParsedPrompt): string {
  const title = parsed['window title'] ?? 'the current screen';
  const appName = parsed['application'] ?? 'the active app';
  const ocr = parsed['ocr summary'] ?? 'No OCR text was detected.';
  const intent = parsed['intent'] ?? 'Unknown';
  const clipboard = parsed['clipboard'] ?? 'Not available';
  const selectedText = parsed['selected text'] ?? 'Not available';

  const sections = [
    '### Screen Summary',
    `You are in ${appName} with ${title}.`,
    '',
    '### What I found',
    `- OCR: ${ocr}`,
    `- Intent signal: ${intent}`,
    `- Clipboard: ${clipboard}`,
    `- Selected text: ${selectedText}`,
    '',
    '### Recommended next steps',
    ...generateFollowUpLines(parsed).map((line) => `- ${line}`)
  ];

  return sections.join('\n');
}

export class HeuristicLocalAIModel implements AIModel {
  private readonly modelId: LocalModelId;
  private loaded = false;

  constructor(modelId: LocalModelId) {
    this.modelId = modelId;
  }

  async load(): Promise<void> {
    this.loaded = true;
  }

  async infer(prompt: string): Promise<string> {
    if (!this.loaded) {
      await this.load();
    }

    const parsed = parsePrompt(prompt);
    return buildResponse(parsed);
  }

  async dispose(): Promise<void> {
    this.loaded = false;
  }

  async metadata(): Promise<AIModelMetadata> {
    const model = getLocalModel(this.modelId);
    const modelState = useModelManagerStore.getState().models[this.modelId];
    return {
      id: model.id,
      name: model.name,
      modality: model.modality,
      provider: 'local-heuristic',
      status: modelState?.installed ? 'Ready' : 'Unavailable',
      sizeMb: model.sizeMb,
      ramUsageMb: model.ramUsageMb,
      downloadProgress: modelState?.downloadProgress ?? 0,
      errors: modelState?.installed ? [] : ['Model is not installed locally.']
    };
  }

  supportsVision(): boolean {
    return false;
  }

  supportsStreaming(): boolean {
    return true;
  }
}
