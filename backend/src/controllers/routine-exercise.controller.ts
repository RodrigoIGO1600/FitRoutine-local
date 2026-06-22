import type { Request, Response } from "express";
import {
  createRoutineExercise,
  deleteRoutineExercise,
  getExerciseById,
  getRoutineById,
  getRoutineExerciseById,
  updateRoutineExercise,
} from "../services/routine-exercise.service.js";
import { parseIdParam } from "../utils/params.js";

export async function createRoutineExerciseController(
  req: Request,
  res: Response
) {
  const routineId = parseIdParam(req.params.id);

  const {
    exerciseId,
    sets,
    reps,
    weight,
    restSeconds,
    restBetweenSeconds,
    order,
    notes,
  } = req.body;

  if (!routineId) {
    return res.status(400).json({
      error: "Invalid routine id",
    });
  }

  if (
    !exerciseId ||
    typeof exerciseId !== "string" ||
    sets === undefined ||
    reps === undefined ||
    restSeconds === undefined ||
    order === undefined
  ) {
    return res.status(400).json({
      error: "exerciseId, sets, reps, restSeconds and order are required",
    });
  }

  const routine = await getRoutineById(routineId);

  if (!routine) {
    return res.status(404).json({
      error: "Routine not found",
    });
  }

  const exercise = await getExerciseById(exerciseId);

  if (!exercise) {
    return res.status(404).json({
      error: "Exercise not found",
    });
  }

  const routineExercise = await createRoutineExercise({
    routineId,
    exerciseId,
    sets: Number(sets),
    reps: Number(reps),
    weight: weight !== undefined && weight !== null ? Number(weight) : null,
    restSeconds: Number(restSeconds),
    restBetweenSeconds:
      restBetweenSeconds !== undefined ? Number(restBetweenSeconds) : undefined,
    order: Number(order),
    notes: notes ?? null,
  });

  res.status(201).json({
    data: routineExercise,
  });
}

export async function updateRoutineExerciseController(
  req: Request,
  res: Response
) {
  const routineExerciseId = parseIdParam(req.params.id);

  const {
    sets,
    reps,
    weight,
    restSeconds,
    restBetweenSeconds,
    order,
    notes,
  } = req.body;

  if (!routineExerciseId) {
    return res.status(400).json({
      error: "Invalid routine exercise id",
    });
  }

  const existingRoutineExercise = await getRoutineExerciseById(
    routineExerciseId
  );

  if (!existingRoutineExercise) {
    return res.status(404).json({
      error: "Routine exercise not found",
    });
  }

  const updatedRoutineExercise = await updateRoutineExercise(
    routineExerciseId,
    {
      sets: sets !== undefined ? Number(sets) : undefined,
      reps: reps !== undefined ? Number(reps) : undefined,
      weight:
        weight === undefined
          ? undefined
          : weight === null
          ? null
          : Number(weight),
      restSeconds:
        restSeconds !== undefined ? Number(restSeconds) : undefined,
      restBetweenSeconds:
        restBetweenSeconds !== undefined
          ? Number(restBetweenSeconds)
          : undefined,
      order: order !== undefined ? Number(order) : undefined,
      notes: notes !== undefined ? notes : undefined,
    }
  );

  res.json({
    data: updatedRoutineExercise,
  });
}

export async function deleteRoutineExerciseController(
  req: Request,
  res: Response
) {
  const routineExerciseId = parseIdParam(req.params.id);

  if (!routineExerciseId) {
    return res.status(400).json({
      error: "Invalid routine exercise id",
    });
  }

  const existingRoutineExercise = await getRoutineExerciseById(
    routineExerciseId
  );

  if (!existingRoutineExercise) {
    return res.status(404).json({
      error: "Routine exercise not found",
    });
  }

  await deleteRoutineExercise(routineExerciseId);

  res.json({
    data: {
      deleted: true,
    },
  });
}
