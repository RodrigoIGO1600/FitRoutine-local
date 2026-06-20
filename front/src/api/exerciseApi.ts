import { apiGet } from "./client";
import type { Exercise } from "../types/exercise";

type GetExercisesResponse = {
    data: Exercise[];
};

export async function getExercises() {
    const response = await apiGet<GetExercisesResponse>("/exercises");
    return response.data;
}