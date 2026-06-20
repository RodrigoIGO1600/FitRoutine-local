"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRoutineById = getRoutineById;
exports.getExerciseById = getExerciseById;
exports.getRoutineExerciseById = getRoutineExerciseById;
exports.createRoutineExercise = createRoutineExercise;
exports.updateRoutineExercise = updateRoutineExercise;
exports.deleteRoutineExercise = deleteRoutineExercise;
const prisma_js_1 = require("../db/prisma.js");
async function getRoutineById(id) {
    return prisma_js_1.prisma.routine.findUnique({
        where: {
            id,
        },
    });
}
async function getExerciseById(id) {
    return prisma_js_1.prisma.exercise.findUnique({
        where: {
            id,
        },
    });
}
async function getRoutineExerciseById(id) {
    return prisma_js_1.prisma.routineExercise.findUnique({
        where: {
            id,
        },
    });
}
async function createRoutineExercise(input) {
    return prisma_js_1.prisma.routineExercise.create({
        data: {
            routineId: input.routineId,
            exerciseId: input.exerciseId,
            sets: input.sets,
            reps: input.reps,
            weight: input.weight ?? null,
            restSeconds: input.restSeconds,
            order: input.order,
            notes: input.notes ?? null,
        },
        include: {
            exercise: true,
        },
    });
}
async function updateRoutineExercise(id, input) {
    const existingRoutineExercise = await getRoutineExerciseById(id);
    if (!existingRoutineExercise) {
        return null;
    }
    return prisma_js_1.prisma.routineExercise.update({
        where: {
            id,
        },
        data: {
            sets: input.sets ?? existingRoutineExercise.sets,
            reps: input.reps ?? existingRoutineExercise.reps,
            weight: input.weight !== undefined
                ? input.weight
                : existingRoutineExercise.weight,
            restSeconds: input.restSeconds ?? existingRoutineExercise.restSeconds,
            order: input.order ?? existingRoutineExercise.order,
            notes: input.notes !== undefined
                ? input.notes
                : existingRoutineExercise.notes,
        },
        include: {
            exercise: true,
        },
    });
}
async function deleteRoutineExercise(id) {
    return prisma_js_1.prisma.routineExercise.delete({
        where: {
            id,
        },
    });
}
