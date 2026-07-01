import { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import type { RoutineExercise } from "../types/routine";
import { getYouTubeThumbnail } from "../utils/youtube";
import { getMuscleGroupImage } from "../utils/muscleGroupImage";
import { useTranslation } from "../context/LanguageContext";
import "./ExerciseEditModal.css";

const REST_STEP = 15;
const REST_MIN = 0;
const REST_MAX = 600;
const SETS_MIN = 1;
const SETS_MAX = 15;

type ExerciseEditModalProps = {
  routineExercise: RoutineExercise | null;
  onClose: () => void;
  onChangeSets: (exerciseRowId: string, value: number) => void;
  onChangeRest: (
    exerciseRowId: string,
    field: "restSeconds" | "restBetweenSeconds",
    value: number
  ) => void;
  onChangeDuration?: (exerciseRowId: string, value: number) => void;
  onRemove: (exerciseRowId: string) => void;
};

export function ExerciseEditModal({
  routineExercise,
  onClose,
  onChangeSets,
  onChangeRest,
  onChangeDuration,
  onRemove,
}: ExerciseEditModalProps) {
  const [sets, setSets] = useState(0);
  const [durationSeconds, setDurationSeconds] = useState(0);
  const [restSeconds, setRestSeconds] = useState(0);
  const [restBetweenSeconds, setRestBetweenSeconds] = useState(0);
  const { t } = useTranslation();

  useEffect(() => {
    if (routineExercise) {
      setSets(routineExercise.sets);
      setDurationSeconds(routineExercise.durationSeconds);
      setRestSeconds(routineExercise.restSeconds);
      setRestBetweenSeconds(routineExercise.restBetweenSeconds);
    }
  }, [routineExercise]);

  if (!routineExercise) return null;

  const { exercise } = routineExercise;
  const thumbnail = getYouTubeThumbnail(exercise.videoUrl);
  const muscleImage = getMuscleGroupImage(exercise.muscleGroup);

  function handleBackdropClick(e: React.MouseEvent) {
    if (e.target === e.currentTarget) {
      onClose();
    }
  }

  function handleRemove() {
    onRemove(routineExercise!.id);
    onClose();
  }

  function applySets(value: number) {
    const clamped = Math.max(SETS_MIN, Math.min(SETS_MAX, value));
    setSets(clamped);
    onChangeSets(routineExercise!.id, clamped);
  }

  function applyRestSeconds(value: number) {
    const clamped = Math.max(REST_MIN, Math.min(REST_MAX, value));
    setRestSeconds(clamped);
    onChangeRest(routineExercise!.id, "restSeconds", clamped);
  }

  function applyRestBetween(value: number) {
    const clamped = Math.max(REST_MIN, Math.min(REST_MAX, value));
    setRestBetweenSeconds(clamped);
    onChangeRest(routineExercise!.id, "restBetweenSeconds", clamped);
  }

  function applyDuration(value: number) {
    const clamped = Math.max(5, Math.min(600, value));
    setDurationSeconds(clamped);
    onChangeDuration?.(routineExercise!.id, clamped);
  }

  return (
    <div className="exercise-edit-overlay" onClick={handleBackdropClick}>
      <div className="exercise-edit-modal">
        <button
          type="button"
          className="exercise-edit-modal__close"
          onClick={onClose}
          aria-label={t("closeExerciseEdit")}
        >
          <Icon icon="solar:close-circle-bold" width={28} />
        </button>

        <div className="exercise-edit-modal__header">
          {thumbnail ? (
            <img
              src={thumbnail}
              alt={exercise.name}
              className="exercise-edit-modal__thumb"
            />
          ) : (
            <div className="exercise-edit-modal__thumb exercise-edit-modal__thumb--empty">
              {exercise.name.charAt(0)}
            </div>
          )}
          <div className="exercise-edit-modal__title-group">
            <h2 className="exercise-edit-modal__title">{exercise.name}</h2>
            <p className="exercise-edit-modal__subtitle">{exercise.equipment}</p>
            {muscleImage && (
              <img
                src={muscleImage}
                alt={exercise.muscleGroup}
                className="exercise-edit-modal__muscle"
              />
            )}
          </div>
        </div>

        <div className="exercise-edit-modal__fields">
          <div className="exercise-edit-modal__field">
            <label className="exercise-edit-modal__label">{t("sets")}</label>
            <div className="exercise-edit-modal__stepper">
              <button
                type="button"
                className="exercise-edit-modal__step-btn"
                onClick={() => applySets(sets - 1)}
                disabled={sets <= SETS_MIN}
              >
                −
              </button>
              <span className="exercise-edit-modal__value">{sets}</span>
              <button
                type="button"
                className="exercise-edit-modal__step-btn"
                onClick={() => applySets(sets + 1)}
                disabled={sets >= SETS_MAX}
              >
                +
              </button>
            </div>
          </div>

          {exercise.isTimed && (
            <div className="exercise-edit-modal__field">
              <label className="exercise-edit-modal__label">Tiempo por serie</label>
              <div className="exercise-edit-modal__stepper">
                <button
                  type="button"
                  className="exercise-edit-modal__step-btn"
                  onClick={() => applyDuration(durationSeconds - 5)}
                >
                  −
                </button>
                <span className="exercise-edit-modal__value">{durationSeconds}s</span>
                <button
                  type="button"
                  className="exercise-edit-modal__step-btn"
                  onClick={() => applyDuration(durationSeconds + 5)}
                >
                  +
                </button>
              </div>
            </div>
          )}

          <div className="exercise-edit-modal__field">
            <label className="exercise-edit-modal__label">{t("restBetweenSets")}</label>
            <div className="exercise-edit-modal__stepper">
              <button
                type="button"
                className="exercise-edit-modal__step-btn"
                onClick={() => applyRestSeconds(restSeconds - REST_STEP)}
              >
                −
              </button>
              <span className="exercise-edit-modal__value">{restSeconds}s</span>
              <button
                type="button"
                className="exercise-edit-modal__step-btn"
                onClick={() => applyRestSeconds(restSeconds + REST_STEP)}
              >
                +
              </button>
            </div>
          </div>

          <div className="exercise-edit-modal__field">
            <label className="exercise-edit-modal__label">{t("restBetweenExercises")}</label>
            <div className="exercise-edit-modal__stepper">
              <button
                type="button"
                className="exercise-edit-modal__step-btn"
                onClick={() => applyRestBetween(restBetweenSeconds - REST_STEP)}
              >
                −
              </button>
              <span className="exercise-edit-modal__value">{restBetweenSeconds}s</span>
              <button
                type="button"
                className="exercise-edit-modal__step-btn"
                onClick={() => applyRestBetween(restBetweenSeconds + REST_STEP)}
              >
                +
              </button>
            </div>
          </div>
        </div>

        <button
          type="button"
          className="exercise-edit-modal__remove"
          onClick={handleRemove}
        >
          <Icon icon="solar:trash-bin-minimalistic-linear" width={18} />
          {t("deleteExercise")}
        </button>
      </div>
    </div>
  );
}
