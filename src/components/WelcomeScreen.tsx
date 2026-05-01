import { useQuizStore } from '../store/quizStore';
import { categories } from '../config/questions';

export default function WelcomeScreen() {
  const startQuiz = useQuizStore((s) => s.startQuiz);

  return (
    <main className="landing">
      <section className="landing__hero">
        <div className="landing__blob" aria-hidden="true" />

        <p className="landing__eyebrow gradient-text">
          Five dimensions. One profile. Yours.
        </p>

        <h1 className="landing__title">
          Take the Free <span className="gradient-text">PKM Assessment</span>
        </h1>

        <p className="landing__subtitle">
          Twenty questions. Five PKM dimensions. A personalized profile that
          shows your strengths, your biggest growth area, and the next step
          to level up your knowledge management.
        </p>

        <div className="landing__cta-group">
          <button
            type="button"
            className="landing__cta gradient-bg"
            onClick={startQuiz}
          >
            Start the Assessment
          </button>
          <p className="landing__trust">
            ⏰ ~5 minutes &middot; 📊 Instant results &middot; Free
          </p>
        </div>
      </section>

      <section className="landing__features">
        <div className="landing__features-header">
          <h2 className="landing__features-title">
            Five dimensions of effective{' '}
            <span className="gradient-text">personal knowledge management</span>
          </h2>
          <p className="landing__features-sub">
            We'll score you on each one and show you where to focus next.
          </p>
        </div>

        <div className="landing__cards">
          {categories.map((cat) => (
            <div key={cat.id} className="landing__card">
              <div className="landing__card-emoji">{cat.emoji}</div>
              <h3 className="landing__card-name">{cat.label}</h3>
            </div>
          ))}
        </div>

        <div className="landing__cta-secondary">
          <button
            type="button"
            className="landing__cta gradient-bg"
            onClick={startQuiz}
          >
            Find My PKM Profile →
          </button>
        </div>
      </section>

      <footer className="landing__footer">
        Built by{' '}
        <a href="https://practicalpkm.com" className="landing__footer-link">
          Practical PKM
        </a>
      </footer>
    </main>
  );
}
