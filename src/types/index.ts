export interface EvaluationResponse {
  agent?: string;
  agent_name?: string;
  prompt?: string;
  query?: string;
  response?: string;
  output?: string;
  reference?: string;
  gold?: string;
  context?: string | string[];
  domain?: string;
}

export interface NormalizedResponse {
  input: string;
  actual_output: string;
  expected_output: string;
  context: string;
  agent: string;
  domain?: string;
}

export interface EvaluationSummary {
  total_agents: number;
  successful_evaluations: number;
  failed_evaluations: number;
  average_score: number;
  total_test_cases: number;
  top_performer?: string;
}

export interface AgentResult {
  agent_id: string;
  agent_name: string;
  overall_score: number;
  passed: boolean;
  evaluation_time: number;
  test_cases_processed: number;
  errors_count: number;
  scores: {
    "Instruction Following": number;
    "Hallucination Detection": number;
    "Assumption Control": number;
    "Coherence & Accuracy": number;
  };
  reasoning: Record<string, string[]>;
}

export interface EvaluationResult {
  evaluation_summary: EvaluationSummary;
  agent_results: AgentResult[];
}

export type EvaluationMode = "offline" | "llm";

export type Category = "QnA" | "Reasoning" | "Summarizing";

export interface Agent {
  id: string;
  name: string;
  category: Category;
}

export interface Settings {
  baseUrl: string;
  mode: EvaluationMode;
}