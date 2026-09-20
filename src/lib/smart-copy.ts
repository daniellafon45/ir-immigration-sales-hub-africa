import type { Profile } from "@/data/profile";
import { money } from "@/lib/format";
import { pitchView } from "@/lib/principal";

export function smart(text: string, profile: Profile) {
  const view = pitchView(profile);
  return text
    .replaceAll("{name}", view.firstName)
    .replaceAll("{profession}", view.profession)
    .replaceAll("{province}", view.province)
    .replaceAll("{objective}", view.objective)
    .replaceAll("{country}", view.country)
    .replaceAll("{budget}", money(view.budget));
}
