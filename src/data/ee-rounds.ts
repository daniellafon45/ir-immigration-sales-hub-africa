import snapshotJson from "@/data/fixtures/ee-rounds-sample.json";

/** Flux officiel IRCC des rondes d’invitations Entrée express (CORS ouvert). */
export const EE_ROUNDS_URL = "https://www.canada.ca/content/dam/ircc/documents/json/ee_rounds_123_en.json";
export const EE_ROUNDS_PAGE =
  "https://www.canada.ca/fr/immigration-refugies-citoyennete/services/immigrer-canada/entree-express/soumettre-profil/selections-candidats.html";

export type EeCategory =
  | "french"
  | "cec"
  | "pnp"
  | "trades"
  | "health"
  | "stem"
  | "education"
  | "transport"
  | "general"
  | "other";

export type EeRound = {
  number: string;
  date: string;
  name: string;
  category: EeCategory;
  size: number;
  crs: number;
};

export type EeCutoff = { date: string; crs: number; size: number; name: string };

export function eeCategoryOf(name: string): EeCategory {
  const n = name.toLowerCase();
  if (n.includes("french")) return "french";
  if (n.includes("canadian experience class")) return "cec";
  if (n.includes("provincial nominee")) return "pnp";
  if (n.includes("trade")) return "trades";
  if (n.includes("healthcare") || n.includes("health")) return "health";
  if (n.includes("stem")) return "stem";
  if (n.includes("education")) return "education";
  if (n.includes("transport")) return "transport";
  if (n.includes("no program specified") || n === "general") return "general";
  return "other";
}

const toNumber = (value: unknown) => {
  const n = Number(String(value ?? "").replace(/[^\d.]/g, ""));
  return String(value ?? "").trim() !== "" && Number.isFinite(n) ? n : NaN;
};

/** Convertit le JSON IRCC ; ignore toute ligne invalide plutôt que de fausser un seuil. */
export function parseEeRounds(raw: unknown): EeRound[] {
  const rows = (raw as { rounds?: unknown })?.rounds;
  if (!Array.isArray(rows)) return [];
  const out: EeRound[] = [];
  for (const row of rows) {
    if (!row || typeof row !== "object") continue;
    const r = row as Record<string, unknown>;
    const date = String(r.drawDate ?? "");
    const size = toNumber(r.drawSize);
    const crs = toNumber(r.drawCRS);
    const name = String(r.drawName ?? "").trim();
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !name || Number.isNaN(size) || Number.isNaN(crs)) continue;
    out.push({ number: String(r.drawNumber ?? ""), date, name, category: eeCategoryOf(name), size, crs });
  }
  return out.sort((a, b) => b.date.localeCompare(a.date));
}

export function latestCutoffs(rounds: EeRound[]): Partial<Record<EeCategory, EeCutoff>> {
  const out: Partial<Record<EeCategory, EeCutoff>> = {};
  for (const r of rounds) {
    if (!out[r.category]) out[r.category] = { date: r.date, crs: r.crs, size: r.size, name: r.name };
  }
  return out;
}

/** Instantané intégré (repli hors ligne) — extrait du flux IRCC. */
export const eeRoundsSnapshot = {
  fetchedOn: "2026-10-18",
  rounds: parseEeRounds(snapshotJson),
};

export type DrawCadence = { count: number; avgGapDays: number | null; lastDate: string | null };

const dayMs = 86_400_000;

/** Fréquence réelle des tirages d’une catégorie sur une fenêtre récente (6 mois par défaut). */
export function drawCadence(rounds: EeRound[], category: EeCategory, today: string, windowDays = 180): DrawCadence {
  const from = Date.parse(today) - windowDays * dayMs;
  const recent = rounds
    .filter((r) => r.category === category && Date.parse(r.date) >= from && Date.parse(r.date) <= Date.parse(today))
    .sort((a, b) => b.date.localeCompare(a.date));
  if (recent.length === 0) return { count: 0, avgGapDays: null, lastDate: null };
  const span = (Date.parse(recent[0]!.date) - Date.parse(recent[recent.length - 1]!.date)) / dayMs;
  // Un seul tirage dans la fenêtre : on retient la fenêtre entière comme écart prudent.
  const avgGapDays = recent.length >= 2 ? Math.round(span / (recent.length - 1)) : windowDays;
  return { count: recent.length, avgGapDays, lastDate: recent[0]!.date };
}
