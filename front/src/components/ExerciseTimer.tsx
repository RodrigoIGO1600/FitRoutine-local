import "./ExerciseTimer.css";

const RADIUS = 110;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

type ExerciseTimerProps = {
  remaining: number;
  total: number;
  label: string;
  onSkip: () => void;
  onAdjust: (delta: number) => void;
};

export function ExerciseTimer({
  remaining,
  total,
  label,
  onSkip,
  onAdjust,
}: ExerciseTimerProps) {
  const progress = total > 0 ? remaining / total : 0;
  const offset = CIRCUMFERENCE * (1 - progress);
  const minutes = Math.floor(remaining / 60);
  const seconds = remaining % 60;
  const formatted = `${minutes}:${String(seconds).padStart(2, "0")}`;

  return (
    <div className="exercise-timer-overlay">
      <div className="exercise-timer">
        <p className="exercise-timer__label">{label}</p>

        <button
          type="button"
          className="exercise-timer__ring-btn"
          onClick={onSkip}
          aria-label="Saltar timer"
        >
          <svg
            className="exercise-timer__svg"
            viewBox={`0 0 ${(RADIUS + 20) * 2} ${(RADIUS + 20) * 2}`}
          >
            <circle
              className="exercise-timer__track"
              cx={RADIUS + 20}
              cy={RADIUS + 20}
              r={RADIUS}
              fill="none"
              strokeWidth="8"
            />
            <circle
              className="exercise-timer__progress"
              cx={RADIUS + 20}
              cy={RADIUS + 20}
              r={RADIUS}
              fill="none"
              strokeWidth="8"
              strokeDasharray={CIRCUMFERENCE}
              strokeDashoffset={offset}
              strokeLinecap="round"
              transform={`rotate(-90 ${RADIUS + 20} ${RADIUS + 20})`}
            />
          </svg>
          <span className="exercise-timer__time">{formatted}</span>
        </button>

        <div className="exercise-timer__controls">
          <button
            type="button"
            className="exercise-timer__adjust-btn"
            onClick={() => onAdjust(-5)}
            aria-label="Reducir 5 segundos"
          >
            −5s
          </button>
          <button
            type="button"
            className="exercise-timer__adjust-btn"
            onClick={() => onAdjust(5)}
            aria-label="Aumentar 5 segundos"
          >
            +5s
          </button>
        </div>

        <p className="exercise-timer__hint">Toca el círculo para saltar</p>
      </div>
    </div>
  );
}
