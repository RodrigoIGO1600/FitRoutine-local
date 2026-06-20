import { useState, type FormEvent } from "react";

type CreateRoutineSheetProps = {
  isOpen: boolean;
  isSubmitting: boolean;
  onClose: () => void;
  onSubmit: (input: { name: string; description?: string }) => Promise<void>;
};

export function CreateRoutineSheet({
  isOpen,
  isSubmitting,
  onClose,
  onSubmit,
}: CreateRoutineSheetProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [validationError, setValidationError] = useState<string | null>(null);

  if (!isOpen) {
    return null;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedName = name.trim();

    if (!trimmedName) {
      setValidationError("El nombre es obligatorio");
      return;
    }

    setValidationError(null);

    await onSubmit({
      name: trimmedName,
      description: description.trim() || undefined,
    });

    setName("");
    setDescription("");
  }

  function handleClose() {
    if (isSubmitting) {
      return;
    }

    setValidationError(null);
    onClose();
  }

  return (
    <div className="sheet-overlay" onClick={handleClose} role="presentation">
      <div
        className="sheet"
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="create-routine-title"
      >
        <div className="sheet__handle" aria-hidden="true" />

        <header className="sheet__header">
          <h2 id="create-routine-title">Nueva rutina</h2>
          <p>Asigna un nombre para empezar a añadir ejercicios.</p>
        </header>

        <form className="sheet__form" onSubmit={handleSubmit}>
          <label className="field">
            <span className="field__label">Nombre</span>
            <input
              className="field__input"
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Ej. Cuerpo, Piernas..."
              autoFocus
              disabled={isSubmitting}
            />
          </label>

          <label className="field">
            <span className="field__label">Descripción (opcional)</span>
            <textarea
              className="field__input field__input--textarea"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Notas sobre esta rutina"
              rows={3}
              disabled={isSubmitting}
            />
          </label>

          {validationError && (
            <p className="field__error" role="alert">
              {validationError}
            </p>
          )}

          <div className="sheet__actions">
            <button
              type="button"
              className="btn btn--ghost"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="btn btn--primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Creando..." : "Crear rutina"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
