import {
  cecEligibleTeer,
  feerLegend,
  irccSources,
  sowpMinMonthsLeft,
  sowpSelectedTeer23,
} from "@/data/ircc-work-rules";
import { nocByCode, teerOf, type Teer } from "@/data/noc-2021";
import { familyHasSpouse, type Profile } from "@/data/profile";
import { workFeesFor, type WorkFees } from "@/data/work-fees";
import { workPermits, type OpenVsClosed, type WorkPermitId } from "@/data/work-permits";

export type WorkPermitOutcome = {
  kind: WorkPermitId;
  openVsClosed: OpenVsClosed;
  possible: boolean;
  reason: string;
};

export type WorkRenewal = {
  applyBeforeExpiry: true;
  impliedStatus: true;
  closedKeepsSameEmployer: boolean;
  openCanChangeEmployer: boolean;
  fees: WorkFees;
};

export type WorkPrAfter = {
  cecEligible: boolean;
  months: 12 | null;
  label: string;
};

export type WorkSpouseOpen = {
  eligible: boolean;
  reason: string;
};

export type WorkPathways = {
  noc: string;
  teer: Teer | null;
  title: string | null;
  permits: WorkPermitOutcome[];
  renewal: WorkRenewal;
  prAfter: WorkPrAfter;
  spouseOpen: WorkSpouseOpen | undefined;
  feerLegend: string | null;
  sources: typeof irccSources;
};

function familySize(profile: Profile) {
  return 1 + (familyHasSpouse(profile.family) ? 1 : 0) + profile.children.length;
}

function permitPossible(kind: WorkPermitId, profile: Profile) {
  if (kind === "open") return profile.workPermitKind === "open";
  if (kind === "iec") return profile.workPermitKind === "iec";
  return profile.workHasOffer;
}

function permitReason(kind: WorkPermitId, profile: Profile) {
  if (kind === "open") {
    return profile.workPermitKind === "open"
      ? "Possible seulement si le volet prévoit un permis ouvert."
      : "Un FEER élevé ne crée pas un permis ouvert à lui seul.";
  }
  if (kind === "iec") {
    return profile.workPermitKind === "iec"
      ? "IEC varie selon le volet: ouvert ou propre à l’employeur."
      : "IEC dépend du volet choisi (Vacances-travail, Jeunes professionnels ou Stage coop).";
  }
  if (kind === "ict") {
    return profile.workHasOffer
      ? "Permis fermé de mutation intraentreprise avec offre admissible."
      : "ICT reste un permis fermé lié à un employeur et demande une offre.";
  }
  if (kind === "imp") {
    return profile.workHasOffer
      ? "Permis fermé possible avec offre et exemption IMP."
      : "Le permis fermé IMP demande une offre liée à l’employeur.";
  }
  return profile.workHasOffer
    ? "Permis fermé possible avec offre et EIMT."
    : "Le permis fermé avec EIMT demande une offre liée à l’employeur.";
}

function spouseOpenFor(profile: Profile, nocCode: string, teer: Teer | null): WorkSpouseOpen | undefined {
  if (!familyHasSpouse(profile.family)) return undefined;
  if (teer === 0 || teer === 1) {
    return {
      eligible: true,
      reason: `Permis ouvert du conjoint possible: FEER ${teer} admissible selon IRCC si le permis du demandeur principal reste valide au moins ${sowpMinMonthsLeft} mois.`,
    };
  }
  if (sowpSelectedTeer23.has(nocCode)) {
    return {
      eligible: true,
      reason: `Permis ouvert du conjoint possible: la CNP ${nocCode} fait partie des professions FEER 2 ou 3 sélectionnées par l’IRCC, sous réserve du permis valide au moins ${sowpMinMonthsLeft} mois.`,
    };
  }
  if (teer === 4 || teer === 5) {
    return {
      eligible: false,
      reason:
        "Pas de permis ouvert du conjoint automatique en FEER 5; voir plutôt une voie RP économique admissible si elle existe.",
    };
  }
  return {
    eligible: false,
    reason:
      profile.workPermitKind === "open"
        ? "Le permis ouvert du demandeur principal seul ne suffit pas; il faut FEER 0 ou 1, ou une profession FEER 2 ou 3 sélectionnée par l’IRCC."
        : "Le conjoint n’est pas automatiquement admissible: il faut FEER 0 ou 1, ou une profession FEER 2 ou 3 sélectionnée par l’IRCC.",
  };
}

function prAfterFor(teer: Teer | null): WorkPrAfter {
  if (teer !== null && cecEligibleTeer.includes(teer as (typeof cecEligibleTeer)[number])) {
    return {
      cecEligible: true,
      months: 12,
      label: `Après 12 mois d’expérience autorisée en FEER ${teer} -> CEC possible (bassin Entrée express, pas une invitation).`,
    };
  }
  return {
    cecEligible: false,
    months: null,
    label: `CEC ne s’applique pas au FEER ${teer ?? "?"}. Voir PCP / PNP ou programmes pilotes selon la province.`,
  };
}

export function workPathways(profile: Profile): WorkPathways {
  const noc = String(profile.workNocCode ?? "").trim();
  const unit = nocByCode(noc);
  const teer = teerOf(noc);
  const selectedOpenState =
    profile.workPermitKind === "open" || profile.workPermitKind === "iec" ? "open" : "closed";
  return {
    noc,
    teer,
    title: unit?.title ?? null,
    permits: workPermits.map((permit) => ({
      kind: permit.id,
      openVsClosed: permit.openVsClosed,
      possible: permitPossible(permit.id, profile),
      reason: permitReason(permit.id, profile),
    })),
    renewal: {
      applyBeforeExpiry: true,
      impliedStatus: true,
      closedKeepsSameEmployer: selectedOpenState === "closed",
      openCanChangeEmployer: selectedOpenState === "open",
      fees: workFeesFor(profile.workPermitKind, familySize(profile)),
    },
    prAfter: prAfterFor(teer),
    spouseOpen: spouseOpenFor(profile, noc, teer),
    feerLegend: teer === null ? null : feerLegend[teer],
    sources: irccSources,
  };
}
