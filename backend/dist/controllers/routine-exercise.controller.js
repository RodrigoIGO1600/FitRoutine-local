"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRoutineExerciseController = createRoutineExerciseController;
exports.updateRoutineExerciseController = updateRoutineExerciseController;
exports.deleteRoutineExerciseController = deleteRoutineExerciseController;
const routine_exercise_service_js_1 = require("../services/routine-exercise.service.js");
async function createRoutineExerciseController(req, res) {
    const routineId = Number(req.params.id);
    const { exerciseId, sets, reps, weight, restSeconds, order, notes, } = req.body;
    if (Number.isNaN(routineId)) {
        return res.status(400).json({
            error: "Invalid routine id",
        });
    }
    if (!exerciseId || !sets || !reps || !restSeconds || !order) {
        return res.status(400).json({
            error: "exerciseId, sets, reps, restSeconds and order are required",
        });
    }
    const routine = await (0, routine_exercise_service_js_1.getRoutineById)(routineId);
    if (!routine) {
        return res.status(404).json({
            error: "Routine not found",
        });
    }
    const exercise = await (0, routine_exercise_service_js_1.getExerciseById)(Number(exerciseId));
    if (!exercise) {
        return res.status(404).json({
            error: "Exercise not found",
        });
    }
    const routineExercise = await (0, routine_exercise_service_js_1.createRoutineExercise)({
        routineId,
        exerciseId: Number(exerciseId),
        sets: Number(sets),
        reps: Number(reps),
        weight: weight !== undefined && weight !== null ? Number(weight) : null,
        restSeconds: Number(restSeconds),
        order: Number(order),
        notes: notes ?? null,
    });
    res.status(201).json({
        data: routineExercise,
    });
}
async function updateRoutineExerciseController(req, res) {
    const routineExerciseId = Number(req.params.id);
    const { sets, reps, weight, restSeconds, order, notes, } = req.body;
    if (Number.isNaN(routineExerciseId)) {
        return res.status(400).json({
            error: "Invalid routine exercise id",
        });
    }
    const existingRoutineExercise = await (0, routine_exercise_service_js_1.getRoutineExerciseById)(routineExerciseId);
    if (!existingRoutineExercise) {
        return res.status(404).json({
            error: "Routine exercise not found",
        });
    }
    const updatedRoutineExercise = await (0, routine_exercise_service_js_1.updateRoutineExercise)(routineExerciseId, {
        sets: sets !== undefined ? Number(sets) : undefined,
        reps: reps !== undefined ? Number(reps) : undefined,
        weight: weight !== undefined && weight !== null ? Number(weight) : null,
        restSeconds: restSeconds !== undefined ? Number(restSeconds) : undefined,
        order: order !== undefined ? Number(order) : undefined,
        notes: notes !== undefined ? notes : undefined,
    });
    res.json({
        data: updatedRoutineExercise,
    });
}
async function deleteRoutineExerciseController(req, res) {
    const routineExerciseId = Number(req.params.id);
    if (Number.isNaN(routineExerciseId)) {
        return res.status(400).json({
            error: "Invalid routine exercise id",
        });
    }
    const existingRoutineExercise = await (0, routine_exercise_service_js_1.getRoutineExerciseById)(routineExerciseId);
    if (!existingRoutineExercise) {
        return res.status(404).json({
            error: "Routine exercise not found",
        });
    }
    await (0, routine_exercise_service_js_1.deleteRoutineExercise)(routineExerciseId);
    res.json({
        data: {
            deleted: true,
        },
    });
}
