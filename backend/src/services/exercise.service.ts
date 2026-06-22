import { prisma } from "../db/prisma.js";

export async function getExercises() {
  return prisma.exercise.findMany({
    orderBy: {
      name: "asc",
    },
  });
}

export async function createExercise(input: {
  name: string;
  category: string;
  muscleGroup: string;
  equipment: string;
  description?: string | null;
  videoUrl?: string | null;
}) {
  return prisma.exercise.create({
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