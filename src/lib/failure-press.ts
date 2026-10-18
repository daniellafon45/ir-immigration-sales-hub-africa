import {
  failurePress,
  type FailurePressArticle,
  type FailurePressTheme,
  type PressTag,
} from "@/data/failures";
import { professionNoc } from "@/data/profession-noc";
import { adultFundsCad, familyHasChildren, familyHasSpouse, type Profile } from "@/data/profile";
import { quebecRegulation } from "@/data/quebec-regulated";
import { getPrincipalMember } from "@/lib/principal";

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

const TAG_REASON: Record<PressTag, string> = {
  all: "Situation générale des nouveaux arrivants",
  student: "Projet d’études",
  "temp-worker": "Travail temporaire",
  quebec: "Projet au Québec",
  "francophone-outside-qc": "Francophone hors Québec",
  family: "Famille",
  "low-budget": "Budget serré",
  regulated: "Profession réglementée",
};

/** Situations du client, déduites du profil complet. */
export function profilePressTags(profile: Profile): Set<PressTag> {
  const tags = new Set<PressTag>(["all"]);
  const member = getPrincipalMember(profile);
  const french = member.french === "Avancé" || member.french === "Bilingue";
  if (profile.objective === "Études" || profile.studyLevel) tags.add("student");
  // Version Afrique : prospects à l’étranger, le profil « travail temporaire » vient de l’objectif.
  if (profile.objective === "Travail") tags.add("temp-worker");
  if (profile.province === "Québec") tags.add("quebec");
  else if (french) tags.add("francophone-outside-qc");
  if (familyHasSpouse(profile.family) || familyHasChildren(profile.family)) tags.add("family");
  const capacity =
    adultFundsCad(profile.applicant) + (familyHasSpouse(profile.family) ? adultFundsCad(profile.spouse) : 0);
  if (Math.min(profile.budget || capacity, capacity || profile.budget) < 30000) tags.add("low-budget");
  if (quebecRegulation(profile.workNocCode || professionNoc(member.profession)) !== "none") tags.add("regulated");
  return tags;
}

export type SelectedArticle = FailurePressArticle & { reason: string };

const daysBetween = (from: string, to: string) => (Date.parse(to) - Date.parse(from)) / 86_400_000;

/** Les 2 articles les plus pertinents par thème : situation du client d’abord, puis récence. */
export function selectPressArticles(
  profile: Profile,
  { today = new Date().toISOString().slice(0, 10), perTheme = 2 }: { today?: string; perTheme?: number } = {},
): SelectedArticle[] {
  const tags = profilePressTags(profile);
  const themes: FailurePressTheme[] = ["housing", "jobs", "distress"];
  const out: SelectedArticle[] = [];
  for (const theme of themes) {
    const ranked = failurePress
      .filter((a) => a.theme === theme)
      .map((article) => {
        const specific = article.tags.filter((t) => t !== "all" && tags.has(t));
        const score = specific.length * 10 + (article.tags.includes("all") ? 2 : 0) - daysBetween(article.publishedOn, today) / 60;
        const reason = specific.length > 0 ? specific.map((t) => TAG_REASON[t]).join(" · ") : TAG_REASON.all;
        return { article, score, reason };
      })
      .sort((a, b) => b.score - a.score);
    for (const { article, reason } of ranked.slice(0, perTheme)) out.push({ ...article, reason });
  }
  return out;
}

/** Articles de plus de 12 mois : à remplacer par une source récente. */
export function stalePressArticles(today: string): FailurePressArticle[] {
  return failurePress.filter((a) => daysBetween(a.publishedOn, today) > 365);
}
