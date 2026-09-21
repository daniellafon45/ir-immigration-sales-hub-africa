import emploiBureau from "@/assets/canada-live/emploi-bureau.jpg";
import emploiConstruction from "@/assets/canada-live/emploi-construction.jpg";
import emploiHero from "@/assets/canada-live/emploi-hero.jpg";
import pontEquipe from "@/assets/canada-live/pont-equipe.jpg";
import pontMetier from "@/assets/canada-live/pont-metier.jpg";
import pontVille from "@/assets/canada-live/pont-ville.jpg";
import montrealFall from "@/assets/places/montreal-fall.jpg";
import montrealWinter from "@/assets/places/montreal-winter.jpg";
import quebecWinter from "@/assets/places/quebec-winter.jpg";
import problemSettlementChance from "@/assets/pitch/problem-settlement-chance.jpg";
import problemWrongPath from "@/assets/pitch/problem-wrong-path.jpg";
import finance1 from "@/assets/professions/finance-1.jpg";

export type CountryCompareAxisId =
  | "credit"
  | "equality"
  | "quality"
  | "salary"
  | "entrepreneurship"
  | "education"
  | "nationality";

export type CountryComparePressArticle = {
  theme: CountryCompareAxisId;
  source: string;
  date: string;
  title: string;
  excerpt: string;
  url: string;
  image: string;
};

export const COUNTRY_COMPARE_AXIS_IDS: CountryCompareAxisId[] = [
  "credit",
  "equality",
  "quality",
  "salary",
  "entrepreneurship",
  "education",
  "nationality",
];

export const countryComparePress: CountryComparePressArticle[] = [
  {
    theme: "credit",
    source: "ACFC",
    date: "2025",
    title: "Comprendre votre dossier de crédit",
    excerpt:
      "Au Canada, un historique de crédit solide ouvre prêts, hypothèques et outils bancaires — surtout avec un statut stable.",
    url: "https://www.canada.ca/fr/agence-consommation-matiere-financiere/services/dossier-credit.html",
    image: finance1,
  },
  {
    theme: "credit",
    source: "Banque du Canada",
    date: "2025",
    title: "Taux d’intérêt et crédit aux ménages",
    excerpt:
      "Les taux et l’accès au crédit varient selon le cycle économique. Un projet d’installation doit intégrer le coût réel de l’emprunt.",
    url: "https://www.banqueducanada.ca/taux/",
    image: montrealFall,
  },
  {
    theme: "equality",
    source: "Commission canadienne des droits de la personne",
    date: "2025",
    title: "La Loi canadienne sur les droits de la personne",
    excerpt:
      "Discrimination fondée sur l’origine, le sexe ou le handicap : un cadre fédéral protège l’égalité des chances au travail et dans les services.",
    url: "https://www.chrc-ccdp.gc.ca/fr/vos-droits/vos-droits-en-vertu-de-la-loi-canadienne-sur-les-droits-de-la-personne",
    image: pontEquipe,
  },
  {
    theme: "equality",
    source: "Gouvernement du Canada",
    date: "2025",
    title: "Égalité des genres et inclusion",
    excerpt:
      "Des politiques publiques et des obligations légales encadrent l’équité. Ce n’est pas parfait — mais les règles sont écrites et opposables.",
    url: "https://www.canada.ca/fr/identite-genre-egalite-femmes.html",
    image: emploiBureau,
  },
  {
    theme: "quality",
    source: "Statistique Canada",
    date: "2024",
    title: "Qualité de vie au Canada : un portrait",
    excerpt:
      "Santé, sécurité, logement et équilibre travail-vie : des indicateurs publics permettent de comparer les provinces, pas seulement les slogans.",
    url: "https://www150.statcan.gc.ca/n1/pub/11-631-x/11-631-x2024001-fra.htm",
    image: pontVille,
  },
  {
    theme: "quality",
    source: "OCDE",
    date: "2024",
    title: "Better Life Index — Canada",
    excerpt:
      "Revenu, emploi, éducation et environnement : le Canada figure parmi les pays à fort score de bien-être relatif.",
    url: "https://www.oecdbetterlifeindex.org/fr/countries/canada-fr/",
    image: quebecWinter,
  },
  {
    theme: "salary",
    source: "Statistique Canada",
    date: "2025",
    title: "Salaires horaires moyens selon la profession",
    excerpt:
      "Les écarts de rémunération entre provinces et métiers restent marqués. Un salaire brut n’est pas encore un budget de vie.",
    url: "https://www150.statcan.gc.ca/t1/tbl1/fr/tv.action?pid=1410006401",
    image: emploiHero,
  },
  {
    theme: "salary",
    source: "Directeur parlementaire du budget",
    date: "2024",
    title: "Le plan d’immigration 2025-2027 et l’écart de logements",
    excerpt:
      "Même avec des cibles plus basses, l’écart reste de centaines de milliers d’unités. Le loyer pèse dès le premier mois.",
    url: "https://www.pbo-dpb.ca/fr/additional-analyses--analyses-complementaires/BLOG-2425-006--impact-2025-2027-immigration-levels-plan-canada-housing-gap--repercussions-plan-niveaux-immigration-2025-2027-ecart-offre-logement-canada",
    image: problemSettlementChance,
  },
  {
    theme: "entrepreneurship",
    source: "IRCC",
    date: "2025",
    title: "Démarrer une entreprise au Canada",
    excerpt:
      "C11, mutation intraentreprise ou programmes provinciaux : chaque voie a ses preuves et ses seuils.",
    url: "https://www.canada.ca/fr/immigration-refugies-citoyennete/services/travailler-canada/permis/entreprises.html",
    image: pontEquipe,
  },
  {
    theme: "entrepreneurship",
    source: "Innovation, Sciences et Développement économique",
    date: "2025",
    title: "Lancer et faire croître une entreprise",
    excerpt:
      "Financement, formalités et réseaux d’accompagnement : l’écosystème canadien est structuré pour créer — sous conditions.",
    url: "https://www.ic.gc.ca/eic/site/icgc.nsf/fra/h_07060.html",
    image: emploiConstruction,
  },
  {
    theme: "education",
    source: "IRCC",
    date: "2025",
    title: "Permis d’études : qui peut présenter une demande",
    excerpt:
      "Un établissement désigné, des fonds suffisants et un projet d’études sérieux : le Canada conditionne l’entrée aux études, pas au visa seul.",
    url: "https://www.canada.ca/fr/immigration-refugies-citoyennete/services/etudier-canada/permis-etudes/admissibilite.html",
    image: pontMetier,
  },
  {
    theme: "education",
    source: "Radio-Canada",
    date: "fév. 2024",
    title: "Plusieurs étudiants étrangers vivent dans la pauvreté",
    excerpt:
      "Logement saturé, horaires plafonnés, santé mentale touchée. Un projet d’études réussi se prépare avant l’arrivée.",
    url: "https://ici.radio-canada.ca/nouvelle/2048670/etudiants-etrangers-pauvrete-logement-brampton-mississauga",
    image: problemWrongPath,
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
    image: montrealWinter,
  },
];

export function countryCompareAxisLabel(id: CountryCompareAxisId) {
  const labels: Record<CountryCompareAxisId, string> = {
    credit: "Accès au crédit",
    equality: "Égalité des chances",
    quality: "Qualité de vie",
    salary: "Niveau de salaire",
    entrepreneurship: "Écosystème entrepreneurial",
    education: "Qualité de l’éducation",
    nationality: "Chemin vers la nationalité",
  };
  return labels[id] ?? id;
}

export function countryComparePressFor(axis: CountryCompareAxisId) {
  return countryComparePress.filter((article) => article.theme === axis);
}
