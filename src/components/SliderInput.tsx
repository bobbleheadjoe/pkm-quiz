import { useEffect, useRef } from 'react';

interface SliderInputProps {
  value: number | null;
  onChange: (value: number) => void;
  onConfirm: () => void;
}

const SCALE_LABELS = ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree'];

export default function SliderInput({ value, onChange, onConfirm }: SliderInputProps) {
  // Use refs to avoid stale closures in the keydown listener
  const onChangeRef = useRef(onChange);
  const onConfirmRef = useRef(onConfirm);
  const valueRef = useRef(value);

  onChangeRef.current = onChange;
  onConfirmRef.current = onConfirm;
  valueRef.current = value;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is typing in an input field
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      const num = parseInt(e.key, 10);
      if (num >= 1 && num <= 5) {
        e.preventDefault();
        onChangeRef.current(num);
      } else if (e.key === 'Enter' && valueRef.current !== null) {
        e.preventDefault();
        onConfirmRef.current();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []); // stable — never re-attaches

  return (
    <div className="scale">
      <div className={`scale__value ${value === null ? 'scale__value--empty' : 'gradient-text'}`}>
        {value !== null ? SCALE_LABELS[value - 1] : 'Select a rating (1–5)'}
      </div>
      <div className="scale__buttons">
        {Array.from({ length: 5 }, (_, i) => {
          const num = i + 1;
          const isSelected = value === num;
          return (
            <button
              key={num}
              type="button"
              className={`scale__btn ${isSelected ? 'scale__btn--selected' : ''}`}
              onClick={() => onChange(num)}
              aria-label={`${num} — ${SCALE_LABELS[i]}`}
            >
              <span className="scale__btn-number">{num}</span>
            </button>
          );
        })}
      </div>
      <div className="scale__anchors">
        <span className="scale__anchor">Strongly Disagree</span>
        <span className="scale__anchor">Strongly Agree</span>
      </div>
      <div className="scale__hint">
        Press <kbd>1</kbd>–<kbd>5</kbd> to select, <kbd>Enter</kbd> to continue
      </div>
    </div>
  );
}
