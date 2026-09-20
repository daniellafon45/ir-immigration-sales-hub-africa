import type { CardItem } from "@/components/ui/cards";
import { canadaLiveGallery, canadaLiveHero } from "@/data/canada-live-media";
import { startupVisaNote } from "@/data/business-paths";
import { c11WorkingCapital, pnpEntrepreneur } from "@/data/business-thresholds";
import { familyFeesFor } from "@/data/family-fees";
import { familyLinkById } from "@/data/family-links";
import { requiredIncome, sizeFor } from "@/data/family-lico";
import { nocByCode, teerOf } from "@/data/noc-2021";
import { familyHasSpouse, type Profile } from "@/data/profile";
import { professionNoc } from "@/data/profession-noc";
import { ALL_CANADA, isAllCanada, provinceCode, provinceData } from "@/data/provinces";
import { localizeCanadaLivePages } from "@/data/canada-live-place";
import { eta, visitFeesFor, visitorVisa } from "@/data/visit-fees";
import { visitPurposeById } from "@/data/visit-purposes";
import { workFeesFor, workPermitFee } from "@/data/work-fees";
import { closingDeckPills } from "@/lib/closing-pills";
import { money } from "@/lib/format";
import { studyProgramFor } from "@/lib/study-program";

export type CanadaLiveStat = {
  label: string;
  value: string;
  note: string;
};

export type CanadaLiveArticle = {
  source: string;
  date: string;
  title: string;
  excerpt: string;
  url: string;
};

export type CanadaLiveTalk = {
  label: string;
  body: string;
};

export type CanadaLivePage = {
  id: string;
  kicker: string;
  title: string;
  lead: string;
  pills: string[];
  panelTitle: string;
  ask: string;
  heroPlace: string;
  heroImage: string;
  heroCaption: string;
  gallery: CardItem[];
  stats: CanadaLiveStat[];
  articles: CanadaLiveArticle[];
  talks: CanadaLiveTalk[];
  actions?: Array<{ id: string; label: string }>;
};

export const canadaLivePages: CanadaLivePage[] = [
  {
    id: "vue",
    heroPlace: canadaLiveHero("vue").place,
    heroImage: canadaLiveHero("vue").image,
    gallery: canadaLiveGallery("vue"),
    kicker: "Canada Live · Vue d'ensemble",
    title: "Le Canada accueille encore. La sélection, elle, se resserre.",
    lead: "Le pays reste ouvert. Le profil, la langue et la stratégie pèsent davantage qu'avant.",
    pills: ["IRCC 2026-2028", "Statistique Canada"],
    panelTitle: "Le Canada n'est pas fermé",
    ask: "Dans 12 mois, voulez-vous encore chercher une stratégie, ou l'avoir déjà lancée ?",
    heroCaption: "Le paysage fait rêver. Le plan des niveaux, lui, décide qui entre.",
    stats: [
      {
        label: "Admissions RP prévues",
        value: "380 000",
        note: "par année, 2026 à 2028",
      },
      {
        label: "Part économique visée",
        value: "64 %",
        note: "en 2027 et 2028",
      },
      {
        label: "Francophones hors Québec",
        value: "9 %",
        note: "cible 2026, 10,5 % en 2028",
      },
      {
        label: "Cible 2028",
        value: "35 175",
        note: "admissions francophones hors Québec",
      },
    ],
    articles: [
      {
        source: "IRCC",
        date: "4 nov. 2025",
        title: "Plan des niveaux 2026-2028 : 380 000 résidents permanents par an",
        excerpt: "Ottawa stabilise les admissions et monte la part économique à 64 %, avec des cibles francophones plus hautes hors Québec.",
        url: "https://www.canada.ca/fr/immigration-refugies-citoyennete/organisation/mandat/initiatives-ministerielles/niveaux/renseignements-supplementaires-niveaux-immigration-2026-2028.html",
      },
      {
        source: "IRCC",
        date: "janv. 2026",
        title: "Le Canada dépasse son objectif d'immigration francophone en 2025",
        excerpt: "Plus de 29 500 admissions francophones hors Québec, soit 8,9 %. Les cibles passent à 9 %, puis 10,5 % en 2028.",
        url: "https://www.canada.ca/fr/immigration-refugies-citoyennete/nouvelles/2026/01/le-canada-depasse-son-objectif-dimmigration-francophone-en-2025.html",
      },
      {
        source: "Directeur parlementaire du budget",
        date: "2026",
        title: "Implications démographiques du Plan des niveaux 2026-2028",
        excerpt: "380 000 RP par an, soit environ 20 % de moins que le sommet de 484 000 admissions en 2024. La sélection devient plus ciblée.",
        url: "https://www.pbo-dpb.ca/fr/publications/RP-2526-025-S--demographic-implications-2026-2028-immigration-levels-plan--implications-demographiques-plan-niveaux-immigration-2026-2028",
      },
    ],
    talks: [
      {
        label: "Aujourd'hui",
        body: "Le Canada n'a pas fermé. Il a recentré. 380 000 places, c'est encore un pays d'accueil. Ce n'est plus un pays où l'on improvise un dossier.",
      },
      {
        label: "Les priorités",
        body: "Le plan IRCC vise 64 % d'admissions économiques. Le métier, la langue et un dossier cohérent pèsent plus que le seul désir de partir.",
      },
      {
        label: "L'avantage français",
        body: "Si vous parlez français, c'est un vrai atout. Hors Québec, la cible francophone monte à 10,5 % en 2028. C'est un avantage réel, pas un slogan.",
      },
    ],
  },
  {
    id: "demographie",
    heroPlace: canadaLiveHero("demographie").place,
    heroImage: canadaLiveHero("demographie").image,
    gallery: canadaLiveGallery("demographie"),
    kicker: "Canada Live · Démographie",
    title: "Le Canada vieillit. Les besoins, eux, ne diminuent pas.",
    lead: "Sans relève naturelle suffisante, le pays doit renouveler sa main-d'œuvre, ses soignants et ses contribuables. C'est le vrai contexte du projet.",
    pills: ["Fécondité 2024", "Vieillissement"],
    panelTitle: "Lecture utile",
    ask: "Si le Canada a déjà besoin de renouveler sa population active, où {name} peut apporter le plus de valeur ?",
    heroCaption: "Un pays qui aime ses aînés doit aussi attirer ceux qui peuvent les soigner, les loger et les relayer.",
    stats: [
      {
        label: "Fécondité 2024",
        value: "1,25",
        note: "enfant par femme, creux historique",
      },
      {
        label: "Seuil de renouvellement",
        value: "2,1",
        note: "aucune province hors Nunavut ne l'atteint",
      },
      {
        label: "Âge moyen à la maternité",
        value: "31,8 ans",
        note: "sommet, contre 26,7 ans en 1976",
      },
      {
        label: "Naissances, mère née à l'étranger",
        value: "42,3 %",
        note: "près du double du niveau de 1997",
      },
    ],
    articles: [
      {
        source: "Statistique Canada",
        date: "24 sept. 2025",
        title: "Fécondité 2024 : 1,25 enfant par femme, un creux historique",
        excerpt: "Le Canada rejoint le groupe des pays à fécondité ultra-faible. La Colombie-Britannique tombe à 1,02. Le Québec s'établit à 1,34.",
        url: "https://www150.statcan.gc.ca/n1/daily-quotidien/250924/dq250924d-fra.htm",
      },
      {
        source: "Radio-Canada",
        date: "2025",
        title: "Les Québécois achètent maintenant plus de couches pour adultes que pour enfants",
        excerpt: "En 2024, le Québec a enregistré plus de décès que de naissances. L'image est brutale, mais elle rend le vieillissement immédiat.",
        url: "https://ici.radio-canada.ca/nouvelle/2280308/couches-adultes-enfants-natalite-quebec",
      },
      {
        source: "Statistique Canada",
        date: "2026",
        title: "Projets d'avenir : moins d'enfants, plus de pression sur la main-d'œuvre",
        excerpt: "Un ISF de 1,25 expose le pays à des pressions sur la population active, les soins et les régimes de retraite.",
        url: "https://www150.statcan.gc.ca/n1/pub/75-006-x/2026002/article/00003-fra.htm",
      },
    ],
    talks: [
      {
        label: "Constat",
        body: "1,25 enfant par femme, ce n'est pas une opinion. C'est Statistique Canada. Le Canada ne se renouvelle plus assez par les naissances.",
      },
      {
        label: "Image",
        body: "L'article de Radio-Canada sur les couches pour adultes n'est pas du sensationnalisme. Il rend visible un pays qui a plus besoin de soignants que de berceaux.",
      },
      {
        label: "Pont",
        body: "42 % des nouveau-nés ont déjà une mère née à l'étranger. L'immigration n'est pas un extra. C'est déjà le moteur du renouvellement.",
      },
    ],
  },
  {
    id: "emploi",
    heroPlace: canadaLiveHero("emploi").place,
    heroImage: canadaLiveHero("emploi").image,
    gallery: canadaLiveGallery("emploi"),
    kicker: "Canada Live · Emploi",
    title: "Le marché s'est calmé. Les postes à pourvoir, eux, restent là.",
    lead: "Le taux national ne raconte pas le métier de {name}. Il faut relier chômage, postes vacants et province avant de parler de programme.",
    pills: ["T4 2025", "EPA 2026"],
    panelTitle: "Ce que ça change",
    ask: "Parmi les métiers du foyer, lequel se relie le plus clairement à un besoin réel au Canada ?",
    heroCaption: "Les villes tournent encore. La question n'est pas s'il y a du travail. C'est où, pour qui, et avec quel dossier.",
    stats: [
      {
        label: "Postes vacants",
        value: "495 100",
        note: "T4 2025, Statistique Canada",
      },
      {
        label: "Chômage",
        value: "6,7 %",
        note: "février 2026, Enquête sur la population active",
      },
      {
        label: "Salaire horaire offert",
        value: "29,25 $",
        note: "moyenne des postes vacants, T4 2025",
      },
      {
        label: "Postes vacants au Québec",
        value: "118 700",
        note: "T4 2025, en hausse de 5 300",
      },
    ],
    articles: [
      {
        source: "Statistique Canada",
        date: "17 mars 2026",
        title: "Postes vacants, quatrième trimestre de 2025 : 495 100 postes",
        excerpt: "Le volume se stabilise après trois baisses. 28,5 % des postes restent ouverts 90 jours ou plus. Le Québec remonte à 118 700.",
        url: "https://www150.statcan.gc.ca/n1/daily-quotidien/260317/dq260317a-fra.htm",
      },
      {
        source: "Institut C.D. Howe",
        date: "2026",
        title: "Bilan 2025 du marché du travail : moins tendu, encore inégal",
        excerpt: "Environ 498 700 postes vacants en moyenne en 2025. Le resserrement de 2022 est fini. Les écarts de métiers, eux, restent.",
        url: "https://cdhowe.org/publication/2025-labour-market-review-trade-uncertainty-structural-pressures-and-policy-priorities-for-canada",
      },
      {
        source: "Indeed Hiring Lab",
        date: "18 déc. 2025",
        title: "Tendances de l'emploi 2026 : le Québec résiste mieux que l'Ontario",
        excerpt: "Le marché a ramolli partout, mais le Québec garde le chômage le plus bas. La province visée n'est pas un détail.",
        url: "https://hiringlab.indeed.com/en-ca/2025/12/18/indeed-2026-canadian-jobs-hiring-trends-report",
      },
    ],
    talks: [
      {
        label: "Nuance",
        body: "Le marché s'est détendu depuis 2022. 495 100 postes restent pourtant ouverts, et certains métiers peinent encore à recruter.",
      },
      {
        label: "Province",
        body: "Le Québec a 118 700 postes vacants. L'Ontario a un chômage plus élevé. La province que vous visez change autant le projet que votre métier.",
      },
      {
        label: "Suite",
        body: "Le chiffre national n'embauche personne. Le métier de {name}, lui, peut trouver une place.",
      },
    ],
  },
  {
    id: "pont",
    heroPlace: canadaLiveHero("pont").place,
    heroImage: canadaLiveHero("pont").image,
    gallery: canadaLiveGallery("pont"),
    kicker: "Canada Live · Votre projet",
    title: "Que signifient ces chiffres pour {name} ?",
    lead: "La bonne question n'est plus le Canada en général. C'est où un(e) {profession} trouve le meilleur compromis entre salaire, emplois et coût de la vie.",
    pills: ["Profil", "{province}"],
    panelTitle: "Prochaine action",
    ask: "Si on relie {profession} à une province réaliste aujourd'hui, quelle est la première décision utile ?",
    heroCaption: "Le rêve se visite. Le projet se construit autour d'un métier, d'une province et d'un calendrier.",
    stats: [
      {
        label: "Places RP encore ouvertes",
        value: "380 000",
        note: "chaque année jusqu'en 2028",
      },
      {
        label: "Relève naturelle",
        value: "insuffisante",
        note: "fécondité à 1,25 en 2024",
      },
      {
        label: "Postes encore vacants",
        value: "495 100",
        note: "même après le reflux du marché",
      },
      {
        label: "Avantage langue",
        value: "francophone",
        note: "cible 9 % hors Québec dès 2026",
      },
    ],
    articles: [
      {
        source: "Gowling WLG",
        date: "2025",
        title: "Le plan 2026-2028 recentre l'immigration sur les compétences",
        excerpt: "La part économique monte. Les temporaires baissent. Un profil préparé pèse plus qu'un profil qui attend.",
        url: "https://gowlingwlg.com/en/insights-resources/articles/2025/canada-2026-2028-immigration-levels-plan-from-budget-2025",
      },
      {
        source: "RBC Thought Leadership",
        date: "2026",
        title: "Une stratégie d'immigration plus sélective",
        excerpt: "Le plafond de 380 000 RP est un choix de qualité. Le dossier doit coller à un besoin, pas seulement à un désir de partir.",
        url: "https://www.rbc.com/en/thought-leadership/skills-and-post-secondary/a-smarter-immigration-strategy",
      },
      {
        source: "IRCC",
        date: "2026",
        title: "Les cibles francophones hors Québec continuent de monter",
        excerpt: "9 % en 2026, 10,5 % en 2028. Pour un foyer francophone, c'est un levier à activer tout de suite, pas plus tard.",
        url: "https://www.canada.ca/fr/immigration-refugies-citoyennete/nouvelles/2026/01/le-canada-depasse-son-objectif-dimmigration-francophone-en-2025.html",
      },
    ],
    talks: [
      {
        label: "Recentrer",
        body: "Ces chiffres se ramènent à votre foyer. Le Canada vieillit, recrute encore, et sélectionne davantage. Vous n'avez pas besoin de tous les chiffres. Vous avez besoin d'une voie.",
      },
      {
        label: "Perte",
        body: "Attendre 12 mois ne gèle pas le profil. Les places restent limitées, et les candidats mieux préparés passent devant.",
      },
      {
        label: "Action",
        body: "La suite utile : voir les opportunités de votre métier, puis comparer les provinces. Une décision, pas un catalogue.",
      },
    ],
    actions: [
      { id: "opportunites", label: "Voir les opportunités" },
      { id: "provinces", label: "Comparer les provinces" },
    ],
  },
];

const studyOverlays: Record<string, Partial<CanadaLivePage>> = {
  vue: {
    kicker: "Canada Live · Études",
    title: "Le Canada forme encore. Le permis d'études, lui, se prépare.",
    lead: "Un programme, une preuve de fonds, une province. Le diplôme n'est pas un ticket automatique vers la résidence.",
    pills: ["Permis d'études", "Étudiants étrangers"],
    panelTitle: "Le Canada étudie encore",
    ask: "Dans 12 mois, voulez-vous encore chercher un programme, ou déjà être admis ?",
    stats: [
      { label: "Permis d'études actifs", value: "1 M+", note: "ordre de grandeur, étudiants étrangers" },
      { label: "Nouveaux permis / an", value: "~400 000", note: "volume récent, avant resserrement" },
      { label: "Postdiplôme (PGWP)", value: "jusqu'à 3 ans", note: "selon le programme admissible" },
      { label: "Frais internationaux", value: "14 à 42 k$", note: "cégep à université, par année" },
    ],
    talks: [
      {
        label: "Aujourd'hui",
        body: "Le Canada accueille encore des étudiants. Il exige un vrai programme, des fonds et un projet cohérent. Ce n'est plus un visa de passage.",
      },
      {
        label: "Les priorités",
        body: "Le dossier tient sur trois preuves : l'admission, la scolarité, et de quoi vivre. Le conjoint peut travailler. L'étudiant, lui, vise le diplôme.",
      },
      {
        label: "L'avantage",
        body: "Un programme qui mène à un métier demandé change la conversation. Le diplôme n'est pas décoratif : il ouvre le postdiplôme.",
      },
    ],
  },
  demographie: {
    kicker: "Canada Live · Campus",
    title: "Les campus recrutent. La sélection, elle, se resserre.",
    lead: "Le pays a besoin de diplômés. Il ne finance plus un séjour improvisé. Le programme et les fonds pèsent autant que le désir d'étudier.",
    pills: ["Campus", "Postdiplôme"],
    panelTitle: "Lecture utile",
    ask: "Si le Canada forme encore, quel programme donne à {name} un métier, pas seulement un diplôme ?",
    stats: [
      { label: "Étudiants étrangers", value: "1 étudiant / 4", note: "part élevée dans plusieurs campus" },
      { label: "Postdiplôme", value: "PGWP", note: "travail après un programme admissible" },
      { label: "Conjoint accompagnant", value: "permis ouvert", note: "pendant les études du candidat" },
      { label: "Fonds de subsistance", value: "IRCC / CAQ", note: "étudiant, conjoint, chaque enfant" },
    ],
    talks: [
      {
        label: "Constat",
        body: "Les campus canadiens reposent déjà sur les étudiants étrangers. Ce n'est pas une porte ouverte : c'est une place à justifier.",
      },
      {
        label: "Image",
        body: "Un conjoint qui travaille et un enfant à l'école changent le budget. Le foyer entier doit tenir l'année 1, pas seulement l'étudiant.",
      },
      {
        label: "Pont",
        body: "Le bon programme relie le campus au marché. Le mauvais programme coûte cher et n'ouvre rien après le diplôme.",
      },
    ],
  },
  emploi: {
    kicker: "Canada Live · Après le diplôme",
    title: "Le stage paie un loyer. Le diplôme ouvre le métier.",
    lead: "Pendant les études, le conjoint peut travailler. Après le diplôme, c'est le métier du programme qui compte, pas le titre du visa.",
    pills: ["Stages", "Postdiplôme"],
    panelTitle: "Ce que ça change",
    ask: "Le métier visé par le programme de {name} se relie-t-il à un besoin réel au Canada ?",
    stats: [
      { label: "Stage médian", value: "~48 %", note: "du salaire de métier, ordre de grandeur" },
      { label: "Après le diplôme", value: "salaire métier", note: "fourchette de la province visée" },
      { label: "Conjoint pendant les études", value: "plein marché", note: "permis de travail ouvert" },
      { label: "Employabilité", value: "selon programme", note: "recalée par la demande provinciale" },
    ],
    talks: [
      {
        label: "Nuance",
        body: "Un permis d'études n'est pas un emploi. Le stage, le postdiplôme et le métier du programme font le pont.",
      },
      {
        label: "Foyer",
        body: "Si un conjoint est au dossier, il peut déjà viser un salaire de marché. L'étudiant, lui, vise le diplôme puis le métier.",
      },
      {
        label: "Suite",
        body: "Le chiffre national n'embauche personne. Le métier visé par le programme, lui, peut trouver une place.",
      },
    ],
  },
  pont: {
    kicker: "Canada Live · Votre projet d'études",
    title: "Que signifient ces chiffres pour {name} ?",
    lead: "La bonne question n'est plus le Canada en général. C'est le programme, la scolarité, les fonds et le métier après le diplôme.",
    pills: ["Profil", "Études", "{province}"],
    panelTitle: "Prochaine action",
    ask: "Si on relie le programme à une province réaliste aujourd'hui, quelle est la première décision utile ?",
    stats: [
      { label: "Scolarité année 1", value: "14 à 42 k$", note: "cégep à université, selon la province" },
      { label: "Preuve de fonds", value: "scolarité + vie", note: "IRCC ou CAQ selon la province" },
      { label: "Coût de vie foyer", value: "panier réel", note: "seul, couple ou enfants" },
      { label: "Après le diplôme", value: "métier visé", note: "salaire, stage, employabilité" },
    ],
    talks: [
      {
        label: "Recentrer",
        body: "Ces chiffres se ramènent à votre foyer. Un programme nommé, des fonds pour l'année 1, un métier après le diplôme.",
      },
      {
        label: "Perte",
        body: "Attendre 12 mois ne gèle pas les droits de scolarité. Les places restent limitées, et les dossiers complets passent devant.",
      },
      {
        label: "Action",
        body: "La suite utile : choisir le programme, voir les tarifs, puis les emplois du métier visé. Une décision, pas un catalogue.",
      },
    ],
    actions: [
      { id: "voies", label: "Voir le permis d'études" },
      { id: "salaires", label: "Voir les salaires" },
    ],
  },
};

function uniquePills(pills: string[]) {
  return [...new Set(pills)];
}

function resolvedWorkNoc(profile: Profile) {
  const explicit = profile.workNocCode.trim();
  if (explicit) return explicit;
  return professionNoc(profile.applicant.profession) ?? "";
}

function visitPeople(profile: Profile) {
  return 1 + (familyHasSpouse(profile.family) ? 1 : 0) + profile.children.length;
}

function visitDurationValue(duration: string) {
  if (duration === "15d") return "15 j";
  if (duration === "1m") return "1 mois";
  if (duration === "3m") return "3 mois";
  if (duration === "6m") return "6 mois";
  return "6 mois";
}

function thresholdFor(row: typeof c11WorkingCapital, province: string) {
  const code = provinceCode(province);
  return (row as Record<string, number>)[code] ?? row.ON;
}

function workOverlays(profile: Profile): Record<string, Partial<CanadaLivePage>> {
  const noc = resolvedWorkNoc(profile);
  const teer = teerOf(noc);
  const feerValue = teer === null ? "n.d." : String(teer);
  const nocItem = nocByCode(noc);
  const feerNote = nocItem
    ? `CNP ${nocItem.code} · ${nocItem.title}`
    : "CNP à confirmer, le niveau du métier change les options";
  const pill = teer === null ? "Permis de travail" : `CNP · FEER ${teer}`;
  const fees = workFeesFor(profile.workPermitKind, visitPeople(profile));
  return {
    vue: {
      kicker: "Canada Live · Travail",
      title: "Le Canada délivre encore des permis de travail.",
      lead: "Permis, FEER et stratégie comptent plus qu’un simple métier. La CEC après 12 mois reste une admissibilité, pas une invitation garantie.",
      pills: uniquePills(["Permis de travail", pill]),
      panelTitle: "Le travail reste possible",
      ask: "Dans 12 mois, voulez-vous encore chercher le bon permis, ou déjà viser un dossier qui tient ?",
      stats: [
        { label: "Délai permis", value: "1-6 mois", note: "selon le pays et le type de permis, septembre 2026" },
        { label: "FEER", value: feerValue, note: feerNote },
        { label: "CEC après travail", value: "12 mois", note: "admissibilité si FEER visé, invitation non garantie" },
        { label: "Frais IRCC", value: money(workPermitFee), note: "selon permis fermé, ouvert ou IEC, 155 à 255 $" },
      ],
      talks: [
        { label: "Aujourd’hui", body: "Le Canada recrute encore, mais un métier seul ne suffit pas. Il faut le bon type de permis et un dossier cohérent." },
        { label: "Lecture", body: "Le FEER du métier aide à lire la suite: permis fermé, permis ouvert possible ou pont vers une voie économique." },
        { label: "Pont", body: "Après 12 mois de travail admissible, la CEC peut devenir possible. Cela n’est pas une invitation automatique." },
      ],
    },
    demographie: {
      kicker: "Canada Live · Travail",
      title: "Le marché a ralenti. Les permis restent ciblés.",
      lead: "Le Canada veut encore des travailleurs, mais il relie plus vite le dossier au métier, au FEER et à la province.",
      pills: uniquePills(["Travail", teer === null ? "Permis de travail" : `FEER ${teer}`]),
      panelTitle: "Lecture utile",
      ask: "Le métier de {name} se relie-t-il à une province et à un permis réalistes aujourd’hui ?",
      stats: [
        { label: "Part économique", value: "64 %", note: "plan 2027 et 2028" },
        { label: "Francophones hors Québec", value: "9 %", note: "cible 2026 dans le plan des niveaux" },
        { label: "FEER du métier", value: feerValue, note: feerNote },
        { label: "Délai permis", value: "1-6 mois", note: "le dossier se joue en {province}" },
      ],
      talks: [
        { label: "Constat", body: "Les besoins existent encore, mais le Canada trie davantage. Le métier et la province comptent autant que l’envie de partir." },
        { label: "Risque", body: "Un FEER peu favorable ou un permis mal choisi ralentissent vite le projet." },
        { label: "Suite", body: "Le bon pont n’est pas national. Il part du métier, de la province et du type de permis." },
      ],
    },
    emploi: {
      kicker: "Canada Live · Travail",
      title: "EIMT ou permis ouvert: la mécanique change le projet.",
      lead: "Le marché peut vouloir votre métier. Le permis, lui, décide si vous pouvez l’exercer tout de suite.",
      pills: ["EIMT", "Permis ouvert"],
      panelTitle: "Ce que ça change",
      ask: "Votre dossier tient-il mieux avec une EIMT, un permis ouvert, ou un autre montage temporaire ?",
      stats: [
        { label: "Délai hors Canada", value: "1-6 mois", note: "EIMT ou IMP selon le permis fermé, lié à l’employeur" },
        { label: "Prolongation au Canada", value: "15 sem.", note: "permis ouvert possible selon le volet du dossier" },
        { label: "CEC après travail", value: "12 mois", note: "le statut implicite protège la continuité" },
        { label: "FEER", value: feerValue, note: "le CNP du dossier commande la suite" },
      ],
      talks: [
        { label: "Nuance", body: "Un métier demandé ne crée pas un permis ouvert. Il faut relier besoin du marché et autorisation réelle." },
        { label: "Employeur", body: "L’EIMT et l’IMP servent le même objectif: autoriser le travail. Ils ne donnent pas la même marge." },
        { label: "Pont", body: "Le CNP du dossier détermine si l’expérience servira ensuite à une voie plus durable." },
      ],
    },
    pont: {
      kicker: "Canada Live · Votre projet travail",
      title: "Que signifient ces règles pour {name} ?",
      lead: "La bonne question n’est plus le Canada en général. C’est le permis, le FEER, la province et le métier du dossier.",
      pills: uniquePills(["Profil", pill, "{province}"]),
      panelTitle: "Prochaine action",
      ask: "Si on relie le métier de {name} à un permis réaliste aujourd’hui, quelle est la première décision utile ?",
      stats: [
        { label: "FEER", value: feerValue, note: feerNote },
        { label: "Frais IRCC", value: money(fees.total), note: "jusqu’au premier salaire, lecture en {province}" },
        { label: "CEC après travail", value: "12 mois", note: "renouvellement puis suite économique selon le dossier" },
        { label: "Délai permis", value: "1-6 mois", note: "c’est là que se lit la demande réelle" },
      ],
      talks: [
        { label: "Recentrer", body: "Ces chiffres se ramènent à votre foyer. Le permis et le métier doivent raconter la même histoire." },
        { label: "Perte", body: "Attendre 12 mois ne facilite pas le permis. Les offres, les volets et les règles bougent avant vous." },
        { label: "Action", body: "La suite utile: voir les opportunités du métier, puis comparer les provinces et le budget." },
      ],
    },
  };
}

function visitOverlays(profile: Profile): Record<string, Partial<CanadaLivePage>> {
  const purpose = visitPurposeById(profile.visitPurpose);
  const purposePill = purpose?.name ?? "Visite";
  const fees = visitFeesFor(profile.country, visitPeople(profile));
  return {
    vue: {
      kicker: "Canada Live · Visite",
      title: "La visite autorise le séjour. Pas l’emploi.",
      lead: "Visa, eTA, durée et attaches comptent avant tout. Le marché n’ouvre rien automatiquement pendant la visite.",
      pills: uniquePills(["Visite", purposePill]),
      panelTitle: "La visite reste un séjour",
      ask: "Dans 12 mois, voulez-vous encore préparer la visite, ou déjà déposer un dossier cohérent ?",
      stats: [
        { label: "Visa visiteur", value: money(visitorVisa), note: "selon le passeport et le pays de départ" },
        { label: "eTA", value: money(eta), note: "pour certains profils seulement" },
        { label: "Délais", value: "2-22 sem.", note: "le motif et les attaches restent centraux" },
        { label: "Hors Canada", value: "9-157 j", note: "lecture dossier par dossier, septembre 2026" },
      ],
      talks: [
        { label: "Aujourd’hui", body: "Le Canada reçoit encore des visiteurs. Il regarde d’abord le motif, les attaches et la cohérence du séjour." },
        { label: "Règle", body: "Un visa visiteur autorise le séjour, pas un emploi. Il faut garder cette frontière claire dans tout le dossier." },
        { label: "Suite", body: "Le marché peut exister plus tard, si un changement de statut est approuvé. Jamais par défaut." },
      ],
    },
    demographie: {
      kicker: "Canada Live · Visite",
      title: "Le motif et les attaches font la différence.",
      lead: "Le Canada ne juge pas seulement le pays. Il lit le motif, la durée et ce qui vous fait repartir.",
      pills: ["Motif", "Attaches"],
      panelTitle: "Lecture utile",
      ask: "Le motif choisi par {name} tient-il avec la durée, les fonds et les attaches présentés ?",
      stats: [
        { label: "Visa visiteur", value: money(visitorVisa), note: `${purposePill}, cohérent du début à la fin` },
        { label: "eTA", value: money(eta), note: "le retour doit rester crédible" },
        { label: "Hors Canada", value: "9-157 j", note: "sans travail sur place" },
        { label: "Depuis le Canada", value: "11 j", note: "surtout si la visite est familiale" },
      ],
      talks: [
        { label: "Constat", body: "La visite n’est pas une voie de travail cachée. Le dossier doit ressembler à un vrai séjour." },
        { label: "Preuve", body: "Les attaches et les fonds rassurent davantage qu’un récit ambitieux sur la suite." },
        { label: "Pont", body: "Ce qui compte aujourd’hui, c’est le motif. Le reste ne vient qu’après un autre statut approuvé." },
      ],
    },
    emploi: {
      kicker: "Canada Live · Visite",
      title: "Le marché existe. La visite n’en donne pas l’accès.",
      lead: "Ces données aident à lire le terrain, pas à vendre un départ. Pendant la visite, ce n’est pas un droit de travailler.",
      pills: ["Marché", "Pas d’emploi"],
      panelTitle: "Ce que ça change",
      ask: "Si le marché est là, quel autre statut faudrait-il obtenir plus tard pour y entrer légalement ?",
      stats: [
        { label: "Travail sur place", value: "0", note: "le statut visiteur ne l’autorise pas" },
        { label: "Études sur place", value: "0", note: "pas d’études sans permis d’études" },
        { label: "Délais", value: "2-22 sem.", note: "pas un statut de travailleur pour le conjoint" },
        { label: "Frais visa", value: money(visitorVisa), note: "avant toute idée de marché" },
      ],
      talks: [
        { label: "Nuance", body: "Le marché existe, mais il ne s’ouvre pas au simple fait d’être au Canada en visite." },
        { label: "Foyer", body: "Le conjoint accompagne le séjour. Il ne devient pas travailleur par le seul voyage." },
        { label: "Suite", body: "Le terrain se lit maintenant. Le droit d’y travailler ne s’obtient que dans un autre cadre." },
      ],
    },
    pont: {
      kicker: "Canada Live · Votre projet visite",
      title: "Que doit prouver le séjour de {name} ?",
      lead: "La bonne question n’est pas le Canada en général. C’est le motif, la durée, les attaches et les fonds du séjour.",
      pills: uniquePills(["Profil", purposePill, "{province}"]),
      panelTitle: "Prochaine action",
      ask: "Si on relie le motif à une durée réaliste aujourd’hui, quelle est la première preuve à renforcer ?",
      stats: [
        { label: "Frais du séjour", value: money(fees.total), note: `${purposePill}, logique simple` },
        { label: "Durée visée", value: visitDurationValue(profile.visitDuration), note: "selon le voyage présenté" },
        { label: "Délais", value: "2-22 sem.", note: "sans revenu local" },
        { label: "Biométrie", value: money(fees.biometricsTotal), note: "emploi, biens ou famille au pays" },
      ],
      talks: [
        { label: "Recentrer", body: "Ces chiffres se ramènent à votre séjour. Le dossier doit d’abord prouver pourquoi vous venez et pourquoi vous repartez." },
        { label: "Perte", body: "Attendre 12 mois ne renforce pas un motif. Les incohérences, elles, restent visibles." },
        { label: "Action", body: "La suite utile: vérifier les fonds, la durée et les attaches avant de parler d’autre chose." },
      ],
    },
  };
}

function businessOverlays(profile: Profile): Record<string, Partial<CanadaLivePage>> {
  const pathPill = profile.businessPath === "c11" ? "C11" : closingDeckPills(profile)[0] ?? "Affaires";
  const pathName = closingDeckPills(profile)[0] ?? "Affaires";
  const allowsWork = profile.businessPath === "c11" || profile.businessPath === "ict" || profile.businessPath === "pnp-entrepreneur";
  const spouseOpen = profile.businessPath === "c11" || profile.businessPath === "ict" || profile.businessPath === "pnp-entrepreneur";
  const c11 = thresholdFor(c11WorkingCapital, profile.province);
  const pnp = thresholdFor(pnpEntrepreneur, profile.province);
  const capital = profile.businessPath === "pnp-entrepreneur" ? pnp : c11;
  const weeklyPay = provinceData[provinceCode(profile.province)]?.avgSalary ?? 1292;
  return {
    vue: {
      kicker: "Canada Live · Affaires",
      title: "Le Canada regarde le projet avant l’entrepreneur.",
      lead: "C11, volets provinciaux et fonds à démontrer structurent le dossier. Le projet doit être crédible ici avant tout.",
      pills: uniquePills(["Affaires", pathPill]),
      panelTitle: "Le projet passe d’abord",
      ask: "Dans 12 mois, voulez-vous encore défendre une idée, ou déjà présenter un projet crédible ici ?",
      stats: [
        { label: "Capital C11", value: money(c11), note: "si le bénéfice au Canada reste démontré, volet C11" },
        { label: "PNP entrepreneur", value: money(pnp), note: "la province garde sa propre logique" },
        { label: "Start-up Visa", value: "2026", note: startupVisaNote },
        { label: "Seuil du dossier", value: money(capital), note: "le seuil dépend du volet choisi" },
      ],
      talks: [
        { label: "Aujourd’hui", body: "Le Canada n’achète pas une intention. Il lit la crédibilité du projet, du capital et de l’ancrage local." },
        { label: "Règle", body: "Le bon volet dépend du projet: visiteur d’affaires, C11, transfert ou entrepreneur provincial." },
        { label: "Suite", body: "Le marché salarié ne remplace pas le business plan. Il sert seulement à lire le filet si le projet ne tient pas." },
      ],
    },
    demographie: {
      kicker: "Canada Live · Affaires",
      title: "Le projet doit être crédible ici.",
      lead: "Le pays peut accueillir l’entrepreneur. Il attend d’abord un dossier lisible, financé et cohérent avec la province.",
      pills: ["Projet", pathPill],
      panelTitle: "Lecture utile",
      ask: "Le projet de {name} tient-il avec la province, le capital et le volet choisis ?",
      stats: [
        { label: "Capital C11", value: money(c11), note: "le projet se juge en {province}" },
        { label: "PNP entrepreneur", value: money(pnp), note: `travail autorisé: ${allowsWork ? "oui" : "non"}` },
        { label: "Pause SUV", value: "2026", note: startupVisaNote },
        { label: "Salaire filet", value: `${money(weeklyPay)} /sem`, note: `conjoint: ${spouseOpen ? "souvent possible" : "pas automatique"}` },
      ],
      talks: [
        { label: "Constat", body: "Le pays veut des projets qui tiennent. Le capital et la logique locale comptent avant le récit." },
        { label: "Seuil", body: "Un dossier sans fonds lisibles devient vite fragile, même si le métier ou l’expérience sont bons." },
        { label: "Pont", body: "Le bon volet n’est pas le plus flatteur. C’est celui qui colle vraiment au projet." },
      ],
    },
    emploi: {
      kicker: "Canada Live · Affaires",
      title: "Le projet, le capital et le filet salarié doivent se lire ensemble.",
      lead: "Les salaires montrent le marché si le projet ne tient pas. Ils ne décrivent pas le revenu futur de l’entreprise.",
      pills: ["Capital", pathName],
      panelTitle: "Ce que ça change",
      ask: "Si le projet ralentit, le dossier garde-t-il une crédibilité sur le plan du capital et du marché ?",
      stats: [
        { label: "Capital à montrer", value: money(capital), note: "investissement et vie sur place, C11 ou PNP" },
        { label: "Seuil C11", value: money(c11), note: `travail du porteur: ${allowsWork ? "possible" : "non"}` },
        { label: "Seuil PNP", value: money(pnp), note: `conjoint: ${spouseOpen ? "ouvert possible" : "visiteur"}` },
        { label: "Pause SUV", value: "2026", note: startupVisaNote },
      ],
      talks: [
        { label: "Nuance", body: "Un bon projet reste crédible par son capital, pas par une promesse de salaire futur." },
        { label: "Volet", body: "C11 et volets provinciaux n’offrent pas la même marge. Le statut du dossier change tout." },
        { label: "Suite", body: "La bonne lecture relie le projet, les fonds et la province avant d’élargir le plan." },
      ],
    },
    pont: {
      kicker: "Canada Live · Votre projet affaires",
      title: "Que doit démontrer le dossier de {name} ?",
      lead: "La bonne question n’est plus le Canada en général. C’est le volet, la province, le capital et la crédibilité du projet.",
      pills: uniquePills(["Profil", pathPill, "{province}"]),
      panelTitle: "Prochaine action",
      ask: "Si on relie le projet à un volet réaliste aujourd’hui, quelle preuve manque le plus au dossier ?",
      stats: [
        { label: "Seuil du dossier", value: money(capital), note: `${pathPill}, le statut choisi change le reste` },
        { label: "Capital C11", value: money(c11), note: "l’ancrage local doit rester concret en {province}" },
        { label: "PNP entrepreneur", value: money(pnp), note: "investissement, séjour ou vie selon le volet" },
        { label: "Pause SUV", value: "2026", note: startupVisaNote },
      ],
      talks: [
        { label: "Recentrer", body: "Ces chiffres se ramènent au projet. Le bon volet sert une idée crédible, pas une simple envie d’affaires." },
        { label: "Perte", body: "Attendre 12 mois ne remplace pas un projet solide. Les seuils et les volets continuent d’évoluer." },
        { label: "Action", body: "La suite utile: voir le budget, la province et les repères de crédibilité du volet choisi." },
      ],
    },
  };
}

function familyOverlays(profile: Profile): Record<string, Partial<CanadaLivePage>> {
  const linkPill = familyLinkById(profile.familyLink)?.name ?? "Famille";
  const size = sizeFor(profile);
  const mni = requiredIncome(profile.province, size, profile.familyLink);
  const fees = familyFeesFor(profile);
  const quebec = provinceCode(profile.province) === "QC";
  const delay = quebec ? "36 mois" : "14-20 mois";
  return {
    vue: {
      kicker: "Canada Live · Regroupement familial",
      title: "Le regroupement familial reste une logique de réunification.",
      lead: "Catégorie familiale, lien parrainé et délais réels structurent le dossier bien avant le marché du travail.",
      pills: uniquePills(["Famille", linkPill]),
      panelTitle: "La réunification reste le cœur du dossier",
      ask: "Dans 12 mois, voulez-vous encore clarifier le lien, ou déjà déposer un dossier familial solide ?",
      stats: [
        { label: "Admissions famille", value: "84 000", note: "catégorie familiale, plan des niveaux 2026" },
        { label: "Part du plan", value: "22 %", note: "le lien du dossier décide la lecture" },
        { label: "Délai conjoint", value: "14-20 mois", note: "souvent plus simple que parents et grands-parents" },
        { label: "Québec", value: "36 mois", note: "double lecture provinciale et fédérale" },
      ],
      talks: [
        { label: "Aujourd’hui", body: "Le regroupement familial reste ouvert, mais il lit d’abord le lien et la capacité du répondant." },
        { label: "Règle", body: "Le conjoint ne se traite pas comme les parents. Le lien change vraiment la durée et la stratégie." },
        { label: "Suite", body: "Le marché vient après. Le dossier doit d’abord prouver la réunification." },
      ],
    },
    demographie: {
      kicker: "Canada Live · Regroupement familial",
      title: "Le lien parrainé change la vitesse du projet.",
      lead: "Le Canada ne traite pas chaque lien de la même manière. Le conjoint, l’enfant et le parent n’ouvrent pas le même calendrier.",
      pills: ["Lien", linkPill],
      panelTitle: "Lecture utile",
      ask: "Le lien choisi par {name} tient-il avec la taille du foyer, le revenu et la province visée ?",
      stats: [
        { label: "Revenu MNI", value: money(mni), note: `${linkPill}, surtout pour parents et grands-parents` },
        { label: "Frais IRCC", value: money(fees.total), note: "statut et capacité du répondant" },
        { label: "Taille foyer", value: String(size), note: "le budget se calcule à plusieurs" },
        { label: "Délai hors Québec", value: "14-20 mois", note: "le répondant reste au centre du dossier" },
      ],
      talks: [
        { label: "Constat", body: "Le Canada lit un foyer réel, pas un lien abstrait. La taille de la famille change vite les preuves." },
        { label: "Budget", body: "Parrainer sans capacité claire fragilise le dossier. Les chiffres doivent suivre la réunification." },
        { label: "Pont", body: "La bonne lecture repart du lien, du répondant et du foyer réuni." },
      ],
    },
    emploi: {
      kicker: "Canada Live · Regroupement familial",
      title: "Le travail vient après la réunification.",
      lead: "Le conjoint peut rejoindre le marché après l’arrivée. Pour un parent, la logique reste d’abord familiale.",
      pills: ["Après l’arrivée", linkPill],
      panelTitle: "Ce que ça change",
      ask: "Quel rôle joue le marché après l’arrivée, sans faire oublier que la réunification reste le sujet principal ?",
      stats: [
        { label: "Délai conjoint", value: "14-20 mois", note: "le marché se lit après la résidence" },
        { label: "Délai parents", value: "36 mois", note: "la logique reste le soutien familial" },
        { label: "Québec", value: "36 mois", note: "le Québec ajoute souvent du délai" },
        { label: "Revenu MNI", value: money(mni), note: "revenu et stabilité restent centraux" },
      ],
      talks: [
        { label: "Nuance", body: "Le marché ne remplace pas la réunification. Il intervient seulement après l’arrivée, surtout pour le conjoint." },
        { label: "Parent", body: "Un parent ne se vend pas comme un argument d’emploi. Le projet parle d’abord de présence familiale." },
        { label: "Suite", body: "Le bon pont relie d’abord le foyer réuni, puis les repères de marché utiles après l’arrivée." },
      ],
    },
    pont: {
      kicker: "Canada Live · Votre projet famille",
      title: "Que doit prouver le dossier familial de {name} ?",
      lead: "La bonne question n’est plus le Canada en général. C’est le lien, le foyer réuni, le revenu du répondant et le délai réaliste.",
      pills: uniquePills(["Profil", linkPill, "{province}"]),
      panelTitle: "Prochaine action",
      ask: "Si on relie le lien parrainé à une province réaliste aujourd’hui, quelle preuve faut-il renforcer d’abord ?",
      stats: [
        { label: "Revenu MNI", value: money(mni), note: `${linkPill}, le dossier commence ici` },
        { label: "Frais IRCC", value: money(fees.total), note: "le Québec peut rallonger la suite" },
        { label: "Délai visé", value: delay, note: "vie commune et obligations du répondant" },
        { label: "Taille foyer", value: String(size), note: "surtout pour le conjoint après l’arrivée" },
      ],
      talks: [
        { label: "Recentrer", body: "Ces chiffres se ramènent au foyer réuni. La priorité reste la réunification, pas le marché." },
        { label: "Perte", body: "Attendre 12 mois n’allège pas les preuves. Les obligations financières restent là." },
        { label: "Action", body: "La suite utile: lire le budget du foyer, les délais et le lien parrainé avant le reste." },
      ],
    },
  };
}

export function canadaLivePagesFor(profile: Profile, place: string = ALL_CANADA): CanadaLivePage[] {
  const pages =
    profile.objective === "Résidence permanente"
      ? canadaLivePages
      : overlayPagesFor(profile);
  if (isAllCanada(place)) return pages;
  return localizeCanadaLivePages(pages, place);
}

function overlayPagesFor(profile: Profile): CanadaLivePage[] {
  const program = profile.objective === "Études" ? studyProgramFor(profile) : undefined;
  const overlays =
    profile.objective === "Études"
      ? studyOverlays
      : profile.objective === "Travail"
        ? workOverlays(profile)
        : profile.objective === "Visite"
          ? visitOverlays(profile)
          : profile.objective === "Affaires"
            ? businessOverlays(profile)
            : profile.objective === "Regroupement familial"
              ? familyOverlays(profile)
              : undefined;
  if (!overlays) return canadaLivePages;
  return canadaLivePages.map((page) => {
    const overlay = overlays[page.id];
    if (!overlay) return page;
    const pills = uniquePills(overlay.pills ? [...overlay.pills] : page.pills);
    if (program && page.id === "pont") pills.splice(1, 0, program.name);
    return { ...page, ...overlay, pills: uniquePills(pills) };
  });
}

