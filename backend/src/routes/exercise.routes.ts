import { Router } from "express";
import { getExercisesController } from "../controllers/exercise.controller.js";

export const exerciseRoutes = Router();

exerciseRoutes.get("/", getExercisesController);