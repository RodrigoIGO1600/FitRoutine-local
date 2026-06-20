import type { Exercise } from "../types/exercise";

type ExerciseCardProps = {
  exercise: Exercise;
};

export function ExerciseCard({ exercise }: ExerciseCardProps) {
  return (
    <article className="exercise-card">
      <div>
        <h3>{exercise.name}</h3>
        <p>{exercise.description ?? "Sin descripción"}</p>
      </div>

      <div className="exercise-meta">
        <span>{exercise.muscleGroup}</span>
        <span>{exercise.equipment}</span>
      </div>
    </article>
  );
}