export function parseIdParam(value: unknown): string | null {
  if (typeof value !== "string") {
    return null;
  }

  const id = value.trim();

  if (!id) {
    return null;
  }

  return id;
}
