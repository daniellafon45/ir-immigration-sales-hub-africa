import {
  arrimaAgePoints,
  arrimaEducationPoints,
  arrimaExperiencePoints,
  arrimaRounds2026,
  arrimaScore,
  latestArrimaThreshold,
  type ArrimaRound,
} from "@/data/arrima";
import { familyLinkById } from "@/data/family-links";
import { irccFamilySize, settlementFundsFor } from "@/data/ircc-funds";
import { teerOf, type Teer } from "@/data/noc-2021";
import {
  iecCountryMaxAge,
  opportunityById,
  opportunityPrograms,
  type OpportunityId,
  type OpportunityProgram,
} from "@/data/opportunities";
import { professionNoc } from "@/data/profession-noc";
import { quebecRegulation } from "@/data/quebec-regulated";
import { familyHasSpouse, type AdultMember, type Profile } from "@/lib/engine-profile";
import { getPrincipalMember } from "@/lib/principal";

/**
 * ready   : admissible maintenant, on peut déposer
 * lever   : un seul écart corrigeable (test de langue, offre, évaluation)
 * bridge  : accessible après une étape temporaire (travail, études)
 * blocked : non admissible dans la situation actuelle
 * closed  : programme fermé ou suspendu — voir les alternatives
 */
export type OpportunityStatus = "ready" | "lever" | "bridge" | "blocked" | "closed";

export type OpportunityMatch = {
  program: OpportunityProgram;
  status: OpportunityStatus;
  score: number;
  why: string[];
  gaps: string[];
  watch: string[];
  urgent: boolean;
  /** Coût indicatif pour toute la famille (frais, tests, examens). */
  estimatedCost: number;
  affordable: boolean;
  /** Une offre d’emploi canadienne est nécessaire dans ce cas précis. */
  needsEmployer: boolean;
};

export type StrategyStep = { label: string; programId: OpportunityId; costCad?: number };

export type OpportunityStrategy = {
  id: string;
  title: string;
  /** sequence : étapes à enchaîner ; options : voies au choix. */
  mode: "sequence" | "options";
  steps: StrategyStep[];
  rationale: string;
  /** Frais indicatifs à payer pour toute la famille. */
  costCad: number;
  /** Fonds à montrer (non dépensés), ex. fonds d’établissement. */
  fundsToShowCad: number;
  needsEmployer: boolean;
  barriers: string[];
  /** Plan sans obstacle financier ni employeur à trouver. */
  best: boolean;
};

type StrategyDraft = Pick<OpportunityStrategy, "id" | "title" | "steps" | "rationale"> & {
  mode?: OpportunityStrategy["mode"];
  fundsToShowCad?: number;
  urgent?: boolean;
};

export type ArrimaEstimate = {
  age: number;
  education: number;
  experience: number;
  subtotal: number;
  withSpouse: boolean;
  volet: 1 | 2 | 3 | null;
  recentRounds: number;
  roundsOpenAbroad: number;
  /** Pointage Arrima complet (grille officielle), en fourchette. */
  min: number;
  max: number;
  /** Dernière ronde du volet avec pointage minimal accessible au client. */
  threshold: ArrimaRound | null;
};

export type OpportunityReport = {
  matches: OpportunityMatch[];
  strategies: OpportunityStrategy[];
  arrima: ArrimaEstimate;
  counts: Record<OpportunityStatus, number>;
};

type Ctx = {
  profile: Profile;
  member: AdultMember;
  spouse: AdultMember | null;
  /** Adulte accompagnant le demandeur principal (facteurs du conjoint). */
  partner: AdultMember | null;
  teer: Teer | null;
  fr: number;
  en: number;
  bestLang: number;
  regulated: boolean;
  titleRegulated: boolean;
  trade: boolean;
  health: boolean;
  inCanada: boolean;
  inQuebec: boolean;
  wantsQuebec: boolean;
  canExp: number;
  hasOffer: boolean;
  offerProvince: string;
  graduatedInCanada: boolean;
  extraAdults: number;
  children: number;
  today: string;
};

/** Estimation NCLC/CLB à partir du niveau déclaré — à remplacer par un test officiel. */
const NCLC: Record<string, number> = { Débutant: 3, Intermédiaire: 5, Avancé: 7, Bilingue: 9 };

// Professions réglementées : liste officielle du MIFI (src/data/quebec-regulated.ts).
const TRADE_PREFIXES = ["72", "73", "82", "83", "92", "93", "632"];
const ATLANTIC = ["Nouveau-Brunswick", "Nouvelle-Écosse", "Île-du-Prince-Édouard", "Terre-Neuve-et-Labrador"];

function buildCtx(profile: Profile, today: string): Ctx {
  // `getPrincipalMember` renvoie l’adulte du profil moteur reçu : ses champs de travail sont présents.
  const member = getPrincipalMember(profile) as AdultMember;
  const ownNoc = member === profile.applicant ? profile.workNocCode : member.workNocCode;
  const noc = ownNoc || professionNoc(member.profession) || "";
  const teer = noc ? teerOf(noc) : null;
  const fr = NCLC[member.french] ?? 0;
  const en = NCLC[member.english] ?? 0;
  const inQuebec = profile.currentlyInCanada && profile.province === "Québec";
  return {
    profile,
    member,
    spouse: familyHasSpouse(profile.family) ? profile.spouse : null,
    partner: !familyHasSpouse(profile.family) ? null : member === profile.applicant ? profile.spouse : profile.applicant,
    teer,
    fr,
    en,
    bestLang: Math.max(fr, en),
    regulated: quebecRegulation(noc) === "full",
    titleRegulated: quebecRegulation(noc) === "partial",
    trade: TRADE_PREFIXES.some((p) => noc.startsWith(p)),
    health: member.sector === "Santé",
    inCanada: profile.currentlyInCanada,
    inQuebec,
    wantsQuebec: profile.province === "Québec",
    canExp: profile.canadianExperienceYears,
    hasOffer: member === profile.applicant ? profile.workHasOffer : member.workHasOffer || profile.workHasOffer,
    offerProvince: profile.offerProvince || (profile.workHasOffer ? profile.province : ""),
    graduatedInCanada: profile.canadianCredentialTier !== "none",
    extraAdults: familyHasSpouse(profile.family) ? 1 : 0,
    children: profile.children.length,
    today,
  };
}

type Eval = {
  status: OpportunityStatus;
  why?: string[];
  gaps?: string[];
  watch?: string[];
  bonus?: number;
  /** Le profil exige une offre d’emploi même si le programme n’en exige pas toujours. */
  needsEmployer?: boolean;
};

const skilled = (c: Ctx) => c.teer != null && c.teer <= 3;
const teerLabel = (c: Ctx) => (c.teer == null ? "FEER inconnue" : `FEER ${c.teer}`);

/**
 * Grille de sélection officielle des travailleurs qualifiés (FSW) — 67 points requis.
 * Langues : estimation NCLC à partir du niveau déclaré (un test officiel fait foi).
 */
const FSW_PASS = 67;
const FSW_EDUCATION: Record<string, number> = {
  Secondaire: 5,
  "Formation professionnelle": 15,
  "DEC / Collège": 19,
  "Baccalauréat / Licence": 21,
  "Maîtrise / Master": 23,
  Doctorat: 25,
};

function fswAgePoints(age: number) {
  if (age < 18) return 0;
  if (age <= 35) return 12;
  return Math.max(0, 12 - (Math.floor(age) - 35));
}

function fswFirstLanguage(nclc: number) {
  const perAbility = nclc >= 9 ? 6 : nclc >= 8 ? 5 : nclc >= 7 ? 4 : 0;
  return perAbility * 4;
}

function fswExperience(years: number) {
  if (years >= 6) return 15;
  if (years >= 4) return 13;
  if (years >= 2) return 11;
  if (years >= 1) return 9;
  return 0;
}

export function fswPoints({
  member,
  spouse,
  profile,
}: {
  member: AdultMember;
  spouse: AdultMember | null;
  profile: Profile;
}) {
  const fr = NCLC[member.french] ?? 0;
  const en = NCLC[member.english] ?? 0;
  const first = Math.max(fr, en);
  const second = Math.min(fr, en);
  const language = fswFirstLanguage(first) + (second >= 5 ? 4 : 0);
  const education = FSW_EDUCATION[member.education] ?? 0;
  const experience = fswExperience(member.experience);
  const age = fswAgePoints(member.age);
  const arranged = profile.workHasOffer ? 10 : 0;
  const spouseLang = spouse ? Math.max(NCLC[spouse.french] ?? 0, NCLC[spouse.english] ?? 0) : 0;
  const adaptability = Math.min(
    10,
    (spouse && spouseLang >= 4 ? 5 : 0) +
      (profile.canadianCredentialTier !== "none" ? 5 : 0) +
      (profile.canadianExperienceYears >= 1 ? 10 : 0) +
      (profile.spouseHasCanadianExperience ? 5 : 0) +
      (profile.workHasOffer ? 5 : 0) +
      (profile.hasSiblingInCanada ? 5 : 0),
  );
  const total = language + education + experience + age + arranged + adaptability;
  return { total, language, education, experience, age, arranged, adaptability, pass: total >= FSW_PASS };
}

const fswOf = (c: Ctx, member: AdultMember = c.member) => fswPoints({ member, spouse: c.partner, profile: c.profile });

function fswGap(points: number) {
  return `Grille FSW : ${points}/${FSW_PASS} points — leviers : langue (NCLC 9 ≈ +8), diplôme, offre d’emploi (+15).`;
}

function eeEligible(c: Ctx): boolean {
  const fsw = skilled(c) && c.member.experience >= 1 && c.bestLang >= 7 && fswOf(c).pass;
  const cec = skilled(c) && c.canExp >= 1 && c.bestLang >= (c.teer != null && c.teer <= 1 ? 7 : 5);
  const fst = c.trade && c.member.experience >= 2 && c.bestLang >= 5 && c.hasOffer;
  return fsw || cec || fst;
}

const EVALUATORS: Record<OpportunityId, (c: Ctx) => Eval> = {
  "pstq-v1": (c) => {
    if (c.teer == null || c.teer > 2) return { status: "blocked", gaps: [`Profession ${teerLabel(c)} : volet 1 réservé à FEER 0-1-2.`] };
    if (c.regulated) return { status: "blocked", gaps: ["Profession réglementée : passer par le volet 3."] };
    const gaps: string[] = [];
    if (c.fr < 5) {
      // Passer d’un niveau débutant à NCLC 7 prend en général plus d’un an : pas un levier à court terme.
      return { status: "blocked", gaps: [`Français estimé NCLC ${c.fr} — NCLC 7 oral / 5 écrit exigé (plusieurs mois d’apprentissage).`] };
    }
    if (c.fr < 7) gaps.push(`Français estimé NCLC ${c.fr} — viser NCLC 7 oral / 5 écrit.`);
    if (c.member.experience < 1) gaps.push("Moins de 12 mois d’expérience dans la profession.");
    const watch = c.inQuebec ? [] : ["Plusieurs rondes 2026 (juillet-septembre) exigeaient une présence au Québec."];
    if (gaps.length === 0) return { status: "ready", why: [`${teerLabel(c)}, français NCLC ${c.fr}, ${c.member.experience} ans d’expérience.`], watch, bonus: c.wantsQuebec ? 10 : 0 };
    return { status: gaps.length === 1 ? "lever" : "blocked", gaps, watch };
  },
  "pstq-v2": (c) => {
    if (c.teer == null || c.teer < 3) return { status: "blocked", gaps: [`Profession ${teerLabel(c)} : volet 2 réservé à FEER 3-4-5.`] };
    const gaps: string[] = [];
    if (c.fr < 5) gaps.push(`Français estimé NCLC ${c.fr} — viser NCLC 5 oral.`);
    if (c.member.experience < 2) gaps.push("24 mois d’expérience exigés.");
    if (!(c.inQuebec && c.canExp >= 1)) {
      return { status: gaps.length ? "blocked" : "bridge", gaps: ["12 mois d’expérience au Québec exigés — d’abord un permis de travail au Québec.", ...gaps] };
    }
    return gaps.length ? { status: "lever", gaps } : { status: "ready", why: ["Expérience québécoise et FEER 3-5 alignées."], bonus: 10 };
  },
  "pstq-v3": (c) => {
    if (!c.regulated && !c.titleRegulated) return { status: "blocked", gaps: ["Pas d’intention d’exercer une profession réglementée déclarée."] };
    const need = c.teer != null && c.teer <= 2 ? 7 : 5;
    const gaps = ["Évaluation par l’ordre professionnel à lancer."];
    if (c.fr < need) gaps.push(`Français estimé NCLC ${c.fr} — viser NCLC ${need}.`);
    return { status: gaps.length === 1 ? "lever" : "blocked", why: [`${c.member.profession} : profession ciblée par les rondes du volet 3.`], gaps, bonus: 8 };
  },
  "pstq-v4": (c) =>
    c.member.education === "Doctorat"
      ? { status: "lever", why: ["Doctorat : à explorer si réalisations reconnues (recherche)."], gaps: ["Avis favorable d’un organisme (FRQ, CALQ, INS, MEIE) requis."] }
      : { status: "blocked", gaps: ["Réservé aux réalisations exceptionnelles reconnues."] },
  peq: (c) => {
    if (c.today > "2026-10-31") return { status: "closed", gaps: ["Fenêtre du 31 octobre 2026 dépassée."] };
    if (c.inQuebec && (c.canExp >= 1 || c.graduatedInCanada)) {
      return { status: "ready", why: ["Déjà au Québec avec diplôme ou expérience québécoise."], watch: ["Seulement si admissible à la date d’abolition (nov. 2025) — vérifier."], bonus: 25 };
    }
    return { status: "blocked", gaps: ["Réservé aux personnes déjà au Québec (diplômés / travailleurs) lors de l’abolition."] };
  },
  "ee-fsw": (c) => {
    if (!skilled(c)) return { status: "blocked", gaps: [`Profession ${teerLabel(c)} : FEER 0-3 requise.`] };
    const hard: string[] = [];
    const soft: string[] = [];
    if (c.member.experience < 1) hard.push("1 an d’expérience qualifiée continue requis.");
    if (c.bestLang < 7) hard.push(`Meilleure langue estimée NCLC ${c.bestLang} — NCLC 7 requis.`);
    const points = fswOf(c).total;
    if (points < FSW_PASS) {
      const gap = fswGap(points);
      if (points < FSW_PASS - 10) hard.push(gap);
      else soft.push(gap);
    }
    const funds = settlementFundsFor(irccFamilySize(c.profile));
    if (c.profile.budget < funds && !c.hasOffer) {
      soft.push(`Fonds d’établissement ≈ ${funds.toLocaleString("fr-CA")} $ à prouver.`);
    }
    const watch = c.wantsQuebec ? ["Destination Québec : la RP fédérale exige de s’installer hors Québec."] : [];
    if (hard.length === 0 && soft.length === 0) {
      return { status: "ready", why: [`Grille FSW ${points}/${FSW_PASS}, expérience, langue et fonds compatibles.`], watch };
    }
    // Bloquant seulement si critères durs non rattrapables à court terme.
    if (hard.length > 0) return { status: "blocked", gaps: [...hard, ...soft], watch };
    return { status: "lever", gaps: soft, watch, bonus: 8 };
  },
  "ee-cec": (c) => {
    if (!skilled(c)) return { status: "blocked", gaps: [`Profession ${teerLabel(c)} : FEER 0-3 requise.`] };
    if (c.canExp < 1) return { status: "bridge", gaps: ["12 mois de travail qualifié au Canada à cumuler."] };
    const need = c.teer != null && c.teer <= 1 ? 7 : 5;
    if (c.bestLang < need) return { status: "lever", gaps: [`Viser NCLC ${need}.`] };
    return { status: "ready", why: [`${c.canExp} an(s) d’expérience canadienne.`], bonus: 15 };
  },
  "ee-fst": (c) => {
    if (!c.trade) return { status: "blocked", gaps: ["Profession hors métiers spécialisés."] };
    const gaps: string[] = [];
    if (c.member.experience < 2) gaps.push("2 ans d’expérience dans le métier requis.");
    if (c.bestLang < 5) gaps.push("NCLC 5 oral / 4 écrit requis.");
    if (!c.hasOffer) gaps.push("Offre d’emploi ou certificat de qualification provincial requis.");
    if (gaps.length === 0) return { status: "ready", why: ["Métier, expérience et offre alignés."] };
    return { status: gaps.length === 1 ? "lever" : "blocked", gaps };
  },
  "ee-french": (c) => {
    const base = skilled(c) && (c.member.experience >= 1 || c.canExp >= 1);
    if (!base) return { status: "blocked", gaps: ["Il faut d’abord être admissible à Entrée express (FEER 0-3, 1 an d’expérience)."] };
    if (c.fr < 5) return { status: "blocked", gaps: ["Français insuffisant pour la catégorie francophone (viser NCLC 7)."] };
    // Admissibilité FSW avec le français visé (NCLC 7), sauf si CEC / FST couvre déjà le profil.
    const withTargetFrench = c.fr >= 7 ? c.member : { ...c.member, french: "Avancé" };
    const fswWithFrench = fswOf(c, withTargetFrench);
    const cecOrFst = (c.canExp >= 1 && c.fr >= 5) || (c.trade && c.hasOffer && c.member.experience >= 2);
    const nearFsw = fswWithFrench.total >= FSW_PASS - 10;
    const funds = settlementFundsFor(irccFamilySize(c.profile));
    const fundsGap =
      c.profile.budget < funds && !c.hasOffer && c.canExp < 1
        ? `Fonds d’établissement ≈ ${funds.toLocaleString("fr-CA")} $ à prouver.`
        : null;

    if (!fswWithFrench.pass && !cecOrFst) {
      // Proche de 67 pts : levier (ex. Aminata 62/67) — ne jamais enterrer la catégorie francophone.
      if (nearFsw) {
        const gaps = [fswGap(fswWithFrench.total)];
        if (c.fr < 7) gaps.unshift(`Français estimé NCLC ${c.fr} — monter à NCLC 7 dans les 4 compétences.`);
        if (fundsGap) gaps.push(fundsGap);
        return { status: "lever", gaps, bonus: c.fr >= 7 ? 22 : 12 };
      }
      return { status: "blocked", gaps: [fswGap(fswWithFrench.total)] };
    }

    if (c.fr >= 7) {
      if (fundsGap) return { status: "lever", why: [`Français NCLC ${c.fr} : tirages francophones à seuil bas.`], gaps: [fundsGap], bonus: 20 };
      return { status: "ready", why: [`Français NCLC ${c.fr} : accès aux tirages francophones à seuil bas.`], bonus: 24 };
    }
    return {
      status: "lever",
      gaps: [`Français estimé NCLC ${c.fr} — monter à NCLC 7 dans les 4 compétences.`, ...(fundsGap ? [fundsGap] : [])],
      bonus: 14,
    };
  },
  "ee-health": (c) => {
    if (!c.health) return { status: "blocked", gaps: ["Profession hors santé et services sociaux."] };
    if (!eeEligible(c)) return { status: "lever", gaps: ["Rendre le profil admissible à Entrée express (langue NCLC 7, expérience)."] };
    return { status: "ready", why: ["Profession santé ciblée par des tirages dédiés."], bonus: 12 };
  },
  "ee-trades": (c) => {
    if (!c.trade) return { status: "blocked", gaps: ["Profession hors métiers ciblés."] };
    if (!eeEligible(c)) return { status: "lever", gaps: ["Rendre le profil admissible à Entrée express (FST : offre ou certificat)."] };
    return { status: "ready", why: ["Métier ciblé par des tirages dédiés."], bonus: 8 };
  },
  pnp: (c) => {
    if (c.wantsQuebec && !c.offerProvince) return { status: "blocked", gaps: ["Le Québec n’a pas de PCP — choisir une autre province pour cette voie."] };
    if (c.profile.hasProvincialNomination) return { status: "ready", why: ["Nomination provinciale déjà obtenue."], bonus: 30 };
    if (c.hasOffer && c.offerProvince !== "Québec") return { status: "ready", why: [`Offre d’emploi en ${c.offerProvince}.`], bonus: 10 };
    const gaps = ["Lien provincial à créer : offre, études ou métier en pénurie de la province."];
    if (c.teer != null && c.teer >= 4) {
      gaps.push("FEER 4-5 : la plupart des volets provinciaux exigent une offre d’emploi d’un employeur de la province.");
      return { status: "lever", gaps, bonus: -15, needsEmployer: true };
    }
    return { status: "lever", gaps };
  },
  aip: (c) => {
    const lang = c.teer != null && c.teer <= 3 ? 5 : 4;
    if (c.teer === 5) return { status: "blocked", gaps: ["FEER 5 non admissible au programme atlantique."] };
    if (c.bestLang < lang) return { status: "blocked", gaps: [`NCLC ${lang} requis.`] };
    if (c.hasOffer && ATLANTIC.includes(c.offerProvince)) return { status: "ready", why: ["Offre en province atlantique."] };
    return { status: "lever", gaps: ["Offre d’un employeur désigné en Atlantique à obtenir."] };
  },
  rcip: (c) => {
    const lang = c.teer == null ? 5 : c.teer <= 1 ? 6 : c.teer <= 3 ? 5 : 4;
    if (c.bestLang < lang) return { status: "blocked", gaps: [`NCLC ${lang} requis pour ${teerLabel(c)}.`] };
    return { status: "lever", why: ["Ouvert à toutes les catégories FEER."], gaps: ["Offre d’un employeur désigné dans une communauté rurale participante."] };
  },
  fcip: (c) => {
    if (c.fr < 5) return { status: "blocked", gaps: [`Français estimé NCLC ${c.fr} — NCLC 5 requis.`] };
    return { status: "lever", why: ["Francophone : peu de concurrence, toutes FEER."], gaps: ["Offre d’un employeur désigné dans une communauté francophone hors Québec."], bonus: 10 };
  },
  "mobilite-francophone": (c) => {
    if (c.fr < 5) return { status: "blocked", gaps: [`Français estimé NCLC ${c.fr} — NCLC 5 oral requis.`] };
    if (c.hasOffer && c.offerProvince && c.offerProvince !== "Québec") {
      return { status: "ready", why: [`Offre hors Québec (${c.offerProvince}) et français NCLC ${c.fr} : permis sans EIMT.`], bonus: 20 };
    }
    return { status: "lever", why: ["Sans EIMT : l’employeur n’a pas à prouver une pénurie."], gaps: ["Trouver une offre d’emploi hors Québec."], watch: ["Hors Québec uniquement."], bonus: 15 };
  },
  "lmia-work": (c) =>
    c.hasOffer
      ? { status: "ready", why: ["Offre d’emploi déclarée."], watch: ["Vérifier que l’employeur obtient l’EIMT (et le CAQ au Québec)."] }
      : { status: "lever", gaps: ["Employeur prêt à demander une EIMT à trouver."] },
  iec: (c) => {
    const max = iecCountryMaxAge[c.profile.country];
    if (max == null) return { status: "blocked", gaps: [`${c.profile.country || "Pays"} sans accord EIC connu.`] };
    if (c.member.age > max || c.member.age < 18) return { status: "blocked", gaps: [`Âge ${c.member.age} hors plafond indicatif (${max} ans).`] };
    return { status: "ready", why: [`${c.profile.country} : accord EIC, âge ${c.member.age} ≤ ${max}.`], watch: ["Places limitées par saison — vérifier le plafond exact."], bonus: 15 };
  },
  study: (c) => {
    const watch = c.member.age >= 40 ? ["Projet d’études après 40 ans : justifier fortement la cohérence."] : [];
    if (c.profile.budget < 20000) return { status: "lever", gaps: ["Preuves de fonds (scolarité + subsistance) à renforcer."], watch };
    return { status: "lever", why: ["Diplôme canadien : points + PTPD + accès aux rondes réservées."], gaps: ["Admission à obtenir (EED, CAQ ou LAP)."], watch };
  },
  pgwp: (c) =>
    c.graduatedInCanada && c.inCanada
      ? { status: "ready", why: ["Diplôme canadien et présence au Canada."], bonus: 15 }
      : { status: "bridge", gaps: ["Accessible après un programme d’études admissible au Canada."] },
  "spouse-owp": (c) => {
    if (!c.spouse) return { status: "blocked", gaps: ["Pas de conjoint accompagnant."] };
    if (c.hasOffer && c.teer != null && c.teer <= 1) return { status: "ready", why: ["Principal en poste FEER 0-1 : conjoint admissible."] };
    if (c.profile.studyLevel === "master" || c.profile.studyLevel === "doctorate") {
      return { status: "ready", why: ["Études supérieures du principal (maîtrise 16 mois+ ou doctorat)."] };
    }
    return { status: "bridge", gaps: ["Ouvert si le principal fait une maîtrise 16 mois+ / doctorat ou occupe un poste FEER 0-1."] };
  },
  "family-spouse": (c) => {
    if (c.profile.familyLink !== "spouse") return { status: "blocked", gaps: ["Pas de conjoint au Canada déclaré."] };
    return c.profile.sponsorStatus
      ? { status: "ready", why: [`Répondant : ${c.profile.sponsorStatus}.`], bonus: 20 }
      : { status: "lever", gaps: ["Statut du répondant (citoyen / RP) à confirmer."] };
  },
  "family-child": (c) =>
    c.profile.familyLink === "child"
      ? { status: c.profile.sponsorStatus ? "ready" : "lever", gaps: c.profile.sponsorStatus ? [] : ["Statut du répondant à confirmer."] }
      : { status: "blocked", gaps: ["Pas de parent répondant au Canada déclaré."] },
  pgp: () => ({ status: "closed" }),
  "super-visa": (c) =>
    familyLinkById(c.profile.familyLink)?.superVisaAlt
      ? { status: "ready", why: ["Parent / grand-parent d’un résident du Canada."], bonus: 10 }
      : { status: "blocked", gaps: ["Réservé aux parents et grands-parents d’un citoyen ou RP."] },
  caregivers: () => ({ status: "closed" }),
  startup: () => ({ status: "closed" }),
  "self-employed": () => ({ status: "closed" }),
  "pnp-entrepreneur": (c) => {
    if (c.profile.objective !== "Affaires" && !c.profile.businessPath) return { status: "blocked", gaps: ["Pas de projet d’affaires déclaré."] };
    return c.profile.budget >= 150000
      ? { status: "lever", why: ["Capacité financière compatible avec plusieurs provinces."], gaps: ["Plan d’affaires et visite exploratoire."] }
      : { status: "blocked", gaps: ["Valeur nette souvent ≥ 150 000 $ à 600 000 $ selon la province."] };
  },
  ict: (c) =>
    c.profile.homeTies.business || c.profile.businessPath === "ict"
      ? { status: "lever", gaps: ["Filiale ou société liée au Canada à établir."] }
      : { status: "blocked", gaps: ["Exige un employeur étranger avec une entité canadienne liée."] },
  visitor: (c) => ({
    status: c.profile.homeTies.employment || c.profile.homeTies.property ? "ready" : "lever",
    why: ["Utile pour explorer, réseauter ou passer des entrevues."],
    gaps: c.profile.homeTies.employment || c.profile.homeTies.property ? [] : ["Liens au pays à documenter (RIPR 179b)."],
    // Outil d’exploration, pas une voie d’immigration : ne doit pas passer devant la RP.
    bonus: c.profile.objective === "Visite" ? 10 : -35,
  }),
};

const STATUS_BASE: Record<OpportunityStatus, number> = { ready: 80, lever: 55, bridge: 40, blocked: 10, closed: 0 };
const FAMILY_WEIGHT: Record<string, number> = { permanent: 6, family: 6, temporary: 0, business: 2 };

function evaluate(program: OpportunityProgram, c: Ctx): OpportunityMatch {
  const result =
    program.state === "closed" || program.state === "paused"
      ? { status: "closed" as const, gaps: [program.stateNote ?? "Programme fermé."] }
      : EVALUATORS[program.id](c);
  const urgent = program.state === "window" && result.status === "ready";
  const score =
    result.status === "closed"
      ? 0
      : Math.min(100, STATUS_BASE[result.status] + (result.bonus ?? 0) + FAMILY_WEIGHT[program.family]! + (urgent ? 10 : 0));
  const watch = [...(result.watch ?? [])];
  const gaps = [...(result.gaps ?? [])];
  const estimatedCost = program.costCad + c.extraAdults * program.extraAdultCad + c.children * program.extraChildCad;
  const affordable = estimatedCost <= c.profile.budget;
  const needsEmployer = program.needsEmployer || ("needsEmployer" in result && result.needsEmployer === true);
  let penalty = 0;
  if (result.status !== "closed") {
    if (!affordable) {
      gaps.push(`Budget : ≈ ${money(estimatedCost)} à prévoir (budget déclaré ${money(c.profile.budget)}).`);
      penalty += 15;
    }
    if (needsEmployer && !c.hasOffer) {
      watch.push("Exige de trouver un employeur canadien — difficile depuis l’étranger.");
      penalty += 10;
    }
  }
  if (program.verifyStatus) watch.push("Statut 2026 issu en partie de sources secondaires — reconfirmer sur le site officiel.");
  return {
    program,
    status: result.status,
    score: Math.max(0, score - penalty),
    why: result.why ?? [],
    gaps,
    watch,
    urgent,
    estimatedCost,
    affordable,
    needsEmployer,
  };
}

const money = (n: number) => `${Math.round(n).toLocaleString("fr-CA")} $`;

function finalizeStrategy(
  draft: StrategyDraft,
  c: Ctx,
  byId: Map<OpportunityId, OpportunityMatch>,
): OpportunityStrategy & { urgent: boolean } {
  const seen = new Set<OpportunityId>();
  let costCad = 0;
  // Une seule demande de RP aboutit : on garde la plus chère des étapes permanentes.
  let permanentCost = 0;
  let needsEmployer = false;
  for (const step of draft.steps) {
    const match = byId.get(step.programId);
    needsEmployer ||= match?.needsEmployer ?? false;
    if (step.costCad != null) costCad += step.costCad;
    else if (!seen.has(step.programId)) {
      const cost = match?.estimatedCost ?? 0;
      if (match?.program.family === "permanent") permanentCost = Math.max(permanentCost, cost);
      else costCad += cost;
    }
    seen.add(step.programId);
  }
  costCad += permanentCost;
  const fundsToShowCad = draft.fundsToShowCad ?? 0;
  const barriers: string[] = [];
  if (needsEmployer && !c.hasOffer) barriers.push("Exige de trouver un employeur canadien depuis l’étranger.");
  if (costCad > c.profile.budget) barriers.push(`Frais ≈ ${money(costCad)} > budget déclaré ${money(c.profile.budget)}.`);
  if (fundsToShowCad > c.profile.budget) barriers.push(`Fonds d’établissement ≈ ${money(fundsToShowCad)} à prouver.`);
  return {
    ...draft,
    mode: draft.mode ?? "sequence",
    costCad,
    fundsToShowCad,
    needsEmployer,
    barriers,
    best: barriers.length === 0,
    urgent: draft.urgent ?? false,
  };
}

function arrimaEstimate(c: Ctx): ArrimaEstimate {
  const withSpouse = c.spouse != null;
  const age = arrimaAgePoints(c.member.age, withSpouse);
  const education = arrimaEducationPoints(c.member.education, withSpouse);
  const experience = arrimaExperiencePoints(c.member.experience, withSpouse);
  const volet = c.regulated ? 3 : c.teer == null ? null : c.teer <= 2 ? 1 : 2;
  const rounds = volet ? arrimaRounds2026.filter((r) => r.volet === volet) : [];
  const full = arrimaScore({ principal: c.member, partner: c.partner, profile: c.profile });
  return {
    age,
    education,
    experience,
    subtotal: age + education + experience,
    withSpouse,
    volet,
    recentRounds: rounds.length,
    roundsOpenAbroad: rounds.filter((r) => !r.requiresQuebecPresence).length,
    min: full.min,
    max: full.max,
    threshold: volet ? latestArrimaThreshold(volet, { abroad: !c.inQuebec }) : null,
  };
}

const isOpen = (byId: Map<OpportunityId, OpportunityMatch>, id: OpportunityId) => {
  const s = byId.get(id)?.status;
  return s === "ready" || s === "lever";
};

function buildStrategies(c: Ctx, byId: Map<OpportunityId, OpportunityMatch>): OpportunityStrategy[] {
  const out: StrategyDraft[] = [];
  const add = (s: StrategyDraft) => out.push(s);
  const eeFunds = c.hasOffer || c.canExp >= 1 ? 0 : settlementFundsFor(irccFamilySize(c.profile));

  if (byId.get("peq")?.status === "ready") {
    add({
      id: "peq-now",
      title: "Urgent : déposer au PEQ avant le 31 octobre 2026",
      steps: [{ label: "Demande PEQ → CSQ", programId: "peq" }],
      rationale: "Fenêtre temporaire : la voie la plus rapide pour qui est déjà au Québec.",
      urgent: true,
    });
  }
  if (byId.get("family-spouse")?.status === "ready" || byId.get("family-spouse")?.status === "lever") {
    add({
      id: "sponsor",
      title: "Parrainage familial",
      steps: [{ label: "Parrainage du conjoint", programId: "family-spouse" }],
      rationale: "Pas de grille de points : la relation authentique et le répondant sont déterminants.",
    });
  }
  if (isOpen(byId, "ee-french")) {
    add({
      id: "ee-french",
      title: "Français NCLC 7 → tirages francophones Entrée express",
      steps: [
        { label: "Test TEF/TCF Canada visant NCLC 7", programId: "ee-french" },
        { label: "Profil Entrée express", programId: "ee-french" },
      ],
      rationale: "Seuils CRS 2026 bien plus bas que les tirages généraux ; sans offre d’emploi.",
      fundsToShowCad: eeFunds,
    });
  }
  if (isOpen(byId, "mobilite-francophone")) {
    add({
      id: "francophone-bridge",
      title: "Mobilité francophone → 12 mois au Canada → RP",
      steps: [
        { label: "Offre hors Québec, permis C16 sans EIMT", programId: "mobilite-francophone" },
        { label: "12 mois de travail qualifié", programId: "ee-cec" },
        { label: "Catégorie francophone ou pilote francophone", programId: c.fr >= 7 ? "ee-french" : "fcip" },
      ],
      rationale: "Le permis le plus accessible pour un francophone, toutes catégories FEER.",
    });
  }
  if (isOpen(byId, "pstq-v1") || isOpen(byId, "pstq-v3")) {
    const id = byId.get("pstq-v1")?.status === "ready" || !isOpen(byId, "pstq-v3") ? "pstq-v1" : "pstq-v3";
    add({
      id: "arrima-direct",
      title: "Arrima depuis l’étranger",
      steps: [
        { label: "Test de français + déclaration Arrima (gratuite)", programId: id },
        { label: "Invitation → CSQ → RP fédérale", programId: id },
      ],
      rationale: c.inQuebec
        ? "Déjà au Québec : accès aussi aux rondes réservées aux résidents."
        : "Sans employeur ni fonds d’établissement : déclaration gratuite, frais payés seulement après invitation. Garder une voie parallèle, car plusieurs rondes 2026 visaient les résidents du Québec.",
    });
  }
  if (c.wantsQuebec && !c.inQuebec && (isOpen(byId, "study") || isOpen(byId, "lmia-work"))) {
    add({
      id: "quebec-presence",
      title: "Créer une présence au Québec → rondes PSTQ réservées",
      steps: [
        { label: "Études (CAQ) ou travail (EIMT + CAQ) au Québec", programId: isOpen(byId, "lmia-work") && c.hasOffer ? "lmia-work" : "study" },
        { label: "PTPD ou expérience québécoise", programId: "pgwp" },
        { label: "Rondes PSTQ ciblant les résidents du Québec", programId: c.teer != null && c.teer >= 3 ? "pstq-v2" : "pstq-v1" },
      ],
      rationale: "Plusieurs rondes 2026 exigeaient une présence ou un diplôme québécois.",
    });
  }
  if (isOpen(byId, "iec")) {
    add({
      id: "iec-bridge",
      title: "PVT / Jeunes pros → expérience canadienne → RP",
      steps: [
        { label: "Permis EIC ouvert", programId: "iec" },
        { label: "12 mois de travail qualifié", programId: "ee-cec" },
      ],
      rationale: "Permis ouvert sans offre préalable.",
    });
  }
  if (isOpen(byId, "aip") || isOpen(byId, "rcip") || isOpen(byId, "fcip")) {
    const ids = (["fcip", "rcip", "aip"] as OpportunityId[]).filter((id) => isOpen(byId, id));
    add({
      id: "community",
      title: "Employeur désigné en région → RP directe",
      mode: "options",
      steps: ids.map((id) => ({ label: opportunityById(id).name, programId: id })),
      rationale: "Une seule de ces voies suffit. Ouvertes à presque toutes les catégories FEER, y compris les métiers 3-5 que les grands programmes ignorent.",
    });
  }
  add({
    id: "low-cost-start",
    title: "Premier pas à petit budget",
    steps: [
      { label: "Test de langue officiel (≈ 400 $)", programId: c.fr >= c.en ? "ee-french" : "ee-fsw", costCad: 400 },
      {
        label: c.wantsQuebec ? "Déclaration Arrima gratuite" : "Profil Entrée express gratuit",
        programId: c.wantsQuebec ? "pstq-v1" : "ee-fsw",
        costCad: 0,
      },
    ],
    rationale:
      "Chaque niveau de langue gagné ouvre plus de programmes (NCLC 5 → mobilité francophone et pilotes ; NCLC 7 → PSTQ volet 1 et catégorie francophone). Les profils sont gratuits.",
  });
  return out
    .map((draft) => finalizeStrategy(draft, c, byId))
    .sort((a, b) => Number(b.urgent) - Number(a.urgent) || a.barriers.length - b.barriers.length || a.costCad - b.costCad)
    .map(({ urgent: _urgent, ...strategy }) => strategy);
}

export function runOpportunities(profile: Profile, today = new Date().toISOString().slice(0, 10)): OpportunityReport {
  const c = buildCtx(profile, today);
  const matches = opportunityPrograms.map((p) => evaluate(p, c)).sort((a, b) => b.score - a.score);
  const byId = new Map(matches.map((m) => [m.program.id, m]));
  const counts = { ready: 0, lever: 0, bridge: 0, blocked: 0, closed: 0 } satisfies Record<OpportunityStatus, number>;
  for (const m of matches) counts[m.status] += 1;
  return { matches, strategies: buildStrategies(c, byId), arrima: arrimaEstimate(c), counts };
}
