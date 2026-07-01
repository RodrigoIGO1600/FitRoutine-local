import type { WorkoutExercise } from "../types/workout";

const STORAGE_PREFIX = "fitroutine:workout:";
const STORAGE_VERSION = 1;

type StoredSet = {
  reps: number;
  durationSeconds: number;
  completed: boolean;
};

type StoredExercise = {
  routineExerciseId: string;
  sets: StoredSet[];
};

export type StoredWorkoutProgress = {
  version: number;
  routineId: string;
  updatedAt: number;
  currentIndex: number;
  elapsedSeconds: number;
  exercises: StoredExercise[];
};

function storageKey(routineId: string): string {
  return `${STORAGE_PREFIX}${routineId}`;
}

export function saveWorkoutProgress(
  routineId: string,
  data: {
    currentIndex: number;
    elapsedSeconds: number;
    session: WorkoutExercise[];
  }
): void {
  try {
    const payload: StoredWorkoutProgress = {
      version: STORAGE_VERSION,
      routineId,
      updatedAt: Date.now(),
      currentIndex: data.currentIndex,
      elapsedSeconds: data.elapsedSeconds,
      exercises: data.session.map((exercise) => ({
        routineExerciseId: exercise.routineExerciseId,
        sets: exercise.sets.map((set) => ({
          reps: set.reps,
          durationSeconds: set.durationSeconds,
          completed: set.completed,
        })),
      })),
    };

    localStorage.setItem(storageKey(routineId), JSON.stringify(payload));
  } catch {
    // Storage may be unavailable (private mode, quota). Progress just won't persist.
  }
}

export function loadWorkoutProgress(
  routineId: string
): StoredWorkoutProgress | null {
  try {
    const raw = localStorage.getItem(storageKey(routineId));

    if (!raw) {
      return null;
    }

    const parsed = JSON.parse(raw) as StoredWorkoutProgress;

    if (
      !parsed ||
      parsed.version !== STORAGE_VERSION ||
      parsed.routineId !== routineId ||
      !Array.isArray(parsed.exercises)
    ) {
      return null;
    }

    return parsed;
  } catch {
    return null;
  }
}

export function clearWorkoutProgress(routineId: string): void {
  try {
    localStorage.removeItem(storageKey(routineId));
  } catch {
    // Ignore storage errors.
  }
}

export function hasWorkoutProgress(routineId: string): boolean {
  const progress = loadWorkoutProgress(routineId);

  if (!progress) {
    return false;
  }

  // Consider it resumable only if there is some completed set or elapsed time.
  const hasCompletedSet = progress.exercises.some((exercise) =>
    exercise.sets.some((set) => set.completed)
  );

  return hasCompletedSet || progress.elapsedSeconds > 0;
}
