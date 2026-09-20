import type { Profile } from "@/data/profile";
import { provinceCode } from "@/data/provinces";

export const sponsorshipFee = 85;
export const principalProcessingFee = 545;
export const rprf = 575;
export const biometricsFee = 85;
export const childExtraFee = 155;
export const quebecMifiAddOn = 300;

export type FamilyFees = {
  total: number;
  breakdown: {
    sponsorship: number;
    principalProcessing: number;
    rprf: number;
    biometrics: number;
    childExtra: number;
    quebecMifi: number;
  };
};

export function familyFeesFor(profile: Profile): FamilyFees {
  const breakdown = {
    sponsorship: sponsorshipFee,
    principalProcessing: principalProcessingFee,
    rprf,
    biometrics: biometricsFee,
    childExtra: profile.familyLink === "child" ? childExtraFee : 0,
    quebecMifi: provinceCode(profile.province) === "QC" ? quebecMifiAddOn : 0,
  };

  return {
    total: Object.values(breakdown).reduce((sum, value) => sum + value, 0),
    breakdown,
  };
}
