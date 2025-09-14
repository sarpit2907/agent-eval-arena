import { EvaluationResponse, NormalizedResponse } from '@/types';

export function normalizeResponse(response: EvaluationResponse): NormalizedResponse {
  return {
    input: response.prompt || response.query || '',
    actual_output: response.response || response.output || '',
    expected_output: response.reference || response.gold || '',
    context: Array.isArray(response.context) 
      ? response.context.join(' ') 
      : response.context || '',
    agent: response.agent || response.agent_name || '',
    domain: response.domain,
  };
}

export function parseJsonFile(fileContent: string): EvaluationResponse[] {
  try {
    // Try parsing as JSON array
    const parsed = JSON.parse(fileContent);
    return Array.isArray(parsed) ? parsed : [parsed];
  } catch {
    // Try parsing as JSONL
    return fileContent
      .split('\n')
      .filter(line => line.trim())
      .map(line => JSON.parse(line));
  }
}

export function getUniqueValues<T>(array: T[], key: keyof T): T[keyof T][] {
  const values = array.map(item => item[key]).filter(Boolean);
  return [...new Set(values)];
}

export function formatScore(score: number): string {
  return (score * 100).toFixed(1) + '%';
}

export function formatDuration(seconds: number): string {
  if (seconds < 60) return `${seconds.toFixed(1)}s`;
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}m ${remainingSeconds.toFixed(1)}s`;
}