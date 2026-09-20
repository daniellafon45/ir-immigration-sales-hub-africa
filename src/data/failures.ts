import emploiBureau from "@/assets/canada-live/emploi-bureau.jpg";
import emploiConstruction from "@/assets/canada-live/emploi-construction.jpg";
import emploiHero from "@/assets/canada-live/emploi-hero.jpg";
import pontEquipe from "@/assets/canada-live/pont-equipe.jpg";
import pontMetier from "@/assets/canada-live/pont-metier.jpg";
import pontVille from "@/assets/canada-live/pont-ville.jpg";
import montrealFall from "@/assets/places/montreal-fall.jpg";
import montrealWinter from "@/assets/places/montreal-winter.jpg";
import quebecWinter from "@/assets/places/quebec-winter.jpg";
import problemCareerLate from "@/assets/pitch/problem-career-late.jpg";
import problemIncoherentFile from "@/assets/pitch/problem-incoherent-file.jpg";
import problemSettlementChance from "@/assets/pitch/problem-settlement-chance.jpg";
import problemWrongPath from "@/assets/pitch/problem-wrong-path.jpg";
import finance1 from "@/assets/professions/finance-1.jpg";

export type FailureRiskId =
  | "program"
  | "rush"
  | "money"
  | "employability"
  | "housing"
  | "job-myth"
  | "counsel"
  | "urgent";

export type FailureRisk = {
  id: FailureRiskId;
  label: string;
  cost: string;
  image: string;
};

export type FailurePressTheme = "housing" | "jobs" | "distress";

export type FailurePressArticle = {
  theme: FailurePressTheme;
  source: string;
  date: string;
  title: string;
  excerpt: string;
  url: string;
  image: string;
};

export const failureRisks: FailureRisk[] = [
  {
    id: "program",
    label: "Choisir un programme pour le visa au lieu du projet",
    cost: "Un visa obtenu n’est pas encore un projet.",
    image: pontMetier,
  },
  {
    id: "rush",
    label: "Déposer trop vite",
    cost: "Un dossier incomplet revient plus cher qu’un dossier complet.",
    image: problemIncoherentFile,
  },
  {
    id: "money",
    label: "Sous-estimer les preuves financières",
    cost: "Le foyer entier doit tenir, pas seulement le candidat.",
    image: finance1,
  },
  {
    id: "employability",
    label: "Ignorer l’employabilité",
    cost: "Un métier sans débouché bloque le plan.",
    image: emploiConstruction,
  },
  {
    id: "housing",
    label: "Arriver sans logement préparé",
    cost: "Un loyer trop haut mange le budget dès le premier mois.",
    image: montrealFall,
  },
  {
    id: "job-myth",
    label: "Croire qu’un emploi est garanti",
    cost: "Personne n’embauche sur un souhait.",
    image: emploiBureau,
  },
  {
    id: "counsel",
    label: "Suivre des conseils non autorisés",
    cost: "Un mauvais conseil peut fermer une voie.",
    image: pontEquipe,
  },
  {
    id: "urgent",
    label: "Attendre que tout soit urgent",
    cost: "L’urgence fait signer n’importe quoi.",
    image: quebecWinter,
  },
];

export const failurePress: FailurePressArticle[] = [
  {
    theme: "housing",
    source: "Radio-Canada",
    date: "fév. 2024",
    title: "Plusieurs étudiants étrangers vivent dans la pauvreté",
    excerpt:
      "Logement saturé, horaires plafonnés, santé mentale touchée. Un visa d’études n’est pas un toit.",
    url: "https://ici.radio-canada.ca/nouvelle/2048670/etudiants-etrangers-pauvrete-logement-brampton-mississauga",
    image: problemSettlementChance,
  },
  {
    theme: "housing",
    source: "Directeur parlementaire du budget",
    date: "2024",
    title: "Le plan d’immigration 2025-2027 et l’écart de logements",
    excerpt:
      "Même avec des cibles plus basses, l’écart reste de centaines de milliers d’unités. Arriver sans adresse, c’est arriver dans un marché déjà tendu.",
    url: "https://www.pbo-dpb.ca/fr/additional-analyses--analyses-complementaires/BLOG-2425-006--impact-2025-2027-immigration-levels-plan-canada-housing-gap--repercussions-plan-niveaux-immigration-2025-2027-ecart-offre-logement-canada",
    image: pontVille,
  },
  {
    theme: "jobs",
    source: "Statistique Canada",
    date: "oct. 2025",
    title: "34,7 % des immigrants récents se disent surqualifiés",
    excerpt:
      "Un diplôme ne garantit pas un poste à la mesure du profil. Le sous-emploi est devenu plus fréquent chez les arrivants récents.",
    url: "https://www150.statcan.gc.ca/n1/daily-quotidien/251010/dq251010a-fra.htm",
    image: emploiHero,
  },
  {
    theme: "jobs",
    source: "Institut du Québec",
    date: "2025",
    title: "Les immigrants temporaires : un chômage près de trois fois plus élevé",
    excerpt: "11,7 % chez les temporaires, contre 4,1 % chez les natifs au Québec. Un permis n’est pas un emploi.",
    url: "https://institutduquebec.ca/publications/bilan-2024-de-l-emploi-au-quebec",
    image: problemWrongPath,
  },
  {
    theme: "distress",
    source: "Radio-Canada",
    date: "janv. 2024",
    title: "Dépression et anxiété chez les nouveaux arrivants",
    excerpt:
      "21 % des personnes immigrées depuis 6 à 15 ans déclarent des symptômes d’anxiété. L’isolement et le déclassement pèsent.",
    url: "https://ici.radio-canada.ca/nouvelle/2038351/sante-mentale-immigrants-canada-emploi",
    image: problemCareerLate,
  },
  {
    theme: "distress",
    source: "Radio-Canada",
    date: "janv. 2024",
    title: "Quand le rêve canadien se transforme en cauchemar",
    excerpt:
      "Arriver sans réseau, sans logement et sans emploi correspondant au profil : le choc n’est pas rare.",
    url: "https://ici.radio-canada.ca/nouvelle/2038406/immigration-canada-sante-mentale",
    image: montrealWinter,
  },
];
