import { useEffect, useState } from "react";
import { getExercises } from "../api/exerciseApi";
import type { Exercise } from "../types/exercise";

type AddExerciseSheetProps = {
  isOpen: boolean;
  isSubmitting: boolean;
  existingExerciseIds: number[];
  onClose: () => void;
  onSelect: (exercise: Exercise) => Promise<void>;
};

export function AddExerciseSheet({
  isOpen,
  isSubmitting,
  existingExerciseIds,
  onClose,
  onSelect,
}: AddExerciseSheetProps) {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (!isOpen) {
      return;
    }

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

  if (!isOpen) {
    return null;
  }

  const filteredExercises = exercises.filter((exercise) => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return true;
    }

    return (
      exercise.name.toLowerCase().includes(query) ||
      exercise.muscleGroup.toLowerCase().includes(query)
    );
  });

  function handleClose() {
    if (isSubmitting) {
      return;
    }

    setSearch("");
    onClose();
  }

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
          <h2 id="add-exercise-title">Añadir ejercicio</h2>
          <p>Elige un ejercicio de tu biblioteca.</p>
        </header>

        <label className="field">
          <span className="field__label">Buscar</span>
          <input
            className="field__input"
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Nombre o grupo muscular"
            disabled={isSubmitting}
          />
        </label>

        <div className="exercise-picker">
          {isLoading && <p className="exercise-picker__state">Cargando...</p>}

          {!isLoading && error && (
            <p className="exercise-picker__state exercise-picker__state--error">
              {error}
            </p>
          )}

          {!isLoading && !error && filteredExercises.length === 0 && (
            <p className="exercise-picker__state">
              No hay ejercicios que coincidan.
            </p>
          )}

          {!isLoading && !error && filteredExercises.length > 0 && (
            <ul className="exercise-picker__list">
              {filteredExercises.map((exercise) => {
                const isAdded = existingExerciseIds.includes(exercise.id);

                return (
                  <li key={exercise.id}>
                    <button
                      type="button"
                      className="exercise-picker__item"
                      disabled={isSubmitting || isAdded}
                      onClick={() => onSelect(exercise)}
                    >
                      <span className="exercise-picker__name">
                        {exercise.name}
                      </span>
                      <span className="exercise-picker__meta">
                        {exercise.muscleGroup}
                        {isAdded ? " · Ya añadido" : ""}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
