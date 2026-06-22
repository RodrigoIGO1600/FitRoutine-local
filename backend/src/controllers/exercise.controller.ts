import type { Request, Response } from "express";
import {
  createExercise,
  getExercises,
} from "../services/exercise.service.js";

export async function getExercisesController(_req: Request, res: Response) {
  const exercises = await getExercises();

  res.json({
    data: exercises,
  });
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

export async function createExerciseController(req: Request, res: Response) {
  const { name, category, muscleGroup, equipment, description, videoUrl } =
    req.body;

  if (
    !isNonEmptyString(name) ||
    !isNonEmptyString(category) ||
    !isNonEmptyString(muscleGroup) ||
    !isNonEmptyString(equipment)
  ) {
    return res.status(400).json({
      error: "name, category, muscleGroup and equipment are required",
    });
  }

  const exercise = await createExercise({
    name: name.trim(),
    category: category.trim(),
    muscleGroup: muscleGroup.trim(),
    equipment: equipment.trim(),
    description: isNonEmptyString(description) ? description.trim() : null,
    videoUrl: isNonEmptyString(videoUrl) ? videoUrl.trim() : null,
  });

  res.status(201).json({
    data: exercise,
  });
}
