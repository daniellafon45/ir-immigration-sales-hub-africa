import type { Profile } from "@/data/profile";
import { provinceCode } from "@/data/provinces";
import { householdMarket } from "@/lib/household-market";

export const rocMni = [29833, 37158, 45643, 55490, 62989, 71006, 79015];
export const quebecEngagement = [31100, 39600, 48600, 59200, 67200, 75800, 84400];
export const PARENT_MULTIPLIER = 1.3;

function normalizedIndex(familySize: number) {
  const size = Math.max(1, Math.floor(familySize));
  return Math.min(size, 7) - 1;
}

function isQuebec(province: string) {
  return provinceCode(province) === "QC";
}

export function sizeFor(profile: Profile) {
  const market = householdMarket(profile);
  let size = market.adults.length + market.kids.length;
  if (profile.familyLink === "parent") size += 1;
  if (profile.familyLink === "spouse" && market.adults.length < 2) size += 1;
  if (profile.familyLink === "child" && market.kids.length === 0) size += 1;
  return size;
}

export function requiredIncome(province: string, familySize: number, link: string) {
  const grid = isQuebec(province) ? quebecEngagement : rocMni;
  const income = grid[normalizedIndex(familySize)] ?? grid[grid.length - 1]!;
  if (link === "parent") return Math.round(income * PARENT_MULTIPLIER);
  return income;
}
