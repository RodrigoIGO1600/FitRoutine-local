import express from "express";
import cors from "cors";
import { networkInterfaces } from "os";
import { exerciseRoutes } from "./routes/exercise.routes.js";
import { routineRoutes } from "./routes/routine.routes.js";
import { routineExerciseRoutes } from "./routes/routine-exercise.routes.js";
import { workoutSessionRoutes } from "./routes/workout-session.routes.js";

export const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    message: "FitRoutine API is running"
  });
});

app.get("/api/network/ip", (_req, res) => {
  const nets = networkInterfaces();
  for (const name of Object.keys(nets)) {
    for (const net of nets[name]) {
      if (net.family === "IPv4" && !net.internal) {
        return res.json({ ip: net.address });
      }
    }
  }
  res.json({ ip: "localhost" });
});

app.use("/api/exercises", exerciseRoutes);

app.use("/api/routines", routineRoutes);

app.use("/api/workout-sessions", workoutSessionRoutes);

app.use("/api", routineExerciseRoutes);
