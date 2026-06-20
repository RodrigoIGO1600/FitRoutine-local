import { useEffect, useState } from "react";
import "./App.css";
import { getExercises } from "./api/exerciseApi";
import { ExerciseCard } from "./components/ExerciseCard";
import type { Exercise } from "./types/exercise";

function App() {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadExercises() {
      try {
        const result = await getExercises();
        setExercises(result);
      } catch {
        setError("No se pudieron cargar los ejercicios");
      } finally {
        setIsLoading(false);
      }
    }

    loadExercises();
  }, []);

  return (
    <main className="app">
      <section className="page">
        <header className="page-header">
          <p className="eyebrow">FitRoutine Local</p>
          <h1>Ejercicios</h1>
          <p className="description">
            Estos ejercicios vienen desde tu backend local y están guardados en
            SQLite.
          </p>
        </header>

        {isLoading && <p>Cargando ejercicios...</p>}

        {error && <p className="error">{error}</p>}

        {!isLoading && !error && (
          <div className="exercise-list">
            {exercises.map((exercise) => (
              <ExerciseCard key={exercise.id} exercise={exercise} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

export default App;