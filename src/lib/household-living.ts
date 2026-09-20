import { provinceCode, provinceData } from "@/data/provinces";
import type { Profile } from "@/data/profile";
import { netEstimate } from "@/lib/finance";
import { householdSalaries, type HouseholdSalaryGroup } from "@/lib/household-salaries";

export const OTHER_MONTHLY_EXPENSES = 1700;

export type DraftLiving = {
  combinedNetMonthly: number;
  rent: number;
  other: number;
  remainder: number;
};

export type HouseholdLiving = DraftLiving & {
  groups: HouseholdSalaryGroup[];
  province: string;
};

export function draftLiving(netMonthly: number, rent: number, other: number): DraftLiving {
  const combinedNetMonthly = Math.max(0, Number(netMonthly) || 0);
  const rentSafe = Math.max(0, Number(rent) || 0);
  const otherSafe = Math.max(0, Number(other) || 0);
  return {
    combinedNetMonthly,
    rent: rentSafe,
    other: otherSafe,
    remainder: Math.max(0, combinedNetMonthly - rentSafe - otherSafe),
  };
}

export function householdLiving(profile: Profile): HouseholdLiving {
  const salaries = householdSalaries(profile);
  const code = provinceCode(profile.province);
  const rent = provinceData[code]?.rent ?? 0;
  const combinedNetMonthly = salaries.groups.reduce((sum, group) => sum + group.netMonthly, 0);
  return {
    groups: salaries.groups,
    ...draftLiving(combinedNetMonthly, rent, OTHER_MONTHLY_EXPENSES),
    province: salaries.province,
  };
}

export type DraftNet = {
  netAnnual: number;
  netMonthly: number;
  deductions: number;
  netRate: number;
};

export type ProvinceNetRow = DraftNet & {
  code: string;
  name: string;
};

export function draftNet(gross: number, code: string): DraftNet {
  const safeGross = Math.max(0, Number(gross) || 0);
  const netAnnual = netEstimate(safeGross, code);
  return {
    netAnnual,
    netMonthly: Math.round(netAnnual / 12),
    deductions: Math.max(0, safeGross - netAnnual),
    netRate: safeGross > 0 ? netAnnual / safeGross : 0,
  };
}

export function compareNetByProvince(gross: number): ProvinceNetRow[] {
  return Object.entries(provinceData)
    .map(([code, province]) => ({
      code,
      name: province.name,
      ...draftNet(gross, code),
    }))
    .sort((a, b) => b.netAnnual - a.netAnnual);
}

export type ProvinceLivingRow = {
  code: string;
  name: string;
  rent: number;
  other: number;
  cost: number;
  remainder: number;
};

export type CompareLivingOptions = {
  other?: number;
  rentOverride?: { code: string; rent: number };
};

export function compareLivingByProvince(netMonthly: number, options?: CompareLivingOptions): ProvinceLivingRow[] {
  const net = Math.max(0, Number(netMonthly) || 0);
  const other = Math.max(0, Number(options?.other ?? OTHER_MONTHLY_EXPENSES) || 0);
  return Object.entries(provinceData)
    .map(([code, province]) => {
      const catalogRent = province.rent ?? 0;
      const override = options?.rentOverride;
      const rent =
        override?.code === code ? Math.max(0, Number(override.rent) || 0) : catalogRent;
      const cost = rent + other;
      return {
        code,
        name: province.name,
        rent,
        other,
        cost,
        remainder: Math.max(0, net - cost),
      };
    })
    .sort((a, b) => b.remainder - a.remainder || a.rent - b.rent);
}
