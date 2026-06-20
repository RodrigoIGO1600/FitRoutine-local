import type { RoutineExercise } from "../types/routine";
import { getMuscleGroupImage } from "../utils/muscleGroupImage";
import { getYouTubeThumbnail } from "../utils/youtube";

type RoutineExerciseRowProps = {
  routineExercise: RoutineExercise;
  onRemove: () => void;
};

export function RoutineExerciseRow({
  routineExercise,
  onRemove,
}: RoutineExerciseRowProps) {
  const { exercise, sets, reps, restSeconds } = routineExercise;
  const muscleImage = getMuscleGroupImage(exercise.muscleGroup);
  const thumbnail = getYouTubeThumbnail(exercise.videoUrl);

  return (
    <article className="routine-exercise-row">
      <div className="routine-exercise-row__thumbnail-wrapper">
        {thumbnail ? (
          <img
            src={thumbnail}
            alt={exercise.name}
            className="routine-exercise-row__thumbnail routine-exercise-row__thumbnail--img"
          />
        ) : (
          <div className="routine-exercise-row__thumbnail" aria-hidden="true" />
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
          {sets} series · {reps} reps · {restSeconds}s descanso
        </p>
      </div>

      {muscleImage && (
        <img
          src={muscleImage}
          alt={exercise.muscleGroup}
          className="routine-exercise-row__muscle-img"
        />
      )}
    </article>
  );
}
