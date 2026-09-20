export const COMPARE_LIMIT = 3;

export function nextCompareSelected(current: string[], id: string, max = COMPARE_LIMIT) {
  if (current.includes(id)) return current.filter((item) => item !== id);
  if (current.length < max) return [...current, id];
  return [...current.slice(1), id];
}
