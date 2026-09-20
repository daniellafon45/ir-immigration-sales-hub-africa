import type { AdultMember } from "@/data/profile";
import { provinceCode, provinceData } from "@/data/provinces";

const STRONG_LANG = new Set(["Avancé", "Bilingue"]);

export type ProvinceLever = {
  requirementLabel: "Exigence FR" | "Langue prioritaire";
  requirementValue: string;
  candidateLabel: "Français" | "Anglais";
  candidateValue: string;
  verdict: string;
  positive: boolean;
};

export function provinceLever(member: AdultMember, province: string): ProvinceLever {
  if (province === "Québec") {
    const candidateValue = member.french;
    return {
      requirementLabel: "Exigence FR",
      requirementValue: (provinceData[provinceCode(province)] ?? provinceData.QC).french,
      candidateLabel: "Français",
      candidateValue,
      verdict: quebecFrenchVerdict(candidateValue),
      positive: STRONG_LANG.has(candidateValue),
    };
  }

  const candidateValue = member.english;
  return {
    requirementLabel: "Langue prioritaire",
    requirementValue: "Anglais",
    candidateLabel: "Anglais",
    candidateValue,
    verdict: englishVerdict(candidateValue),
    positive: STRONG_LANG.has(candidateValue),
  };
}

function quebecFrenchVerdict(level: string) {
  if (level === "Bilingue") return "Atout francophone — qualification renforcée";
  if (level === "Avancé") return "Atout francophone — levier de qualification";
  if (level === "Intermédiaire") return "Seuil possible — consolider le français";
  return "Frein linguistique — qualifier le FR d'abord";
}

function englishVerdict(level: string) {
  if (level === "Bilingue") return "Anglais bilingue — levier d'employabilité";
  if (level === "Avancé") return "Anglais solide — levier d'employabilité";
  if (level === "Intermédiaire") return "Anglais utile — à confirmer en entretien";
  return "Frein linguistique — anglais à qualifier";
}
