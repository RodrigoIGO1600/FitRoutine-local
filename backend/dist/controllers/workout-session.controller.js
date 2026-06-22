"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getWorkoutSessionsController = getWorkoutSessionsController;
exports.createWorkoutSessionController = createWorkoutSessionController;
exports.deleteWorkoutSessionController = deleteWorkoutSessionController;
const workout_session_service_js_1 = require("../services/workout-session.service.js");
const params_js_1 = require("../utils/params.js");
async function getWorkoutSessionsController(_req, res) {
    const sessions = await (0, workout_session_service_js_1.getWorkoutSessions)();
    res.json({
        data: sessions,
    });
}
async function createWorkoutSessionController(req, res) {
    const { routineId, routineName, durationSeconds, totalSets, totalReps, totalVolume, } = req.body;
    if (!routineName || typeof routineName !== "string") {
        return res.status(400).json({
            error: "routineName is required",
        });
    }
    if (durationSeconds === undefined ||
        totalSets === undefined ||
        totalReps === undefined) {
        return res.status(400).json({
            error: "durationSeconds, totalSets and totalReps are required",
        });
    }
    const session = await (0, workout_session_service_js_1.createWorkoutSession)({
        routineId: routineId !== undefined && routineId !== null ? String(routineId) : null,
        routineName,
        durationSeconds: Number(durationSeconds),
        totalSets: Number(totalSets),
        totalReps: Number(totalReps),
        totalVolume: totalVolume !== undefined ? Number(totalVolume) : 0,
    });
    res.status(201).json({
        data: session,
    });
}
async function deleteWorkoutSessionController(req, res) {
    const sessionId = (0, params_js_1.parseIdParam)(req.params.id);
    if (!sessionId) {
        return res.status(400).json({
            error: "Invalid workout session id",
        });
    }
    const existingSession = await (0, workout_session_service_js_1.getWorkoutSessionById)(sessionId);
    if (!existingSession) {
        return res.status(404).json({
            error: "Workout session not found",
        });
    }
    await (0, workout_session_service_js_1.deleteWorkoutSession)(sessionId);
    res.json({
        data: {
            deleted: true,
        },
    });
}
