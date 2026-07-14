export interface WindowDetectionResult {
  name: string;
  confidence: number;
  category: 'editor' | 'browser' | 'communications' | 'productivity' | 'terminal' | 'media' | 'unknown';
  processName?: string;
}

const APP_PATTERNS: Array<{ pattern: RegExp; name: string; category: 'editor' | 'browser' | 'communications' | 'productivity' | 'terminal' | 'media' | 'unknown'; }> = [
  { pattern: /visual studio code|code -|vscode/i, name: 'VS Code', category: 'editor' },
  { pattern: /chrome|brave|edge|arc/i, name: 'Chrome', category: 'browser' },
  { pattern: /slack/i, name: 'Slack', category: 'communications' },
  { pattern: /excel|spreadsheet/i, name: 'Excel', category: 'productivity' },
  { pattern: /powerpoint|presentation/i, name: 'PowerPoint', category: 'productivity' },
  { pattern: /terminal|powershell|cmd|ubuntu/i, name: 'Terminal', category: 'terminal' },
  { pattern: /notepad/i, name: 'Notepad', category: 'productivity' },
  { pattern: /discord/i, name: 'Discord', category: 'communications' },
  { pattern: /spotify/i, name: 'Spotify', category: 'media' }
];

export function detectApplication(windowTitle: string = '', metadata: Record<string, unknown> = {}): WindowDetectionResult {
  const normalized = windowTitle.toLowerCase();
  const match = APP_PATTERNS.find((entry) => entry.pattern.test(normalized));

  if (match) {
    return {
      name: match.name,
      confidence: 0.9,
      category: match.category
    };
  }

  const userAgent = `${metadata.userAgent ?? ''}`.toLowerCase();
  if (userAgent.includes('chrome')) {
    return { name: 'Chrome', confidence: 0.72, category: 'browser' };
  }

  if (userAgent.includes('edg')) {
    return { name: 'Edge', confidence: 0.72, category: 'browser' };
  }

  if (typeof metadata.captureSource === 'string') {
    const captureSource = metadata.captureSource.toString().toLowerCase();
    if (captureSource.includes('chrome')) {
      return { name: 'Chrome', confidence: 0.68, category: 'browser' };
    }
    if (captureSource.includes('code')) {
      return { name: 'VS Code', confidence: 0.74, category: 'editor' };
    }
    if (captureSource.includes('slack')) {
      return { name: 'Slack', confidence: 0.7, category: 'communications' };
    }
  }

  if (typeof metadata.platform === 'string' && metadata.platform.toString().includes('win')) {
    return { name: 'Windows App', confidence: 0.45, category: 'unknown' };
  }

  if (typeof metadata.platform === 'string' && metadata.platform.toString().includes('darwin')) {
    return { name: 'macOS App', confidence: 0.42, category: 'unknown' };
  }

  return { name: 'Unknown', confidence: 0.2, category: 'unknown' };
}
