export type Exercise = {
  id: string;
  name: string;
  category: string;
  muscleGroup: string;
  equipment: string;
  description: string | null;
  videoUrl: string | null;
  isTimed: boolean;
  createdAt: string;
};
