import { familyHasSpouse, type Profile } from "@/data/profile";
import { studySubsistenceFor } from "@/data/ircc-funds";
import { ALL_CITIES, demandFor, demandLabel, type DemandLevel } from "@/data/job-demand";
import { provinceCode, provinceData } from "@/data/provinces";
import { studyFundsLabel } from "@/data/study-funds";
import { studyLevelLabels, type StudyLevel } from "@/data/study-programs";
import { tuitionFor } from "@/data/study-tuition";
import { internshipSalaryForProfession, salaryForProfession } from "@/lib/finance";
import { defaultCityId, livingBasket } from "@/lib/living-basket";
import { studyProgramFor, studentMember } from "@/lib/study-program";

export type StudyTuitionRow = {
  code: string;
  name: string;
  cegep: number;
  university: number;
  selected: boolean;
};

export type StudyOutcome = {
  profession: string;
  low: number;
  mid: number;
  high: number;
  internshipMid: number;
  employability: number;
  employabilityLabel: DemandLevel;
};

export type StudyCost = {
  study: boolean;
  programName?: string;
  programLevel?: string;
  tuition: number;
  tuitionLow: number;
  tuitionHigh: number;
  livingAnnual: number;
  subsistence: number;
  fundsLabel: string;
  proofOfFunds: number;
  gap: number;
  grid: StudyTuitionRow[];
  student: StudyOutcome;
  spouse?: StudyOutcome;
};

function clamp(value: number) {
  return Math.min(100, Math.max(0, Math.round(value)));
}

function outcomeFor(profession: string, province: string, baseEmployability: number): StudyOutcome {
  const code = provinceCode(province);
  const [low, mid, high] = salaryForProfession(profession, province);
  const intern = internshipSalaryForProfession(profession, province);
  const demand = demandFor(profession, { province: code, cityId: ALL_CITIES });
  const employability = clamp(baseEmployability * 0.6 + demand.score * 0.4);
  return {
    profession,
    low,
    mid,
    high,
    internshipMid: intern[1],
    employability,
    employabilityLabel: demandLabel(employability),
  };
}

export function studyCost(profile: Profile): StudyCost {
  const code = provinceCode(profile.province);
  const program = studyProgramFor(profile);
  const student = studentMember(profile);
  const grid: StudyTuitionRow[] = Object.entries(provinceData).map(([item, province]) => ({
    code: item,
    name: province.name,
    cegep: tuitionFor("cegep", item),
    university: tuitionFor("bachelor", item),
    selected: item === code,
  }));
  const cegep = tuitionFor("cegep", code);
  const uni = tuitionFor("bachelor", code);
  const tuition = program ? tuitionFor(program.level as StudyLevel, code) : uni;
  const livingAnnual = livingBasket(profile, defaultCityId(profile)).total * 12;
  const hasSpouse = familyHasSpouse(profile.family);
  const subsistence = studySubsistenceFor(profile);
  const studentOutcome = outcomeFor(
    student.profession,
    profile.province,
    program?.employability ?? 65,
  );
  const spouseOutcome = hasSpouse
    ? outcomeFor(profile.spouse.profession, profile.province, 70)
    : undefined;

  return {
    study: profile.objective === "Études",
    programName: program?.name,
    programLevel: program ? studyLevelLabels[program.level] : undefined,
    tuition,
    tuitionLow: Math.min(cegep, uni),
    tuitionHigh: Math.max(cegep, uni, tuition),
    livingAnnual,
    subsistence,
    fundsLabel: studyFundsLabel(code),
    proofOfFunds: tuition + subsistence,
    gap: livingAnnual - subsistence,
    grid,
    student: studentOutcome,
    spouse: spouseOutcome,
  };
}
