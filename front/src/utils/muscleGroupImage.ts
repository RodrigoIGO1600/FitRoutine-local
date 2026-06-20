import hombroImg from "../assets/hombro.png";
import pechoImg from "../assets/pecho.png";
import bicepImg from "../assets/bicep.png";
import antebrazoImg from "../assets/antebrazo.png";
import tricepImg from "../assets/tricep.png";
import backImg from "../assets/back.png";

const muscleGroupImageMap: Record<string, string> = {
  shoulders: hombroImg,
  chest: pechoImg,
  biceps: bicepImg,
  forearm: antebrazoImg,
  triceps: tricepImg,
  back: backImg,
  traps: backImg,
};

export function getMuscleGroupImage(muscleGroup: string): string | null {
  return muscleGroupImageMap[muscleGroup.toLowerCase()] ?? null;
}
