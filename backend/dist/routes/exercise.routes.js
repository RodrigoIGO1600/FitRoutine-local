"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.exerciseRoutes = void 0;
const express_1 = require("express");
const exercise_controller_js_1 = require("../controllers/exercise.controller.js");
exports.exerciseRoutes = (0, express_1.Router)();
exports.exerciseRoutes.get("/", exercise_controller_js_1.getExercisesController);
