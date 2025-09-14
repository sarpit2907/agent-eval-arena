import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { EvaluationResult, Settings, Category, Agent } from '@/types';

interface EvaluationStore {
  // Evaluation data
  evaluationResult: EvaluationResult | null;
  isLoading: boolean;
  error: string | null;
  
  // Settings (persisted)
  settings: Settings;
  
  // UI state
  selectedCategory: Category | null;
  selectedAgents: string[];
  
  // Mock agents data
  agents: Agent[];
  
  // Actions
  setEvaluationResult: (result: EvaluationResult) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  updateSettings: (settings: Partial<Settings>) => void;
  setSelectedCategory: (category: Category | null) => void;
  setSelectedAgents: (agents: string[]) => void;
  clearEvaluation: () => void;
}

// Mock agents data
const mockAgents: Agent[] = [
  { id: "qna-gpt4", name: "GPT-4 QnA", category: "QnA" },
  { id: "qna-claude", name: "Claude QnA", category: "QnA" },
  { id: "qna-gemini", name: "Gemini QnA", category: "QnA" },
  { id: "reasoning-gpt4", name: "GPT-4 Reasoning", category: "Reasoning" },
  { id: "reasoning-claude", name: "Claude Reasoning", category: "Reasoning" },
  { id: "reasoning-llama", name: "Llama Reasoning", category: "Reasoning" },
  { id: "summary-gpt4", name: "GPT-4 Summary", category: "Summarizing" },
  { id: "summary-claude", name: "Claude Summary", category: "Summarizing" },
  { id: "summary-t5", name: "T5 Summary", category: "Summarizing" },
];

export const useEvaluationStore = create<EvaluationStore>()(
  persist(
    (set, get) => ({
      // Initial state
      evaluationResult: null,
      isLoading: false,
      error: null,
      selectedCategory: null,
      selectedAgents: [],
      agents: mockAgents,
      
      settings: {
        baseUrl: "http://127.0.0.1:8000",
        mode: "offline",
      },
      
      // Actions
      setEvaluationResult: (result) => set({ evaluationResult: result, error: null }),
      setLoading: (loading) => set({ isLoading: loading }),
      setError: (error) => set({ error, isLoading: false }),
      updateSettings: (newSettings) => 
        set((state) => ({ 
          settings: { ...state.settings, ...newSettings } 
        })),
      setSelectedCategory: (category) => 
        set({ selectedCategory: category, selectedAgents: [] }),
      setSelectedAgents: (agents) => set({ selectedAgents: agents }),
      clearEvaluation: () => set({ 
        evaluationResult: null, 
        error: null, 
        isLoading: false 
      }),
    }),
    {
      name: 'evaluation-settings',
      partialize: (state) => ({ settings: state.settings }),
    }
  )
);