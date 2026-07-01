import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getRoutineById } from "../api/routineApi";
import { updateRoutineExercise } from "../api/routineExerciseApi";
import { createWorkoutSession } from "../api/workoutSessionApi";
import { getMuscleGroupImage } from "../utils/muscleGroupImage";
import { getYouTubeThumbnail } from "../utils/youtube";
import { playRestFinished, playExerciseFinished, unlockAudio } from "../utils/sound";
import { createTempId } from "../utils/id";
import {
  clearWorkoutProgress,
  loadWorkoutProgress,
  saveWorkoutProgress,
} from "../utils/workoutStorage";
import { RestTimer } from "../components/RestTimer";
import { ExerciseTimer } from "../components/ExerciseTimer";
import type { WorkoutExercise } from "../types/workout";
import { useTranslation } from "../context/LanguageContext";
import "./WorkoutSessionPage.css";

type RestKind = "set" | "exercise";

type RestState = {
  remaining: number;
  total: number;
  exerciseIndex: number;
  kind: RestKind;
  // When true, advancing to the next exercise happens once this rest ends.
  advanceAfter: boolean;
};

function formatRest(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

function muscleLabel(muscleGroup: string, labels: Record<string, string>): string {
  return labels[muscleGroup.toLowerCase()] ?? muscleGroup.toUpperCase();
}

function formatTime(totalSeconds: number): string {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return `${hours}:${String(minutes).padStart(2, "0")}:${String(
    seconds
  ).padStart(2, "0")}`;
}

export function WorkoutSessionPage() {
  const { id: routineId } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const REST_LABELS: Record<RestKind, string> = {
    set: t("restBetweenSets"),
    exercise: t("restBetweenExercises"),
  };

  const MUSCLE_LABELS: Record<string, string> = {
    shoulders: t("muscleShoulders"),
    chest: t("muscleChest"),
    biceps: t("muscleBiceps"),
    forearm: t("muscleForearm"),
    triceps: t("muscleTriceps"),
    back: t("muscleBack"),
    traps: t("muscleTraps"),
    legs: t("muscleLegs"),
    glutes: t("muscleGlutes"),
    core: t("muscleCore"),
  };

  const [routineName, setRoutineName] = useState("");
  const [session, setSession] = useState<WorkoutExercise[] | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isJumpSheetOpen, setIsJumpSheetOpen] = useState(false);
  const [rest, setRest] = useState<RestState | null>(null);
  const [isRestMinimized, setIsRestMinimized] = useState(false);
  const [exerciseTimer, setExerciseTimer] = useState<{
    remaining: number;
    total: number;
    setIndex: number;
  } | null>(null);
  const [isFinished, setIsFinished] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  // Accumulated elapsed time at the moment the timer (re)starts; lets the
  // session timer resume from a restored value instead of zero.
  const baseElapsedRef = useRef(0);
  // True once we have loaded (and possibly merged saved) progress, so the
  // autosave effect never overwrites stored data before hydration.
  const hydratedRef = useRef(false);

  const loadRoutine = useCallback(async () => {
    if (!routineId) {
      setError(t("invalidRoutine"));
      setIsLoading(false);
      return;
    }

    setError(null);
    hydratedRef.current = false;

    try {
      const result = await getRoutineById(routineId);

      const builtSession: WorkoutExercise[] = [...result.exercises]
        .sort((a, b) => a.order - b.order)
        .map((re) => {
          const parsedRepsList = re.repsList
            ? (() => {
                try {
                  const parsed = JSON.parse(re.repsList);
                  return Array.isArray(parsed) ? parsed : null;
                } catch {
                  return null;
                }
              })()
            : null;

          return {
            routineExerciseId: re.id,
            exercise: re.exercise,
            isTimed: re.exercise.isTimed,
            durationSeconds: re.durationSeconds,
            restSeconds: re.restSeconds,
            restBetweenSeconds: re.restBetweenSeconds,
            sets: Array.from({ length: re.sets }, (_, i) => ({
              id: createTempId(),
              reps: re.exercise.isTimed ? 1 : (parsedRepsList?.[i] ?? re.reps),
              durationSeconds: re.exercise.isTimed ? re.durationSeconds : 0,
              completed: false,
            })),
          };
        });

      // Merge any previously saved progress for this routine so the user can
      // resume completed sets, edited reps, current exercise and elapsed time.
      const saved = loadWorkoutProgress(routineId);
      let restoredIndex = 0;
      let restoredElapsed = 0;

      if (saved) {
        const savedByExercise = new Map(
          saved.exercises.map((exercise) => [
            exercise.routineExerciseId,
            exercise.sets,
          ])
        );

        for (const exercise of builtSession) {
          const savedSets = savedByExercise.get(exercise.routineExerciseId);
          if (!savedSets) {
            continue;
          }

          exercise.sets = exercise.sets.map((set, index) => {
            const savedSet = savedSets[index];
            return savedSet
              ? { ...set, reps: savedSet.reps, durationSeconds: savedSet.durationSeconds, completed: savedSet.completed }
              : set;
          });
        }

        restoredIndex = Math.min(
          Math.max(0, saved.currentIndex),
          builtSession.length - 1
        );
        restoredElapsed = Math.max(0, saved.elapsedSeconds);
      }

      baseElapsedRef.current = restoredElapsed;

      setRoutineName(result.name);
      setSession(builtSession);
      setCurrentIndex(restoredIndex);
      setElapsedSeconds(restoredElapsed);
      hydratedRef.current = true;
    } catch {
      setError(t("errorLoadRoutine"));
    } finally {
      setIsLoading(false);
    }
  }, [routineId, t]);

  useEffect(() => {
    loadRoutine();
  }, [loadRoutine]);

  const isReady = session !== null && session.length > 0;

  useEffect(() => {
    // Freeze the timer once the workout is finished (summary is showing).
    if (!isReady || isFinished) {
      return;
    }

    const startedAt = Date.now();
    const base = baseElapsedRef.current;
    const intervalId = window.setInterval(() => {
      setElapsedSeconds(base + Math.floor((Date.now() - startedAt) / 1000));
    }, 1000);

    return () => window.clearInterval(intervalId);
  }, [isReady, isFinished]);

  // Persist progress whenever it changes so the user can leave and resume.
  useEffect(() => {
    if (!routineId || !hydratedRef.current || !session) {
      return;
    }

    saveWorkoutProgress(routineId, { currentIndex, elapsedSeconds, session });
  }, [routineId, session, currentIndex, elapsedSeconds]);

  // Save once more if the tab/app is hidden or closed mid-session (mobile).
  useEffect(() => {
    function persistNow() {
      if (!routineId || !hydratedRef.current || !session) {
        return;
      }
      saveWorkoutProgress(routineId, { currentIndex, elapsedSeconds, session });
    }

    window.addEventListener("pagehide", persistNow);
    document.addEventListener("visibilitychange", persistNow);

    return () => {
      window.removeEventListener("pagehide", persistNow);
      document.removeEventListener("visibilitychange", persistNow);
    };
  }, [routineId, session, currentIndex, elapsedSeconds]);

  const isResting = rest !== null;

  // Unlock audio on first user interaction (required for mobile browsers)
  useEffect(() => {
    function handleInteraction() {
      unlockAudio();
      document.removeEventListener("click", handleInteraction);
      document.removeEventListener("touchstart", handleInteraction);
    }

    document.addEventListener("click", handleInteraction);
    document.addEventListener("touchstart", handleInteraction);

    return () => {
      document.removeEventListener("click", handleInteraction);
      document.removeEventListener("touchstart", handleInteraction);
    };
  }, []);

  function goToNextExercise() {
    setCurrentIndex((index) =>
      Math.min((session?.length ?? 1) - 1, index + 1)
    );
  }

  function endRest() {
    const shouldAdvance = rest?.advanceAfter ?? false;
    setRest(null);
    setIsRestMinimized(false);
    if (shouldAdvance) {
      goToNextExercise();
    }
  }

  useEffect(() => {
    if (!isResting) {
      return;
    }

    const intervalId = window.setInterval(() => {
      setRest((prev) =>
        prev ? { ...prev, remaining: prev.remaining - 1 } : prev
      );
    }, 1000);

    return () => window.clearInterval(intervalId);
  }, [isResting]);

  // When the countdown reaches zero, finish the rest and advance if needed.
  useEffect(() => {
    if (!rest || rest.remaining > 0) {
      return;
    }

    playRestFinished();
    setRest(null);
    setIsRestMinimized(false);

    if (rest.advanceAfter) {
      setCurrentIndex((index) =>
        Math.min((session?.length ?? 1) - 1, index + 1)
      );
    }
  }, [rest, session]);

  // Exercise timer tick + auto-complete at zero
  useEffect(() => {
    if (!exerciseTimer || exerciseTimer.remaining <= 0) {
      return;
    }

    const intervalId = window.setInterval(() => {
      setExerciseTimer((prev) => {
        if (!prev || prev.remaining <= 1) {
          window.clearInterval(intervalId);
          return prev ? { ...prev, remaining: 0 } : prev;
        }
        return { ...prev, remaining: prev.remaining - 1 };
      });
    }, 1000);

    return () => window.clearInterval(intervalId);
  }, [exerciseTimer !== null]);

  // React to exercise timer reaching zero
  useEffect(() => {
    if (!exerciseTimer || exerciseTimer.remaining > 0) {
      return;
    }

    const exercise = session?.[currentIndex];
    if (!exercise) return;

    const setId = exercise.sets[exerciseTimer.setIndex]?.id;

    // Dismiss timer first so it never gets stuck
    setExerciseTimer(null);
    if (setId) {
      setSetCompleted(setId, true);
    }
    try {
      playExerciseFinished();
    } catch {
      // AudioContext may not be available
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [exerciseTimer?.remaining]);

  const totalReps = useMemo(() => {
    if (!session) {
      return 0;
    }

    return session.reduce((sum, exercise) => {
      const exerciseReps = exercise.sets.reduce(
        (acc, set) => (set.completed ? acc + set.reps : acc),
        0
      );
      return sum + exerciseReps;
    }, 0);
  }, [session]);

  function updateSetReps(setId: string, delta: number) {
    setSession((prev) => {
      if (!prev) {
        return prev;
      }

      return prev.map((exercise, index) => {
        if (index !== currentIndex) {
          return exercise;
        }

        return {
          ...exercise,
          sets: exercise.sets.map((set) =>
            set.id === setId
              ? { ...set, reps: Math.max(1, Math.min(999, set.reps + delta)) }
              : set
          ),
        };
      });
    });
  }

  function updateSetDuration(setId: string, delta: number) {
    setSession((prev) => {
      if (!prev) {
        return prev;
      }

      return prev.map((exercise, index) => {
        if (index !== currentIndex) {
          return exercise;
        }

        return {
          ...exercise,
          sets: exercise.sets.map((set) =>
            set.id === setId
              ? { ...set, durationSeconds: Math.max(5, Math.min(600, set.durationSeconds + delta)) }
              : set
          ),
        };
      });
    });
  }

  function setSetCompleted(setId: string, completed: boolean) {
    const exercise = session?.[currentIndex];

    if (!exercise) {
      return;
    }

    const updatedSets = exercise.sets.map((set) =>
      set.id === setId ? { ...set, completed } : set
    );

    setSession((prev) =>
      prev
        ? prev.map((item, index) =>
            index === currentIndex ? { ...item, sets: updatedSets } : item
          )
        : prev
    );

    if (!completed) {
      setRest(null);
      return;
    }

    setIsRestMinimized(false);

    const remaining = updatedSets.filter((set) => !set.completed).length;
    const allDone = remaining === 0;
    const isLastExercise = currentIndex === (session?.length ?? 0) - 1;

    if (allDone) {
      // All sets done: the last exercise wraps up the workout, others rest then advance.
      if (isLastExercise) {
        setRest(null);
        setIsFinished(true);
        return;
      }

      if (exercise.restBetweenSeconds > 0) {
        setRest({
          remaining: exercise.restBetweenSeconds,
          total: exercise.restBetweenSeconds,
          exerciseIndex: currentIndex,
          kind: "exercise",
          advanceAfter: true,
        });
      } else {
        // No rest configured between exercises: jump straight to the next one.
        setRest(null);
        goToNextExercise();
      }

      return;
    }

    // Sets still pending: regular rest between series, stay on this exercise.
    if (exercise.restSeconds > 0) {
      setRest({
        remaining: exercise.restSeconds,
        total: exercise.restSeconds,
        exerciseIndex: currentIndex,
        kind: "set",
        advanceAfter: false,
      });
    } else {
      setRest(null);
    }
  }

  function applyRestToExercise(
    exerciseIndex: number,
    kind: RestKind,
    seconds: number
  ) {
    const field = kind === "exercise" ? "restBetweenSeconds" : "restSeconds";

    setSession((prev) =>
      prev
        ? prev.map((exercise, index) =>
            index === exerciseIndex
              ? { ...exercise, [field]: seconds }
              : exercise
          )
        : prev
    );
  }

  function adjustRest(delta: number) {
    if (!rest) {
      return;
    }

    const newTotal = Math.max(0, rest.total + delta);
    const newRemaining = Math.max(0, Math.min(newTotal, rest.remaining + delta));

    // Persist the new duration for every upcoming rest of this exercise.
    applyRestToExercise(rest.exerciseIndex, rest.kind, newTotal);
    setRest({ ...rest, remaining: newRemaining, total: newTotal });
  }

  function editRest() {
    if (!rest) {
      return;
    }

    const input = window.prompt(
      t("restTimePrompt"),
      String(rest.total)
    );

    if (input === null) {
      return;
    }

    const seconds = Math.round(Number(input));

    if (!Number.isFinite(seconds) || seconds <= 0) {
      return;
    }

    applyRestToExercise(rest.exerciseIndex, rest.kind, seconds);
    setRest({ ...rest, remaining: seconds, total: seconds });
  }

  function logAllSets() {
    setSession((prev) => {
      if (!prev) {
        return prev;
      }

      return prev.map((exercise, index) => {
        if (index !== currentIndex) {
          return exercise;
        }

        return {
          ...exercise,
          sets: exercise.sets.map((set) => ({ ...set, completed: true })),
        };
      });
    });
  }

  function startExerciseTimer(setIndex: number) {
    const exercise = session?.[currentIndex];
    if (!exercise || !exercise.isTimed) return;

    const duration = exercise.sets[setIndex]?.durationSeconds ?? exercise.durationSeconds;
    setExerciseTimer({ remaining: duration, total: duration, setIndex });
  }

  function skipExerciseTimer() {
    if (!exerciseTimer) return;
    const exercise = session?.[currentIndex];
    if (!exercise) return;

    const setId = exercise.sets[exerciseTimer.setIndex]?.id;

    setExerciseTimer(null);
    if (setId) {
      setSetCompleted(setId, true);
    }
    try {
      playExerciseFinished();
    } catch {
      // AudioContext may not be available
    }
  }

  function adjustExerciseTimer(delta: number) {
    if (!exerciseTimer) return;
    const newTotal = Math.max(5, exerciseTimer.total + delta);
    const newRemaining = Math.max(0, Math.min(newTotal, exerciseTimer.remaining + delta));
    setExerciseTimer({ ...exerciseTimer, remaining: newRemaining, total: newTotal });
  }

  function goToExercise(index: number) {
    setCurrentIndex(index);
    setIsJumpSheetOpen(false);
  }

  function handleExit() {
    // Leaving keeps the progress saved so it can be resumed later.
    if (routineId && session) {
      saveWorkoutProgress(routineId, { currentIndex, elapsedSeconds, session });
    }

    navigate(`/routines/${routineId}`);
  }

  function handleFinish() {
    setRest(null);
    setSaveError(null);
    setIsFinished(true);
  }

  async function finalizeWorkout() {
    if (!session) {
      return;
    }

    const completedSets = session.reduce(
      (sum, exercise) =>
        sum + exercise.sets.filter((set) => set.completed).length,
      0
    );

    setIsSaving(true);
    setSaveError(null);

    try {
      await createWorkoutSession({
        routineId: routineId ?? null,
        routineName,
        durationSeconds: elapsedSeconds,
        totalSets: completedSets,
        totalReps,
        totalVolume: 0,
      });

      const repsUpdates = routineId
        ? session.map((exercise) => {
            const completedSets = exercise.sets.filter(
              (set) => set.completed
            );

            if (completedSets.length === 0) {
              return Promise.resolve();
            }

            const repsList = JSON.stringify(
              completedSets.map((set) => set.reps)
            );

            return updateRoutineExercise(exercise.routineExerciseId, {
              reps: completedSets[completedSets.length - 1].reps,
              repsList,
            }).catch(() => {});
          })
        : [];

      await Promise.allSettled(repsUpdates);

      if (routineId) {
        clearWorkoutProgress(routineId);
      }

      navigate("/");
    } catch {
      setSaveError(t("errorSaveWorkout"));
    } finally {
      setIsSaving(false);
    }
  }

  function discardAndExit() {
    if (routineId) {
      clearWorkoutProgress(routineId);
    }

    navigate("/");
  }

  if (isLoading) {
    return (
      <div className="workout">
        <p className="workout__state">{t("loadingRoutine")}</p>
      </div>
    );
  }

  if (error || !session || session.length === 0) {
    return (
      <div className="workout">
        <div className="workout__state workout__state--error">
          <p>{error ?? t("noExercisesInRoutine")}</p>
          <button
            type="button"
            className="btn btn--ghost"
            onClick={() => navigate(`/routines/${routineId}`)}
          >
            {t("back")}
          </button>
        </div>
      </div>
    );
  }

  const current = session[currentIndex];
  const thumbnail = getYouTubeThumbnail(current.exercise.videoUrl);
  const muscleImage = getMuscleGroupImage(current.exercise.muscleGroup);
  const activeSetIndex = current.sets.findIndex((set) => !set.completed);
  const isLastExercise = currentIndex === session.length - 1;
  const restProgress = rest && rest.total > 0 ? rest.remaining / rest.total : 0;

  return (
    <div className="workout">
      <header className="workout__bar">
        <button
          type="button"
          className="workout__bar-btn"
          onClick={handleExit}
        >
          {t("exit")}
        </button>

        <div className="workout__progress">
          <button
            type="button"
            className="workout__progress-arrow"
            onClick={() => setCurrentIndex((index) => Math.max(0, index - 1))}
            disabled={currentIndex === 0}
            aria-label={t("previous")}
          >
            ‹
          </button>
          <span className="workout__progress-label">
            {t("exerciseProgress", { current: currentIndex + 1, total: session.length })}
          </span>
          <button
            type="button"
            className="workout__progress-arrow"
            onClick={() =>
              setCurrentIndex((index) =>
                Math.min(session.length - 1, index + 1)
              )
            }
            disabled={isLastExercise}
            aria-label={t("next")}
          >
            ›
          </button>
        </div>

        <button
          type="button"
          className="workout__bar-btn"
          onClick={() => setIsJumpSheetOpen(true)}
        >
          {t("exercisesList")}
        </button>
      </header>

      <section className="workout__stats">
        <div className="workout__stat">
          <span className="workout__stat-label">{t("time")}</span>
          <span className="workout__stat-value">
            {formatTime(elapsedSeconds)}
          </span>
        </div>
        <span className="workout__stat-divider" aria-hidden="true" />
        <div className="workout__stat">
          <span className="workout__stat-label">{t("volume")}</span>
          <span className="workout__stat-value workout__stat-value--muted">
            0 kg
          </span>
        </div>
        <span className="workout__stat-divider" aria-hidden="true" />
        <div className="workout__stat">
          <span className="workout__stat-label">{t("reps")}</span>
          <span className="workout__stat-value">{totalReps}</span>
        </div>
      </section>

      <section className="workout__exercise">
        {thumbnail && current.exercise.videoUrl ? (
          <a
            className="workout__exercise-thumb-link"
            href={current.exercise.videoUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Ver video de ${current.exercise.name} en YouTube`}
          >
            <img
              src={thumbnail}
              alt={current.exercise.name}
              className="workout__exercise-thumb workout__exercise-thumb--img"
            />
            <span className="workout__exercise-play" aria-hidden="true">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                <path d="M8 5v14l11-7z" />
              </svg>
            </span>
          </a>
        ) : thumbnail ? (
          <img
            src={thumbnail}
            alt={current.exercise.name}
            className="workout__exercise-thumb workout__exercise-thumb--img"
          />
        ) : (
          <div className="workout__exercise-thumb" aria-hidden="true" />
        )}

        <div className="workout__exercise-info">
          <h1 className="workout__exercise-name">{current.exercise.name}</h1>
          <span className="workout__exercise-badge">
            {muscleLabel(current.exercise.muscleGroup, MUSCLE_LABELS)}
          </span>
        </div>

        {muscleImage && (
          <img
            src={muscleImage}
            alt={current.exercise.muscleGroup}
            className="workout__exercise-muscle"
          />
        )}
      </section>

      {currentIndex > 0 && (
        <div className="workout__preview workout__preview--prev" aria-hidden="true">
          {(() => {
            const prev = session[currentIndex - 1];
            const prevThumb = getYouTubeThumbnail(prev.exercise.videoUrl);
            const prevMuscle = getMuscleGroupImage(prev.exercise.muscleGroup);
            return (
              <>
                {prevThumb && (
                  <img src={prevThumb} alt="" className="workout__preview-thumb" />
                )}
                <span className="workout__preview-name">{prev.exercise.name}</span>
                {prevMuscle && (
                  <img src={prevMuscle} alt="" className="workout__preview-muscle" />
                )}
              </>
            );
          })()}
        </div>
      )}

      {currentIndex < session.length - 1 && (
        <div className="workout__preview workout__preview--next" aria-hidden="true">
          {(() => {
            const next = session[currentIndex + 1];
            const nextThumb = getYouTubeThumbnail(next.exercise.videoUrl);
            const nextMuscle = getMuscleGroupImage(next.exercise.muscleGroup);
            return (
              <>
                {nextThumb && (
                  <img src={nextThumb} alt="" className="workout__preview-thumb" />
                )}
                <span className="workout__preview-name">{next.exercise.name}</span>
                {nextMuscle && (
                  <img src={nextMuscle} alt="" className="workout__preview-muscle" />
                )}
              </>
            );
          })()}
        </div>
      )}

      <main className="workout__sets">
        {current.sets.map((set, index) => {
          const isActive = index === activeSetIndex;

          return (
            <div
              key={set.id}
              className={`workout__set${
                set.completed ? " workout__set--done" : ""
              }${isActive ? " workout__set--active" : ""}`}
            >
              <span className="workout__set-label">{t("seriesLabel", { number: index + 1 })}</span>

              {current.isTimed ? (
                <div className="workout__stepper">
                  <button
                    type="button"
                    className="workout__stepper-btn"
                    onClick={() => updateSetDuration(set.id, -5)}
                    aria-label={t("reduceTime")}
                  >
                    −
                  </button>
                  <span className="workout__reps">
                    <span className="workout__reps-value">{set.durationSeconds}</span>
                    <span className="workout__reps-unit">s</span>
                  </span>
                  <button
                    type="button"
                    className="workout__stepper-btn"
                    onClick={() => updateSetDuration(set.id, 5)}
                    aria-label={t("increaseTime")}
                  >
                    +
                  </button>
                </div>
              ) : (
                <div className="workout__stepper">
                  <button
                    type="button"
                    className="workout__stepper-btn"
                    onClick={() => updateSetReps(set.id, -1)}
                    aria-label={t("removeRepetition")}
                  >
                    −
                  </button>
                  <span className="workout__reps">
                    <span className="workout__reps-value">{set.reps}</span>
                    <span className="workout__reps-unit">reps</span>
                  </span>
                  <button
                    type="button"
                    className="workout__stepper-btn"
                    onClick={() => updateSetReps(set.id, 1)}
                    aria-label={t("addRepetition")}
                  >
                    +
                  </button>
                </div>
              )}

              {current.isTimed && !set.completed && (
                <button
                  type="button"
                  className={`workout__timer-btn${exerciseTimer && exerciseTimer.setIndex === index ? " workout__timer-btn--active" : ""}`}
                  onClick={() => {
                    if (exerciseTimer && exerciseTimer.setIndex === index) {
                      skipExerciseTimer();
                    } else if (!exerciseTimer) {
                      startExerciseTimer(index);
                    }
                  }}
                  disabled={!isActive && !exerciseTimer}
                  aria-label={
                    exerciseTimer && exerciseTimer.setIndex === index
                      ? `Detener timer serie ${index + 1}`
                      : `Iniciar timer serie ${index + 1}`
                  }
                >
                  {exerciseTimer && exerciseTimer.setIndex === index ? (
                    <span className="workout__timer-btn-inner">
                      <span aria-hidden="true">⏸</span>
                      Detener
                    </span>
                  ) : (
                    <span className="workout__timer-btn-inner">
                      <span aria-hidden="true">⏱</span>
                      Timer
                    </span>
                  )}
                </button>
              )}

              <button
                type="button"
                className="workout__set-action"
                onClick={() => setSetCompleted(set.id, !set.completed)}
                disabled={rest !== null}
                aria-label={
                  set.completed
                    ? `Desmarcar serie ${index + 1}`
                    : `Marcar serie ${index + 1} como hecha`
                }
              >
                {set.completed ? (
                  <span className="workout__set-action-inner">
                    <span aria-hidden="true">✓</span>
                    {t("redo")}
                  </span>
                ) : isActive ? (
                  t("done")
                ) : (
                  <span aria-hidden="true">▶</span>
                )}
              </button>
            </div>
          );
        })}
      </main>

      <footer className="workout__footer">
        <button
          type="button"
          className="workout__log-btn"
          onClick={logAllSets}
        >
          {t("logAllSets")}
        </button>

        <div className="workout__footer-links">
          <button
            type="button"
            className="workout__text-btn"
            onClick={() => navigate(`/routines/${routineId}/edit`)}
          >
            {t("customizeExercise")}
          </button>
          <button
            type="button"
            className="workout__text-btn workout__text-btn--finish"
            onClick={handleFinish}
          >
            {t("finishRoutine")}
          </button>
        </div>
      </footer>

      {isJumpSheetOpen && (
        <div
          className="sheet-overlay"
          role="presentation"
          onClick={() => setIsJumpSheetOpen(false)}
        >
          <div
            className="sheet"
            role="dialog"
            aria-modal="true"
            aria-label={t("exercisesListTitle")}
            onClick={(event) => event.stopPropagation()}
          >
            <div className="sheet__handle" aria-hidden="true" />
            <div className="sheet__header">
              <h2>{routineName}</h2>
              <p>{t("jumpToExercise")}</p>
            </div>

            <ul className="workout__jump-list">
              {session.map((exercise, index) => {
                const doneSets = exercise.sets.filter(
                  (set) => set.completed
                ).length;

                return (
                  <li key={exercise.routineExerciseId}>
                    <button
                      type="button"
                      className={`workout__jump-item${
                        index === currentIndex
                          ? " workout__jump-item--current"
                          : ""
                      }`}
                      onClick={() => goToExercise(index)}
                    >
                      <span className="workout__jump-name">
                        {exercise.exercise.name}
                      </span>
                      <span className="workout__jump-meta">
                        {t("setsLabel", { count: `${doneSets}/${exercise.sets.length}` })}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      )}

      {rest && !isRestMinimized && (
        <RestTimer
          remaining={rest.remaining}
          total={rest.total}
          label={REST_LABELS[rest.kind]}
          nextExerciseName={
            rest.kind === "exercise" && session[currentIndex + 1]
              ? session[currentIndex + 1].exercise.name
              : undefined
          }
          nextExerciseMuscleGroup={
            rest.kind === "exercise" && session[currentIndex + 1]
              ? muscleLabel(session[currentIndex + 1].exercise.muscleGroup, MUSCLE_LABELS)
              : undefined
          }
          nextExerciseImage={
            rest.kind === "exercise" && session[currentIndex + 1]
              ? getYouTubeThumbnail(session[currentIndex + 1].exercise.videoUrl)
              : undefined
          }
          nextExerciseUrl={
            rest.kind === "exercise" && session[currentIndex + 1]
              ? session[currentIndex + 1].exercise.videoUrl ?? undefined
              : undefined
          }
          onSkip={endRest}
          onAdjust={adjustRest}
          onEdit={editRest}
          onMinimize={() => setIsRestMinimized(true)}
        />
      )}

      {rest && isRestMinimized && (
        <button
          type="button"
          className="workout__rest-minimized"
          onClick={() => setIsRestMinimized(false)}
          aria-label={t("expandRestTimer")}
        >
          <svg className="workout__rest-minimized-ring" viewBox="0 0 40 40" aria-hidden="true">
            <circle
              className="workout__rest-minimized-track"
              cx="20"
              cy="20"
              r="17"
            />
            <circle
              className="workout__rest-minimized-progress"
              cx="20"
              cy="20"
              r="17"
              style={{
                strokeDasharray: 2 * Math.PI * 17,
                strokeDashoffset: 2 * Math.PI * 17 * (1 - restProgress),
              }}
            />
          </svg>
          <span className="workout__rest-minimized-time">{formatRest(rest.remaining)}</span>
        </button>
      )}

      {exerciseTimer && (
        <ExerciseTimer
          remaining={exerciseTimer.remaining}
          total={exerciseTimer.total}
          label={t("exerciseTime")}
          onSkip={skipExerciseTimer}
          onAdjust={adjustExerciseTimer}
        />
      )}

      {isFinished && (
        <div
          className="workout__finish-overlay"
          role="dialog"
          aria-modal="true"
          aria-label={t("workoutSummary")}
        >
          <div className="workout__finish-card">
            <span className="workout__finish-emoji" aria-hidden="true">
              🎉
            </span>
            <h2 className="workout__finish-title">{t("workoutComplete")}</h2>
            <p className="workout__finish-subtitle">{routineName}</p>

            <div className="workout__finish-stats">
              <div className="workout__finish-stat">
                <span className="workout__finish-stat-value">
                  {formatTime(elapsedSeconds)}
                </span>
                <span className="workout__finish-stat-label">{t("time")}</span>
              </div>
              <div className="workout__finish-stat">
                <span className="workout__finish-stat-value">
                  {session.length}
                </span>
                <span className="workout__finish-stat-label">{t("exercisesList")}</span>
              </div>
              <div className="workout__finish-stat">
                <span className="workout__finish-stat-value">
                  {session.reduce(
                    (sum, exercise) =>
                      sum +
                      exercise.sets.filter((set) => set.completed).length,
                    0
                  )}
                </span>
                <span className="workout__finish-stat-label">{t("seriesLabel", { number: "" })}</span>
              </div>
              <div className="workout__finish-stat">
                <span className="workout__finish-stat-value">{totalReps}</span>
                <span className="workout__finish-stat-label">{t("reps")}</span>
              </div>
            </div>

            {saveError && (
              <p className="workout__finish-error" role="alert">
                {saveError}
              </p>
            )}

            <button
              type="button"
              className="workout__finish-primary"
              onClick={finalizeWorkout}
              disabled={isSaving}
            >
              {isSaving ? t("saving") : t("finishAndSave")}
            </button>

            <div className="workout__finish-links workout__finish-links--single">
              <button
                type="button"
                className="workout__text-btn workout__text-btn--finish"
                onClick={discardAndExit}
                disabled={isSaving}
              >
                {t("exitWithoutSaving")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
