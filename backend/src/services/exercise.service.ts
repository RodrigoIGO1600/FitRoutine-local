import { prisma } from "../db/prisma.js";

export async function getExercises() {
  return prisma.exercise.findMany({
    orderBy: {
      name: "asc",
    },
  });
}