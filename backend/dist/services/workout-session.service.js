"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getWorkoutSessions = getWorkoutSessions;
exports.createWorkoutSession = createWorkoutSession;
exports.getWorkoutSessionById = getWorkoutSessionById;
exports.deleteWorkoutSession = deleteWorkoutSession;
const prisma_js_1 = require("../db/prisma.js");
async function getWorkoutSessions() {
    return prisma_js_1.prisma.workoutSession.findMany({
        orderBy: {
            completedAt: "desc",
        },
    });
}
async function createWorkoutSession(input) {
    return prisma_js_1.prisma.workoutSession.create({
        data: {
            routineId: input.routineId ?? null,
            routineName: input.routineName,
            durationSeconds: input.durationSeconds,
            totalSets: input.totalSets,
            totalReps: input.totalReps,
            totalVolume: input.totalVolume ?? 0,
        },
    });
}
async function getWorkoutSessionById(id) {
    return prisma_js_1.prisma.workoutSession.findUnique({
        where: {
            id,
        },
    });
}
async function deleteWorkoutSession(id) {
    return prisma_js_1.prisma.workoutSession.delete({
        where: {
            id,
        },
    });
}
