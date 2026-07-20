export function formatResponse(rawResponse: string): string {
  const cleaned = rawResponse
    .replace(/```[\w-]*\n?/g, '')
    .replace(/```/g, '')
    .replace(/\r\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();

  return cleaned
    .split('\n')
    .map((line) => line.trimEnd())
    .map((line) => line.replace(/^[-*]\s+/, '• '))
    .join('\n');
}
