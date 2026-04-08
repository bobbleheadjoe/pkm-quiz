import { useMemo, useState, useEffect, useRef } from 'react';
import { useQuizStore, computeCategoryScores, computeOverallScore } from '../store/quizStore';
import { categories, MAX_SCORE } from '../config/questions';
import { getInsight } from '../data/insights';
import { getCTAForLowestCategory } from '../data/ctas';
import { tagSubscriber } from '../lib/kit';
import RadarChart from './RadarChart';

/** Convert a raw score (1–5) to a percentage (0–100) */
function toPercent(raw: number): number {
  return Math.round((raw / MAX_SCORE) * 100);
}

export default function ResultsScreen() {
  const answers = useQuizStore((s) => s.answers);
  const firstName = useQuizStore((s) => s.firstName);
  const email = useQuizStore((s) => s.email);
  const restart = useQuizStore((s) => s.restart);

  const [emailSending, setEmailSending] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [visibleBars, setVisibleBars] = useState<Set<string>>(new Set());
  const barRefs = useRef<Map<string, HTMLDivElement>>(new Map());

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute('data-cat-id');
            if (id) {
              setVisibleBars((prev) => new Set(prev).add(id));
              observer.unobserve(entry.target);
            }
          }
        });
      },
      { threshold: 0.3 },
    );

    barRefs.current.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const scores = useMemo(() => computeCategoryScores(answers), [answers]);
  const overall = useMemo(() => computeOverallScore(scores), [scores]);
  const cta = useMemo(() => getCTAForLowestCategory(scores), [scores]);

  const overallPercent = toPercent(overall);

  const buildResultsText = () => {
    const lines = categories.map((cat) => {
      const pct = toPercent(scores[cat.id] ?? 0);
      return `${cat.emoji} ${cat.label}: ${pct}%`;
    });

    return [
      `My PKM Profile Results`,
      `Overall: ${overallPercent}%`,
      '',
      ...lines,
      '',
      'Take the quiz: https://quiz.practicalpkm.com',
    ].join('\n');
  };

  const handleShare = () => {
    const text = buildResultsText();
    navigator.clipboard.writeText(text).then(() => {
      alert('Results copied to clipboard!');
    });
  };

  const handleEmail = async () => {
    setEmailSending(true);
    try {
      await tagSubscriber(email, 18828631);
      setEmailSent(true);
    } catch (err) {
      console.error('Failed to trigger email:', err);
      alert('Something went wrong. Please try again.');
    } finally {
      setEmailSending(false);
    }
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
              <div
                className="results__category-bar"
                data-cat-id={cat.id}
                ref={(el) => {
                  if (el) barRefs.current.set(cat.id, el);
                }}
              >
                <div
                  className="results__category-bar-fill"
                  style={{
                    width: visibleBars.has(cat.id) ? `${pct}%` : '0%',
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

      {emailSent && (
        <p style={{ textAlign: 'center', color: '#AAAAAA', fontSize: '0.9rem', marginTop: 16 }}>
          ✅ Check your inbox — your results should arrive within a couple of minutes.
        </p>
      )}

      <div style={{ marginTop: emailSent ? 12 : 24, display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
        <button
          className="btn btn--secondary btn--small"
          onClick={handleEmail}
          disabled={emailSending || emailSent}
        >
          {emailSent ? 'Results Sent!' : emailSending ? 'Sending…' : 'Email Results'}
        </button>
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
