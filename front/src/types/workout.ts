import type { Exercise } from "./exercise";

export type WorkoutSet = {
  id: string;
  reps: number;
  durationSeconds: number;
  completed: boolean;
};

export type WorkoutExercise = {
  routineExerciseId: string;
  exercise: Exercise;
  isTimed: boolean;
  durationSeconds: number;
  restSeconds: number;
  restBetweenSeconds: number;
  sets: WorkoutSet[];
};
