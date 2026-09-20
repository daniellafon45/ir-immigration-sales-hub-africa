import type { Teer } from "@/data/noc-2021";

export const irccRetrievedAt = "2026-09-19";
export const cecHours = 1560;
export const cecYearsWindow = 3;
export const cecEligibleTeer = [0, 1, 2, 3] as const;
export const sowpMinMonthsLeft = 6;
export const sowpSelectedTeer23: ReadonlySet<string> = new Set([
  "33102",
  "33100",
  "33101",
  "33103",
  "22211",
  "22212",
]);

export const irccSources = {
  noc: "https://www.canada.ca/fr/immigration-refugies-citoyennete/services/immigrer-canada/trouver-classification-nationale-professions.html",
  cec: "https://www.canada.ca/fr/immigration-refugies-citoyennete/services/immigrer-canada/entree-express/qui-presenter-demande/categorie-experience-canadienne.html",
  renew:
    "https://www.canada.ca/fr/immigration-refugies-citoyennete/services/travailler-canada/prolongez-modifiez/presenter-demande.html",
  family:
    "https://www.canada.ca/fr/immigration-refugies-citoyennete/services/travailler-canada/instructions-speciales/epoux-enfant-charge/admissibilite.html",
  openHelp: "https://ircc.canada.ca/Francais/centre-aide/reponse.asp?qnum=176",
};

export const feerLegend: Record<Teer, string> = {
  0: "Gestion",
  1: "Diplôme universitaire en général",
  2: "Collège, apprentissage ≥ 2 ans, ou supervision",
  3: "Collège, apprentissage < 2 ans, ou formation en emploi > 6 mois",
  4: "Secondaire, ou formation de plusieurs semaines",
  5: "Démonstration de travail à court terme, peu ou pas de scolarité",
};
