import { prisma } from "../db/prisma.js";

export async function getRoutineById(id: number) {
  return prisma.routine.findUnique({
    where: {
      id,
    },
  });
}

export async function getExerciseById(id: number) {
  return prisma.exercise.findUnique({
    where: {
      id,
    },
  });
}

export async function getRoutineExerciseById(id: number) {
  return prisma.routineExercise.findUnique({
    where: {
      id,
    },
  });
}

export async function createRoutineExercise(input: {
  routineId: number;
  exerciseId: number;
  sets: number;
  reps: number;
  weight?: number | null;
  restSeconds: number;
  order: number;
  notes?: string | null;
}) {
  return prisma.routineExercise.create({
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

export async function updateRoutineExercise(
  id: number,
  input: {
    sets?: number;
    reps?: number;
    weight?: number | null;
    restSeconds?: number;
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
      weight:
        input.weight !== undefined
          ? input.weight
          : existingRoutineExercise.weight,
      restSeconds: input.restSeconds ?? existingRoutineExercise.restSeconds,
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

export async function deleteRoutineExercise(id: number) {
  return prisma.routineExercise.delete({
    where: {
      id,
    },
  });
}