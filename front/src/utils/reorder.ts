export function reorderArray<T>(items: T[], fromIndex: number, toIndex: number): T[] {
  const result = [...items];
  const [removed] = result.splice(fromIndex, 1);
  result.splice(toIndex, 0, removed);
  return result;
}

export function applyExerciseOrder<T extends { order: number }>(
  items: T[]
): T[] {
  return items.map((item, index) => ({
    ...item,
    order: index + 1,
  }));
}
