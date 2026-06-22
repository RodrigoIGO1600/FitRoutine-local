import { useEffect, useMemo, useState } from "react";
import { Icon } from "@iconify/react";
import { getExercises } from "../api/exerciseApi";
import { getMuscleGroupImage } from "../utils/muscleGroupImage";
import { getYouTubeThumbnail } from "../utils/youtube";
import type { Exercise } from "../types/exercise";

type AddExerciseSheetProps = {
  isOpen: boolean;
  isSubmitting: boolean;
  existingExerciseIds: string[];
  onClose: () => void;
  onSelect: (exercise: Exercise) => void;
  onDeselect: (exercise: Exercise) => void;
};

const MUSCLE_GROUP_LABELS: Record<string, string> = {
  shoulders: "Hombros",
  chest: "Pecho",
  biceps: "Bíceps",
  triceps: "Tríceps",
  back: "Espalda",
  forearm: "Antebrazo",
  traps: "Trapecios",
};

function getMuscleGroupLabel(key: string): string {
  return MUSCLE_GROUP_LABELS[key] ?? key;
}

export function AddExerciseSheet({
  isOpen,
  isSubmitting,
  existingExerciseIds,
  onClose,
  onSelect,
  onDeselect,
}: AddExerciseSheetProps) {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    async function loadExercises() {
      setIsLoading(true);
      setError(null);

      try {
        const result = await getExercises();
        setExercises(result);
      } catch {
        setError("No se pudieron cargar los ejercicios");
      } finally {
        setIsLoading(false);
      }
    }

    loadExercises();
  }, [isOpen]);

  const muscleGroups = useMemo(() => {
    const groups = new Map<string, number>();

    for (const ex of exercises) {
      const count = groups.get(ex.muscleGroup) ?? 0;
      groups.set(ex.muscleGroup, count + 1);
    }

    return [...groups.entries()].map(([key, count]) => ({ key, count }));
  }, [exercises]);

  const groupExercises = useMemo(() => {
    if (!selectedGroup) return [];
    return exercises.filter((ex) => ex.muscleGroup === selectedGroup);
  }, [exercises, selectedGroup]);

  function handleClose() {
    if (isSubmitting) return;
    setSelectedGroup(null);
    onClose();
  }

  function handleBack() {
    setSelectedGroup(null);
  }

  if (!isOpen) return null;

  return (
    <div className="sheet-overlay" onClick={handleClose} role="presentation">
      <div
        className="sheet sheet--tall"
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-exercise-title"
      >
        <div className="sheet__handle" aria-hidden="true" />

        <header className="sheet__header">
          {selectedGroup ? (
            <>
              <button
                type="button"
                className="exercise-picker__back-btn"
                onClick={handleBack}
              >
                ← Grupos
              </button>
              <h2 id="add-exercise-title">
                {getMuscleGroupLabel(selectedGroup)}
              </h2>
            </>
          ) : (
            <>
              <h2 id="add-exercise-title">Añadir ejercicio</h2>
              <p>Selecciona un grupo muscular.</p>
            </>
          )}
        </header>

        <div className="exercise-picker">
          {isLoading && <p className="exercise-picker__state">Cargando...</p>}

          {!isLoading && error && (
            <p className="exercise-picker__state exercise-picker__state--error">
              {error}
            </p>
          )}

          {!isLoading && !error && !selectedGroup && (
            <ul className="exercise-picker__list">
              {muscleGroups.map(({ key, count }) => {
                const groupImg = getMuscleGroupImage(key);

                return (
                  <li key={key}>
                    <button
                      type="button"
                      className="exercise-picker__group-item"
                      onClick={() => setSelectedGroup(key)}
                    >
                      {groupImg && (
                        <img
                          src={groupImg}
                          alt=""
                          className="exercise-picker__group-img"
                        />
                      )}
                      <span className="exercise-picker__group-info">
                        <span className="exercise-picker__group-name">
                          {getMuscleGroupLabel(key)}
                        </span>
                        <span className="exercise-picker__group-count">
                          {count} ejercicios
                        </span>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}

          {!isLoading && !error && selectedGroup && (
            <>
              {groupExercises.length === 0 ? (
                <p className="exercise-picker__state">
                  No hay ejercicios en este grupo.
                </p>
              ) : (
                <ul className="exercise-picker__list">
                  {groupExercises.map((exercise) => {
                    const isAdded = existingExerciseIds.includes(exercise.id);
                    const thumbnail = getYouTubeThumbnail(exercise.videoUrl);

                    return (
                      <li key={exercise.id}>
                        <button
                          type="button"
                          className={`exercise-picker__item${
                            isAdded ? " exercise-picker__item--added" : ""
                          }`}
                          disabled={isSubmitting}
                          onClick={() =>
                            isAdded ? onDeselect(exercise) : onSelect(exercise)
                          }
                          aria-label={
                            isAdded
                              ? `Quitar ${exercise.name}`
                              : `Añadir ${exercise.name}`
                          }
                          aria-pressed={isAdded}
                        >
                          {thumbnail ? (
                            <img
                              src={thumbnail}
                              alt=""
                              className="exercise-picker__thumb"
                            />
                          ) : (
                            <div className="exercise-picker__thumb exercise-picker__thumb--empty" />
                          )}
                          <span className="exercise-picker__item-info">
                            <span className="exercise-picker__name">
                              {exercise.name}
                            </span>
                            <span className="exercise-picker__meta">
                              {exercise.equipment}
                            </span>
                          </span>
                          {isAdded && (
                            <Icon
                              icon="mdi:check-circle"
                              className="exercise-picker__check"
                              aria-hidden="true"
                            />
                          )}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
