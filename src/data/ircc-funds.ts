import { familyHasChildren, familyHasSpouse, type Profile } from "@/data/profile";
import { provinceCode } from "@/data/provinces";
import { studyFundsCaq, subsistenceFunds } from "@/data/study-funds";
import type { StudyLevel } from "@/data/study-programs";
import { tuitionFor } from "@/data/study-tuition";
import { familyCost } from "@/lib/family-cost";
import { money } from "@/lib/format";
import { studyProgramFor } from "@/lib/study-program";
import { visitCost } from "@/lib/visit-cost";
import { workCost } from "@/lib/work-cost";

export type IrccFundsTrack = {
  label: string;
  value: string;
};

export type IrccFunds = {
  routeId: string;
  headline: string;
  amount: number | null;
  required: boolean;
  official: boolean;
  familySize: number;
  scope: string;
  note: string;
  updatedLabel: string;
  sourceUrl: string;
  tracks?: IrccFundsTrack[];
};

export const irccFundsMeta = {
  updatedLabel: "septembre 2026",
  sourceLabel: "IRCC",
  sourceUrl:
    "https://www.canada.ca/fr/immigration-refugies-citoyennete/services/immigrer-canada/entree-express/documents/preuve-fonds-suffisants.html",
};

export const settlementFundsGrid = [15263, 19001, 23360, 28362, 32168, 36280, 40392];
export const settlementFundsExtra = 4112;

export const studyLivingIrccGrid = [23448, 29192, 35888, 43572, 49419, 55736, 62054];
export const studyLivingIrccExtra = 6318;

const settlementSourceUrl = irccFundsMeta.sourceUrl;
const studySourceUrl =
  "https://www.canada.ca/fr/immigration-refugies-citoyennete/services/etudier-canada/permis-etudes/obtenir-documents/soutien-financier.html";

export function fundsFromGrid(grid: number[], extra: number, familySize: number) {
  const size = Math.max(1, Math.floor(familySize));
  if (size <= grid.length) return grid[size - 1]!;
  return grid[grid.length - 1]! + (size - grid.length) * extra;
}

export function irccFamilySize(profile: Profile) {
  const spouse = familyHasSpouse(profile.family) ? 1 : 0;
  const kids = familyHasChildren(profile.family) ? profile.children.length : 0;
  return 1 + spouse + kids;
}

export function settlementFundsFor(familySize: number) {
  return fundsFromGrid(settlementFundsGrid, settlementFundsExtra, familySize);
}

export function studyLivingIrccFor(familySize: number) {
  return fundsFromGrid(studyLivingIrccGrid, studyLivingIrccExtra, familySize);
}

export function studySubsistenceFor(profile: Profile) {
  const hasSpouse = familyHasSpouse(profile.family);
  const children = familyHasChildren(profile.family) ? profile.children.length : 0;
  if (provinceCode(profile.province) === "QC") {
    return subsistenceFunds(studyFundsCaq, hasSpouse, children);
  }
  return studyLivingIrccFor(irccFamilySize(profile));
}

function studyTuitionAmount(profile: Profile) {
  const code = provinceCode(profile.province);
  const program = studyProgramFor(profile);
  return program ? tuitionFor(program.level as StudyLevel, code) : tuitionFor("bachelor", code);
}

function foyerLabel(size: number) {
  return `Foyer de ${size} personne${size > 1 ? "s" : ""}`;
}

const fallbackFunds: IrccFunds = {
  routeId: "unknown",
  headline: "Variable",
  amount: null,
  required: false,
  official: false,
  familySize: 1,
  scope: "Selon le volet",
  note: "Vérifiez le montant officiel IRCC avant de promettre un chiffre.",
  updatedLabel: irccFundsMeta.updatedLabel,
  sourceUrl: irccFundsMeta.sourceUrl,
};

function settlementEntry(
  routeId: string,
  profile: Profile,
  extras: Pick<IrccFunds, "note" | "tracks"> & { scopePrefix?: string },
): IrccFunds {
  const familySize = irccFamilySize(profile);
  const amount = settlementFundsFor(familySize);
  return {
    routeId,
    headline: money(amount),
    amount,
    required: true,
    official: true,
    familySize,
    scope: extras.scopePrefix ? `${extras.scopePrefix} · ${foyerLabel(familySize)}` : foyerLabel(familySize),
    note: extras.note,
    updatedLabel: "juillet 2025",
    sourceUrl: settlementSourceUrl,
    tracks: extras.tracks,
  };
}

export function irccFundsFor(routeId: string, profile: Profile): IrccFunds {
  const familySize = irccFamilySize(profile);

  if (routeId === "ee") {
    const amount = settlementFundsFor(familySize);
    return settlementEntry("ee", profile, {
      scopePrefix: "Fonds d’établissement",
      note: "Le CEC et une offre d’emploi valide n’exigent pas cette preuve. Vérifiez sur IRCC.",
      tracks: [
        { label: "CEC ou offre valide", value: "Non exigé" },
        { label: "Travailleurs qualifiés", value: money(amount) },
      ],
    });
  }

  if (routeId === "pnp") {
    const amount = settlementFundsFor(familySize);
    return settlementEntry("pnp", profile, {
      scopePrefix: "Fonds d’établissement",
      note: "Via Entrée express, la grille fédérale s’applique. Hors Entrée express, la province peut demander autre chose.",
      tracks: [
        { label: "Via Entrée express", value: money(amount) },
        { label: "Hors Entrée express", value: "Selon la province" },
      ],
    });
  }

  if (routeId === "business") {
    const amount = settlementFundsFor(familySize);
    return settlementEntry("business", profile, {
      scopePrefix: "Fonds d’établissement",
      note: "L’investissement du volet s’ajoute. Le visa start-up utilise cette grille.",
      tracks: [
        { label: "Établissement", value: money(amount) },
        { label: "Investissement", value: "Selon le volet" },
      ],
    });
  }

  if (routeId === "study") {
    const subsistence = studySubsistenceFor(profile);
    const tuition = studyTuitionAmount(profile);
    const amount = tuition + subsistence;
    const quebec = provinceCode(profile.province) === "QC";
    return {
      routeId: "study",
      headline: money(amount),
      amount,
      required: true,
      official: true,
      familySize,
      scope: `${quebec ? "CAQ" : "IRCC"} + scolarité · ${foyerLabel(familySize).toLowerCase()}`,
      note: "La scolarité s’ajoute aux fonds de subsistance. Le transport n’est pas inclus.",
      updatedLabel: quebec ? "CAQ" : "septembre 2026",
      sourceUrl: studySourceUrl,
      tracks: [
        { label: `Subsistance ${quebec ? "CAQ" : "IRCC"}`, value: money(subsistence) },
        { label: "Scolarité année 1", value: money(tuition) },
      ],
    };
  }

  if (routeId === "family") {
    const cost = familyCost(profile);
    return {
      routeId: "family",
      headline: money(cost.incomeRequired),
      amount: cost.incomeRequired,
      required: true,
      official: true,
      familySize: cost.familySize,
      scope: `Revenu minimum du répondant · ${foyerLabel(cost.familySize).toLowerCase()}`,
      note: "Ce n’est pas une preuve de fonds du demandeur. Le seuil suit le MNI ou l’engagement du Québec.",
      updatedLabel: irccFundsMeta.updatedLabel,
      sourceUrl: irccFundsMeta.sourceUrl,
      tracks: [{ label: "Taille retenue", value: String(cost.familySize) }],
    };
  }

  if (routeId === "work") {
    const amount = workCost(profile).settlementFunds;
    return {
      routeId: "work",
      headline: "Selon le dossier",
      amount,
      required: true,
      official: false,
      familySize,
      scope: `IRCC n’a pas de grille unique · ${foyerLabel(familySize).toLowerCase()}`,
      note: "Un aperçu de 3 mois de panier aide à cadrer le dossier, ce n’est pas un seuil IRCC.",
      updatedLabel: irccFundsMeta.updatedLabel,
      sourceUrl: irccFundsMeta.sourceUrl,
      tracks: [{ label: "Aperçu 3 mois", value: money(amount) }],
    };
  }

  if (routeId === "visit") {
    const amount = visitCost(profile).fundsRequired;
    return {
      routeId: "visit",
      headline: "Selon le dossier",
      amount,
      required: true,
      official: false,
      familySize,
      scope: `IRCC n’a pas de grille unique · ${foyerLabel(familySize).toLowerCase()}`,
      note: "Le montant dépend de la durée et des attaches. L’aperçu n’est pas un seuil publié.",
      updatedLabel: irccFundsMeta.updatedLabel,
      sourceUrl: irccFundsMeta.sourceUrl,
      tracks: [{ label: "Aperçu séjour", value: money(amount) }],
    };
  }

  if (routeId === "asylum") {
    return {
      routeId: "asylum",
      headline: "Non exigé",
      amount: null,
      required: false,
      official: true,
      familySize,
      scope: foyerLabel(familySize),
      note: "L’asile protège. Ce n’est pas une voie économique, ni une preuve de fonds IRCC.",
      updatedLabel: irccFundsMeta.updatedLabel,
      sourceUrl: irccFundsMeta.sourceUrl,
    };
  }

  return { ...fallbackFunds, routeId, familySize };
}

export function irccFundsChip(funds: IrccFunds) {
  return funds.amount != null && funds.headline === "Selon le dossier" ? money(funds.amount) : funds.headline;
}
