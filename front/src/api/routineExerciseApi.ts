import { apiDelete, apiPost, apiPut } from "./client";
import type { AddRoutineExerciseInput, RoutineExercise } from "../types/routine";

type RoutineExerciseResponse = {
  data: RoutineExercise;
};

export type UpdateRoutineExerciseInput = {
  sets?: number;
  reps?: number;
  repsList?: string | null;
  durationSeconds?: number;
  weight?: number | null;
  restSeconds?: number;
  restBetweenSeconds?: number;
  order?: number;
  notes?: string | null;
};

export async function addExerciseToRoutine(
  routineId: string,
  input: AddRoutineExerciseInput
) {
  const response = await apiPost<RoutineExerciseResponse>(
    `/routines/${routineId}/exercises`,
    input
  );

  return response.data;
}

export async function deleteRoutineExercise(routineExerciseId: string) {
  await apiDelete<{ data: { deleted: true } }>(
    `/routine-exercises/${routineExerciseId}`
  );
}

export async function updateRoutineExercise(
  routineExerciseId: string,
  input: UpdateRoutineExerciseInput
) {
  const response = await apiPut<RoutineExerciseResponse>(
    `/routine-exercises/${routineExerciseId}`,
    input
  );

  return response.data;
}
