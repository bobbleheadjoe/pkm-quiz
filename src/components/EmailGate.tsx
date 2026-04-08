import { useMemo } from 'react';
import type { FormEvent } from 'react';
import { useQuizStore, computeCategoryScores } from '../store/quizStore';
import RadarChart from './RadarChart';

export default function EmailGate() {
  const answers = useQuizStore((s) => s.answers);
  const firstName = useQuizStore((s) => s.firstName);
  const email = useQuizStore((s) => s.email);
  const setFirstName = useQuizStore((s) => s.setFirstName);
  const setEmail = useQuizStore((s) => s.setEmail);
  const submitEmail = useQuizStore((s) => s.submitEmail);
  const isSubmitting = useQuizStore((s) => s.isSubmitting);
  const submitError = useQuizStore((s) => s.submitError);

  const scores = useMemo(() => computeCategoryScores(answers), [answers]);

  const isValid = email.includes('@') && email.includes('.') && firstName.trim().length > 0;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (isValid && !isSubmitting) {
      submitEmail();
    }
  };

  return (
    <div className="email-gate">
      <h2 className="email-gate__title">
        <span className="gradient-text">Your PKM Profile is Ready!</span>
      </h2>
      <p className="email-gate__subtitle">
        Enter your email to unlock your personalized results and insights.
      </p>

      <div className="email-gate__chart-preview">
        <RadarChart scores={scores} />
      </div>

      <form className="email-gate__form" onSubmit={handleSubmit}>
        <input
          type="text"
          className="email-gate__input"
          placeholder="First name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          autoComplete="given-name"
        />
        <input
          type="email"
          className="email-gate__input"
          placeholder="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
        />
        <button
          type="submit"
          className="btn btn--primary"
          disabled={!isValid || isSubmitting}
        >
          {isSubmitting ? (
            <>
              <span className="spinner" /> Unlocking...
            </>
          ) : (
            'See My Results'
          )}
        </button>
        {submitError && (
          <p className="email-gate__error">{submitError}</p>
        )}
        <p className="email-gate__privacy">
          No spam, ever. Unsubscribe anytime.
        </p>
      </form>
    </div>
  );
}
