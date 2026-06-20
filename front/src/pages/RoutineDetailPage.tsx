import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { addExerciseToRoutine } from "../api/routineExerciseApi";
import { getRoutineById, updateRoutine } from "../api/routineApi";
import { AddExerciseSheet } from "../components/AddExerciseSheet";
import { RoutineExerciseRow } from "../components/RoutineExerciseRow";
import type { Exercise } from "../types/exercise";
import type { RoutineDetail, RoutineExercise } from "../types/routine";
import heroIcon from "../assets/hero.png";
import "./RoutineDetailPage.css";

const DEFAULT_SETS = 3;
const DEFAULT_REPS = 10;
const DEFAULT_REST_SECONDS = 90;

export function RoutineDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const routineId = Number(id);

  const [routine, setRoutine] = useState<RoutineDetail | null>(null);
  const [exercises, setExercises] = useState<RoutineExercise[]>([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isAddingExercise, setIsAddingExercise] = useState(false);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const isDirty = useMemo(() => {
    if (!routine) {
      return false;
    }

    const savedDescription = routine.description ?? "";

    return name !== routine.name || description !== savedDescription;
  }, [routine, name, description]);

  const loadRoutine = useCallback(async () => {
    if (Number.isNaN(routineId)) {
      setError("Rutina no válida");
      setIsLoading(false);
      return;
    }

    setError(null);

    try {
      const result = await getRoutineById(routineId);
      setRoutine(result);
      setExercises(result.exercises);
      setName(result.name);
      setDescription(result.description ?? "");
    } catch {
      setError("No se pudo cargar la rutina");
    } finally {
      setIsLoading(false);
    }
  }, [routineId]);

  useEffect(() => {
    loadRoutine();
  }, [loadRoutine]);

  function handleDiscard() {
    if (!routine) {
      navigate("/");
      return;
    }

    setName(routine.name);
    setDescription(routine.description ?? "");
    navigate("/");
  }

  async function handleSave() {
    if (!routine || !isDirty) {
      return;
    }

    const trimmedName = name.trim();

    if (!trimmedName) {
      setError("El nombre es obligatorio");
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      const updated = await updateRoutine(routine.id, {
        name: trimmedName,
        description: description.trim() || null,
      });

      setRoutine((current) =>
        current
          ? {
              ...current,
              name: updated.name,
              description: updated.description,
              updatedAt: updated.updatedAt,
            }
          : current
      );
      setName(updated.name);
      setDescription(updated.description ?? "");
    } catch {
      setError("No se pudo guardar la rutina");
    } finally {
      setIsSaving(false);
    }
  }

  async function handleAddExercise(exercise: Exercise) {
    if (!routine) {
      return;
    }

    setIsAddingExercise(true);
    setError(null);

    try {
      const routineExercise = await addExerciseToRoutine(routine.id, {
        exerciseId: exercise.id,
        sets: DEFAULT_SETS,
        reps: DEFAULT_REPS,
        restSeconds: DEFAULT_REST_SECONDS,
        order: exercises.length + 1,
      });

      setExercises((current) =>
        [...current, routineExercise].sort((a, b) => a.order - b.order)
      );
      setIsSheetOpen(false);
    } catch {
      setError("No se pudo añadir el ejercicio");
    } finally {
      setIsAddingExercise(false);
    }
  }

  if (isLoading) {
    return (
      <div className="routine-detail">
        <p className="routine-detail__loading">Cargando rutina...</p>
      </div>
    );
  }

  if (error && !routine) {
    return (
      <div className="routine-detail">
        <div className="routine-detail__state routine-detail__state--error">
          <p>{error}</p>
          <button
            type="button"
            className="btn btn--ghost"
            onClick={() => navigate("/")}
          >
            Volver
          </button>
        </div>
      </div>
    );
  }

  if (!routine) {
    return null;
  }

  return (
    <div className="routine-detail">
      <header className="routine-detail__toolbar">
        <button
          type="button"
          className="routine-detail__action"
          onClick={handleDiscard}
          disabled={isSaving}
        >
          Descartar
        </button>

        <p className="routine-detail__toolbar-title">Rutina</p>

        <button
          type="button"
          className={`routine-detail__action routine-detail__action--save${
            isDirty ? " routine-detail__action--save-active" : ""
          }`}
          onClick={handleSave}
          disabled={!isDirty || isSaving}
        >
          {isSaving ? "..." : "Guardar"}
        </button>
      </header>

      <section className="routine-detail__meta">
        <label className="routine-detail__field">
          <input
            className="routine-detail__input routine-detail__input--title"
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Nombre de la rutina"
            aria-label="Nombre de la rutina"
          />
        </label>

        <label className="routine-detail__field">
          <input
            className="routine-detail__input routine-detail__input--subtitle"
            type="text"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder="Descripción"
            aria-label="Descripción de la rutina"
          />
        </label>
      </section>

      {error && routine && (
        <p className="routine-detail__banner" role="alert">
          {error}
        </p>
      )}

      <main className="routine-detail__content">
        {exercises.length === 0 ? (
          <div className="routine-detail__empty">
            <img
              src={heroIcon}
              alt=""
              className="routine-detail__empty-icon"
              aria-hidden="true"
            />
            <p>Aún no hay ejercicios en esta rutina.</p>
          </div>
        ) : (
          <ul className="routine-detail__exercises">
            {exercises.map((routineExercise) => (
              <li key={routineExercise.id}>
                <RoutineExerciseRow routineExercise={routineExercise} />
              </li>
            ))}
          </ul>
        )}
      </main>

      <footer className="routine-detail__dock">
        <button
          type="button"
          className="routine-detail__dock-action"
          onClick={() => setIsSheetOpen(true)}
          disabled={isAddingExercise}
        >
          <span className="routine-detail__dock-icon" aria-hidden="true">
            +
          </span>
          <span>Añadir ejercicio</span>
        </button>
      </footer>

      <AddExerciseSheet
        isOpen={isSheetOpen}
        isSubmitting={isAddingExercise}
        existingExerciseIds={exercises.map((item) => item.exerciseId)}
        onClose={() => setIsSheetOpen(false)}
        onSelect={handleAddExercise}
      />
    </div>
  );
}
