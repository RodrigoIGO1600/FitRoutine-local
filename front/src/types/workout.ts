import type { Exercise } from "./exercise";

export type WorkoutSet = {
  id: string;
  reps: number;
  completed: boolean;
};

export type WorkoutExercise = {
  routineExerciseId: string;
  exercise: Exercise;
  restSeconds: number;
  restBetweenSeconds: number;
  sets: WorkoutSet[];
};
