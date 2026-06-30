import { useState, useEffect, useRef } from "react";
import { Icon } from "@iconify/react";
import { RoutineExerciseRow } from "./RoutineExerciseRow";
import type { RoutineExercise } from "../types/routine";
import { applyExerciseOrder, reorderArray } from "../utils/reorder";
import { getYouTubeThumbnail } from "../utils/youtube";
import { getMuscleGroupImage } from "../utils/muscleGroupImage";

const REORDER_ANIMATION_MS = 250;

type SortableExerciseListProps = {
  exercises: RoutineExercise[];
  onReorder: (exercises: RoutineExercise[]) => void;
  onRemove: (exerciseRowId: string) => void;
  onChangeSets: (exerciseRowId: string, value: number) => void;
  onChangeRest: (
    exerciseRowId: string,
    field: "restSeconds" | "restBetweenSeconds",
    value: number
  ) => void;
  onEdit?: (exercise: RoutineExercise) => void;
};

export function SortableExerciseList({
  exercises,
  onReorder,
  onRemove,
  onChangeSets,
  onChangeRest,
  onEdit,
}: SortableExerciseListProps) {
  const [movedIds, setMovedIds] = useState<Set<string>>(new Set());
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  function markMoved(ids: string[]) {
    setMovedIds(new Set(ids));
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setMovedIds(new Set()), REORDER_ANIMATION_MS);
  }

  function handleMoveUp(index: number) {
    if (index === 0) return;
    const current = exercises[index];
    const displaced = exercises[index - 1];
    const reordered = applyExerciseOrder(reorderArray(exercises, index, index - 1));
    onReorder(reordered);
    markMoved([current.id, displaced.id]);
  }

  function handleMoveDown(index: number) {
    if (index === exercises.length - 1) return;
    const current = exercises[index];
    const displaced = exercises[index + 1];
    const reordered = applyExerciseOrder(reorderArray(exercises, index, index + 1));
    onReorder(reordered);
    markMoved([current.id, displaced.id]);
  }

  function getAnimationClass(id: string): string {
    if (!movedIds.has(id)) return "";
    return "sortable-exercise-list__item--moved";
  }

  return (
    <ul className="sortable-exercise-list">
      {exercises.map((routineExercise, index) => {
        const thumbnail = getYouTubeThumbnail(routineExercise.exercise.videoUrl);
        const muscleImage = getMuscleGroupImage(routineExercise.exercise.muscleGroup);

        return (
          <li
            key={routineExercise.id}
            className={`sortable-exercise-list__item ${getAnimationClass(routineExercise.id)}`}
          >
            {/* Mobile view */}
            <div className="sortable-exercise-list__mobile">
              <div className="sortable-exercise-list__mobile-arrows">
                <button
                  type="button"
                  className="sortable-exercise-list__arrow"
                  onClick={() => handleMoveUp(index)}
                  disabled={index === 0}
                  aria-label="Mover arriba"
                >
                  <Icon icon="solar:alt-arrow-up-linear" width={16} />
                </button>
                <button
                  type="button"
                  className="sortable-exercise-list__arrow"
                  onClick={() => handleMoveDown(index)}
                  disabled={index === exercises.length - 1}
                  aria-label="Mover abajo"
                >
                  <Icon icon="solar:alt-arrow-down-linear" width={16} />
                </button>
              </div>
              <RoutineExerciseRow
                routineExercise={routineExercise}
                onRemove={() => onRemove(routineExercise.id)}
                onChangeSets={(value) => onChangeSets(routineExercise.id, value)}
                onChangeRest={(field, value) => onChangeRest(routineExercise.id, field, value)}
              />
            </div>

            {/* Desktop card view */}
            <button
              type="button"
              className="sortable-exercise-list__desktop-card"
              onClick={() => onEdit?.(routineExercise)}
            >
              <span className="sortable-exercise-list__card-order">
                {routineExercise.order}
              </span>
              {thumbnail ? (
                <img src={thumbnail} alt="" className="sortable-exercise-list__card-thumb" />
              ) : (
                <div className="sortable-exercise-list__card-thumb sortable-exercise-list__card-thumb--empty">
                  {routineExercise.exercise.name.charAt(0)}
                </div>
              )}
              <div className="sortable-exercise-list__card-info">
                <p className="sortable-exercise-list__card-name">
                  {routineExercise.exercise.name}
                </p>
                <p className="sortable-exercise-list__card-meta">
                  {routineExercise.sets} x {routineExercise.reps} reps
                </p>
              </div>
              {muscleImage && (
                <img src={muscleImage} alt="" className="sortable-exercise-list__card-muscle" />
              )}
              <div className="sortable-exercise-list__card-arrows" onClick={(e) => e.stopPropagation()}>
                <button
                  type="button"
                  className="sortable-exercise-list__arrow"
                  onClick={() => handleMoveUp(index)}
                  disabled={index === 0}
                  aria-label="Mover izquierda"
                >
                  <Icon icon="solar:alt-arrow-left-linear" width={16} />
                </button>
                <button
                  type="button"
                  className="sortable-exercise-list__arrow"
                  onClick={() => handleMoveDown(index)}
                  disabled={index === exercises.length - 1}
                  aria-label="Mover derecha"
                >
                  <Icon icon="solar:alt-arrow-right-linear" width={16} />
                </button>
              </div>
            </button>
          </li>
        );
      })}
    </ul>
  );
}
