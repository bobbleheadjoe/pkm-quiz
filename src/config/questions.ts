// ============================================================
// PKM PROFILE — QUIZ QUESTIONS
// ============================================================
// Edit this file to change any quiz content.
// Each category has a label, Kit custom field name, color, and questions.
// Questions use a 1–5 self-assessment scale.
// ============================================================

export interface Question {
  id: string;
  text: string;
  description: string;
}

export interface Category {
  id: string;
  label: string;
  kitFieldName: string; // Must match the custom field name in your Kit dashboard
  emoji: string;
  color: string;
  questions: Question[];
}

export const categories: Category[] = [
  // ── 1. Information Management ────────────────────────────
  {
    id: 'information-management',
    label: 'Information Management',
    kitFieldName: 'pkm_information_management',
    emoji: '📥',
    color: '#C322FF',
    questions: [
      {
        id: 'im-1',
        text: 'When I find an interesting article, video, or podcast, I have a reliable system to capture it so nothing falls through the cracks.',
        description: 'Think about your capture workflow for new information.',
      },
      {
        id: 'im-2',
        text: 'I can find any note or reference I\'ve saved within 60 seconds of looking for it.',
        description: 'Consider how searchable and organized your notes are.',
      },
      {
        id: 'im-3',
        text: 'I regularly process my inboxes and read-later queue rather than letting it pile up indefinitely.',
        description: 'How often do you review and process what you\'ve captured?',
      },
      {
        id: 'im-4',
        text: 'I have a clear system for deciding what to keep, what to summarize, and what to discard.',
        description: 'Think about your criteria for filtering information.',
      },
    ],
  },

  // ── 2. Creativity & Idea Management ──────────────────────
  {
    id: 'creativity',
    label: 'Creativity & Idea Management',
    kitFieldName: 'pkm_creativity',
    emoji: '💡',
    color: '#7B46FF',
    questions: [
      {
        id: 'cr-1',
        text: 'I have a dedicated place to capture fleeting ideas before they disappear, no matter where I am.',
        description: 'Think about how you handle ideas that strike at random moments.',
      },
      {
        id: 'cr-2',
        text: 'I actively connect new ideas to existing notes, creating links and relationships between concepts.',
        description: 'Consider whether your notes talk to each other.',
      },
      {
        id: 'cr-3',
        text: 'I regularly review and develop my raw ideas into more refined outputs like blog posts, projects, or decisions.',
        description: 'How often do ideas move from capture to creation?',
      },
      {
        id: 'cr-4',
        text: 'I have a repeatable creative workflow that takes me from a spark of inspiration to a finished piece of work.',
        description: 'Think about whether you have a defined creative process.',
      },
    ],
  },

  // ── 3. Task & Project Management ─────────────────────────
  {
    id: 'task-project',
    label: 'Task & Project Management',
    kitFieldName: 'pkm_task_management',
    emoji: '✅',
    color: '#2469FF',
    questions: [
      {
        id: 'tp-1',
        text: 'I trust my task management system completely — nothing I\'ve committed to is lost or forgotten.',
        description: 'Think about whether your system captures all your commitments.',
      },
      {
        id: 'tp-2',
        text: 'I do a weekly review where I look at all my projects, update statuses, and plan the week ahead.',
        description: 'Consider whether you have a regular review rhythm.',
      },
      {
        id: 'tp-3',
        text: 'I am clear on my priorities and consistently take action on what is most important.',
        description: 'Are you able to focus on the things that really matter?',
      },
      {
        id: 'tp-4',
        text: 'I break large projects into concrete next actions and track progress toward milestones.',
        description: 'Think about how you handle multi-step projects.',
      },
    ],
  },

  // ── 4. Vision & Values ───────────────────────────────────
  {
    id: 'vision-values',
    label: 'Vision & Values',
    kitFieldName: 'pkm_vision_values',
    emoji: '🧭',
    color: '#1B9EFF',
    questions: [
      {
        id: 'vv-1',
        text: 'I have written down my core personal values and I review them regularly to guide my decisions.',
        description: 'Think about whether your values are explicit and accessible.',
      },
      {
        id: 'vv-2',
        text: 'I have clearly defined goals for the next 90 days that connect to a bigger-picture vision for my life.',
        description: 'Consider whether your short-term goals serve a long-term direction.',
      },
      {
        id: 'vv-3',
        text: 'When I say yes or no to an opportunity, I evaluate it against my stated priorities and values.',
        description: 'How intentional are your commitments?',
      },
      {
        id: 'vv-4',
        text: 'I have a personal mission statement, life vision document, or similar north-star reference that I actively use.',
        description: 'Think about whether you have a documented life direction.',
      },
    ],
  },

  // ── 5. Journaling & Reflection ───────────────────────────
  {
    id: 'journaling',
    label: 'Journaling & Reflection',
    kitFieldName: 'pkm_journaling',
    emoji: '📓',
    color: '#22D1EE',
    questions: [
      {
        id: 'jr-1',
        text: 'I journal or write reflections at least a few times per week as a consistent practice.',
        description: 'Think about the frequency and consistency of your journaling habit.',
      },
      {
        id: 'jr-2',
        text: 'When I discover an insight during journaling or reflection, I take concrete action on it — adjusting a habit, updating a goal, or changing my approach.',
        description: 'Think about whether your reflections lead to real changes in your behavior or systems.',
      },
      {
        id: 'jr-3',
        text: 'I do periodic life reviews (monthly, quarterly, or annually) where I assess progress and recalibrate direction.',
        description: 'How often do you zoom out and evaluate the bigger picture?',
      },
      {
        id: 'jr-4',
        text: 'I use prompts, templates, or a structured format for my journaling rather than only free-writing.',
        description: 'Think about whether your reflection practice has intentional structure.',
      },
    ],
  },
];

// ── Derived helpers (auto-computed, don't edit) ──────────────

export const MAX_SCORE = 5;

export const totalQuestions = categories.reduce(
  (sum, cat) => sum + cat.questions.length,
  0,
);

export const allQuestions = categories.flatMap((cat) =>
  cat.questions.map((q) => ({
    ...q,
    categoryId: cat.id,
    categoryLabel: cat.label,
    categoryEmoji: cat.emoji,
  })),
);

// ── Shuffle helper (deterministic per session via seed) ──────

function seededShuffle<T>(array: T[]): T[] {
  const shuffled = [...array];
  // Simple Fisher-Yates with Math.random (new order each page load)
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export const shuffledQuestions = seededShuffle(allQuestions);
