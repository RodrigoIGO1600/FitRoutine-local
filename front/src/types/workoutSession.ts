export type WorkoutSession = {
  id: string;
  routineId: string | null;
  routineName: string;
  durationSeconds: number;
  totalSets: number;
  totalReps: number;
  totalVolume: number;
  completedAt: string;
};

export type CreateWorkoutSessionInput = {
  routineId?: string | null;
  routineName: string;
  durationSeconds: number;
  totalSets: number;
  totalReps: number;
  totalVolume?: number;
};
