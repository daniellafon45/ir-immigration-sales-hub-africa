import emploiBureau from "@/assets/canada-live/emploi-bureau.jpg";
import emploiConstruction from "@/assets/canada-live/emploi-construction.jpg";
import emploiHero from "@/assets/canada-live/emploi-hero.jpg";
import pontEquipe from "@/assets/canada-live/pont-equipe.jpg";
import pontMetier from "@/assets/canada-live/pont-metier.jpg";
import pontVille from "@/assets/canada-live/pont-ville.jpg";
import montrealFall from "@/assets/places/montreal-fall.jpg";
import montrealWinter from "@/assets/places/montreal-winter.jpg";
import quebecWinter from "@/assets/places/quebec-winter.jpg";
import mosaicBusiness from "@/assets/pitch-africa/mosaic-business.jpg";
import mosaicStudy from "@/assets/pitch-africa/mosaic-study.jpg";
import pillarEmploi from "@/assets/pitch-africa/pillar-emploi.jpg";
import pillarImmigration from "@/assets/pitch-africa/pillar-immigration.jpg";
import welcomeGrow from "@/assets/pitch-africa/welcome-grow.jpg";
import problemSettlementChance from "@/assets/pitch/problem-settlement-chance.jpg";
import problemWrongPath from "@/assets/pitch/problem-wrong-path.jpg";
import finance1 from "@/assets/professions/finance-1.jpg";

export type OpportunityThemeId =
  | "study"
  | "employment"
  | "salary"
  | "nationality"
  | "business"
  | "flexibility";

export type OpportunityTheme = {
  id: OpportunityThemeId;
  title: string;
  body: string;
  image: string;
};

export type OpportunityPressArticle = {
  theme: OpportunityThemeId;
  source: string;
  date: string;
  title: string;
  excerpt: string;
  url: string;
  image: string;
};

export const OPPORTUNITY_THEMES: OpportunityTheme[] = [
  {
    id: "study",
    title: "Études",
    body: "Programmes reconnus, campus reliés au marché, et possibilité de travailler pendant/après selon le statut.",
    image: mosaicStudy,
  },
  {
    id: "employment",
    title: "Emploi",
    body: "Métiers en demande, salaires plus élevés dans beaucoup de secteurs, via IR recrutement / Industrielle RH.",
    image: pillarEmploi,
  },
  {
    id: "salary",
    title: "Salaire & aides",
    body: "Revenus bruts/nets indicatifs et filets sociaux selon la province. Les chiffres se voient dans Salaires & coût de vie.",
    image: finance1,
  },
  {
    id: "nationality",
    title: "Nationalité",
    body: "Un chemin possible après la résidence permanente et les délais légaux, jamais une promesse automatique.",
    image: pillarImmigration,
  },
  {
    id: "business",
    title: "Entrepreneuriat",
    body: "Créer avec un écosystème de partenaires : financement, formalités, réseau.",
    image: mosaicBusiness,
  },
  {
    id: "flexibility",
    title: "Flexibilité",
    body: "Étudier, travailler et entreprendre peuvent se combiner selon le statut, le plan se construit ensemble.",
    image: welcomeGrow,
  },
];

export const opportunityPress: OpportunityPressArticle[] = [
  {
    theme: "study",
    source: "IRCC",
    date: "2025",
    title: "Permis d’études : qui peut présenter une demande",
    excerpt:
      "Un établissement désigné, des fonds suffisants et un projet d’études sérieux : le Canada conditionne l’entrée aux études, pas au visa seul.",
    url: "https://www.canada.ca/fr/immigration-refugies-citoyennete/services/etudier-canada/permis-etudes/admissibilite.html",
    image: pontMetier,
  },
  {
    theme: "study",
    source: "Radio-Canada",
    date: "fév. 2024",
    title: "Plusieurs étudiants étrangers vivent dans la pauvreté",
    excerpt:
      "Logement saturé, horaires plafonnés, santé mentale touchée. Un projet d’études réussi se prépare avant l’arrivée.",
    url: "https://ici.radio-canada.ca/nouvelle/2048670/etudiants-etrangers-pauvrete-logement-brampton-mississauga",
    image: problemSettlementChance,
  },
  {
    theme: "employment",
    source: "Statistique Canada",
    date: "oct. 2025",
    title: "34,7 % des immigrants récents se disent surqualifiés",
    excerpt:
      "Un diplôme ne garantit pas un poste à la mesure du profil. L’employabilité et le métier ciblé structurent le plan.",
    url: "https://www150.statcan.gc.ca/n1/daily-quotidien/251010/dq251010a-fra.htm",
    image: emploiHero,
  },
  {
    theme: "employment",
    source: "Institut du Québec",
    date: "2025",
    title: "Les immigrants temporaires : un chômage près de trois fois plus élevé",
    excerpt: "11,7 % chez les temporaires, contre 4,1 % chez les natifs au Québec. Un permis n’est pas un emploi.",
    url: "https://institutduquebec.ca/publications/bilan-2024-de-l-emploi-au-quebec",
    image: problemWrongPath,
  },
  {
    theme: "salary",
    source: "Statistique Canada",
    date: "2025",
    title: "Salaires horaires moyens selon la profession",
    excerpt:
      "Les écarts de rémunération entre provinces et métiers restent marqués. Un salaire brut n’est pas encore un budget de vie.",
    url: "https://www150.statcan.gc.ca/t1/tbl1/fr/tv.action?pid=1410006401",
    image: finance1,
  },
  {
    theme: "salary",
    source: "Directeur parlementaire du budget",
    date: "2024",
    title: "Le plan d’immigration 2025-2027 et l’écart de logements",
    excerpt:
      "Même avec des cibles plus basses, l’écart reste de centaines de milliers d’unités. Le loyer pèse dès le premier mois.",
    url: "https://www.pbo-dpb.ca/fr/additional-analyses--analyses-complementaires/BLOG-2425-006--impact-2025-2027-immigration-levels-plan-canada-housing-gap--repercussions-plan-niveaux-immigration-2025-2027-ecart-offre-logement-canada",
    image: montrealFall,
  },
  {
    theme: "nationality",
    source: "IRCC",
    date: "2025",
    title: "Citoyenneté canadienne : qui peut présenter une demande",
    excerpt:
      "Résidence permanente, présence physique et délais légaux : la nationalité vient après un parcours, jamais avant.",
    url: "https://www.canada.ca/fr/immigration-refugies-citoyennete/services/citoyennete-canadienne/devenir-citoyen-canadien/admissibilite.html",
    image: pontVille,
  },
  {
    theme: "nationality",
    source: "IRCC",
    date: "2025",
    title: "Présence physique pour la citoyenneté",
    excerpt:
      "En règle générale, environ 2 à 3 ans de présence physique après la RP. Ce n’est pas une promesse automatique.",
    url: "https://www.canada.ca/fr/immigration-refugies-citoyennete/services/citoyennete-canadienne/devenir-citoyen-canadien/admissibilite/presence-physique.html",
    image: quebecWinter,
  },
  {
    theme: "business",
    source: "Innovation, Sciences et Développement économique",
    date: "2025",
    title: "Lancer et faire croître une entreprise",
    excerpt:
      "Financement, formalités et réseaux d’accompagnement : l’écosystème canadien est structuré pour créer, sous conditions.",
    url: "https://www.ic.gc.ca/eic/site/icgc.nsf/fra/h_07060.html",
    image: pontEquipe,
  },
  {
    theme: "business",
    source: "Banque de développement du Canada",
    date: "2025",
    title: "Financer sa croissance au Canada",
    excerpt:
      "Prêts, taux et outils de crédit accessibles avec un dossier solide, souvent sans le réseau de cautions familiales d’ailleurs.",
    url: "https://www.bdc.ca/fr/articles-outils/argent-finance",
    image: emploiBureau,
  },
  {
    theme: "flexibility",
    source: "IRCC",
    date: "2025",
    title: "Travailler pendant vos études",
    excerpt:
      "Selon le permis, un étudiant peut travailler un nombre d’heures limité. La combinaison étude + travail dépend du statut.",
    url: "https://www.canada.ca/fr/immigration-refugies-citoyennete/services/etudier-canada/travail/travailler.html",
    image: emploiConstruction,
  },
  {
    theme: "flexibility",
    source: "IRCC",
    date: "2025",
    title: "Permis de travail postdiplôme (PTPD)",
    excerpt:
      "Après des études admissibles, un permis ouvert peut ouvrir la suite du projet, sous conditions strictes.",
    url: "https://www.canada.ca/fr/immigration-refugies-citoyennete/services/etudier-canada/travail/apres-obtention-diplome/a-propos.html",
    image: montrealWinter,
  },
];

export function opportunityThemeLabel(id: OpportunityThemeId) {
  return OPPORTUNITY_THEMES.find((theme) => theme.id === id)?.title ?? id;
}

export function opportunityPressFor(theme: OpportunityThemeId) {
  return opportunityPress.filter((article) => article.theme === theme);
}
