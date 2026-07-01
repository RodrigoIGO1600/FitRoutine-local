import { useMemo } from "react";
import type { Routine } from "../types/routine";
import { getRoutineInitials } from "../utils/routine";
import { getYouTubeThumbnail } from "../utils/youtube";
import { getMuscleGroupImage } from "../utils/muscleGroupImage";
import { muscleLabel } from "../utils/muscleGroupLabel";
import { useTranslation } from "../context/LanguageContext";

type RoutineCardProps = {
  routine: Routine;
  onClick?: () => void;
};

export function RoutineCard({ routine, onClick }: RoutineCardProps) {
  const { language } = useTranslation();
  const initials = getRoutineInitials(routine.name);
  const exercises = routine.exercises ?? [];

  const uniqueMuscles = useMemo(() => {
    const seen = new Set<string>();
    const result: { key: string; image: string; label: string }[] = [];
    for (const re of exercises) {
      const key = re.exercise.muscleGroup.toLowerCase();
      if (seen.has(key)) continue;
      seen.add(key);
      const image = getMuscleGroupImage(re.exercise.muscleGroup);
      if (image) {
        result.push({ key, image, label: muscleLabel(re.exercise.muscleGroup, language) });
      }
    }
    return result;
  }, [exercises, language]);

  return (
    <div
      className="routine-card"
      onClick={onClick}
      onKeyDown={
        onClick
          ? (event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                onClick();
              }
            }
          : undefined
      }
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      <div className="routine-card__main">
        <span className="routine-card__icon" aria-hidden="true">
          {initials}
        </span>

        <span className="routine-card__content">
          <span className="routine-card__name">{routine.name}</span>
          {routine.description && (
            <span className="routine-card__description">
              {routine.description}
            </span>
          )}
        </span>

        {uniqueMuscles.length > 0 && (
          <span className="routine-card__muscles">
            {uniqueMuscles.map((m) => (
              <span key={m.key} className="routine-card__muscle-item">
                <img src={m.image} alt="" className="routine-card__muscle-img" />
                <span className="routine-card__muscle-tooltip">{m.label}</span>
              </span>
            ))}
          </span>
        )}

        <span className="routine-card__chevron" aria-hidden="true">
          ›
        </span>
      </div>

      {exercises.length > 0 && (
        <div className="routine-card__exercises">
          {exercises.map((re) => {
            const thumbnail = getYouTubeThumbnail(re.exercise.videoUrl);
            const muscleImage = getMuscleGroupImage(re.exercise.muscleGroup);
            return (
              <div key={re.id} className="routine-card__exercise-card">
                <div className="routine-card__exercise-img">
                  {thumbnail ? (
                    <img src={thumbnail} alt={re.exercise.name} />
                  ) : (
                    <span className="routine-card__exercise-placeholder">
                      {re.exercise.name.charAt(0)}
                    </span>
                  )}
                </div>
                <span className="routine-card__exercise-name">{re.exercise.name}</span>
                <span className="routine-card__exercise-reps">{re.sets}x{re.reps}</span>
                {muscleImage && (
                  <img
                    src={muscleImage}
                    alt=""
                    className="routine-card__exercise-muscle"
                  />
                )}
                <span className="routine-card__exercise-muscle-label">
                  {muscleLabel(re.exercise.muscleGroup, language)}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
