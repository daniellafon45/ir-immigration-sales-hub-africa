import type { EeCategory, EeCutoff, EeRound } from "@/data/ee-rounds";
import type { OpportunityId } from "@/data/opportunities";
import type { Profile } from "@/data/profile";
import { findBestPrograms } from "@/lib/best-programs";
import { toEngineProfile } from "@/lib/engine-profile";

/**
 * Présentation commerciale des pistes (Sales Hub Afrique) : montrer que c’est possible et
 * amener au rendez-vous. Aucun avis juridique, aucun score technique, aucun vocabulaire négatif :
 * l’admissibilité réelle est confirmée par un conseiller.
 */
export const PISTES_DISCLAIMER =
  "Pistes indicatives calculées à partir du profil. Aucune garantie de visa ni d’admission : l’admissibilité est confirmée par un conseiller lors du rendez-vous.";

export type Piste = {
  id: OpportunityId;
  name: string;
  label: "Piste solide" | "Piste à préparer";
  filerName: string;
  province: string;
  why: string;
  delay: string;
  withEmployer: boolean;
};

export type PistesView = {
  count: number;
  pistes: Piste[];
  headline: string;
};

const EXPLORATION = new Set<OpportunityId>(["visitor", "super-visa"]);

/** Pourquoi la piste est possible, en mots simples (pas de score, pas de jargon). */
const PROSPECT_WHY: Partial<Record<OpportunityId, string>> = {
  "pstq-v1": "Le Québec recrute des profils qualifiés francophones ; l’expérience acquise dans votre pays compte.",
  "pstq-v2": "Le Québec recrute aussi dans les métiers techniques et manuels, après une première expérience sur place.",
  "pstq-v3": "Les professions réglementées (santé, génie, enseignement…) sont recherchées au Québec.",
  "pstq-v4": "Des talents reconnus (recherche, arts, sport, économie) peuvent être sélectionnés au Québec.",
  peq: "Une voie rapide pour les personnes déjà installées au Québec.",
  "ee-fsw": "Le Canada sélectionne des travailleurs qualifiés depuis l’étranger, sans offre d’emploi obligatoire.",
  "ee-cec": "Après une première année de travail au Canada, la résidence permanente devient accessible.",
  "ee-fst": "Les métiers spécialisés (électricité, mécanique, cuisine, construction) sont recherchés.",
  "ee-french": "Le Canada invite en priorité les francophones : un vrai avantage pour votre profil.",
  "ee-health": "Les professions de la santé bénéficient de sélections dédiées.",
  "ee-trades": "Les métiers spécialisés bénéficient de sélections dédiées.",
  pnp: "Chaque province recrute selon ses besoins : plusieurs provinces peuvent correspondre au profil.",
  aip: "Les provinces de l’Atlantique recrutent avec des employeurs partenaires.",
  rcip: "Des communautés rurales recrutent avec des employeurs partenaires, pour tous les niveaux de métier.",
  fcip: "Des communautés francophones hors Québec recrutent spécialement des francophones.",
  "mobilite-francophone": "Un permis de travail simplifié pour les francophones, puis la résidence permanente.",
  "lmia-work": "Un emploi au Canada ouvre un permis de travail, puis la résidence permanente.",
  iec: "Un permis de travail ouvert pour les jeunes de certains pays, tremplin vers la résidence permanente.",
  study: "Étudier au Canada ouvre le marché du travail et la résidence permanente.",
  pgwp: "Après des études au Canada, un permis de travail ouvert prépare la résidence permanente.",
  "spouse-owp": "Le conjoint peut travailler aussi pendant le projet.",
  "family-spouse": "Un conjoint au Canada peut parrainer votre venue.",
  "family-child": "Un parent au Canada peut parrainer son enfant.",
  "pnp-entrepreneur": "Les provinces accueillent des entrepreneurs qui investissent et créent leur activité.",
  ict: "Une mutation au sein de votre entreprise peut vous amener au Canada.",
};

export function buildPistes(
  profile: Profile,
  options: { cutoffs?: Partial<Record<EeCategory, EeCutoff>>; rounds?: EeRound[]; today?: string } = {},
): PistesView {
  const result = findBestPrograms(toEngineProfile(profile), options);
  const open = result.all.filter(
    (m) => (m.status === "ready" || m.status === "lever" || m.status === "bridge") && !EXPLORATION.has(m.program.id),
  );
  const pistes: Piste[] = result.top.slice(0, 3).map((m) => ({
    id: m.program.id,
    name: m.program.name,
    label: m.chance.level === "élevée" ? "Piste solide" : "Piste à préparer",
    filerName: m.filerName,
    province: m.provinceFlexible ? "Plusieurs provinces possibles" : m.province,
    why: PROSPECT_WHY[m.program.id] ?? "Une voie possible pour ce profil, à préciser avec un conseiller.",
    delay: m.timeline.totalMonths
      ? `≈ ${m.timeline.totalMonths[0]}-${m.timeline.totalMonths[1]} mois jusqu’à la résidence permanente (indicatif)`
      : "Délai précisé lors du rendez-vous",
    withEmployer: m.needsEmployer,
  }));
  const headline =
    pistes.length > 0
      ? `${open.length} voie${open.length > 1 ? "s" : ""} possible${open.length > 1 ? "s" : ""} identifiée${open.length > 1 ? "s" : ""} pour ce profil — à confirmer avec un conseiller en rendez-vous.`
      : "Un conseiller identifiera la meilleure voie pour ce profil lors du rendez-vous.";
  return { count: open.length, pistes, headline };
}
