import { businessPathById } from "@/data/business-paths";
import { familyLinkById } from "@/data/family-links";
import { teerOf } from "@/data/noc-2021";
import type { Profile } from "@/data/profile";
import { visitPurposeById } from "@/data/visit-purposes";

export function closingDeckPills(profile: Profile): string[] {
  if (profile.objective === "Travail") {
    const teer = teerOf(profile.workNocCode);
    return teer === null ? [] : [`CNP · FEER ${teer}`];
  }
  if (profile.objective === "Visite") {
    const purpose = visitPurposeById(profile.visitPurpose);
    return purpose ? [purpose.name] : [];
  }
  if (profile.objective === "Affaires") {
    const path = businessPathById(profile.businessPath);
    return path ? [path.name] : [];
  }
  if (profile.objective === "Regroupement familial") {
    const link = familyLinkById(profile.familyLink);
    return link ? [link.name] : [];
  }
  return [];
}
