import heroBusiness from "@/assets/pitch/hero-business.jpg";
import heroCouple from "@/assets/pitch/hero-couple.jpg";
import heroFamily from "@/assets/pitch/hero-family.jpg";
import heroSingle from "@/assets/pitch/hero-single.jpg";
import heroSingleParent from "@/assets/pitch/hero-single-parent.jpg";
import heroStudent from "@/assets/pitch/hero-student.jpg";
import heroVisit from "@/assets/pitch/hero-visit.jpg";
import heroWorker from "@/assets/pitch/hero-worker.jpg";
import emploiSante from "@/assets/canada-live/emploi-sante.jpg";
import demoAines from "@/assets/canada-live/demo-aines.jpg";
import pontVille from "@/assets/canada-live/pont-ville.jpg";
import pontInstallation from "@/assets/canada-live/pont-installation.jpg";
import slide01 from "@/assets/pitch/slide-01-1.jpg";
import problemWrongPath from "@/assets/pitch/problem-wrong-path.jpg";
import problemIncoherentFile from "@/assets/pitch/problem-incoherent-file.jpg";
import problemCareerLate from "@/assets/pitch/problem-career-late.jpg";
import problemSettlementChance from "@/assets/pitch/problem-settlement-chance.jpg";
import slide08 from "@/assets/pitch/slide-08-1.jpg";
import slide09 from "@/assets/pitch/slide-09-1.jpg";
import slide10 from "@/assets/pitch/slide-10-1.jpg";
import slide12a from "@/assets/pitch/slide-12-1.jpg";
import slide12b from "@/assets/pitch/slide-12-2.jpg";
import slide12c from "@/assets/pitch/slide-12-3.jpg";
import slide12d from "@/assets/pitch/slide-12-4.jpg";
import slide13qr from "@/assets/pitch/slide-13-1.png";
import banffFall from "@/assets/places/banff-fall.jpg";
import montrealFall from "@/assets/places/montreal-fall.jpg";
import quebecFall from "@/assets/places/quebec-fall.jpg";
import torontoFall from "@/assets/places/toronto-fall.jpg";
import {
  appearanceFromCountry,
  familyHasChildren,
  familyHasSpouse,
  familyIsPolygamous,
  type AdultMember,
  type Profile,
} from "@/data/profile";

export const PITCH_CONTACT = "ir-immigration.com   ·   WhatsApp 819 919 8683";

export type PitchBullet = { title: string; body?: string; image?: string; href?: string };
export type PitchStat = { value: string; label: string; note: string; image?: string };
export type PitchCard = { title: string; body: string; image?: string; href?: string };

export type PitchSlide = {
  id: number;
  layout:
    | "hero"
    | "welcome"
    | "split-right"
    | "split-left"
    | "stats"
    | "problems"
    | "pillars"
    | "journey"
    | "doors"
    | "promises"
    | "forms"
    | "cta";
  title: string;
  kicker?: string;
  lead?: string;
  image?: string;
  bullets?: string[];
  items?: PitchBullet[];
  stats?: PitchStat[];
  cards?: PitchCard[];
  quote?: string;
  legal?: string;
  footer?: string;
  qr?: string;
};

export function pitchClientNames(profile: Profile): string[] {
  const names: string[] = [];
  const applicant = profile.applicant.firstName.trim();
  if (applicant) names.push(applicant);
  if (familyHasSpouse(profile.family)) {
    const spouse = profile.spouse.firstName.trim();
    if (spouse) names.push(spouse);
    if (familyIsPolygamous(profile.family)) {
      for (const extra of profile.extraSpouses) {
        const name = extra.firstName.trim();
        if (name) names.push(name);
      }
    }
  }
  return names;
}

export function joinFrenchNames(names: string[]): string {
  if (names.length === 0) return "";
  if (names.length === 1) return names[0]!;
  if (names.length === 2) return `${names[0]} et ${names[1]}`;
  return `${names.slice(0, -1).join(", ")} et ${names[names.length - 1]}`;
}

export function pitchWelcomeTitle(profile: Profile): string {
  const joined = joinFrenchNames(pitchClientNames(profile));
  if (!joined) return "On peut vous aider à construire votre projet Canada.";
  return `On peut vous aider à construire votre projet Canada, ${joined}.`;
}

export type PitchHeroScene =
  | "single"
  | "student"
  | "couple"
  | "family"
  | "single-parent"
  | "worker"
  | "business"
  | "visit";

export type PitchHeroPeople = "femme" | "homme" | "hf" | "hh" | "ff";
export type PitchHeroLook = "noir" | "blanc" | "maghrebin" | "asiatique" | "latino";

const HERO_FILES = import.meta.glob("../assets/pitch/hero-*.jpg", {
  eager: true,
  import: "default",
}) as Record<string, string>;

const DAYS_FILES = import.meta.glob("../assets/pitch/days-*.jpg", {
  eager: true,
  import: "default",
}) as Record<string, string>;

const FORM_FILES = import.meta.glob("../assets/pitch/form-*.jpg", {
  eager: true,
  import: "default",
}) as Record<string, string>;

function profileImageFile(files: Record<string, string>, prefix: string, scene: string, people: string, look: string) {
  const needle = `${prefix}-${scene}-${people}-${look}.jpg`;
  const match = Object.entries(files).find(([path]) => {
    const normalized = path.replaceAll("\\", "/").split("?")[0];
    return normalized.endsWith(`/${needle}`) || normalized.endsWith(needle);
  });
  return match?.[1];
}

function heroFile(scene: string, people: string, look: string) {
  return profileImageFile(HERO_FILES, "hero", scene, people, look);
}

function daysFile(scene: string, people: string, look: string) {
  return profileImageFile(DAYS_FILES, "days", scene, people, look);
}

function formFile(scene: string, people: string, look: string) {
  return profileImageFile(FORM_FILES, "form", scene, people, look);
}

const HERO_BY_SCENE: Record<PitchHeroScene, string> = {
  single: heroSingle,
  student: heroStudent,
  couple: heroCouple,
  family: heroFamily,
  "single-parent": heroSingleParent,
  worker: heroWorker,
  business: heroBusiness,
  visit: heroVisit,
};

export function pitchHeroScene(profile: Profile): PitchHeroScene {
  if (familyHasChildren(profile.family) && familyHasSpouse(profile.family)) return "family";
  if (profile.family === "Parent seul + enfant(s)") return "single-parent";
  if (familyHasSpouse(profile.family)) return "couple";
  if (profile.objective === "Études") return "student";
  if (profile.objective === "Affaires") return "business";
  if (profile.objective === "Visite") return "visit";
  if (profile.objective === "Travail") return "worker";
  return "single";
}

export function pitchHeroPeople(profile: Profile): PitchHeroPeople {
  const scene = pitchHeroScene(profile);
  if (scene === "couple" || scene === "family") {
    const applicant = profile.applicant.sex;
    const spouse = profile.spouse.sex;
    if (applicant === "Homme" && spouse === "Homme") return "hh";
    if (applicant === "Femme" && spouse === "Femme") return "ff";
    return "hf";
  }
  return profile.applicant.sex === "Homme" ? "homme" : "femme";
}

function appearanceSlug(look: string): PitchHeroLook {
  if (look === "Blanc" || look === "blanc") return "blanc";
  if (look === "Maghrébin" || look === "maghrebin") return "maghrebin";
  if (look === "Asiatique" || look === "asiatique") return "asiatique";
  if (look === "Latino" || look === "latino") return "latino";
  return "noir";
}

export function pitchHeroLook(profile: Profile): PitchHeroLook {
  return appearanceSlug(appearanceFromCountry(profile.country));
}

export function pitchHeroLooks(profile: Profile): { applicant: PitchHeroLook; spouse: PitchHeroLook } {
  const look = appearanceSlug(appearanceFromCountry(profile.country));
  return {
    applicant: look,
    spouse: look,
  };
}

function coupleSexLooks(profile: Profile): { femme: PitchHeroLook; homme: PitchHeroLook } | null {
  if (pitchHeroPeople(profile) !== "hf") return null;
  const looks = pitchHeroLooks(profile);
  return {
    femme: profile.applicant.sex === "Femme" ? looks.applicant : looks.spouse,
    homme: profile.applicant.sex === "Homme" ? looks.applicant : looks.spouse,
  };
}

function pickPairLook(
  pick: (scene: string, people: string, look: string) => string | undefined,
  scene: string,
  people: string,
  lookA: string,
  lookB: string,
) {
  return (
    pick(scene, people, `${lookA}-${lookB}`) ??
    pick(scene, people, `${lookB}-${lookA}`) ??
    (scene === "family"
      ? pick("couple", people, `${lookA}-${lookB}`) ?? pick("couple", people, `${lookB}-${lookA}`)
      : undefined)
  );
}

function resolveProfileImage(
  pick: (scene: string, people: string, look: string) => string | undefined,
  profile: Profile,
  fallback: string,
) {
  const scene = pitchHeroScene(profile);
  const people = pitchHeroPeople(profile);
  const look = pitchHeroLook(profile);
  const looks = pitchHeroLooks(profile);
  const mixed = coupleSexLooks(profile);
  if (mixed && mixed.femme !== mixed.homme) {
    const mixedFile =
      pick(scene, "hf", `${mixed.femme}-${mixed.homme}`) ??
      (scene === "family" ? pick("couple", "hf", `${mixed.femme}-${mixed.homme}`) : undefined);
    if (mixedFile) return mixedFile;
  }
  if ((people === "hh" || people === "ff") && looks.applicant !== looks.spouse) {
    const mixedFile = pickPairLook(pick, scene, people, looks.applicant, looks.spouse);
    if (mixedFile) return mixedFile;
  }
  const soloPeople = people === "homme" ? "homme" : "femme";
  const pairPeople = people === "hh" || people === "ff" ? people : "hf";
  const lookFallback = look === "noir" ? "blanc" : "noir";
  return (
    pick(scene, people, look) ??
    pick(scene === "family" || scene === "couple" ? scene : "single", scene === "family" || scene === "couple" ? pairPeople : soloPeople, look) ??
    pick("couple", "hf", look) ??
    pick(scene, people, lookFallback) ??
    pick(scene, people, "noir") ??
    fallback
  );
}

export function pitchHeroImage(profile: Profile) {
  return resolveProfileImage(heroFile, profile, HERO_BY_SCENE[pitchHeroScene(profile)]);
}

export function pitchHeroSources(profile: Profile): string[] {
  return [pitchHeroImage(profile)];
}

export function personHeroImage(member: Pick<AdultMember, "sex" | "look">) {
  const people = member.sex === "Homme" ? "homme" : "femme";
  const look = appearanceSlug(member.look);
  const lookFallback = look === "noir" ? "blanc" : "noir";
  return (
    heroFile("single", people, look) ??
    heroFile("worker", people, look) ??
    heroFile("single", people, lookFallback) ??
    heroFile("single", people, "noir") ??
    (member.sex === "Homme" ? heroWorker : heroSingle)
  );
}

export function pitchDaysImage(profile: Profile) {
  return resolveProfileImage(daysFile, profile, slide10);
}

export type PitchFormKind = "student" | "worker" | "business" | "family";

const FORM_FALLBACK: Record<PitchFormKind, string> = {
  student: slide12a,
  worker: slide12b,
  business: slide12c,
  family: slide12d,
};

export function pitchFormPeople(profile: Profile, kind: PitchFormKind): PitchHeroPeople {
  if (kind === "family" && familyHasSpouse(profile.family)) {
    const applicant = profile.applicant.sex;
    const spouse = profile.spouse.sex;
    if (applicant === "Homme" && spouse === "Homme") return "hh";
    if (applicant === "Femme" && spouse === "Femme") return "ff";
    return "hf";
  }
  return profile.applicant.sex === "Homme" ? "homme" : "femme";
}

export function pitchFormImage(profile: Profile, kind: PitchFormKind) {
  const people = pitchFormPeople(profile, kind);
  const look = pitchHeroLook(profile);
  const looks = pitchHeroLooks(profile);
  const fallback = FORM_FALLBACK[kind];
  if (kind === "family" && people === "hf") {
    const mixed = {
      femme: profile.applicant.sex === "Femme" ? looks.applicant : looks.spouse,
      homme: profile.applicant.sex === "Homme" ? looks.applicant : looks.spouse,
    };
    if (mixed.femme !== mixed.homme) {
      const mixedFile = formFile(kind, "hf", `${mixed.femme}-${mixed.homme}`);
      if (mixedFile) return mixedFile;
    }
  }
  if (kind === "family" && (people === "hh" || people === "ff") && looks.applicant !== looks.spouse) {
    const mixedFile = pickPairLook(formFile, kind, people, looks.applicant, looks.spouse);
    if (mixedFile) return mixedFile;
  }
  const lookFallback = look === "noir" ? "blanc" : "noir";
  return (
    formFile(kind, people, look) ??
    formFile(kind, people, lookFallback) ??
    formFile(kind, people, "noir") ??
    (kind === "family" && (people === "hh" || people === "ff") ? formFile(kind, "hf", look) : undefined) ??
    formFile(kind, "femme", look) ??
    fallback
  );
}

export function pitchFormCards(profile: Profile): PitchCard[] {
  return [
    { title: "ÉTUDIER", body: "", image: pitchFormImage(profile, "student") },
    { title: "TRAVAILLER", body: "", image: pitchFormImage(profile, "worker") },
    { title: "ENTREPRENDRE", body: "", image: pitchFormImage(profile, "business") },
    { title: "S’INSTALLER EN FAMILLE", body: "", image: pitchFormImage(profile, "family") },
  ];
}

export const pitchSlides: PitchSlide[] = [
  {
    id: 1,
    layout: "hero",
    title: "VOTRE PROJET CANADA COMMENCE ICI",
    lead: "Immigration. Carrière. Installation.",
    image: slide01,
    bullets: ["Un seul écosystème pour transformer une ambition en projet de vie structuré."],
    footer: "STRATÉGIE • RIGUEUR • HUMAIN",
  },
  {
    id: 2,
    layout: "welcome",
    title: "On peut vous aider à construire votre projet Canada.",
    lead: "IR Immigration accompagne les familles depuis l’Afrique : statut, carrière et installation. Un seul interlocuteur pour réussir le projet, pas seulement déposer un dossier.",
    cards: [
      { title: "Travailler", body: "dans votre domaine", image: torontoFall },
      { title: "S’installer", body: "avec plus de sérénité", image: montrealFall },
      { title: "Construire", body: "un avenir familial", image: quebecFall },
      { title: "Évoluer", body: "au Canada", image: banffFall },
    ],
  },
  {
    id: 3,
    layout: "pillars",
    title: "QUI EST IR : 3 EXPERTISES, 1 SEUL PROJET DE VIE",
    lead: "Vous ne changez pas d’équipe à chaque étape. Nous connectons les enjeux qui décident de la qualité de votre parcours.",
    cards: [
      {
        title: "IMMIGRATION",
        body: "Analyse du profil, stratégie, préparation et coordination. Professionnels autorisés mobilisés lorsque requis.",
        href: "https://ir-immigration.com/",
      },
      {
        title: "CARRIÈRE & EMPLOI",
        body: "Positionnement métier, réseau et IR recrutement / Industrielle RH. Pas un emploi « garanti ».",
        href: "https://industriellerh.com/",
      },
      {
        title: "CONCIERGERIE",
        body: "Logement, accueil et démarches pour arriver avec des repères concrets.",
        href: "https://ir-conciergerie.com/",
      },
    ],
    quote: "Un seul fil conducteur : votre projet de vie au Canada.",
    legal: "Les services exacts dépendent du forfait, de la province et de votre admissibilité.",
  },
  {
    id: 4,
    layout: "split-left",
    title: "LE BUT D’UN PROJET D’IMMIGRATION",
    lead: "Immigrer pour réussir une vie, pas uniquement pour obtenir un papier.",
    image: slide08,
    items: [
      { title: "Un statut cohérent avec le foyer" },
      { title: "Un plan carrière réaliste" },
      { title: "Une installation préparée" },
      { title: "Une projection claire sur 3 à 5 ans" },
    ],
    quote: "Un statut n’est pas encore une intégration.",
  },
  {
    id: 5,
    layout: "forms",
    title: "LES OPPORTUNITÉS DU CANADA",
    lead: "Étudier, travailler, entreprendre et s’installer en famille, souvent dans la même trajectoire.",
    cards: [
      { title: "ÉTUDIER", body: "", image: slide12a },
      { title: "TRAVAILLER", body: "", image: slide12b },
      { title: "ENTREPRENDRE", body: "", image: slide12c },
      { title: "S’INSTALLER EN FAMILLE", body: "", image: slide12d },
    ],
  },
  {
    id: 6,
    layout: "problems",
    title: "LES PIÈGES QUI CASSENT LES PROJETS",
    lead: "Une bonne intention ne remplace pas une bonne stratégie.",
    items: [
      {
        title: "La mauvaise voie est choisie",
        body: "Le projet commence sans vraie lecture du profil.",
        image: problemWrongPath,
      },
      {
        title: "Le dossier manque de cohérence",
        body: "Documents, preuves et récit ne racontent pas la même histoire.",
        image: problemIncoherentFile,
      },
      {
        title: "La carrière est préparée trop tard",
        body: "Le marché du travail n’est pensé qu’après l’arrivée.",
        image: problemCareerLate,
      },
      {
        title: "L’installation est laissée au hasard",
        body: "Logement et démarches deviennent une urgence.",
        image: problemSettlementChance,
      },
    ],
    quote: "Chez IR, immigration, carrière et installation sont travaillées ensemble.",
  },
  {
    id: 7,
    layout: "promises",
    title: "NOTRE APPROCHE : RÈGLES, JUSTIFICATIONS, HONNÊTETÉ",
    lead: "La confiance commence par des attentes claires.",
    cards: [
      { title: "NOUS PROMETTONS", body: "yes" },
      { title: "NOUS NE PROMETTONS PAS", body: "no" },
    ],
    items: [
      { title: "Une lecture honnête de votre situation" },
      { title: "Le respect de la logique des autorités" },
      { title: "De la transparence sur les délais variables" },
      { title: "Un accompagnement structuré (et des recours si nécessaires)" },
      { title: "Une approbation garantie" },
      { title: "Un emploi garanti" },
      { title: "Une résidence permanente garantie" },
      { title: "Des délais irréalistes ou “miracles”" },
    ],
    quote: "Nous ne vendons pas de rêve. Nous construisons une méthode et un chemin sécurisé.",
    legal: "Toute décision appartient aux autorités compétentes.",
  },
  {
    id: 8,
    layout: "journey",
    title: "LE PIPELINE : DE L’IDÉE AU RDV",
    lead: "Une méthode simple. Le détail de la voie se construit en consultation.",
    items: [
      { title: "PROFIL", body: "Comprendre le foyer et l’objectif." },
      { title: "PROJECTION", body: "Salaires, coût de vie, opportunités." },
      { title: "RISQUES", body: "Nommer les pièges avant qu’ils coûtent." },
      { title: "DIFFÉRENCE IR", body: "Comparer avec les autres approches." },
      { title: "ÉCOSYSTÈME", body: "Immigration, emploi, installation." },
      { title: "RDV WEB", body: "Réserver la consultation sur le site." },
    ],
    quote: "Quelle est la prochaine action utile pour votre projet ?",
  },
  {
    id: 9,
    layout: "stats",
    title: "POURQUOI IR PLUTÔT QU’UNE AGENCE « VISA ONLY » ?",
    lead: "Les portes existent. La préparation et l’écosystème font la différence.",
    stats: [
      {
        value: "3",
        label: "expertises dans un seul projet de vie",
        note: "Immigration · Emploi · Conciergerie",
        image: pontInstallation,
      },
      {
        value: "1",
        label: "interlocuteur pour le foyer",
        note: "Pas un vendeur de visa isolé",
        image: emploiSante,
      },
      {
        value: "0",
        label: "promesse miracle",
        note: "Décisions aux autorités",
        image: pontVille,
      },
      {
        value: "∞",
        label: "partenaires pour les démarches",
        note: "Études, billet, RP, emploi…",
        image: demoAines,
      },
    ],
    quote: "Immigrer pour réussir, pas uniquement pour un dossier.",
  },
  {
    id: 10,
    layout: "split-right",
    title: "UN ÉCOSYSTÈME DE PARTENAIRES",
    lead: "Visa, billet, études, emploi, RP, installation : un réseau pour chaque étape.",
    image: slide09,
    items: [
      { title: "IR Immigration, stratégie et dossier", href: "https://ir-immigration.com/" },
      { title: "IR recrutement / Industrielle RH, carrière", href: "https://industriellerh.com/" },
      { title: "IR Conciergerie, logement et accueil", href: "https://ir-conciergerie.com/" },
      { title: "Partenaires études, billet et démarches" },
    ],
    legal: "Les honoraires IR sont présentés en rendez-vous, selon le projet.",
  },
  {
    id: 11,
    layout: "journey",
    title: "CE QUE VOUS OBTENEZ EN SIGNANT AVEC IR",
    lead: "Un parcours clair. Le détail opérationnel se précise en consultation.",
    items: [
      { title: "DIAGNOSTIC", body: "Profil, objectifs, contraintes du foyer." },
      { title: "STRATÉGIE", body: "Options réalistes, sans tout dévoiler ici." },
      { title: "PRÉPARATION", body: "Documents, preuves, calendrier." },
      { title: "DÉPÔT & SUIVI", body: "Coordination et réponses aux autorités." },
      { title: "DÉPART", body: "Carrière, logement, plan d’arrivée." },
      { title: "INTÉGRATION", body: "Soutien après l’arrivée." },
    ],
    quote: "Le Canada n’est pas un rêve à acheter. C’est un projet à construire.",
  },
  {
    id: 12,
    layout: "cta",
    title: "PRENEZ RENDEZ-VOUS SUR LE SITE",
    lead: "Le détail de votre voie se construit en consultation. Réservez maintenant sur ir-immigration.com.",
    qr: slide13qr,
    items: [
      { title: "Vous clarifiez l’objectif du foyer" },
      { title: "Nous cadrons une stratégie réaliste" },
      { title: "Vous repartez avec les prochaines étapes" },
      { title: "Les honoraires sont présentés en rendez-vous" },
    ],
    footer: "PRENDRE RENDEZ-VOUS",
    legal: "ir-immigration.com · WhatsApp 819 919 8683",
  },
];
