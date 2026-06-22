import type { Request, Response } from "express";
import {
  createRoutine,
  deleteRoutine,
  getRoutineById,
  getRoutines,
  updateRoutine,
} from "../services/routine.service.js";
import { parseIdParam } from "../utils/params.js";

export async function getRoutinesController(_req: Request, res: Response) {
  const routines = await getRoutines();

  res.json({
    data: routines,
  });
}

export async function getRoutineByIdController(req: Request, res: Response) {
  const routineId = parseIdParam(req.params.id);

  if (!routineId) {
    return res.status(400).json({
      error: "Invalid routine id",
    });
  }

  const routine = await getRoutineById(routineId);

  if (!routine) {
    return res.status(404).json({
      error: "Routine not found",
    });
  }

  res.json({
    data: routine,
  });
}

export async function createRoutineController(req: Request, res: Response) {
  const { name, description } = req.body;

  if (!name || typeof name !== "string") {
    return res.status(400).json({
      error: "Routine name is required",
    });
  }

  const routine = await createRoutine({
    name,
    description,
  });

  res.status(201).json({
    data: routine,
  });
}

export async function updateRoutineController(req: Request, res: Response) {
  const routineId = parseIdParam(req.params.id);
  const { name, description } = req.body;

  if (!routineId) {
    return res.status(400).json({
      error: "Invalid routine id",
    });
  }

  if (!name || typeof name !== "string") {
    return res.status(400).json({
      error: "Routine name is required",
    });
  }

  const existingRoutine = await getRoutineById(routineId);

  if (!existingRoutine) {
    return res.status(404).json({
      error: "Routine not found",
    });
  }

  const routine = await updateRoutine(routineId, {
    name,
    description,
  });

  res.json({
    data: routine,
  });
}

export async function deleteRoutineController(req: Request, res: Response) {
  const routineId = parseIdParam(req.params.id);

  if (!routineId) {
    return res.status(400).json({
      error: "Invalid routine id",
    });
  }

  const existingRoutine = await getRoutineById(routineId);

  if (!existingRoutine) {
    return res.status(404).json({
      error: "Routine not found",
    });
  }

  await deleteRoutine(routineId);

  res.json({
    data: {
      deleted: true,
    },
  });
}
