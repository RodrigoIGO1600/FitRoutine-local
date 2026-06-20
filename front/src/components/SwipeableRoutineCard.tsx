import { useEffect, useRef, useState, type PointerEvent } from "react";
import type { Routine } from "../types/routine";
import { RoutineCard } from "./RoutineCard";

const DELETE_ACTION_WIDTH = 88;

type SwipeableRoutineCardProps = {
  routine: Routine;
  isRevealed: boolean;
  isDeleting: boolean;
  onReveal: () => void;
  onHide: () => void;
  onDelete: () => void;
  onOpen: () => void;
};

export function SwipeableRoutineCard({
  routine,
  isRevealed,
  isDeleting,
  onReveal,
  onHide,
  onDelete,
  onOpen,
}: SwipeableRoutineCardProps) {
  const [offset, setOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const startX = useRef(0);
  const startOffset = useRef(0);
  const offsetRef = useRef(0);
  const isDraggingRef = useRef(false);
  const didSwipeRef = useRef(false);

  useEffect(() => {
    const nextOffset = isRevealed ? -DELETE_ACTION_WIDTH : 0;
    offsetRef.current = nextOffset;
    setOffset(nextOffset);
  }, [isRevealed]);

  function updateOffset(nextOffset: number) {
    offsetRef.current = nextOffset;
    setOffset(nextOffset);
  }

  function snapOffset(currentOffset: number) {
    if (currentOffset <= -DELETE_ACTION_WIDTH / 2) {
      updateOffset(-DELETE_ACTION_WIDTH);
      onReveal();
      return;
    }

    updateOffset(0);
    onHide();
  }

  function handlePointerDown(event: PointerEvent<HTMLDivElement>) {
    if (isDeleting) {
      return;
    }

    startX.current = event.clientX;
    startOffset.current = offsetRef.current;
    didSwipeRef.current = false;
    isDraggingRef.current = true;
    setIsDragging(true);
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function handlePointerMove(event: PointerEvent<HTMLDivElement>) {
    if (!isDraggingRef.current) {
      return;
    }

    const deltaX = event.clientX - startX.current;

    if (Math.abs(deltaX) > 8) {
      didSwipeRef.current = true;
    }

    const nextOffset = Math.min(
      0,
      Math.max(-DELETE_ACTION_WIDTH, startOffset.current + deltaX)
    );

    updateOffset(nextOffset);
  }

  function finishDrag(event: PointerEvent<HTMLDivElement>) {
    if (!isDraggingRef.current) {
      return;
    }

    isDraggingRef.current = false;
    setIsDragging(false);

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }

    const wasTap =
      !didSwipeRef.current && Math.abs(offsetRef.current) < 5 && !isRevealed;

    snapOffset(offsetRef.current);

    if (wasTap) {
      onOpen();
    }
  }

  return (
    <div className="swipe-row">
      <div className="swipe-row__actions" aria-hidden={!isRevealed}>
        <button
          type="button"
          className="swipe-row__delete"
          onClick={onDelete}
          disabled={isDeleting}
          aria-label={`Borrar rutina ${routine.name}`}
        >
          {isDeleting ? "..." : "Borrar"}
        </button>
      </div>

      <div
        className={`swipe-row__content${isDragging ? " swipe-row__content--dragging" : ""}`}
        style={{ transform: `translateX(${offset}px)` }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={finishDrag}
        onPointerCancel={finishDrag}
      >
        <RoutineCard routine={routine} />
      </div>
    </div>
  );
}
