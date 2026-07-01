import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react";
import { createExercise } from "../api/exerciseApi";
import { useTranslation } from "../context/LanguageContext";
import "./CreateExercisePage.css";

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
  const { t } = useTranslation();

  const MUSCLE_GROUPS: { value: string; label: string }[] = [
    { value: "shoulders", label: t("muscleShoulders") },
    { value: "chest", label: t("muscleChest") },
    { value: "back", label: t("muscleBack") },
    { value: "biceps", label: t("muscleBiceps") },
    { value: "triceps", label: t("muscleTriceps") },
    { value: "forearm", label: t("muscleForearm") },
    { value: "traps", label: t("muscleTraps") },
    { value: "legs", label: t("muscleLegs") },
    { value: "glutes", label: t("muscleGlutes") },
    { value: "core", label: t("muscleCore") },
  ];

  const CATEGORIES: { value: string; label: string }[] = [
    { value: "strength", label: t("categoryStrength") },
    { value: "cardio", label: t("categoryCardio") },
    { value: "mobility", label: t("categoryMobility") },
    { value: "stretching", label: t("categoryStretching") },
  ];

  const EQUIPMENT: { value: string; label: string }[] = [
    { value: "bodyweight", label: t("equipmentBodyweight") },
    { value: "dumbbell", label: t("equipmentDumbbell") },
    { value: "barbell", label: t("equipmentBarbell") },
    { value: "machine", label: t("equipmentMachine") },
    { value: "kettlebell", label: t("equipmentKettlebell") },
    { value: "band", label: t("equipmentBand") },
    { value: "cable", label: t("equipmentCable") },
    { value: "other", label: t("equipmentOther") },
  ];

  const [name, setName] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [description, setDescription] = useState("");
  const [muscleGroup, setMuscleGroup] = useState("");
  const [category, setCategory] = useState("strength");
  const [equipment, setEquipment] = useState("");
  const [isTimed, setIsTimed] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    const trimmedName = name.trim();
    const trimmedUrl = videoUrl.trim();
    const trimmedDescription = description.trim();

    if (!trimmedName || !trimmedUrl || !muscleGroup || !category || !equipment) {
      setError(t("requiredFieldsError"));
      return;
    }

    if (!isValidUrl(trimmedUrl)) {
      setError(t("invalidVideoUrl"));
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
        description: trimmedDescription || null,
        videoUrl: trimmedUrl,
        isTimed,
      });

      navigate(-1);
    } catch {
      setError(t("errorCreateExercise"));
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
          aria-label={t("back")}
          disabled={isSubmitting}
        >
          <Icon icon="solar:arrow-left-linear" />
        </button>
        <h1 className="create-exercise__title">{t("newExercise")}</h1>
        <span className="create-exercise__toolbar-spacer" aria-hidden="true" />
      </header>

      <form className="create-exercise__form" onSubmit={handleSubmit}>
        <label className="create-exercise__field">
          <span className="create-exercise__label">{t("exerciseTitle")}</span>
          <input
            className="create-exercise__input"
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder={t("exerciseTitlePlaceholder")}
            maxLength={120}
          />
        </label>

        <label className="create-exercise__field">
          <span className="create-exercise__label">{t("exerciseVideoUrl")}</span>
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
          <span className="create-exercise__label">{t("exerciseMuscleGroup")}</span>
          <select
            className="create-exercise__input"
            value={muscleGroup}
            onChange={(event) => setMuscleGroup(event.target.value)}
          >
            <option value="" disabled>
              {t("selectMuscleGroup")}
            </option>
            {MUSCLE_GROUPS.map((group) => (
              <option key={group.value} value={group.value}>
                {group.label}
              </option>
            ))}
          </select>
        </label>

        <label className="create-exercise__field">
          <span className="create-exercise__label">{t("exerciseCategory")}</span>
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
          <span className="create-exercise__label">{t("exerciseEquipment")}</span>
          <select
            className="create-exercise__input"
            value={equipment}
            onChange={(event) => setEquipment(event.target.value)}
          >
            <option value="" disabled>
              {t("selectEquipment")}
            </option>
            {EQUIPMENT.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
        </label>

        <label className="create-exercise__field create-exercise__toggle-field">
          <span className="create-exercise__label">{t("exerciseTimed")}</span>
          <button
            type="button"
            className={`create-exercise__toggle ${isTimed ? "create-exercise__toggle--active" : ""}`}
            onClick={() => setIsTimed((prev) => !prev)}
            role="switch"
            aria-checked={isTimed}
          >
            <span className="create-exercise__toggle-knob" />
          </button>
        </label>

        {isTimed && (
          <p className="create-exercise__hint">
            {t("exerciseTimedHint")}
          </p>
        )}

        <label className="create-exercise__field">
          <span className="create-exercise__label">{t("exerciseDescription")}</span>
          <textarea
            className="create-exercise__input create-exercise__textarea"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder={t("exerciseDescriptionPlaceholder")}
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
          {isSubmitting ? t("saving") : t("saveExercise")}
        </button>
      </form>
    </div>
  );
}
