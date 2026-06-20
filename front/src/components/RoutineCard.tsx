import type { Routine } from "../types/routine";
import { getRoutineInitials } from "../utils/routine";

type RoutineCardProps = {
  routine: Routine;
  onClick?: () => void;
};

export function RoutineCard({ routine, onClick }: RoutineCardProps) {
  const initials = getRoutineInitials(routine.name);

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
  );
}
