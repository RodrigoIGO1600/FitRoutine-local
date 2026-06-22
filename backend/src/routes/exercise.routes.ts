import { Router } from "express";
import {
  createExerciseController,
  getExercisesController,
} from "../controllers/exercise.controller.js";

export const exerciseRoutes = Router();

exerciseRoutes.get("/", getExercisesController);
exerciseRoutes.post("/", createExerciseController);