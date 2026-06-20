"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getExercisesController = getExercisesController;
const exercise_service_js_1 = require("../services/exercise.service.js");
async function getExercisesController(_req, res) {
    const exercises = await (0, exercise_service_js_1.getExercises)();
    res.json({
        data: exercises,
    });
}
