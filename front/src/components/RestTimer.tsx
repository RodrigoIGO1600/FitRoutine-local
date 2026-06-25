type RestTimerProps = {
  remaining: number;
  total: number;
  label: string;
  nextExerciseName?: string;
  nextExerciseMuscleGroup?: string;
  nextExerciseImage?: string | null;
  onSkip: () => void;
  onAdjust: (delta: number) => void;
  onEdit: () => void;
};

const RADIUS = 110;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

function formatRest(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

export function RestTimer({
  remaining,
  total,
  label,
  nextExerciseName,
  nextExerciseMuscleGroup,
  nextExerciseImage,
  onSkip,
  onAdjust,
  onEdit,
}: RestTimerProps) {
  const progress = total > 0 ? Math.min(1, Math.max(0, remaining / total)) : 0;
  const dashOffset = CIRCUMFERENCE * (1 - progress);

  return (
    <div
      className="workout__rest-overlay"
      role="dialog"
      aria-modal="true"
      aria-label="Tiempo de descanso"
    >
      <div className="workout__rest-circle" onClick={onSkip}>
        <svg className="workout__rest-ring" viewBox="0 0 240 240" aria-hidden="true">
          <circle
            className="workout__rest-ring-track"
            cx="120"
            cy="120"
            r={RADIUS}
          />
          <circle
            className="workout__rest-ring-progress"
            cx="120"
            cy="120"
            r={RADIUS}
            style={{
              strokeDasharray: CIRCUMFERENCE,
              strokeDashoffset: dashOffset,
            }}
          />
        </svg>

        <div className="workout__rest-content">
          <span className="workout__rest-skip">Toca para saltar</span>
          <span className="workout__rest-label">{label}</span>

          <span className="workout__rest-sub">
            Descanso: {formatRest(total)} min
          </span>

          <div className="workout__rest-row">
            <button
              type="button"
              className="workout__rest-adjust"
              onClick={(event) => {
                event.stopPropagation();
                onAdjust(-15);
              }}
            >
              - 15
            </button>

            <span className="workout__rest-time">{formatRest(remaining)}</span>

            <button
              type="button"
              className="workout__rest-adjust"
              onClick={(event) => {
                event.stopPropagation();
                onAdjust(15);
              }}
            >
              + 15
            </button>
          </div>

          <button
            type="button"
            className="workout__rest-edit"
            aria-label="Editar tiempo de descanso"
            onClick={(event) => {
              event.stopPropagation();
              onEdit();
            }}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 20h9" />
              <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" />
            </svg>
          </button>
        </div>
      </div>

      {nextExerciseName && (
        <div className="workout__rest-next-preview">
          <div className="workout__rest-next-header">
            <span className="workout__rest-next-label">Siguiente</span>
            <span className="workout__rest-next-arrow">→</span>
          </div>
          <div className="workout__rest-next-card">
            <div className="workout__rest-next-thumb">
              {nextExerciseImage ? (
                <img
                  className="workout__rest-next-img"
                  src={nextExerciseImage}
                  alt={nextExerciseName}
                />
              ) : (
                <div className="workout__rest-next-placeholder">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="5 3 19 12 5 21 5 3" />
                  </svg>
                </div>
              )}
              {nextExerciseImage && (
                <div className="workout__rest-next-play">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <polygon points="5 3 19 12 5 21 5 3" />
                  </svg>
                </div>
              )}
            </div>
            <div className="workout__rest-next-info">
              <span className="workout__rest-next-name">{nextExerciseName}</span>
              {nextExerciseMuscleGroup && (
                <span className="workout__rest-next-muscle">{nextExerciseMuscleGroup}</span>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
