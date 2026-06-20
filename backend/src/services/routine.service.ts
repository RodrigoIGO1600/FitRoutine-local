import { prisma } from "../db/prisma.js";

export async function getRoutines() {
  return prisma.routine.findMany({
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

export async function getRoutineById(id: number) {
  return prisma.routine.findUnique({
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

export async function createRoutine(input: {
  name: string;
  description?: string | null;
}) {
  return prisma.routine.create({
    data: {
      name: input.name,
      description: input.description ?? null,
    },
  });
}

export async function updateRoutine(
  id: number,
  input: {
    name: string;
    description?: string | null;
  }
) {
  return prisma.routine.update({
    where: {
      id,
    },
    data: {
      name: input.name,
      description: input.description ?? null,
    },
  });
}

export async function deleteRoutine(id: number) {
  return prisma.routine.delete({
    where: {
      id,
    },
  });
}