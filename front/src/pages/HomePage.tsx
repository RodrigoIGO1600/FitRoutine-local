import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createRoutine, deleteRoutine, getRoutines } from "../api/routineApi";
import { CreateRoutineSheet } from "../components/CreateRoutineSheet";
import { SwipeableRoutineCard } from "../components/SwipeableRoutineCard";
import { useTranslation } from "../context/LanguageContext";
import type { Routine } from "../types/routine";
import "./HomePage.css";

export function HomePage() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [routines, setRoutines] = useState<Routine[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [revealedRoutineId, setRevealedRoutineId] = useState<string | null>(
    null
  );
  const [deletingRoutineId, setDeletingRoutineId] = useState<string | null>(
    null
  );

  const loadRoutines = useCallback(async () => {
    setError(null);

    try {
      const result = await getRoutines();
      setRoutines(result);
    } catch {
      setError(t("errorLoadRoutines"));
    } finally {
      setIsLoading(false);
    }
  }, [t]);

  useEffect(() => {
    loadRoutines();
  }, [loadRoutines]);

  async function handleDeleteRoutine(routineId: string) {
    const confirmed = window.confirm(t("confirmDeleteRoutine"));
    if (!confirmed) return;

    setDeletingRoutineId(routineId);
    setError(null);

    try {
      await deleteRoutine(routineId);
      setRoutines((current) =>
        current.filter((routine) => routine.id !== routineId)
      );
      setRevealedRoutineId(null);
    } catch {
      setError(t("errorDeleteRoutine"));
    } finally {
      setDeletingRoutineId(null);
    }
  }

  async function handleCreateRoutine(input: {
    name: string;
    description?: string;
  }) {
    setIsSubmitting(true);

    try {
      const routine = await createRoutine(input);
      setRoutines((current) => [routine, ...current]);
      setIsSheetOpen(false);
    } catch {
      setError(t("errorCreateRoutine"));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="home">
      <header className="home__header">
        <div className="home__title-group">
          <p className="home__eyebrow">FitRoutine</p>
          <h1 className="home__title">{t("myRoutines")}</h1>
        </div>
        <div className="home__header-actions">
          <button
            type="button"
            className="home__icon-btn"
            onClick={() => navigate("/exercises/new")}
            aria-label={t("createExercise")}
          >
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M14.4 14.4 9.6 9.6" />
              <path d="M18.657 21.485a2 2 0 1 1-2.829-2.828l-1.767 1.768a2 2 0 1 1-2.829-2.829l6.364-6.364a2 2 0 1 1 2.829 2.829l-1.768 1.767a2 2 0 1 1 2.828 2.829z" />
              <path d="m21.5 21.5-1.4-1.4" />
              <path d="M3.9 3.9 2.5 2.5" />
              <path d="M6.404 12.768a2 2 0 1 1-2.829-2.829l1.768-1.767a2 2 0 1 1-2.828-2.829l2.828-2.828a2 2 0 1 1 2.829 2.828l1.767-1.768a2 2 0 1 1 2.829 2.829z" />
            </svg>
          </button>
          <button
            type="button"
            className="home__icon-btn"
            onClick={() => navigate("/history")}
            aria-label={t("viewHistory")}
          >
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M3 3v5h5" />
              <path d="M3.05 13A9 9 0 1 0 6 5.3L3 8" />
              <path d="M12 7v5l4 2" />
            </svg>
          </button>
          <button
            type="button"
            className="home__icon-btn"
            onClick={() => navigate("/settings")}
            aria-label={t("navSettings")}
          >
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="3" />
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
            </svg>
          </button>
        </div>
      </header>

      <main
        className="home__content"
        onClick={() => setRevealedRoutineId(null)}
      >
        {isLoading && (
          <div className="home__state">
            <p>{t("loadingRoutines")}</p>
          </div>
        )}

        {!isLoading && error && (
          <div className="home__state home__state--error">
            <p>{error}</p>
            <button
              type="button"
              className="btn btn--ghost"
              onClick={() => {
                setIsLoading(true);
                loadRoutines();
              }}
            >
              {t("retry")}
            </button>
          </div>
        )}

        {!isLoading && !error && routines.length === 0 && (
          <div className="home__state">
            <p className="home__empty-title">{t("emptyRoutines")}</p>
            <p className="home__empty-text">
              {t("emptyRoutinesHint")}
            </p>
          </div>
        )}

        {!isLoading && !error && routines.length > 0 && (
          <ul className="routine-list">
            {routines.map((routine) => (
              <li
                key={routine.id}
                onClick={(event) => event.stopPropagation()}
              >
                <SwipeableRoutineCard
                  routine={routine}
                  isRevealed={revealedRoutineId === routine.id}
                  isDeleting={deletingRoutineId === routine.id}
                  onReveal={() => setRevealedRoutineId(routine.id)}
                  onHide={() =>
                    setRevealedRoutineId((current) =>
                      current === routine.id ? null : current
                    )
                  }
                  onDelete={() => handleDeleteRoutine(routine.id)}
                  onOpen={() => navigate(`/routines/${routine.id}`)}
                />
              </li>
            ))}
          </ul>
        )}
      </main>

      <footer className="home__footer">
        <button
          type="button"
          className="btn btn--create"
          onClick={() => setIsSheetOpen(true)}
        >
          {t("createRoutine")}
        </button>
      </footer>

      <CreateRoutineSheet
        isOpen={isSheetOpen}
        isSubmitting={isSubmitting}
        onClose={() => setIsSheetOpen(false)}
        onSubmit={handleCreateRoutine}
      />

    </div>
  );
}
