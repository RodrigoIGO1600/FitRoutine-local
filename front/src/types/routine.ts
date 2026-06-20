import type { Exercise } from "./exercise";

export type Routine = {
  id: number;
  name: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
};

export type RoutineExercise = {
  id: number;
  routineId: number;
  exerciseId: number;
  sets: number;
  reps: number;
  weight: number | null;
  restSeconds: number;
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
  exerciseId: number;
  sets: number;
  reps: number;
  weight?: number | null;
  restSeconds: number;
  order: number;
  notes?: string | null;
};
