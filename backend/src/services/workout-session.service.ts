import { prisma } from "../db/prisma.js";

export async function getWorkoutSessions() {
  return prisma.workoutSession.findMany({
    orderBy: {
      completedAt: "desc",
    },
  });
}

export async function createWorkoutSession(input: {
  routineId?: string | null;
  routineName: string;
  durationSeconds: number;
  totalSets: number;
  totalReps: number;
  totalVolume?: number;
}) {
  return prisma.workoutSession.create({
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

export async function getWorkoutSessionById(id: string) {
  return prisma.workoutSession.findUnique({
    where: {
      id,
    },
  });
}

export async function deleteWorkoutSession(id: string) {
  return prisma.workoutSession.delete({
    where: {
      id,
    },
  });
}
