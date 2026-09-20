export type VisitDuration = "15d" | "1m" | "3m" | "6m";

export const visitFundsGrid: Record<VisitDuration, Record<number, number>> = {
  "15d": {
    1: 3000,
    2: 4500,
    3: 5500,
    4: 6500,
    5: 7500,
  },
  "1m": {
    1: 4500,
    2: 6500,
    3: 8000,
    4: 9500,
    5: 11000,
  },
  "3m": {
    1: 9000,
    2: 13000,
    3: 16000,
    4: 19000,
    5: 22000,
  },
  "6m": {
    1: 16000,
    2: 23000,
    3: 28000,
    4: 33000,
    5: 38000,
  },
};

function householdSize(adults: number, kids: number) {
  return Math.max(1, Math.floor(adults) + Math.max(0, Math.floor(kids)));
}

export function visitFundsFor(duration: VisitDuration, adults: number, kids: number): number {
  const size = householdSize(adults, kids);
  return visitFundsGrid[duration][Math.min(size, 5)] ?? visitFundsGrid[duration][5];
}
