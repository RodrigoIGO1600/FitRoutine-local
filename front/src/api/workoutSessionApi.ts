import { apiDelete, apiGet, apiPost } from "./client";
import type {
  CreateWorkoutSessionInput,
  WorkoutSession,
} from "../types/workoutSession";

type WorkoutSessionsResponse = {
  data: WorkoutSession[];
};

type WorkoutSessionResponse = {
  data: WorkoutSession;
};

export async function getWorkoutSessions(routineId?: string) {
  const query = routineId ? `?routineId=${encodeURIComponent(routineId)}` : "";
  const response = await apiGet<WorkoutSessionsResponse>(
    `/workout-sessions${query}`
  );
  return response.data ?? [];
}

export async function createWorkoutSession(input: CreateWorkoutSessionInput) {
  const response = await apiPost<WorkoutSessionResponse>(
    "/workout-sessions",
    input
  );
  return response.data;
}

export async function deleteWorkoutSession(id: string) {
  await apiDelete<{ data: { deleted: true } }>(`/workout-sessions/${id}`);
}
