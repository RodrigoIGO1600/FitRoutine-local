import type { Routine } from "../types/routine";
import { getRoutineInitials } from "../utils/routine";
import { getYouTubeThumbnail } from "../utils/youtube";

type RoutineCardProps = {
  routine: Routine;
  onClick?: () => void;
};

export function RoutineCard({ routine, onClick }: RoutineCardProps) {
  const initials = getRoutineInitials(routine.name);
  const exercises = routine.exercises ?? [];

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

        <span className="routine-card__chevron" aria-hidden="true">
          ›
        </span>
      </div>

      {exercises.length > 0 && (
        <div className="routine-card__exercises">
          {exercises.map((re) => {
            const thumbnail = getYouTubeThumbnail(re.exercise.videoUrl);
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
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
