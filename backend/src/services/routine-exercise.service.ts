import { prisma } from "../db/prisma.js";

export async function getRoutineById(id: string) {
  return prisma.routine.findUnique({
    where: {
      id,
    },
  });
}

export async function getExerciseById(id: string) {
  return prisma.exercise.findUnique({
    where: {
      id,
    },
  });
}

export async function getRoutineExerciseById(id: string) {
  return prisma.routineExercise.findUnique({
    where: {
      id,
    },
  });
}

export async function createRoutineExercise(input: {
  routineId: string;
  exerciseId: string;
  sets: number;
  reps: number;
  repsList?: string | null;
  weight?: number | null;
  restSeconds: number;
  restBetweenSeconds?: number;
  order: number;
  notes?: string | null;
}) {
  return prisma.routineExercise.create({
    data: {
      routineId: input.routineId,
      exerciseId: input.exerciseId,
      sets: input.sets,
      reps: input.reps,
      repsList: input.repsList ?? null,
      weight: input.weight ?? null,
      restSeconds: input.restSeconds,
      restBetweenSeconds: input.restBetweenSeconds ?? 60,
      order: input.order,
      notes: input.notes ?? null,
    },
    include: {
      exercise: true,
    },
  });
}

export async function updateRoutineExercise(
  id: string,
  input: {
    sets?: number;
    reps?: number;
    repsList?: string | null;
    weight?: number | null;
    restSeconds?: number;
    restBetweenSeconds?: number;
    order?: number;
    notes?: string | null;
  }
) {
  const existingRoutineExercise = await getRoutineExerciseById(id);

  if (!existingRoutineExercise) {
    return null;
  }

  return prisma.routineExercise.update({
    where: {
      id,
    },
    data: {
      sets: input.sets ?? existingRoutineExercise.sets,
      reps: input.reps ?? existingRoutineExercise.reps,
      repsList:
        input.repsList !== undefined
          ? input.repsList
          : existingRoutineExercise.repsList,
      weight:
        input.weight !== undefined
          ? input.weight
          : existingRoutineExercise.weight,
      restSeconds: input.restSeconds ?? existingRoutineExercise.restSeconds,
      restBetweenSeconds:
        input.restBetweenSeconds ?? existingRoutineExercise.restBetweenSeconds,
      order: input.order ?? existingRoutineExercise.order,
      notes:
        input.notes !== undefined
          ? input.notes
          : existingRoutineExercise.notes,
    },
    include: {
      exercise: true,
    },
  });
}

export async function deleteRoutineExercise(id: string) {
  return prisma.routineExercise.delete({
    where: {
      id,
    },
  });
}
