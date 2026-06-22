"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.workoutSessionRoutes = void 0;
const express_1 = require("express");
const workout_session_controller_js_1 = require("../controllers/workout-session.controller.js");
exports.workoutSessionRoutes = (0, express_1.Router)();
exports.workoutSessionRoutes.get("/", workout_session_controller_js_1.getWorkoutSessionsController);
exports.workoutSessionRoutes.post("/", workout_session_controller_js_1.createWorkoutSessionController);
exports.workoutSessionRoutes.delete("/:id", workout_session_controller_js_1.deleteWorkoutSessionController);
