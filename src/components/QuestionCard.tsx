import { useState, useEffect, useCallback } from 'react';
import { useQuizStore, getCurrentQuestion } from '../store/quizStore';
import SliderInput from './SliderInput';

export default function QuestionCard() {
  const currentIndex = useQuizStore((s) => s.currentQuestionIndex);
  const answers = useQuizStore((s) => s.answers);
  const setAnswer = useQuizStore((s) => s.setAnswer);
  const nextQuestion = useQuizStore((s) => s.nextQuestion);
  const prevQuestion = useQuizStore((s) => s.prevQuestion);

  const question = getCurrentQuestion(currentIndex);

  const [animClass, setAnimClass] = useState('slide-enter');
  const [displayIndex, setDisplayIndex] = useState(currentIndex);

  useEffect(() => {
    if (currentIndex === displayIndex) return;

    const dir = currentIndex > displayIndex ? 'forward' : 'back';
    setAnimClass(dir === 'forward' ? 'slide-exit' : 'slide-exit-reverse');

    const timeout = setTimeout(() => {
      setDisplayIndex(currentIndex);
      setAnimClass(dir === 'forward' ? 'slide-enter' : 'slide-enter-reverse');
    }, 250);

    return () => clearTimeout(timeout);
  }, [currentIndex, displayIndex]);

  const handleConfirm = useCallback(() => {
    if (question && answers[question.id] !== null && answers[question.id] !== undefined) {
      nextQuestion();
    }
  }, [question, answers, nextQuestion]);

  if (!question) return null;

  const currentAnswer = answers[question.id] ?? null;
  const canGoNext = currentAnswer !== null;

  return (
    <div className={`question ${animClass}`} key={displayIndex}>
      <h2 className="question__text">{question.text}</h2>
      <p className="question__description">{question.description}</p>

      <SliderInput
        value={currentAnswer}
        onChange={(val) => setAnswer(question.id, val)}
        onConfirm={handleConfirm}
      />

      <div className="question__actions">
        <button
          className="btn btn--secondary btn--small"
          onClick={prevQuestion}
          disabled={currentIndex === 0}
        >
          Back
        </button>
        <button
          className="btn btn--primary btn--small"
          onClick={nextQuestion}
          disabled={!canGoNext}
        >
          Next
        </button>
      </div>
    </div>
  );
}
