import { Router } from "express";
import {
  createWorkoutSessionController,
  deleteWorkoutSessionController,
  getWorkoutSessionsController,
} from "../controllers/workout-session.controller.js";

export const workoutSessionRoutes = Router();

workoutSessionRoutes.get("/", getWorkoutSessionsController);
workoutSessionRoutes.post("/", createWorkoutSessionController);
workoutSessionRoutes.delete("/:id", deleteWorkoutSessionController);
