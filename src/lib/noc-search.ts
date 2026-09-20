import { noc2021, type NocUnit } from "@/data/noc-2021";

function normalize(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

function rank(item: NocUnit, query: string, normalizedQuery: string) {
  const normalizedTitle = normalize(item.title);
  if (item.code === query) return 0;
  if (item.code.startsWith(query)) return 1;
  if (normalizedTitle.startsWith(normalizedQuery)) return 2;
  return 3;
}

export function searchNoc(query: string, limit = 8): NocUnit[] {
  const raw = String(query ?? "").trim();
  if (raw.length < 2) return [];
  const normalizedQuery = normalize(raw);
  return noc2021
    .filter((item) => item.code.includes(raw) || normalize(item.title).includes(normalizedQuery))
    .sort((left, right) => {
      const leftRank = rank(left, raw, normalizedQuery);
      const rightRank = rank(right, raw, normalizedQuery);
      if (leftRank !== rightRank) return leftRank - rightRank;
      return left.code.localeCompare(right.code, "fr");
    })
    .slice(0, limit);
}
