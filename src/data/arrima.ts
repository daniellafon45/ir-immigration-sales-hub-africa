import type { OfficialSource } from "@/data/navigator-sources";
import type { AdultMember, Profile } from "@/lib/engine-profile";

/**
 * Barème Arrima (PSTQ). `arrimaScore` applique la grille officielle complète
 * (Pointage_criteres.pdf, 26 juin 2026) ; les fonctions par critère restent
 * utilisées pour le sous-total âge / scolarité / expérience.
 */
export const arrimaSources: OfficialSource[] = [
  {
    label: "Québec — PSTQ : invitations 2026",
    url: "https://www.quebec.ca/immigration/permanente/travailleurs-qualifies/programme-selection-travailleurs-qualifies/invitation/2026",
    verifiedOn: "2026-10-18",
    updatedLabel: "octobre 2026",
  },
  {
    label: "MIFI — Pointage et critères de classement (mise à jour du 26 juin 2026)",
    url: "https://cdn-contenu.quebec.ca/cdn-contenu/immigration/publications/fr/Pointage_criteres.pdf",
    verifiedOn: "2026-10-18",
    updatedLabel: "juin 2026",
  },
  {
    label: "Québec — Programme de sélection des travailleurs qualifiés",
    url: "https://www.quebec.ca/immigration/permanente/travailleurs-qualifies/programme-selection-travailleurs-qualifies",
    verifiedOn: "2026-10-18",
    updatedLabel: "octobre 2026",
  },
];

/** [âge, sans conjoint, avec conjoint accompagnant] */
const AGE_POINTS: ReadonlyArray<readonly [number, number, number]> = [
  [31, 110, 95],
  [32, 100, 90],
  [33, 90, 81],
  [34, 80, 72],
  [35, 75, 68],
  [36, 70, 63],
  [37, 65, 59],
  [38, 60, 54],
  [39, 55, 50],
  [40, 50, 45],
  [41, 40, 36],
  [42, 30, 27],
  [43, 20, 18],
  [44, 10, 9],
];

export function arrimaAgePoints(age: number, withSpouse: boolean): number {
  if (age < 18 || age >= 45) return 0;
  if (age <= 19) return withSpouse ? 90 : 110;
  if (age <= 30) return withSpouse ? 100 : 120;
  const row = AGE_POINTS.find(([a]) => a === Math.floor(age));
  return row ? (withSpouse ? row[2] : row[1]) : 0;
}

/** Équivalence approximative des niveaux du profil vers le barème québécois. */
const EDUCATION_POINTS: Record<string, readonly [number, number]> = {
  Secondaire: [13, 11],
  "Formation professionnelle": [13, 11],
  "DEC / Collège": [78, 66],
  "Baccalauréat / Licence": [104, 88],
  "Maîtrise / Master": [117, 99],
  Doctorat: [130, 110],
};

export function arrimaEducationPoints(education: string, withSpouse: boolean): number {
  const row = EDUCATION_POINTS[education];
  return row ? (withSpouse ? row[1] : row[0]) : 0;
}

export function arrimaExperiencePoints(years: number, withSpouse: boolean): number {
  if (years >= 4) return withSpouse ? 50 : 70;
  if (years >= 3) return withSpouse ? 35 : 50;
  if (years >= 2) return withSpouse ? 30 : 40;
  if (years >= 1) return withSpouse ? 15 : 20;
  return 0;
}

export type ArrimaRound = {
  date: string;
  volet: 1 | 2 | 3;
  invitations: number;
  targets: string;
  /** La ronde exigeait un séjour / une présence au Québec. */
  requiresQuebecPresence: boolean;
  /** Pointage minimal publié pour la ronde (si connu). */
  minScore?: number;
};

/** Rondes PSTQ 2026 publiées (extraits officiels, totaux par volet). */
export const arrimaRounds2026: ArrimaRound[] = [
  { date: "2026-04-30", volet: 1, invitations: 983, targets: "FEER 0-1-2, secteurs prioritaires", requiresQuebecPresence: false },
  { date: "2026-06-04", volet: 1, invitations: 1094, targets: "Santé, génie, techniques, métiers spécialisés", requiresQuebecPresence: false, minScore: 677 },
  { date: "2026-07-03", volet: 2, invitations: 289, targets: "Assistance médicale, métiers manuels, services", requiresQuebecPresence: true },
  { date: "2026-07-30", volet: 1, invitations: 105, targets: "Biologistes, pharmacie, éducateurs, travail social, chefs", requiresQuebecPresence: true },
  { date: "2026-08-27", volet: 2, invitations: 314, targets: "Adjoints médicaux, cuisiniers, entretien, construction", requiresQuebecPresence: true, minScore: 638 },
  { date: "2026-09-24", volet: 1, invitations: 86, targets: "Sciences, santé, éducation, TI, génie, métiers", requiresQuebecPresence: true, minScore: 634 },
  { date: "2026-09-24", volet: 2, invitations: 316, targets: "Aides-soignants, cuisiniers, camionneurs, construction", requiresQuebecPresence: true, minScore: 611 },
  { date: "2026-09-24", volet: 3, invitations: 110, targets: "Médecins, infirmiers, pharmaciens, enseignants, ingénieurs, électriciens", requiresQuebecPresence: false },
];

export const ARRIMA_DISCLAIMER =
  "Pointage estimé selon la grille officielle (26 juin 2026). La fourchette vient du diagnostic de main-d’œuvre de la profession et de l’équivalence du diplôme, fixés par le ministère. Le français est estimé à partir du niveau déclaré : seul un test officiel fait foi. Chaque ronde fixe ses propres critères : un bon pointage ne garantit pas une invitation.";

/* ——— Grille officielle complète (Pointage_criteres.pdf, 26 juin 2026) ——— */

/** Niveau de l’Échelle québécoise estimé à partir du niveau déclaré (un test officiel fait foi). */
const QC_LEVEL: Record<string, number> = { Débutant: 3, Intermédiaire: 5, Avancé: 7, Bilingue: 9 };

function frenchSkillPoints(level: number, withSpouse: boolean) {
  if (level >= 9) return withSpouse ? 40 : 50;
  if (level >= 7) return withSpouse ? 35 : 44;
  if (level >= 5) return withSpouse ? 30 : 38;
  return 0;
}

function spouseFrenchSkillPoints(level: number) {
  if (level >= 9) return 10;
  if (level >= 7) return 8;
  if (level >= 5) return 6;
  if (level >= 4) return 4;
  return 0;
}

/** [sans conjoint], [avec conjoint] — un diplôme étranger est rattaché à une fourchette d’équivalence. */
const EDUCATION_RANGE: Record<string, [[number, number], [number, number]]> = {
  Secondaire: [[13, 13], [11, 11]],
  "Formation professionnelle": [[26, 26], [22, 22]],
  "DEC / Collège": [[52, 78], [44, 66]],
  "Baccalauréat / Licence": [[104, 104], [88, 88]],
  "Maîtrise / Master": [[110, 117], [93, 99]],
  Doctorat: [[130, 130], [110, 110]],
};

const SPOUSE_EDUCATION: Record<string, [number, number]> = {
  Secondaire: [2, 2],
  "Formation professionnelle": [4, 4],
  "DEC / Collège": [8, 12],
  "Baccalauréat / Licence": [16, 16],
  "Maîtrise / Master": [17, 18],
  Doctorat: [20, 20],
};

const SPOUSE_AGE: ReadonlyArray<readonly [number, number]> = [
  [31, 18], [32, 17], [33, 16], [34, 15], [35, 14], [36, 12], [37, 10],
  [38, 8], [39, 7], [40, 6], [41, 5], [42, 4], [43, 3], [44, 2],
];

function spouseAgePoints(age: number) {
  if (age < 16 || age >= 45) return 0;
  if (age <= 19) return 18;
  if (age <= 30) return 20;
  return SPOUSE_AGE.find(([a]) => a === Math.floor(age))?.[1] ?? 0;
}

/** Diagnostic de main-d’œuvre inconnu : de « équilibre » (min) à « déficit » (max). */
function diagnosticRange(years: number): [number, number] {
  const months = years * 12;
  if (months >= 48) return [25, 120];
  if (months >= 36) return [15, 110];
  if (months >= 24) return [10, 100];
  if (months >= 12) return [5, 90];
  return [0, 0];
}

function quebecExperiencePoints(years: number) {
  if (years >= 4) return 160;
  if (years >= 3) return 120;
  if (years >= 2) return 80;
  if (years >= 1) return 40;
  return 0;
}

function outsideCmmMax(months: number) {
  const residence = months >= 48 ? 40 : months >= 36 ? 32 : months >= 24 ? 24 : months >= 12 ? 16 : months >= 6 ? 6 : 0;
  const work = months >= 48 ? 60 : months >= 36 ? 48 : months >= 24 ? 36 : months >= 12 ? 24 : months >= 6 ? 9 : 0;
  return residence + work;
}

export type ArrimaScore = {
  min: number;
  max: number;
  parts: {
    french: number;
    age: number;
    experience: number;
    education: [number, number];
    diagnostic: [number, number];
    quebecDiploma: [number, number];
    quebecExperience: number;
    outsideCmm: [number, number];
    offer: [number, number];
    family: [number, number];
    spouse: number;
    spouseMax: number;
  };
};

export function arrimaScore({
  principal,
  partner,
  profile,
}: {
  principal: AdultMember;
  partner: AdultMember | null;
  profile: Profile;
}): ArrimaScore {
  const withSpouse = partner != null;
  const inQuebec = profile.currentlyInCanada && profile.province === "Québec";
  const french = frenchSkillPoints(QC_LEVEL[principal.french] ?? 0, withSpouse) * 4;
  const age = arrimaAgePoints(principal.age, withSpouse);
  const experience = arrimaExperiencePoints(principal.experience, withSpouse);
  const eduRow = EDUCATION_RANGE[principal.education] ?? [[0, 0], [0, 0]];
  const education = withSpouse ? eduRow[1] : eduRow[0];
  const diagnostic = diagnosticRange(principal.experience);

  const tier = profile.canadianCredentialTier;
  const quebecDiploma: [number, number] =
    inQuebec && tier === "three_plus_years" ? [120, 170] : inQuebec && tier === "one_two_years" ? [60, 140] : [0, 0];
  const quebecExperience = inQuebec ? quebecExperiencePoints(profile.canadianExperienceYears) : 0;
  // Lieu de résidence / travail hors CMM inconnu : de 0 à la valeur maximale selon la durée au Québec.
  const outsideCmm: [number, number] = [0, inQuebec ? outsideCmmMax(profile.canadianExperienceYears * 12) : 0];
  const offer: [number, number] = profile.workHasOffer && profile.offerProvince === "Québec" ? [30, 50] : [0, 0];
  const family: [number, number] = profile.hasSiblingInCanada && profile.province === "Québec" ? [0, 10] : [0, 0];

  let spouse = 0;
  let spouseMax = 0;
  if (partner) {
    const base = spouseFrenchSkillPoints(QC_LEVEL[partner.french] ?? 0) * 4 + spouseAgePoints(partner.age);
    const [eMin, eMax] = SPOUSE_EDUCATION[partner.education] ?? [0, 0];
    const [xMin, xMax] = inQuebec && profile.spouseHasCanadianExperience ? [10, 30] : [0, 0];
    spouse = base + eMin + xMin;
    spouseMax = base + eMax + xMax;
  }

  const fixed = french + age + experience + quebecExperience;
  const ranges = [education, diagnostic, quebecDiploma, outsideCmm, offer, family];
  return {
    min: fixed + ranges.reduce((t, r) => t + r[0], 0) + spouse,
    max: fixed + ranges.reduce((t, r) => t + r[1], 0) + spouseMax,
    parts: { french, age, experience, education, diagnostic, quebecDiploma, quebecExperience, outsideCmm, offer, family, spouse, spouseMax },
  };
}

/** Dernière ronde publiée avec pointage minimal (hors Québec : rondes sans exigence de présence). */
export function latestArrimaThreshold(volet: 1 | 2 | 3, { abroad }: { abroad: boolean }): ArrimaRound | null {
  const rounds = arrimaRounds2026
    .filter((r) => r.volet === volet && r.minScore != null && (!abroad || !r.requiresQuebecPresence))
    .sort((a, b) => b.date.localeCompare(a.date));
  return rounds[0] ?? null;
}

/* ——— Capacité d’autonomie financière (barème 2026, 3 premiers mois) ——— */

export const quebecAutonomySource: OfficialSource = {
  label: "Québec — Capacité d’autonomie financière (barème 2026)",
  url: "https://www.quebec.ca/immigration/permanente/travailleurs-qualifies/programme-experience-quebecoise/conditions-selection/capacite-autonomie-financiere",
  verifiedOn: "2026-10-18",
  updatedLabel: "janvier 2026",
};

const AUTONOMY: Record<1 | 2, number[]> = {
  1: [3957, 5318, 6002, 6687],
  2: [5803, 6500, 7016, 7531],
};

export function quebecAutonomyFunds({
  adults,
  minors,
  adultDependants,
}: {
  adults: number;
  minors: number;
  adultDependants: number;
}): number {
  const row = AUTONOMY[adults >= 2 ? 2 : 1];
  const kids = Math.max(0, minors);
  // Au-delà de 3 enfants : prolongation de l’écart du barème (à confirmer sur le site officiel).
  const step = row[3]! - row[2]!;
  const base = kids <= 3 ? row[kids]! : row[3]! + (kids - 3) * step;
  return base + Math.max(0, adultDependants) * 1845;
}

/** Fréquence des rondes 2026 d’un volet (rondes ouvertes au client seulement s’il est hors Québec). */
export function arrimaVoletCadence(volet: 1 | 2 | 3, { abroad, today }: { abroad: boolean; today: string }) {
  const dates = arrimaRounds2026
    .filter((r) => r.volet === volet && (!abroad || !r.requiresQuebecPresence) && r.date <= today)
    .map((r) => Date.parse(r.date))
    .sort((a, b) => a - b);
  if (dates.length === 0) return { count: 0, avgGapDays: null as number | null };
  const span = (dates[dates.length - 1]! - dates[0]!) / 86_400_000;
  return { count: dates.length, avgGapDays: dates.length >= 2 ? Math.round(span / (dates.length - 1)) : 180 };
}
