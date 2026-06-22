import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { createExercise } from "../api/exerciseApi";
import "./CreateExercisePage.css";

const MUSCLE_GROUPS: { value: string; label: string }[] = [
  { value: "shoulders", label: "Hombros" },
  { value: "chest", label: "Pecho" },
  { value: "back", label: "Espalda" },
  { value: "biceps", label: "Bíceps" },
  { value: "triceps", label: "Tríceps" },
  { value: "forearm", label: "Antebrazo" },
  { value: "traps", label: "Trapecios" },
  { value: "legs", label: "Piernas" },
  { value: "glutes", label: "Glúteos" },
  { value: "core", label: "Core" },
];

const CATEGORIES: { value: string; label: string }[] = [
  { value: "strength", label: "Fuerza" },
  { value: "cardio", label: "Cardio" },
  { value: "mobility", label: "Movilidad" },
  { value: "stretching", label: "Estiramiento" },
];

const EQUIPMENT: { value: string; label: string }[] = [
  { value: "bodyweight", label: "Peso corporal" },
  { value: "dumbbell", label: "Mancuerna" },
  { value: "barbell", label: "Barra" },
  { value: "machine", label: "Máquina" },
  { value: "kettlebell", label: "Kettlebell" },
  { value: "band", label: "Banda" },
  { value: "cable", label: "Polea" },
  { value: "other", label: "Otro" },
];

function isValidUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

export function CreateExercisePage() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [description, setDescription] = useState("");
  const [muscleGroup, setMuscleGroup] = useState("");
  const [category, setCategory] = useState("strength");
  const [equipment, setEquipment] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    const trimmedName = name.trim();
    const trimmedUrl = videoUrl.trim();
    const trimmedDescription = description.trim();

    if (
      !trimmedName ||
      !trimmedUrl ||
      !trimmedDescription ||
      !muscleGroup ||
      !category ||
      !equipment
    ) {
      setError("Todos los campos son obligatorios.");
      return;
    }

    if (!isValidUrl(trimmedUrl)) {
      setError("La URL del video no es válida.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await createExercise({
        name: trimmedName,
        category,
        muscleGroup,
        equipment,
        description: trimmedDescription,
        videoUrl: trimmedUrl,
      });

      navigate(-1);
    } catch {
      setError("No se pudo crear el ejercicio. Intenta de nuevo.");
      setIsSubmitting(false);
    }
  }

  return (
    <div className="create-exercise">
      <header className="create-exercise__toolbar">
        <button
          type="button"
          className="create-exercise__back"
          onClick={() => navigate(-1)}
          aria-label="Volver"
          disabled={isSubmitting}
        >
          ←
        </button>
        <h1 className="create-exercise__title">Nuevo ejercicio</h1>
        <span className="create-exercise__toolbar-spacer" aria-hidden="true" />
      </header>

      <form className="create-exercise__form" onSubmit={handleSubmit}>
        <label className="create-exercise__field">
          <span className="create-exercise__label">Título</span>
          <input
            className="create-exercise__input"
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Ej. Press de banca con mancuernas"
            maxLength={120}
          />
        </label>

        <label className="create-exercise__field">
          <span className="create-exercise__label">URL del video</span>
          <input
            className="create-exercise__input"
            type="url"
            inputMode="url"
            value={videoUrl}
            onChange={(event) => setVideoUrl(event.target.value)}
            placeholder="https://www.youtube.com/watch?v=..."
          />
        </label>

        <label className="create-exercise__field">
          <span className="create-exercise__label">Grupo muscular</span>
          <select
            className="create-exercise__input"
            value={muscleGroup}
            onChange={(event) => setMuscleGroup(event.target.value)}
          >
            <option value="" disabled>
              Selecciona un grupo muscular
            </option>
            {MUSCLE_GROUPS.map((group) => (
              <option key={group.value} value={group.value}>
                {group.label}
              </option>
            ))}
          </select>
        </label>

        <label className="create-exercise__field">
          <span className="create-exercise__label">Categoría</span>
          <select
            className="create-exercise__input"
            value={category}
            onChange={(event) => setCategory(event.target.value)}
          >
            {CATEGORIES.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
        </label>

        <label className="create-exercise__field">
          <span className="create-exercise__label">Equipo</span>
          <select
            className="create-exercise__input"
            value={equipment}
            onChange={(event) => setEquipment(event.target.value)}
          >
            <option value="" disabled>
              Selecciona el equipo
            </option>
            {EQUIPMENT.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
        </label>

        <label className="create-exercise__field">
          <span className="create-exercise__label">Descripción</span>
          <textarea
            className="create-exercise__input create-exercise__textarea"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder="Describe cómo se realiza el ejercicio"
            rows={4}
            maxLength={500}
          />
        </label>

        {error && (
          <p className="create-exercise__error" role="alert">
            {error}
          </p>
        )}

        <button
          type="submit"
          className="create-exercise__submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Guardando..." : "Guardar ejercicio"}
        </button>
      </form>
    </div>
  );
}
