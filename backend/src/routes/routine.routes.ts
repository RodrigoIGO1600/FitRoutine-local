import { Router } from "express";
import {
  createRoutineController,
  deleteRoutineController,
  getRoutineByIdController,
  getRoutinesController,
  updateRoutineController,
} from "../controllers/routine.controller.js";

export const routineRoutes = Router();

routineRoutes.get("/", getRoutinesController);
routineRoutes.post("/", createRoutineController);
routineRoutes.get("/:id", getRoutineByIdController);
routineRoutes.put("/:id", updateRoutineController);
routineRoutes.delete("/:id", deleteRoutineController);