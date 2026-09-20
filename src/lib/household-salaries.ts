import { businessPathById } from "@/data/business-paths";
import { provinceCode } from "@/data/provinces";
import type { Profile } from "@/data/profile";
import type { SalaryBand } from "@/data/salaries";
import { internshipBandsFor, netEstimate, salaryBandsFor } from "@/lib/finance";
import { householdMarket, type HouseholdMarketAdult } from "@/lib/household-market";
import { recognitionFor, type SalaryRecognition } from "@/lib/salary-recognition";
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
  recognition: SalaryRecognition;
};

export type HouseholdSalaries = {
  groups: HouseholdSalaryGroup[];
  province: string;
  study: boolean;
};

function withRecognition(
  group: Omit<HouseholdSalaryGroup, "recognition">,
  province: string,
): HouseholdSalaryGroup {
  const phase = group.phases.find((item) => item.id !== "internship") ?? group.phases[0];
  const member = group.adult.member;
  return {
    ...group,
    recognition: recognitionFor({
      profession: member.profession,
      years: member.experience,
      band: [phase.low, phase.mid, phase.high],
      province,
      french: member.french,
      english: member.english,
    }),
  };
}

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

function marketGroup(adult: HouseholdMarketAdult, code: string, heading = `${adult.label} · ${adult.member.profession}`): Omit<HouseholdSalaryGroup, "recognition"> {
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
  heading = `Conjoint parrainé · ${adult.member.profession}`,
  hint = "Permis de travail ouvert selon l’admissibilité du dossier principal.",
): Omit<HouseholdSalaryGroup, "recognition"> {
  const bands = salaryBandsFor(adult.member.profession);
  const netAnnual = netEstimate(adult.mid, code);
  return {
    adult,
    heading,
    track: "accompanying",
    bands,
    netAnnual,
    netMonthly: Math.round(netAnnual / 12),
    phases: [phaseFrom("openWork", "Possibilités d’emploi", bands, adult.low, adult.mid, adult.high, code, hint)],
  };
}

export function householdSalaries(profile: Profile): HouseholdSalaries {
  const market = householdMarket(profile);
  const code = provinceCode(profile.province);
  const study = profile.objective === "Études";
  const work = profile.objective === "Travail" ? workPathways(profile) : undefined;
  const businessPath = profile.objective === "Affaires" ? businessPathById(profile.businessPath) : undefined;

  const groups = market.adults.map((adult) => {
    const heading = `${adult.label} · ${adult.member.profession}`;
    if (!study) {
      if (profile.objective === "Travail" && adult.role !== "applicant" && work?.spouseOpen?.eligible) {
        return openWorkGroup(
          adult,
          code,
          `Conjoint parrainé · ${adult.member.profession}`,
          "Permis de travail ouvert possible si le dossier principal reste admissible.",
        );
      }

      if (profile.objective === "Affaires" && adult.role !== "applicant" && businessPath?.spouseOpenEligible) {
        return openWorkGroup(
          adult,
          code,
          `Conjoint parrainé · ${adult.member.profession}`,
          "Permis de travail ouvert possible si le volet d’affaires autorise le travail.",
        );
      }

      if (profile.objective === "Regroupement familial") {
        if (profile.familyLink === "parent" && adult.role !== "applicant") return null;
        if (profile.familyLink === "spouse" && adult.role !== "applicant") {
          return marketGroup(adult, code, `Après l’arrivée · ${adult.member.profession}`);
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
            "Après les études",
            bands,
            adult.low,
            adult.mid,
            adult.high,
            code,
            "Permis de travail postdiplôme. Le marché du métier, une fois le diplôme en poche.",
          ),
          phaseFrom(
            "internship",
            "Durant vos stages",
            internBands,
            intern[0],
            intern[1],
            intern[2],
            code,
            "Rémunération de stage coop, équivalent annuel.",
          ),
        ],
      };
    }

    return openWorkGroup(adult, code, `Conjoint parrainé · ${adult.member.profession}`, "Permis de travail ouvert pendant les études du candidat.");
  });
  return {
    groups: groups
      .filter((group): group is NonNullable<typeof group> => Boolean(group))
      .map((group) => withRecognition(group, market.province)),
    province: market.province,
    study,
  };
}
