const MUSCLE_LABELS: Record<string, string> = {
  shoulders: "Hombros",
  chest: "Pecho",
  biceps: "Bíceps",
  forearm: "Antebrazo",
  triceps: "Tríceps",
  back: "Espalda",
  traps: "Trapecio",
  legs: "Piernas",
  glutes: "Glúteos",
  core: "Core",
};

export function muscleLabel(muscleGroup: string): string {
  return MUSCLE_LABELS[muscleGroup.toLowerCase()] ?? muscleGroup.toUpperCase();
}
