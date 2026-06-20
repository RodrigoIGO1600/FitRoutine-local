import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getRoutineById } from "../api/routineApi";
import { getMuscleGroupImage } from "../utils/muscleGroupImage";
import { getYouTubeThumbnail } from "../utils/youtube";
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

export function RoutineSummaryPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const routineId = Number(id);

  const [routine, setRoutine] = useState<RoutineDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadRoutine = useCallback(async () => {
    if (Number.isNaN(routineId)) {
      setError("Rutina no válida");
      setIsLoading(false);
      return;
    }

    setError(null);

    try {
      const result = await getRoutineById(routineId);
      setRoutine(result);
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
  const estimatedMin = estimateMinutes(routine.exercises);

  return (
    <div className="routine-summary">
      <header className="routine-summary__toolbar">
        <button
          type="button"
          className="routine-summary__back"
          onClick={() => navigate("/")}
          aria-label="Volver"
        >
          ←
        </button>
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

        {routine.exercises.length > 0 && (
          <ul className="routine-summary__exercises">
            {routine.exercises.map((re) => {
              const muscleImage = getMuscleGroupImage(re.exercise.muscleGroup);
              const thumbnail = getYouTubeThumbnail(re.exercise.videoUrl);

              return (
                <li key={re.id} className="routine-summary__exercise-row">
                  {thumbnail ? (
                    <img
                      src={thumbnail}
                      alt={re.exercise.name}
                      className="routine-summary__exercise-thumb routine-summary__exercise-thumb--img"
                    />
                  ) : (
                    <div
                      className="routine-summary__exercise-thumb"
                      aria-hidden="true"
                    />
                  )}

                  <div className="routine-summary__exercise-info">
                    <p className="routine-summary__exercise-name">
                      {re.exercise.name}
                    </p>
                    <p className="routine-summary__exercise-meta">
                      {re.sets} sets x {re.reps} reps
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
          onClick={() => {}}
        >
          Iniciar Rutina
        </button>
      </footer>
    </div>
  );
}
