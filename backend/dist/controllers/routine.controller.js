"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRoutinesController = getRoutinesController;
exports.getRoutineByIdController = getRoutineByIdController;
exports.createRoutineController = createRoutineController;
exports.updateRoutineController = updateRoutineController;
exports.deleteRoutineController = deleteRoutineController;
const routine_service_js_1 = require("../services/routine.service.js");
async function getRoutinesController(_req, res) {
    const routines = await (0, routine_service_js_1.getRoutines)();
    res.json({
        data: routines,
    });
}
async function getRoutineByIdController(req, res) {
    const routineId = Number(req.params.id);
    if (Number.isNaN(routineId)) {
        return res.status(400).json({
            error: "Invalid routine id",
        });
    }
    const routine = await (0, routine_service_js_1.getRoutineById)(routineId);
    if (!routine) {
        return res.status(404).json({
            error: "Routine not found",
        });
    }
    res.json({
        data: routine,
    });
}
async function createRoutineController(req, res) {
    const { name, description } = req.body;
    if (!name || typeof name !== "string") {
        return res.status(400).json({
            error: "Routine name is required",
        });
    }
    const routine = await (0, routine_service_js_1.createRoutine)({
        name,
        description,
    });
    res.status(201).json({
        data: routine,
    });
}
async function updateRoutineController(req, res) {
    const routineId = Number(req.params.id);
    const { name, description } = req.body;
    if (Number.isNaN(routineId)) {
        return res.status(400).json({
            error: "Invalid routine id",
        });
    }
    if (!name || typeof name !== "string") {
        return res.status(400).json({
            error: "Routine name is required",
        });
    }
    const existingRoutine = await (0, routine_service_js_1.getRoutineById)(routineId);
    if (!existingRoutine) {
        return res.status(404).json({
            error: "Routine not found",
        });
    }
    const routine = await (0, routine_service_js_1.updateRoutine)(routineId, {
        name,
        description,
    });
    res.json({
        data: routine,
    });
}
async function deleteRoutineController(req, res) {
    const routineId = Number(req.params.id);
    if (Number.isNaN(routineId)) {
        return res.status(400).json({
            error: "Invalid routine id",
        });
    }
    const existingRoutine = await (0, routine_service_js_1.getRoutineById)(routineId);
    if (!existingRoutine) {
        return res.status(404).json({
            error: "Routine not found",
        });
    }
    await (0, routine_service_js_1.deleteRoutine)(routineId);
    res.json({
        data: {
            deleted: true,
        },
    });
}
