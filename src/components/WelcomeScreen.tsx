import { useQuizStore } from '../store/quizStore';
import { totalQuestions } from '../config/questions';

export default function WelcomeScreen() {
  const startQuiz = useQuizStore((s) => s.startQuiz);

  return (
    <div className="welcome">
      <img
        src="/logomark.svg"
        alt="Practical PKM"
        className="welcome__logomark"
      />
      <h1 className="welcome__title">
        <span className="gradient-text">Take the Free PKM Assessment</span>
      </h1>
      <p className="welcome__subtitle">
        Discover your personal knowledge management strengths and growth areas
        across 5 key dimensions.
      </p>
      <div className="welcome__meta">
        <span>❓ {totalQuestions} questions</span>
        <span>⏰ ~5 minutes</span>
        <span>📊 Instant results</span>
      </div>
      <button className="btn btn--primary" onClick={startQuiz}>
        Start the Assessment
      </button>
    </div>
  );
}
