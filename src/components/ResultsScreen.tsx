import { useMemo } from 'react';
import { useQuizStore, computeCategoryScores, computeOverallScore } from '../store/quizStore';
import { categories, MAX_SCORE } from '../config/questions';
import { getInsight } from '../data/insights';
import { getCTAForLowestCategory } from '../data/ctas';
import RadarChart from './RadarChart';

/** Convert a raw score (1–5) to a percentage (0–100) */
function toPercent(raw: number): number {
  return Math.round((raw / MAX_SCORE) * 100);
}

export default function ResultsScreen() {
  const answers = useQuizStore((s) => s.answers);
  const firstName = useQuizStore((s) => s.firstName);
  const restart = useQuizStore((s) => s.restart);

  const scores = useMemo(() => computeCategoryScores(answers), [answers]);
  const overall = useMemo(() => computeOverallScore(scores), [scores]);
  const cta = useMemo(() => getCTAForLowestCategory(scores), [scores]);

  const overallPercent = toPercent(overall);

  const handleShare = () => {
    const lines = categories.map((cat) => {
      const pct = toPercent(scores[cat.id] ?? 0);
      return `${cat.emoji} ${cat.label}: ${pct}%`;
    });

    const text = [
      `My PKM Profile Results`,
      `Overall: ${overallPercent}%`,
      '',
      ...lines,
      '',
      'Take the quiz: https://quiz.practicalpkm.com',
    ].join('\n');

    navigator.clipboard.writeText(text).then(() => {
      alert('Results copied to clipboard!');
    });
  };

  return (
    <div className="results">
      <h2 className="results__title">
        {firstName ? `${firstName}, here's ` : "Here's "}
        <span className="gradient-text">Your PKM Profile</span>
      </h2>

      <div className="results__overall gradient-text">{overallPercent}%</div>
      <p className="results__overall-label">Overall PKM Score</p>

      <div className="results__chart scale-in">
        <RadarChart scores={scores} />
      </div>

      <div className="results__breakdown">
        {categories.map((cat) => {
          const raw = scores[cat.id] ?? 0;
          const pct = toPercent(raw);
          const insight = getInsight(cat.id, raw);

          return (
            <div key={cat.id} className="results__category">
              <div className="results__category-header">
                <span className="results__category-name">
                  <span>{cat.emoji}</span>
                  <span>{cat.label}</span>
                </span>
                <span
                  className="results__category-score"
                  style={{ color: cat.color }}
                >
                  {pct}%
                </span>
              </div>
              <div className="results__category-bar">
                <div
                  className="results__category-bar-fill"
                  style={{
                    width: `${pct}%`,
                    backgroundColor: cat.color,
                  }}
                />
              </div>
              {insight && (
                <>
                  <p className="results__insight-heading">{insight.heading}</p>
                  <p className="results__insight-text">{insight.text}</p>
                </>
              )}
            </div>
          );
        })}
      </div>

      <div className="results__cta">
        <h3 className="results__cta-title">{cta.title}</h3>
        <p className="results__cta-text">{cta.text}</p>
        <a
          href={cta.url}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn--primary"
        >
          {cta.buttonLabel}
        </a>
      </div>

      <div style={{ marginTop: 24, display: 'flex', gap: 12, justifyContent: 'center' }}>
        <button className="btn btn--secondary btn--small" onClick={handleShare}>
          Copy Results
        </button>
        <button className="btn btn--secondary btn--small" onClick={restart}>
          Retake Quiz
        </button>
      </div>
    </div>
  );
}
