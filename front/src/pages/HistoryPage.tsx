import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react";
import {
  deleteWorkoutSession,
  getWorkoutSessions,
} from "../api/workoutSessionApi";
import type { WorkoutSession } from "../types/workoutSession";
import "./HistoryPage.css";

function formatDuration(totalSeconds: number): string {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (hours > 0) {
    return `${hours}h ${String(minutes).padStart(2, "0")}m`;
  }

  return `${minutes}m ${String(seconds).padStart(2, "0")}s`;
}

function formatDate(iso: string): string {
  const date = new Date(iso);

  return date.toLocaleString("es-MX", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function HistoryPage() {
  const navigate = useNavigate();
  const [sessions, setSessions] = useState<WorkoutSession[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const loadSessions = useCallback(async () => {
    setError(null);

    try {
      const result = await getWorkoutSessions();
      setSessions(Array.isArray(result) ? result : []);
    } catch {
      setError("No se pudo cargar el historial");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSessions();
  }, [loadSessions]);

  const totals = useMemo(() => {
    return sessions.reduce(
      (acc, session) => ({
        workouts: acc.workouts + 1,
        seconds: acc.seconds + session.durationSeconds,
        reps: acc.reps + session.totalReps,
      }),
      { workouts: 0, seconds: 0, reps: 0 }
    );
  }, [sessions]);

  async function handleDelete(id: string) {
    if (!window.confirm("¿Borrar este entrenamiento del historial?")) {
      return;
    }

    setDeletingId(id);

    try {
      await deleteWorkoutSession(id);
      setSessions((current) => current.filter((session) => session.id !== id));
    } catch {
      setError("No se pudo borrar el entrenamiento");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="history">
      <header className="history__toolbar">
        <button
          type="button"
          className="history__back"
          onClick={() => navigate("/")}
          aria-label="Volver"
        >
          <Icon icon="solar:arrow-left-linear" />
        </button>
        <h1 className="history__title">Historial</h1>
        <span className="history__toolbar-spacer" aria-hidden="true" />
      </header>

      {!isLoading && !error && sessions.length > 0 && (
        <section className="history__summary">
          <div className="history__summary-item">
            <span className="history__summary-value">{totals.workouts}</span>
            <span className="history__summary-label">Entrenamientos</span>
          </div>
          <div className="history__summary-item">
            <span className="history__summary-value">
              {Math.round(totals.seconds / 60)}
            </span>
            <span className="history__summary-label">Minutos</span>
          </div>
          <div className="history__summary-item">
            <span className="history__summary-value">{totals.reps}</span>
            <span className="history__summary-label">Reps</span>
          </div>
        </section>
      )}

      <main className="history__content">
        {isLoading && <p className="history__state">Cargando historial...</p>}

        {!isLoading && error && (
          <div className="history__state history__state--error">
            <p>{error}</p>
            <button
              type="button"
              className="btn btn--ghost"
              onClick={() => {
                setIsLoading(true);
                loadSessions();
              }}
            >
              Reintentar
            </button>
          </div>
        )}

        {!isLoading && !error && sessions.length === 0 && (
          <div className="history__state">
            <p className="history__empty-title">Aún no hay entrenamientos</p>
            <p className="history__empty-text">
              Cuando termines una rutina, aparecerá aquí.
            </p>
          </div>
        )}

        {!isLoading && !error && sessions.length > 0 && (
          <ul className="history__list">
            {sessions.map((session) => (
              <li key={session.id} className="history__item">
                <div className="history__item-info">
                  <p className="history__item-name">{session.routineName}</p>
                  <p className="history__item-date">
                    {formatDate(session.completedAt)}
                  </p>
                  <div className="history__item-meta">
                    <span>{formatDuration(session.durationSeconds)}</span>
                    <span>·</span>
                    <span>{session.totalSets} series</span>
                    <span>·</span>
                    <span>{session.totalReps} reps</span>
                  </div>
                </div>

                <button
                  type="button"
                  className="history__delete"
                  onClick={() => handleDelete(session.id)}
                  disabled={deletingId === session.id}
                  aria-label={`Borrar entrenamiento de ${session.routineName}`}
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="3 6 5 6 21 6" />
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                  </svg>
                </button>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}
