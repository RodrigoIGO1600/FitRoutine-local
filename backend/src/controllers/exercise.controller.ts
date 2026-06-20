import type { Request, Response } from "express";
import { getExercises } from "../services/exercise.service.js";

export async function getExercisesController(_req: Request, res: Response) {
  const exercises = await getExercises();

  res.json({
    data: exercises,
  });
}