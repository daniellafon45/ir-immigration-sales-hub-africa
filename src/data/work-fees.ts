import { workPermitById, type WorkPermitId } from "@/data/work-permits";

export const workPermitFee = 155;
export const openHolderFee = 100;
export const biometricsSolo = 85;
export const biometricsFamilyCap = 170;
export const sourceUrl =
  "https://www.canada.ca/fr/immigration-refugies-citoyennete/services/travailler-canada/prolongez-modifiez/presenter-demande.html";

export type WorkFees = {
  permit: number;
  openHolder: number;
  biometrics: number;
  total: number;
};

export function workFeesFor(kind: string, familySize: number): WorkFees {
  const permit = workPermitFee;
  const permitInfo = workPermitById(kind);
  const openHolder =
    permitInfo && (kind === "open" || kind === "iec") ? openHolderFee : 0;
  const members = Math.max(1, Math.round(familySize || 1));
  const biometrics = members > 1 ? biometricsFamilyCap : biometricsSolo;
  return {
    permit,
    openHolder,
    biometrics,
    total: permit + openHolder + biometrics,
  };
}

export type { WorkPermitId };
