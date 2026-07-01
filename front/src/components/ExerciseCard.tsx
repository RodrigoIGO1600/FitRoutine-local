import type { Exercise } from "../types/exercise";
import { useTranslation } from "../context/LanguageContext";

type ExerciseCardProps = {
  exercise: Exercise;
};

export function ExerciseCard({ exercise }: ExerciseCardProps) {
  const { t } = useTranslation();
  return (
    <article className="exercise-card">
      <div>
        <h3>{exercise.name}</h3>
        <p>{exercise.description ?? t("noDescription")}</p>
      </div>

      <div className="exercise-meta">
        <span>{exercise.muscleGroup}</span>
        <span>{exercise.equipment}</span>
      </div>
    </article>
  );
}