"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getExercises = getExercises;
exports.createExercise = createExercise;
const prisma_js_1 = require("../db/prisma.js");
async function getExercises() {
    return prisma_js_1.prisma.exercise.findMany({
        orderBy: {
            name: "asc",
        },
    });
}
async function createExercise(input) {
    return prisma_js_1.prisma.exercise.create({
        data: {
            name: input.name,
            category: input.category,
            muscleGroup: input.muscleGroup,
            equipment: input.equipment,
            description: input.description ?? null,
            videoUrl: input.videoUrl ?? null,
        },
    });
}
