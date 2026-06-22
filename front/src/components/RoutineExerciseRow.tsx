import type { RoutineExercise } from "../types/routine";
import { getMuscleGroupImage } from "../utils/muscleGroupImage";
import { getYouTubeThumbnail } from "../utils/youtube";

const REST_STEP = 15;
const REST_MIN = 0;
const REST_MAX = 600;

type RestField = "restSeconds" | "restBetweenSeconds";

type RoutineExerciseRowProps = {
  routineExercise: RoutineExercise;
  onRemove: () => void;
  onChangeRest: (field: RestField, value: number) => void;
};

type RestStepperProps = {
  label: string;
  value: number;
  onChange: (value: number) => void;
};

function RestStepper({ label, value, onChange }: RestStepperProps) {
  const clamp = (next: number) =>
    Math.max(REST_MIN, Math.min(REST_MAX, next));

  return (
    <div className="routine-exercise-row__rest-field">
      <span className="routine-exercise-row__rest-label">{label}</span>
      <div className="routine-exercise-row__rest-stepper">
        <button
          type="button"
          className="routine-exercise-row__rest-btn"
          onClick={() => onChange(clamp(value - REST_STEP))}
          aria-label={`Reducir ${label}`}
        >
          −
        </button>
        <span className="routine-exercise-row__rest-value">{value}s</span>
        <button
          type="button"
          className="routine-exercise-row__rest-btn"
          onClick={() => onChange(clamp(value + REST_STEP))}
          aria-label={`Aumentar ${label}`}
        >
          +
        </button>
      </div>
    </div>
  );
}

export function RoutineExerciseRow({
  routineExercise,
  onRemove,
  onChangeRest,
}: RoutineExerciseRowProps) {
  const { exercise, sets, reps, restSeconds, restBetweenSeconds } =
    routineExercise;
  const muscleImage = getMuscleGroupImage(exercise.muscleGroup);
  const thumbnail = getYouTubeThumbnail(exercise.videoUrl);

  return (
    <article className="routine-exercise-row">
      <div className="routine-exercise-row__top">
        <div className="routine-exercise-row__thumbnail-wrapper">
          {thumbnail ? (
            <img
              src={thumbnail}
              alt={exercise.name}
              className="routine-exercise-row__thumbnail routine-exercise-row__thumbnail--img"
            />
          ) : (
            <div
              className="routine-exercise-row__thumbnail"
              aria-hidden="true"
            />
          )}
          <button
            type="button"
            className="routine-exercise-row__delete-btn"
            onClick={onRemove}
            aria-label={`Eliminar ${exercise.name}`}
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
            </svg>
          </button>
        </div>

        <div className="routine-exercise-row__info">
          <h3 className="routine-exercise-row__name">{exercise.name}</h3>
          <p className="routine-exercise-row__meta">
            {sets} series · {reps} reps
          </p>
        </div>

        {muscleImage && (
          <img
            src={muscleImage}
            alt={exercise.muscleGroup}
            className="routine-exercise-row__muscle-img"
          />
        )}
      </div>

      <div className="routine-exercise-row__rest">
        <RestStepper
          label="Entre series"
          value={restSeconds}
          onChange={(value) => onChangeRest("restSeconds", value)}
        />
        <RestStepper
          label="Entre ejercicios"
          value={restBetweenSeconds}
          onChange={(value) => onChangeRest("restBetweenSeconds", value)}
        />
      </div>
    </article>
  );
}
