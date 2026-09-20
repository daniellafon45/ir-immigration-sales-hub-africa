import type { OpportunityThemeId } from "@/data/opportunity-proof";

/** Normalize accents/apostrophes for mosaic card titles. */
function normalizeTitle(title: string) {
  return title
    .normalize("NFC")
    .replace(/['’]/g, "'")
    .trim()
    .toUpperCase();
}

const MAP: Record<string, OpportunityThemeId> = {
  ÉTUDIER: "study",
  TRAVAILLER: "employment",
  ENTREPRENDRE: "business",
  "S'INSTALLER": "nationality",
};

export function pitchMosaicTheme(title: string): OpportunityThemeId | null {
  return MAP[normalizeTitle(title)] ?? null;
}
