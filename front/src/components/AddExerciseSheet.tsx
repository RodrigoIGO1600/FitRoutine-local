import { useEffect, useMemo, useState } from "react";
import { Icon } from "@iconify/react";
import { getExercises } from "../api/exerciseApi";
import { getMuscleGroupImage } from "../utils/muscleGroupImage";
import { getYouTubeThumbnail } from "../utils/youtube";
import type { Exercise } from "../types/exercise";
import { useTranslation } from "../context/LanguageContext";
import { type TranslationKey } from "../i18n";

type AddExerciseSheetProps = {
  isOpen: boolean;
  isSubmitting: boolean;
  existingExerciseIds: string[];
  onClose: () => void;
  onSelect: (exercise: Exercise) => void;
  onDeselect: (exercise: Exercise) => void;
};

const MUSCLE_GROUP_TRANSLATION_KEYS: Record<string, TranslationKey> = {
  shoulders: "muscleShoulders",
  chest: "muscleChest",
  biceps: "muscleBiceps",
  triceps: "muscleTriceps",
  back: "muscleBack",
  forearm: "muscleForearm",
  traps: "muscleTraps",
};

function getMuscleGroupLabel(key: string, t: (key: TranslationKey) => string): string {
  return MUSCLE_GROUP_TRANSLATION_KEYS[key] ? t(MUSCLE_GROUP_TRANSLATION_KEYS[key]) : key;
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
  const { t } = useTranslation();

  useEffect(() => {
    if (!isOpen) return;

    async function loadExercises() {
      setIsLoading(true);
      setError(null);

      try {
        const result = await getExercises();
        setExercises(result);
      } catch {
        setError(t("errorLoadExercises"));
      } finally {
        setIsLoading(false);
      }
    }

    loadExercises();
  }, [isOpen, t]);

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
                <Icon icon="solar:arrow-left-linear" /> {t("groups")}
              </button>
              <h2 id="add-exercise-title">
                {getMuscleGroupLabel(selectedGroup, t)}
              </h2>
            </>
          ) : (
            <>
              <h2 id="add-exercise-title">{t("addExerciseTitle")}</h2>
              <p>{t("selectMuscleGroupFirst")}</p>
            </>
          )}
        </header>

        <div className="exercise-picker">
          {isLoading && <p className="exercise-picker__state">{t("loading")}</p>}

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
                          {getMuscleGroupLabel(key, t)}
                        </span>
                        <span className="exercise-picker__group-count">
                          {t("exercisesCount", { count })}
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
                  {t("noExercisesInGroup")}
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
                              ? t("removeExercise", { name: exercise.name })
                              : t("addExerciseLabel", { name: exercise.name })
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
