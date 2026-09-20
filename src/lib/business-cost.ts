import { ALL_CITIES, demandFor, demandLabel, type DemandLevel } from "@/data/job-demand";
import { businessPathById, startupVisaPaused, type BusinessPath } from "@/data/business-paths";
import { c11WorkingCapital, pnpEntrepreneur } from "@/data/business-thresholds";
import { familyHasChildren, familyHasSpouse, financialCapacityAmount, type Profile } from "@/data/profile";
import { provinceCode, provinceData } from "@/data/provinces";
import { visitFeesFor } from "@/data/visit-fees";
import { salaryForProfession } from "@/lib/finance";
import { defaultCityId, livingBasket } from "@/lib/living-basket";

export type BusinessThresholdRow = {
  code: string;
  name: string;
  c11: number;
  pnp: number;
  selected: boolean;
};

export type BusinessOutcome = {
  profession: string;
  low: number;
  mid: number;
  high: number;
  employability: number;
  employabilityLabel: DemandLevel;
  openWork: boolean;
};

export type BusinessCredibility = {
  experienceYears: number;
  fundsLabel: string;
  fundsAmount: number;
  province: string;
  pathName: string;
};

export type BusinessCost = {
  path: BusinessPath | undefined;
  investment: number;
  livingAnnual: number;
  stayShort: number;
  travelFunds: number;
  personalFunds: number;
  capitalToShow: number;
  gap: number;
  spouseOpen: boolean;
  startupPaused: true;
  grid: BusinessThresholdRow[];
  credibility: BusinessCredibility;
  spouse?: BusinessOutcome;
};

function investmentFor(path: BusinessPath | undefined, code: string) {
  if (!path?.needsInvestment) return 0;
  if (path.id === "c11") return c11WorkingCapital[code as keyof typeof c11WorkingCapital] ?? 0;
  if (path.id === "pnp-entrepreneur") return pnpEntrepreneur[code as keyof typeof pnpEntrepreneur] ?? 0;
  return 0;
}

function householdPeople(profile: Profile) {
  const kids = familyHasChildren(profile.family) ? profile.children.length : 0;
  const adults =
    1 + (familyHasSpouse(profile.family) ? 1 : 0) + (profile.family === "Polygame" ? profile.extraSpouses.length : 0);
  return { adults, kids, people: adults + kids };
}

function outcomeFor(profession: string, province: string, openWork: boolean): BusinessOutcome {
  const code = provinceCode(province);
  const [low, mid, high] = salaryForProfession(profession, province);
  const demand = demandFor(profession, { province: code, cityId: ALL_CITIES });
  return {
    profession,
    low,
    mid,
    high,
    employability: demand.score,
    employabilityLabel: demandLabel(demand.score),
    openWork,
  };
}

export function businessCost(profile: Profile): BusinessCost {
  const path = businessPathById(profile.businessPath);
  const code = provinceCode(profile.province);
  const basket = livingBasket(profile, defaultCityId(profile));
  const investment = investmentFor(path, code);
  const livingAnnual = path?.id === "visitor" ? 0 : path ? basket.total * 12 : 0;
  const stayShort = path?.id === "visitor" ? basket.total : 0;
  const { adults, kids, people } = householdPeople(profile);
  const travelFunds = path?.id === "visitor" ? visitFeesFor(profile.country, people).total + 2400 * adults + 1200 * kids : 0;
  const personalFunds = financialCapacityAmount(profile.applicant.salary);
  const capitalToShow = investment + (livingAnnual || stayShort) + travelFunds;
  const spouseOpen = familyHasSpouse(profile.family) && Boolean(path?.spouseOpenEligible);
  const grid: BusinessThresholdRow[] = Object.entries(provinceData).map(([item, province]) => ({
    code: item,
    name: province.name,
    c11: c11WorkingCapital[item as keyof typeof c11WorkingCapital],
    pnp: pnpEntrepreneur[item as keyof typeof pnpEntrepreneur],
    selected: item === code,
  }));

  return {
    path,
    investment,
    livingAnnual,
    stayShort,
    travelFunds,
    personalFunds,
    capitalToShow,
    gap: capitalToShow - personalFunds,
    spouseOpen,
    startupPaused: startupVisaPaused,
    grid,
    credibility: {
      experienceYears: profile.applicant.experience,
      fundsLabel: profile.applicant.salary,
      fundsAmount: personalFunds,
      province: profile.province,
      pathName: path?.name ?? "Selon le projet",
    },
    spouse: familyHasSpouse(profile.family)
      ? outcomeFor(profile.spouse.profession, profile.province, spouseOpen)
      : undefined,
  };
}
