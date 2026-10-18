import { navigatorSources } from "@/data/navigator-sources";

/** Grille simplifiée du Système de classement global (SCG / CRS), à titre indicatif. */
export const CRS_SOURCE = navigatorSources.crs;
export const CRS_MAX_WITHOUT_SPOUSE = 1200;
export const CRS_MAX_WITH_SPOUSE = 1200;

export type LanguageLevel = "Débutant" | "Intermédiaire" | "Avancé" | "Bilingue";

function ageBracket(age: number): number {
  if (age <= 17 || age >= 45) return 0;
  if (age === 18) return 0;
  if (age === 19) return 1;
  if (age >= 20 && age <= 29) return 2;
  if (age === 30) return 3;
  if (age === 31) return 4;
  if (age === 32) return 5;
  if (age === 33) return 6;
  if (age === 34) return 7;
  if (age === 35) return 8;
  if (age === 36) return 9;
  if (age === 37) return 10;
  if (age === 38) return 11;
  if (age === 39) return 12;
  if (age === 40) return 13;
  if (age === 41) return 14;
  if (age === 42) return 15;
  if (age === 43) return 16;
  return 17; // 44
}

/** Points d’âge par tranche, du plus jeune au plus âgé (18 → 44), index via ageBracket. */
const AGE_POINTS_SOLO = [99, 105, 110, 105, 99, 94, 88, 83, 77, 72, 66, 61, 55, 50, 39, 28, 17, 6];
const AGE_POINTS_SPOUSE = [90, 95, 100, 95, 90, 85, 80, 75, 70, 65, 60, 55, 50, 45, 35, 25, 15, 5];

export function agePoints(age: number, hasSpouse: boolean): number {
  if (age <= 17 || age >= 45) return 0;
  const bracket = ageBracket(age);
  return hasSpouse ? AGE_POINTS_SPOUSE[bracket] ?? 0 : AGE_POINTS_SOLO[bracket] ?? 0;
}

/** Niveau d’études → points (principal demandeur), approximatif à partir des libellés du profil. */
export const educationPointsSolo: Record<string, number> = {
  Secondaire: 30,
  "Formation professionnelle": 90,
  "DEC / Collège": 98,
  "Baccalauréat / Licence": 120,
  "Maîtrise / Master": 135,
  Doctorat: 150,
};

export const educationPointsSpouse: Record<string, number> = {
  Secondaire: 28,
  "Formation professionnelle": 84,
  "DEC / Collège": 91,
  "Baccalauréat / Licence": 112,
  "Maîtrise / Master": 126,
  Doctorat: 140,
};

export function educationPoints(level: string, hasSpouse: boolean): number {
  const table = hasSpouse ? educationPointsSpouse : educationPointsSolo;
  return table[level] ?? 0;
}

/** Niveau d’études du conjoint → points (max 10). */
export const spouseEducationPoints: Record<string, number> = {
  Secondaire: 2,
  "Formation professionnelle": 6,
  "DEC / Collège": 7,
  "Baccalauréat / Licence": 8,
  "Maîtrise / Master": 10,
  Doctorat: 10,
};

/**
 * Le profil capture un niveau global (Débutant/Intermédiaire/Avancé/Bilingue) plutôt que les 4
 * habiletés CLB séparées exigées par la grille officielle. Cette table applique un point par
 * habileté (×4) à titre d’estimation — à confirmer avec un test linguistique reconnu (TEF/IELTS/CELPIP).
 */
export const firstLanguageAbilityPointsSolo: Record<LanguageLevel, number> = {
  Débutant: 0,
  Intermédiaire: 16,
  Avancé: 29,
  Bilingue: 32,
};

export const firstLanguageAbilityPointsSpouse: Record<LanguageLevel, number> = {
  Débutant: 0,
  Intermédiaire: 15,
  Avancé: 27,
  Bilingue: 30,
};

export const secondLanguageAbilityPoints: Record<LanguageLevel, number> = {
  Débutant: 1,
  Intermédiaire: 3,
  Avancé: 6,
  Bilingue: 6,
};

export const spouseLanguageAbilityPoints: Record<LanguageLevel, number> = {
  Débutant: 1,
  Intermédiaire: 3,
  Avancé: 5,
  Bilingue: 5,
};

export function firstLanguagePoints(level: string, hasSpouse: boolean): number {
  const table = hasSpouse ? firstLanguageAbilityPointsSpouse : firstLanguageAbilityPointsSolo;
  const perAbility = table[level as LanguageLevel] ?? 0;
  const total = perAbility * 4;
  return hasSpouse ? Math.min(128, total) : Math.min(136, total);
}

export function secondLanguagePoints(level: string, hasSpouse: boolean): number {
  const perAbility = secondLanguageAbilityPoints[level as LanguageLevel] ?? 0;
  const total = perAbility * 4;
  return hasSpouse ? Math.min(22, total) : Math.min(24, total);
}

export function spouseLanguagePoints(level: string): number {
  const perAbility = spouseLanguageAbilityPoints[level as LanguageLevel] ?? 0;
  return Math.min(20, perAbility * 4);
}

/** Expérience de travail canadienne qualifiée (années) → points. */
export function canadianExperiencePoints(years: number, hasSpouse: boolean): number {
  const table = hasSpouse
    ? [0, 35, 46, 56, 63, 70]
    : [0, 40, 53, 64, 72, 80];
  const capped = Math.max(0, Math.min(5, Math.round(years)));
  return table[capped] ?? 0;
}

export function spouseCanadianExperiencePoints(hasExperience: boolean): number {
  return hasExperience ? 10 : 0;
}

/** Études post-secondaires : "un seul diplôme" (pro/collège) vs "diplôme de 3 ans+" (bacc. et plus). */
export function educationTier(level: string): 0 | 1 | 2 {
  if (level === "Formation professionnelle" || level === "DEC / Collège") return 1;
  if (level === "Baccalauréat / Licence" || level === "Maîtrise / Master" || level === "Doctorat") return 2;
  return 0;
}

function languageTier(level: string): 0 | 1 | 2 {
  if (level === "Avancé" || level === "Bilingue") return 2;
  if (level === "Intermédiaire") return 1;
  return 0;
}

function experienceTier(years: number, thresholds: [number, number]): 0 | 1 | 2 {
  if (years >= thresholds[1]) return 2;
  if (years >= thresholds[0]) return 1;
  return 0;
}

/** Combinaisons de transférabilité des compétences — chaque sous-total est plafonné à 50, total à 100. */
const TRANSFER_TABLE: Record<number, Record<number, number>> = {
  0: { 0: 0, 1: 0, 2: 0 },
  1: { 0: 0, 1: 13, 2: 25 },
  2: { 0: 0, 1: 25, 2: 50 },
};

export function educationLanguageTransfer(level: string, languageLevel: string): number {
  return TRANSFER_TABLE[educationTier(level)]?.[languageTier(languageLevel)] ?? 0;
}

export function educationCanadianExperienceTransfer(level: string, canadianYears: number): number {
  const expTier = experienceTier(canadianYears, [1, 2]);
  return TRANSFER_TABLE[educationTier(level)]?.[expTier] ?? 0;
}

export function foreignExperienceLanguageTransfer(foreignYears: number, languageLevel: string): number {
  const expTier = experienceTier(foreignYears, [1, 3]);
  return TRANSFER_TABLE[expTier]?.[languageTier(languageLevel)] ?? 0;
}

export function foreignExperienceCanadianExperienceTransfer(foreignYears: number, canadianYears: number): number {
  const foreignTier = experienceTier(foreignYears, [1, 3]);
  const canadianTier = experienceTier(canadianYears, [1, 2]);
  return TRANSFER_TABLE[foreignTier]?.[canadianTier] ?? 0;
}

/** Points additionnels. */
export const PNP_NOMINATION_POINTS = 600;
export const SIBLING_IN_CANADA_POINTS = 15;

export function jobOfferPoints(hasOffer: boolean, teer: number | null): number {
  if (!hasOffer) return 0;
  if (teer === 0) return 200;
  if (teer === 1 || teer === 2 || teer === 3) return 50;
  return 50; // offre déclarée sans TEER confirmé — estimation prudente
}

export function canadianCredentialPoints(tier: "none" | "one_two_years" | "three_plus_years"): number {
  if (tier === "one_two_years") return 15;
  if (tier === "three_plus_years") return 30;
  return 0;
}

export function frenchBonusPoints(frenchLevel: string, englishLevel: string): number {
  const frenchStrong = frenchLevel === "Avancé" || frenchLevel === "Bilingue";
  if (!frenchStrong) return 0;
  const englishStrong = englishLevel !== "Débutant";
  return englishStrong ? 50 : 25;
}
