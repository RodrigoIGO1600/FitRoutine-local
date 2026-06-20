import type { RoutineExercise } from "../types/routine";

type RoutineExerciseRowProps = {
  routineExercise: RoutineExercise;
};

export function RoutineExerciseRow({
  routineExercise,
}: RoutineExerciseRowProps) {
  const { exercise, sets, reps, restSeconds } = routineExercise;

  return (
    <article className="routine-exercise-row">
      <div className="routine-exercise-row__main">
        <h3 className="routine-exercise-row__name">{exercise.name}</h3>
        <p className="routine-exercise-row__meta">
          {sets} series · {reps} reps · {restSeconds}s descanso
        </p>
      </div>
    </article>
  );
}
