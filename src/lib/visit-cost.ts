import { familyHasChildren, familyHasSpouse, type Profile } from "@/data/profile";
import { visitFeesFor } from "@/data/visit-fees";
import { visitFundsFor, type VisitDuration } from "@/data/visit-funds";
import { defaultCityId, livingBasket } from "@/lib/living-basket";

export type VisitCostPurpose = "family" | "tourism" | "business";

export type VisitCost = {
  purpose: VisitCostPurpose;
  duration: VisitDuration;
  assumedPurpose: boolean;
  assumedDuration: boolean;
  stayCost: number;
  fundsRequired: number;
  feesTotal: number;
  ticketsDemo: number;
  gap: number;
  accompanying: { adults: number; kids: number } | undefined;
  canWork: false;
};

const durationMonths: Record<VisitDuration, number> = {
  "15d": 0.5,
  "1m": 1,
  "3m": 3,
  "6m": 6,
};

function resolvedPurpose(value: string): { purpose: VisitCostPurpose; assumedPurpose: boolean } {
  if (value === "family" || value === "tourism" || value === "business") {
    return { purpose: value, assumedPurpose: false };
  }
  return { purpose: "tourism", assumedPurpose: true };
}

function resolvedDuration(value: string): { duration: VisitDuration; assumedDuration: boolean } {
  if (value === "15d" || value === "1m" || value === "3m" || value === "6m") {
    return { duration: value, assumedDuration: false };
  }
  return { duration: "1m", assumedDuration: true };
}

function householdCounts(profile: Profile) {
  const kids = familyHasChildren(profile.family) ? profile.children.length : 0;
  const adults =
    1 + (familyHasSpouse(profile.family) ? 1 : 0) + (profile.family === "Polygame" ? profile.extraSpouses.length : 0);
  return { adults, kids };
}

export function visitCost(profile: Profile): VisitCost {
  const { purpose, assumedPurpose } = resolvedPurpose(profile.visitPurpose);
  const { duration, assumedDuration } = resolvedDuration(profile.visitDuration);
  const basket = livingBasket(profile, defaultCityId(profile));
  const { adults, kids } = householdCounts(profile);
  const factor = durationMonths[duration];
  const stayCost = basket.total * factor;
  const fundsRequired = visitFundsFor(duration, adults, kids);
  const feesTotal = visitFeesFor(profile.country, adults + kids).total;
  const ticketsDemo = 2400 * adults + 1200 * kids;

  return {
    purpose,
    duration,
    assumedPurpose,
    assumedDuration,
    stayCost,
    fundsRequired,
    feesTotal,
    ticketsDemo,
    gap: fundsRequired - stayCost,
    accompanying: adults === 1 && kids === 0 ? undefined : { adults, kids },
    canWork: false,
  };
}
