import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Icon } from "@iconify/react";
import { getRoutineById } from "../api/routineApi";
import { getWorkoutSessions } from "../api/workoutSessionApi";
import { getMuscleGroupImage } from "../utils/muscleGroupImage";
import { getYouTubeThumbnail } from "../utils/youtube";
import {
  clearWorkoutProgress,
  hasWorkoutProgress,
} from "../utils/workoutStorage";
import type { RoutineDetail } from "../types/routine";
import "./RoutineSummaryPage.css";

function estimateMinutes(exercises: RoutineDetail["exercises"]): number {
  let totalSeconds = 0;

  for (const re of exercises) {
    const setTime = 45;
    totalSeconds += re.sets * (setTime + re.restSeconds);
  }

  return Math.round(totalSeconds / 60);
}

function parseRepsList(repsList: string | null): number[] | null {
  if (!repsList) {
    return null;
  }

  try {
    const parsed = JSON.parse(repsList);
    return Array.isArray(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

function repsDisplay(reps: number, repsList: string | null): string {
  const list = parseRepsList(repsList);

  if (!list || list.length === 0) {
    return `${reps} reps`;
  }

  const min = Math.min(...list);
  const max = Math.max(...list);
  return min === max ? `${min} reps` : `${min}-${max} reps`;
}

export function RoutineSummaryPage() {
  const { id: routineId } = useParams();
  const navigate = useNavigate();

  const [routine, setRoutine] = useState<RoutineDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [resumable, setResumable] = useState(false);
  const [avgDuration, setAvgDuration] = useState<number | null>(null);

  const loadRoutine = useCallback(async () => {
    if (!routineId) {
      setError("Rutina no válida");
      setIsLoading(false);
      return;
    }

    setError(null);
    setResumable(hasWorkoutProgress(routineId));
    setAvgDuration(null);

    try {
      const [result, sessions] = await Promise.all([
        getRoutineById(routineId),
        getWorkoutSessions(routineId),
      ]);

      setRoutine(result);

      if (sessions.length > 0) {
        const total = sessions.reduce((sum, s) => sum + s.durationSeconds, 0);
        setAvgDuration(Math.round(total / sessions.length));
      }
    } catch {
      setError("No se pudo cargar la rutina");
    } finally {
      setIsLoading(false);
    }
  }, [routineId]);

  useEffect(() => {
    loadRoutine();
  }, [loadRoutine]);

  if (isLoading) {
    return (
      <div className="routine-summary">
        <p className="routine-summary__loading">Cargando rutina...</p>
      </div>
    );
  }

  if (error || !routine) {
    return (
      <div className="routine-summary">
        <div className="routine-summary__state routine-summary__state--error">
          <p>{error ?? "Rutina no encontrada"}</p>
          <button
            type="button"
            className="btn btn--ghost"
            onClick={() => navigate("/")}
          >
            Volver
          </button>
        </div>
      </div>
    );
  }

  const exerciseCount = routine.exercises.length;
  const estimatedMin =
    avgDuration !== null
      ? Math.round(avgDuration / 60)
      : estimateMinutes(routine.exercises);

  return (
    <div className="routine-summary">
      <header className="routine-summary__toolbar">
        <button
          type="button"
          className="routine-summary__back"
          onClick={() => navigate("/")}
          aria-label="Volver"
        >
          <Icon icon="solar:arrow-left-linear" />
        </button>

        <div className="routine-summary__toolbar-center">
          <h1 className="routine-summary__name">{routine.name}</h1>
          <div className="routine-summary__stats">
            <span className="routine-summary__stat">
              <span className="routine-summary__stat-icon">⚡</span>
              {exerciseCount} Ejercicios
            </span>
            <span className="routine-summary__stat">
              <span className="routine-summary__stat-icon">🕐</span>
              {estimatedMin} Min
            </span>
          </div>
        </div>

        <button
          type="button"
          className="routine-summary__customize"
          onClick={() => navigate(`/routines/${routineId}/edit`)}
        >
          Personalizar
        </button>
      </header>

      {routine.description && (
        <p className="routine-summary__category">{routine.description}</p>
      )}

      <section className="routine-summary__card">
        <div className="routine-summary__mobile-header">
          <h1 className="routine-summary__name">{routine.name}</h1>
          <div className="routine-summary__stats">
            <span className="routine-summary__stat">
              <span className="routine-summary__stat-icon">⚡</span>
              {exerciseCount} Ejercicios
            </span>
            <span className="routine-summary__stat">
              <span className="routine-summary__stat-icon">🕐</span>
              {estimatedMin} Min
            </span>
          </div>
        </div>

        {routine.exercises.length > 0 && (
          <ul className="routine-summary__exercises">
            {routine.exercises.map((re) => {
              const muscleImage = getMuscleGroupImage(re.exercise.muscleGroup);
              const thumbnail = getYouTubeThumbnail(re.exercise.videoUrl);

              return (
                <li key={re.id} className="routine-summary__exercise-row">
                  <span className="routine-summary__exercise-order">{re.order}</span>
                  <div className="routine-summary__exercise-thumb">
                    {thumbnail ? (
                      <img
                        src={thumbnail}
                        alt={re.exercise.name}
                        className="routine-summary__exercise-thumb-img"
                      />
                    ) : (
                      <span className="routine-summary__exercise-thumb-placeholder">
                        {re.exercise.name.charAt(0)}
                      </span>
                    )}
                  </div>

                  <div className="routine-summary__exercise-info">
                    <p className="routine-summary__exercise-name">
                      {re.exercise.name}
                    </p>
                    <p className="routine-summary__exercise-meta">
                      {re.sets} sets x {repsDisplay(re.reps, re.repsList)}
                    </p>
                  </div>

                  {muscleImage && (
                    <img
                      src={muscleImage}
                      alt={re.exercise.muscleGroup}
                      className="routine-summary__exercise-muscle"
                    />
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </section>

      <footer className="routine-summary__footer">
        <button
          type="button"
          className="routine-summary__start-btn"
          onClick={() => navigate(`/routines/${routineId}/workout`)}
          disabled={exerciseCount === 0}
        >
          {resumable ? "Reanudar entrenamiento" : "Iniciar Rutina"}
        </button>

        {resumable && (
          <button
            type="button"
            className="routine-summary__restart-btn"
            onClick={() => {
              if (
                !window.confirm(
                  "¿Empezar de cero? Se borrará el progreso guardado."
                )
              ) {
                return;
              }
              if (routineId) {
                clearWorkoutProgress(routineId);
              }
              setResumable(false);
              navigate(`/routines/${routineId}/workout`);
            }}
          >
            <Icon icon="solar:restart-linear" style={{ verticalAlign: "middle", marginRight: "6px" }} />
            Empezar de cero
          </button>
        )}
      </footer>
    </div>
  );
}
