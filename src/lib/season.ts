export const SEASONS = ["winter", "spring", "summer", "fall"] as const;

export type Season = (typeof SEASONS)[number];

export function seasonFromDate(date: Date = new Date()): Season {
  const month = date.getMonth();
  if (month === 11 || month <= 1) return "winter";
  if (month <= 4) return "spring";
  if (month <= 7) return "summer";
  return "fall";
}
