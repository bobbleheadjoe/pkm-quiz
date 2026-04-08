// ============================================================
// DYNAMIC CTAs — shown based on the user's lowest-scoring area
// ============================================================
// Each CTA maps to a category ID. The CTA for the lowest-scoring
// category is shown on the results page. Edit the title, text,
// button label, and URL to match your current offers.
// ============================================================

interface CategoryCTA {
  categoryId: string;
  title: string;
  text: string;
  buttonLabel: string;
  url: string;
}

export const categoryCTAs: CategoryCTA[] = [
  {
    categoryId: 'information-management',
    title: 'Get Your Information Under Control',
    text: 'The Practical PKM LifeHQ includes a complete capture and processing system in Obsidian — so you never lose track of valuable information again.',
    buttonLabel: 'Learn More About LifeHQ',
    url: 'https://lifehq.practicalpkm.com',
  },
  {
    categoryId: 'creativity',
    title: 'Unlock Your Creative Potential',
    text: 'The Practical PKM LifeHQ gives you a linked idea management system in Obsidian — connecting your notes so great ideas never get lost.',
    buttonLabel: 'Learn More About LifeHQ',
    url: 'https://lifehq.practicalpkm.com',
  },
  {
    categoryId: 'task-project',
    title: 'Take Control of Your Tasks & Projects',
    text: 'The Practical PKM LifeHQ includes a complete task and project management system in Obsidian — with weekly reviews, priorities, and next actions built in.',
    buttonLabel: 'Learn More About LifeHQ',
    url: 'https://lifehq.practicalpkm.com',
  },
  {
    categoryId: 'vision-values',
    title: 'Define Your Direction',
    text: 'The Practical PKM LifeHQ includes vision, values, and goal-setting templates in Obsidian — so you can make decisions with clarity and purpose.',
    buttonLabel: 'Learn More About LifeHQ',
    url: 'https://lifehq.practicalpkm.com',
  },
  {
    categoryId: 'journaling',
    title: 'Build a Reflection Practice',
    text: 'The Practical PKM LifeHQ includes daily, weekly, and quarterly review templates in Obsidian — turning journaling into a consistent, high-leverage habit.',
    buttonLabel: 'Learn More About LifeHQ',
    url: 'https://lifehq.practicalpkm.com',
  },
];

export function getCTAForLowestCategory(
  scores: Record<string, number>,
): CategoryCTA {
  let lowestId = '';
  let lowestScore = Infinity;

  for (const [id, score] of Object.entries(scores)) {
    if (score < lowestScore) {
      lowestScore = score;
      lowestId = id;
    }
  }

  return (
    categoryCTAs.find((cta) => cta.categoryId === lowestId) ??
    categoryCTAs[0]
  );
}
