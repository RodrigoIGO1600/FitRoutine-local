import { Router } from "express";
import {
  createRoutineExerciseController,
  deleteRoutineExerciseController,
  updateRoutineExerciseController,
} from "../controllers/routine-exercise.controller.js";

export const routineExerciseRoutes = Router();

routineExerciseRoutes.post(
  "/routines/:id/exercises",
  createRoutineExerciseController
);

routineExerciseRoutes.put(
  "/routine-exercises/:id",
  updateRoutineExerciseController
);

routineExerciseRoutes.delete(
  "/routine-exercises/:id",
  deleteRoutineExerciseController
);