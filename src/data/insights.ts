// ============================================================
// PERSONALIZED INSIGHTS — shown on the results screen
// ============================================================
// Each category has 3 tiers: low (1–2.4), mid (2.5–3.9), high (4–5).
// Edit the text to match your voice and recommendations.
// ============================================================

interface InsightTier {
  range: [number, number];
  heading: string;
  text: string;
}

interface CategoryInsight {
  categoryId: string;
  tiers: InsightTier[];
}

export const insights: CategoryInsight[] = [
  {
    categoryId: 'information-management',
    tiers: [
      {
        range: [1, 2.4],
        heading: 'Room to Grow',
        text: 'You might be losing track of valuable information. Start with one reliable capture tool — even a simple notes app — and build the habit of saving things in one place before worrying too much about keeping it all organized.',
      },
      {
        range: [2.5, 3.9],
        heading: 'Solid Foundation',
        text: 'You have some good habits in place. Focus on creating a regular processing rhythm — a weekly session to review, organize, and clear your inbox — so captured information becomes truly useful.',
      },
      {
        range: [4, 5],
        heading: 'Well-Oiled Machine',
        text: 'Your information management is strong. Consider refining your retrieval system with better search, tagging, or linking to make your knowledge base even more powerful over time.',
      },
    ],
  },
  {
    categoryId: 'creativity',
    tiers: [
      {
        range: [1, 2.4],
        heading: 'Untapped Potential',
        text: 'Great ideas are probably slipping away before you can act on them. Try keeping a quick-capture tool on your phone and make it a habit to jot down any spark of an idea, no matter how rough.',
      },
      {
        range: [2.5, 3.9],
        heading: 'Growing Connections',
        text: 'You capture ideas but might not be connecting them enough. Try linking related notes together and scheduling a regular "idea review" to revisit and develop your best thinking.',
      },
      {
        range: [4, 5],
        heading: 'Creative Powerhouse',
        text: 'Your idea management is impressive. Look for ways to share your creative process with others or build public artifacts from your connected ideas — your system is ready for it.',
      },
    ],
  },
  {
    categoryId: 'task-project',
    tiers: [
      {
        range: [1, 2.4],
        heading: 'Time to Get Organized',
        text: 'Important commitments might be falling through the cracks. Pick one trusted system for all your tasks and start doing a simple daily review to stay on top of what matters most.',
      },
      {
        range: [2.5, 3.9],
        heading: 'Building Momentum',
        text: 'You have a system but it could be more consistent. A weekly review — where you look at everything on your plate and plan the week ahead — can be transformative for staying in control.',
      },
      {
        range: [4, 5],
        heading: 'Execution Expert',
        text: 'Your task and project management is dialed in. Consider optimizing how you prioritize and batch similar work to gain even more leverage from your already-strong system.',
      },
    ],
  },
  {
    categoryId: 'vision-values',
    tiers: [
      {
        range: [1, 2.4],
        heading: 'Finding Your North Star',
        text: 'Without clear values and vision, it\'s hard to say no to the wrong things. Start by writing down 3-5 personal values and one sentence about where you want to be in a year.',
      },
      {
        range: [2.5, 3.9],
        heading: 'Gaining Clarity',
        text: 'You have some sense of direction. Try creating a simple "life dashboard" with your values, quarterly goals, and key areas of focus that you review at the start of each week.',
      },
      {
        range: [4, 5],
        heading: 'Purpose-Driven',
        text: 'You have strong clarity about what matters. Keep your vision document alive by reviewing and updating it quarterly — the best visions evolve as you grow.',
      },
    ],
  },
  {
    categoryId: 'journaling',
    tiers: [
      {
        range: [1, 2.4],
        heading: 'Start the Habit',
        text: 'Reflection is one of the highest-leverage PKM habits. Start with just 5 minutes at the end of each day answering one question: "What did I learn today?" Consistency beats complexity.',
      },
      {
        range: [2.5, 3.9],
        heading: 'Deepening Reflection',
        text: 'You journal sometimes but could go deeper. Try adding structured prompts or templates, and schedule a monthly review where you look back at your entries for patterns and insights.',
      },
      {
        range: [4, 5],
        heading: 'Reflection Master',
        text: 'Your journaling practice is excellent. Consider connecting your reflections to your other PKM systems — linking journal insights to projects, ideas, and goals creates a powerful feedback loop.',
      },
    ],
  },
];

export function getInsight(categoryId: string, score: number) {
  const category = insights.find((i) => i.categoryId === categoryId);
  if (!category) return null;

  return (
    category.tiers.find((t) => score >= t.range[0] && score <= t.range[1]) ??
    category.tiers[category.tiers.length - 1]
  );
}
