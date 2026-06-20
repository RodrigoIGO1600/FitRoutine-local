import express from "express";
import cors from "cors";
import { exerciseRoutes } from "./routes/exercise.routes.js";
import { routineRoutes } from "./routes/routine.routes.js";
import { routineExerciseRoutes } from "./routes/routine-exercise.routes.js";

export const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    message: "FitRoutine API is running"
  });
});

app.use("/api/exercises", exerciseRoutes);

app.use("/api/routines", routineRoutes);

app.use("/api", routineExerciseRoutes);
