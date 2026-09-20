import { professions } from "@/data/profile";

const PROFESSION_TO_NOC: Record<(typeof professions)[number], string | null> = {
  Comptable: "11100",
  "Analyste financier": "11101",
  "Infirmier(ère)": "31301",
  "Aide-soignant(e)": "33102",
  "Développeur logiciel": "21232",
  "Analyste en TI": "21222",
  Électromécanicien: "72422",
  Électricien: "72200",
  Ingénieur: "21301",
  "Enseignant(e)": "41220",
  "Cuisinier(ère)": "63200",
  Chauffeur: "73300",
  "Représentant(e) commercial": "64101",
  "Technicien en maintenance": "73201",
  Autre: null,
};

export function professionNoc(profession: string): string | null {
  return PROFESSION_TO_NOC[profession as keyof typeof PROFESSION_TO_NOC] ?? null;
}
