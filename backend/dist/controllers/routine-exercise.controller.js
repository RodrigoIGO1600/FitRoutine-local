"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRoutineExerciseController = createRoutineExerciseController;
exports.updateRoutineExerciseController = updateRoutineExerciseController;
exports.deleteRoutineExerciseController = deleteRoutineExerciseController;
const routine_exercise_service_js_1 = require("../services/routine-exercise.service.js");
const params_js_1 = require("../utils/params.js");
async function createRoutineExerciseController(req, res) {
    const routineId = (0, params_js_1.parseIdParam)(req.params.id);
    const { exerciseId, sets, reps, weight, restSeconds, restBetweenSeconds, order, notes, } = req.body;
    if (!routineId) {
        return res.status(400).json({
            error: "Invalid routine id",
        });
    }
    if (!exerciseId ||
        typeof exerciseId !== "string" ||
        sets === undefined ||
        reps === undefined ||
        restSeconds === undefined ||
        order === undefined) {
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
    const exercise = await (0, routine_exercise_service_js_1.getExerciseById)(exerciseId);
    if (!exercise) {
        return res.status(404).json({
            error: "Exercise not found",
        });
    }
    const routineExercise = await (0, routine_exercise_service_js_1.createRoutineExercise)({
        routineId,
        exerciseId,
        sets: Number(sets),
        reps: Number(reps),
        weight: weight !== undefined && weight !== null ? Number(weight) : null,
        restSeconds: Number(restSeconds),
        restBetweenSeconds: restBetweenSeconds !== undefined ? Number(restBetweenSeconds) : undefined,
        order: Number(order),
        notes: notes ?? null,
    });
    res.status(201).json({
        data: routineExercise,
    });
}
async function updateRoutineExerciseController(req, res) {
    const routineExerciseId = (0, params_js_1.parseIdParam)(req.params.id);
    const { sets, reps, weight, restSeconds, restBetweenSeconds, order, notes, } = req.body;
    if (!routineExerciseId) {
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
        weight: weight === undefined
            ? undefined
            : weight === null
                ? null
                : Number(weight),
        restSeconds: restSeconds !== undefined ? Number(restSeconds) : undefined,
        restBetweenSeconds: restBetweenSeconds !== undefined
            ? Number(restBetweenSeconds)
            : undefined,
        order: order !== undefined ? Number(order) : undefined,
        notes: notes !== undefined ? notes : undefined,
    });
    res.json({
        data: updatedRoutineExercise,
    });
}
async function deleteRoutineExerciseController(req, res) {
    const routineExerciseId = (0, params_js_1.parseIdParam)(req.params.id);
    if (!routineExerciseId) {
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
