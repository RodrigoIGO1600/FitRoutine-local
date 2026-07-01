import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Icon } from "@iconify/react";
import {
  addExerciseToRoutine,
  deleteRoutineExercise,
  updateRoutineExercise,
  type UpdateRoutineExerciseInput,
} from "../api/routineExerciseApi";
import { getRoutineById, updateRoutine } from "../api/routineApi";
import { AddExerciseSheet } from "../components/AddExerciseSheet";
import { ExerciseEditModal } from "../components/ExerciseEditModal";
import { SortableExerciseList } from "../components/SortableExerciseList";
import type { Exercise } from "../types/exercise";
import type { RoutineDetail, RoutineExercise } from "../types/routine";
import { createTempId, isTempId } from "../utils/id";
import { applyExerciseOrder } from "../utils/reorder";
import { useTranslation } from "../context/LanguageContext";
import heroIcon from "../assets/hero.png";
import "./RoutineDetailPage.css";

const DEFAULT_SETS = 3;
const DEFAULT_REPS = 10;
const DEFAULT_DURATION_SECONDS = 30;
const DEFAULT_REST_SECONDS = 90;
const DEFAULT_REST_BETWEEN_SECONDS = 60;

type SavedRestFields = {
  sets: number;
  reps: number;
  durationSeconds: number;
  restSeconds: number;
  restBetweenSeconds: number;
};

export function RoutineDetailPage() {
  const { id: routineId } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [routine, setRoutine] = useState<RoutineDetail | null>(null);
  const [exercises, setExercises] = useState<RoutineExercise[]>([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [editingExercise, setEditingExercise] = useState<RoutineExercise | null>(null);

  const savedExerciseIdsRef = useRef<Set<string>>(new Set());
  const savedOrderIdsRef = useRef<string[]>([]);
  const savedRestFieldsRef = useRef<Map<string, SavedRestFields>>(new Map());

  const isDirty = useMemo(() => {
    if (!routine) return false;

    const savedDescription = routine.description ?? "";
    const metaChanged = name !== routine.name || description !== savedDescription;

    const currentIds = new Set(exercises.map((e) => e.id));
    const hasNewExercises = exercises.some((e) => isTempId(e.id));
    const hasDeletedExercises = [...savedExerciseIdsRef.current].some(
      (id) => !currentIds.has(id)
    );
    const orderChanged =
      exercises.map((e) => e.id).join("|") !==
      savedOrderIdsRef.current.join("|");

    const restChanged = exercises.some((e) => {
      if (isTempId(e.id)) return false;
      const saved = savedRestFieldsRef.current.get(e.id);
      if (!saved) return false;
      return (
        saved.sets !== e.sets ||
        saved.reps !== e.reps ||
        saved.durationSeconds !== e.durationSeconds ||
        saved.restSeconds !== e.restSeconds ||
        saved.restBetweenSeconds !== e.restBetweenSeconds
      );
    });

    return (
      metaChanged ||
      hasNewExercises ||
      hasDeletedExercises ||
      orderChanged ||
      restChanged
    );
  }, [routine, name, description, exercises]);

  const loadRoutine = useCallback(async () => {
    if (!routineId) {
      setError(t("invalidRoutine"));
      setIsLoading(false);
      return;
    }

    setError(null);

    try {
      const result = await getRoutineById(routineId);
      const sortedExercises = [...result.exercises].sort(
        (a, b) => a.order - b.order
      );

      setRoutine(result);
      setExercises(sortedExercises);
      setName(result.name);
      setDescription(result.description ?? "");
      savedExerciseIdsRef.current = new Set(sortedExercises.map((e) => e.id));
      savedOrderIdsRef.current = sortedExercises.map((e) => e.id);
      savedRestFieldsRef.current = new Map(
        sortedExercises.map((e) => [
          e.id,
          {
            sets: e.sets,
            reps: e.reps,
            durationSeconds: e.durationSeconds,
            restSeconds: e.restSeconds,
            restBetweenSeconds: e.restBetweenSeconds,
          },
        ])
      );
    } catch {
      setError(t("errorLoadRoutine"));
    } finally {
      setIsLoading(false);
    }
  }, [routineId, t]);

  useEffect(() => {
    loadRoutine();
  }, [loadRoutine]);

  function handleDiscard() {
    if (!routine) {
      navigate(`/routines/${routineId}`);
      return;
    }

    setName(routine.name);
    setDescription(routine.description ?? "");
    navigate(`/routines/${routineId}`);
  }

  function handleAddExercise(exercise: Exercise) {
    if (!routineId) {
      return;
    }

    const newRoutineExercise: RoutineExercise = {
      id: createTempId(),
      routineId,
      exerciseId: exercise.id,
      sets: DEFAULT_SETS,
      reps: exercise.isTimed ? 1 : DEFAULT_REPS,
      repsList: null,
      durationSeconds: exercise.isTimed ? DEFAULT_DURATION_SECONDS : 0,
      weight: null,
      restSeconds: DEFAULT_REST_SECONDS,
      restBetweenSeconds: DEFAULT_REST_BETWEEN_SECONDS,
      order: exercises.length + 1,
      notes: null,
      exercise,
    };

    setExercises((current) =>
      applyExerciseOrder([...current, newRoutineExercise])
    );
  }

  function handleReorder(reorderedExercises: RoutineExercise[]) {
    setExercises(reorderedExercises);
  }

  function handleChangeRest(
    exerciseRowId: string,
    field: "restSeconds" | "restBetweenSeconds",
    value: number
  ) {
    setExercises((current) =>
      current.map((exercise) =>
        exercise.id === exerciseRowId
          ? { ...exercise, [field]: value }
          : exercise
      )
    );
  }

  function handleChangeSets(exerciseRowId: string, value: number) {
    setExercises((current) =>
      current.map((exercise) =>
        exercise.id === exerciseRowId
          ? { ...exercise, sets: value }
          : exercise
      )
    );
  }

  function handleChangeDuration(exerciseRowId: string, value: number) {
    setExercises((current) =>
      current.map((exercise) =>
        exercise.id === exerciseRowId
          ? { ...exercise, durationSeconds: value }
          : exercise
      )
    );
  }

  function handleRemoveExercise(exerciseRowId: string) {
    setExercises((current) =>
      applyExerciseOrder(current.filter((e) => e.id !== exerciseRowId))
    );
  }

  function handleDeselectExercise(exercise: Exercise) {
    setExercises((current) =>
      applyExerciseOrder(
        current.filter((e) => e.exerciseId !== exercise.id)
      )
    );
  }

  async function handleSave() {
    if (!routine || !isDirty) return;

    const trimmedName = name.trim();
    if (!trimmedName) {
      setError(t("routineNameRequired"));
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      const savedDescription = routine.description ?? "";
      const metaChanged =
        trimmedName !== routine.name ||
        description.trim() !== savedDescription;

      if (metaChanged) {
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
      }

      const orderedExercises = applyExerciseOrder(exercises);
      const currentIds = new Set(orderedExercises.map((e) => e.id));

      const toDelete = [...savedExerciseIdsRef.current].filter(
        (savedId) => !currentIds.has(savedId)
      );
      for (const reId of toDelete) {
        if (!isTempId(reId)) {
          await deleteRoutineExercise(reId);
        }
      }

      const toAdd = orderedExercises.filter((e) => isTempId(e.id));
      const addedExercises: RoutineExercise[] = [];
      for (const pending of toAdd) {
        const saved = await addExerciseToRoutine(routine.id, {
          exerciseId: pending.exerciseId,
          sets: pending.sets,
          reps: pending.reps,
          durationSeconds: pending.durationSeconds,
          weight: pending.weight,
          restSeconds: pending.restSeconds,
          restBetweenSeconds: pending.restBetweenSeconds,
          order: pending.order,
        });
        addedExercises.push(saved);
      }

      let resolvedExercises = orderedExercises.map((exercise) => {
        if (!isTempId(exercise.id)) {
          return exercise;
        }

        const pendingIndex = toAdd.findIndex((item) => item.id === exercise.id);
        return addedExercises[pendingIndex] ?? exercise;
      });

      for (const exercise of resolvedExercises) {
        if (isTempId(exercise.id)) {
          continue;
        }

        const patch: UpdateRoutineExerciseInput = {};

        const originalIndex = savedOrderIdsRef.current.indexOf(exercise.id);
        if (originalIndex !== -1 && originalIndex + 1 !== exercise.order) {
          patch.order = exercise.order;
        }

        const savedFields = savedRestFieldsRef.current.get(exercise.id);
        if (savedFields) {
          if (savedFields.restSeconds !== exercise.restSeconds) {
            patch.restSeconds = exercise.restSeconds;
          }
          if (savedFields.restBetweenSeconds !== exercise.restBetweenSeconds) {
            patch.restBetweenSeconds = exercise.restBetweenSeconds;
          }
          if (savedFields.durationSeconds !== exercise.durationSeconds) {
            patch.durationSeconds = exercise.durationSeconds;
          }
          if (savedFields.sets !== exercise.sets) {
            patch.sets = exercise.sets;
          }
        }

        if (Object.keys(patch).length > 0) {
          const updated = await updateRoutineExercise(exercise.id, patch);
          resolvedExercises = resolvedExercises.map((item) =>
            item.id === updated.id ? updated : item
          );
        }
      }

      setExercises(resolvedExercises);
      savedExerciseIdsRef.current = new Set(
        resolvedExercises.map((e) => e.id)
      );
      savedOrderIdsRef.current = resolvedExercises.map((e) => e.id);
      savedRestFieldsRef.current = new Map(
        resolvedExercises.map((e) => [
          e.id,
          {
            sets: e.sets,
            reps: e.reps,
            durationSeconds: e.durationSeconds,
            restSeconds: e.restSeconds,
            restBetweenSeconds: e.restBetweenSeconds,
          },
        ])
      );
    } catch {
      setError(t("errorSaveChanges"));
    } finally {
      setIsSaving(false);
      navigate(`/routines/${routine.id}`);
    }
  }

  if (isLoading) {
    return (
      <div className="routine-detail">
        <p className="routine-detail__loading">{t("loadingRoutine")}</p>
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
            {t("back")}
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
          {t("discard")}
        </button>

        <p className="routine-detail__toolbar-title">{t("routine")}</p>

        <button
          type="button"
          className={`routine-detail__action routine-detail__action--save${
            isDirty ? " routine-detail__action--save-active" : ""
          }`}
          onClick={handleSave}
          disabled={!isDirty || isSaving}
        >
          {isSaving ? "..." : t("save")}
        </button>
      </header>

      <section className="routine-detail__meta">
        <label className="routine-detail__field">
          <input
            className="routine-detail__input routine-detail__input--title"
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder={t("routineNameLabel")}
            aria-label={t("routineNameLabel")}
          />
        </label>

        <label className="routine-detail__field">
          <input
            className="routine-detail__input routine-detail__input--subtitle"
            type="text"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder={t("routineDescLabel")}
            aria-label={t("routineDescLabel")}
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
            <p>{t("emptyRoutine")}</p>
          </div>
        ) : (
          <SortableExerciseList
            exercises={exercises}
            onReorder={handleReorder}
            onRemove={handleRemoveExercise}
            onChangeSets={handleChangeSets}
            onChangeRest={handleChangeRest}
            onChangeDuration={handleChangeDuration}
            onEdit={setEditingExercise}
          />
        )}
      </main>

      <footer className="routine-detail__dock">
        <button
          type="button"
          className="routine-detail__dock-action"
          onClick={() => setIsSheetOpen(true)}
        >
          <Icon
            icon="solar:add-circle-linear"
            className="routine-detail__dock-icon"
            aria-hidden="true"
          />
          <span>{t("addExercise")}</span>
        </button>
      </footer>

      <AddExerciseSheet
        isOpen={isSheetOpen}
        isSubmitting={false}
        existingExerciseIds={exercises.map((item) => item.exerciseId)}
        onClose={() => setIsSheetOpen(false)}
        onSelect={handleAddExercise}
        onDeselect={handleDeselectExercise}
      />

      <ExerciseEditModal
        routineExercise={editingExercise}
        onClose={() => setEditingExercise(null)}
        onChangeSets={handleChangeSets}
        onChangeRest={handleChangeRest}
        onChangeDuration={handleChangeDuration}
        onRemove={handleRemoveExercise}
      />
    </div>
  );
}
