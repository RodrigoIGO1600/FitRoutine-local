import { apiDelete, apiPost } from "./client";
import type { AddRoutineExerciseInput, RoutineExercise } from "../types/routine";

type RoutineExerciseResponse = {
  data: RoutineExercise;
};

export async function addExerciseToRoutine(
  routineId: number,
  input: AddRoutineExerciseInput
) {
  const response = await apiPost<RoutineExerciseResponse>(
    `/routines/${routineId}/exercises`,
    input
  );

  return response.data;
}

export async function deleteRoutineExercise(routineExerciseId: number) {
  await apiDelete<{ data: { deleted: true } }>(
    `/routine-exercises/${routineExerciseId}`
  );
}
