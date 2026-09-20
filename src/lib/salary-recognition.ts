import { provinceCode } from "@/data/provinces";
import type { SalaryBand } from "@/data/salaries";
import { netEstimate } from "@/lib/finance";

export type SalarySeniorityId = "entry" | "mid" | "senior";
export type SalaryBandLabel = "Bas" | "Médian" | "Élevé";

export type SalaryRecognitionInput = {
  profession: string;
  years: number;
  band: SalaryBand;
  province: string;
  french: string;
  english: string;
};

export type SalaryRecognition = {
  declaredYears: number;
  recognizedYears: number;
  declaredTier: SalarySeniorityId;
  recognizedTier: SalarySeniorityId;
  declaredLabel: SalaryBandLabel;
  recognizedLabel: SalaryBandLabel;
  declaredSalary: number;
  recognizedSalary: number;
  gap: number;
  factor: number;
  regulated: boolean;
  regulator?: string;
  netAnnual: number;
  netMonthly: number;
  missingYears: number;
  targetLabel: Exclude<SalaryBandLabel, "Bas"> | null;
  facts: [string, string, string];
  sameTier: boolean;
  climbCopy: string | null;
};

type ProfessionRecognition = {
  factor: number;
  regulated: boolean;
  regulator?: string;
};

const STRONG_LANG = new Set(["Avancé", "Bilingue"]);

const PROFESSION_RECOGNITION: Record<string, ProfessionRecognition> = {
  Comptable: { factor: 0.4, regulated: true, regulator: "Ordre comptable (CPA)" },
  "Infirmier(ère)": { factor: 0.35, regulated: true, regulator: "OIIQ / ordre provincial" },
  "Développeur logiciel": { factor: 0.8, regulated: false },
  Électromécanicien: { factor: 0.55, regulated: true, regulator: "Certification de métier" },
};

const DEFAULT_RECOGNITION: ProfessionRecognition = { factor: 0.5, regulated: false };

const TIER_LABEL: Record<SalarySeniorityId, SalaryBandLabel> = {
  entry: "Bas",
  mid: "Médian",
  senior: "Élevé",
};

const TIER_THRESHOLD: Record<Exclude<SalarySeniorityId, "entry">, number> = {
  mid: 3,
  senior: 8,
};

export const SENIORITY_STEPS: Array<{
  id: SalarySeniorityId;
  yearsLabel: string;
  salaryLabel: SalaryBandLabel;
}> = [
  { id: "entry", yearsLabel: "0–2 ans", salaryLabel: "Bas" },
  { id: "mid", yearsLabel: "3–7 ans", salaryLabel: "Médian" },
  { id: "senior", yearsLabel: "8 ans et +", salaryLabel: "Élevé" },
];

export function seniorityFor(years: number): SalarySeniorityId {
  const value = Math.max(0, years);
  if (value <= 2) return "entry";
  if (value <= 7) return "mid";
  return "senior";
}

export function salaryForSeniority(band: SalaryBand, tier: SalarySeniorityId): number {
  if (tier === "entry") return band[0];
  if (tier === "mid") return band[1];
  return band[2];
}

export function professionRecognition(profession: string): ProfessionRecognition {
  return PROFESSION_RECOGNITION[profession] ?? DEFAULT_RECOGNITION;
}

function languageFact(province: string, french: string, english: string): string {
  const quebec = province === "Québec";
  const level = quebec ? french : english;
  if (STRONG_LANG.has(level)) return "La langue tient. L’écart vient surtout de la reconnaissance.";
  return quebec
    ? "Le médian suppose un français qui tient au travail."
    : "Le médian suppose un anglais qui tient au travail.";
}

function regulatedFact(meta: ProfessionRecognition): string {
  if (meta.regulated && meta.regulator) return `Métier réglementé · ${meta.regulator}`;
  return "Métier non réglementé · les années transférent mieux";
}

function delayFact(regulated: boolean): string {
  return regulated ? "Équivalence : 12–24 mois, ordre de grandeur." : "L’expérience canadienne accélère le palier.";
}

function climbCopyFor(missingYears: number, targetLabel: Exclude<SalaryBandLabel, "Bas"> | null): string | null {
  if (!missingYears || !targetLabel) return null;
  if (missingYears === 1) return `Il manque 1 année reconnue pour viser le palier ${targetLabel}.`;
  return `Il manque ${missingYears} années reconnues pour viser le palier ${targetLabel}.`;
}

export function recognitionFor(input: SalaryRecognitionInput): SalaryRecognition {
  const declaredYears = Math.max(0, input.years);
  const meta = professionRecognition(input.profession);
  const recognizedYears = Math.min(declaredYears, Math.max(0, Math.round(declaredYears * meta.factor)));
  const declaredTier = seniorityFor(declaredYears);
  const recognizedTier = seniorityFor(recognizedYears);
  const declaredSalary = salaryForSeniority(input.band, declaredTier);
  const recognizedSalary = salaryForSeniority(input.band, recognizedTier);
  const netAnnual = netEstimate(recognizedSalary, provinceCode(input.province));
  const sameTier = declaredTier === recognizedTier;
  const targetLabel = !sameTier && declaredTier !== "entry" ? TIER_LABEL[declaredTier] : null;
  const missingYears =
    targetLabel && declaredTier !== "entry" ? Math.max(0, TIER_THRESHOLD[declaredTier] - recognizedYears) : 0;

  return {
    declaredYears,
    recognizedYears,
    declaredTier,
    recognizedTier,
    declaredLabel: TIER_LABEL[declaredTier],
    recognizedLabel: TIER_LABEL[recognizedTier],
    declaredSalary,
    recognizedSalary,
    gap: declaredSalary - recognizedSalary,
    factor: meta.factor,
    regulated: meta.regulated,
    regulator: meta.regulator,
    netAnnual,
    netMonthly: Math.round(netAnnual / 12),
    missingYears,
    targetLabel,
    facts: [regulatedFact(meta), languageFact(input.province, input.french, input.english), delayFact(meta.regulated)],
    sameTier,
    climbCopy: climbCopyFor(missingYears, targetLabel),
  };
}
