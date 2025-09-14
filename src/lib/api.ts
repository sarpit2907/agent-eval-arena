import { EvaluationResult, EvaluationMode, NormalizedResponse } from '@/types';

export class ApiClient {
  constructor(private baseUrl: string) {}

  async evaluate(mode: EvaluationMode, responses: NormalizedResponse[]): Promise<EvaluationResult> {
    const response = await fetch(`${this.baseUrl}/evaluate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        mode,
        responses,
      }),
    });

    if (!response.ok) {
      throw new Error(`Evaluation failed: ${response.statusText}`);
    }

    return response.json();
  }

  getLeaderboardUrl(): string {
    return `${this.baseUrl}/leaderboard`;
  }

  getAgentUrl(agentId: string): string {
    return `${this.baseUrl}/agent/${agentId}`;
  }
}

export const createApiClient = (baseUrl: string) => new ApiClient(baseUrl);