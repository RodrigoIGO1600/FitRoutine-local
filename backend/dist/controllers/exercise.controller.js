"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getExercisesController = getExercisesController;
exports.createExerciseController = createExerciseController;
const exercise_service_js_1 = require("../services/exercise.service.js");
async function getExercisesController(_req, res) {
    const exercises = await (0, exercise_service_js_1.getExercises)();
    res.json({
        data: exercises,
    });
}
function isNonEmptyString(value) {
    return typeof value === "string" && value.trim().length > 0;
}
async function createExerciseController(req, res) {
    const { name, category, muscleGroup, equipment, description, videoUrl } = req.body;
    if (!isNonEmptyString(name) ||
        !isNonEmptyString(category) ||
        !isNonEmptyString(muscleGroup) ||
        !isNonEmptyString(equipment)) {
        return res.status(400).json({
            error: "name, category, muscleGroup and equipment are required",
        });
    }
    const exercise = await (0, exercise_service_js_1.createExercise)({
        name: name.trim(),
        category: category.trim(),
        muscleGroup: muscleGroup.trim(),
        equipment: equipment.trim(),
        description: isNonEmptyString(description) ? description.trim() : null,
        videoUrl: isNonEmptyString(videoUrl) ? videoUrl.trim() : null,
    });
    res.status(201).json({
        data: exercise,
    });
}
