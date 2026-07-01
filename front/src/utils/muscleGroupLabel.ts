import type { Language, TranslationKey } from "../i18n";
import { t } from "../i18n";

const MUSCLE_KEYS: Record<string, TranslationKey> = {
  shoulders: "muscleShoulders",
  chest: "muscleChest",
  biceps: "muscleBiceps",
  forearm: "muscleForearm",
  triceps: "muscleTriceps",
  back: "muscleBack",
  traps: "muscleTraps",
  legs: "muscleLegs",
  glutes: "muscleGlutes",
  core: "muscleCore",
};

export function muscleLabel(muscleGroup: string, lang: Language = "es"): string {
  const key = MUSCLE_KEYS[muscleGroup.toLowerCase()];
  if (key) {
    return t(key, lang);
  }
  return muscleGroup.toUpperCase();
}
