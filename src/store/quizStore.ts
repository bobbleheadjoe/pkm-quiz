import { create } from 'zustand';
import { categories, shuffledQuestions, totalQuestions, MAX_SCORE } from '../config/questions';
import { subscribeToKit } from '../lib/kit';

type Screen = 'welcome' | 'questions' | 'email' | 'results';

interface QuizState {
  screen: Screen;
  currentQuestionIndex: number;
  answers: Record<string, number | null>;
  firstName: string;
  email: string;
  isSubmitting: boolean;
  submitError: string | null;

  // Actions
  startQuiz: () => void;
  setAnswer: (questionId: string, score: number) => void;
  nextQuestion: () => void;
  prevQuestion: () => void;
  setFirstName: (name: string) => void;
  setEmail: (email: string) => void;
  submitEmail: () => Promise<void>;
  restart: () => void;
}

export const useQuizStore = create<QuizState>((set, get) => ({
  screen: 'welcome',
  currentQuestionIndex: 0,
  answers: {},
  firstName: '',
  email: '',
  isSubmitting: false,
  submitError: null,

  startQuiz: () => set({ screen: 'questions', currentQuestionIndex: 0 }),

  setAnswer: (questionId, score) =>
    set((state) => ({
      answers: { ...state.answers, [questionId]: score },
    })),

  nextQuestion: () => {
    const { currentQuestionIndex } = get();
    if (currentQuestionIndex < totalQuestions - 1) {
      set({ currentQuestionIndex: currentQuestionIndex + 1 });
    } else {
      set({ screen: 'email' });
    }
  },

  prevQuestion: () => {
    const { currentQuestionIndex } = get();
    if (currentQuestionIndex > 0) {
      set({ currentQuestionIndex: currentQuestionIndex - 1 });
    }
  },

  setFirstName: (name) => set({ firstName: name }),
  setEmail: (email) => set({ email }),

  submitEmail: async () => {
    const { email, firstName, answers } = get();
    set({ isSubmitting: true, submitError: null });

    try {
      const scores = computeCategoryScores(answers);
      const fields: Record<string, string> = {};
      for (const cat of categories) {
        const pct = Math.round(((scores[cat.id] ?? 0) / MAX_SCORE) * 100);
        fields[cat.kitFieldName] = String(pct);
      }

      await subscribeToKit({ email, firstName, fields });
      set({ screen: 'results', isSubmitting: false });
    } catch (err) {
      set({
        isSubmitting: false,
        submitError:
          err instanceof Error ? err.message : 'Something went wrong. Please try again.',
      });
    }
  },

  restart: () =>
    set({
      screen: 'welcome',
      currentQuestionIndex: 0,
      answers: {},
      firstName: '',
      email: '',
      isSubmitting: false,
      submitError: null,
    }),
}));

// ── Pure utility functions (not in store, no snapshot issues) ──

export function computeCategoryScores(
  answers: Record<string, number | null>,
): Record<string, number> {
  const scores: Record<string, number> = {};
  for (const cat of categories) {
    const catAnswers = cat.questions
      .map((q) => answers[q.id])
      .filter((v): v is number => v !== null && v !== undefined);
    scores[cat.id] =
      catAnswers.length > 0
        ? catAnswers.reduce((sum, v) => sum + v, 0) / catAnswers.length
        : 0;
  }
  return scores;
}

export function computeOverallScore(
  categoryScores: Record<string, number>,
): number {
  const values = Object.values(categoryScores);
  return values.length > 0
    ? values.reduce((sum, v) => sum + v, 0) / values.length
    : 0;
}

export function getCurrentQuestion(index: number) {
  return shuffledQuestions[index];
}

export function getProgress(index: number) {
  return {
    current: index + 1,
    total: totalQuestions,
    percent: ((index + 1) / totalQuestions) * 100,
  };
}
