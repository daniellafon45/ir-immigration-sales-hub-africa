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
  | "urgent"
  | "status-myth"
  | "language";

export type FailureRisk = {
  id: FailureRiskId;
  label: string;
  cost: string;
  image: string;
};

export type FailurePressTheme = "housing" | "jobs" | "distress";

/** Situations du client auxquelles un article s’applique. */
export type PressTag =
  | "all"
  | "student"
  | "temp-worker"
  | "quebec"
  | "francophone-outside-qc"
  | "family"
  | "low-budget"
  | "regulated";

export type FailurePressArticle = {
  theme: FailurePressTheme;
  source: string;
  /** Date de publication (AAAA-MM-JJ), lue sur la page de l’article. */
  publishedOn: string;
  date: string;
  title: string;
  excerpt: string;
  url: string;
  image: string;
  tags: PressTag[];
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
  {
    id: "status-myth",
    label: "Confondre temporaire et résidence permanente",
    cost: "Un permis temporaire n’ouvre pas automatiquement la RP.",
    image: problemWrongPath,
  },
  {
    id: "language",
    label: "Négliger les exigences linguistiques",
    cost: "Sans score, plusieurs voies restent fermées.",
    image: emploiHero,
  },
];

/**
 * Articles vérifiés le 2026-10-18 (lien actif, date lue sur la page).
 * `npm run verify:sources` signale les liens morts et les articles de plus de 12 mois.
 */
export const failurePress: FailurePressArticle[] = [
  {
    theme: "housing",
    source: "Radio-Canada",
    publishedOn: "2026-09-10",
    date: "sept. 2026",
    title: "Abordabilité : l’offre de logements encore loin de ses cibles, selon la SCHL",
    excerpt: "Les mises en chantier ne suffisent pas à rendre les loyers abordables. Arriver sans plan de logement, c’est arriver dans un marché encore tendu.",
    url: "https://ici.radio-canada.ca/nouvelle/2282328/abordabilite-logement-schl-rapport-construction",
    image: pontVille,
    tags: ["all", "family", "low-budget"],
  },
  {
    theme: "housing",
    source: "La Presse",
    publishedOn: "2026-08-18",
    date: "août 2026",
    title: "Taux d’inoccupation : 2028, point de bascule du marché locatif",
    excerpt: "Le taux d’inoccupation remonte dans le Grand Montréal, mais l’offre nouvelle est surtout haut de gamme : les logements abordables restent rares.",
    url: "https://www.lapresse.ca/affaires/marche-immobilier/2026-08-18/taux-d-inoccupation-des-logements/2028-point-de-bascule-du-marche-locatif.php",
    image: montrealFall,
    tags: ["quebec", "family"],
  },
  {
    theme: "housing",
    source: "Le Devoir",
    publishedOn: "2026-07-28",
    date: "juil. 2026",
    title: "Pourquoi les loyers ne baissent-ils pas au Québec ?",
    excerpt: "L’offre progresse, mais les loyers ne suivent pas à la baisse. Un budget de départ doit prévoir des loyers élevés dès l’arrivée.",
    url: "https://www.ledevoir.com/economie/997694/pourquoi-loyers-ne-baissent-ils-pas-quebec",
    image: quebecWinter,
    tags: ["quebec", "low-budget"],
  },
  {
    theme: "housing",
    source: "Radio-Canada",
    publishedOn: "2026-01-01",
    date: "janv. 2026",
    title: "Plus d’argent exigé pour les étudiants étrangers",
    excerpt: "Au Québec, la somme minimale exigée d’un étudiant étranger passe à 24 617 $ en 2026, contre 15 508 $ en 2025.",
    url: "https://ici.radio-canada.ca/info/breve/15021/etudiants-etrangers-exigences-financieres-etudes-quebec",
    image: problemSettlementChance,
    tags: ["student", "quebec", "low-budget"],
  },
  {
    theme: "housing",
    source: "Radio-Canada",
    publishedOn: "2025-12-13",
    date: "déc. 2025",
    title: "À quoi s’attendre du marché locatif en 2026 ?",
    excerpt: "Loyers, taux d’inoccupation, nouvelles constructions : ce qui attend les locataires — et les nouveaux arrivants — cette année.",
    url: "https://ici.radio-canada.ca/info/breve/14832/prix-logements-loyer-marche-locatif-2026",
    image: montrealWinter,
    tags: ["all", "family"],
  },
  {
    theme: "jobs",
    source: "Statistique Canada",
    publishedOn: "2026-10-09",
    date: "oct. 2026",
    title: "Enquête sur la population active, septembre 2026",
    excerpt: "Le chômage atteint 6,5 % et l’emploi recule de 68 000 postes. Un permis n’est pas un emploi : le marché se resserre.",
    url: "https://www150.statcan.gc.ca/n1/daily-quotidien/261009/dq261009a-fra.htm",
    image: emploiHero,
    tags: ["all", "temp-worker"],
  },
  {
    theme: "jobs",
    source: "La Liberté",
    publishedOn: "2026-04-07",
    date: "avr. 2026",
    title: "Emploi au Canada : du progrès pour les nouveaux arrivants",
    excerpt: "Les nouveaux arrivants trouvent plus vite un premier emploi, mais moins de la moitié (42,7 %) obtiennent la pleine reconnaissance d’une profession réglementée.",
    url: "https://www.la-liberte.ca/2026/04/07/emploi-au-canada-du-progres-pour-les-nouveaux-arrivants/",
    image: finance1,
    tags: ["all", "regulated", "francophone-outside-qc"],
  },
  {
    theme: "jobs",
    source: "La Presse",
    publishedOn: "2026-05-13",
    date: "mai 2026",
    title: "Québec accélère le traitement des dossiers des travailleurs étrangers en fin de permis",
    excerpt: "Priorité PSTQ pour les travailleurs temporaires dont le permis arrive à échéance : sans demande déposée à temps, le statut se fragilise.",
    url: "https://www.lapresse.ca/actualites/2026-05-13/programme-de-selection-des-travailleurs-qualifies/quebec-accelere-le-traitement-des-dossiers-des-travailleurs-etrangers-en-fin-de-permis.php",
    image: emploiBureau,
    tags: ["temp-worker", "quebec"],
  },
  {
    theme: "jobs",
    source: "Radio-Canada",
    publishedOn: "2026-08-20",
    date: "août 2026",
    title: "La baisse des étudiants étrangers ébranle les collèges régionaux de Colombie-Britannique",
    excerpt: "Inscriptions internationales en chute de 66 %, programmes suspendus : un projet d’études doit viser un programme et un établissement solides.",
    url: "https://ici.radio-canada.ca/nouvelle/2271283/universites-regions-etudiants-etrangers",
    image: pontEquipe,
    tags: ["student"],
  },
  {
    theme: "jobs",
    source: "IRCC",
    publishedOn: "2026-09-29",
    date: "sept. 2026",
    title: "De nouveaux projets pour l’immigration francophone hors Québec",
    excerpt: "Ottawa finance de nouveaux projets pour attirer et retenir les francophones dans les communautés en situation minoritaire.",
    url: "https://www.canada.ca/fr/immigration-refugies-citoyennete/nouvelles/2026/09/le-canada-appuie-de-nouveaux-projets-visant-a-promouvoir-limmigration-francophone-et-a-renforcer-les-communautes-francophones-en-situation-minoritaire.html",
    image: pontMetier,
    tags: ["francophone-outside-qc"],
  },
  {
    theme: "distress",
    source: "Radio-Canada",
    publishedOn: "2026-01-28",
    date: "janv. 2026",
    title: "Québec : 6300 travailleurs étrangers de la santé menacés d’un départ forcé en 2026",
    excerpt: "Des permis arrivent à échéance sans voie permanente assurée : sans stratégie de statut, même un emploi en pénurie ne protège pas.",
    url: "https://ici.radio-canada.ca/nouvelle/2224253/sante-travailleurs-etrangers-caq-infirmieres",
    image: problemWrongPath,
    tags: ["temp-worker", "quebec", "regulated"],
  },
  {
    theme: "distress",
    source: "Statistique Canada",
    publishedOn: "2026-04-22",
    date: "avr. 2026",
    title: "Corrélats socioéconomiques de la solitude chez les immigrants ayant une incapacité",
    excerpt: "Solitude, insécurité alimentaire et besoins impérieux en logement : l’isolement pèse lourd quand le réseau de soutien manque.",
    url: "https://www150.statcan.gc.ca/n1/pub/36-28-0001/2026004/article/00004-fra.htm",
    image: problemCareerLate,
    tags: ["all", "low-budget"],
  },
  {
    theme: "distress",
    source: "PLOS One",
    publishedOn: "2026-02-24",
    date: "févr. 2026",
    title: "Santé mentale, soutien social perçu et sentiment d’appartenance chez les immigrants",
    excerpt: "Un soutien social faible est associé à plus d’anxiété et de dépression, surtout les premières années et avec une maîtrise limitée de la langue.",
    url: "https://journals.plos.org/plosone/article?id=10.1371/journal.pone.0343075",
    image: problemIncoherentFile,
    tags: ["all", "family"],
  },
];
