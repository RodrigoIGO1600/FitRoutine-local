import { apiGet, apiPost } from "./client";
import type { Exercise } from "../types/exercise";

type GetExercisesResponse = {
  data: Exercise[];
};

type ExerciseResponse = {
  data: Exercise;
};

export type CreateExerciseInput = {
  name: string;
  category: string;
  muscleGroup: string;
  equipment: string;
  description?: string | null;
  videoUrl?: string | null;
};

export async function getExercises() {
  const response = await apiGet<GetExercisesResponse>("/exercises");
  return response.data;
}

export async function createExercise(input: CreateExerciseInput) {
  const response = await apiPost<ExerciseResponse>("/exercises", input);
  return response.data;
}
