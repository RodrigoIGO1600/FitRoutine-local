import type { Exercise } from "./exercise";

export type Routine = {
  id: string;
  name: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
  exercises?: RoutineExercise[];
};

export type RoutineExercise = {
  id: string;
  routineId: string;
  exerciseId: string;
  sets: number;
  reps: number;
  repsList: string | null;
  weight: number | null;
  restSeconds: number;
  restBetweenSeconds: number;
  order: number;
  notes: string | null;
  exercise: Exercise;
};

export type RoutineDetail = Routine & {
  exercises: RoutineExercise[];
};

export type CreateRoutineInput = {
  name: string;
  description?: string;
};

export type UpdateRoutineInput = {
  name: string;
  description?: string | null;
};

export type AddRoutineExerciseInput = {
  exerciseId: string;
  sets: number;
  reps: number;
  repsList?: string | null;
  weight?: number | null;
  restSeconds: number;
  restBetweenSeconds?: number;
  order: number;
  notes?: string | null;
};
