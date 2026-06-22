import { apiDelete, apiGet, apiPost, apiPut } from "./client";
import type {
  CreateRoutineInput,
  Routine,
  RoutineDetail,
  UpdateRoutineInput,
} from "../types/routine";

type RoutinesResponse = {
  data: Routine[];
};

type RoutineResponse = {
  data: Routine;
};

type RoutineDetailResponse = {
  data: RoutineDetail;
};

export async function getRoutines() {
  const response = await apiGet<RoutinesResponse>("/routines");
  return response.data;
}

export async function getRoutineById(id: string) {
  const response = await apiGet<RoutineDetailResponse>(`/routines/${id}`);
  return response.data;
}

export async function createRoutine(input: CreateRoutineInput) {
  const response = await apiPost<RoutineResponse>("/routines", input);
  return response.data;
}

export async function updateRoutine(id: string, input: UpdateRoutineInput) {
  const response = await apiPut<RoutineResponse>(`/routines/${id}`, input);
  return response.data;
}

export async function deleteRoutine(id: string) {
  await apiDelete<{ data: { deleted: true } }>(`/routines/${id}`);
}
