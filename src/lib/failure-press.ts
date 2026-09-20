import { familyHasChildren, familyHasSpouse, type Profile } from "@/data/profile";

export function highlightedFailureIds(profile: Profile): string[] {
  const ids: string[] = ["housing", "job-myth"];
  if (
    familyHasSpouse(profile.family) ||
    familyHasChildren(profile.family) ||
    profile.objective === "Affaires" ||
    profile.objective === "Regroupement familial"
  ) {
    ids.push("money");
  }
  if (profile.objective === "Travail") ids.push("employability");
  else if (profile.objective === "Études") ids.push("program");
  else if (profile.objective === "Visite") ids.push("counsel");
  return [...new Set(ids)].slice(0, 3);
}
