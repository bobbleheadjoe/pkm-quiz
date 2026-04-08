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
      const overall = computeOverallScore(scores);
      fields['pkm'] = String(Math.round((overall / MAX_SCORE) * 100));

      // Build QuickChart radar image URL and save to Kit
      const chartLabels = categories.map((c) => {
        const parts: Record<string, string[]> = {
          'Information Management': ['Information', 'Management'],
          'Creativity & Idea Management': ['Creativity', '& Ideas'],
          'Task & Project Management': ['Tasks', '& Projects'],
          'Vision & Values': ['Vision', '& Values'],
          'Journaling & Reflection': ['Journaling', '& Reflection'],
        };
        return parts[c.label] ?? [c.label];
      });
      const chartData = categories.map((c) =>
        Math.round(((scores[c.id] ?? 0) / MAX_SCORE) * 100),
      );
      const chartConfig = {
        type: 'radar',
        data: {
          labels: chartLabels,
          datasets: [
            {
              data: chartData,
              backgroundColor: 'rgba(195, 34, 255, 0.15)',
              borderColor: '#C322FF',
              borderWidth: 2.5,
              pointBackgroundColor: categories.map((c) => c.color),
              pointBorderColor: categories.map((c) => c.color),
              pointRadius: 8,
              pointHoverRadius: 8,
            },
          ],
        },
        options: {
          layout: { padding: 20 },
          scales: {
            r: {
              min: 0,
              max: 100,
              ticks: { display: false, stepSize: 20 },
              grid: { color: 'rgba(255, 255, 255, 0.12)' },
              angleLines: { color: 'rgba(255, 255, 255, 0.12)' },
              pointLabels: {
                color: '#CCCCCC',
                font: { size: 16, weight: 'bold' },
                padding: 20,
              },
            },
          },
          plugins: { legend: { display: false } },
        },
      };
      const chartUrl = `https://quickchart.io/chart?v=4&c=${encodeURIComponent(JSON.stringify(chartConfig))}&w=600&h=600&bkg=%230D0D0D&devicePixelRatio=2`;
      fields['pkm_chart_url'] = chartUrl;

      // Set PKM Area to the lowest-scoring category label
      let lowestId = '';
      let lowestScore = Infinity;
      for (const [id, score] of Object.entries(scores)) {
        if (score < lowestScore) {
          lowestScore = score;
          lowestId = id;
        }
      }
      const lowestCat = categories.find((c) => c.id === lowestId);
      if (lowestCat) {
        fields['pkm_area'] = lowestCat.label;
      }

      await subscribeToKit({ email, firstName, fields, formId: 9024182 });
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
