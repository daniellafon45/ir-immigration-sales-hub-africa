# Review package: Task 6 Menu lenses

No project git — package is the current snapshot of files this task created or edited. Treat each block as the full file on disk.

## Commits

none (in-place, no git)

## Files changed

- src/lib/closing-pills.ts (added)
- src/data/canada-live.ts (edited)
- src/data/canada-live.test.ts (edited)
- src/lib/failure-press.ts (edited)
- src/lib/failure-press.test.ts (edited)
- src/lib/household-salaries.ts (edited)
- src/lib/household-salaries.test.ts (edited)
- src/features/market.tsx (edited)
- src/features/market.test.ts (edited)
- src/features/sales.tsx (edited)
- src/features/sales.test.ts (edited)
- src/features/immigration.tsx (edited, pills helper only expected)

Pitch files were not in this list.

## Tests claimed

npx vitest run src/data/canada-live.test.ts src/lib/failure-press.test.ts src/lib/household-salaries.test.ts src/features/market.test.ts src/features/sales.test.ts
81/81 passing. Do not re-run to confirm.

## Diff


### src\lib\closing-pills.ts (24 lines)
```ts
import { businessPathById } from "@/data/business-paths";
import { familyLinkById } from "@/data/family-links";
import { teerOf } from "@/data/noc-2021";
import type { Profile } from "@/data/profile";
import { visitPurposeById } from "@/data/visit-purposes";

export function closingDeckPills(profile: Profile): string[] {
  if (profile.objective === "Travail") {
    const teer = teerOf(profile.workNocCode);
    return teer === null ? [] : [`CNP Â· FEER ${teer}`];
  }
  if (profile.objective === "Visite") {
    const purpose = visitPurposeById(profile.visitPurpose);
    return purpose ? [purpose.name] : [];
  }
  if (profile.objective === "Affaires") {
    const path = businessPathById(profile.businessPath);
    return path ? [path.name] : [];
  }
  if (profile.objective === "Regroupement familial") {
    const link = familyLinkById(profile.familyLink);
    return link ? [link.name] : [];
  }
  return [];
}

```

### src\lib\failure-press.ts (16 lines)
```ts
import { familyHasChildren, familyHasSpouse, type Profile } from "@/data/profile";

export function highlightedFailureIds(profile: Profile): string[] {
  const ids: string[] = ["housing", "job-myth"];
  if (
    familyHasSpouse(profile.family) ||
    familyHasChildren(profile.family) ||
    profile.objective === "Affaires" ||
    profile.objective === "Regroupement familial"
  ) {
    ids.push("money");
  }
  if (profile.objective === "Travail") ids.push("employability");
  else if (profile.objective === "Ã‰tudes") ids.push("program");
  else if (profile.objective === "Visite") ids.push("counsel");
  return [...new Set(ids)].slice(0, 3);
}

```

### src\lib\failure-press.test.ts (86 lines)
```ts
import { describe, expect, it } from "vitest";
import { defaultProfile, emptyAdult } from "@/data/profile";
import { failurePress, failureRisks } from "@/data/failures";
import { highlightedFailureIds } from "@/lib/failure-press";

describe("failureRisks", () => {
  it("lists eight prospect-facing risks", () => {
    expect(failureRisks.map((risk) => risk.id)).toEqual([
      "program",
      "rush",
      "money",
      "employability",
      "housing",
      "job-myth",
      "counsel",
      "urgent",
    ]);
    expect(failureRisks.find((risk) => risk.id === "housing")?.label).toBe("Arriver sans logement prÃ©parÃ©");
    expect(failureRisks.find((risk) => risk.id === "job-myth")?.cost).toBe("Personne nâ€™embauche sur un souhait.");
    expect(failureRisks.every((risk) => Boolean(risk.image))).toBe(true);
  });
});

describe("failurePress", () => {
  it("lists six sourced articles across housing, jobs and distress", () => {
    expect(failurePress).toHaveLength(6);
    expect(failurePress.filter((article) => article.theme === "housing")).toHaveLength(2);
    expect(failurePress.filter((article) => article.theme === "jobs")).toHaveLength(2);
    expect(failurePress.filter((article) => article.theme === "distress")).toHaveLength(2);
    expect(failurePress.every((article) => article.url.startsWith("https://"))).toBe(true);
    expect(failurePress.every((article) => Boolean(article.image))).toBe(true);
  });
});

describe("highlightedFailureIds", () => {
  it("picks up to three household risks", () => {
    expect(highlightedFailureIds(defaultProfile)).toEqual(["housing", "job-myth", "money"]);
    expect(
      highlightedFailureIds({
        ...defaultProfile,
        family: "Seul(e)",
        spouse: emptyAdult,
        objective: "Travail",
      }),
    ).toEqual(["housing", "job-myth", "employability"]);
    expect(
      highlightedFailureIds({
        ...defaultProfile,
        family: "Seul(e)",
        spouse: emptyAdult,
        objective: "Ã‰tudes",
      }),
    ).toEqual(["housing", "job-myth", "program"]);
    expect(
      highlightedFailureIds({
        ...defaultProfile,
        family: "Seul(e)",
        spouse: emptyAdult,
        objective: "Visite",
      }),
    ).toEqual(["housing", "job-myth", "counsel"]);
    expect(
      highlightedFailureIds({
        ...defaultProfile,
        family: "Couple + enfant(s)",
        children: [{ id: "c1", firstName: "LÃ©a", age: 6 }],
        objective: "Travail",
      }),
    ).toEqual(["housing", "job-myth", "money"]);
  });

  it("keeps money highlighted for solo business and family sponsorship files", () => {
    expect(
      highlightedFailureIds({
        ...defaultProfile,
        family: "Seul(e)",
        spouse: emptyAdult,
        objective: "Affaires",
      }),
    ).toEqual(["housing", "job-myth", "money"]);

    expect(
      highlightedFailureIds({
        ...defaultProfile,
        family: "Seul(e)",
        spouse: emptyAdult,
        objective: "Regroupement familial",
      }),
    ).toEqual(["housing", "job-myth", "money"]);
  });
});

```

### src\lib\household-salaries.ts (166 lines)
```ts
import { businessPathById } from "@/data/business-paths";
import { provinceCode } from "@/data/provinces";
import type { Profile } from "@/data/profile";
import type { SalaryBand } from "@/data/salaries";
import { internshipBandsFor, netEstimate, salaryBandsFor } from "@/lib/finance";
import { householdMarket, type HouseholdMarketAdult } from "@/lib/household-market";
import { workPathways } from "@/lib/work-pathways";

export type SalaryTrack = "market" | "student" | "accompanying";
export type SalaryPhaseId = "market" | "postStudy" | "internship" | "openWork";

export type HouseholdSalaryPhase = {
  id: SalaryPhaseId;
  label: string;
  hint?: string;
  bands: Record<string, SalaryBand>;
  low: number;
  mid: number;
  high: number;
  netAnnual: number;
  netMonthly: number;
};

export type HouseholdSalaryGroup = {
  adult: HouseholdMarketAdult;
  heading: string;
  track: SalaryTrack;
  bands: Record<string, SalaryBand>;
  netAnnual: number;
  netMonthly: number;
  phases: HouseholdSalaryPhase[];
};

export type HouseholdSalaries = {
  groups: HouseholdSalaryGroup[];
  province: string;
  study: boolean;
};

function phaseFrom(
  id: SalaryPhaseId,
  label: string,
  bands: Record<string, SalaryBand>,
  low: number,
  mid: number,
  high: number,
  code: string,
  hint?: string,
): HouseholdSalaryPhase {
  const netAnnual = netEstimate(mid, code);
  return {
    id,
    label,
    hint,
    bands,
    low,
    mid,
    high,
    netAnnual,
    netMonthly: Math.round(netAnnual / 12),
  };
}

function marketGroup(adult: HouseholdMarketAdult, code: string, heading = `${adult.label} Â· ${adult.member.profession}`): HouseholdSalaryGroup {
  const bands = salaryBandsFor(adult.member.profession);
  const netAnnual = netEstimate(adult.mid, code);
  return {
    adult,
    heading,
    track: "market",
    bands,
    netAnnual,
    netMonthly: Math.round(netAnnual / 12),
    phases: [phaseFrom("market", "", bands, adult.low, adult.mid, adult.high, code)],
  };
}

function openWorkGroup(
  adult: HouseholdMarketAdult,
  code: string,
  heading = `Conjoint parrainÃ© Â· ${adult.member.profession}`,
  hint = "Permis de travail ouvert selon lâ€™admissibilitÃ© du dossier principal.",
): HouseholdSalaryGroup {
  const bands = salaryBandsFor(adult.member.profession);
  const netAnnual = netEstimate(adult.mid, code);
  return {
    adult,
    heading,
    track: "accompanying",
    bands,
    netAnnual,
    netMonthly: Math.round(netAnnual / 12),
    phases: [phaseFrom("openWork", "PossibilitÃ©s dâ€™emploi", bands, adult.low, adult.mid, adult.high, code, hint)],
  };
}

export function householdSalaries(profile: Profile): HouseholdSalaries {
  const market = householdMarket(profile);
  const code = provinceCode(profile.province);
  const study = profile.objective === "Ã‰tudes";
  const work = profile.objective === "Travail" ? workPathways(profile) : undefined;
  const businessPath = profile.objective === "Affaires" ? businessPathById(profile.businessPath) : undefined;

  const groups = market.adults.map((adult) => {
    const heading = `${adult.label} Â· ${adult.member.profession}`;
    if (!study) {
      if (profile.objective === "Travail" && adult.role !== "applicant" && work?.spouseOpen?.eligible) {
        return openWorkGroup(
          adult,
          code,
          `Conjoint parrainÃ© Â· ${adult.member.profession}`,
          "Permis de travail ouvert possible si le dossier principal reste admissible.",
        );
      }

      if (profile.objective === "Affaires" && adult.role !== "applicant" && businessPath?.spouseOpenEligible) {
        return openWorkGroup(
          adult,
          code,
          `Conjoint parrainÃ© Â· ${adult.member.profession}`,
          "Permis de travail ouvert possible si le volet dâ€™affaires autorise le travail.",
        );
      }

      if (profile.objective === "Regroupement familial") {
        if (profile.familyLink === "parent" && adult.role !== "applicant") return null;
        if (profile.familyLink === "spouse" && adult.role !== "applicant") {
          return marketGroup(adult, code, `AprÃ¨s lâ€™arrivÃ©e Â· ${adult.member.profession}`);
        }
      }

      return marketGroup(adult, code, heading);
    }

    if (adult.role === "applicant") {
      const bands = salaryBandsFor(adult.member.profession);
      const netAnnual = netEstimate(adult.mid, code);
      const netMonthly = Math.round(netAnnual / 12);
      const internBands = internshipBandsFor(adult.member.profession);
      const intern = internBands[code] ?? internBands.QC;
      return {
        adult,
        heading,
        track: "student" as const,
        bands,
        netAnnual,
        netMonthly,
        phases: [
          phaseFrom(
            "postStudy",
            "AprÃ¨s les Ã©tudes",
            bands,
            adult.low,
            adult.mid,
            adult.high,
            code,
            "Permis de travail postdiplÃ´me. Le marchÃ© du mÃ©tier, une fois le diplÃ´me en poche.",
          ),
          phaseFrom(
            "internship",
            "Durant vos stages",
            internBands,
            intern[0],
            intern[1],
            intern[2],
            code,
            "RÃ©munÃ©ration de stage coop, Ã©quivalent annuel.",
          ),
        ],
      };
    }

    return openWorkGroup(adult, code, `Conjoint parrainÃ© Â· ${adult.member.profession}`, "Permis de travail ouvert pendant les Ã©tudes du candidat.");
  });
  return {
    groups: groups.filter((group): group is HouseholdSalaryGroup => Boolean(group)),
    province: market.province,
    study,
  };
}

```

### src\lib\household-salaries.test.ts (130 lines)
```ts
import { describe, expect, it } from "vitest";
import { defaultProfile, emptyAdult } from "@/data/profile";
import { salaryData } from "@/data/salaries";
import { householdSalaries } from "@/lib/household-salaries";

describe("householdSalaries", () => {
  it("splits the default couple into Comptable and DÃ©veloppeur logiciel groups", () => {
    const view = householdSalaries(defaultProfile);
    expect(view.groups).toHaveLength(2);
    expect(view.province).toBe("QuÃ©bec");
    expect(view.groups[0].adult.member.firstName).toBe("Loriane");
    expect(view.groups[0].adult.low).toBe(52000);
    expect(view.groups[0].adult.mid).toBe(72000);
    expect(view.groups[0].adult.high).toBe(98000);
    expect(view.groups[0].bands).toEqual(salaryData.Comptable);
    expect(view.groups[0].netAnnual).toBe(50400);
    expect(view.groups[0].netMonthly).toBe(4200);
    expect(view.groups[1].adult.member.firstName).toBe("Marc");
    expect(view.groups[1].adult.mid).toBe(90000);
    expect(view.groups[1].bands).toEqual(salaryData["DÃ©veloppeur logiciel"]);
    expect(view.groups[1].netAnnual).toBe(63000);
    expect(view.groups[1].netMonthly).toBe(5250);
  });

  it("keeps a single group when the family is Seul(e)", () => {
    const view = householdSalaries({ ...defaultProfile, family: "Seul(e)", spouse: emptyAdult });
    expect(view.groups).toHaveLength(1);
    expect(view.groups[0].adult.member.firstName).toBe("Loriane");
    expect(view.groups[0].netAnnual).toBe(50400);
  });

  it("falls back to Comptable bands when the profession is missing from salaryData", () => {
    const view = householdSalaries({
      ...defaultProfile,
      family: "Seul(e)",
      spouse: emptyAdult,
      applicant: { ...defaultProfile.applicant, profession: "Aide-soignant(e)" },
    });
    expect(view.groups[0].bands).toEqual(salaryData.Comptable);
    expect(view.groups[0].adult.mid).toBe(72000);
  });

  it("uses the province net rate for monthly estimates", () => {
    const view = householdSalaries({ ...defaultProfile, province: "Ontario" });
    expect(view.province).toBe("Ontario");
    expect(view.groups[0].adult.mid).toBe(78000);
    expect(view.groups[0].netAnnual).toBe(56940);
    expect(view.groups[0].netMonthly).toBe(4745);
  });

  it("splits a solo study file into post-diploma and internship phases", () => {
    const view = householdSalaries({
      ...defaultProfile,
      family: "Seul(e)",
      objective: "Ã‰tudes",
      spouse: emptyAdult,
    });
    expect(view.study).toBe(true);
    expect(view.groups).toHaveLength(1);
    expect(view.groups[0].track).toBe("student");
    expect(view.groups[0].phases.map((phase) => phase.id)).toEqual(["postStudy", "internship"]);
    expect(view.groups[0].phases[0]?.mid).toBe(72000);
    expect(view.groups[0].phases[1]?.mid).toBe(35000);
    expect(view.groups[0].phases[1]?.label).toBe("Durant vos stages");
  });

  it("adds open-work employment for an accompanying spouse on a study file", () => {
    const view = householdSalaries({ ...defaultProfile, objective: "Ã‰tudes" });
    expect(view.groups).toHaveLength(2);
    expect(view.groups[0].track).toBe("student");
    expect(view.groups[1].track).toBe("accompanying");
    expect(view.groups[1].heading).toBe("Conjoint parrainÃ© Â· DÃ©veloppeur logiciel");
    expect(view.groups[1].phases).toHaveLength(1);
    expect(view.groups[1].phases[0]?.id).toBe("openWork");
    expect(view.groups[1].phases[0]?.mid).toBe(90000);
  });

  it("keeps the accompanying spouse when the student is wired to a program profession", () => {
    const view = householdSalaries({
      ...defaultProfile,
      objective: "Ã‰tudes",
      studyLevel: "bachelor",
      studyProgramId: "bac-nursing",
    });
    expect(view.groups).toHaveLength(2);
    expect(view.groups[0].adult.member.profession).toBe("Infirmier(Ã¨re)");
    expect(view.groups[0].track).toBe("student");
    expect(view.groups[1].adult.member.profession).toBe("DÃ©veloppeur logiciel");
    expect(view.groups[1].track).toBe("accompanying");
  });

  it("keeps visit files on pure market phases with no open-work spouse track", () => {
    const view = householdSalaries({
      ...defaultProfile,
      objective: "Visite",
      visitPurpose: "tourism",
      visitDuration: "3m",
    });

    expect(view.groups).toHaveLength(2);
    expect(view.groups.map((group) => group.track)).toEqual(["market", "market"]);
    expect(view.groups.map((group) => group.phases.map((phase) => phase.id))).toEqual([["market"], ["market"]]);
  });

  it("adds an open-work spouse phase for eligible work files", () => {
    const view = householdSalaries({
      ...defaultProfile,
      objective: "Travail",
      workNocCode: "21232",
      workPermitKind: "closed-lmia",
    });

    expect(view.groups).toHaveLength(2);
    expect(view.groups[0].track).toBe("market");
    expect(view.groups[1].track).toBe("accompanying");
    expect(view.groups[1].phases.map((phase) => phase.id)).toEqual(["openWork"]);
  });

  it("keeps only the sponsor market group for parent sponsorship in solo files", () => {
    const view = householdSalaries({
      ...defaultProfile,
      family: "Seul(e)",
      spouse: emptyAdult,
      objective: "Regroupement familial",
      familyLink: "parent",
    });

    expect(view.groups).toHaveLength(1);
    expect(view.groups[0].track).toBe("market");
    expect(view.groups[0].phases.map((phase) => phase.id)).toEqual(["market"]);
  });

  it("uses two market groups after arrival for spouse sponsorship files", () => {
    const view = householdSalaries({
      ...defaultProfile,
      objective: "Regroupement familial",
      familyLink: "spouse",
    });

    expect(view.groups).toHaveLength(2);
    expect(view.groups.map((group) => group.track)).toEqual(["market", "market"]);
    expect(view.groups[1].heading).toBe("AprÃ¨s lâ€™arrivÃ©e Â· DÃ©veloppeur logiciel");
    expect(view.groups[1].phases.map((phase) => phase.id)).toEqual(["market"]);
  });
});

```

### src\data\canada-live.ts (808 lines)
```ts
import type { CardItem } from "@/components/ui/cards";
import { canadaLiveGallery, canadaLiveHero } from "@/data/canada-live-media";
import { startupVisaNote } from "@/data/business-paths";
import { familyLinkById } from "@/data/family-links";
import { teerOf } from "@/data/noc-2021";
import type { Profile } from "@/data/profile";
import { visitPurposeById } from "@/data/visit-purposes";
import { closingDeckPills } from "@/lib/closing-pills";
import { studyProgramFor } from "@/lib/study-program";

export type CanadaLiveStat = {
  label: string;
  value: string;
  note: string;
};

export type CanadaLiveArticle = {
  source: string;
  date: string;
  title: string;
  excerpt: string;
  url: string;
};

export type CanadaLiveTalk = {
  label: string;
  body: string;
};

export type CanadaLivePage = {
  id: string;
  kicker: string;
  title: string;
  lead: string;
  pills: string[];
  panelTitle: string;
  ask: string;
  heroPlace: string;
  heroImage: string;
  heroCaption: string;
  gallery: CardItem[];
  stats: CanadaLiveStat[];
  articles: CanadaLiveArticle[];
  talks: CanadaLiveTalk[];
  actions?: Array<{ id: string; label: string }>;
};

export const canadaLivePages: CanadaLivePage[] = [
  {
    id: "vue",
    heroPlace: canadaLiveHero("vue").place,
    heroImage: canadaLiveHero("vue").image,
    gallery: canadaLiveGallery("vue"),
    kicker: "Canada Live Â· Vue d'ensemble",
    title: "Le Canada accueille encore. La sÃ©lection, elle, se resserre.",
    lead: "Le pays reste ouvert. Le profil, la langue et la stratÃ©gie pÃ¨sent davantage qu'avant.",
    pills: ["IRCC 2026-2028", "Statistique Canada"],
    panelTitle: "Le Canada n'est pas fermÃ©",
    ask: "Dans 12 mois, voulez-vous encore chercher une stratÃ©gie, ou l'avoir dÃ©jÃ  lancÃ©e ?",
    heroCaption: "Le paysage fait rÃªver. Le plan des niveaux, lui, dÃ©cide qui entre.",
    stats: [
      {
        label: "Admissions RP prÃ©vues",
        value: "380 000",
        note: "par annÃ©e, 2026 Ã  2028",
      },
      {
        label: "Part Ã©conomique visÃ©e",
        value: "64 %",
        note: "en 2027 et 2028",
      },
      {
        label: "Francophones hors QuÃ©bec",
        value: "9 %",
        note: "cible 2026, 10,5 % en 2028",
      },
      {
        label: "Cible 2028",
        value: "35 175",
        note: "admissions francophones hors QuÃ©bec",
      },
    ],
    articles: [
      {
        source: "IRCC",
        date: "4 nov. 2025",
        title: "Plan des niveaux 2026-2028 : 380 000 rÃ©sidents permanents par an",
        excerpt: "Ottawa stabilise les admissions et monte la part Ã©conomique Ã  64 %, avec des cibles francophones plus hautes hors QuÃ©bec.",
        url: "https://www.canada.ca/fr/immigration-refugies-citoyennete/organisation/mandat/initiatives-ministerielles/niveaux/renseignements-supplementaires-niveaux-immigration-2026-2028.html",
      },
      {
        source: "IRCC",
        date: "janv. 2026",
        title: "Le Canada dÃ©passe son objectif d'immigration francophone en 2025",
        excerpt: "Plus de 29 500 admissions francophones hors QuÃ©bec, soit 8,9 %. Les cibles passent Ã  9 %, puis 10,5 % en 2028.",
        url: "https://www.canada.ca/fr/immigration-refugies-citoyennete/nouvelles/2026/01/le-canada-depasse-son-objectif-dimmigration-francophone-en-2025.html",
      },
      {
        source: "Directeur parlementaire du budget",
        date: "2026",
        title: "Implications dÃ©mographiques du Plan des niveaux 2026-2028",
        excerpt: "380 000 RP par an, soit environ 20 % de moins que le sommet de 484 000 admissions en 2024. La sÃ©lection devient plus ciblÃ©e.",
        url: "https://www.pbo-dpb.ca/fr/publications/RP-2526-025-S--demographic-implications-2026-2028-immigration-levels-plan--implications-demographiques-plan-niveaux-immigration-2026-2028",
      },
    ],
    talks: [
      {
        label: "Aujourd'hui",
        body: "Le Canada n'a pas fermÃ©. Il a recentrÃ©. 380 000 places, c'est encore un pays d'accueil. Ce n'est plus un pays oÃ¹ l'on improvise un dossier.",
      },
      {
        label: "Les prioritÃ©s",
        body: "Le plan IRCC vise 64 % d'admissions Ã©conomiques. Le mÃ©tier, la langue et un dossier cohÃ©rent pÃ¨sent plus que le seul dÃ©sir de partir.",
      },
      {
        label: "L'avantage franÃ§ais",
        body: "Si vous parlez franÃ§ais, c'est un vrai atout. Hors QuÃ©bec, la cible francophone monte Ã  10,5 % en 2028. C'est un avantage rÃ©el, pas un slogan.",
      },
    ],
  },
  {
    id: "demographie",
    heroPlace: canadaLiveHero("demographie").place,
    heroImage: canadaLiveHero("demographie").image,
    gallery: canadaLiveGallery("demographie"),
    kicker: "Canada Live Â· DÃ©mographie",
    title: "Le Canada vieillit. Les besoins, eux, ne diminuent pas.",
    lead: "Sans relÃ¨ve naturelle suffisante, le pays doit renouveler sa main-d'Å“uvre, ses soignants et ses contribuables. C'est le vrai contexte du projet.",
    pills: ["FÃ©conditÃ© 2024", "Vieillissement"],
    panelTitle: "Lecture utile",
    ask: "Si le Canada a dÃ©jÃ  besoin de renouveler sa population active, oÃ¹ {name} peut apporter le plus de valeur ?",
    heroCaption: "Un pays qui aime ses aÃ®nÃ©s doit aussi attirer ceux qui peuvent les soigner, les loger et les relayer.",
    stats: [
      {
        label: "FÃ©conditÃ© 2024",
        value: "1,25",
        note: "enfant par femme, creux historique",
      },
      {
        label: "Seuil de renouvellement",
        value: "2,1",
        note: "aucune province hors Nunavut ne l'atteint",
      },
      {
        label: "Ã‚ge moyen Ã  la maternitÃ©",
        value: "31,8 ans",
        note: "sommet, contre 26,7 ans en 1976",
      },
      {
        label: "Naissances, mÃ¨re nÃ©e Ã  l'Ã©tranger",
        value: "42,3 %",
        note: "prÃ¨s du double du niveau de 1997",
      },
    ],
    articles: [
      {
        source: "Statistique Canada",
        date: "24 sept. 2025",
        title: "FÃ©conditÃ© 2024 : 1,25 enfant par femme, un creux historique",
        excerpt: "Le Canada rejoint le groupe des pays Ã  fÃ©conditÃ© ultra-faible. La Colombie-Britannique tombe Ã  1,02. Le QuÃ©bec s'Ã©tablit Ã  1,34.",
        url: "https://www150.statcan.gc.ca/n1/daily-quotidien/250924/dq250924d-fra.htm",
      },
      {
        source: "Radio-Canada",
        date: "2025",
        title: "Les QuÃ©bÃ©cois achÃ¨tent maintenant plus de couches pour adultes que pour enfants",
        excerpt: "En 2024, le QuÃ©bec a enregistrÃ© plus de dÃ©cÃ¨s que de naissances. L'image est brutale, mais elle rend le vieillissement immÃ©diat.",
        url: "https://ici.radio-canada.ca/nouvelle/2280308/couches-adultes-enfants-natalite-quebec",
      },
      {
        source: "Statistique Canada",
        date: "2026",
        title: "Projets d'avenir : moins d'enfants, plus de pression sur la main-d'Å“uvre",
        excerpt: "Un ISF de 1,25 expose le pays Ã  des pressions sur la population active, les soins et les rÃ©gimes de retraite.",
        url: "https://www150.statcan.gc.ca/n1/pub/75-006-x/2026002/article/00003-fra.htm",
      },
    ],
    talks: [
      {
        label: "Constat",
        body: "1,25 enfant par femme, ce n'est pas une opinion. C'est Statistique Canada. Le Canada ne se renouvelle plus assez par les naissances.",
      },
      {
        label: "Image",
        body: "L'article de Radio-Canada sur les couches pour adultes n'est pas du sensationnalisme. Il rend visible un pays qui a plus besoin de soignants que de berceaux.",
      },
      {
        label: "Pont",
        body: "42 % des nouveau-nÃ©s ont dÃ©jÃ  une mÃ¨re nÃ©e Ã  l'Ã©tranger. L'immigration n'est pas un extra. C'est dÃ©jÃ  le moteur du renouvellement.",
      },
    ],
  },
  {
    id: "emploi",
    heroPlace: canadaLiveHero("emploi").place,
    heroImage: canadaLiveHero("emploi").image,
    gallery: canadaLiveGallery("emploi"),
    kicker: "Canada Live Â· Emploi",
    title: "Le marchÃ© s'est calmÃ©. Les postes Ã  pourvoir, eux, restent lÃ .",
    lead: "Le taux national ne raconte pas le mÃ©tier de {name}. Il faut relier chÃ´mage, postes vacants et province avant de parler de programme.",
    pills: ["T4 2025", "EPA 2026"],
    panelTitle: "Ce que Ã§a change",
    ask: "Parmi les mÃ©tiers du foyer, lequel se relie le plus clairement Ã  un besoin rÃ©el au Canada ?",
    heroCaption: "Les villes tournent encore. La question n'est pas s'il y a du travail. C'est oÃ¹, pour qui, et avec quel dossier.",
    stats: [
      {
        label: "Postes vacants",
        value: "495 100",
        note: "T4 2025, Statistique Canada",
      },
      {
        label: "ChÃ´mage",
        value: "6,7 %",
        note: "fÃ©vrier 2026, EnquÃªte sur la population active",
      },
      {
        label: "Salaire horaire offert",
        value: "29,25 $",
        note: "moyenne des postes vacants, T4 2025",
      },
      {
        label: "Postes vacants au QuÃ©bec",
        value: "118 700",
        note: "T4 2025, en hausse de 5 300",
      },
    ],
    articles: [
      {
        source: "Statistique Canada",
        date: "17 mars 2026",
        title: "Postes vacants, quatriÃ¨me trimestre de 2025 : 495 100 postes",
        excerpt: "Le volume se stabilise aprÃ¨s trois baisses. 28,5 % des postes restent ouverts 90 jours ou plus. Le QuÃ©bec remonte Ã  118 700.",
        url: "https://www150.statcan.gc.ca/n1/daily-quotidien/260317/dq260317a-fra.htm",
      },
      {
        source: "Institut C.D. Howe",
        date: "2026",
        title: "Bilan 2025 du marchÃ© du travail : moins tendu, encore inÃ©gal",
        excerpt: "Environ 498 700 postes vacants en moyenne en 2025. Le resserrement de 2022 est fini. Les Ã©carts de mÃ©tiers, eux, restent.",
        url: "https://cdhowe.org/publication/2025-labour-market-review-trade-uncertainty-structural-pressures-and-policy-priorities-for-canada",
      },
      {
        source: "Indeed Hiring Lab",
        date: "18 dÃ©c. 2025",
        title: "Tendances de l'emploi 2026 : le QuÃ©bec rÃ©siste mieux que l'Ontario",
        excerpt: "Le marchÃ© a ramolli partout, mais le QuÃ©bec garde le chÃ´mage le plus bas. La province visÃ©e n'est pas un dÃ©tail.",
        url: "https://hiringlab.indeed.com/en-ca/2025/12/18/indeed-2026-canadian-jobs-hiring-trends-report",
      },
    ],
    talks: [
      {
        label: "Nuance",
        body: "Le marchÃ© s'est dÃ©tendu depuis 2022. 495 100 postes restent pourtant ouverts, et certains mÃ©tiers peinent encore Ã  recruter.",
      },
      {
        label: "Province",
        body: "Le QuÃ©bec a 118 700 postes vacants. L'Ontario a un chÃ´mage plus Ã©levÃ©. La province que vous visez change autant le projet que votre mÃ©tier.",
      },
      {
        label: "Suite",
        body: "Le chiffre national n'embauche personne. Le mÃ©tier de {name}, lui, peut trouver une place.",
      },
    ],
  },
  {
    id: "pont",
    heroPlace: canadaLiveHero("pont").place,
    heroImage: canadaLiveHero("pont").image,
    gallery: canadaLiveGallery("pont"),
    kicker: "Canada Live Â· Votre projet",
    title: "Que signifient ces chiffres pour {name} ?",
    lead: "La bonne question n'est plus le Canada en gÃ©nÃ©ral. C'est oÃ¹ un(e) {profession} trouve le meilleur compromis entre salaire, emplois et coÃ»t de la vie.",
    pills: ["Profil", "{province}"],
    panelTitle: "Prochaine action",
    ask: "Si on relie {profession} Ã  une province rÃ©aliste aujourd'hui, quelle est la premiÃ¨re dÃ©cision utile ?",
    heroCaption: "Le rÃªve se visite. Le projet se construit autour d'un mÃ©tier, d'une province et d'un calendrier.",
    stats: [
      {
        label: "Places RP encore ouvertes",
        value: "380 000",
        note: "chaque annÃ©e jusqu'en 2028",
      },
      {
        label: "RelÃ¨ve naturelle",
        value: "insuffisante",
        note: "fÃ©conditÃ© Ã  1,25 en 2024",
      },
      {
        label: "Postes encore vacants",
        value: "495 100",
        note: "mÃªme aprÃ¨s le reflux du marchÃ©",
      },
      {
        label: "Avantage langue",
        value: "francophone",
        note: "cible 9 % hors QuÃ©bec dÃ¨s 2026",
      },
    ],
    articles: [
      {
        source: "Gowling WLG",
        date: "2025",
        title: "Le plan 2026-2028 recentre l'immigration sur les compÃ©tences",
        excerpt: "La part Ã©conomique monte. Les temporaires baissent. Un profil prÃ©parÃ© pÃ¨se plus qu'un profil qui attend.",
        url: "https://gowlingwlg.com/en/insights-resources/articles/2025/canada-2026-2028-immigration-levels-plan-from-budget-2025",
      },
      {
        source: "RBC Thought Leadership",
        date: "2026",
        title: "Une stratÃ©gie d'immigration plus sÃ©lective",
        excerpt: "Le plafond de 380 000 RP est un choix de qualitÃ©. Le dossier doit coller Ã  un besoin, pas seulement Ã  un dÃ©sir de partir.",
        url: "https://www.rbc.com/en/thought-leadership/skills-and-post-secondary/a-smarter-immigration-strategy",
      },
      {
        source: "IRCC",
        date: "2026",
        title: "Les cibles francophones hors QuÃ©bec continuent de monter",
        excerpt: "9 % en 2026, 10,5 % en 2028. Pour un foyer francophone, c'est un levier Ã  activer tout de suite, pas plus tard.",
        url: "https://www.canada.ca/fr/immigration-refugies-citoyennete/nouvelles/2026/01/le-canada-depasse-son-objectif-dimmigration-francophone-en-2025.html",
      },
    ],
    talks: [
      {
        label: "Recentrer",
        body: "Ces chiffres se ramÃ¨nent Ã  votre foyer. Le Canada vieillit, recrute encore, et sÃ©lectionne davantage. Vous n'avez pas besoin de tous les chiffres. Vous avez besoin d'une voie.",
      },
      {
        label: "Perte",
        body: "Attendre 12 mois ne gÃ¨le pas le profil. Les places restent limitÃ©es, et les candidats mieux prÃ©parÃ©s passent devant.",
      },
      {
        label: "Action",
        body: "La suite utile : voir les opportunitÃ©s de votre mÃ©tier, puis comparer les provinces. Une dÃ©cision, pas un catalogue.",
      },
    ],
    actions: [
      { id: "opportunites", label: "Voir les opportunitÃ©s" },
      { id: "provinces", label: "Comparer les provinces" },
    ],
  },
];

const studyOverlays: Record<string, Partial<CanadaLivePage>> = {
  vue: {
    kicker: "Canada Live Â· Ã‰tudes",
    title: "Le Canada forme encore. Le permis d'Ã©tudes, lui, se prÃ©pare.",
    lead: "Un programme, une preuve de fonds, une province. Le diplÃ´me n'est pas un ticket automatique vers la rÃ©sidence.",
    pills: ["Permis d'Ã©tudes", "Ã‰tudiants Ã©trangers"],
    panelTitle: "Le Canada Ã©tudie encore",
    ask: "Dans 12 mois, voulez-vous encore chercher un programme, ou dÃ©jÃ  Ãªtre admis ?",
    stats: [
      { label: "Permis d'Ã©tudes actifs", value: "1 M+", note: "ordre de grandeur, Ã©tudiants Ã©trangers" },
      { label: "Nouveaux permis / an", value: "~400 000", note: "volume rÃ©cent, avant resserrement" },
      { label: "PostdiplÃ´me (PGWP)", value: "jusqu'Ã  3 ans", note: "selon le programme admissible" },
      { label: "Frais internationaux", value: "14 Ã  42 k$", note: "cÃ©gep Ã  universitÃ©, par annÃ©e" },
    ],
    talks: [
      {
        label: "Aujourd'hui",
        body: "Le Canada accueille encore des Ã©tudiants. Il exige un vrai programme, des fonds et un projet cohÃ©rent. Ce n'est plus un visa de passage.",
      },
      {
        label: "Les prioritÃ©s",
        body: "Le dossier tient sur trois preuves : l'admission, la scolaritÃ©, et de quoi vivre. Le conjoint peut travailler. L'Ã©tudiant, lui, vise le diplÃ´me.",
      },
      {
        label: "L'avantage",
        body: "Un programme qui mÃ¨ne Ã  un mÃ©tier demandÃ© change la conversation. Le diplÃ´me n'est pas dÃ©coratif : il ouvre le postdiplÃ´me.",
      },
    ],
  },
  demographie: {
    kicker: "Canada Live Â· Campus",
    title: "Les campus recrutent. La sÃ©lection, elle, se resserre.",
    lead: "Le pays a besoin de diplÃ´mÃ©s. Il ne finance plus un sÃ©jour improvisÃ©. Le programme et les fonds pÃ¨sent autant que le dÃ©sir d'Ã©tudier.",
    pills: ["Campus", "PostdiplÃ´me"],
    panelTitle: "Lecture utile",
    ask: "Si le Canada forme encore, quel programme donne Ã  {name} un mÃ©tier, pas seulement un diplÃ´me ?",
    stats: [
      { label: "Ã‰tudiants Ã©trangers", value: "1 Ã©tudiant / 4", note: "part Ã©levÃ©e dans plusieurs campus" },
      { label: "PostdiplÃ´me", value: "PGWP", note: "travail aprÃ¨s un programme admissible" },
      { label: "Conjoint accompagnant", value: "permis ouvert", note: "pendant les Ã©tudes du candidat" },
      { label: "Fonds de subsistance", value: "IRCC / CAQ", note: "Ã©tudiant, conjoint, chaque enfant" },
    ],
    talks: [
      {
        label: "Constat",
        body: "Les campus canadiens reposent dÃ©jÃ  sur les Ã©tudiants Ã©trangers. Ce n'est pas une porte ouverte : c'est une place Ã  justifier.",
      },
      {
        label: "Image",
        body: "Un conjoint qui travaille et un enfant Ã  l'Ã©cole changent le budget. Le foyer entier doit tenir l'annÃ©e 1, pas seulement l'Ã©tudiant.",
      },
      {
        label: "Pont",
        body: "Le bon programme relie le campus au marchÃ©. Le mauvais programme coÃ»te cher et n'ouvre rien aprÃ¨s le diplÃ´me.",
      },
    ],
  },
  emploi: {
    kicker: "Canada Live Â· AprÃ¨s le diplÃ´me",
    title: "Le stage paie un loyer. Le diplÃ´me ouvre le mÃ©tier.",
    lead: "Pendant les Ã©tudes, le conjoint peut travailler. AprÃ¨s le diplÃ´me, c'est le mÃ©tier du programme qui compte, pas le titre du visa.",
    pills: ["Stages", "PostdiplÃ´me"],
    panelTitle: "Ce que Ã§a change",
    ask: "Le mÃ©tier visÃ© par le programme de {name} se relie-t-il Ã  un besoin rÃ©el au Canada ?",
    stats: [
      { label: "Stage mÃ©dian", value: "~48 %", note: "du salaire de mÃ©tier, ordre de grandeur" },
      { label: "AprÃ¨s le diplÃ´me", value: "salaire mÃ©tier", note: "fourchette de la province visÃ©e" },
      { label: "Conjoint pendant les Ã©tudes", value: "plein marchÃ©", note: "permis de travail ouvert" },
      { label: "EmployabilitÃ©", value: "selon programme", note: "recalÃ©e par la demande provinciale" },
    ],
    talks: [
      {
        label: "Nuance",
        body: "Un permis d'Ã©tudes n'est pas un emploi. Le stage, le postdiplÃ´me et le mÃ©tier du programme font le pont.",
      },
      {
        label: "Foyer",
        body: "Si un conjoint est au dossier, il peut dÃ©jÃ  viser un salaire de marchÃ©. L'Ã©tudiant, lui, vise le diplÃ´me puis le mÃ©tier.",
      },
      {
        label: "Suite",
        body: "Le chiffre national n'embauche personne. Le mÃ©tier visÃ© par le programme, lui, peut trouver une place.",
      },
    ],
  },
  pont: {
    kicker: "Canada Live Â· Votre projet d'Ã©tudes",
    title: "Que signifient ces chiffres pour {name} ?",
    lead: "La bonne question n'est plus le Canada en gÃ©nÃ©ral. C'est le programme, la scolaritÃ©, les fonds et le mÃ©tier aprÃ¨s le diplÃ´me.",
    pills: ["Profil", "Ã‰tudes", "{province}"],
    panelTitle: "Prochaine action",
    ask: "Si on relie le programme Ã  une province rÃ©aliste aujourd'hui, quelle est la premiÃ¨re dÃ©cision utile ?",
    stats: [
      { label: "ScolaritÃ© annÃ©e 1", value: "14 Ã  42 k$", note: "cÃ©gep Ã  universitÃ©, selon la province" },
      { label: "Preuve de fonds", value: "scolaritÃ© + vie", note: "IRCC ou CAQ selon la province" },
      { label: "CoÃ»t de vie foyer", value: "panier rÃ©el", note: "seul, couple ou enfants" },
      { label: "AprÃ¨s le diplÃ´me", value: "mÃ©tier visÃ©", note: "salaire, stage, employabilitÃ©" },
    ],
    talks: [
      {
        label: "Recentrer",
        body: "Ces chiffres se ramÃ¨nent Ã  votre foyer. Un programme nommÃ©, des fonds pour l'annÃ©e 1, un mÃ©tier aprÃ¨s le diplÃ´me.",
      },
      {
        label: "Perte",
        body: "Attendre 12 mois ne gÃ¨le pas les droits de scolaritÃ©. Les places restent limitÃ©es, et les dossiers complets passent devant.",
      },
      {
        label: "Action",
        body: "La suite utile : choisir le programme, voir les tarifs, puis les emplois du mÃ©tier visÃ©. Une dÃ©cision, pas un catalogue.",
      },
    ],
    actions: [
      { id: "voies", label: "Voir le permis d'Ã©tudes" },
      { id: "salaires", label: "Voir les salaires" },
    ],
  },
};

function workOverlays(profile: Profile): Record<string, Partial<CanadaLivePage>> {
  const teer = teerOf(profile.workNocCode);
  const feer = teer === null ? "FEER Ã  confirmer" : `FEER ${teer}`;
  const pill = teer === null ? "Permis de travail" : `CNP Â· FEER ${teer}`;
  return {
    vue: {
      kicker: "Canada Live Â· Travail",
      title: "Le Canada dÃ©livre encore des permis de travail.",
      lead: "Permis, FEER et stratÃ©gie comptent plus quâ€™un simple mÃ©tier. La CEC aprÃ¨s 12 mois reste une admissibilitÃ©, pas une invitation garantie.",
      pills: ["Permis de travail", pill],
      panelTitle: "Le travail reste possible",
      ask: "Dans 12 mois, voulez-vous encore chercher le bon permis, ou dÃ©jÃ  viser un dossier qui tient ?",
      stats: [
        { label: "Permis de travail", value: "actifs au Canada", note: "volume Ã©levÃ©, septembre 2026" },
        { label: "Lecture FEER", value: feer, note: "le niveau du mÃ©tier change les options" },
        { label: "CEC aprÃ¨s travail", value: "12 mois", note: "admissibilitÃ© si FEER visÃ©, invitation non garantie" },
        { label: "Frais IRCC", value: "155 Ã  255 $", note: "selon permis fermÃ©, ouvert ou IEC" },
      ],
      talks: [
        { label: "Aujourdâ€™hui", body: "Le Canada recrute encore, mais un mÃ©tier seul ne suffit pas. Il faut le bon type de permis et un dossier cohÃ©rent." },
        { label: "Lecture", body: "Le FEER du mÃ©tier aide Ã  lire la suite: permis fermÃ©, permis ouvert possible ou pont vers une voie Ã©conomique." },
        { label: "Pont", body: "AprÃ¨s 12 mois de travail admissible, la CEC peut devenir possible. Cela nâ€™est pas une invitation automatique." },
      ],
    },
    demographie: {
      kicker: "Canada Live Â· Travail",
      title: "Le marchÃ© a ralenti. Les permis restent ciblÃ©s.",
      lead: "Le Canada veut encore des travailleurs, mais il relie plus vite le dossier au mÃ©tier, au FEER et Ã  la province.",
      pills: ["Travail", feer],
      panelTitle: "Lecture utile",
      ask: "Le mÃ©tier de {name} se relie-t-il Ã  une province et Ã  un permis rÃ©alistes aujourdâ€™hui ?",
      stats: [
        { label: "Part Ã©conomique", value: "64 %", note: "plan 2027 et 2028" },
        { label: "Francophones hors QuÃ©bec", value: "9 %", note: "cible 2026 dans le plan des niveaux" },
        { label: "MÃ©tier du dossier", value: feer, note: "plus le FEER est lisible, plus la stratÃ©gie lâ€™est aussi" },
        { label: "Province visÃ©e", value: "{province}", note: "le dossier se joue localement" },
      ],
      talks: [
        { label: "Constat", body: "Les besoins existent encore, mais le Canada trie davantage. Le mÃ©tier et la province comptent autant que lâ€™envie de partir." },
        { label: "Risque", body: "Un FEER peu favorable ou un permis mal choisi ralentissent vite le projet." },
        { label: "Suite", body: "Le bon pont nâ€™est pas national. Il part du mÃ©tier, de la province et du type de permis." },
      ],
    },
    emploi: {
      kicker: "Canada Live Â· Travail",
      title: "EIMT ou permis ouvert: la mÃ©canique change le projet.",
      lead: "Le marchÃ© peut vouloir votre mÃ©tier. Le permis, lui, dÃ©cide si vous pouvez lâ€™exercer tout de suite.",
      pills: ["EIMT", "Permis ouvert"],
      panelTitle: "Ce que Ã§a change",
      ask: "Votre dossier tient-il mieux avec une EIMT, un permis ouvert, ou un autre montage temporaire ?",
      stats: [
        { label: "Permis fermÃ©", value: "EIMT ou IMP", note: "liÃ© Ã  lâ€™employeur" },
        { label: "Permis ouvert", value: "mobilitÃ©", note: "possible selon le volet du dossier" },
        { label: "Renouvellement", value: "avant lâ€™expiration", note: "le statut implicite protÃ¨ge la continuitÃ©" },
        { label: "Pont CEC", value: feer, note: "le CNP du dossier commande la suite" },
      ],
      talks: [
        { label: "Nuance", body: "Un mÃ©tier demandÃ© ne crÃ©e pas un permis ouvert. Il faut relier besoin du marchÃ© et autorisation rÃ©elle." },
        { label: "Employeur", body: "Lâ€™EIMT et lâ€™IMP servent le mÃªme objectif: autoriser le travail. Ils ne donnent pas la mÃªme marge." },
        { label: "Pont", body: "Le CNP du dossier dÃ©termine si lâ€™expÃ©rience servira ensuite Ã  une voie plus durable." },
      ],
    },
    pont: {
      kicker: "Canada Live Â· Votre projet travail",
      title: "Que signifient ces rÃ¨gles pour {name} ?",
      lead: "La bonne question nâ€™est plus le Canada en gÃ©nÃ©ral. Câ€™est le permis, le FEER, la province et le mÃ©tier du dossier.",
      pills: ["Profil", pill, "{province}"],
      panelTitle: "Prochaine action",
      ask: "Si on relie le mÃ©tier de {name} Ã  un permis rÃ©aliste aujourdâ€™hui, quelle est la premiÃ¨re dÃ©cision utile ?",
      stats: [
        { label: "MÃ©tier du dossier", value: feer, note: "CNP retenu pour la lecture du projet" },
        { label: "Province utile", value: "{province}", note: "câ€™est lÃ  que se lit la demande rÃ©elle" },
        { label: "Budget de dÃ©part", value: "frais + vie", note: "jusquâ€™au premier salaire" },
        { label: "Pont possible", value: "travail autorisÃ©", note: "renouvellement puis suite Ã©conomique selon le dossier" },
      ],
      talks: [
        { label: "Recentrer", body: "Ces chiffres se ramÃ¨nent Ã  votre foyer. Le permis et le mÃ©tier doivent raconter la mÃªme histoire." },
        { label: "Perte", body: "Attendre 12 mois ne facilite pas le permis. Les offres, les volets et les rÃ¨gles bougent avant vous." },
        { label: "Action", body: "La suite utile: voir les opportunitÃ©s du mÃ©tier, puis comparer les provinces et le budget." },
      ],
    },
  };
}

function visitOverlays(profile: Profile): Record<string, Partial<CanadaLivePage>> {
  const purpose = visitPurposeById(profile.visitPurpose);
  const purposePill = purpose?.name ?? "Visite";
  return {
    vue: {
      kicker: "Canada Live Â· Visite",
      title: "La visite autorise le sÃ©jour. Pas lâ€™emploi.",
      lead: "Visa, eTA, durÃ©e et attaches comptent avant tout. Le marchÃ© nâ€™ouvre rien automatiquement pendant la visite.",
      pills: ["Visite", purposePill],
      panelTitle: "La visite reste un sÃ©jour",
      ask: "Dans 12 mois, voulez-vous encore prÃ©parer la visite, ou dÃ©jÃ  dÃ©poser un dossier cohÃ©rent ?",
      stats: [
        { label: "Visa visiteur", value: "TRV", note: "selon le passeport et le pays de dÃ©part" },
        { label: "Autorisation lÃ©gÃ¨re", value: "eTA", note: "pour certains profils seulement" },
        { label: "DurÃ©e du sÃ©jour", value: "temporaire", note: "le motif et les attaches restent centraux" },
        { label: "DÃ©lais", value: "variables", note: "lecture dossier par dossier, septembre 2026" },
      ],
      talks: [
        { label: "Aujourdâ€™hui", body: "Le Canada reÃ§oit encore des visiteurs. Il regarde dâ€™abord le motif, les attaches et la cohÃ©rence du sÃ©jour." },
        { label: "RÃ¨gle", body: "Un visa visiteur autorise le sÃ©jour, pas un emploi. Il faut garder cette frontiÃ¨re claire dans tout le dossier." },
        { label: "Suite", body: "Le marchÃ© peut exister plus tard, si un changement de statut est approuvÃ©. Jamais par dÃ©faut." },
      ],
    },
    demographie: {
      kicker: "Canada Live Â· Visite",
      title: "Le motif et les attaches font la diffÃ©rence.",
      lead: "Le Canada ne juge pas seulement le pays. Il lit le motif, la durÃ©e et ce qui vous fait repartir.",
      pills: ["Motif", "Attaches"],
      panelTitle: "Lecture utile",
      ask: "Le motif choisi par {name} tient-il avec la durÃ©e, les fonds et les attaches prÃ©sentÃ©s ?",
      stats: [
        { label: "Motif dÃ©clarÃ©", value: purposePill, note: "il doit rester cohÃ©rent du dÃ©but Ã  la fin" },
        { label: "Attaches", value: "emploi, biens, famille", note: "le retour doit rester crÃ©dible" },
        { label: "Fonds", value: "sÃ©jour couvert", note: "sans travail sur place" },
        { label: "Invitant", value: "utile parfois", note: "surtout si la visite est familiale" },
      ],
      talks: [
        { label: "Constat", body: "La visite nâ€™est pas une voie de travail cachÃ©e. Le dossier doit ressembler Ã  un vrai sÃ©jour." },
        { label: "Preuve", body: "Les attaches et les fonds rassurent davantage quâ€™un rÃ©cit ambitieux sur la suite." },
        { label: "Pont", body: "Ce qui compte aujourdâ€™hui, câ€™est le motif. Le reste ne vient quâ€™aprÃ¨s un autre statut approuvÃ©." },
      ],
    },
    emploi: {
      kicker: "Canada Live Â· Visite",
      title: "Le marchÃ© existe. La visite nâ€™en donne pas lâ€™accÃ¨s.",
      lead: "Ces donnÃ©es aident Ã  lire le terrain, pas Ã  vendre un dÃ©part. Pendant la visite, ce nâ€™est pas un droit de travailler.",
      pills: ["MarchÃ©", "Pas dâ€™emploi"],
      panelTitle: "Ce que Ã§a change",
      ask: "Si le marchÃ© est lÃ , quel autre statut faudrait-il obtenir plus tard pour y entrer lÃ©galement ?",
      stats: [
        { label: "Travail sur place", value: "non", note: "le statut visiteur ne lâ€™autorise pas" },
        { label: "Ã‰tudes sur place", value: "non", note: "pas dâ€™Ã©tudes sans permis dâ€™Ã©tudes" },
        { label: "Conjoint", value: "visiteur aussi", note: "pas un statut de travailleur" },
        { label: "Lecture utile", value: "motif + attaches", note: "avant toute idÃ©e de marchÃ©" },
      ],
      talks: [
        { label: "Nuance", body: "Le marchÃ© existe, mais il ne sâ€™ouvre pas au simple fait dâ€™Ãªtre au Canada en visite." },
        { label: "Foyer", body: "Le conjoint accompagne le sÃ©jour. Il ne devient pas travailleur par le seul voyage." },
        { label: "Suite", body: "Le terrain se lit maintenant. Le droit dâ€™y travailler ne sâ€™obtient que dans un autre cadre." },
      ],
    },
    pont: {
      kicker: "Canada Live Â· Votre projet visite",
      title: "Que doit prouver le sÃ©jour de {name} ?",
      lead: "La bonne question nâ€™est pas le Canada en gÃ©nÃ©ral. Câ€™est le motif, la durÃ©e, les attaches et les fonds du sÃ©jour.",
      pills: ["Profil", purposePill, "{province}"],
      panelTitle: "Prochaine action",
      ask: "Si on relie le motif Ã  une durÃ©e rÃ©aliste aujourdâ€™hui, quelle est la premiÃ¨re preuve Ã  renforcer ?",
      stats: [
        { label: "Motif", value: purposePill, note: "la visite doit garder une logique simple" },
        { label: "DurÃ©e", value: "courte et crÃ©dible", note: "selon le voyage prÃ©sentÃ©" },
        { label: "Fonds", value: "sÃ©jour couvert", note: "sans revenu local" },
        { label: "Attaches", value: "retour dÃ©montrÃ©", note: "emploi, biens ou famille au pays" },
      ],
      talks: [
        { label: "Recentrer", body: "Ces chiffres se ramÃ¨nent Ã  votre sÃ©jour. Le dossier doit dâ€™abord prouver pourquoi vous venez et pourquoi vous repartez." },
        { label: "Perte", body: "Attendre 12 mois ne renforce pas un motif. Les incohÃ©rences, elles, restent visibles." },
        { label: "Action", body: "La suite utile: vÃ©rifier les fonds, la durÃ©e et les attaches avant de parler dâ€™autre chose." },
      ],
    },
  };
}

function businessOverlays(profile: Profile): Record<string, Partial<CanadaLivePage>> {
  const pathPill = profile.businessPath === "c11" ? "C11" : closingDeckPills(profile)[0] ?? "Affaires";
  const pathName = closingDeckPills(profile)[0] ?? "Affaires";
  const allowsWork = profile.businessPath === "c11" || profile.businessPath === "ict" || profile.businessPath === "pnp-entrepreneur";
  const spouseOpen = profile.businessPath === "c11" || profile.businessPath === "ict" || profile.businessPath === "pnp-entrepreneur";
  return {
    vue: {
      kicker: "Canada Live Â· Affaires",
      title: "Le Canada regarde le projet avant lâ€™entrepreneur.",
      lead: "C11, volets provinciaux et fonds Ã  dÃ©montrer structurent le dossier. Le projet doit Ãªtre crÃ©dible ici avant tout.",
      pills: ["Affaires", pathPill],
      panelTitle: "Le projet passe dâ€™abord",
      ask: "Dans 12 mois, voulez-vous encore dÃ©fendre une idÃ©e, ou dÃ©jÃ  prÃ©senter un projet crÃ©dible ici ?",
      stats: [
        { label: "Volet direct", value: "C11", note: "si le bÃ©nÃ©fice au Canada reste dÃ©montrÃ©" },
        { label: "Volets rÃ©gionaux", value: "PNP entrepreneur", note: "la province garde sa propre logique" },
        { label: "Start-up Visa", value: "pause", note: startupVisaNote },
        { label: "Capital", value: "Ã  dÃ©montrer", note: "le seuil dÃ©pend du volet choisi" },
      ],
      talks: [
        { label: "Aujourdâ€™hui", body: "Le Canada nâ€™achÃ¨te pas une intention. Il lit la crÃ©dibilitÃ© du projet, du capital et de lâ€™ancrage local." },
        { label: "RÃ¨gle", body: "Le bon volet dÃ©pend du projet: visiteur dâ€™affaires, C11, transfert ou entrepreneur provincial." },
        { label: "Suite", body: "Le marchÃ© salariÃ© ne remplace pas le business plan. Il sert seulement Ã  lire le filet si le projet ne tient pas." },
      ],
    },
    demographie: {
      kicker: "Canada Live Â· Affaires",
      title: "Le projet doit Ãªtre crÃ©dible ici.",
      lead: "Le pays peut accueillir lâ€™entrepreneur. Il attend dâ€™abord un dossier lisible, financÃ© et cohÃ©rent avec la province.",
      pills: ["Projet", pathPill],
      panelTitle: "Lecture utile",
      ask: "Le projet de {name} tient-il avec la province, le capital et le volet choisis ?",
      stats: [
        { label: "Province visÃ©e", value: "{province}", note: "le projet se juge localement" },
        { label: "Travail autorisÃ©", value: allowsWork ? "oui" : "non", note: "selon le volet dâ€™affaires" },
        { label: "Conjoint", value: spouseOpen ? "souvent possible" : "pas automatique", note: "selon le volet choisi" },
        { label: "Pause SUV", value: "2026", note: startupVisaNote },
      ],
      talks: [
        { label: "Constat", body: "Le pays veut des projets qui tiennent. Le capital et la logique locale comptent avant le rÃ©cit." },
        { label: "Seuil", body: "Un dossier sans fonds lisibles devient vite fragile, mÃªme si le mÃ©tier ou lâ€™expÃ©rience sont bons." },
        { label: "Pont", body: "Le bon volet nâ€™est pas le plus flatteur. Câ€™est celui qui colle vraiment au projet." },
      ],
    },
    emploi: {
      kicker: "Canada Live Â· Affaires",
      title: "Le projet, le capital et le filet salariÃ© doivent se lire ensemble.",
      lead: "Les salaires montrent le marchÃ© si le projet ne tient pas. Ils ne dÃ©crivent pas le revenu futur de lâ€™entreprise.",
      pills: ["Capital", pathName],
      panelTitle: "Ce que Ã§a change",
      ask: "Si le projet ralentit, le dossier garde-t-il une crÃ©dibilitÃ© sur le plan du capital et du marchÃ© ?",
      stats: [
        { label: "Capital Ã  montrer", value: "volet par volet", note: "investissement et vie sur place" },
        { label: "Travail du porteur", value: allowsWork ? "possible" : "non", note: "selon le statut du projet" },
        { label: "Conjoint", value: spouseOpen ? "ouvert possible" : "visiteur", note: "jamais automatique hors volet admissible" },
        { label: "Lecture marchÃ©", value: "filet salariÃ©", note: "pas le chiffre dâ€™affaires attendu" },
      ],
      talks: [
        { label: "Nuance", body: "Un bon projet reste crÃ©dible par son capital, pas par une promesse de salaire futur." },
        { label: "Volet", body: "C11 et volets provinciaux nâ€™offrent pas la mÃªme marge. Le statut du dossier change tout." },
        { label: "Suite", body: "La bonne lecture relie le projet, les fonds et la province avant dâ€™Ã©largir le plan." },
      ],
    },
    pont: {
      kicker: "Canada Live Â· Votre projet affaires",
      title: "Que doit dÃ©montrer le dossier de {name} ?",
      lead: "La bonne question nâ€™est plus le Canada en gÃ©nÃ©ral. Câ€™est le volet, la province, le capital et la crÃ©dibilitÃ© du projet.",
      pills: ["Profil", pathPill, "{province}"],
      panelTitle: "Prochaine action",
      ask: "Si on relie le projet Ã  un volet rÃ©aliste aujourdâ€™hui, quelle preuve manque le plus au dossier ?",
      stats: [
        { label: "Volet retenu", value: pathPill, note: "le statut choisi change le reste" },
        { label: "Province utile", value: "{province}", note: "lâ€™ancrage local doit rester concret" },
        { label: "Capital", value: "Ã  dÃ©montrer", note: "investissement, sÃ©jour ou vie selon le volet" },
        { label: "Pause SUV", value: "Ã  intÃ©grer", note: startupVisaNote },
      ],
      talks: [
        { label: "Recentrer", body: "Ces chiffres se ramÃ¨nent au projet. Le bon volet sert une idÃ©e crÃ©dible, pas une simple envie dâ€™affaires." },
        { label: "Perte", body: "Attendre 12 mois ne remplace pas un projet solide. Les seuils et les volets continuent dâ€™Ã©voluer." },
        { label: "Action", body: "La suite utile: voir le budget, la province et les repÃ¨res de crÃ©dibilitÃ© du volet choisi." },
      ],
    },
  };
}

function familyOverlays(profile: Profile): Record<string, Partial<CanadaLivePage>> {
  const linkPill = familyLinkById(profile.familyLink)?.name ?? "Famille";
  return {
    vue: {
      kicker: "Canada Live Â· Regroupement familial",
      title: "Le regroupement familial reste une logique de rÃ©unification.",
      lead: "CatÃ©gorie familiale, lien parrainÃ© et dÃ©lais rÃ©els structurent le dossier bien avant le marchÃ© du travail.",
      pills: ["Famille", linkPill],
      panelTitle: "La rÃ©unification reste le cÅ“ur du dossier",
      ask: "Dans 12 mois, voulez-vous encore clarifier le lien, ou dÃ©jÃ  dÃ©poser un dossier familial solide ?",
      stats: [
        { label: "CatÃ©gorie", value: "familiale", note: "le lien du dossier dÃ©cide la lecture" },
        { label: "Conjoint", value: "plus direct", note: "souvent plus simple que parents et grands-parents" },
        { label: "Parents", value: "plus long", note: "et souvent plus lourd cÃ´tÃ© preuves" },
        { label: "QuÃ©bec", value: "souvent plus long", note: "double lecture provinciale et fÃ©dÃ©rale" },
      ],
      talks: [
        { label: "Aujourdâ€™hui", body: "Le regroupement familial reste ouvert, mais il lit dâ€™abord le lien et la capacitÃ© du rÃ©pondant." },
        { label: "RÃ¨gle", body: "Le conjoint ne se traite pas comme les parents. Le lien change vraiment la durÃ©e et la stratÃ©gie." },
        { label: "Suite", body: "Le marchÃ© vient aprÃ¨s. Le dossier doit dâ€™abord prouver la rÃ©unification." },
      ],
    },
    demographie: {
      kicker: "Canada Live Â· Regroupement familial",
      title: "Le lien parrainÃ© change la vitesse du projet.",
      lead: "Le Canada ne traite pas chaque lien de la mÃªme maniÃ¨re. Le conjoint, lâ€™enfant et le parent nâ€™ouvrent pas le mÃªme calendrier.",
      pills: ["Lien", linkPill],
      panelTitle: "Lecture utile",
      ask: "Le lien choisi par {name} tient-il avec la taille du foyer, le revenu et la province visÃ©e ?",
      stats: [
        { label: "Lien retenu", value: linkPill, note: "il commande la logique du dossier" },
        { label: "RÃ©pondant", value: "au centre", note: "statut et capacitÃ© comptent" },
        { label: "MNI", value: "Ã  vÃ©rifier", note: "surtout pour parents et grands-parents" },
        { label: "Foyer rÃ©uni", value: "coÃ»t rÃ©el", note: "le budget se calcule Ã  plusieurs" },
      ],
      talks: [
        { label: "Constat", body: "Le Canada lit un foyer rÃ©el, pas un lien abstrait. La taille de la famille change vite les preuves." },
        { label: "Budget", body: "Parrainer sans capacitÃ© claire fragilise le dossier. Les chiffres doivent suivre la rÃ©unification." },
        { label: "Pont", body: "La bonne lecture repart du lien, du rÃ©pondant et du foyer rÃ©uni." },
      ],
    },
    emploi: {
      kicker: "Canada Live Â· Regroupement familial",
      title: "Le travail vient aprÃ¨s la rÃ©unification.",
      lead: "Le conjoint peut rejoindre le marchÃ© aprÃ¨s lâ€™arrivÃ©e. Pour un parent, la logique reste dâ€™abord familiale.",
      pills: ["AprÃ¨s lâ€™arrivÃ©e", linkPill],
      panelTitle: "Ce que Ã§a change",
      ask: "Quel rÃ´le joue le marchÃ© aprÃ¨s lâ€™arrivÃ©e, sans faire oublier que la rÃ©unification reste le sujet principal ?",
      stats: [
        { label: "Conjoint parrainÃ©", value: "aprÃ¨s lâ€™arrivÃ©e", note: "le marchÃ© se lit aprÃ¨s la rÃ©sidence" },
        { label: "Parent parrainÃ©", value: "pas un projet dâ€™emploi", note: "la logique reste le soutien familial" },
        { label: "QuÃ©bec", value: "plus long", note: "le QuÃ©bec ajoute souvent du dÃ©lai" },
        { label: "RÃ©pondant", value: "porte le dossier", note: "revenu et stabilitÃ© restent centraux" },
      ],
      talks: [
        { label: "Nuance", body: "Le marchÃ© ne remplace pas la rÃ©unification. Il intervient seulement aprÃ¨s lâ€™arrivÃ©e, surtout pour le conjoint." },
        { label: "Parent", body: "Un parent ne se vend pas comme un argument dâ€™emploi. Le projet parle dâ€™abord de prÃ©sence familiale." },
        { label: "Suite", body: "Le bon pont relie dâ€™abord le foyer rÃ©uni, puis les repÃ¨res de marchÃ© utiles aprÃ¨s lâ€™arrivÃ©e." },
      ],
    },
    pont: {
      kicker: "Canada Live Â· Votre projet famille",
      title: "Que doit prouver le dossier familial de {name} ?",
      lead: "La bonne question nâ€™est plus le Canada en gÃ©nÃ©ral. Câ€™est le lien, le foyer rÃ©uni, le revenu du rÃ©pondant et le dÃ©lai rÃ©aliste.",
      pills: ["Profil", linkPill, "{province}"],
      panelTitle: "Prochaine action",
      ask: "Si on relie le lien parrainÃ© Ã  une province rÃ©aliste aujourdâ€™hui, quelle preuve faut-il renforcer dâ€™abord ?",
      stats: [
        { label: "Lien", value: linkPill, note: "le dossier commence ici" },
        { label: "Province", value: "{province}", note: "le QuÃ©bec peut rallonger la suite" },
        { label: "Budget foyer", value: "rÃ©uni", note: "vie commune et obligations du rÃ©pondant" },
        { label: "MarchÃ© aprÃ¨s", value: "selon le lien", note: "surtout pour le conjoint aprÃ¨s lâ€™arrivÃ©e" },
      ],
      talks: [
        { label: "Recentrer", body: "Ces chiffres se ramÃ¨nent au foyer rÃ©uni. La prioritÃ© reste la rÃ©unification, pas le marchÃ©." },
        { label: "Perte", body: "Attendre 12 mois nâ€™allÃ¨ge pas les preuves. Les obligations financiÃ¨res restent lÃ ." },
        { label: "Action", body: "La suite utile: lire le budget du foyer, les dÃ©lais et le lien parrainÃ© avant le reste." },
      ],
    },
  };
}

export function canadaLivePagesFor(profile: Profile): CanadaLivePage[] {
  if (profile.objective === "RÃ©sidence permanente") return canadaLivePages;
  const program = profile.objective === "Ã‰tudes" ? studyProgramFor(profile) : undefined;
  const overlays =
    profile.objective === "Ã‰tudes"
      ? studyOverlays
      : profile.objective === "Travail"
        ? workOverlays(profile)
        : profile.objective === "Visite"
          ? visitOverlays(profile)
          : profile.objective === "Affaires"
            ? businessOverlays(profile)
            : profile.objective === "Regroupement familial"
              ? familyOverlays(profile)
              : undefined;
  if (!overlays) return canadaLivePages;
  return canadaLivePages.map((page) => {
    const overlay = overlays[page.id];
    if (!overlay) return page;
    const pills = overlay.pills ? [...overlay.pills] : page.pills;
    if (program && page.id === "pont") pills.splice(1, 0, program.name);
    return { ...page, ...overlay, pills };
  });
}


```

### src\data\canada-live.test.ts (162 lines)
```ts
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { startupVisaNote } from "@/data/business-paths";
import { sections } from "@/catalog";
import { canadaLivePages, canadaLivePagesFor } from "@/data/canada-live";
import { defaultProfile } from "@/data/profile";

const feature = readFileSync(join(dirname(fileURLToPath(import.meta.url)), "../features/canada.tsx"), "utf8");

describe("Canada Live briefing pages", () => {
  it("keeps four meeting pages in the catalog and the data", () => {
    expect(sections.find((section) => section.id === "canada")?.slideCount).toBe(4);
    expect(canadaLivePages).toHaveLength(4);
  });

  it("gives each page its own stats, talking points and recent press", () => {
    for (const page of canadaLivePages) {
      expect(page.stats.length).toBeGreaterThanOrEqual(3);
      expect(page.talks.length).toBeGreaterThanOrEqual(3);
      expect(page.articles.length).toBeGreaterThanOrEqual(2);
      expect(page.ask.length).toBeGreaterThan(20);
      expect(page.heroImage).toMatch(/\.(jpg|jpeg|png)(?:\?|$)/i);
      expect(page.gallery).toHaveLength(4);
    }
  });

  it("covers aging Canada with fertility 1,25 and recent StatCan plus Radio-Canada links", () => {
    const aging = canadaLivePages.find((page) => page.id === "demographie");
    expect(aging?.title).toMatch(/vieill/i);
    expect(aging?.stats.some((stat) => stat.value.includes("1,25"))).toBe(true);
    const urls = aging?.articles.map((article) => article.url) ?? [];
    expect(urls.some((url) => url.includes("statcan.gc.ca"))).toBe(true);
    expect(urls.some((url) => url.includes("radio-canada.ca"))).toBe(true);
  });

  it("anchors overview and jobs pages on official 2025-2026 figures", () => {
    const overview = canadaLivePages.find((page) => page.id === "vue");
    const jobs = canadaLivePages.find((page) => page.id === "emploi");
    expect(overview?.stats.some((stat) => stat.value.includes("380 000"))).toBe(true);
    expect(overview?.stats.some((stat) => stat.value.includes("9 %"))).toBe(true);
    expect(jobs?.stats.some((stat) => stat.value.includes("495 100"))).toBe(true);
    expect(jobs?.articles.some((article) => article.url.includes("statcan.gc.ca"))).toBe(true);
  });

  it("never ships em-dashes in client-facing Canada Live copy", () => {
    const blob = JSON.stringify(canadaLivePages);
    expect(blob).not.toContain("â€”");
    expect(blob).not.toContain("â€“");
  });

  it("shows a client-facing overview message instead of a sales script", () => {
    const overview = canadaLivePages.find((page) => page.id === "vue");
    expect(overview?.panelTitle).toBe("Le Canada n'est pas fermÃ©");
    const blob = JSON.stringify(canadaLivePages);
    expect(blob).not.toMatch(/Montrez |dites-le|Ne vendez pas|Proposez /);
  });

  it("adapts hero and gallery photos to each Canada Live page", () => {
    const vue = canadaLivePages.find((page) => page.id === "vue");
    const jobs = canadaLivePages.find((page) => page.id === "emploi");
    const aging = canadaLivePages.find((page) => page.id === "demographie");
    const bridge = canadaLivePages.find((page) => page.id === "pont");
    expect(vue?.gallery.map((item) => item.title)).toEqual(["QuÃ©bec", "MontrÃ©al", "Toronto", "Banff"]);
    expect(jobs?.heroPlace).toBe("MarchÃ© du travail");
    expect(jobs?.heroImage).toMatch(/emploi-hero/i);
    expect(jobs?.gallery.map((item) => item.title)).toEqual(["SantÃ©", "Construction", "Bureaux", "MÃ©tiers"]);
    expect(aging?.heroPlace).toBe("RelÃ¨ve");
    expect(aging?.gallery.map((item) => item.title)).toEqual(["AÃ®nÃ©s", "Famille", "Soins", "Ã‰cole"]);
    expect(bridge?.heroPlace).toBe("Votre projet");
    expect(bridge?.gallery.map((item) => item.title)).toEqual(["MÃ©tier", "Ville", "Ã‰quipe", "Installation"]);
  });
});

describe("Canada Live layout", () => {
  it("reuses the profil client shell with a photo banner and navy briefing panel", () => {
    expect(feature).toContain("canadaLiveBanner");
    expect(feature).toContain("object-[80%_center]");
    expect(feature).toContain("from-primary/92 via-primary/62 to-primary/20");
    expect(feature).not.toContain("IrShaderGradient");
    expect(feature).not.toContain("HoverRevealCards");
    expect(feature).toContain("PageShell");
    expect(feature).toContain("CanadaBriefingPanel");
    expect(feature).not.toContain('kicker="Canada Live Â· Vue dâ€™ensemble"');
  });

  it("does not render the page gallery photo strip", () => {
    expect(feature).not.toContain("HoverRevealCards");
    expect(feature).not.toContain("page.gallery");
    expect(feature).not.toContain("canadaPlacesFor()");
    expect(feature).not.toContain("place-strip-wrap");
  });

  it("uses client-facing panel headers, not sales coaching labels", () => {
    expect(feature).toContain("Ã€ retenir");
    expect(feature).toContain("Pour votre projet");
    expect(feature).toContain("La question");
    expect(feature).not.toContain("Communication");
    expect(feature).not.toContain("Pendant la rencontre");
    expect(feature).not.toContain("Question Ã  poser");
  });
});

describe("Canada Live study lens", () => {
  it("keeps four slides and swaps RP stats for student figures", () => {
    const pages = canadaLivePagesFor({ ...defaultProfile, objective: "Ã‰tudes" });
    expect(pages).toHaveLength(4);
    expect(pages[0]?.stats.some((stat) => stat.label.includes("Permis"))).toBe(true);
    expect(pages[0]?.title).toMatch(/Ã©tudes/i);
    expect(JSON.stringify(pages)).not.toContain("â€”");
    expect(JSON.stringify(pages)).not.toContain("â€“");
    expect(feature).toContain("canadaLivePagesFor");
    expect(feature).toContain("s.draft");
  });

  it("leaves the default RP briefing unchanged for other objectives", () => {
    const pages = canadaLivePagesFor(defaultProfile);
    expect(pages).toBe(canadaLivePages);
  });
});

describe("Canada Live menu lenses", () => {
  it("overlays work pages with permit, FEER and bridge data", () => {
    const pages = canadaLivePagesFor({
      ...defaultProfile,
      objective: "Travail",
      workNocCode: "21232",
    });

    expect(pages).toHaveLength(4);
    expect(pages).not.toBe(canadaLivePages);
    expect(pages[0]?.title).toMatch(/travail|permis/i);
    expect(pages[0]?.stats.some((stat) => /Permis|FEER/i.test(stat.label))).toBe(true);
    expect(pages[2]?.stats.some((stat) => /EIMT|ouvert/i.test(stat.value) || /EIMT|ouvert/i.test(stat.note))).toBe(true);
    expect(pages[3]?.pills.some((pill) => pill.includes("FEER"))).toBe(true);
    expect(JSON.stringify(pages)).not.toContain("â€”");
    expect(JSON.stringify(pages)).not.toContain("â€“");
  });

  it("overlays visit pages with stay-only framing instead of work rights", () => {
    const pages = canadaLivePagesFor({
      ...defaultProfile,
      objective: "Visite",
      visitPurpose: "business",
      visitDuration: "3m",
    });

    expect(pages).toHaveLength(4);
    expect(pages[0]?.title).toMatch(/visite|sÃ©jour/i);
    expect(pages[0]?.stats.some((stat) => /visa|eTA/i.test(stat.label) || /visa|eTA/i.test(stat.value))).toBe(true);
    expect(pages[2]?.lead).toContain("pas un droit de travailler");
    expect(pages[3]?.pills).toContain("Voyage dâ€™affaires");
  });

  it("overlays business pages with C11, provincial paths and the startup pause note", () => {
    const pages = canadaLivePagesFor({
      ...defaultProfile,
      objective: "Affaires",
      businessPath: "c11",
    });

    expect(pages).toHaveLength(4);
    expect(JSON.stringify(pages)).toContain(startupVisaNote);
    expect(pages[0]?.stats.some((stat) => /C11|PNP/i.test(stat.value) || /C11|PNP/i.test(stat.note))).toBe(true);
    expect(pages[2]?.title).toMatch(/projet|capital|crÃ©dible/i);
    expect(pages[3]?.pills).toContain("C11");
  });

  it("overlays family pages with family category and reunification-first copy", () => {
    const pages = canadaLivePagesFor({
      ...defaultProfile,
      objective: "Regroupement familial",
      familyLink: "parent",
    });

    expect(pages).toHaveLength(4);
    expect(pages[0]?.title).toMatch(/famille|familial|regroupement/i);
    expect(pages[0]?.stats.some((stat) => /catÃ©gorie|conjoint|parents/i.test(stat.label) || /conjoint|parents/i.test(stat.note))).toBe(true);
    expect(pages[2]?.stats.some((stat) => /QuÃ©bec|QC/i.test(stat.value) || /QuÃ©bec|QC/i.test(stat.note))).toBe(true);
    expect(pages[3]?.pills).toContain("Parent");
  });
});

```

### src\features\sales.tsx (193 lines)
```ts
import { ExternalLink } from "lucide-react";
import {
  IR_CTA,
  IR_SITE_LABEL,
  IR_SITE_URL,
  IR_WHATSAPP_LABEL,
  IR_WHATSAPP_URL,
  ecosystemPillars,
} from "@/data/ecosystem";
import { failurePress, failureRisks } from "@/data/failures";
import { type Profile } from "@/data/profile";
import { sectionBanners } from "@/data/section-banners";
import { OpportunitiesShell, SectionLabel, Surface } from "@/features/market";
import { highlightedFailureIds } from "@/lib/failure-press";
import { closingDeckPills } from "@/lib/closing-pills";
import { householdMarket } from "@/lib/household-market";
import { studyDeckPills } from "@/lib/study-program";
import { smart } from "@/lib/smart-copy";
import { cn } from "@/lib/utils";
import { useProfileStore } from "@/store/profile";

export function FailuresSection() {
  const profile = useProfileStore((s) => s.draft);
  const market = householdMarket(profile);
  return <FailuresRisks market={market} profile={profile} />;
}

function FailuresRisks({
  market,
  profile,
}: {
  market: ReturnType<typeof householdMarket>;
  profile: Profile;
}) {
  const featured = highlightedFailureIds(profile);
  return (
    <OpportunitiesShell
      kicker="Ã‰checs frÃ©quents"
      title="Les erreurs qui coÃ»tent du temps, de lâ€™argent et parfois plusieurs annÃ©es."
      lead="Arriver sans plan, câ€™est payer le prix du Canada avant dâ€™en avoir les bÃ©nÃ©fices."
      pills={[
        market.family,
        market.province,
        profile.objective,
        ...studyDeckPills(profile).filter((pill) => pill !== profile.objective),
        ...closingDeckPills(profile),
      ]}
      hero={sectionBanners.failures}
    >
      <div className="ir-auto-grid">
        {failureRisks.map((risk) => (
          <Surface
            key={risk.id}
            className={cn(
              "relative min-h-[176px] overflow-hidden p-4",
              featured.includes(risk.id) && "border-primary",
            )}
          >
            <img src={risk.image} alt="" className="absolute inset-0 size-full object-cover" />
            <span className="absolute inset-0 bg-ir-navy/25" />
            <span className="absolute inset-0 bg-linear-to-t from-ir-navy from-10% via-ir-navy/70 via-45% to-transparent" />
            <div className="relative z-10 flex h-full min-h-[144px] flex-col">
              <span className="flex items-center justify-between gap-2">
                <b className="grid size-[30px] shrink-0 place-items-center rounded-full bg-[#fff0f2] text-lg text-destructive">Ã—</b>
                {featured.includes(risk.id) ? (
                  <span className="rounded-full bg-white/18 px-2 py-0.5 text-[9px] font-semibold text-white">Foyer</span>
                ) : null}
              </span>
              <h3 className="mt-auto mb-1.5 text-[13px] leading-snug font-semibold text-white">{risk.label}</h3>
              <p className="text-[12px] leading-relaxed text-white/80">{risk.cost}</p>
            </div>
          </Surface>
        ))}
      </div>
      <FailuresPress />
    </OpportunitiesShell>
  );
}

const PRESS_THEMES = [
  ["housing", "Logement"],
  ["jobs", "Emploi"],
  ["distress", "DÃ©tresse"],
] as const;

function FailuresPress() {
  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-2">
        <div>
          <SectionLabel>Presse rÃ©cente</SectionLabel>
          <p className="mt-1 text-[15px] leading-snug font-semibold text-[#1a2332]">
            Le Canada nâ€™est pas un Ã©chec. Lâ€™arrivÃ©e sans prÃ©paration, si.
          </p>
          <p className="mt-0.5 text-[12px] text-muted-foreground">
            Logement, emploi, santÃ© mentale : la presse raconte ce qui arrive quand le projet sâ€™improvise.
          </p>
        </div>
        <p className="text-[12px] text-muted-foreground">Sources publiques. AperÃ§u de dÃ©monstration, pas un diagnostic.</p>
      </div>
      <div className="grid gap-3 lg:grid-cols-3">
        {PRESS_THEMES.map(([theme, label]) => (
          <div key={theme} className="flex min-w-0 flex-col gap-2">
            <SectionLabel>{label}</SectionLabel>
            {failurePress
              .filter((article) => article.theme === theme)
              .map((article) => (
                <a
                  key={article.url}
                  href={article.url}
                  target="_blank"
                  rel="noreferrer"
                  className="group block overflow-hidden rounded-[14px] border border-border bg-white transition hover:border-primary/30"
                >
                  <img src={article.image} alt="" className="h-28 w-full object-cover object-[center_28%]" />
                  <div className="p-4">
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-[11px] font-semibold tracking-wide text-primary uppercase">{article.source}</p>
                      <p className="text-[11px] text-muted-foreground">{article.date}</p>
                    </div>
                    <p className="mt-1.5 text-[13px] leading-snug font-semibold text-[#1a2332] group-hover:text-primary">{article.title}</p>
                    <p className="mt-1 line-clamp-3 text-[12px] leading-relaxed text-muted-foreground">{article.excerpt}</p>
                    <span className="mt-2 inline-flex items-center gap-1 text-[11px] font-semibold text-primary">
                      Lire lâ€™article
                      <ExternalLink className="size-3" />
                    </span>
                  </div>
                </a>
              ))}
          </div>
        ))}
      </div>
      <Surface className="p-4">
        <p className="text-[15px] leading-relaxed font-semibold text-[#1a2332]">
          Une bonne dÃ©cision prise tÃ´t coÃ»te souvent moins cher quâ€™une mauvaise dÃ©cision corrigÃ©e tard.
        </p>
      </Surface>
    </>
  );
}

export function EcosystemSection() {
  const profile = useProfileStore((s) => s.draft);
  const market = householdMarket(profile);
  return (
    <OpportunitiesShell
      kicker="Ã‰cosystÃ¨me IR"
      title="Un seul interlocuteur pour construire tout le projet."
      lead="Immigration + Emploi + Installation = Projet Canada structurÃ©"
      pills={[
        market.family,
        market.province,
        profile.objective,
        ...studyDeckPills(profile).filter((pill) => pill !== profile.objective),
        ...closingDeckPills(profile),
      ]}
      hero={sectionBanners.ecosystem}
    >
      <Surface className="p-4 sm:px-5 sm:py-4">
        <h2 className="text-base font-semibold">Nous ne nous arrÃªtons pas au dossier.</h2>
        <p className="mt-1 max-w-[62ch] text-[13px] leading-relaxed text-muted-foreground">
          IR rÃ©unit immigration, emploi et installation dans une mÃªme logique de projet.
        </p>
      </Surface>
      <div className="grid gap-3 @min-[24rem]:grid-cols-2 @min-[40rem]:grid-cols-3">
        {ecosystemPillars.map((pillar) => (
          <Surface key={pillar.id} className="p-4">
            <p className="text-[9px] font-extrabold tracking-wide text-primary uppercase">{pillar.tag}</p>
            <h3 className="mt-2 mb-1.5 text-base font-semibold">{pillar.title}</h3>
            <p className="text-[13px] leading-relaxed text-[#707987]">{pillar.body}</p>
          </Surface>
        ))}
      </div>
      <Surface className="flex flex-col gap-4 border-transparent bg-linear-to-br from-primary to-ir-deep p-4 text-white shadow-[0_12px_28px_rgba(27,84,141,.22)] sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-[12px] font-semibold text-white/70">Contact</p>
          <p className="mt-2 text-[15px] font-semibold text-white">{smart("Parlons du projet de {name}.", profile)}</p>
          <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[13px]">
            <a href={IR_SITE_URL} target="_blank" rel="noreferrer" className="font-medium text-white/85 hover:text-white hover:underline">
              {IR_SITE_LABEL}
            </a>
            <a href={IR_WHATSAPP_URL} target="_blank" rel="noreferrer" className="font-medium text-white/85 hover:text-white hover:underline">
              {IR_WHATSAPP_LABEL}
            </a>
          </div>
        </div>
        <a
          href={IR_WHATSAPP_URL}
          target="_blank"
          rel="noreferrer"
          className="inline-flex h-10 shrink-0 items-center justify-center rounded-lg bg-white px-4 text-sm font-semibold text-primary hover:bg-white/90"
        >
          {IR_CTA}
        </a>
      </Surface>
    </OpportunitiesShell>
  );
}

```

### src\features\sales.test.ts (133 lines)
```ts
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { sections } from "@/catalog";
import { defaultProfile, emptyAdult } from "@/data/profile";
import { closingDeckPills } from "@/lib/closing-pills";

const source = readFileSync(join(dirname(fileURLToPath(import.meta.url)), "sales.tsx"), "utf8");
const market = readFileSync(join(dirname(fileURLToPath(import.meta.url)), "market.tsx"), "utf8");

function extractFunction(name: string) {
  const start = source.indexOf(`function ${name}`) !== -1
    ? source.indexOf(`function ${name}`)
    : source.indexOf(`export function ${name}`);
  expect(start).toBeGreaterThan(-1);
  const from = start;
  const nextFunction = source.indexOf("\nfunction ", from + 1);
  const nextExportFunction = source.indexOf("\nexport function ", from + 1);
  const candidates = [nextFunction, nextExportFunction].filter((index) => index !== -1);
  const next = candidates.length > 0 ? Math.min(...candidates) : -1;
  return source.slice(from, next === -1 ? undefined : next);
}

describe("echecs catalog", () => {
  it("keeps a single failure slide", () => {
    expect(sections.find((section) => section.id === "echecs")?.slideCount).toBe(1);
  });
});

describe("echecs chrome", () => {
  it("reuses the profil client shell on FailuresSection", () => {
    expect(source).toContain("export function FailuresSection");
    expect(source).toContain("OpportunitiesShell");
    expect(source).toContain("Les erreurs qui coÃ»tent du temps, de lâ€™argent et parfois plusieurs annÃ©es.");
    expect(source).toContain("Arriver sans plan, câ€™est payer le prix du Canada avant dâ€™en avoir les bÃ©nÃ©fices.");
    expect(source).toContain("Le Canada nâ€™est pas un Ã©chec. Lâ€™arrivÃ©e sans prÃ©paration, si.");
    expect(source).toContain("Logement, emploi, santÃ© mentale : la presse raconte ce qui arrive quand le projet sâ€™improvise.");
    expect(market).toContain("export function OpportunitiesShell");
    expect(source).toContain("hero={sectionBanners.failures}");
    expect(source).toContain("s.draft");
  });

  it("keeps coaching copy out of Failures helpers", () => {
    for (const name of ["FailuresSection", "FailuresRisks", "FailuresPress"]) {
      const chunk = extractFunction(name);
      expect(chunk).not.toContain("Le commercial");
      expect(chunk).not.toContain("aider le prospect");
      expect(chunk).not.toContain("version connectÃ©e");
      expect(chunk).not.toContain("Cette section sert");
      expect(chunk).not.toContain("panel=");
    }
  });
});

describe("echecs boards", () => {
  it("renders household risks and sourced press", () => {
    expect(source).toContain("highlightedFailureIds");
    expect(source).toContain("failureRisks");
    expect(source).toContain("risk.image");
    expect(source).toContain("failurePress");
    expect(source).toContain("Foyer");
    expect(source).toContain("Lire lâ€™article");
    expect(source).toContain("article.image");
    expect(source).toContain("Sources publiques. AperÃ§u de dÃ©monstration, pas un diagnostic.");
    expect(source).toContain("Une bonne dÃ©cision prise tÃ´t coÃ»te souvent moins cher quâ€™une mauvaise dÃ©cision corrigÃ©e tard.");
    expect(source).toContain("Logement");
    expect(source).toContain("Emploi");
    expect(source).toContain("DÃ©tresse");
  });

  it("adds objective pills via the shared closing helper", () => {
    expect(extractFunction("FailuresRisks")).toContain("closingDeckPills(profile)");
  });
});

describe("ecosystem catalog", () => {
  it("keeps a single ecosystem slide", () => {
    expect(sections.find((section) => section.id === "ecosysteme")?.slideCount).toBe(1);
  });
});

describe("ecosystem chrome", () => {
  it("reuses the profil client shell on EcosystemSection", () => {
    expect(source).toContain("export function EcosystemSection");
    expect(source).toContain("OpportunitiesShell");
    expect(source).toContain("Un seul interlocuteur pour construire tout le projet.");
    expect(source).toContain("Immigration + Emploi + Installation = Projet Canada structurÃ©");
    expect(source).toContain("Nous ne nous arrÃªtons pas au dossier.");
    expect(source).toContain("IR rÃ©unit immigration, emploi et installation dans une mÃªme logique de projet.");
    expect(source).toContain("Parlons du projet de {name}.");
    expect(source).toContain("IR_CTA");
    expect(source).toContain("from-primary to-ir-deep");
    expect(source).toContain("hero={sectionBanners.ecosystem}");
  });

  it("keeps coaching copy out of EcosystemSection", () => {
    const chunk = extractFunction("EcosystemSection");
    expect(chunk).not.toContain("Le commercial");
    expect(chunk).not.toContain("aider le prospect");
    expect(chunk).not.toContain("version connectÃ©e");
    expect(chunk).not.toContain("panel=");
    expect(chunk).not.toContain("useDeckStore");
  });
});

describe("ecosystem boards", () => {
  it("renders three pillars plus contact and WhatsApp CTA", () => {
    expect(source).toContain("ecosystemPillars");
    expect(source).toContain("IR_CTA");
    expect(source).toContain("IR_WHATSAPP_URL");
    expect(source).toContain("IR_SITE_URL");
    expect(source).toContain("Contact");
  });

  it("keeps ecosystem pills limited to foyer, objective and closing lenses", () => {
    const chunk = extractFunction("EcosystemSection");
    expect(chunk).toContain("closingDeckPills(profile)");
    expect(chunk).not.toContain("ecosystemPillars.map((pillar) => pillar.tag)");
  });
});

describe("closingDeckPills", () => {
  it("returns an empty array when no menu lens is selected", () => {
    expect(closingDeckPills(defaultProfile)).toEqual([]);
  });

  it("returns the selected visit, business and family lenses by name", () => {
    expect(closingDeckPills({ ...defaultProfile, objective: "Visite", visitPurpose: "business" })).toEqual(["Voyage dâ€™affaires"]);
    expect(closingDeckPills({ ...defaultProfile, objective: "Affaires", businessPath: "visitor" })).toEqual(["Visiteur dâ€™affaires"]);
    expect(closingDeckPills({ ...defaultProfile, objective: "Regroupement familial", familyLink: "parent" })).toEqual(["Parent"]);
  });

  it("formats work pills from the selected noc and FEER", () => {
    expect(closingDeckPills({ ...defaultProfile, objective: "Travail", workNocCode: "21232" })).toEqual(["CNP Â· FEER 1"]);
  });

  it("does not simulate a spouse lens when the link is empty", () => {
    expect(
      closingDeckPills({
        ...defaultProfile,
        family: "Seul(e)",
        spouse: emptyAdult,
        objective: "Regroupement familial",
        familyLink: "",
      }),
    ).toEqual([]);
  });
});

```

### src\features\market.tsx (1500 lines)
```ts
import { useMemo, useState, type ReactNode } from "react";
import {
  Baby,
  CalendarDays,
  HeartPulse,
  Landmark,
  ShieldPlus,
  Umbrella,
  UsersRound,
  type LucideIcon,
} from "lucide-react";
import { BrandLogo } from "@/components/brand/BrandLogo";
import { PageShell } from "@/components/layout/PageShell";
import { personHeroImage } from "@/data/pitch";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { sectionBanners } from "@/data/section-banners";
import { provinceCode, provinceData } from "@/data/provinces";
import type { Profile } from "@/data/profile";
import { money, num } from "@/lib/format";
import { workBenefitsFor, type WorkBenefitId } from "@/data/work-benefits";
import { professionPhotosFor } from "@/data/profession-photos";
import { businessCost } from "@/lib/business-cost";
import { closingDeckPills } from "@/lib/closing-pills";
import { draftNet, householdLiving } from "@/lib/household-living";
import { familyCost } from "@/lib/family-cost";
import {
  citiesForProvince,
  defaultCityId,
  defaultProvinceCode,
  defaultCompareIds,
  livingBasket,
} from "@/lib/living-basket";
import { householdMarket, type HouseholdMarket, type HouseholdMarketAdult } from "@/lib/household-market";
import { ALL_CITIES, ALL_PROVINCES, demandLabel, featuredCitiesFor } from "@/data/job-demand";
import { householdDemand } from "@/lib/household-demand";
import { householdSalaries, type HouseholdSalaryGroup, type HouseholdSalaryPhase } from "@/lib/household-salaries";
import { studyCost } from "@/lib/study-cost";
import { studyDeckPills } from "@/lib/study-program";
import { smart } from "@/lib/smart-copy";
import { cn } from "@/lib/utils";
import { visitCost } from "@/lib/visit-cost";
import { workCost } from "@/lib/work-cost";
import { useDeckStore } from "@/store/deck";
import { useProfileStore } from "@/store/profile";

export function OpportunitiesSection() {
  const slide = useDeckStore((s) => s.slideIndex);
  const profile = useProfileStore((s) => s.draft);
  const goTo = useDeckStore((s) => s.goToSectionId);
  const market = householdMarket(profile);
  const ranked = Object.values(provinceData).sort((a, b) => b.score - a.score);
  if (slide === 1) return <OpportunitiesScore market={market} ranked={ranked} profile={profile} />;
  if (slide === 2) return <OpportunitiesNext market={market} onGo={goTo} profile={profile} />;
  return <OpportunitiesMarket market={market} profile={profile} />;
}

const visitStatusBullets = [
  "Un visa visiteur autorise le sÃ©jour, pas un emploi.",
  "Pas dâ€™Ã©tudes sans permis dâ€™Ã©tudes.",
  "Le conjoint voyage comme visiteur, pas comme travailleur.",
] as const;

function menuLensPills(profile: Profile) {
  return [...studyDeckPills(profile), ...closingDeckPills(profile)];
}

function OpportunitiesMarket({
  market,
  profile,
}: {
  market: HouseholdMarket;
  profile: Profile;
}) {
  const setPrincipalMode = useProfileStore((s) => s.setPrincipalMode);
  const others = market.adults.filter((adult) => adult.role !== "applicant");
  const study = profile.objective === "Ã‰tudes";
  const work = profile.objective === "Travail";
  const visit = profile.objective === "Visite";
  const business = profile.objective === "Affaires";
  const family = profile.objective === "Regroupement familial";
  const businessVisitor = profile.objective === "Affaires" && profile.businessPath === "visitor";
  const couple = others.length > 0;
  const workView = work ? workCost(profile) : undefined;
  const businessView = business ? businessCost(profile) : undefined;
  const showWorkBenefits = !visit && !businessVisitor;
  const title = study
    ? couple
      ? "Le conjoint peut travailler pendant les Ã©tudes."
      : "Votre programme relie le campus au marchÃ©."
    : visit
      ? "Le sÃ©jour doit Ãªtre crÃ©dible avant le reste."
      : business
        ? "Le projet doit Ãªtre crÃ©dible ici."
        : family
          ? "La rÃ©unification passe dâ€™abord."
          : workView?.pathways.spouseOpen?.eligible && couple
            ? "Le mÃ©tier principal peut aussi ouvrir une marge pour le conjoint."
            : "Votre profil peut Ãªtre reliÃ© aux donnÃ©es du marchÃ©.";
  const lead = study
    ? couple
      ? "Lâ€™Ã©tudiant vise le diplÃ´me. Le conjoint parrainÃ© vise un emploi tout de suite."
      : "Voici ce que le marchÃ© dit du mÃ©tier visÃ© par le programme."
    : visit
      ? "Le marchÃ© existe, mais la visite reste un sÃ©jour, pas un droit de travailler."
      : businessVisitor
        ? "Avant tout projet, le sÃ©jour doit rester cohÃ©rent. Un visiteur dâ€™affaires nâ€™a pas un droit de travailler."
        : business
          ? "Avant le marchÃ©, le dossier doit prouver un projet crÃ©dible ici."
          : family && profile.familyLink === "parent"
            ? "La rÃ©unification passe dâ€™abord. Ces repÃ¨res servent aprÃ¨s lâ€™arrivÃ©e, pas comme argument dâ€™emploi."
            : family
              ? "La rÃ©unification passe dâ€™abord. Le marchÃ© compte surtout aprÃ¨s lâ€™arrivÃ©e."
              : "Voici ce que le marchÃ© dit des mÃ©tiers du foyer, aujourdâ€™hui.";
  return (
    <OpportunitiesShell
      kicker="OpportunitÃ©s"
      title={title}
      lead={lead}
      pills={[market.family, market.province, ...menuLensPills(profile), ...(study ? [] : [market.principal.member.profession])]}
      hero={sectionBanners.opportunities}
      panel={<MarketPanel market={market} />}
    >
      {market.polygamous ? (
        <div className="grid shrink-0 gap-3">
          <PersonMarketCard adult={market.adults[0]} onSelect={() => setPrincipalMode(market.adults[0].role)} />
          <div className="ir-rise grid min-h-0 min-w-0 gap-3 @min-[34rem]:grid-cols-2">
            {others.map((adult) => (
              <PersonMarketCard key={adult.role} adult={adult} onSelect={() => setPrincipalMode(adult.role)} />
            ))}
          </div>
        </div>
      ) : (
        <div className={cn("grid min-w-0 shrink-0 gap-3", others.length > 0 && "@min-[34rem]:grid-cols-2")}>
          {market.adults.map((adult) => (
            <PersonMarketCard key={adult.role} adult={adult} onSelect={() => setPrincipalMode(adult.role)} />
          ))}
        </div>
      )}
      {market.kids.length > 0 ? (
        <Surface className="shrink-0 p-3 sm:px-4 sm:py-3">
          <SectionLabel>Enfants</SectionLabel>
          <div className="mt-2 grid gap-2 @min-[24rem]:grid-cols-2 @min-[48rem]:grid-cols-3">
            {market.kids.map((child) => (
              <div key={child.id} className="rounded-xl border border-[#c5d8ee] bg-secondary px-3 py-2 text-[13px] font-medium text-[#1a2332]">
                {(child.firstName || "Enfant")} Â· {child.age} ans
              </div>
            ))}
          </div>
        </Surface>
      ) : null}
      {showWorkBenefits ? (
        <WorkBenefitsSection
          province={market.province}
          hasChildren={market.kids.length > 0}
          lead={
            family && profile.familyLink === "parent"
              ? "La rÃ©unification passe dâ€™abord. Ces protections comptent aprÃ¨s lâ€™arrivÃ©e, pas comme promesse dâ€™emploi."
              : business && businessView?.path?.id !== "visitor"
                ? "Autour du salaire, un emploi au Canada ajoute une protection rÃ©elle."
                : undefined
          }
        />
      ) : (
        <Surface className="shrink-0 p-3 sm:px-4 sm:py-3">
          <SectionLabel>RepÃ¨res statut</SectionLabel>
          <ul className="mt-2 space-y-1.5 text-[13px] leading-6 text-[#3d4b5c]">
            <li>Â· Un visa visiteur autorise le sÃ©jour, pas un emploi.</li>
            <li>Â· Pas dâ€™Ã©tudes sans permis dâ€™Ã©tudes.</li>
            <li>Â· Le conjoint voyage comme visiteur, pas comme travailleur.</li>
          </ul>
        </Surface>
      )}
    </OpportunitiesShell>
  );
}

function OpportunitiesScore({
  market,
  ranked,
  profile,
}: {
  market: HouseholdMarket;
  ranked: Array<{ name: string; score: number }>;
  profile: Profile;
}) {
  const top = ranked[0];
  const study = profile.objective === "Ã‰tudes";
  return (
    <OpportunitiesShell
      kicker="OpportunitÃ©s Â· Score"
      title="OÃ¹ votre profil semble-t-il le plus intÃ©ressant ?"
      lead={study ? "Un score fondÃ© sur le mÃ©tier visÃ©, les salaires et le coÃ»t de la vie." : "Un score fondÃ© sur les salaires et le coÃ»t de la vie."}
      pills={[...menuLensPills(profile), market.principal.member.profession, market.province]}
      hero={sectionBanners.opportunities}
      panel={
        <MarketTalk
          kicker="OÃ¹ viser"
          title={top?.name ?? market.province}
          subtitle={`${top?.score ?? 0}/100`}
          blocks={[
            ["MÃ©tier retenu", market.principal.member.profession],
            ["Salaire mÃ©dian", money(market.principal.mid)],
          ]}
        />
      }
    >
      <div className="grid shrink-0 gap-2">
        {ranked.map((province, index) => (
          <Surface key={province.name} className="grid grid-cols-[42px_1fr_100px] items-center px-3.5 py-3">
            <b className="text-primary">{index + 1}</b>
            <span className="text-[14px] font-medium">{province.name}</span>
            <strong className="text-right text-primary">{province.score}/100</strong>
          </Surface>
        ))}
      </div>
    </OpportunitiesShell>
  );
}

function OpportunitiesNext({
  market,
  onGo,
  profile,
}: {
  market: HouseholdMarket;
  onGo: (id: string) => void;
  profile: Profile;
}) {
  const destinations = [
    { id: "emplois", label: "Emplois" },
    { id: "salaires", label: "Salaires" },
    { id: "voies", label: "Voies dâ€™immigration" },
    { id: "comparateur", label: "Comparateur de procÃ©dures" },
  ];
  const study = profile.objective === "Ã‰tudes";
  return (
    <OpportunitiesShell
      kicker="OpportunitÃ©s Â· Transition"
      title="Le marchÃ© est lÃ . Voyons la suite."
      lead={
        study
          ? "Les postes, les salaires et le permis dâ€™Ã©tudes qui correspondent au programme."
          : "Les postes, les salaires et les procÃ©dures qui correspondent Ã  votre profil."
      }
      pills={[market.family, ...menuLensPills(profile), market.principal.member.profession]}
      hero={sectionBanners.opportunities}
      panel={
        <MarketTalk
          kicker="Ensuite"
          title={market.principal.member.firstName || "Dossier"}
          subtitle={market.family}
          actions={destinations}
          onGo={onGo}
        />
      }
    >
      <div className="grid shrink-0 gap-2.5 sm:grid-cols-2">
        {destinations.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => onGo(item.id)}
            className="flex min-h-[72px] cursor-pointer items-end rounded-[1.2rem] border border-[#e8ecf2] bg-white px-4 py-3 text-left text-[15px] font-semibold text-ir-navy shadow-[0_8px_24px_rgba(15,23,42,.04)] transition hover:-translate-y-0.5 hover:border-ir-blue2"
          >
            {item.label}
          </button>
        ))}
      </div>
    </OpportunitiesShell>
  );
}

export function OpportunitiesShell({
  kicker,
  title,
  lead,
  pills,
  panel,
  hero,
  children,
}: {
  kicker: string;
  title: string;
  lead: string;
  pills: string[];
  panel?: ReactNode;
  hero: string;
  children: ReactNode;
}) {
  return (
    <PageShell panel={panel}>
          <header className="relative shrink-0 overflow-hidden rounded-[1.2rem] bg-primary px-4 py-3 text-white sm:px-6 sm:py-6">
            <img src={hero} alt="" className="absolute inset-0 size-full object-cover object-[80%_center]" />
            <div className="absolute inset-0 bg-linear-to-r from-primary/92 via-primary/62 to-primary/20" />
            <BrandLogo className="absolute top-3 right-3 z-10 size-11 rounded-lg ring-1 ring-white/20 sm:top-4 sm:right-4 sm:size-12" />
            <div className="relative z-10 flex flex-wrap items-end justify-between gap-3 pr-14 sm:pr-16">
              <div>
                <p className="text-[10px] font-semibold tracking-[0.18em] text-white/70 uppercase">{kicker}</p>
                <h1 className="mt-1 text-[20px] leading-tight font-semibold tracking-tight sm:text-[24px]">{title}</h1>
                <p className="mt-1 max-w-[62ch] text-[12px] text-white/70 sm:text-[13px]">{lead}</p>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {pills.map((pill) => (
                  <MetaPill key={pill}>{pill}</MetaPill>
                ))}
              </div>
            </div>
          </header>
          {children}
    </PageShell>
  );
}

const benefitIcons: Record<WorkBenefitId, LucideIcon> = {
  sante: HeartPulse,
  complements: ShieldPlus,
  conges: CalendarDays,
  parental: Baby,
  retraite: Landmark,
  emploi: Umbrella,
  famille: UsersRound,
};

function WorkBenefitsSection({
  province,
  hasChildren,
  lead,
}: {
  province: string;
  hasChildren: boolean;
  lead?: string;
}) {
  const benefits = workBenefitsFor(province, hasChildren);
  return (
    <Surface className="shrink-0 p-3 sm:px-4 sm:py-3">
      <SectionLabel>Avantages sociaux</SectionLabel>
      <p className="mt-1 text-[13px] text-muted-foreground">
        {lead ?? "Autour du salaire, un emploi au Canada ajoute une protection rÃ©elle."}
      </p>
      <div className="mt-2 grid min-w-0 gap-2 @min-[32rem]:grid-cols-2">
        {benefits.map((benefit) => {
          const Icon = benefitIcons[benefit.id];
          return (
            <div
              key={benefit.id}
              className="flex h-full min-w-0 items-center gap-3 rounded-xl border border-[#e8ecf2] bg-[#f4f7fb] px-3 py-2.5"
            >
              <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-white text-primary ring-1 ring-[#e8ecf2]">
                <Icon className="size-4" strokeWidth={1.8} />
              </span>
              <div className="min-w-0">
                <p className="text-[13px] font-semibold text-[#1a2332]">{benefit.title}</p>
                <p className="mt-0.5 text-[12px] leading-snug text-muted-foreground">{benefit.body}</p>
              </div>
            </div>
          );
        })}
      </div>
    </Surface>
  );
}

function PersonMarketCard({
  adult,
  onSelect,
}: {
  adult: HouseholdMarketAdult;
  onSelect: () => void;
}) {
  const tone = adult.selected ? "navy" : "blue";
  return (
    <button
      type="button"
      aria-pressed={adult.selected}
      aria-label={`Retenir ${adult.member.firstName || adult.label} comme profil marchÃ©`}
      onClick={onSelect}
      className="block w-full min-w-0 cursor-pointer text-left"
    >
      <Surface
        className={cn(
          "overflow-hidden p-0 transition duration-200 hover:-translate-y-0.5 @container",
          adult.selected && "ring-2 ring-primary/30",
        )}
      >
      <div
        className={cn(
          "relative flex min-h-[72px] items-center gap-2.5 overflow-hidden px-3 py-3 text-white",
          tone === "navy" ? "bg-primary" : "bg-ir-blue2",
        )}
      >
        <img src={personHeroImage(adult.member)} alt="" className="absolute inset-0 size-full object-cover object-[80%_center]" />
        <div className="absolute inset-0 bg-linear-to-r from-primary/92 via-primary/62 to-primary/20" />
        <span className="relative z-10 grid size-9 shrink-0 place-items-center rounded-xl bg-white/15 text-sm font-semibold">
          {initials(adult.member.firstName)}
        </span>
        <div className="relative z-10 min-w-0 flex-1">
          <p className="text-[10px] font-medium tracking-[0.12em] text-white/70 uppercase">{adult.label}</p>
          <p className="mt-0.5 truncate text-lg font-semibold tracking-tight">{adult.member.firstName || "â€”"}</p>
        </div>
      </div>
      <div className="grid min-w-0 gap-2 p-3">
        <div className="grid min-w-0 grid-cols-1 gap-2 @min-[20rem]:grid-cols-2">
          <ReadField label="MÃ©tier" value={adult.member.profession} />
          <ReadField label="Secteur" value={adult.member.sector} />
        </div>
        <div className="grid min-w-0 grid-cols-1 gap-2 @min-[24rem]:grid-cols-3">
          <ReadField label="Bas" value={money(adult.low)} />
          <ReadField label="MÃ©dian" value={money(adult.mid)} />
          <ReadField label="Ã‰levÃ©" value={money(adult.high)} />
        </div>
      </div>
      </Surface>
    </button>
  );
}

function MarketPanel({ market }: { market: HouseholdMarket }) {
  const showFoyer = Boolean(market.accompanying || market.excluded.length || market.kids.length);
  const foyerLabel =
    market.polygamous
      ? market.accompanying?.role === "applicant" ? "Candidat" : "Conjointe au dossier"
      : market.principal.role === "applicant"
        ? "Conjoint"
        : "Candidat";
  return (
    <div className="relative flex h-full flex-col overflow-hidden rounded-[1.2rem] bg-linear-to-br from-primary to-ir-deep p-4 text-white shadow-[0_18px_40px_rgba(27,84,141,.22)]">
      <div className="flex shrink-0 items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[12px] font-semibold tracking-[0.16em] text-white/85 uppercase">Lecture marchÃ©</p>
          <p className="mt-1 text-[24px] leading-none font-semibold tracking-tight">{market.principal.member.firstName || "â€”"}</p>
          <p className="mt-1 text-[14px] text-white/85">{market.family}</p>
        </div>
        <BrandLogo className="size-10 shrink-0 rounded-lg ring-1 ring-white/20" />
      </div>
      <div className="relative mt-3 flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        <PanelBlock title="MarchÃ© retenu">
          <FactRow label="MÃ©tier" value={market.principal.member.profession} />
          <FactRow label="Secteur" value={market.principal.member.sector} />
          <FactRow label="MÃ©dian" value={money(market.principal.mid)} />
          <FactRow label="Fourchette" value={`${money(market.principal.low)} â€“ ${money(market.principal.high)}`} />
        </PanelBlock>
        {showFoyer ? (
          <PanelBlock title="Foyer">
            {market.accompanying ? (
              <FactRow
                label={foyerLabel}
                value={`${market.accompanying.member.firstName || "â€”"} Â· ${market.accompanying.member.profession}`}
              />
            ) : null}
            {market.excluded.map((adult) => (
              <FactRow
                key={adult.role}
                label="Hors dossier"
                value={`${adult.member.firstName || adult.label} Â· ${adult.member.profession}`}
              />
            ))}
            {market.kids.map((child) => (
              <FactRow key={child.id} label="Enfant" value={`${child.firstName || "Enfant"} Â· ${child.age} ans`} />
            ))}
            {market.polygamous ? (
              <p className="pt-1 text-[13px] leading-snug text-white/80">
                Le Canada ne reconnaÃ®t quâ€™un conjoint. Une seule Ã©pouse peut accompagner le dossier.
              </p>
            ) : null}
          </PanelBlock>
        ) : null}
        <ProfessionPhotos profession={market.principal.member.profession} sex={market.principal.member.sex} />
      </div>
    </div>
  );
}

function ProfessionPhotos({ profession, sex }: { profession: string; sex: string }) {
  const photo = professionPhotosFor(profession, sex)[0];
  if (!photo) return null;
  return (
    <div className="mt-auto min-h-[148px] flex-1">
      <img
        src={photo.src}
        alt={photo.alt}
        className="h-full min-h-[148px] w-full rounded-xl object-cover ring-1 ring-white/15"
      />
    </div>
  );
}

function MarketTalk({
  kicker,
  title,
  subtitle,
  blocks,
  actions,
  onGo,
}: {
  kicker: string;
  title: string;
  subtitle: string;
  blocks?: Array<[string, string]>;
  actions?: Array<{ id: string; label: string }>;
  onGo?: (id: string) => void;
}) {
  return (
    <div className="relative flex h-full flex-col overflow-hidden rounded-[1.2rem] bg-linear-to-br from-primary to-ir-deep p-4 text-white shadow-[0_18px_40px_rgba(27,84,141,.22)]">
      <div className="flex shrink-0 items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[12px] font-semibold tracking-[0.16em] text-white/85 uppercase">{kicker}</p>
          <p className="mt-1 text-[24px] leading-none font-semibold tracking-tight">{title}</p>
          <p className="mt-1 text-[14px] text-white/85">{subtitle}</p>
        </div>
        <BrandLogo className="size-10 shrink-0 rounded-lg ring-1 ring-white/20" />
      </div>
      <div className="relative mt-3 flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        {blocks?.length ? (
          <PanelBlock title="Dossier">
            {blocks.map(([label, value]) => (
              <FactRow key={label} label={label} value={value} />
            ))}
          </PanelBlock>
        ) : null}
      </div>
      {actions?.length && onGo ? (
        <div className="mt-3 grid shrink-0 gap-2">
          {actions.map((action) => (
            <Button
              key={action.id}
              className="h-10 w-full rounded-xl bg-white text-primary hover:bg-secondary"
              onClick={() => onGo(action.id)}
            >
              {action.label}
            </Button>
          ))}
        </div>
      ) : null}
    </div>
  );
}

function ReadField({
  label,
  value,
  className,
}: {
  label: string;
  value: string;
  className?: string;
}) {
  return (
    <div className={cn("grid min-w-0 gap-1", className)}>
      <span className="text-[11px] font-medium text-muted-foreground">{label}</span>
      <p className="flex h-8 items-center rounded-md border border-input bg-[#f7fafc] px-3 text-sm font-medium text-[#1a2332]">
        {value}
      </p>
    </div>
  );
}

export function Surface({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <div
      className={cn(
        "rounded-[1.2rem] border border-[#e5eaf0] bg-white shadow-[0_8px_24px_rgba(15,23,42,.04)] transition duration-200 hover:shadow-[0_14px_32px_rgba(15,23,42,.07)]",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function SectionLabel({ children }: { children: ReactNode }) {
  return <h2 className="text-[12px] font-semibold text-[#1a2332]">{children}</h2>;
}

function MetaPill({ children }: { children: ReactNode }) {
  return (
    <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-medium text-white/90">
      {children}
    </span>
  );
}

function PanelBlock({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="rounded-xl bg-white/10 p-2">
      <p className="text-[12px] font-semibold tracking-[0.14em] text-white/80 uppercase">{title}</p>
      <div className="mt-1.5 space-y-0.5">{children}</div>
    </section>
  );
}

function FactRow({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <span className="shrink-0 text-[13px] text-white/80">{label}</span>
      <span className="text-right text-[14px] leading-tight font-medium">{value}</span>
    </div>
  );
}

function initials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  return `${parts[0][0] ?? ""}${parts[1]?.[0] ?? ""}`.toUpperCase();
}

const jobsPlace = {
  province: "",
  cityId: ALL_CITIES,
};

export function JobsSection() {
  const slide = useDeckStore((s) => s.slideIndex);
  const profile = useProfileStore((s) => s.draft);
  const market = householdMarket(profile);
  const [province, setProvince] = useState(() => jobsPlace.province || provinceCode(market.province));
  const [cityId, setCityId] = useState(() => jobsPlace.cityId);
  const view = householdDemand(profile, { province, cityId, intlOnly: slide === 1 });
  const filters = (
    <JobsFilters
      province={province}
      cityId={cityId}
      onProvince={(next) => {
        const allowed = demandCityOptions(next).some((city) => city.id === cityId);
        const nextCity = allowed ? cityId : ALL_CITIES;
        setProvince(next);
        if (!allowed) setCityId(ALL_CITIES);
        jobsPlace.province = next;
        jobsPlace.cityId = nextCity;
      }}
      onCity={(next) => {
        setCityId(next);
        jobsPlace.cityId = next;
      }}
    />
  );
  if (slide === 1) return <JobsIntl market={market} view={view} filters={filters} profile={profile} />;
  return <JobsToday market={market} view={view} filters={filters} profile={profile} />;
}

function JobsToday({
  market,
  view,
  filters,
  profile,
}: {
  market: HouseholdMarket;
  view: ReturnType<typeof householdDemand>;
  filters: ReactNode;
  profile: Profile;
}) {
  const study = profile.objective === "Ã‰tudes";
  const visit = profile.objective === "Visite";
  const businessVisitor = profile.objective === "Affaires" && profile.businessPath === "visitor";
  const family = profile.objective === "Regroupement familial";
  const other = market.adults.length > 1;
  const pills = study
    ? [market.family, ...menuLensPills(profile), view.placeLabel, ...market.adults.map((adult) => adult.member.profession)]
    : [market.family, ...menuLensPills(profile), view.placeLabel, ...market.adults.map((adult) => adult.member.profession)];
  return (
    <OpportunitiesShell
      kicker="Emplois Â· Demande"
      title={
        study
          ? other
            ? "Le conjoint parrainÃ© peut travailler pendant vos Ã©tudes."
            : "AprÃ¨s le diplÃ´me, le marchÃ© cherche votre mÃ©tier."
          : visit || businessVisitor
            ? "Le marchÃ© existe, mais ce nâ€™est pas un droit de travailler."
            : family
              ? "La rÃ©unification passe dâ€™abord. Le marchÃ© vient aprÃ¨s."
              : "Le marchÃ© cherche votre mÃ©tier. Voici oÃ¹."
      }
      lead={
        study
          ? other
            ? "Lâ€™Ã©tudiant vise le diplÃ´me. Le conjoint, lui, vise un emploi tout de suite."
            : "La demande pour votre mÃ©tier, une fois les Ã©tudes terminÃ©es."
          : visit || businessVisitor
            ? "Le taux de demande sert Ã  lire le terrain si un changement de statut est approuvÃ© plus tard. Pendant la visite, ce nâ€™est pas un droit de travailler."
            : family
              ? "La rÃ©unification passe dâ€™abord. La demande du marchÃ© sert aprÃ¨s lâ€™arrivÃ©e, pas avant."
              : "Le taux de demande par ville. Ã‡a, câ€™est la pression rÃ©elle, pas une liste dâ€™offres."
      }
      pills={pills}
      hero={sectionBanners.jobs}
    >
      {filters}
      <DemandBoard groups={view.groups} profile={profile} />
    </OpportunitiesShell>
  );
}

function JobsIntl({
  market,
  view,
  filters,
  profile,
}: {
  market: HouseholdMarket;
  view: ReturnType<typeof householdDemand>;
  filters: ReactNode;
  profile: Profile;
}) {
  const study = profile.objective === "Ã‰tudes";
  const visit = profile.objective === "Visite";
  const businessVisitor = profile.objective === "Affaires" && profile.businessPath === "visitor";
  const family = profile.objective === "Regroupement familial";
  const chips = study
    ? ["International", ...menuLensPills(profile), view.placeLabel, ...market.adults.map((adult) => adult.member.profession)]
    : ["International", ...menuLensPills(profile), view.placeLabel, ...market.adults.map((adult) => adult.member.profession)];
  return (
    <OpportunitiesShell
      kicker="Emplois Â· International"
      title={
        study
          ? "Une part de cette demande se remplit depuis lâ€™Ã©tranger â€” y compris pour le conjoint."
          : visit || businessVisitor
            ? "Une part de cette demande se remplit depuis lâ€™Ã©tranger, mais ce nâ€™est pas un droit de travailler."
            : family
              ? "Une part de cette demande sâ€™ouvre aprÃ¨s lâ€™arrivÃ©e."
              : "Une part de cette demande se remplit depuis lâ€™Ã©tranger."
      }
      lead={
        visit || businessVisitor
          ? "Filtrez la ville. Voyez oÃ¹ lâ€™embauche internationale existe dÃ©jÃ  si le statut change plus tard."
          : family
            ? "Filtrez la ville. Voyez oÃ¹ le marchÃ© sâ€™ouvre aprÃ¨s lâ€™arrivÃ©e."
            : "Filtrez la ville. Voyez oÃ¹ lâ€™embauche internationale est dÃ©jÃ  ouverte."
      }
      pills={chips}
      hero={sectionBanners.jobs}
    >
      {filters}
      <DemandBoard groups={view.groups} profile={profile} />
    </OpportunitiesShell>
  );
}

function demandCityOptions(province: string) {
  if (province === ALL_PROVINCES) {
    return Object.keys(provinceData).flatMap((code) => featuredCitiesFor(code));
  }
  return citiesForProvince(province);
}

function JobsFilters({
  province,
  cityId,
  onProvince,
  onCity,
}: {
  province: string;
  cityId: string;
  onProvince: (value: string) => void;
  onCity: (value: string) => void;
}) {
  const cities = demandCityOptions(province);
  return (
    <div className="grid shrink-0 gap-3 @min-[32rem]:grid-cols-2">
      <label className="grid gap-1">
        <span className="text-[10px] uppercase text-muted-foreground">Province</span>
        <Select value={province} onChange={(event) => onProvince(event.target.value)}>
          <option value={ALL_PROVINCES}>Toutes les provinces</option>
          {Object.entries(provinceData).map(([code, item]) => (
            <option key={code} value={code}>
              {item.name}
            </option>
          ))}
        </Select>
      </label>
      <label className="grid gap-1">
        <span className="text-[10px] uppercase text-muted-foreground">Ville</span>
        <Select value={cityId} onChange={(event) => onCity(event.target.value)}>
          <option value={ALL_CITIES}>Toutes les villes</option>
          {cities.map((city) => (
            <option key={city.id} value={city.id}>
              {city.name}
            </option>
          ))}
        </Select>
      </label>
    </div>
  );
}

function intlHiringLabel(share: number) {
  if (share >= 55) return "TrÃ¨s ouverte";
  if (share >= 40) return "Ouverte";
  if (share >= 25) return "Partielle";
  return "Locale";
}

function DemandBoard({
  groups,
  profile,
}: {
  groups: ReturnType<typeof householdDemand>["groups"];
  profile: Profile;
}) {
  return (
    <div className="grid gap-3 @min-[48rem]:grid-cols-2">
      {groups.map((group) => {
        const intl = group.metric === "intlShare";
        const value = intl ? group.current.intlShare : group.current.score;
        const chartLabel = intl ? "Part internationale" : "Taux de demande";
        const level = intl ? intlHiringLabel(value) : demandLabel(value);
        const activeId = group.series.some((point) => point.id === group.current.id) ? group.current.id : undefined;
        return (
          <Surface key={group.adult.role} className="@container flex flex-col p-3 sm:px-4 sm:py-3">
            <SectionLabel>{adultStudyHeading(group.adult, profile)}</SectionLabel>
            <div className="mt-3 flex flex-col gap-3 @min-[24rem]:flex-row @min-[24rem]:items-center">
              <DemandMeter value={value} />
              <div className="grid min-w-0 grid-cols-3 gap-2 @min-[24rem]:grow">
                <DemandStat label={chartLabel} value={intl ? `${value} %` : `${value}/100`} />
                <DemandStat label="Postes indicatifs" value={num(group.current.openings)} />
                <DemandStat label="Candidats / poste" value={String(group.current.applicantsPerOpening).replace(".", ",")} />
              </div>
            </div>
            <p className="mt-2 text-[12px] font-semibold text-primary">{level}</p>
            <DemandBars
              label={chartLabel}
              metric={group.metric}
              points={group.series}
              activeId={activeId}
            />
          </Surface>
        );
      })}
    </div>
  );
}

function DemandMeter({ value }: { value: number }) {
  const hot = value >= 80;
  return (
    <div className="relative grid size-[88px] shrink-0 place-items-center">
      <svg viewBox="0 0 36 36" className={cn("size-[88px] -rotate-90", hot ? "text-[#1e6b3d]" : "text-primary")}>
        <circle cx="18" cy="18" r="14.5" fill="none" stroke="#e8eef5" strokeWidth="3.5" />
        <circle
          cx="18"
          cy="18"
          r="14.5"
          fill="none"
          stroke="currentColor"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeDasharray={`${value} ${100 - value}`}
        />
      </svg>
      <strong className="absolute text-[22px] leading-none text-[#1a2332]">{value}</strong>
    </div>
  );
}

function DemandStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0 rounded-[10px] border border-border bg-[#f7fafc] px-2 py-2 sm:px-3">
      <span className="block truncate text-[10px] text-muted-foreground">{label}</span>
      <strong className="mt-0.5 block truncate text-[15px] text-[#1a2332]">{value}</strong>
    </div>
  );
}

function DemandBars({
  label,
  metric,
  points,
  activeId,
}: {
  label: string;
  metric: "score" | "intlShare";
  points: Array<{ id: string; name: string; score: number; intlShare: number }>;
  activeId?: string;
}) {
  return (
    <div className="min-w-0">
      <p className="text-[11px] font-medium text-muted-foreground">{label}</p>
      <div className="mt-1.5 grid gap-1">
        {points.map((point) => {
          const value = metric === "intlShare" ? point.intlShare : point.score;
          const active = point.id === activeId;
          return (
            <div key={point.id} className="grid grid-cols-[minmax(4.5rem,8rem)_minmax(0,1fr)_2.5rem] items-center gap-2">
              <span className={cn("truncate text-[12px]", active ? "font-semibold text-[#1a2332]" : "text-[#4b5565]")}>
                {point.name}
              </span>
              <div className="h-2 overflow-hidden rounded-full bg-[#e8eef5]">
                <div
                  className={cn("h-full rounded-full", active ? "bg-primary" : "bg-ir-blue2/70")}
                  style={{ width: `${value}%` }}
                />
              </div>
              <strong className="text-right text-[12px] tabular-nums text-[#1a2332]">{value}</strong>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function adultStudyHeading(adult: HouseholdMarketAdult, profile: Profile) {
  if (profile.objective === "Regroupement familial" && profile.familyLink === "spouse" && adult.role !== "applicant") {
    return `AprÃ¨s lâ€™arrivÃ©e Â· ${adult.member.profession}`;
  }
  if (profile.objective !== "Ã‰tudes") return `${adult.label} Â· ${adult.member.profession}`;
  if (adult.role === "applicant") return `${adult.label} Â· AprÃ¨s les Ã©tudes Â· ${adult.member.profession}`;
  return `Conjoint parrainÃ© Â· ${adult.member.profession}`;
}

export function SalariesSection() {
  const slide = useDeckStore((s) => s.slideIndex);
  const profile = useProfileStore((s) => s.draft);
  const market = householdMarket(profile);
  const view = householdSalaries(profile);
  if (slide === 1) return <SalariesNet market={market} view={view} profile={profile} />;
  return <SalariesBands market={market} view={view} profile={profile} />;
}

function SalariesBands({
  market,
  view,
  profile,
}: {
  market: HouseholdMarket;
  view: ReturnType<typeof householdSalaries>;
  profile: Profile;
}) {
  const study = view.study;
  const visit = profile.objective === "Visite";
  const businessVisitor = profile.objective === "Affaires" && profile.businessPath === "visitor";
  const business = profile.objective === "Affaires";
  const family = profile.objective === "Regroupement familial";
  const other = market.adults.length > 1;
  const lead = study
    ? other
      ? "Le diplÃ´me ouvre un salaire. Le conjoint parrainÃ© peut dÃ©jÃ  travailler."
      : "Le diplÃ´me ouvre un salaire. Le stage, câ€™est dÃ©jÃ  un revenu."
    : visit || businessVisitor
      ? "Pendant la visite, ce nâ€™est pas un droit de travailler. Ces fourchettes dÃ©crivent le marchÃ© si le statut change plus tard."
      : business
        ? "Ces fourchettes dÃ©crivent le marchÃ© salariÃ© si le projet ne tient pas, pas le revenu de lâ€™entreprise."
        : family
          ? "La rÃ©unification passe dâ€™abord. Les fourchettes servent aprÃ¨s lâ€™arrivÃ©e, pas avant."
          : other
            ? "Le mÃ©dian nâ€™est pas un salaire promis. Deux mÃ©tiers, deux fourchettes."
            : "Le mÃ©dian nâ€™est pas un salaire promis. Câ€™est le milieu du marchÃ©, ici.";
  const pills = study
    ? [market.family, ...menuLensPills(profile), market.province, ...market.adults.map((adult) => adult.member.profession)]
    : [market.family, market.province, ...menuLensPills(profile), ...market.adults.map((adult) => adult.member.profession)];
  return (
    <OpportunitiesShell
      kicker="Guide salarial"
      title={
        study
          ? other
            ? "Combien le foyer peut-il gagner pendant et aprÃ¨s les Ã©tudes ?"
            : "Combien pouvez-vous gagner aprÃ¨s vos Ã©tudes ?"
          : visit || businessVisitor
            ? smart("Combien peut gagner un(e) {profession} aprÃ¨s un changement de statut ?", profile)
            : family
              ? "Combien le foyer peut-il gagner aprÃ¨s lâ€™arrivÃ©e ?"
              : smart("Combien peut gagner un(e) {profession} ?", profile)
      }
      lead={lead}
      pills={pills}
      hero={sectionBanners.salaries}
    >
      <SalariesBoard groups={view.groups} />
    </OpportunitiesShell>
  );
}

function SalariesNet({
  market,
  view,
  profile,
}: {
  market: HouseholdMarket;
  view: ReturnType<typeof householdSalaries>;
  profile: Profile;
}) {
  const study = view.study;
  const other = market.adults.length > 1;
  const pills = study
    ? [market.family, "Ã‰tudes", market.province, ...menuLensPills(profile), ...market.adults.map((adult) => adult.member.profession)]
    : [market.family, market.province, ...menuLensPills(profile), ...market.adults.map((adult) => adult.member.profession)];
  return (
    <OpportunitiesShell
      kicker="Guide salarial Â· Net"
      title="Le salaire brut ne raconte pas toute lâ€™histoire."
      lead={
        study
          ? other
            ? "Le stage et le conjoint paient le loyer. Le diplÃ´me change lâ€™Ã©chelle."
            : "Le stage paie un loyer. Le diplÃ´me ouvre le vrai salaire."
          : "Ce qui reste aprÃ¨s les retenues, câ€™est Ã§a qui paie le loyer."
      }
      pills={pills}
      hero={sectionBanners.salaries}
    >
      <SalariesNetBoard groups={view.groups} />
    </OpportunitiesShell>
  );
}

function SalaryPhaseBands({ phase }: { phase: HouseholdSalaryPhase }) {
  return (
    <div className="grid gap-2">
      {phase.label ? (
        <div>
          <p className="text-[11px] font-semibold tracking-[0.12em] text-primary uppercase">{phase.label}</p>
          {phase.hint ? <p className="mt-0.5 text-[12px] text-muted-foreground">{phase.hint}</p> : null}
        </div>
      ) : null}
      <div className="grid gap-2 sm:grid-cols-3">
        <Band label="Bas" value={money(phase.low)} />
        <Band label="MÃ©dian" value={money(phase.mid)} featured />
        <Band label="Ã‰levÃ©" value={money(phase.high)} />
      </div>
      <div className="grid gap-2 ir-auto-grid-sm">
        {Object.entries(phase.bands).map(([code, values]) => (
          <div key={code} className="rounded-[10px] border border-border bg-white p-3 text-center">
            <span className="block text-[10px] text-muted-foreground">{provinceData[code]?.name ?? code}</span>
            <b className="mt-1 block text-sm">{money(values[1])}</b>
          </div>
        ))}
      </div>
    </div>
  );
}

function SalariesBoard({ groups }: { groups: HouseholdSalaryGroup[] }) {
  return (
    <div className="grid shrink-0 gap-3">
      {groups.map((group) => (
        <Surface key={group.adult.role} className="p-3 sm:px-4 sm:py-3">
          <SectionLabel>{group.heading}</SectionLabel>
          <div className="mt-3 grid gap-4">
            {group.phases.map((phase) => (
              <SalaryPhaseBands key={phase.id} phase={phase} />
            ))}
          </div>
        </Surface>
      ))}
    </div>
  );
}

function SalaryPhaseNet({ phase }: { phase: HouseholdSalaryPhase }) {
  return (
    <div className="grid gap-2">
      {phase.label ? (
        <div>
          <p className="text-[11px] font-semibold tracking-[0.12em] text-primary uppercase">{phase.label}</p>
          {phase.hint ? <p className="mt-0.5 text-[12px] text-muted-foreground">{phase.hint}</p> : null}
        </div>
      ) : null}
      <div className="grid gap-2 sm:grid-cols-3">
        <div>
          <span className="text-[10px] uppercase text-muted-foreground">Salaire brut mÃ©dian</span>
          <strong className="mt-1 block text-[22px] text-primary">{money(phase.mid)}</strong>
        </div>
        <div>
          <span className="text-[10px] uppercase text-muted-foreground">Net annuel estimatif</span>
          <strong className="mt-1 block text-[22px] text-primary">{money(phase.netAnnual)}</strong>
        </div>
        <div>
          <span className="text-[10px] uppercase text-muted-foreground">Net mensuel</span>
          <strong className="mt-1 block text-[22px] text-primary">{money(phase.netMonthly)}</strong>
        </div>
      </div>
    </div>
  );
}

function SalariesNetBoard({ groups }: { groups: HouseholdSalaryGroup[] }) {
  return (
    <div className="grid shrink-0 gap-3">
      {groups.map((group) => (
        <Surface key={group.adult.role} className="p-4">
          <SectionLabel>{group.heading}</SectionLabel>
          <div className="mt-3 grid gap-4">
            {group.phases.map((phase) => (
              <SalaryPhaseNet key={phase.id} phase={phase} />
            ))}
          </div>
          <p className="mt-3 text-[12px] text-muted-foreground">Estimation de dÃ©monstration.</p>
        </Surface>
      ))}
    </div>
  );
}

export function CalculatorsSection() {
  const slide = useDeckStore((s) => s.slideIndex);
  const profile = useProfileStore((s) => s.draft);
  const market = householdMarket(profile);
  const living = householdLiving(profile);
  if (slide === 1) return <CalculatorsLiving market={market} living={living} profile={profile} />;
  if (slide === 2) return <CalculatorsBudget market={market} profile={profile} />;
  return <CalculatorsNet market={market} living={living} />;
}

function CalculatorsNet({
  market,
  living,
}: {
  market: HouseholdMarket;
  living: ReturnType<typeof householdLiving>;
}) {
  const other = market.accompanying;
  const lead = other
    ? "Le brut impressionne. Le net paie le loyer. Deux mÃ©tiers, deux restes."
    : "Le brut impressionne. Le net, câ€™est Ã§a qui paie le loyer.";
  const pills = [market.family, market.province, ...market.adults.map((adult) => adult.member.profession)];
  const initialCode = provinceCode(market.province);
  const [drafts, setDrafts] = useState(() =>
    living.groups.map((group) => ({
      role: group.adult.role,
      gross: group.adult.mid,
      code: initialCode,
    })),
  );
  return (
    <OpportunitiesShell
      kicker="Calculateur Â· Salaire net"
      title="Combien reste-t-il rÃ©ellement aprÃ¨s les retenues ?"
      lead={lead}
      pills={pills}
      hero={sectionBanners.calculators}
    >
      <div className="grid shrink-0 gap-3">
        {living.groups.map((group) => {
          const draft = drafts.find((item) => item.role === group.adult.role) ?? {
            role: group.adult.role,
            gross: group.adult.mid,
            code: initialCode,
          };
          const net = draftNet(draft.gross, draft.code);
          return (
            <Surface key={group.adult.role} className="p-4">
              <SectionLabel>
                {group.adult.label} Â· {group.adult.member.profession}
              </SectionLabel>
              <div className="mt-3 grid gap-3 @min-[28rem]:grid-cols-2 @min-[40rem]:grid-cols-[1fr_1fr_minmax(9rem,auto)]">
                <label className="grid gap-1">
                  <span className="text-[10px] uppercase text-muted-foreground">Salaire annuel brut</span>
                  <Input
                    type="number"
                    value={draft.gross}
                    onChange={(event) =>
                      setDrafts((current) =>
                        current.map((item) =>
                          item.role === group.adult.role ? { ...item, gross: Number(event.target.value) || 0 } : item,
                        ),
                      )
                    }
                  />
                </label>
                <label className="grid gap-1">
                  <span className="text-[10px] uppercase text-muted-foreground">Province</span>
                  <Select
                    value={draft.code}
                    onChange={(event) =>
                      setDrafts((current) =>
                        current.map((item) =>
                          item.role === group.adult.role ? { ...item, code: event.target.value } : item,
                        ),
                      )
                    }
                  >
                    {Object.entries(provinceData).map(([code, province]) => (
                      <option key={code} value={code}>
                        {province.name}
                      </option>
                    ))}
                  </Select>
                </label>
                <div className="rounded-xl bg-secondary px-4 py-3">
                  <span className="text-[10px] uppercase text-muted-foreground">Net annuel estimatif</span>
                  <strong className="mt-1 block text-[22px] text-primary">{money(net.netAnnual)}</strong>
                  <small className="text-[12px] text-muted-foreground">
                    â‰ˆ {money(net.netMonthly)} / mois
                  </small>
                </div>
              </div>
            </Surface>
          );
        })}
      </div>
    </OpportunitiesShell>
  );
}

function CalculatorsLiving({
  market,
  living,
  profile,
}: {
  market: HouseholdMarket;
  living: ReturnType<typeof householdLiving>;
  profile: Profile;
}) {
  const pills = [market.family, market.province, ...menuLensPills(profile), ...market.adults.map((adult) => adult.member.profession)];
  return (
    <OpportunitiesShell
      kicker="Calculateur Â· CoÃ»t de la vie"
      title={smart("Que vaut ce salaire Ã  {province} ?", profile)}
      lead="Un salaire nâ€™existe pas tout seul. Il se mesure au loyer."
      pills={pills}
      hero={sectionBanners.calculators}
    >
      <Surface className="p-4">
        <SectionLabel>
          {market.family} Â· {market.province}
        </SectionLabel>
        {living.groups.length > 1 ? (
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            {living.groups.map((group) => (
              <div key={group.adult.role} className="rounded-[10px] border border-border bg-white p-3">
                <span className="block text-[10px] text-muted-foreground">
                  {group.adult.label} Â· {group.adult.member.profession}
                </span>
                <b className="mt-1 block text-sm">{money(group.netMonthly)} / mois</b>
              </div>
            ))}
          </div>
        ) : null}
        <div className="mt-3 ir-auto-grid">
          <div className="rounded-[14px] border border-border bg-white p-5">
            <span className="block text-[10px] uppercase text-muted-foreground">Net mensuel</span>
            <strong className="mt-1.5 block text-[26px]">{money(living.combinedNetMonthly)}</strong>
          </div>
          <div className="rounded-[14px] border border-border bg-white p-5">
            <span className="block text-[10px] uppercase text-muted-foreground">Loyer indicatif</span>
            <strong className="mt-1.5 block text-[26px]">{money(living.rent)}</strong>
          </div>
          <div className="rounded-[14px] border border-border bg-white p-5">
            <span className="block text-[10px] uppercase text-muted-foreground">Autres dÃ©penses estimÃ©es</span>
            <strong className="mt-1.5 block text-[26px]">{money(living.other)}</strong>
          </div>
          <div className="rounded-[14px] border border-transparent bg-linear-to-br from-primary to-ir-deep p-5 text-white">
            <span className="block text-[10px] uppercase opacity-75">Reste estimatif</span>
            <strong className="mt-1.5 block text-[26px]">{money(living.remainder)}</strong>
          </div>
        </div>
      </Surface>
    </OpportunitiesShell>
  );
}

function CalculatorsBudget({
  market,
  profile,
}: {
  market: HouseholdMarket;
  profile: Profile;
}) {
  const study = profile.objective === "Ã‰tudes";
  const cost = study ? studyCost(profile) : undefined;
  const work = profile.objective === "Travail" ? workCost(profile) : undefined;
  const visit = profile.objective === "Visite" ? visitCost(profile) : undefined;
  const business = profile.objective === "Affaires" ? businessCost(profile) : undefined;
  const family = profile.objective === "Regroupement familial" ? familyCost(profile) : undefined;
  const pills = [...menuLensPills(profile), market.family, market.province];
  const fees = Math.min(profile.budget || 5000, 5000);
  const cards = cost
    ? ([
        ["ScolaritÃ© (annÃ©e 1)", money(cost.tuition)],
        ["CoÃ»t de vie (annÃ©e 1)", money(cost.livingAnnual)],
        ["Preuve de fonds", money(cost.proofOfFunds)],
      ] as const)
    : work
      ? ([
          ["Frais de permis", money(work.fees.total)],
          ["CoÃ»t de vie (annÃ©e 1)", money(work.livingAnnual)],
          ["Fonds jusquâ€™au 1er salaire", money(work.settlementFunds)],
        ] as const)
      : visit
        ? ([
            ["Frais de visa", money(visit.feesTotal)],
            ["CoÃ»t du sÃ©jour", money(visit.stayCost)],
            ["Fonds Ã  dÃ©montrer", money(visit.fundsRequired)],
          ] as const)
        : business?.path?.id === "visitor"
          ? ([
              ["Frais de voyage", money(visitCost(profile).ticketsDemo)],
              ["CoÃ»t du sÃ©jour", money(business.stayShort)],
              ["Fonds Ã  dÃ©montrer", money(business.capitalToShow)],
            ] as const)
          : business
            ? ([
                ["Investissement", money(business.investment)],
                ["CoÃ»t de vie (annÃ©e 1)", money(business.livingAnnual)],
                ["Capital Ã  dÃ©montrer", money(business.capitalToShow)],
              ] as const)
            : family
              ? ([
                  ["Frais de parrainage", money(family.feesTotal)],
                  ["Revenu exigÃ© (MNI)", money(family.incomeRequired)],
                  ["CoÃ»t de vie (foyer rÃ©uni)", money(family.livingReunitedAnnual)],
                ] as const)
    : ([
        ["Honoraires IR", money(fees)],
        ["DÃ©marches & tests", "Ã€ estimer"],
        ["Installation", "Ã€ estimer"],
        ["Fonds de sÃ©curitÃ©", "Ã€ prÃ©voir"],
      ] as const);
  return (
    <OpportunitiesShell
      kicker="Calculateur Â· Budget projet"
      title="Combien faut-il prÃ©parer pour dÃ©marrer ?"
      lead="Un projet Canada, ce nâ€™est pas seulement des honoraires."
      pills={pills}
      hero={sectionBanners.calculators}
    >
      <div className="grid shrink-0 gap-3 sm:grid-cols-2">
        {cards.map(([label, value]) => (
          <Surface key={label} className="p-5">
            <span className="text-[10px] uppercase text-muted-foreground">{label}</span>
            <strong className="mt-2 block text-[24px] text-primary">{value}</strong>
          </Surface>
        ))}
      </div>
    </OpportunitiesShell>
  );
}

export function ProvincesSection() {
  const slide = useDeckStore((s) => s.slideIndex);
  const profile = useProfileStore((s) => s.draft);
  const market = householdMarket(profile);
  if (slide === 1) return <ProvincesCompare market={market} profile={profile} />;
  return <ProvincesEstimator market={market} profile={profile} />;
}

function ProvincesEstimator({
  market,
  profile,
}: {
  market: HouseholdMarket;
  profile: Profile;
}) {
  const initialCode = defaultProvinceCode(profile);
  const [code, setCode] = useState(initialCode);
  const cities = citiesForProvince(code);
  const [cityId, setCityId] = useState(() => defaultCityId(profile));
  const selectedId = cities.some((city) => city.id === cityId) ? cityId : cities[0]?.id ?? "montreal";
  const basket = livingBasket(profile, selectedId);
  const pills = [market.family, market.province, ...menuLensPills(profile), ...market.adults.map((adult) => adult.member.profession)];
  const rows = [
    ["Logement", basket.housing],
    ["Ã‰picerie", basket.grocery],
    ["Transport", basket.transport],
    ["Services", basket.utilities],
    ...(basket.kids > 0 ? [["Garde dâ€™enfants", basket.childcare] as const] : []),
  ] as Array<[string, number]>;
  return (
    <OpportunitiesShell
      kicker="Provinces Â· CoÃ»t de vie"
      title="Le salaire ne paie pas une moyenne. Il paie une ville."
      lead={
        profile.objective === "Visite"
          ? "ce que coÃ»te un mois sur place, pas une installation"
          : "Logement, Ã©picerie, transport, services. Tout le foyer, pas un cÃ©libataire imaginaire."
      }
      pills={pills}
      hero={sectionBanners.provinces}
    >
      <div className="grid shrink-0 gap-3 sm:grid-cols-2">
        <label className="grid gap-1">
          <span className="text-[10px] uppercase text-muted-foreground">Province</span>
          <Select
            value={code}
            onChange={(event) => {
              const next = event.target.value;
              setCode(next);
              setCityId(citiesForProvince(next)[0]?.id ?? "montreal");
            }}
          >
            {Object.entries(provinceData)
              .filter(([item]) => citiesForProvince(item).length > 0)
              .map(([item, province]) => (
                <option key={item} value={item}>
                  {province.name}
                </option>
              ))}
          </Select>
        </label>
        <label className="grid gap-1">
          <span className="text-[10px] uppercase text-muted-foreground">Ville</span>
          <Select value={selectedId} onChange={(event) => setCityId(event.target.value)}>
            {cities.map((city) => (
              <option key={city.id} value={city.id}>
                {city.name}
              </option>
            ))}
          </Select>
        </label>
      </div>
      <Surface className="p-4">
        <SectionLabel>
          {basket.city.name} Â· {provinceData[basket.city.province]?.name ?? basket.city.province}
        </SectionLabel>
        <div className="mt-3 ir-auto-grid">
          {rows.map(([label, value]) => (
            <div key={label} className="rounded-[14px] border border-border bg-white p-5">
              <span className="block text-[10px] uppercase text-muted-foreground">{label}</span>
              <strong className="mt-1.5 block text-[26px]">{money(value)}</strong>
            </div>
          ))}
        </div>
        <div className="mt-3 grid gap-2 sm:grid-cols-3">
          <div className="rounded-[14px] border border-border bg-white p-5">
            <span className="block text-[10px] uppercase text-muted-foreground">Panier mensuel</span>
            <strong className="mt-1.5 block text-[26px]">{money(basket.total)}</strong>
          </div>
          <div className="rounded-[14px] border border-border bg-white p-5">
            <span className="block text-[10px] uppercase text-muted-foreground">Net du foyer</span>
            <strong className="mt-1.5 block text-[26px]">{money(basket.netMonthly)}</strong>
          </div>
          <div className="rounded-[14px] border border-transparent bg-linear-to-br from-primary to-ir-deep p-5 text-white">
            <span className="block text-[10px] uppercase opacity-75">Reste estimatif</span>
            <strong className="mt-1.5 block text-[26px]">{money(basket.remainder)}</strong>
          </div>
        </div>
        <p className="mt-3 text-[12px] text-muted-foreground">Estimation de dÃ©monstration.</p>
      </Surface>
    </OpportunitiesShell>
  );
}

function ProvincesCompare({
  market,
  profile,
}: {
  market: HouseholdMarket;
  profile: Profile;
}) {
  const pills = [market.family, market.province, ...menuLensPills(profile)];
  const [code, setCode] = useState(() => defaultProvinceCode(profile));
  const [selected, setSelected] = useState<string[]>(() => [...defaultCompareIds(profile)]);
  const cities = citiesForProvince(code);
  const showCare = market.kids.length > 0;
  const baskets = selected.map((id) => livingBasket(profile, id));
  const headers = ["Ville", "Logement", "Ã‰picerie", "Transport", "Services", ...(showCare ? ["Garde"] : []), "Panier", "Reste"];
  return (
    <OpportunitiesShell
      kicker="Provinces Â· Comparer"
      title="La mÃªme vie ne coÃ»te pas le mÃªme prix."
      lead="Trois villes maximum. Celle qui laisse un reste rend le projet possible."
      pills={pills}
      hero={sectionBanners.provinces}
    >
      <label className="grid max-w-sm gap-1">
        <span className="text-[10px] uppercase text-muted-foreground">Province</span>
        <Select value={code} onChange={(event) => setCode(event.target.value)}>
          {Object.entries(provinceData).map(([item, province]) => (
            <option key={item} value={item}>
              {province.name}
            </option>
          ))}
        </Select>
      </label>
      <div className="flex flex-wrap gap-2">
        {cities.map((city) => {
          const on = selected.includes(city.id);
          return (
            <button
              key={city.id}
              type="button"
              onClick={() =>
                setSelected((current) => {
                  if (current.includes(city.id)) return current.filter((id) => id !== city.id);
                  if (current.length >= 3) return current;
                  return [...current, city.id];
                })
              }
              className={cn(
                "rounded-full border px-3 py-1.5 text-[12px] font-medium transition",
                on ? "border-primary bg-primary text-white" : "border-border bg-white text-[#1a2332]",
              )}
            >
              {city.name}
            </button>
          );
        })}
      </div>
      {baskets.length === 0 ? (
        <p className="text-[13px] text-muted-foreground">Choisissez jusquâ€™Ã  trois villes pour comparer.</p>
      ) : (
        <Surface className="overflow-x-auto p-3">
          <table className="w-full border-separate border-spacing-y-1.5 text-[11px]">
            <thead>
              <tr className="text-left text-[9px] tracking-wide text-[#89929f] uppercase">
                {headers.map((header) => (
                  <th key={header} className="px-2.5">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {baskets.map((basket) => (
                <tr key={basket.city.id}>
                  <td className="rounded-l-[9px] border border-r-0 border-[#e4e8ee] bg-[#f7fafc] px-2.5 py-2.5 font-semibold">
                    {basket.city.name}
                  </td>
                  <td className="border-y border-[#e4e8ee] bg-[#f7fafc] px-2.5">{money(basket.housing)}</td>
                  <td className="border-y border-[#e4e8ee] bg-[#f7fafc] px-2.5">{money(basket.grocery)}</td>
                  <td className="border-y border-[#e4e8ee] bg-[#f7fafc] px-2.5">{money(basket.transport)}</td>
                  <td className="border-y border-[#e4e8ee] bg-[#f7fafc] px-2.5">{money(basket.utilities)}</td>
                  {showCare ? <td className="border-y border-[#e4e8ee] bg-[#f7fafc] px-2.5">{money(basket.childcare)}</td> : null}
                  <td className="border-y border-[#e4e8ee] bg-[#f7fafc] px-2.5 font-semibold">{money(basket.total)}</td>
                  <td className="rounded-r-[9px] border border-l-0 border-[#e4e8ee] bg-[#f7fafc] px-2.5 font-semibold text-primary">
                    {money(basket.remainder)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Surface>
      )}
    </OpportunitiesShell>
  );
}

function Band({ label, value, featured = false }: { label: string; value: string; featured?: boolean }) {
  return (
    <div className={`rounded-[14px] border p-5 text-center ${featured ? "border-transparent bg-linear-to-br from-primary to-ir-deep text-white" : "border-border bg-white"}`}>
      <span className="block text-[10px] uppercase opacity-75">{label}</span>
      <strong className="mt-1.5 block text-[26px]">{value}</strong>
    </div>
  );
}

function Hero({ label, value }: { label: string; value: string }) {
  return (
    <Card className="p-[18px]">
      <span className="text-[10px] text-muted-foreground">{label}</span>
      <strong className="mt-1 block text-[23px] text-primary">{value}</strong>
    </Card>
  );
}

```

### src\features\market.test.ts (350 lines)
```ts
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { MapPin } from "lucide-react";
import { describe, expect, it } from "vitest";
import { sections } from "@/catalog";

const source = readFileSync(join(dirname(fileURLToPath(import.meta.url)), "market.tsx"), "utf8");

function extractFunction(name: string) {
  const start = source.indexOf(`function ${name}`);
  expect(start).toBeGreaterThan(-1);
  const nextFunction = source.indexOf("\nfunction ", start + 1);
  const nextExportFunction = source.indexOf("\nexport function ", start + 1);
  const candidates = [nextFunction, nextExportFunction].filter((index) => index !== -1);
  const next = candidates.length > 0 ? Math.min(...candidates) : -1;
  return source.slice(start, next === -1 ? undefined : next);
}

describe("opportunities catalog", () => {
  it("keeps three opportunity slides", () => {
    expect(sections.find((section) => section.id === "opportunites")?.slideCount).toBe(3);
  });
});

describe("opportunities chrome", () => {
  it("reuses the profil client shell on OpportunitiesSection", () => {
    expect(source).toContain("export function OpportunitiesSection");
    expect(source).toContain("householdMarket");
    expect(source).toContain("sectionBanners.opportunities");
    expect(source).toContain("BrandLogo");
    expect(source).toContain("PageShell");
    expect(source).not.toContain("xl:grid-cols-[minmax(0,1fr)_300px]");
    expect(source).toContain("bg-linear-to-br from-primary to-ir-deep");
    expect(source).toContain("Lecture marchÃ©");
    expect(source).not.toContain("Rechercher");
  });

  it("does not add Canada places cards to opportunities", () => {
    const section = extractFunction("OpportunitiesMarket");
    expect(section).not.toContain("HoverRevealCards");
    expect(section).not.toContain("canadaPlacesFor");
  });
});

describe("opportunities household fields", () => {
  it("shows read-only mÃ©tier, secteur and salary band fields on PersonMarketCard", () => {
    const card = extractFunction("PersonMarketCard");
    expect(source).toContain("personHeroImage");
    expect(card).toContain("personHeroImage(adult.member)");
    expect(card).toContain("object-cover object-[80%_center]");
    expect(card).toContain("bg-linear-to-r from-primary/92 via-primary/62 to-primary/20");
    expect(card).not.toContain("<IrBlueSign");
    expect(card).not.toContain("<IrShaderGradient");
    expect(card).toContain('label="MÃ©tier"');
    expect(card).toContain('label="Secteur"');
    expect(card).not.toContain('label="Offres"');
    expect(card).toContain('label="Bas"');
    expect(card).toContain('label="MÃ©dian"');
    expect(card).toContain('label="Ã‰levÃ©"');
    expect(card).toContain("adult.member.profession");
    expect(card).toContain("adult.member.sector");
    expect(card).toContain("onSelect");
    expect(card).toContain("aria-pressed={adult.selected}");
    expect(card).toContain("min-w-0");
    expect(card).not.toContain("onChange");
  });

  it("renders adult market cards, a spouse grid, and a children strip", () => {
    const market = extractFunction("OpportunitiesMarket");
    expect(market).toContain("PersonMarketCard");
    expect(market).toContain("@min-[34rem]:grid-cols-2");
    expect(market).toContain("Enfants");
    expect(market).toContain("market.polygamous");
    expect(market).toContain("setPrincipalMode");
    expect(market).toContain("onSelect={() => setPrincipalMode(adult.role)}");
    expect(source).toContain("Le Canada ne reconnaÃ®t quâ€™un conjoint");
    expect(source).toContain("Avantages sociaux");
    expect(source).not.toContain('label="Offres"');
  });

  it("chooses the foyer label from the accompanying adult in polygamy", () => {
    const panel = extractFunction("MarketPanel");
    expect(panel).toContain('market.accompanying?.role === "applicant"');
    expect(panel).toContain("ProfessionPhotos");
    expect(panel).toContain("market.principal.member.profession");
    expect(extractFunction("ProfessionPhotos")).not.toContain("grid-cols-2");
    expect(extractFunction("ProfessionPhotos")).toContain("professionPhotosFor(profession, sex)[0]");
  });
});

describe("opportunities later slides", () => {
  it("keeps score ranking and transition destinations inside the same shell", () => {
    expect(source).toContain("OÃ¹ viser");
    expect(source).toContain("Ensuite");
    expect(source).toContain('id: "emplois"');
    expect(source).toContain("Voies dâ€™immigration");
  });
});

describe("opportunities prospect copy", () => {
  it("addresses opportunity talks to the prospect", () => {
    expect(source).toContain("Voici ce que le marchÃ© dit des mÃ©tiers du foyer, aujourdâ€™hui.");
    expect(source).toContain("OÃ¹ votre profil semble-t-il le plus intÃ©ressant ?");
    expect(source).toContain("Le marchÃ© est lÃ . Voyons la suite.");
    expect(source).toContain("Les postes, les salaires et les procÃ©dures qui correspondent Ã  votre profil.");
  });

  it("keeps coaching copy out of opportunity slides", () => {
    for (const name of ["OpportunitiesMarket", "OpportunitiesScore", "OpportunitiesNext"]) {
      const chunk = extractFunction(name);
      expect(chunk).not.toContain("Le commercial");
      expect(chunk).not.toContain("le prospect");
      expect(chunk).not.toContain("Prouver avant de vendre");
    }
  });

  it("branches work benefits away from visit and visitor-business files", () => {
    const chunk = extractFunction("OpportunitiesMarket");
    expect(chunk).toContain('profile.objective === "Visite"');
    expect(chunk).toContain('profile.objective === "Affaires"');
    expect(chunk).toContain('profile.businessPath === "visitor"');
    expect(chunk).toContain("Un visa visiteur autorise le sÃ©jour, pas un emploi.");
    expect(chunk).toContain("Pas dâ€™Ã©tudes sans permis dâ€™Ã©tudes.");
    expect(chunk).toContain("Le conjoint voyage comme visiteur, pas comme travailleur.");
    expect(chunk).toContain("Le projet doit Ãªtre crÃ©dible ici.");
    expect(chunk).toContain("<WorkBenefitsSection");
  });
});

describe("provinces catalog", () => {
  it("keeps two province slides", () => {
    expect(sections.find((section) => section.id === "provinces")?.slideCount).toBe(2);
  });

  it("uses a city pin instead of a folded map in the nav", () => {
    expect(sections.find((section) => section.id === "provinces")?.icon).toBe(MapPin);
  });
});

describe("provinces chrome", () => {
  it("reuses the profil client shell on ProvincesSection", () => {
    expect(source).toContain("export function ProvincesSection");
    expect(source).toContain("livingBasket");
    expect(source).toContain("Le salaire ne paie pas une moyenne. Il paie une ville.");
    expect(source).toContain("Logement, Ã©picerie, transport, services. Tout le foyer, pas un cÃ©libataire imaginaire.");
    expect(source).toContain("defaultProvinceCode");
    expect(source).toContain("La mÃªme vie ne coÃ»te pas le mÃªme prix.");
    expect(source).toContain("Trois villes maximum. Celle qui laisse un reste rend le projet possible.");
  });

  it("keeps coaching copy out of Provinces helpers", () => {
    for (const name of ["ProvincesSection", "ProvincesEstimator", "ProvincesCompare"]) {
      const chunk = extractFunction(name);
      expect(chunk).not.toContain("Le commercial");
      expect(chunk).not.toContain("version connectÃ©e");
      expect(chunk).not.toContain("panel=");
    }
  });
});

describe("provinces cost of living boards", () => {
  it("renders an estimator basket and a three-city comparator", () => {
    expect(source).toContain("Panier mensuel");
    expect(source).toContain("Net du foyer");
    expect(source).toContain("Reste estimatif");
    expect(source).toContain("Garde dâ€™enfants");
    expect(source).toContain("Choisissez jusquâ€™Ã  trois villes pour comparer.");
    expect(source).toContain("defaultCompareIds");
    expect(source).toContain("Estimation de dÃ©monstration.");
  });

  it("filters compare city chips by the selected province instead of dumping the national list", () => {
    const compare = extractFunction("ProvincesCompare");
    expect(compare).toContain("citiesForProvince");
    expect(compare).not.toMatch(/livingCities\.map/);
  });

  it("uses a photo banner on every market shell, like the cost-of-living page", () => {
    const shell = extractFunction("OpportunitiesShell");
    expect(source).toContain('from "@/data/section-banners"');
    expect(extractFunction("ProvincesEstimator")).toContain("hero={sectionBanners.provinces}");
    expect(extractFunction("ProvincesCompare")).toContain("hero={sectionBanners.provinces}");
    expect(extractFunction("OpportunitiesMarket")).toContain("hero={sectionBanners.opportunities}");
    expect(extractFunction("JobsToday")).toContain("hero={sectionBanners.jobs}");
    expect(extractFunction("SalariesBands")).toContain("hero={sectionBanners.salaries}");
    expect(extractFunction("CalculatorsNet")).toContain("hero={sectionBanners.calculators}");
    expect(shell).toMatch(/<img[\s\S]*src=\{hero\}/);
    expect(shell).not.toContain("IrShaderGradient");
    expect(shell).toContain("PageShell");
    expect(shell).not.toContain("xl:h-full");
  });
});

describe("jobs catalog", () => {
  it("keeps two employment slides", () => {
    expect(sections.find((section) => section.id === "emplois")?.slideCount).toBe(2);
  });
});

describe("jobs chrome", () => {
  it("reuses the profil client shell on JobsSection", () => {
    expect(source).toContain("export function JobsSection");
    expect(source).toContain("householdDemand");
    expect(source).toContain("Le marchÃ© cherche votre mÃ©tier. Voici oÃ¹.");
    expect(source).toContain("Le taux de demande par ville. Ã‡a, câ€™est la pression rÃ©elle, pas une liste dâ€™offres.");
    expect(source).toContain("Une part de cette demande se remplit depuis lâ€™Ã©tranger.");
  });

  it("reframes visit and family jobs copy around status first", () => {
    expect(source).toContain("pas un droit de travailler");
    expect(source).toContain("La rÃ©unification passe dâ€™abord.");
  });

  it("keeps coaching copy out of JobsSection and jobs chrome helpers", () => {
    const jobs = extractFunction("JobsSection");
    expect(jobs).not.toContain("Le commercial");
    expect(jobs).not.toContain("version connectÃ©e");

    for (const name of ["JobsToday", "JobsIntl"]) {
      const chunk = extractFunction(name);
      expect(chunk).not.toContain("Le commercial");
      expect(chunk).not.toContain("version connectÃ©e");
    }
  });
});

describe("jobs household boards", () => {
  it("renders demand charts and place filters per adult group", () => {
    expect(source).toContain("DemandBoard");
    expect(source).toContain("Taux de demande");
    expect(source).toContain("Toutes les provinces");
    expect(source).toContain("Toutes les villes");
    expect(extractFunction("JobsFilters")).toContain("Province");
    expect(extractFunction("JobsFilters")).toContain("Ville");
  });

  it("hides the briefing panel on both jobs slides", () => {
    expect(source).not.toContain("JobsBriefingPanel");
    expect(source).not.toContain("Ã€ retenir");
    for (const name of ["JobsToday", "JobsIntl"]) {
      const chunk = extractFunction(name);
      expect(chunk).not.toContain("panel=");
    }
  });

  it("lets demand cards grow with their city lists instead of clipping leftover viewport", () => {
    const board = extractFunction("DemandBoard");
    expect(board).not.toContain("min-h-0 flex-1");
    expect(board).not.toContain("flex-1");
    expect(board).toContain("@min-[48rem]:grid-cols-2");
    expect(board).toContain("@container");
    expect(board).toContain("@min-[24rem]:flex-row");
    expect(extractFunction("DemandBars")).toContain("minmax(0,1fr)");
  });
});

describe("salaries catalog", () => {
  it("keeps two salary slides", () => {
    expect(sections.find((section) => section.id === "salaires")?.slideCount).toBe(2);
  });
});

describe("salaries chrome", () => {
  it("reuses the profil client shell on SalariesSection", () => {
    expect(source).toContain("export function SalariesSection");
    expect(source).toContain("householdSalaries");
    expect(source).toContain('smart("Combien peut gagner un(e) {profession} ?", profile)');
    expect(source).toContain("Le mÃ©dian nâ€™est pas un salaire promis. Deux mÃ©tiers, deux fourchettes.");
    expect(source).toContain("Le mÃ©dian nâ€™est pas un salaire promis. Câ€™est le milieu du marchÃ©, ici.");
    expect(source).toContain("Le salaire brut ne raconte pas toute lâ€™histoire.");
    expect(source).toContain("Ce qui reste aprÃ¨s les retenues, câ€™est Ã§a qui paie le loyer.");
  });

  it("reframes visit and family salary copy around arrival and status", () => {
    expect(source).toContain("AprÃ¨s lâ€™arrivÃ©e");
    expect(source).toContain("pas un droit de travailler");
  });

  it("keeps coaching copy out of SalariesSection and salaries chrome helpers", () => {
    for (const name of ["SalariesSection", "SalariesBands", "SalariesNet"]) {
      const chunk = extractFunction(name);
      expect(chunk).not.toContain("Le commercial");
      expect(chunk).not.toContain("version connectÃ©e");
      expect(chunk).not.toContain("panel=");
    }
  });
});

describe("salaries household boards", () => {
  it("renders salary bands and net cards per adult group", () => {
    expect(source).toContain("SalariesBoard");
    expect(source).toContain("SalariesNetBoard");
    expect(source).toContain("Salaire brut mÃ©dian");
    expect(source).toContain("Net annuel estimatif");
    expect(source).toContain("Net mensuel");
    expect(source).toContain("Estimation de dÃ©monstration.");
  });

  it("reframes the salary guide for studies, internships and an accompanying spouse", () => {
    expect(source).toContain("Combien pouvez-vous gagner aprÃ¨s vos Ã©tudes ?");
    expect(source).toContain("Combien le foyer peut-il gagner pendant et aprÃ¨s les Ã©tudes ?");
    expect(source).toContain("AprÃ¨s les Ã©tudes");
    expect(source).toContain("Conjoint parrainÃ©");
    expect(source).toContain("Le conjoint parrainÃ© peut travailler pendant vos Ã©tudes.");
    expect(source).toContain("SalaryPhaseBands");
    expect(source).toContain("s.draft");
  });
});

describe("calculators catalog", () => {
  it("keeps three calculator slides between salaries and provinces", () => {
    const ids = sections.map((section) => section.id);
    expect(ids.indexOf("salaires") + 1).toBe(ids.indexOf("calculateurs"));
    expect(ids.indexOf("calculateurs") + 1).toBe(ids.indexOf("provinces"));
    expect(sections.find((section) => section.id === "calculateurs")?.slideCount).toBe(3);
    expect(sections.find((section) => section.id === "calculateurs")?.label).toBe("Calculateurs");
  });
});

describe("calculators chrome", () => {
  it("reuses the profil client shell on CalculatorsSection", () => {
    expect(source).toContain("export function CalculatorsSection");
    expect(source).toContain("householdLiving");
    expect(source).toContain("draftNet");
    expect(source).toContain("Combien reste-t-il rÃ©ellement aprÃ¨s les retenues ?");
    expect(source).toContain("Le brut impressionne. Le net paie le loyer. Deux mÃ©tiers, deux restes.");
    expect(source).toContain("Le brut impressionne. Le net, câ€™est Ã§a qui paie le loyer.");
    expect(source).toContain('smart("Que vaut ce salaire Ã  {province} ?", profile)');
    expect(source).toContain("Un salaire nâ€™existe pas tout seul. Il se mesure au loyer.");
    expect(source).toContain("Combien faut-il prÃ©parer pour dÃ©marrer ?");
    expect(source).toContain("Un projet Canada, ce nâ€™est pas seulement des honoraires.");
  });

  it("keeps coaching copy out of CalculatorsSection helpers", () => {
    for (const name of ["CalculatorsSection", "CalculatorsNet", "CalculatorsLiving", "CalculatorsBudget"]) {
      const chunk = extractFunction(name);
      expect(chunk).not.toContain("Le commercial");
      expect(chunk).not.toContain("version connectÃ©e");
      expect(chunk).not.toContain("panel=");
    }
  });

  it("uses objective-specific budget cards for work, visit, business and family files", () => {
    const chunk = extractFunction("CalculatorsBudget");
    expect(chunk).toContain("workCost(profile)");
    expect(chunk).toContain("visitCost(profile)");
    expect(chunk).toContain("businessCost(profile)");
    expect(chunk).toContain("familyCost(profile)");
    expect(chunk).toContain("Frais de permis");
    expect(chunk).toContain("Frais de visa");
    expect(chunk).toContain("Frais de voyage");
    expect(chunk).toContain("Investissement");
    expect(chunk).toContain("Frais de parrainage");
    expect(chunk).toContain("Revenu exigÃ© (MNI)");
    expect(chunk).toContain("Fonds jusquâ€™au 1er salaire");
    expect(chunk).toContain("Fonds Ã  dÃ©montrer");
  });
});

describe("closing deck pills wiring", () => {
  it("reuses a shared closingDeckPills helper across menu sections", () => {
    expect(source).toContain('from "@/lib/closing-pills"');
    expect(source).toContain("closingDeckPills(profile)");
    expect(source).toContain("ce que coÃ»te un mois sur place, pas une installation");
  });
});

describe("calculators household boards", () => {
  it("renders live net drafts, a shared living board, and project budget cards", () => {
    expect(source).toContain("Salaire annuel brut");
    expect(source).toContain("Net annuel estimatif");
    expect(source).toContain(" / mois");
    expect(source).toContain("Loyer indicatif");
    expect(source).toContain("Autres dÃ©penses estimÃ©es");
    expect(source).toContain("Reste estimatif");
    expect(source).toContain("Honoraires IR");
    expect(source).toContain("DÃ©marches & tests");
    expect(source).toContain("Fonds de sÃ©curitÃ©");
    expect(source).toContain("Ã€ estimer");
    expect(source).toContain("Ã€ prÃ©voir");
    expect(source).toContain("Math.min(profile.budget || 5000, 5000)");
    expect(source).toContain("ScolaritÃ© (annÃ©e 1)");
    expect(source).toContain("CoÃ»t de vie (annÃ©e 1)");
    expect(source).toContain("Preuve de fonds");
    expect(source).toContain("studyCost");
    expect(source).toContain("Le conjoint peut travailler pendant les Ã©tudes.");
  });
});


```

### src\features\immigration.tsx (1200 lines)
```ts
import {
  BadgeCheck,
  BookOpen,
  Briefcase,
  Check,
  ClipboardCheck,
  Clock,
  ExternalLink,
  FileCheck,
  FilePlus,
  FileText,
  GraduationCap,
  Languages,
  ListChecks,
  Mail,
  MapPin,
  Plane,
  Scale,
  School,
  Search,
  ShieldCheck,
  Target,
  UsersRound,
  Wallet,
  X,
  type LucideIcon,
} from "lucide-react";
import { familyLinks } from "@/data/family-links";
import { fastestRouteId, irccTimeFor, irccTimesMeta, type IrccTime } from "@/data/ircc-times";
import { routes, type ImmigrationRoute } from "@/data/routes";
import { startupVisaNote, startupVisaPaused, businessPaths } from "@/data/business-paths";
import { c11WorkingCapital, pnpEntrepreneur } from "@/data/business-thresholds";
import { professionNoc } from "@/data/profession-noc";
import { Profile, familyHasSpouse } from "@/data/profile";
import { provinceCode } from "@/data/provinces";
import { visitFeesFor } from "@/data/visit-fees";
import { visitPurposeById, visitPurposes } from "@/data/visit-purposes";
import { workPermits, workPermitById } from "@/data/work-permits";
import { NocSearchField } from "@/features/noc-search-field";
import { sectionBanners } from "@/data/section-banners";
import { OpportunitiesShell, SectionLabel, Surface } from "@/features/market";
import { businessCost } from "@/lib/business-cost";
import { closingDeckPills } from "@/lib/closing-pills";
import { COMPARE_LIMIT } from "@/lib/compare-select";
import { familyCost } from "@/lib/family-cost";
import { money } from "@/lib/format";
import { householdMarket } from "@/lib/household-market";
import { workPathways } from "@/lib/work-pathways";
import { recommendedScenarioId, routeById, routeForObjective } from "@/lib/route-paths";
import { studyCost } from "@/lib/study-cost";
import { studyDeckPills, studyProgramFor } from "@/lib/study-program";
import { cn } from "@/lib/utils";
import { smart } from "@/lib/smart-copy";
import { visitCost } from "@/lib/visit-cost";
import { workCost } from "@/lib/work-cost";
import { useDeckStore } from "@/store/deck";
import { useProfileStore } from "@/store/profile";

export function RoutesSection() {
  const slide = useDeckStore((s) => s.slideIndex);
  const profile = useProfileStore((s) => s.draft);
  const market = householdMarket(profile);
  const selectedRoute = useDeckStore((s) => s.selectedRoute);
  const setRoute = useDeckStore((s) => s.setRoute);
  const aligned = routeForObjective(profile.objective);
  const route = routeById(selectedRoute);
  if (slide === 1) {
    return <RoutesDetail market={market} route={route} profile={profile} />;
  }
  return (
    <RoutesOverview
      market={market}
      profile={profile}
      selectedId={route.id}
      alignedId={aligned.id}
      onSelect={setRoute}
    />
  );
}

function RoutesOverview({
  market,
  profile,
  selectedId,
  alignedId,
  onSelect,
}: {
  market: ReturnType<typeof householdMarket>;
  profile: Profile;
  selectedId: string;
  alignedId: string;
  onSelect: (id: string) => void;
}) {
  return (
    <OpportunitiesShell
      kicker="Voies dâ€™immigration"
      title="Une destination. Plusieurs chemins."
      lead="Le chemin dÃ©pend du foyer et de lâ€™objectif, pas dâ€™une brochure."
      pills={[market.family, market.province, profile.objective, ...studyDeckPills(profile).filter((pill) => pill !== profile.objective)]}
      hero={sectionBanners.routes}
    >
      <div className="ir-auto-grid">
        {routes.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => onSelect(item.id)}
            className={cn(
              "rounded-[14px] border bg-white p-4 text-left transition-shadow",
              item.id === selectedId
                ? "border-primary shadow-[0_8px_20px_rgba(11,57,121,.08)]"
                : "border-border hover:border-[#9dbbe0]",
            )}
          >
            <span className="flex items-center justify-between gap-2">
              <span className="text-[9px] font-extrabold text-primary uppercase">{item.tag}</span>
              {item.id === alignedId ? (
                <span className="rounded-full bg-secondary px-2 py-0.5 text-[9px] font-semibold text-primary">
                  Objectif
                </span>
              ) : null}
            </span>
            <strong className="mt-1.5 block text-base">{item.name}</strong>
            <small className="mt-1.5 block text-[#788291]">{item.fit}</small>
            <DelayChip time={irccTimeFor(item.id)} />
          </button>
        ))}
      </div>
    </OpportunitiesShell>
  );
}

function RoutesDetail({
  market,
  route,
  profile,
}: {
  market: ReturnType<typeof householdMarket>;
  route: ReturnType<typeof routeById>;
  profile: Profile;
}) {
  const study = route.id === "study";
  const cost = study ? studyCost(profile) : undefined;
  const program = study ? studyProgramFor(profile) : undefined;
  const work = route.id === "work" ? workCost(profile) : undefined;
  const visit = route.id === "visit" ? visitCost(profile) : undefined;
  const business = route.id === "business" ? businessCost(profile) : undefined;
  const family = route.id === "family" ? familyCost(profile) : undefined;
  const pathways = route.id === "work" ? workPathways(profile) : undefined;
  return (
    <OpportunitiesShell
      kicker="Voies Â· DÃ©tail"
      title={route.name}
      lead={`Pour qui : ${route.fit}.`}
      pills={[market.family, route.tag, ...studyDeckPills(profile), ...closingDeckPills(profile)]}
      hero={sectionBanners.routes}
    >
      <DelayBanner time={irccTimeFor(route.id)} />
      {cost ? <StudyClosingCards cost={cost} programName={program?.name} /> : null}
      {work ? <WorkClosingCards cost={work} pathways={pathways ?? work.pathways} profile={profile} /> : null}
      {visit ? <VisitClosingCards cost={visit} profile={profile} /> : null}
      {business ? <BusinessClosingCards cost={business} profile={profile} /> : null}
      {family ? <FamilyClosingCards cost={family} profile={profile} /> : null}
      <div className="grid min-h-0 items-stretch gap-3 lg:grid-cols-2">
        <Surface className="h-full p-4">
          <SectionLabel>Conditions</SectionLabel>
          <ul className="mt-2 space-y-1 text-[13px] leading-6 text-[#3d4b5c]">
            {route.conditions.map((item) => (
              <li key={item}>Â· {item}</li>
            ))}
          </ul>
        </Surface>
        <Surface className="h-full p-4">
          <SectionLabel>Points positifs</SectionLabel>
          <ul className="mt-2 space-y-1 text-[13px] leading-6 text-[#295f43]">
            {route.positives.map((item) => (
              <li key={item}>âœ“ {item}</li>
            ))}
          </ul>
        </Surface>
      </div>
      <Surface className="w-full p-4">
        <SectionLabel>Points dâ€™attention</SectionLabel>
        <ul className="mt-2 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {route.attention.map((item) => (
            <li key={item} className="rounded-xl bg-[#fff6e8] px-3 py-2.5 text-[13px] leading-6 text-[#8c5a1d]">
              âš  {item}
            </li>
          ))}
        </ul>
      </Surface>
      <Surface className="w-full p-4">
        <SectionLabel>Ã‰tapes</SectionLabel>
        <div className="mt-4">
          <RouteSteps steps={route.steps} />
        </div>
      </Surface>
      <p className="text-[12px] text-muted-foreground">AperÃ§u de dÃ©monstration. Pas un avis juridique.</p>
    </OpportunitiesShell>
  );
}

const thresholdProvinceLabels: Record<keyof typeof c11WorkingCapital, string> = {
  QC: "QuÃ©bec",
  ON: "Ontario",
  AB: "Alberta",
  MB: "Manitoba",
  NB: "Nouveau-Brunswick",
  BC: "Colombie-Britannique",
  SK: "Saskatchewan",
  NS: "Nouvelle-Ã‰cosse",
  PE: "ÃŽle-du-Prince-Ã‰douard",
  NL: "Terre-Neuve-et-Labrador",
  YT: "Yukon",
  NT: "Territoires du Nord-Ouest",
  NU: "Nunavut",
};

function StudyClosingCards({
  cost,
  programName,
}: {
  cost: ReturnType<typeof studyCost>;
  programName?: string;
}) {
  const tuitionValue = programName
    ? money(cost.tuition)
    : `${money(cost.tuitionLow)} â€“ ${money(cost.tuitionHigh)}`;
  return (
    <>
      <Surface className="flex min-h-0 flex-col p-4">
        <SectionLabel>Tarifs dâ€™Ã©tudes internationaux Â· par annÃ©e</SectionLabel>
        {programName ? (
          <p className="mt-1.5 text-[13px] leading-snug text-[#1a2332]">
            <strong>{programName}</strong>
            {cost.programLevel ? ` Â· ${cost.programLevel}` : ""} Â· {money(cost.tuition)} / an
          </p>
        ) : null}
        <div className="mt-3 max-h-[min(42vh,22rem)] overflow-y-auto rounded-xl border border-[#d7e4f3]">
          <table className="w-full text-left text-[12px]">
            <thead className="sticky top-0 bg-secondary text-[10px] font-semibold tracking-wide text-primary uppercase">
              <tr>
                <th className="px-3 py-2">Province / territoire</th>
                <th className="px-3 py-2 text-right">CÃ©gep</th>
                <th className="px-3 py-2 text-right">UniversitÃ©</th>
              </tr>
            </thead>
            <tbody>
              {cost.grid.map((row) => (
                <tr
                  key={row.code}
                  className={cn(
                    "border-t border-[#e5eaf0]",
                    row.selected && "bg-[#eef5ff] font-semibold text-primary",
                  )}
                >
                  <td className="px-3 py-1.5">{row.name}</td>
                  <td className="px-3 py-1.5 text-right tabular-nums">{money(row.cegep)}</td>
                  <td className="px-3 py-1.5 text-right tabular-nums">{money(row.university)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Surface>
      <div className={cn("grid min-h-0 gap-3", cost.spouse ? "lg:grid-cols-3" : "lg:grid-cols-2")}>
        <Surface className="p-4">
          <SectionLabel>AnnÃ©e 1 Â· Foyer</SectionLabel>
          <dl className="mt-2 space-y-2 text-[13px]">
            <FactLine label="CoÃ»t de vie annuel" value={money(cost.livingAnnual)} />
            <FactLine label={`Fonds de subsistance ${cost.fundsLabel}`} value={money(cost.subsistence)} />
            <FactLine label="ScolaritÃ© annÃ©e 1" value={tuitionValue} />
            <FactLine label="Preuve de fonds" value={money(cost.proofOfFunds)} featured />
          </dl>
          <p className="mt-3 rounded-xl bg-secondary px-3 py-2 text-[12px] leading-relaxed text-[#1a2332]">
            {cost.fundsLabel} demande {money(cost.subsistence)} Â· vivre coÃ»te {money(cost.livingAnnual)}
          </p>
        </Surface>
        <Surface className="p-4">
          <SectionLabel>{programName ? "AprÃ¨s le diplÃ´me Â· Programme" : "AprÃ¨s le diplÃ´me Â· MÃ©tier"}</SectionLabel>
          <p className="mt-1.5">
            <span className="rounded-full bg-secondary px-2 py-0.5 text-[11px] font-semibold text-primary">
              {cost.student.profession}
            </span>
          </p>
          <div className="mt-3 grid grid-cols-3 gap-2">
            <BandMini label="Bas" value={money(cost.student.low)} />
            <BandMini label="MÃ©dian" value={money(cost.student.mid)} featured />
            <BandMini label="Ã‰levÃ©" value={money(cost.student.high)} />
          </div>
          <dl className="mt-3 space-y-2 text-[13px]">
            <FactLine label="RÃ©munÃ©ration de stage" value={money(cost.student.internshipMid)} />
            <FactLine
              label="EmployabilitÃ©"
              value={`${cost.student.employability} % Â· ${cost.student.employabilityLabel}`}
            />
          </dl>
        </Surface>
        {cost.spouse ? (
          <Surface className="p-4">
            <SectionLabel>Pendant les Ã©tudes Â· Conjoint parrainÃ©</SectionLabel>
            <p className="mt-1.5">
              <span className="rounded-full bg-secondary px-2 py-0.5 text-[11px] font-semibold text-primary">
                {cost.spouse.profession}
              </span>
            </p>
            <div className="mt-3 grid grid-cols-3 gap-2">
              <BandMini label="Bas" value={money(cost.spouse.low)} />
              <BandMini label="MÃ©dian" value={money(cost.spouse.mid)} featured />
              <BandMini label="Ã‰levÃ©" value={money(cost.spouse.high)} />
            </div>
            <dl className="mt-3 space-y-2 text-[13px]">
              <FactLine
                label="EmployabilitÃ©"
                value={`${cost.spouse.employability} % Â· ${cost.spouse.employabilityLabel}`}
              />
            </dl>
            <p className="mt-3 rounded-xl bg-secondary px-3 py-2 text-[12px] leading-relaxed text-[#1a2332]">
              Permis de travail ouvert pendant les Ã©tudes du candidat.
            </p>
          </Surface>
        ) : null}
      </div>
    </>
  );
}

function WorkClosingCards({
  cost,
  pathways,
  profile,
}: {
  cost: ReturnType<typeof workCost>;
  pathways: ReturnType<typeof workPathways>;
  profile: Profile;
}) {
  const setProject = useProfileStore((s) => s.setProject);
  const selectedPermit = workPermitById(profile.workPermitKind);
  const monthlyNet = Math.round(cost.salary.net / 12);
  return (
    <>
      <Surface className="p-4">
        <SectionLabel>Barre FEER</SectionLabel>
        <div className="mt-2">
          <NocSearchField
            value={profile.workNocCode}
            onChange={(code) => setProject("workNocCode", code)}
            suggestionCode={professionNoc(profile.applicant.profession)}
          />
        </div>
        {pathways.noc && pathways.title && pathways.teer !== null ? (
          <div className="mt-3 rounded-xl bg-secondary px-3 py-2.5 text-[12px] leading-relaxed text-[#1a2332]">
            <p className="font-semibold">{`CNP ${pathways.noc} Â· FEER ${pathways.teer} Â· ${pathways.title}`}</p>
            <p className="mt-1">{pathways.feerLegend}</p>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <span>VÃ©rifiez sur IRCC.</span>
              <a
                href={pathways.sources.noc}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 font-semibold text-primary hover:underline"
              >
                Trouver votre CNP
                <ExternalLink className="size-3.5" strokeWidth={2} />
              </a>
            </div>
          </div>
        ) : null}
      </Surface>
      <div className={cn("grid min-h-0 gap-3", cost.spouse ? "lg:grid-cols-3" : "lg:grid-cols-2")}>
        <Surface className="p-4">
          <SectionLabel>Permis Â· Ouvert ou fermÃ©</SectionLabel>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {workPermits.map((permit) => {
              const outcome = pathways.permits.find((item) => item.kind === permit.id);
              return (
                <span
                  key={permit.id}
                  className={cn(
                    "rounded-full px-2.5 py-1 text-[11px] font-medium",
                    outcome?.possible ? "bg-secondary text-primary" : "bg-[#eef2f6] text-[#7a8594]",
                  )}
                  title={outcome?.reason}
                >
                  {permit.name}
                </span>
              );
            })}
          </div>
          <dl className="mt-3 space-y-2 text-[13px]">
            <FactLine
              label="Offre requise"
              value={
                selectedPermit
                  ? selectedPermit.needsOffer
                    ? profile.workHasOffer
                      ? "Oui, cochÃ©e"
                      : "Oui, Ã  obtenir"
                    : "Non"
                  : "Selon le volet"
              }
            />
            <FactLine label="Traitement" value={money(cost.fees.permit)} />
            <FactLine
              label="+100 $ dÃ©tenteur ouvert"
              value={cost.fees.openHolder > 0 ? money(cost.fees.openHolder) : "Non"}
            />
            <FactLine label="BiomÃ©trie" value={money(cost.fees.biometrics)} />
          </dl>
          <p className="mt-3 rounded-xl bg-secondary px-3 py-2 text-[12px] leading-relaxed text-[#1a2332]">
            {selectedPermit
              ? pathways.permits.find((item) => item.kind === selectedPermit.id)?.reason
              : "Choisissez un type de permis"}
          </p>
        </Surface>
        <Surface className="p-4">
          <SectionLabel>Renouvellement</SectionLabel>
          <dl className="mt-2 space-y-2 text-[13px]">
            <FactLine label="Quand dÃ©poser" value="Avant lâ€™Ã©chÃ©ance, statut conservÃ©" />
            <FactLine
              label="Ce qui reste permis en attendant"
              value={pathways.renewal.openCanChangeEmployer ? "Ouvert/IEC = changement dâ€™employeur possible" : "FermÃ© = mÃªmes conditions"}
            />
            <FactLine label="Frais" value={money(pathways.renewal.fees.total)} />
          </dl>
          <p className="mt-3 rounded-xl bg-secondary px-3 py-2 text-[12px] leading-relaxed text-[#1a2332]">
            Voir sur IRCC pour les conditions de prolongation.
          </p>
        </Surface>
        <Surface className="p-4">
          <SectionLabel>Vers la RP Â· AprÃ¨s une pÃ©riode</SectionLabel>
          <dl className="mt-2 space-y-2 text-[13px]">
            <FactLine label="CEC" value={pathways.prAfter.label} />
            <FactLine label="Invitation" value="Jamais garantie" />
          </dl>
          <a
            href={pathways.sources.cec}
            target="_blank"
            rel="noreferrer"
            className="mt-3 inline-flex items-center gap-1 text-[12px] font-semibold text-primary hover:underline"
          >
            Voir sur IRCC
            <ExternalLink className="size-3.5" strokeWidth={2} />
          </a>
        </Surface>
        <Surface className="p-4">
          <SectionLabel>AnnÃ©e 1 Â· Foyer</SectionLabel>
          <dl className="mt-2 space-y-2 text-[13px]">
            <FactLine label="Salaire net mensuel approx" value={money(monthlyNet)} />
            <FactLine label="Panier annuel" value={money(cost.livingAnnual)} />
            <FactLine label="Fonds 3 mois" value={money(cost.settlementFunds)} />
            <FactLine label="Frais" value={money(cost.fees.total)} />
            <FactLine label="Ã‰cart mensuel" value={money(cost.gapMonthly)} />
          </dl>
          <p className="mt-3 rounded-xl bg-secondary px-3 py-2 text-[12px] leading-relaxed text-[#1a2332]">
            {`le mÃ©tier paie ${money(monthlyNet)} Â· vivre coÃ»te ${money(Math.round(cost.livingAnnual / 12))}`}
          </p>
        </Surface>
        {cost.spouse ? (
          <Surface className="p-4">
            <SectionLabel>Pendant le permis Â· Conjoint</SectionLabel>
            <p className="mt-1.5">
              <span className="rounded-full bg-secondary px-2 py-0.5 text-[11px] font-semibold text-primary">
                {cost.spouse.profession}
              </span>
            </p>
            <div className="mt-3 grid grid-cols-3 gap-2">
              <BandMini label="Bas" value={money(cost.spouse.low)} />
              <BandMini label="MÃ©dian" value={money(cost.spouse.mid)} featured />
              <BandMini label="Ã‰levÃ©" value={money(cost.spouse.high)} />
            </div>
            <p className="mt-3 rounded-xl bg-secondary px-3 py-2 text-[12px] leading-relaxed text-[#1a2332]">
              {pathways.spouseOpen?.reason}
            </p>
          </Surface>
        ) : familyHasSpouse(profile.family) && pathways.spouseOpen && !pathways.spouseOpen.eligible ? (
          <Surface className="p-4">
            <SectionLabel>Pendant le permis Â· Conjoint</SectionLabel>
            <p className="mt-3 rounded-xl bg-[#fff6e8] px-3 py-2 text-[12px] leading-relaxed text-[#8c5a1d]">
              {pathways.spouseOpen.reason}
            </p>
          </Surface>
        ) : null}
      </div>
    </>
  );
}

function VisitClosingCards({
  cost,
  profile,
}: {
  cost: ReturnType<typeof visitCost>;
  profile: Profile;
}) {
  const people = cost.accompanying ? cost.accompanying.adults + cost.accompanying.kids : 1;
  const fees = visitFeesFor(profile.country, people);
  const purpose = visitPurposeById(cost.purpose);
  const durationLabel = {
    "15d": "15 jours",
    "1m": "1 mois",
    "3m": "3 mois",
    "6m": "6 mois",
  }[cost.duration];
  return (
    <div className={cn("grid min-h-0 gap-3", cost.accompanying ? "lg:grid-cols-2" : "lg:grid-cols-3")}>
      <Surface className="p-4">
        <SectionLabel>Frais de voyage Â· Visa / eTA / biomÃ©trie</SectionLabel>
        <dl className="mt-2 space-y-2 text-[13px]">
          <FactLine label="Visa visiteur" value={fees.documentType === "visa" ? money(fees.documentTotal) : "Non"} />
          <FactLine label="eTA" value={fees.documentType === "eta" ? money(fees.documentTotal) : "Non"} />
          <FactLine label="BiomÃ©trie" value={money(fees.biometricsTotal)} />
        </dl>
        <p className="mt-3 rounded-xl bg-secondary px-3 py-2 text-[12px] leading-relaxed text-[#1a2332]">
          {`${profile.country} Â· document ${fees.documentType === "eta" ? "eTA" : "visa"}`}
        </p>
      </Surface>
      <Surface className="p-4">
        <SectionLabel>SÃ©jour Â· Foyer</SectionLabel>
        <dl className="mt-2 space-y-2 text-[13px]">
          <FactLine label="DurÃ©e" value={cost.assumedDuration ? `${durationLabel} Â· aperÃ§u` : durationLabel} />
          <FactLine label="CoÃ»t du sÃ©jour" value={money(cost.stayCost)} />
          <FactLine label="Fonds Ã  dÃ©montrer" value={money(cost.fundsRequired)} />
          <FactLine label="Frais de demande foyer" value={money(cost.feesTotal)} />
          <FactLine label="Aller-retour" value={money(cost.ticketsDemo)} />
        </dl>
        <p className="mt-3 rounded-xl bg-secondary px-3 py-2 text-[12px] leading-relaxed text-[#1a2332]">
          {`IRCC nâ€™a pas de grille unique Â· un sÃ©jour de cette durÃ©e coÃ»te environ ${money(cost.stayCost)}`}
        </p>
      </Surface>
      <Surface className="p-4">
        <SectionLabel>Motif et attaches</SectionLabel>
        {cost.assumedPurpose ? (
          <ul className="mt-2 space-y-1 text-[13px] leading-6 text-[#1a2332]">
            {visitPurposes.map((item) => (
              <li key={item.id}>Â· {item.name}</li>
            ))}
          </ul>
        ) : (
          <p className="mt-2 text-[13px] font-semibold text-[#1a2332]">{purpose?.name}</p>
        )}
        <ul className="mt-3 space-y-1 text-[13px] leading-6 text-[#3d4b5c]">
          {(purpose?.ties ?? []).map((item) => (
            <li key={item}>Â· {item}</li>
          ))}
          {cost.purpose === "family" ? <li>Â· invitation / hÃ´te utile</li> : null}
        </ul>
        <p className="mt-3 rounded-xl bg-secondary px-3 py-2 text-[12px] leading-relaxed text-[#1a2332]">
          {cost.canWork ? "travail possible" : "un visa visiteur nâ€™autorise pas Ã  travailler ni Ã  Ã©tudier"}
        </p>
      </Surface>
      {cost.accompanying ? (
        <Surface className="p-4">
          <SectionLabel>Accompagnants</SectionLabel>
          <dl className="mt-2 space-y-2 text-[13px]">
            <FactLine label="Adultes" value={String(cost.accompanying.adults)} />
            <FactLine label="Enfants" value={String(cost.accompanying.kids)} />
            <FactLine label="Statut" value="Visiteur" />
          </dl>
          <p className="mt-3 rounded-xl bg-secondary px-3 py-2 text-[12px] leading-relaxed text-[#1a2332]">
            Pas de permis de travail, pas dâ€™Ã©cole sans permis dâ€™Ã©tudes.
          </p>
        </Surface>
      ) : null}
    </div>
  );
}

function BusinessClosingCards({
  cost,
  profile,
}: {
  cost: ReturnType<typeof businessCost>;
  profile: Profile;
}) {
  const selectedCode = provinceCode(profile.province) as keyof typeof c11WorkingCapital;
  return (
    <div className={cn("grid min-h-0 gap-3", familyHasSpouse(profile.family) ? "lg:grid-cols-2" : "lg:grid-cols-3")}>
      <Surface className="flex min-h-0 flex-col p-4 lg:col-span-2">
        <SectionLabel>Volets Â· Seuils dâ€™investissement</SectionLabel>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {businessPaths.map((path) => (
            <span
              key={path.id}
              className={cn(
                "rounded-full px-2.5 py-1 text-[11px] font-medium",
                profile.businessPath === path.id ? "bg-secondary text-primary" : "bg-white text-[#1a2332] ring-1 ring-border",
              )}
            >
              {path.name}
            </span>
          ))}
          {startupVisaPaused ? (
            <span className="rounded-full bg-[#fff6e8] px-2.5 py-1 text-[11px] font-medium text-[#8c5a1d]">
              pause IRCC, pas de nouvelles demandes
            </span>
          ) : null}
        </div>
        <p className="mt-2 text-[12px] text-muted-foreground">{startupVisaNote}</p>
        {/* 13 provinces/territories */}
        <div className="mt-3 max-h-[min(42vh,22rem)] overflow-y-auto rounded-xl border border-[#d7e4f3]">
          <table className="w-full text-left text-[12px]">
            <thead className="sticky top-0 bg-secondary text-[10px] font-semibold tracking-wide text-primary uppercase">
              <tr>
                <th className="px-3 py-2">Province</th>
                <th className="px-3 py-2 text-right">C11 / fonds de roulement</th>
                <th className="px-3 py-2 text-right">Entrepreneur provincial</th>
              </tr>
            </thead>
            <tbody>
              {(Object.keys(c11WorkingCapital) as Array<keyof typeof c11WorkingCapital>).map((code) => (
                <tr
                  key={code}
                  className={cn("border-t border-[#e5eaf0]", code === selectedCode && "bg-[#eef5ff] font-semibold text-primary")}
                >
                  <td className="px-3 py-1.5">{thresholdProvinceLabels[code]}</td>
                  <td className="px-3 py-1.5 text-right tabular-nums">{money(c11WorkingCapital[code])}</td>
                  <td className="px-3 py-1.5 text-right tabular-nums">{money(pnpEntrepreneur[code])}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {cost.path ? (
          <p className="mt-3 rounded-xl bg-secondary px-3 py-2 text-[12px] leading-relaxed text-[#1a2332]">
            {cost.path.needsInvestment
              ? `${cost.path.name} Â· seuil ${money(cost.investment)}`
              : `${cost.path.name} Â· pas un seuil dâ€™investissement`}
          </p>
        ) : null}
      </Surface>
      <Surface className="p-4">
        <SectionLabel>AnnÃ©e 1 Â· Capital</SectionLabel>
        <dl className="mt-2 space-y-2 text-[13px]">
          <FactLine label="Investissement" value={cost.investment > 0 ? money(cost.investment) : "Selon le volet"} />
          <FactLine label="Vie annuelle" value={cost.livingAnnual > 0 ? money(cost.livingAnnual) : "Non"} />
          <FactLine label="SÃ©jour court" value={cost.stayShort > 0 ? money(cost.stayShort) : "Non"} />
          <FactLine label="Fonds personnels" value={money(cost.personalFunds)} />
          <FactLine label="Capital Ã  dÃ©montrer" value={money(cost.capitalToShow)} featured />
        </dl>
        <p className="mt-3 rounded-xl bg-secondary px-3 py-2 text-[12px] leading-relaxed text-[#1a2332]">
          {`le volet demande ${money(cost.capitalToShow)} Â· la capacitÃ© affichÃ©e est ${money(cost.personalFunds)}`}
        </p>
      </Surface>
      <Surface className="p-4">
        <SectionLabel>Projet Â· CrÃ©dibilitÃ©</SectionLabel>
        <dl className="mt-2 space-y-2 text-[13px]">
          <FactLine label="ExpÃ©rience" value={`${profile.applicant.experience} ans`} />
          <FactLine label="CapacitÃ©" value={`${profile.applicant.salary} Â· ${money(cost.personalFunds)}`} />
          <FactLine label="Province / volet" value={`${profile.province} Â· ${cost.path?.name ?? "Ã€ choisir"}`} />
        </dl>
        {cost.path ? (
          <p className="mt-3 rounded-xl bg-secondary px-3 py-2 text-[12px] leading-relaxed text-[#1a2332]">
            {cost.path.caution}
          </p>
        ) : null}
      </Surface>
      {familyHasSpouse(profile.family) ? (
        <Surface className="p-4">
          <SectionLabel>Pendant le projet Â· Conjoint</SectionLabel>
          <p className="mt-3 rounded-xl bg-secondary px-3 py-2 text-[12px] leading-relaxed text-[#1a2332]">
            {cost.spouseOpen
              ? `${profile.spouse.profession} Â· permis ouvert possible selon le volet`
              : "Visite, pas un permis de travail"}
          </p>
        </Surface>
      ) : null}
    </div>
  );
}

function FamilyClosingCards({
  cost,
  profile,
}: {
  cost: ReturnType<typeof familyCost>;
  profile: Profile;
}) {
  const child = profile.children[0];
  const isQuebec = provinceCode(profile.province) === "QC";
  return (
    <div className="grid min-h-0 gap-3 lg:grid-cols-2">
      <Surface className="p-4">
        <SectionLabel>Liens admissibles Â· DÃ©lais</SectionLabel>
        <div className="mt-3 overflow-hidden rounded-xl border border-[#d7e4f3]">
          <table className="w-full text-left text-[12px]">
            <thead className="bg-secondary text-[10px] font-semibold tracking-wide text-primary uppercase">
              <tr>
                <th className="px-3 py-2">Lien</th>
                <th className="px-3 py-2 text-right">Engagement</th>
                <th className="px-3 py-2 text-right">Hors QuÃ©bec</th>
                <th className="px-3 py-2 text-right">QuÃ©bec</th>
              </tr>
            </thead>
            <tbody>
              {familyLinks.map((link) => (
                <tr
                  key={link.id}
                  className={cn("border-t border-[#e5eaf0]", cost.link?.id === link.id && "bg-[#eef5ff] font-semibold text-primary")}
                >
                  <td className="px-3 py-1.5">
                    {link.id === "spouse" ? "Conjoint / partenaire" : link.id === "child" ? "Enfant Ã  charge" : "Parent / grand-parent"}
                  </td>
                  <td className="px-3 py-1.5 text-right">{`${link.undertakingYears} ans`}</td>
                  {(() => {
                    const horsQc = cost.delay.tracks?.find((t) => t.label === "Hors QuÃ©bec")?.value ?? cost.delay.headline ?? "";
                    const qc = cost.delay.tracks?.find((t) => t.label === "QuÃ©bec")?.value ?? cost.delay.headline ?? "";
                    return (
                      <>
                        <td className="px-3 py-1.5 text-right">{horsQc}</td>
                        <td className="px-3 py-1.5 text-right">{qc}</td>
                      </>
                    );
                  })()}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {cost.sponsorStatus === "pr" ? (
            <span className="rounded-full bg-secondary px-2.5 py-1 text-[11px] font-medium text-primary">
              RÃ©sident permanent
            </span>
          ) : null}
          {cost.sponsorStatus === "citizen" ? (
            <span className="rounded-full bg-secondary px-2.5 py-1 text-[11px] font-medium text-primary">Citoyen</span>
          ) : null}
          {cost.link?.id === "parent" ? (
            <span className="rounded-full bg-[#fff6e8] px-2.5 py-1 text-[11px] font-medium text-[#8c5a1d]">
              super visa possible en parallÃ¨le
            </span>
          ) : null}
        </div>
      </Surface>
      <Surface className="p-4">
        <SectionLabel>Engagement Â· Revenu</SectionLabel>
        <dl className="mt-2 space-y-2 text-[13px]">
          <FactLine label="Taille" value={String(cost.familySize)} />
          <FactLine label="Revenu exigÃ©" value={money(cost.incomeRequired)} />
          <FactLine label="Revenu approx rÃ©pondant" value={money(cost.sponsorMid)} />
          {cost.undertakingYears ? <FactLine label="DurÃ©e" value={`${cost.undertakingYears} ans`} /> : null}
        </dl>
        <p className="mt-3 rounded-xl bg-secondary px-3 py-2 text-[12px] leading-relaxed text-[#1a2332]">
          {`le seuil demande ${money(cost.incomeRequired)} Â· le mÃ©tier paie ${money(cost.sponsorMid)}`}
        </p>
      </Surface>
      <Surface className="p-4">
        <SectionLabel>Frais et vie Â· Foyer rÃ©uni</SectionLabel>
        <dl className="mt-2 space-y-2 text-[13px]">
          <FactLine label="Frais" value={money(cost.feesTotal)} />
          <FactLine label="CoÃ»t de vie annuel rÃ©uni" value={money(cost.livingReunitedAnnual)} />
        </dl>
        {isQuebec ? (
          <p className="mt-3 rounded-xl bg-secondary px-3 py-2 text-[12px] leading-relaxed text-[#1a2332]">
            DÃ©lai plus long au QuÃ©bec et frais MIFI inclus dans cet ordre de grandeur.
          </p>
        ) : null}
      </Surface>
      <Surface className="p-4">
        <SectionLabel>Personne parrainÃ©e</SectionLabel>
        {cost.link?.id === "spouse" && cost.sponsored ? (
          <>
            <p className="mt-1.5">
              <span className="rounded-full bg-secondary px-2 py-0.5 text-[11px] font-semibold text-primary">
                {cost.sponsored.profession}
              </span>
            </p>
            <div className="mt-3 grid grid-cols-3 gap-2">
              <BandMini label="Bas" value={money(cost.sponsored.low)} />
              <BandMini label="MÃ©dian" value={money(cost.sponsored.mid)} featured />
              <BandMini label="Ã‰levÃ©" value={money(cost.sponsored.high)} />
            </div>
            <p className="mt-3 rounded-xl bg-secondary px-3 py-2 text-[12px] leading-relaxed text-[#1a2332]">
              {`EmployabilitÃ© ${cost.sponsored.employability} % Â· ${cost.sponsored.employabilityLabel} Â· aprÃ¨s lâ€™arrivÃ©e : RP, droit de travailler`}
            </p>
          </>
        ) : null}
        {cost.reminder ? (
          <p className="mt-3 rounded-xl bg-secondary px-3 py-2 text-[12px] leading-relaxed text-[#1a2332]">
            {cost.reminder ? "Ajoutez le conjoint au dossier pour afficher ses repÃ¨res." : ""}
          </p>
        ) : null}
        {cost.link?.id === "child" ? (
          <p className="mt-3 rounded-xl bg-secondary px-3 py-2 text-[12px] leading-relaxed text-[#1a2332]">
            {child
              ? child.age < 18
                ? `${child.firstName || "Enfant"} Â· ${child.age} ans Â· Ã©cole aprÃ¨s lâ€™arrivÃ©e`
                : `${child.firstName || "Enfant"} Â· ${child.age} ans`
              : "Ajoutez un enfant pour afficher son repÃ¨re dâ€™arrivÃ©e."}
          </p>
        ) : null}
        {cost.link?.id === "parent" ? (
          <p className="mt-3 rounded-xl bg-secondary px-3 py-2 text-[12px] leading-relaxed text-[#1a2332]">
            Super visa vs parrainage, sans salaire projetÃ©, avec engagement long.
          </p>
        ) : null}
        {!cost.link ? (
          <p className="mt-3 rounded-xl bg-secondary px-3 py-2 text-[12px] leading-relaxed text-[#1a2332]">
            Choisissez un lien admissible pour afficher la personne parrainÃ©e.
          </p>
        ) : null}
      </Surface>
    </div>
  );
}

function FactLine({
  label,
  value,
  featured,
}: {
  label: string;
  value: string;
  featured?: boolean;
}) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className={cn("font-semibold tabular-nums", featured ? "text-primary" : "text-[#1a2332]")}>{value}</dd>
    </div>
  );
}

function BandMini({
  label,
  value,
  featured,
}: {
  label: string;
  value: string;
  featured?: boolean;
}) {
  return (
    <div className={cn("rounded-[10px] border px-2 py-2 text-center", featured ? "border-primary bg-secondary" : "border-border bg-white")}>
      <span className="block text-[10px] uppercase text-muted-foreground">{label}</span>
      <strong className="mt-0.5 block text-[13px] tabular-nums">{value}</strong>
    </div>
  );
}

function RouteSteps({ steps }: { steps: string[] }) {
  return (
    <ol
      className="relative grid w-full grid-cols-2 gap-x-2 gap-y-6 sm:grid-cols-3 lg:grid-cols-4 xl:[grid-template-columns:repeat(var(--n),minmax(0,1fr))]"
      style={{ ["--n" as string]: String(steps.length) }}
    >
      <span
        className="pointer-events-none absolute top-6 right-[calc(50%/var(--n))] left-[calc(50%/var(--n))] hidden h-0.5 bg-[#c7d7ea] xl:block"
        aria-hidden
      />
      {steps.map((step, index) => {
        const Icon = iconForStep(step);
        return (
          <li key={step} className="relative flex min-w-0 flex-col items-center px-1 text-center">
            <span className="relative z-[1] grid size-12 place-items-center rounded-2xl border border-[#d7e4f3] bg-white text-primary shadow-[0_8px_20px_rgba(11,57,121,.08)]">
              <Icon className="size-5" strokeWidth={1.8} />
              <span className="absolute -top-1.5 -right-1.5 grid size-5 place-items-center rounded-full bg-primary text-[10px] font-extrabold text-white">
                {index + 1}
              </span>
            </span>
            <p className="mt-2.5 text-[12px] font-semibold leading-snug text-[#1a2332]">{step}</p>
          </li>
        );
      })}
    </ol>
  );
}

export function iconForStep(step: string): LucideIcon {
  const s = step.toLowerCase();
  if (s.includes("langue")) return Languages;
  if (s.includes("diplÃ´me")) return GraduationCap;
  if (s.includes("invitation") || s.includes("nomination")) return Mail;
  if (s.includes("traitement") || s.includes("dÃ©cision") || s.includes("audience") || s.includes("fÃ©dÃ©rale")) return Scale;
  if (s.includes("crÃ©er le profil") || s.includes("prÃ©parer le profil")) return FilePlus;
  if (s.includes("Ã©valuer le profil") || s.includes("Ã©valuer si")) return ClipboardCheck;
  if (s.includes("conditions") || s.includes("respecter")) return ShieldCheck;
  if (s.includes("rÃ©cit") || s.includes("preuves")) return FileText;
  if (s.includes("rÃ©seau")) return UsersRound;
  if (s.includes("motif")) return Target;
  if (s.includes("arrivÃ©e") || s.includes("voyage")) return Plane;
  if (s.includes("projet") || s.includes("voie")) return Target;
  if (s.includes("admission")) return School;
  if (s.includes("autorisation")) return ShieldCheck;
  if (s.includes("permis")) return BadgeCheck;
  if (s.includes("programme") || s.includes("volet") || s.includes("choisir la province")) return ListChecks;
  if (s.includes("Ã©tudier") || s.includes("carriÃ¨re")) return BookOpen;
  if (s.includes("emploi") || s.includes("employeur")) return Briefcase;
  if (s.includes("fonds")) return Wallet;
  if (s.includes("lien") || s.includes("rÃ©pondant") || s.includes("attaches")) return UsersRound;
  if (s.includes("dÃ©poser") || s.includes("soumettre") || s.includes("dossier")) return FileCheck;
  if (s.includes("suivi") || s.includes("vÃ©rifier")) return Search;
  if (s.includes("identifier")) return MapPin;
  return ClipboardCheck;
}

export function CompareSection() {
  const slide = useDeckStore((s) => s.slideIndex);
  const profile = useProfileStore((s) => s.draft);
  const market = householdMarket(profile);
  const compareSelected = useDeckStore((s) => s.compareSelected);
  const toggleCompare = useDeckStore((s) => s.toggleCompare);
  const aligned = routeForObjective(profile.objective);
  if (slide === 1) return <CompareScenarios market={market} profile={profile} />;
  return (
    <CompareTable
      market={market}
      profile={profile}
      selectedIds={compareSelected}
      alignedId={aligned.id}
      onToggle={toggleCompare}
    />
  );
}

function CompareTable({
  market,
  profile,
  selectedIds,
  alignedId,
  onToggle,
}: {
  market: ReturnType<typeof householdMarket>;
  profile: Profile;
  selectedIds: string[];
  alignedId: string;
  onToggle: (id: string) => void;
}) {
  const selected = routes.filter((route) => selectedIds.includes(route.id)).slice(0, COMPARE_LIMIT);
  const fastestId = fastestRouteId(selected.map((route) => route.id));
  const atCap = selected.length >= COMPARE_LIMIT;
  return (
    <OpportunitiesShell
      kicker="Comparateur"
      title="Comparer les voies cÃ´te Ã  cÃ´te."
      lead="Cochez jusquâ€™Ã  trois voies. Les dÃ©lais IRCC apparaissent en premier."
      pills={[market.family, market.province, profile.objective, ...studyDeckPills(profile).filter((pill) => pill !== "Ã‰tudes")]}
      hero={sectionBanners.compare}
    >
      <div className="flex min-h-0 flex-1 flex-col gap-3 pb-1">
        <div className="flex flex-wrap items-end justify-between gap-2">
          <div>
            <SectionLabel>Voies Ã  comparer</SectionLabel>
            <p className="mt-0.5 text-[12px] text-muted-foreground">
              {atCap
                ? "3 maximum. Cocher une autre voie remplace la plus ancienne."
                : selected.length === 0
                  ? "Choisissez jusquâ€™Ã  trois voies pour comparer."
                  : "Cochez ou dÃ©cochez : le comparatif suit immÃ©diatement."}
            </p>
          </div>
          <span className="rounded-full bg-secondary px-2.5 py-1 text-[11px] font-semibold text-primary">
            {selected.length}/{COMPARE_LIMIT} cochÃ©es
          </span>
        </div>
        <div className="flex flex-wrap gap-1.5" role="group" aria-label="Voies Ã  comparer">
          {routes.map((route) => {
            const on = selectedIds.includes(route.id);
            const aligned = route.id === alignedId;
            return (
              <button
                key={route.id}
                type="button"
                role="checkbox"
                aria-checked={on}
                onClick={() => onToggle(route.id)}
                className={cn(
                  "inline-flex cursor-pointer items-center gap-2 rounded-full border px-2.5 py-1.5 text-[12px] font-medium transition active:scale-[0.98]",
                  on
                    ? "border-primary bg-primary text-white shadow-[0_8px_18px_rgba(27,84,141,.18)]"
                    : "border-border bg-white text-[#1a2332] hover:border-primary/50 hover:bg-secondary",
                )}
              >
                <span
                  className={cn(
                    "grid size-4 shrink-0 place-items-center rounded-[4px] border",
                    on ? "border-white bg-white text-primary" : "border-[#b7c4d4] bg-white",
                  )}
                  aria-hidden
                >
                  {on ? <Check className="size-3" strokeWidth={3} /> : null}
                </span>
                {route.name}
                {aligned ? (
                  <span
                    className={cn(
                      "rounded-full px-1.5 py-0.5 text-[9px] font-semibold uppercase",
                      on ? "bg-white/18 text-white" : "bg-secondary text-primary",
                    )}
                  >
                    Profil
                  </span>
                ) : null}
              </button>
            );
          })}
        </div>
        {selected.length === 0 ? (
          <Surface className="grid flex-1 place-items-center p-8 text-center">
            <div className="max-w-[42ch]">
              <Clock className="mx-auto size-8 text-primary" strokeWidth={1.6} />
              <p className="mt-3 text-[15px] font-semibold text-[#1a2332]">Aucune voie sÃ©lectionnÃ©e</p>
              <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">
                Cochez jusquâ€™Ã  trois voies. Le dÃ©lai IRCC apparaÃ®t en premier, câ€™est souvent la question du foyer.
              </p>
            </div>
          </Surface>
        ) : (
          <>
            <IrccSourceBar />
            <div
              className={cn(
                "grid min-h-0 flex-1 gap-3",
                selected.length === 1 && "lg:grid-cols-1",
                selected.length === 2 && "lg:grid-cols-2",
                selected.length === 3 && "lg:grid-cols-3",
              )}
            >
              {selected.map((route) => (
                <CompareColumn
                  key={route.id}
                  route={route}
                  time={irccTimeFor(route.id)}
                  fastest={route.id === fastestId}
                  aligned={route.id === alignedId}
                  onUncheck={() => onToggle(route.id)}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </OpportunitiesShell>
  );
}

function CompareColumn({
  route,
  time,
  fastest,
  aligned,
  onUncheck,
}: {
  route: ImmigrationRoute;
  time: IrccTime;
  fastest: boolean;
  aligned: boolean;
  onUncheck: () => void;
}) {
  const facts = [
    ["Objectif", route.tag],
    ["Profil type", route.fit],
    ["Condition", route.conditions[0] ?? "Selon le dossier"],
    ["Point fort", route.positives[0]],
    ["Attention", route.attention[0]],
  ] as const;
  return (
    <Surface className={cn("flex min-h-0 flex-col overflow-hidden", fastest && "ring-2 ring-primary/25")}>
      <div className={cn("px-4 py-3.5", fastest ? "bg-primary text-white" : "bg-secondary")}>
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className={cn("text-[10px] font-semibold tracking-wide uppercase", fastest ? "text-white/70" : "text-primary")}>
              {route.tag}
            </p>
            <h3 className="mt-0.5 text-[16px] leading-tight font-semibold">{route.name}</h3>
          </div>
          <div className="flex shrink-0 items-center gap-1.5">
            {aligned ? (
              <span
                className={cn(
                  "rounded-full px-2 py-0.5 text-[10px] font-semibold",
                  fastest ? "bg-white/15 text-white" : "bg-white text-primary",
                )}
              >
                Profil
              </span>
            ) : null}
            {fastest ? (
              <span className="rounded-full bg-white/15 px-2 py-0.5 text-[10px] font-semibold">Plus rapide</span>
            ) : null}
            <button
              type="button"
              onClick={onUncheck}
              aria-label={`Retirer ${route.name}`}
              className={cn(
                "grid size-6 cursor-pointer place-items-center rounded-md",
                fastest ? "bg-white/15 text-white hover:bg-white/25" : "bg-white text-[#5b6b7c] hover:bg-white hover:text-primary",
              )}
            >
              <X className="size-3.5" strokeWidth={2.4} />
            </button>
          </div>
        </div>
        <p className={cn("mt-3 text-[28px] leading-none font-semibold tracking-tight", fastest ? "text-white" : "text-primary")}>
          {time.headline}
        </p>
        <p className={cn("mt-1.5 text-[12px]", fastest ? "text-white/75" : "text-[#5b6b7c]")}>{time.scope}</p>
      </div>
      {time.tracks ? (
        <div className="grid grid-cols-2 gap-px border-b border-[#e5eaf0] bg-[#e5eaf0]">
          {time.tracks.map((track) => (
            <div key={track.label} className="bg-white px-3 py-2">
              <p className="text-[10px] text-muted-foreground">{track.label}</p>
              <p className="text-[12px] font-semibold text-[#1a2332]">{track.value}</p>
            </div>
          ))}
        </div>
      ) : null}
      <dl className="flex flex-1 flex-col gap-2.5 px-4 py-3">
        {facts.map(([label, value]) => (
          <div key={label}>
            <dt className="text-[10px] font-semibold tracking-wide text-[#89929f] uppercase">{label}</dt>
            <dd className="mt-0.5 text-[13px] leading-snug text-[#1a2332]">{value}</dd>
          </div>
        ))}
      </dl>
      <p className="mt-auto shrink-0 border-t border-[#eef2f6] px-4 py-2.5 text-[11px] leading-relaxed text-muted-foreground">{time.note}</p>
    </Surface>
  );
}

function DelayChip({ time }: { time: IrccTime }) {
  return (
    <span className="mt-2.5 inline-flex items-center gap-1 text-[11px] font-semibold text-primary">
      <Clock className="size-3.5" strokeWidth={2} />
      {time.headline}
    </span>
  );
}

function DelayBanner({ time }: { time: IrccTime }) {
  return (
    <Surface className="grid shrink-0 gap-3 p-4 sm:grid-cols-[auto_1fr] sm:items-center">
      <div>
        <p className="text-[10px] font-semibold tracking-wide text-primary uppercase">
          DÃ©lai approximatif IRCC Â· {irccTimesMeta.updatedLabel}
        </p>
        <p className="mt-1 text-[26px] leading-none font-semibold tracking-tight text-primary">{time.headline}</p>
        <p className="mt-1.5 text-[13px] text-[#5b6b7c]">{time.scope}</p>
      </div>
      <div className="sm:text-right">
        {time.tracks ? (
          <div className="mb-2 flex flex-wrap gap-1.5 sm:justify-end">
            {time.tracks.map((track) => (
              <span key={track.label} className="rounded-full bg-secondary px-2.5 py-1 text-[11px] font-medium text-[#1a2332]">
                {track.label}: {track.value}
              </span>
            ))}
          </div>
        ) : null}
        <p className="text-[12px] leading-relaxed text-muted-foreground">{time.note}</p>
      </div>
    </Surface>
  );
}

function IrccSourceBar() {
  return (
    <div className="flex flex-wrap items-center justify-between gap-2 rounded-[1rem] border border-[#d7e4f3] bg-secondary px-3.5 py-2.5">
      <p className="inline-flex items-center gap-2 text-[12px] text-[#1a2332]">
        <Clock className="size-3.5 text-primary" strokeWidth={2} />
        DÃ©lais approximatifs {irccTimesMeta.sourceLabel}, {irccTimesMeta.updatedLabel}. Les temps rÃ©els varient selon le pays et le dossier.
      </p>
      <a
        href={irccTimesMeta.sourceUrl}
        target="_blank"
        rel="noreferrer"
        className="inline-flex items-center gap-1 text-[12px] font-semibold text-primary hover:underline"
      >
        VÃ©rifier sur canada.ca
        <ExternalLink className="size-3.5" strokeWidth={2} />
      </a>
    </div>
  );
}

function CompareScenarios({
  market,
  profile,
}: {
  market: ReturnType<typeof householdMarket>;
  profile: Profile;
}) {
  const featured = recommendedScenarioId(profile);
  const scenarios = [
    ["A", "Aller vers la rÃ©sidence permanente", "Explorer dâ€™abord les voies Ã©conomiques directes."],
    ["B", "Construire une expÃ©rience canadienne", "Ã‰tudes ou travail selon les conditions applicables."],
    ["C", "Maximiser lâ€™employabilitÃ©", "Province + mÃ©tier + carriÃ¨re + immigration."],
    ["D", "Partir en famille", "Comparer coÃ»t, emploi du conjoint et installation."],
  ] as const;
  return (
    <OpportunitiesShell
      kicker="Comparateur Â· ScÃ©narios"
      title={smart("Quel scÃ©nario correspond le mieux Ã  {name} ?", profile)}
      lead="On choisit une logique de projet, pas un programme au hasard."
      pills={[market.family, profile.objective, ...studyDeckPills(profile).filter((pill) => pill !== "Ã‰tudes")]}
      hero={sectionBanners.compare}
    >
      <div className="ir-auto-grid">
        {scenarios.map(([id, title, copy]) => (
          <Surface key={id} className={cn("p-4", id === featured && "border-primary")}>
            <span className="flex items-center justify-between gap-2">
              <span className="grid size-7 place-items-center rounded-full bg-primary text-sm font-extrabold text-white">
                {id}
              </span>
              {id === featured ? (
                <span className="rounded-full bg-secondary px-2 py-0.5 text-[9px] font-semibold text-primary">
                  Foyer
                </span>
              ) : null}
            </span>
            <h3 className="mt-3 mb-2 text-base font-semibold">{title}</h3>
            <p className="text-[12px] leading-relaxed text-[#707987]">{copy}</p>
          </Surface>
        ))}
      </div>
    </OpportunitiesShell>
  );
}

```
