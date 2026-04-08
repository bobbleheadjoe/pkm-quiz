import { useQuizStore, getProgress } from '../store/quizStore';

export default function ProgressBar() {
  const currentIndex = useQuizStore((s) => s.currentQuestionIndex);
  const { current, total, percent } = getProgress(currentIndex);

  return (
    <div className="progress">
      <div className="progress__info">
        <span className="progress__count">
          {current} of {total}
        </span>
      </div>
      <div className="progress__track">
        <div
          className="progress__fill"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
