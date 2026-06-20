import type { Request, Response } from "express";
import {
  createRoutineExercise,
  deleteRoutineExercise,
  getExerciseById,
  getRoutineById,
  getRoutineExerciseById,
  updateRoutineExercise,
} from "../services/routine-exercise.service.js";

export async function createRoutineExerciseController(
  req: Request,
  res: Response
) {
  const routineId = Number(req.params.id);

  const {
    exerciseId,
    sets,
    reps,
    weight,
    restSeconds,
    order,
    notes,
  } = req.body;

  if (Number.isNaN(routineId)) {
    return res.status(400).json({
      error: "Invalid routine id",
    });
  }

  if (!exerciseId || !sets || !reps || !restSeconds || !order) {
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

  const exercise = await getExerciseById(Number(exerciseId));

  if (!exercise) {
    return res.status(404).json({
      error: "Exercise not found",
    });
  }

  const routineExercise = await createRoutineExercise({
    routineId,
    exerciseId: Number(exerciseId),
    sets: Number(sets),
    reps: Number(reps),
    weight: weight !== undefined && weight !== null ? Number(weight) : null,
    restSeconds: Number(restSeconds),
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
  const routineExerciseId = Number(req.params.id);

  const {
    sets,
    reps,
    weight,
    restSeconds,
    order,
    notes,
  } = req.body;

  if (Number.isNaN(routineExerciseId)) {
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
      weight: weight !== undefined && weight !== null ? Number(weight) : null,
      restSeconds:
        restSeconds !== undefined ? Number(restSeconds) : undefined,
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
  const routineExerciseId = Number(req.params.id);

  if (Number.isNaN(routineExerciseId)) {
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