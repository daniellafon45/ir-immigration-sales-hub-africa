import { honorairesGrid, type HonorairesTrack } from "@/data/honoraires";
import {
  familyHasChildren,
  familyHasSpouse,
  familyIsPolygamous,
  type Profile,
} from "@/data/profile";

export type HonorairesQuote = {
  applicable: boolean;
  service: number;
  adults: number;
  kids: number;
  total: number;
};

const emptyQuote: HonorairesQuote = {
  applicable: false,
  service: 0,
  adults: 0,
  kids: 0,
  total: 0,
};

function householdCounts(profile: Profile) {
  const kids = familyHasChildren(profile.family) ? profile.children.length : 0;
  const adults =
    (familyHasSpouse(profile.family) ? 1 : 0) +
    (familyIsPolygamous(profile.family) ? profile.extraSpouses.length : 0);
  return { adults, kids };
}

export function honorairesTrackFor(objective: string): HonorairesTrack | null {
  if (objective === "Études") return "studies";
  if (objective === "Travail") return "work";
  if (objective === "Visite") return "visa";
  if (objective === "Affaires" || objective === "Regroupement familial") return null;
  return "rp";
}

export function honorairesFor(profile: Profile): HonorairesQuote {
  const track = honorairesTrackFor(profile.objective);
  if (!track) return emptyQuote;
  const rates = honorairesGrid[track];
  const { adults, kids } = householdCounts(profile);
  return {
    applicable: true,
    service: rates.service,
    adults,
    kids,
    total: rates.service + adults * rates.extraAdult + kids * rates.child,
  };
}
