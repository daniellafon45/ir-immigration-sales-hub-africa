import { arrimaScore, arrimaVoletCadence, latestArrimaThreshold, type ArrimaRound, type ArrimaScore } from "@/data/arrima";
import { drawCadence, eeRoundsSnapshot, type EeCategory, type EeCutoff, type EeRound } from "@/data/ee-rounds";
import { irccFamilySize, settlementFundsFor } from "@/data/ircc-funds";
import type { OpportunityId } from "@/data/opportunities";
import { professionNoc } from "@/data/profession-noc";
import {
  familyHasSpouse,
  familyIsPolygamous,
  householdFundsCad,
  type AdultMember,
  type PrincipalMode,
  type Profile,
} from "@/lib/engine-profile";
import { computeCrsScore } from "@/lib/crs-score";
import {
  runOpportunities,
  type OpportunityMatch,
  type OpportunityStatus,
  type OpportunityStrategy,
} from "@/lib/opportunity-engine";

/**
 * « Meilleurs programmes » : uniquement à partir du CV du couple. Les choix cochés
 * (objectif, type de permis, programme d’études, province) sont ignorés ; chaque
 * programme est testé avec chaque adulte comme demandeur principal et dans
 * chaque destination pertinente, puis le meilleur scénario est retenu.
 */

export const CANDIDATE_PROVINCES = [
  "Québec",
  "Ontario",
  "Alberta",
  "Manitoba",
  "Nouveau-Brunswick",
  "Colombie-Britannique",
  "Saskatchewan",
  "Nouvelle-Écosse",
] as const;

const ATLANTIC = new Set(["Nouveau-Brunswick", "Nouvelle-Écosse"]);
const FRANCOPHONE_FIRST = ["Nouveau-Brunswick", "Ontario", "Manitoba", "Alberta", "Colombie-Britannique", "Saskatchewan", "Nouvelle-Écosse"];
const GENERIC_ORDER = ["Ontario", "Alberta", "Colombie-Britannique", "Manitoba", "Saskatchewan", "Nouveau-Brunswick", "Nouvelle-Écosse"];

const EE_CATEGORY: Partial<Record<OpportunityId, EeCategory>> = {
  "ee-fsw": "general",
  "ee-cec": "cec",
  "ee-french": "french",
  "ee-health": "health",
  "ee-trades": "trades",
  // Les candidats du programme fédéral des métiers sont invités par les tirages « métiers ».
  "ee-fst": "trades",
};

const SETTLEMENT_FUNDS_PROGRAMS = new Set<OpportunityId>(["ee-fsw", "ee-french", "ee-health", "ee-trades"]);
const DIRECT_PR = new Set(["permanent", "family"]);
/** Outils d’exploration : visibles dans la liste complète, jamais dans le top. */
const EXPLORATION = new Set<OpportunityId>(["visitor", "super-visa"]);
/** Un seuil plus vieux que 12 mois ne reflète plus les tirages actuels. */
const MAX_CUTOFF_AGE_DAYS = 365;

function daysBetween(from: string, to: string) {
  return (Date.parse(to) - Date.parse(from)) / 86_400_000;
}

export type ChanceLevel = "élevée" | "moyenne" | "faible";
export type Chance = { level: ChanceLevel; reason: string };

const PSTQ_VOLET: Partial<Record<OpportunityId, 1 | 2 | 3>> = { "pstq-v1": 1, "pstq-v2": 2, "pstq-v3": 3 };

function partnerOf(scenario: Profile, filer: Adult): AdultMember | null {
  if (!familyHasSpouse(scenario.family)) return null;
  return filer.role === "applicant" ? scenario.spouse : scenario.applicant;
}

/** Chances réelles : tirages Entrée express, seuils Arrima publiés, dépendance à un employeur. */
function chanceOf(
  match: OpportunityMatch,
  scenario: Profile,
  crsCheck: CrsCheck | null,
  isEe: boolean,
  arrima: ArrimaScore | null,
): Chance {
  if (match.status === "blocked" || match.status === "closed") return { level: "faible", reason: "Non admissible actuellement." };
  if (isEe) {
    if (!crsCheck) return { level: "faible", reason: "Aucun tirage récent dans cette catégorie." };
    if (crsCheck.above) return { level: "élevée", reason: `CRS ${crsCheck.score} ≥ dernier seuil ${crsCheck.cutoff} (${crsCheck.date}).` };
    if (crsCheck.cutoff - crsCheck.score <= 50) {
      return { level: "moyenne", reason: `CRS ${crsCheck.score} proche du dernier seuil ${crsCheck.cutoff} (${crsCheck.date}).` };
    }
    return { level: "faible", reason: `CRS ${crsCheck.score} loin du dernier seuil ${crsCheck.cutoff} (${crsCheck.date}).` };
  }
  const volet = PSTQ_VOLET[match.program.id];
  if (volet && arrima) {
    const inQuebec = scenario.currentlyInCanada && scenario.province === "Québec";
    const round = latestArrimaThreshold(volet, { abroad: !inQuebec });
    if (!round?.minScore) {
      return inQuebec
        ? { level: "moyenne", reason: `Arrima ${arrima.min}–${arrima.max} : aucun seuil publié récemment pour ce volet.` }
        : { level: "faible", reason: "Rondes récentes de ce volet réservées aux personnes présentes au Québec." };
    }
    const label = `Arrima ${arrima.min}–${arrima.max} vs seuil ${round.minScore} (${round.date})`;
    if (arrima.min >= round.minScore) return { level: "élevée", reason: `${label}.` };
    if (arrima.max >= round.minScore) return { level: "moyenne", reason: `${label} : dépend du diagnostic de la profession.` };
    return { level: "faible", reason: `${label}.` };
  }
  if (match.needsEmployer && !scenario.workHasOffer) {
    return { level: "moyenne", reason: "Dépend d’une offre d’un employeur canadien (désigné le cas échéant)." };
  }
  if (match.status === "bridge") return { level: "moyenne", reason: "Accessible après une étape préalable." };
  if (match.status === "lever") return { level: "moyenne", reason: match.gaps[0] ?? "Un levier à activer." };
  return { level: "élevée", reason: match.why[0] ?? "Conditions remplies." };
}

const CHANCE_RANK: Record<ChanceLevel, number> = { élevée: 15, moyenne: 0, faible: -25 };

/* ——— Délai jusqu’à la résidence permanente ——— */

export type Speed = "Rapide" | "Moyen" | "Long" | "Incertain";
type Range = [number, number];

export type Timeline = {
  speed: Speed;
  /** Fourchette totale en mois, ou null si l’invitation ne peut pas être anticipée. */
  totalMonths: Range | null;
  prepMonths: Range;
  waitMonths: Range | null;
  processingMonths: Range;
  detail: string;
};

/** Préparation avant dépôt (tests, évaluations, recherche d’employeur) et traitement après dépôt, en mois. */
const PREP: Partial<Record<OpportunityId, Range>> = {
  "ee-fsw": [1, 3], "ee-french": [1, 3], "ee-health": [1, 3], "ee-trades": [1, 3], "ee-fst": [2, 6], "ee-cec": [0, 1],
  "pstq-v1": [1, 2], "pstq-v2": [1, 2], "pstq-v3": [3, 12], "pstq-v4": [3, 6], peq: [0, 1],
  pnp: [1, 3], aip: [1, 3], rcip: [1, 3], fcip: [1, 3],
  "family-spouse": [1, 2], "family-child": [1, 2],
};
/** Traitement : IRCC (ircc-times) ; PSTQ = CSQ puis RP fédérale (estimation à confirmer). */
const PROCESSING: Partial<Record<OpportunityId, Range>> = {
  "ee-fsw": [5, 7], "ee-french": [5, 7], "ee-health": [5, 7], "ee-trades": [5, 7], "ee-fst": [5, 7], "ee-cec": [5, 7],
  "pstq-v1": [18, 30], "pstq-v2": [18, 30], "pstq-v3": [18, 30], "pstq-v4": [18, 30], peq: [18, 30],
  pnp: [7, 16], aip: [6, 12], rcip: [6, 12], fcip: [6, 12],
  "family-spouse": [14, 20], "family-child": [14, 20],
};
const EMPLOYER_SEARCH: Range = [3, 12];
/** Voies temporaires : permis, puis 12 mois de travail, puis CEC. */
const TWO_STEP = new Set<OpportunityId>(["mobilite-francophone", "lmia-work", "iec", "ict", "pgwp", "spouse-owp"]);

const months = (days: number) => Math.max(1, Math.round(days / 30));
const add = (...ranges: Range[]): Range => ranges.reduce<Range>((t, r) => [t[0] + r[0], t[1] + r[1]], [0, 0]);

function speedOf(total: Range | null): Speed {
  if (!total) return "Incertain";
  if (total[1] <= 12) return "Rapide";
  if (total[1] <= 24) return "Moyen";
  return "Long";
}

function timelineOf(
  match: OpportunityMatch,
  chance: Chance,
  scenario: Profile,
  category: EeCategory | undefined,
  rounds: EeRound[],
  today: string,
): Timeline {
  const id = match.program.id;
  const offer = scenario.workHasOffer;
  const finish = (prep: Range, wait: Range | null, processing: Range, detail: string): Timeline => {
    const totalMonths = wait ? add(prep, wait, processing) : null;
    return { speed: speedOf(totalMonths), totalMonths, prepMonths: prep, waitMonths: wait, processingMonths: processing, detail };
  };

  if (match.status === "blocked" || match.status === "closed") {
    return finish([0, 0], null, [0, 0], "Non admissible actuellement.");
  }

  if (match.status === "bridge") {
    // Voie accessible seulement après une étape (ex. CEC depuis l’étranger) : permis + 12 mois de travail d’abord.
    const processing = PROCESSING[id] ?? [5, 7];
    const search: Range = offer ? [0, 2] : EMPLOYER_SEARCH;
    return finish(add(search, [1, 4]), [12, 12], processing, "Étape préalable : obtenir un permis (travail ou études), puis cumuler 12 mois de travail qualifié avant le dépôt.");
  }

  if (TWO_STEP.has(id)) {
    const search: Range = offer || id === "iec" || id === "pgwp" || id === "spouse-owp" ? [0, 2] : EMPLOYER_SEARCH;
    return finish(add(search, [1, 4]), [12, 12], [5, 7], "Voie en 2 étapes : permis temporaire, 12 mois de travail qualifié, puis RP (CEC).");
  }

  if (category) {
    const prep = PREP[id] ?? [1, 3];
    const processing = PROCESSING[id] ?? [5, 7];
    const cadence = drawCadence(rounds, category, today);
    if (chance.level === "faible" || cadence.avgGapDays == null) {
      return finish(prep, null, processing, cadence.count === 0 ? "Aucun tirage récent dans cette catégorie : délai d’invitation imprévisible." : "Score sous les derniers seuils : invitation non garantie.");
    }
    const gap = months(cadence.avgGapDays);
    const wait: Range = chance.level === "élevée" ? [0, gap] : [gap, Math.max(gap * 3, 6)];
    return finish(prep, wait, processing, `${cadence.count} tirage(s) de cette catégorie en 6 mois (≈ 1 toutes les ${Math.round(cadence.avgGapDays / 7)} semaines) ; traitement IRCC ${processing[0]}-${processing[1]} mois.`);
  }

  const volet = PSTQ_VOLET[id];
  if (volet) {
    const inQuebec = scenario.currentlyInCanada && scenario.province === "Québec";
    const cadence = arrimaVoletCadence(volet, { abroad: !inQuebec, today });
    const prep = PREP[id] ?? [1, 2];
    const processing = PROCESSING[id] ?? [18, 30];
    if (chance.level === "faible" || cadence.avgGapDays == null) {
      return finish(prep, null, processing, "Pointage Arrima sous les seuils récents ou aucune ronde ouverte à ce profil : invitation imprévisible.");
    }
    const gap = months(cadence.avgGapDays);
    const wait: Range = chance.level === "élevée" ? [0, gap] : [gap, 12];
    return finish(prep, wait, processing, `${cadence.count} ronde(s) du volet ${volet} en 2026 ; CSQ puis RP fédérale ≈ ${processing[0]}-${processing[1]} mois (estimation).`);
  }

  const prep = PREP[id] ?? [1, 3];
  const processing = PROCESSING[id];
  if (!processing) return finish(prep, null, [0, 0], "Pas une voie directe vers la résidence permanente.");
  if (match.needsEmployer && !offer) {
    return finish(add(prep, EMPLOYER_SEARCH), [0, 2], processing, "Dépend du temps pour trouver un employeur désigné (3 à 12 mois).");
  }
  const wait: Range = id === "pnp" ? [3, 9] : [0, 2];
  return finish(prep, wait, processing, id === "pnp" ? "Nomination provinciale (3-9 mois) puis étape fédérale." : `Traitement ${processing[0]}-${processing[1]} mois.`);
}

const SPEED_ORDER: Record<Speed, number> = { Rapide: 0, Moyen: 1, Long: 2, Incertain: 3 };

export type CrsCheck = { score: number; cutoff: number; date: string; drawName: string; above: boolean };

export type BestProgram = OpportunityMatch & {
  /** Rôle du demandeur principal dans ce scénario. */
  filer: PrincipalMode;
  filerName: string;
  province: string;
  /** Programme fédéral : la province est indicative (au choix hors Québec). */
  provinceFlexible: boolean;
  fundsToShowCad: number;
  crsCheck: CrsCheck | null;
  rank: number;
  penalties: string[];
  chance: Chance;
  timeline: Timeline;
  arrima: ArrimaScore | null;
  /** Départage entre scénarios : CRS pour Entrée express, sinon score du moteur. */
  tieScore: number;
};

export type QuebecLever = { id: string; label: string; gain: number };

/** Voie Québec : toujours visible si un volet du PSTQ est ouvert (déclaration Arrima gratuite). */
export type QuebecOption = BestProgram & {
  threshold: ArrimaRound | null;
  /** Points manquants (max estimé vs dernier seuil publié) ; 0 si atteint ; null sans seuil. */
  gapToThreshold: number | null;
  levers: QuebecLever[];
  /** Vrai si la somme des leviers suffit à atteindre le dernier seuil publié. */
  reachableWithLevers: boolean;
};

export type BestProgramsResult = {
  top: BestProgram[];
  all: BestProgram[];
  suggestedProvince: string;
  budgetUsed: number;
  missingInfo: string[];
  firstSteps: OpportunityStrategy[];
  quebec: QuebecOption | null;
};

type Adult = { role: PrincipalMode; member: AdultMember };

function adultsOf(profile: Profile): Adult[] {
  const out: Adult[] = [{ role: "applicant", member: profile.applicant }];
  if (familyHasSpouse(profile.family)) out.push({ role: "spouse", member: profile.spouse });
  if (familyIsPolygamous(profile.family)) {
    for (const s of profile.extraSpouses) out.push({ role: `extra:${s.id}`, member: s });
  }
  return out;
}

export function cvBudget(profile: Profile): number {
  return householdFundsCad(profile);
}

/** Retire tout ce que le conseiller a « coché » pour ne garder que le CV. */
function cvOnly(profile: Profile): Profile {
  return {
    ...structuredClone(profile),
    objective: "Résidence permanente",
    workPermitKind: "",
    studyLevel: "",
    studyProgramId: "",
    visitPurpose: "",
    visitDuration: "",
    businessPath: "",
    budget: cvBudget(profile),
  };
}

function allowedProvinces(match: OpportunityMatch): string[] {
  const p = match.program;
  if (p.authority.startsWith("Québec") || p.id === "peq") return ["Québec"];
  if (p.id === "aip") return CANDIDATE_PROVINCES.filter((x) => ATLANTIC.has(x));
  if (p.id.startsWith("ee-") || ["pnp", "rcip", "fcip", "mobilite-francophone", "pnp-entrepreneur"].includes(p.id)) {
    return CANDIDATE_PROVINCES.filter((x) => x !== "Québec");
  }
  return [...CANDIDATE_PROVINCES];
}

function provinceOrder(programId: OpportunityId, offerProvince: string): string[] {
  const base = ["fcip", "mobilite-francophone", "ee-french"].includes(programId) ? FRANCOPHONE_FIRST : GENERIC_ORDER;
  return offerProvince ? [offerProvince, "Québec", ...base] : ["Québec", ...base];
}

function rankOf(
  match: OpportunityMatch,
  scenario: Profile,
  crsCheck: CrsCheck | null,
  fundsToShowCad: number,
  hasEeCategory: boolean,
): { rank: number; penalties: string[] } {
  const base: Record<OpportunityStatus, number> = { ready: 100, lever: 70, bridge: 45, blocked: 0, closed: 0 };
  const penalties: string[] = [];
  let rank = base[match.status];
  if (match.needsEmployer && !scenario.workHasOffer) {
    rank -= 25;
    penalties.push("Employeur canadien à trouver depuis l’étranger.");
  }
  if (!match.affordable) {
    rank -= 20;
    penalties.push(`Frais estimés au-delà du budget (${Math.round(scenario.budget).toLocaleString("fr-CA")} $).`);
  }
  if (fundsToShowCad > scenario.budget) {
    rank -= 15;
    penalties.push(`Fonds d’établissement ≈ ${fundsToShowCad.toLocaleString("fr-CA")} $ à prouver.`);
  }
  if (crsCheck) {
    if (crsCheck.above) rank += 15;
    else if (crsCheck.cutoff - crsCheck.score > 50) {
      // Une invitation est alors très peu probable : la voie ne doit pas passer devant une voie réaliste.
      rank -= 40;
      penalties.push(`CRS estimé ${crsCheck.score} loin du dernier seuil (${crsCheck.cutoff}) : invitation peu probable.`);
    } else {
      rank -= 10;
      penalties.push(`CRS estimé ${crsCheck.score} sous le dernier seuil (${crsCheck.cutoff}).`);
    }
  } else if (hasEeCategory) {
    rank -= 20;
    penalties.push("Aucun tirage récent (12 derniers mois) dans cette catégorie Entrée express.");
  }
  if (DIRECT_PR.has(match.program.family)) rank += 10;
  return { rank, penalties };
}

export function findBestPrograms(
  profile: Profile,
  {
    cutoffs = {},
    today,
    rounds = eeRoundsSnapshot.rounds,
  }: { cutoffs?: Partial<Record<EeCategory, EeCutoff>>; today?: string; rounds?: EeRound[] } = {},
): BestProgramsResult {
  const now = today ?? new Date().toISOString().slice(0, 10);
  const cv = cvOnly(profile);
  const adults = adultsOf(cv);
  const offerProvince = cv.workHasOffer ? cv.offerProvince : "";
  const best = new Map<OpportunityId, BestProgram>();
  let firstSteps: OpportunityStrategy[] = [];

  for (const adult of adults) {
    for (const province of CANDIDATE_PROVINCES) {
      const scenario: Profile = { ...cv, principalMode: adult.role, province, studyProvince: province };
      const report = runOpportunities(scenario, today);
      if (firstSteps.length === 0) firstSteps = report.strategies.filter((s) => s.best);
      const crs = computeCrsScore(scenario).total;
      for (const match of report.matches) {
        if (!allowedProvinces(match).includes(province)) continue;
        const id = match.program.id;
        const category = EE_CATEGORY[id];
        const rawCutoff = category ? cutoffs[category] : undefined;
        const cutoff = rawCutoff && daysBetween(rawCutoff.date, now) <= MAX_CUTOFF_AGE_DAYS ? rawCutoff : undefined;
        const crsCheck = cutoff
          ? { score: crs, cutoff: cutoff.crs, date: cutoff.date, drawName: cutoff.name, above: crs >= cutoff.crs }
          : null;
        const fundsToShowCad =
          SETTLEMENT_FUNDS_PROGRAMS.has(id) && !scenario.workHasOffer && scenario.canadianExperienceYears < 1
            ? settlementFundsFor(irccFamilySize(scenario))
            : 0;
        const { rank: baseRank, penalties } = rankOf(match, scenario, crsCheck, fundsToShowCad, Boolean(category));
        const arrima = PSTQ_VOLET[id] ? arrimaScore({ principal: adult.member, partner: partnerOf(scenario, adult), profile: scenario }) : null;
        const chance = chanceOf(match, scenario, crsCheck, Boolean(category), arrima);
        // Entrée express : l’écart CRS est déjà intégré par rankOf ; ailleurs, le niveau de chance ajuste le rang.
        const rank = category ? baseRank : baseRank + CHANCE_RANK[chance.level];
        const timeline = timelineOf(match, chance, scenario, category, rounds, now);
        const candidate: BestProgram = {
          ...match,
          filer: adult.role,
          filerName: adult.member.firstName || (adult.role === "applicant" ? "Candidat" : "Conjoint"),
          province,
          provinceFlexible: allowedProvinces(match).length > 1 && !allowedProvinces(match).includes("Québec"),
          fundsToShowCad,
          crsCheck,
          rank,
          penalties,
          chance,
          timeline,
          arrima,
          tieScore: category ? crs : match.score,
        };
        const current = best.get(id);
        const order = provinceOrder(id, offerProvince);
        const better =
          !current ||
          candidate.rank > current.rank ||
          (candidate.rank === current.rank && candidate.tieScore > current.tieScore) ||
          (candidate.rank === current.rank &&
            candidate.tieScore === current.tieScore &&
            current.filer === candidate.filer &&
            order.indexOf(province) < order.indexOf(current.province));
        if (better) best.set(id, candidate);
      }
    }
  }

  // Le niveau de chance prime : un programme « moyenne » passe devant un « faible », puis le rang départage.
  const CHANCE_ORDER: Record<ChanceLevel, number> = { élevée: 0, moyenne: 1, faible: 2 };
  const all = [...best.values()].sort(
    (a, b) =>
      CHANCE_ORDER[a.chance.level] - CHANCE_ORDER[b.chance.level] ||
      SPEED_ORDER[a.timeline.speed] - SPEED_ORDER[b.timeline.speed] ||
      b.rank - a.rank ||
      b.score - a.score,
  );
  const top = all
    .filter((m) => !EXPLORATION.has(m.program.id))
    .filter((m) => m.status === "ready" || m.status === "lever" || m.status === "bridge")
    .slice(0, 5);

  const missingInfo: string[] = [];
  for (const a of adults) {
    const name = a.member.firstName || "Adulte";
    const ownNoc = a.role === "applicant" ? profile.workNocCode : a.member.workNocCode;
    if (!ownNoc && !professionNoc(a.member.profession)) missingInfo.push(`Code CNP de ${name} (métier non reconnu).`);
    if (a.member.french === "Débutant" && a.member.english === "Débutant") {
      missingInfo.push(`Niveau de langue de ${name} : un test officiel peut ouvrir des programmes.`);
    }
  }

  return {
    top,
    all,
    suggestedProvince: top[0]?.province ?? (profile.province || "Québec"),
    budgetUsed: cv.budget,
    missingInfo,
    firstSteps,
    quebec: quebecOption(cv, adults, all),
  };
}

const NEXT_FRENCH: Record<string, string> = { Débutant: "Intermédiaire", Intermédiaire: "Avancé", Avancé: "Bilingue" };

/** « de Paul » / « d’Aminata » : élision devant une voyelle ou un h muet. */
function deName(name: string): string {
  return /^[aeiouyhàâäéèêëîïôöùûü]/i.test(name) ? `d’${name}` : `de ${name}`;
}

function quebecOption(cv: Profile, adults: Adult[], all: BestProgram[]): QuebecOption | null {
  const open = all.filter((m) => PSTQ_VOLET[m.program.id] && (m.status === "ready" || m.status === "lever") && m.arrima);
  const pick = open.sort((a, b) => (b.arrima?.max ?? 0) - (a.arrima?.max ?? 0))[0];
  if (!pick?.arrima) return null;
  const filer = adults.find((a) => a.role === pick.filer) ?? adults[0]!;
  const scenario: Profile = { ...cv, province: "Québec", principalMode: filer.role };
  const partner = partnerOf(scenario, filer);
  const inQuebec = scenario.currentlyInCanada;
  const threshold = latestArrimaThreshold(PSTQ_VOLET[pick.program.id]!, { abroad: !inQuebec });
  const base = arrimaScore({ principal: filer.member, partner, profile: scenario }).max;
  const gainOf = (principal: AdultMember, p: AdultMember | null, prof: Profile) =>
    arrimaScore({ principal, partner: p, profile: prof }).max - base;

  const levers: QuebecLever[] = [];
  const nextPrincipal = NEXT_FRENCH[filer.member.french];
  if (nextPrincipal) {
    levers.push({
      id: "qc-french-principal",
      label: `Français ${filer.member.firstName ? deName(filer.member.firstName) : "de la personne qui dépose"} au niveau ${nextPrincipal} (test officiel)`,
      gain: gainOf({ ...filer.member, french: nextPrincipal }, partner, scenario),
    });
  }
  if (partner) {
    const nextSpouse = NEXT_FRENCH[partner.french];
    if (nextSpouse) {
      levers.push({
        id: "qc-french-spouse",
        label: `Français ${partner.firstName ? deName(partner.firstName) : "de l’accompagnant"} au niveau ${nextSpouse}`,
        gain: gainOf(filer.member, { ...partner, french: nextSpouse }, scenario),
      });
    }
  }
  if (!(scenario.workHasOffer && scenario.offerProvince === "Québec")) {
    levers.push({
      id: "qc-offer",
      label: "Offre d’emploi validée au Québec (50 hors région de Montréal, 30 dans la région)",
      gain: gainOf(filer.member, partner, { ...scenario, workHasOffer: true, offerProvince: "Québec" }),
    });
  }
  const kept = levers.filter((l) => l.gain > 0).sort((a, b) => b.gain - a.gain);
  const gapToThreshold = threshold?.minScore != null ? Math.max(0, threshold.minScore - pick.arrima.max) : null;
  return {
    ...pick,
    threshold,
    gapToThreshold,
    levers: kept,
    reachableWithLevers: gapToThreshold != null && kept.reduce((t, l) => t + l.gain, 0) >= gapToThreshold,
  };
}

/* ——— Leviers : ce qu’une amélioration précise débloquerait ——— */

export type Lever = {
  id: string;
  label: string;
  /** Programmes qui passeraient à « chance élevée ». */
  newHighChance: string[];
  /** Gain de pointage Arrima maximal estimé (programmes PSTQ). */
  arrimaGain: number;
  cost: string;
};

const LANGUAGE_ORDER = ["Débutant", "Intermédiaire", "Avancé", "Bilingue"];

function highChanceIds(result: BestProgramsResult): Set<string> {
  return new Set(result.all.filter((m) => m.chance.level === "élevée").map((m) => m.program.id));
}

function bestArrimaMax(result: BestProgramsResult): number {
  return Math.max(0, ...result.all.map((m) => m.arrima?.max ?? 0));
}

/** Teste chaque amélioration réaliste et ne garde que celles qui changent quelque chose. */
export function findLevers(
  profile: Profile,
  options: { cutoffs?: Partial<Record<EeCategory, EeCutoff>>; today?: string; rounds?: EeRound[] } = {},
): Lever[] {
  const base = findBestPrograms(profile, options);
  const baseHigh = highChanceIds(base);
  const baseArrima = bestArrimaMax(base);
  const variants: { id: string; label: string; cost: string; apply: (p: Profile) => Profile }[] = [];

  for (const adult of adultsOf(profile)) {
    const name = adult.member.firstName || (adult.role === "applicant" ? "le candidat" : "le conjoint");
    const key = adult.role === "applicant" ? "applicant" : adult.role === "spouse" ? "spouse" : adult.role;
    const patch = (p: Profile, change: Partial<AdultMember>): Profile => {
      if (adult.role === "applicant") return { ...p, applicant: { ...p.applicant, ...change } };
      if (adult.role === "spouse") return { ...p, spouse: { ...p.spouse, ...change } };
      return { ...p, extraSpouses: p.extraSpouses.map((s) => (`extra:${s.id}` === adult.role ? { ...s, ...change } : s)) };
    };
    if (LANGUAGE_ORDER.indexOf(adult.member.french) < LANGUAGE_ORDER.indexOf("Avancé")) {
      variants.push({
        id: `french-${key}`,
        label: `Français NCLC 7 pour ${name} (test TEF/TCF Canada)`,
        cost: "≈ 400 $ de test + cours",
        apply: (p) => patch(p, { french: "Avancé" }),
      });
    }
    if (LANGUAGE_ORDER.indexOf(adult.member.english) < LANGUAGE_ORDER.indexOf("Avancé")) {
      variants.push({
        id: `english-${key}`,
        label: `Anglais CLB 7 pour ${name} (IELTS / CELPIP)`,
        cost: "≈ 400 $ de test + cours",
        apply: (p) => patch(p, { english: "Avancé" }),
      });
    }
  }
  if (!profile.workHasOffer) {
    variants.push({
      id: "job-offer",
      label: "Obtenir une offre d’emploi canadienne",
      cost: "Recherche d’emploi (salons, Destination Canada, employeurs désignés)",
      apply: (p) => ({ ...p, workHasOffer: true, offerProvince: p.offerProvince || "Ontario" }),
    });
  }

  const levers: Lever[] = [];
  for (const v of variants) {
    const result = findBestPrograms(v.apply(structuredClone(profile)), options);
    const newHighChance = result.all
      .filter((m) => m.chance.level === "élevée" && !baseHigh.has(m.program.id))
      .map((m) => m.program.name);
    const arrimaGain = bestArrimaMax(result) - baseArrima;
    if (newHighChance.length > 0 || arrimaGain > 0) {
      levers.push({ id: v.id, label: v.label, newHighChance, arrimaGain, cost: v.cost });
    }
  }
  return levers.sort((a, b) => b.newHighChance.length - a.newHighChance.length || b.arrimaGain - a.arrimaGain);
}

/** Avertissements d’une carte, sans répéter la raison de chance ni l’écart CRS déjà affiché en badge. */
export function cardWarnings(item: BestProgram): string[] {
  const out: string[] = [];
  for (const w of [...item.penalties, ...item.gaps.slice(0, 2)]) {
    if (w === item.chance.reason) continue;
    if (item.crsCheck && w.startsWith("CRS estimé")) continue;
    if (!out.includes(w)) out.push(w);
  }
  return out;
}
