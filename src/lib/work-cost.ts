import { ALL_CITIES, demandFor, demandLabel, type DemandLevel } from "@/data/job-demand";
import { familyHasSpouse, type Profile } from "@/data/profile";
import { provinceCode } from "@/data/provinces";
import { workFeesFor, type WorkFees } from "@/data/work-fees";
import { netEstimate, salaryForProfession } from "@/lib/finance";
import { defaultCityId, livingBasket } from "@/lib/living-basket";
import { workPathways, type WorkPathways } from "@/lib/work-pathways";

export type WorkOutcome = {
  profession: string;
  low: number;
  mid: number;
  high: number;
  net: number;
  demand: number;
  demandLabel: DemandLevel;
  employabilityLabel: DemandLevel;
};

export type WorkCost = {
  livingAnnual: number;
  settlementFunds: number;
  fees: WorkFees;
  salary: WorkOutcome;
  gapMonthly: number;
  spouse?: WorkOutcome;
  pathways: WorkPathways;
};

function outcomeFor(profession: string, province: string): WorkOutcome {
  const code = provinceCode(province);
  const [low, mid, high] = salaryForProfession(profession, province);
  const demand = demandFor(profession, { province: code, cityId: ALL_CITIES });
  return {
    profession,
    low,
    mid,
    high,
    net: netEstimate(mid, code),
    demand: demand.score,
    demandLabel: demandLabel(demand.score),
    employabilityLabel: demandLabel(demand.score),
  };
}

function familySize(profile: Profile) {
  return 1 + (familyHasSpouse(profile.family) ? 1 : 0) + profile.children.length;
}

export function workCost(profile: Profile): WorkCost {
  const basket = livingBasket(profile, defaultCityId(profile));
  const pathways = workPathways(profile);
  const salary = outcomeFor(profile.applicant.profession, profile.province);
  const spouse =
    familyHasSpouse(profile.family) && pathways.spouseOpen?.eligible
      ? outcomeFor(profile.spouse.profession, profile.province)
      : undefined;
  return {
    livingAnnual: basket.total * 12,
    settlementFunds: basket.total * 3,
    fees: workFeesFor(profile.workPermitKind, familySize(profile)),
    salary,
    gapMonthly: Math.round(salary.net / 12) - basket.total,
    spouse,
    pathways,
  };
}
