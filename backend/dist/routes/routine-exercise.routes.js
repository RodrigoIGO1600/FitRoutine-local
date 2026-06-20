"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.routineExerciseRoutes = void 0;
const express_1 = require("express");
const routine_exercise_controller_js_1 = require("../controllers/routine-exercise.controller.js");
exports.routineExerciseRoutes = (0, express_1.Router)();
exports.routineExerciseRoutes.post("/routines/:id/exercises", routine_exercise_controller_js_1.createRoutineExerciseController);
exports.routineExerciseRoutes.put("/routine-exercises/:id", routine_exercise_controller_js_1.updateRoutineExerciseController);
exports.routineExerciseRoutes.delete("/routine-exercises/:id", routine_exercise_controller_js_1.deleteRoutineExerciseController);
