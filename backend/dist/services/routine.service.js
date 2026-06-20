"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRoutines = getRoutines;
exports.getRoutineById = getRoutineById;
exports.createRoutine = createRoutine;
exports.updateRoutine = updateRoutine;
exports.deleteRoutine = deleteRoutine;
const prisma_js_1 = require("../db/prisma.js");
async function getRoutines() {
    return prisma_js_1.prisma.routine.findMany({
        include: {
            exercises: {
                include: {
                    exercise: true,
                },
                orderBy: {
                    order: "asc",
                },
            },
        },
        orderBy: {
            createdAt: "desc",
        },
    });
}
async function getRoutineById(id) {
    return prisma_js_1.prisma.routine.findUnique({
        where: {
            id,
        },
        include: {
            exercises: {
                include: {
                    exercise: true,
                },
                orderBy: {
                    order: "asc",
                },
            },
        },
    });
}
async function createRoutine(input) {
    return prisma_js_1.prisma.routine.create({
        data: {
            name: input.name,
            description: input.description ?? null,
        },
    });
}
async function updateRoutine(id, input) {
    return prisma_js_1.prisma.routine.update({
        where: {
            id,
        },
        data: {
            name: input.name,
            description: input.description ?? null,
        },
    });
}
async function deleteRoutine(id) {
    return prisma_js_1.prisma.routine.delete({
        where: {
            id,
        },
    });
}
