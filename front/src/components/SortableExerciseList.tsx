import { useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import { flushSync } from "react-dom";
import { RoutineExerciseRow } from "./RoutineExerciseRow";
import type { RoutineExercise } from "../types/routine";
import { applyExerciseOrder, reorderArray } from "../utils/reorder";

const FLIP_DURATION_MS = 220;
const FLIP_EASING = "cubic-bezier(0.2, 0, 0, 1)";

type SortableExerciseListProps = {
  exercises: RoutineExercise[];
  onReorder: (exercises: RoutineExercise[]) => void;
  onRemove: (exerciseRowId: string) => void;
  onChangeRest: (
    exerciseRowId: string,
    field: "restSeconds" | "restBetweenSeconds",
    value: number
  ) => void;
};

type DragState = {
  pointerId: number;
  draggedId: string;
  grabOffset: number;
  offsetY: number;
  phase: "dragging" | "settling";
};

export function SortableExerciseList({
  exercises,
  onReorder,
  onRemove,
  onChangeRest,
}: SortableExerciseListProps) {
  const [dragState, setDragState] = useState<DragState | null>(null);
  const itemRefs = useRef<(HTMLLIElement | null)[]>([]);
  const dragStateRef = useRef<DragState | null>(null);
  // Fixed Y position (viewport top) of each slot, captured when the drag starts.
  // Slots never move during a drag, only the items occupying them do, so these
  // stay accurate and are immune to in-flight FLIP animations.
  const slotTopsRef = useRef<number[]>([]);

  dragStateRef.current = dragState;

  function animateNeighbors(
    previousOrder: RoutineExercise[],
    nextOrder: RoutineExercise[],
    draggedId: string
  ) {
    const slotTops = slotTopsRef.current;

    nextOrder.forEach((exercise, newIndex) => {
      if (exercise.id === draggedId) {
        return;
      }

      const oldIndex = previousOrder.findIndex((e) => e.id === exercise.id);

      if (oldIndex === -1) {
        return;
      }

      const deltaY = slotTops[oldIndex] - slotTops[newIndex];

      if (Math.abs(deltaY) < 1) {
        return;
      }

      const element = itemRefs.current[newIndex];

      if (!element) {
        return;
      }

      element.style.transition = "none";
      element.style.transform = `translateY(${deltaY}px)`;

      requestAnimationFrame(() => {
        element.style.transition = `transform ${FLIP_DURATION_MS}ms ${FLIP_EASING}`;
        element.style.transform = "";
      });
    });
  }

  function handleDragStart(
    index: number,
    event: ReactPointerEvent<HTMLButtonElement>
  ) {
    const draggedId = exercises[index]?.id;

    if (!draggedId) {
      return;
    }

    event.preventDefault();

    const slotTops = exercises.map(
      (_, slotIndex) =>
        itemRefs.current[slotIndex]?.getBoundingClientRect().top ?? 0
    );
    slotTopsRef.current = slotTops;

    const nextDragState: DragState = {
      pointerId: event.pointerId,
      draggedId,
      grabOffset: event.clientY - slotTops[index],
      offsetY: 0,
      phase: "dragging",
    };

    dragStateRef.current = nextDragState;
    setDragState(nextDragState);
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function handleDragMove(event: ReactPointerEvent<HTMLButtonElement>) {
    const currentDrag = dragStateRef.current;

    if (!currentDrag || currentDrag.pointerId !== event.pointerId) {
      return;
    }

    const slotTops = slotTopsRef.current;
    let dragIndex = exercises.findIndex((e) => e.id === currentDrag.draggedId);

    if (dragIndex === -1) {
      return;
    }

    // Where the top of the dragged card should sit so it stays under the finger.
    const desiredTop = event.clientY - currentDrag.grabOffset;

    let targetIndex = dragIndex;
    const belowIndex = dragIndex + 1;
    const aboveIndex = dragIndex - 1;

    if (
      belowIndex < slotTops.length &&
      desiredTop > (slotTops[dragIndex] + slotTops[belowIndex]) / 2
    ) {
      targetIndex = belowIndex;
    } else if (
      aboveIndex >= 0 &&
      desiredTop < (slotTops[dragIndex] + slotTops[aboveIndex]) / 2
    ) {
      targetIndex = aboveIndex;
    }

    if (targetIndex !== dragIndex) {
      const previousOrder = exercises;
      const reordered = applyExerciseOrder(
        reorderArray(exercises, dragIndex, targetIndex)
      );

      flushSync(() => {
        onReorder(reordered);
      });

      animateNeighbors(previousOrder, reordered, currentDrag.draggedId);
      dragIndex = targetIndex;
    }

    const offsetY = desiredTop - slotTops[dragIndex];

    // Apply the transform imperatively first to avoid a one-frame flash where the
    // dragged card sits in its new slot with the previous offset.
    const draggedElement = itemRefs.current[dragIndex];
    if (draggedElement) {
      draggedElement.style.transform = `translateY(${offsetY}px) scale(1.02)`;
    }

    const nextDragState: DragState = {
      ...currentDrag,
      offsetY,
      phase: "dragging",
    };

    dragStateRef.current = nextDragState;
    setDragState(nextDragState);
  }

  function finishDrag(event: ReactPointerEvent<HTMLButtonElement>) {
    const currentDrag = dragStateRef.current;

    if (!currentDrag || currentDrag.pointerId !== event.pointerId) {
      return;
    }

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }

    const settlingState: DragState = {
      ...currentDrag,
      offsetY: 0,
      phase: "settling",
    };

    dragStateRef.current = settlingState;
    setDragState(settlingState);

    window.setTimeout(() => {
      dragStateRef.current = null;
      setDragState(null);
    }, FLIP_DURATION_MS);
  }

  return (
    <ul
      className={`sortable-exercise-list${
        dragState ? " sortable-exercise-list--dragging" : ""
      }`}
    >
      {exercises.map((routineExercise, index) => {
        const isActive = routineExercise.id === dragState?.draggedId;
        const isDragging = isActive && dragState?.phase === "dragging";

        return (
          <li
            key={routineExercise.id}
            ref={(element) => {
              itemRefs.current[index] = element;
            }}
            className={`sortable-exercise-list__item${
              isActive ? " sortable-exercise-list__item--active" : ""
            }${isDragging ? " sortable-exercise-list__item--dragging" : ""}`}
            style={
              isActive && dragState
                ? {
                    transform: `translateY(${dragState.offsetY}px) scale(1.02)`,
                    zIndex: 2,
                  }
                : undefined
            }
          >
            <button
              type="button"
              className="sortable-exercise-list__handle"
              aria-label={`Reordenar ${routineExercise.exercise.name}`}
              onPointerDown={(event) => handleDragStart(index, event)}
              onPointerMove={handleDragMove}
              onPointerUp={finishDrag}
              onPointerCancel={finishDrag}
            >
              <span aria-hidden="true">⠿</span>
            </button>

            <RoutineExerciseRow
              routineExercise={routineExercise}
              onRemove={() => onRemove(routineExercise.id)}
              onChangeRest={(field, value) =>
                onChangeRest(routineExercise.id, field, value)
              }
            />
          </li>
        );
      })}
    </ul>
  );
}
