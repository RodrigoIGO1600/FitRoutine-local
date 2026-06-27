import type { Request, Response } from "express";
import {
  createWorkoutSession,
  deleteWorkoutSession,
  getWorkoutSessionById,
  getWorkoutSessions,
} from "../services/workout-session.service.js";
import { parseIdParam } from "../utils/params.js";

export async function getWorkoutSessionsController(
  req: Request,
  res: Response
) {
  try {
    const routineId = req.query.routineId
      ? parseIdParam(req.query.routineId as string)
      : undefined;

    const sessions = await getWorkoutSessions(routineId ?? undefined);

    res.json({
      data: sessions,
    });
  } catch (error) {
    console.error("Failed to fetch workout sessions:", error);
    res.status(500).json({
      error: "Failed to fetch workout sessions",
    });
  }
}

export async function createWorkoutSessionController(
  req: Request,
  res: Response
) {
  const {
    routineId,
    routineName,
    durationSeconds,
    totalSets,
    totalReps,
    totalVolume,
  } = req.body;

  if (!routineName || typeof routineName !== "string") {
    return res.status(400).json({
      error: "routineName is required",
    });
  }

  if (
    durationSeconds === undefined ||
    totalSets === undefined ||
    totalReps === undefined
  ) {
    return res.status(400).json({
      error: "durationSeconds, totalSets and totalReps are required",
    });
  }

  const session = await createWorkoutSession({
    routineId:
      routineId !== undefined && routineId !== null ? String(routineId) : null,
    routineName,
    durationSeconds: Number(durationSeconds),
    totalSets: Number(totalSets),
    totalReps: Number(totalReps),
    totalVolume: totalVolume !== undefined ? Number(totalVolume) : 0,
  });

  res.status(201).json({
    data: session,
  });
}

export async function deleteWorkoutSessionController(
  req: Request,
  res: Response
) {
  const sessionId = parseIdParam(req.params.id);

  if (!sessionId) {
    return res.status(400).json({
      error: "Invalid workout session id",
    });
  }

  const existingSession = await getWorkoutSessionById(sessionId);

  if (!existingSession) {
    return res.status(404).json({
      error: "Workout session not found",
    });
  }

  await deleteWorkoutSession(sessionId);

  res.json({
    data: {
      deleted: true,
    },
  });
}
