import type { CanadaLiveArticle, CanadaLivePage, CanadaLiveStat, CanadaLiveTalk } from "@/data/canada-live";
import { canadaPlacesFor } from "@/data/canada-places";
import { provinces } from "@/data/profile";
import { ALL_CANADA, isAllCanada, provinceCode, provinceData, type Province } from "@/data/provinces";
import { money } from "@/lib/format";

export { ALL_CANADA, isAllCanada };

export const canadaLivePlaceOptions = [ALL_CANADA, ...provinces];

const IN_PLACE: Record<string, string> = {
  QC: "au Québec",
  ON: "en Ontario",
  AB: "en Alberta",
  MB: "au Manitoba",
  NB: "au Nouveau-Brunswick",
  BC: "en Colombie-Britannique",
  SK: "en Saskatchewan",
  NS: "en Nouvelle-Écosse",
  PE: "à l'Île-du-Prince-Édouard",
  NL: "à Terre-Neuve-et-Labrador",
  YT: "au Yukon",
  NT: "dans les Territoires du Nord-Ouest",
  NU: "au Nunavut",
};

const OF_PLACE: Record<string, string> = {
  QC: "du Québec",
  ON: "de l'Ontario",
  AB: "de l'Alberta",
  MB: "du Manitoba",
  NB: "du Nouveau-Brunswick",
  BC: "de la Colombie-Britannique",
  SK: "de la Saskatchewan",
  NS: "de la Nouvelle-Écosse",
  PE: "de l'Île-du-Prince-Édouard",
  NL: "de Terre-Neuve-et-Labrador",
  YT: "du Yukon",
  NT: "des Territoires du Nord-Ouest",
  NU: "du Nunavut",
};

function inPlace(place: string) {
  return IN_PLACE[provinceCode(place)] ?? `en ${place}`;
}

function InPlace(place: string) {
  const value = inPlace(place);
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function ofPlace(place: string) {
  return OF_PLACE[provinceCode(place)] ?? `de ${place}`;
}

const THE_PLACE: Record<string, string> = {
  QC: "Le Québec",
  ON: "L'Ontario",
  AB: "L'Alberta",
  MB: "Le Manitoba",
  NB: "Le Nouveau-Brunswick",
  BC: "La Colombie-Britannique",
  SK: "La Saskatchewan",
  NS: "La Nouvelle-Écosse",
  PE: "L'Île-du-Prince-Édouard",
  NL: "Terre-Neuve-et-Labrador",
  YT: "Le Yukon",
  NT: "Les Territoires du Nord-Ouest",
  NU: "Le Nunavut",
};

function thePlace(place: string) {
  return THE_PLACE[provinceCode(place)] ?? place;
}

const FERTILITY: Record<string, { value: string; note: string }> = {
  QC: { value: "1,34", note: "enfant par femme en 2024, au-dessus de la moyenne canadienne" },
  BC: { value: "1,02", note: "enfant par femme en 2024, creux canadien" },
  NU: { value: "2,1", note: "seuil de renouvellement, seule juridiction à l'approcher" },
};

const IRCC_LEVELS =
  "https://www.canada.ca/fr/immigration-refugies-citoyennete/organisation/mandat/initiatives-ministerielles/niveaux/renseignements-supplementaires-niveaux-immigration-2026-2028.html";
const IRCC_FRANCOPHONE =
  "https://www.canada.ca/fr/immigration-refugies-citoyennete/nouvelles/2026/01/le-canada-depasse-son-objectif-dimmigration-francophone-en-2025.html";
const PBO_LEVELS =
  "https://www.pbo-dpb.ca/fr/publications/RP-2526-025-S--demographic-implications-2026-2028-immigration-levels-plan--implications-demographiques-plan-niveaux-immigration-2026-2028";
const STATCAN_FERTILITY = "https://www150.statcan.gc.ca/n1/daily-quotidien/250924/dq250924d-fra.htm";
const STATCAN_FUTURE = "https://www150.statcan.gc.ca/n1/pub/75-006-x/2026002/article/00003-fra.htm";
const RADIO_CANADA_COUCHES = "https://ici.radio-canada.ca/nouvelle/2280308/couches-adultes-enfants-natalite-quebec";
const STATCAN_VACANCIES = "https://www150.statcan.gc.ca/n1/daily-quotidien/260317/dq260317a-fra.htm";
const CDHOWE_LABOUR =
  "https://cdhowe.org/publication/2025-labour-market-review-trade-uncertainty-structural-pressures-and-policy-priorities-for-canada";
const INDEED_TRENDS = "https://hiringlab.indeed.com/en-ca/2025/12/18/indeed-2026-canadian-jobs-hiring-trends-report";
const GOWLING =
  "https://gowlingwlg.com/en/insights-resources/articles/2025/canada-2026-2028-immigration-levels-plan-from-budget-2025";
const RBC =
  "https://www.rbc.com/en/thought-leadership/skills-and-post-secondary/a-smarter-immigration-strategy";

export function localizeCanadaLivePages(pages: CanadaLivePage[], place: string): CanadaLivePage[] {
  if (isAllCanada(place)) return pages;
  const data = provinceData[provinceCode(place)];
  if (!data) return pages;
  const quebec = data.name === "Québec";
  return pages.map((page) => localizePage(page, place, data, quebec));
}

function localizePage(page: CanadaLivePage, place: string, data: Province, quebec: boolean): CanadaLivePage {
  const hero = heroFor(page, place);
  return {
    ...page,
    ...copyFor(page, place, quebec),
    heroPlace: hero.place,
    heroImage: hero.image,
    heroCaption: hero.caption,
    stats: statsFor(page, place, data, quebec),
    articles: articlesFor(page, place, data, quebec),
    talks: talksFor(page, place, data, quebec),
    pills: pillsFor(page, place),
  };
}

function heroFor(page: CanadaLivePage, place: string) {
  if (page.id === "vue") {
    const shot = vueShot(place);
    return {
      place: shot.place,
      image: shot.image || page.heroImage,
      caption: `Le paysage fait rêver. Le dossier, lui, se joue ${inPlace(place)}.`,
    };
  }
  if (page.id === "emploi") {
    return {
      place,
      image: page.heroImage,
      caption: `Les villes tournent encore. ${InPlace(place)}, la question est où, pour qui, et avec quel dossier.`,
    };
  }
  if (page.id === "demographie") {
    return {
      place,
      image: page.heroImage,
      caption: `${thePlace(place)} aime ses aînés. Il doit aussi attirer ceux qui peuvent les soigner, les loger et les relayer.`,
    };
  }
  return {
    place,
    image: page.heroImage,
    caption: `Le rêve se visite. Le projet se construit autour d'un métier, ${ofPlace(place)} et d'un calendrier.`,
  };
}

function vueShot(place: string) {
  const catalog = canadaPlacesFor();
  const named = (title: string) => catalog.find((item) => item.title === title);
  const code = provinceCode(place);
  if (code === "QC") {
    const quebec = named("Québec");
    return { place: quebec?.title ?? "Québec", image: quebec?.imageUrl ?? "" };
  }
  if (code === "ON") {
    const toronto = named("Toronto");
    return { place: toronto?.title ?? "Toronto", image: toronto?.imageUrl ?? "" };
  }
  if (code === "AB" || code === "SK" || code === "MB" || code === "BC" || code === "YT") {
    const banff = named("Banff");
    return { place: banff?.title ?? place, image: banff?.imageUrl ?? "" };
  }
  return { place, image: catalog[0]?.imageUrl ?? "" };
}

function copyFor(page: CanadaLivePage, place: string, quebec: boolean): Partial<CanadaLivePage> {
  if (page.id === "vue" && page.stats.some((stat) => stat.label === "Admissions RP prévues")) {
    return {
      title: quebec
        ? "Le Québec sélectionne encore. Le dossier, lui, se joue ici."
        : `${thePlace(place)} accueille encore. La sélection, elle, se joue ici.`,
      lead: quebec
        ? "Le français, le métier et un projet cohérent pèsent davantage qu'un simple désir de partir."
        : "Le profil, la langue et un ancrage local pèsent davantage qu'avant.",
      panelTitle: quebec ? "Le Québec n'est pas fermé" : `Le projet se joue ${inPlace(place)}`,
      ask: `Dans 12 mois, voulez-vous encore chercher une stratégie, ou l'avoir déjà lancée ${inPlace(place)} ?`,
    };
  }
  if (page.id === "demographie" && page.stats.some((stat) => stat.label === "Fécondité 2024")) {
    return {
      title: `${thePlace(place)} vieillit aussi. Les besoins, eux, ne diminuent pas.`,
      lead: `Sans relève naturelle suffisante, ${place} doit renouveler sa main-d'œuvre, ses soignants et ses contribuables.`,
      ask: `Si ${place} a déjà besoin de renouveler sa population active, où {name} peut apporter le plus de valeur ?`,
    };
  }
  if (page.id === "emploi" && hasNationalJobsStats(page.stats)) {
    return {
      title: `Le marché s'est calmé. ${InPlace(place)}, des postes restent à pourvoir.`,
      lead: `Le taux national ne raconte pas le métier de {name}. Il faut relier chômage, postes vacants et ${place} avant de parler de programme.`,
      ask: `Parmi les métiers du foyer, lequel se relie le plus clairement à un besoin réel ${inPlace(place)} ?`,
    };
  }
  if (page.id === "pont" && page.stats.some((stat) => stat.label === "Places RP encore ouvertes")) {
    return {
      lead: `La bonne question n'est plus le Canada en général. C'est où un(e) {profession} trouve le meilleur compromis ${inPlace(place)}.`,
      ask: `Si on relie {profession} ${inPlace(place)} aujourd'hui, quelle est la première décision utile ?`,
    };
  }
  return {};
}

function pillsFor(page: CanadaLivePage, place: string) {
  if (page.id !== "vue") return page.pills;
  if (!page.pills.includes("IRCC 2026-2028")) return page.pills;
  return [place, "Statistique Canada"];
}

function statsFor(page: CanadaLivePage, place: string, data: Province, quebec: boolean): CanadaLiveStat[] {
  if (page.id === "vue" && page.stats.some((stat) => stat.label === "Admissions RP prévues")) {
    return [
      { label: "Chômage", value: rate(data.unemployment), note: `${place}, Enquête sur la population active` },
      { label: "Postes vacants", value: count(data.vacancies), note: "lecture provinciale, T4 2025" },
      quebec
        ? { label: "Français", value: data.french, note: "le français structure la sélection au Québec" }
        : { label: "Français", value: data.french, note: "atout francophone hors Québec, cible 9 % en 2026" },
      {
        label: "Salaire hebdomadaire",
        value: money(data.avgSalary),
        note: "moyenne provinciale, lecture de marché",
      },
    ];
  }
  if (page.id === "demographie" && page.stats.some((stat) => stat.label === "Fécondité 2024")) {
    const fertility = FERTILITY[provinceCode(place)] ?? {
      value: "1,25",
      note: `moyenne nationale; ${place} suit le creux canadien`,
    };
    return [
      { label: "Fécondité 2024", value: fertility.value, note: fertility.note },
      {
        label: "Seuil de renouvellement",
        value: "2,1",
        note: quebec ? "le Québec ne l'atteint pas non plus" : "aucune province hors Nunavut ne l'atteint",
      },
      {
        label: "Âge moyen à la maternité",
        value: "31,8 ans",
        note: `sommet national, le vieillissement pèse aussi ${inPlace(place)}`,
      },
      {
        label: "Naissances, mère née à l'étranger",
        value: "42,3 %",
        note: "l'immigration porte déjà le renouvellement",
      },
    ];
  }
  if (page.id === "emploi" && hasNationalJobsStats(page.stats)) {
    return [
      { label: "Postes vacants", value: count(data.vacancies), note: `${place}, T4 2025, Statistique Canada` },
      { label: "Chômage", value: rate(data.unemployment), note: `${place}, Enquête sur la population active` },
      { label: "Salaire hebdomadaire", value: money(data.avgSalary), note: "moyenne provinciale des postes" },
      {
        label: "Français",
        value: data.french,
        note: quebec ? "le français reste un filtre fort" : "présence francophone à lire dans le dossier",
      },
    ];
  }
  if (page.id === "pont" && page.stats.some((stat) => stat.label === "Places RP encore ouvertes")) {
    return [
      { label: "Places RP encore ouvertes", value: "380 000", note: "chaque année jusqu'en 2028, cadre national" },
      { label: "Chômage local", value: rate(data.unemployment), note: `${place}, lecture de marché` },
      { label: "Postes encore vacants", value: count(data.vacancies), note: `même après le reflux, ${inPlace(place)}` },
      quebec
        ? { label: "Avantage langue", value: "français", note: "le français structure le dossier au Québec" }
        : { label: "Avantage langue", value: "francophone", note: "cible 9 % hors Québec dès 2026" },
    ];
  }
  return page.stats;
}

function articlesFor(
  page: CanadaLivePage,
  place: string,
  data: Province,
  quebec: boolean,
): CanadaLiveArticle[] {
  if (page.id === "vue") return vueArticles(place, quebec);
  if (page.id === "demographie") return demoArticles(place, quebec);
  if (page.id === "emploi") return jobsArticles(place, data, quebec);
  if (page.id === "pont") return pontArticles(place, quebec);
  return page.articles;
}

function vueArticles(place: string, quebec: boolean): CanadaLiveArticle[] {
  return [
    {
      source: "IRCC",
      date: "4 nov. 2025",
      title: quebec
        ? "Plan des niveaux 2026-2028 : le Québec garde sa propre sélection"
        : `Plan des niveaux 2026-2028 : 380 000 RP, puis une sélection ${inPlace(place)}`,
      excerpt: quebec
        ? "Ottawa stabilise les admissions. Au Québec, le dossier se juge d'abord par la sélection québécoise, le français et le métier."
        : `Ottawa stabilise les admissions à 380 000. ${InPlace(place)}, le PNP, le métier et la langue pèsent plus que le seul désir de partir.`,
      url: IRCC_LEVELS,
    },
    {
      source: "IRCC",
      date: "janv. 2026",
      title: quebec
        ? "La cible francophone hors Québec ne s'applique pas au Québec"
        : "Le Canada monte ses cibles francophones hors Québec",
      excerpt: quebec
        ? "Hors Québec, la cible passe à 9 %, puis 10,5 % en 2028. Au Québec, le français n'est pas un bonus. C'est le filtre."
        : `Plus de 29 500 admissions francophones hors Québec en 2025. Pour un foyer qui vise ${place}, c'est un levier à activer tout de suite.`,
      url: IRCC_FRANCOPHONE,
    },
    {
      source: "Directeur parlementaire du budget",
      date: "2026",
      title: "Implications démographiques du Plan des niveaux 2026-2028",
      excerpt: quebec
        ? "380 000 RP par an, soit environ 20 % de moins que le sommet de 2024. Au Québec, la sélection devient plus lisible, pas plus large."
        : `380 000 RP par an, soit environ 20 % de moins que 2024. ${InPlace(place)}, il faut un dossier qui colle à un besoin local.`,
      url: PBO_LEVELS,
    },
  ];
}

function demoArticles(place: string, quebec: boolean): CanadaLiveArticle[] {
  const fertility = [
    {
      source: "Statistique Canada",
      date: "24 sept. 2025",
      title: quebec
        ? "Fécondité 2024 : le Québec à 1,34, sous le seuil de 2,1"
        : place === "Colombie-Britannique"
          ? "Fécondité 2024 : la Colombie-Britannique tombe à 1,02"
          : `Fécondité 2024 : 1,25 enfant par femme, et ${place} suit le creux`,
      excerpt: quebec
        ? "Le Canada tombe à 1,25. Le Québec s'établit à 1,34. Ce n'est pas un renouvellement. C'est déjà un besoin de relève."
        : place === "Colombie-Britannique"
          ? "Le Canada tombe à 1,25. La Colombie-Britannique atteint 1,02. Le Nunavut reste la seule juridiction près du seuil."
          : `Le Canada rejoint les pays à fécondité ultra-faible. ${place} n'échappe pas à cette pression sur la main-d'œuvre.`,
      url: STATCAN_FERTILITY,
    },
    {
      source: "Statistique Canada",
      date: "2026",
      title: "Projets d'avenir : moins d'enfants, plus de pression sur la main-d'œuvre",
      excerpt: `Un ISF de 1,25 expose ${place} à des pressions sur la population active, les soins et les régimes de retraite.`,
      url: STATCAN_FUTURE,
    },
  ];
  if (quebec) {
    return [
      fertility[0],
      {
        source: "Radio-Canada",
        date: "2025",
        title: "Les Québécois achètent maintenant plus de couches pour adultes que pour enfants",
        excerpt:
          "En 2024, le Québec a enregistré plus de décès que de naissances. L'image est brutale, mais elle rend le vieillissement immédiat.",
        url: RADIO_CANADA_COUCHES,
      },
      fertility[1],
    ];
  }
  return [
    fertility[0],
    fertility[1],
    {
      source: "Directeur parlementaire du budget",
      date: "2026",
      title: "Implications démographiques du Plan des niveaux 2026-2028",
      excerpt: `380 000 RP par an ne remplacent pas une fécondité trop basse. ${InPlace(place)}, l'immigration reste un levier de relève.`,
      url: PBO_LEVELS,
    },
  ];
}

function jobsArticles(place: string, data: Province, quebec: boolean): CanadaLiveArticle[] {
  return [
    {
      source: "Statistique Canada",
      date: "17 mars 2026",
      title: `Postes vacants : ${count(data.vacancies)} ${inPlace(place)}`,
      excerpt: quebec
        ? `Le volume national se stabilise à 495 100. Le Québec, lui, reste un marché qui recrute, avec ${count(data.vacancies)} postes ouverts.`
        : `Le volume national se stabilise à 495 100. ${InPlace(place)}, la lecture utile est locale : ${count(data.vacancies)} postes, chômage à ${rate(data.unemployment)}.`,
      url: STATCAN_VACANCIES,
    },
    {
      source: "Institut C.D. Howe",
      date: "2026",
      title: "Bilan 2025 du marché du travail : moins tendu, encore inégal",
      excerpt: `Le resserrement de 2022 est fini. Les écarts de métiers et de provinces restent. ${place} n'a pas le même dossier que l'Ontario.`,
      url: CDHOWE_LABOUR,
    },
    {
      source: "Indeed Hiring Lab",
      date: "18 déc. 2025",
      title: quebec
        ? "Tendances 2026 : le Québec résiste mieux que l'Ontario"
        : `Tendances 2026 : la province visée change le marché, y compris ${inPlace(place)}`,
      excerpt: quebec
        ? "Le marché a ramolli partout, mais le Québec garde un chômage plus bas que l'Ontario. La province visée n'est pas un détail."
        : `Le marché a ramolli partout. ${InPlace(place)}, chômage ${rate(data.unemployment)} et ${count(data.vacancies)} postes vacants. Ce n'est pas un détail.`,
      url: INDEED_TRENDS,
    },
  ];
}

function pontArticles(place: string, quebec: boolean): CanadaLiveArticle[] {
  return [
    {
      source: "Gowling WLG",
      date: "2025",
      title: "Le plan 2026-2028 recentre l'immigration sur les compétences",
      excerpt: quebec
        ? "La part économique monte. Au Québec, un profil préparé pèse plus qu'un profil qui attend."
        : `La part économique monte. ${InPlace(place)}, un profil préparé pèse plus qu'un profil qui attend.`,
      url: GOWLING,
    },
    {
      source: "RBC Thought Leadership",
      date: "2026",
      title: "Une stratégie d'immigration plus sélective",
      excerpt: `Le plafond de 380 000 RP est un choix de qualité. Le dossier doit coller à un besoin ${inPlace(place)}, pas seulement à un désir de partir.`,
      url: RBC,
    },
    {
      source: "IRCC",
      date: "2026",
      title: quebec
        ? "Au Québec, le français n'est pas un slogan. C'est le filtre."
        : "Les cibles francophones hors Québec continuent de monter",
      excerpt: quebec
        ? "Hors Québec, 9 % en 2026 puis 10,5 % en 2028. Au Québec, le français est déjà la condition du dossier."
        : `9 % en 2026, 10,5 % en 2028. Pour un foyer francophone qui vise ${place}, c'est un levier à activer tout de suite.`,
      url: IRCC_FRANCOPHONE,
    },
  ];
}

function talksFor(page: CanadaLivePage, place: string, data: Province, quebec: boolean): CanadaLiveTalk[] {
  if (page.id === "vue" && page.talks.some((talk) => talk.body.includes("380 000"))) {
    return [
      {
        label: "Aujourd'hui",
        body: quebec
          ? "Le Québec n'a pas fermé. Il a recentré. Le français, le métier et un dossier cohérent pèsent plus que le seul désir de partir."
          : `${thePlace(place)} n'a pas fermé. Le Canada a recentré. 380 000 places restent, mais le dossier se juge ici, pas en général.`,
      },
      {
        label: "Les priorités",
        body: quebec
          ? "La sélection québécoise lit le français et le projet. Un dossier cohérent pèse plus qu'une intention."
          : `Le PNP, le métier et la langue structurent le dossier ${inPlace(place)}. Ce n'est plus un pays où l'on improvise.`,
      },
      {
        label: "L'avantage français",
        body: quebec
          ? "Au Québec, le français n'est pas un bonus hors quota. C'est le filtre du dossier."
          : `Si vous parlez français, c'est un vrai atout hors Québec. ${InPlace(place)}, cet atout reste réel, pas un slogan.`,
      },
    ];
  }
  if (page.id === "demographie" && page.talks.some((talk) => talk.body.includes("1,25"))) {
    const fertility = FERTILITY[provinceCode(place)];
    return [
      {
        label: "Constat",
        body: fertility
          ? `${fertility.value} enfant par femme ${inPlace(place)}, ce n'est pas une opinion. C'est Statistique Canada. La relève naturelle ne suffit plus.`
          : `1,25 enfant par femme au Canada, ce n'est pas une opinion. ${place} suit ce creux. La relève naturelle ne suffit plus.`,
      },
      {
        label: "Image",
        body: quebec
          ? "L'article de Radio-Canada sur les couches pour adultes n'est pas du sensationnalisme. Il rend visible un Québec qui a plus besoin de soignants que de berceaux."
          : `Moins d'enfants, plus d'aînés : ${place} a déjà besoin de soignants, de logements et de contribuables.`,
      },
      {
        label: "Pont",
        body: "42 % des nouveau-nés ont déjà une mère née à l'étranger. L'immigration n'est pas un extra. C'est déjà le moteur du renouvellement.",
      },
    ];
  }
  if (page.id === "emploi" && page.talks.some((talk) => talk.body.includes("118 700") || talk.body.includes("495 100"))) {
    return [
      {
        label: "Nuance",
        body: `Le marché s'est détendu depuis 2022. ${count(data.vacancies)} postes restent pourtant ouverts ${inPlace(place)}, et certains métiers peinent encore à recruter.`,
      },
      {
        label: "Province",
        body: `${thePlace(place)} a ${count(data.vacancies)} postes vacants, pour un chômage à ${rate(data.unemployment)}. La province que vous visez change autant le projet que votre métier.`,
      },
      {
        label: "Suite",
        body: `Le chiffre national n'embauche personne. Le métier de {name}, lui, peut trouver une place ${inPlace(place)}.`,
      },
    ];
  }
  if (page.id === "pont" && page.talks.some((talk) => talk.body.includes("Le Canada vieillit"))) {
    return [
      {
        label: "Recentrer",
        body: `Ces chiffres se ramènent à votre foyer. ${thePlace(place)} vieillit, recrute encore, et sélectionne davantage. Vous avez besoin d'une voie, pas de tous les chiffres.`,
      },
      {
        label: "Perte",
        body: "Attendre 12 mois ne gèle pas le profil. Les places restent limitées, et les candidats mieux préparés passent devant.",
      },
      {
        label: "Action",
        body: `La suite utile : voir les opportunités de votre métier, puis comparer ${place} aux autres options. Une décision, pas un catalogue.`,
      },
    ];
  }
  return page.talks;
}

function hasNationalJobsStats(stats: CanadaLiveStat[]) {
  return stats.some((stat) => stat.value.includes("495 100") || stat.label === "Postes vacants au Québec");
}

function rate(n: number) {
  return `${n.toFixed(1).replace(".", ",")} %`;
}

function count(n: number) {
  return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}
