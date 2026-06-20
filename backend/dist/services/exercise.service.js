"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getExercises = getExercises;
const prisma_js_1 = require("../db/prisma.js");
async function getExercises() {
    return prisma_js_1.prisma.exercise.findMany({
        orderBy: {
            name: "asc",
        },
    });
}
