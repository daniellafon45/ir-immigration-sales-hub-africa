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
import slide14 from "@/assets/pitch/slide-14-1.jpg";
import banffFall from "@/assets/places/banff-fall.jpg";
import montrealFall from "@/assets/places/montreal-fall.jpg";
import quebecFall from "@/assets/places/quebec-fall.jpg";
import torontoFall from "@/assets/places/toronto-fall.jpg";
import {
  familyHasChildren,
  familyHasSpouse,
  familyIsPolygamous,
  type AdultMember,
  type Profile,
} from "@/data/profile";

export const PITCH_CONTACT = "ir-immigration.com   ·   WhatsApp 819 919 8683";

export type PitchBullet = { title: string; body?: string; image?: string };
export type PitchStat = { value: string; label: string; note: string; image?: string };
export type PitchCard = { title: string; body: string; image?: string };

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
  return appearanceSlug(profile.applicant.look);
}

export function pitchHeroLooks(profile: Profile): { applicant: PitchHeroLook; spouse: PitchHeroLook } {
  return {
    applicant: appearanceSlug(profile.applicant.look),
    spouse: appearanceSlug(profile.spouse.look),
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
  const look = appearanceSlug(profile.applicant.look);
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
    kicker: "Pitch · Votre projet",
    title: "On peut vous aider à construire votre projet Canada.",
    lead: "Nous sommes un cabinet d’immigration qui construit le projet au complet : statut, carrière et installation. Un seul interlocuteur, de la stratégie jusqu’à l’arrivée.",
    cards: [
      { title: "Travailler", body: "dans votre domaine", image: torontoFall },
      { title: "S’installer", body: "avec plus de sérénité", image: montrealFall },
      { title: "Construire", body: "un avenir familial", image: quebecFall },
      { title: "Évoluer", body: "au Canada", image: banffFall },
    ],
  },
  {
    id: 3,
    layout: "stats",
    title: "LE CANADA CONTINUE D’ACCUEILLIR. LA SÉLECTION EST PLUS CIBLÉE.",
    lead: "Les possibilités restent réelles, mais le profil, la stratégie et la qualité du dossier comptent davantage.",
    stats: [
      {
        value: "380 000",
        label: "admissions de résidents permanents prévues chaque année",
        note: "2026 à 2028",
        image: pontInstallation,
      },
      {
        value: "64 %",
        label: "part de l’immigration économique visée",
        note: "en 2027 et 2028",
        image: emploiSante,
      },
      {
        value: "9 %",
        label: "cible de résidents permanents francophones hors Québec",
        note: "2026 • 10,5 % en 2028",
        image: pontVille,
      },
      {
        value: "1,25",
        label: "enfant par femme au Canada, un creux historique",
        note: "donnée 2024",
        image: demoAines,
      },
    ],
    quote: "Les portes existent. La préparation fait la différence.",
    legal: "Sources : IRCC, Plan des niveaux d’immigration 2026-2028. Statistique Canada, fécondité 2024.",
  },
  {
    id: 4,
    layout: "problems",
    title: "POURQUOI TANT DE PROJETS SE COMPLIQUENT ?",
    lead: "Une bonne intention ne remplace pas une bonne stratégie.",
    items: [
      {
        title: "La mauvaise voie est choisie",
        body: "Le projet commence sans vraie lecture du profil et de l’admissibilité.",
        image: problemWrongPath,
      },
      {
        title: "Le dossier manque de cohérence",
        body: "Documents, preuves et récit ne racontent pas la même histoire.",
        image: problemIncoherentFile,
      },
      {
        title: "La carrière est préparée trop tard",
        body: "Le candidat pense au marché du travail seulement après son arrivée.",
        image: problemCareerLate,
      },
      {
        title: "L’installation est laissée au hasard",
        body: "Logement, démarches et repères se transforment en urgence.",
        image: problemSettlementChance,
      },
    ],
    quote: "Chez IR, immigration, carrière et installation sont travaillées ensemble.",
  },
  {
    id: 5,
    layout: "pillars",
    title: "LA DIFFÉRENCE IR : 3 EXPERTISES, 1 SEUL PROJET DE VIE",
    lead: "Vous ne changez pas d’équipe à chaque étape. Nous connectons les enjeux qui décident de la qualité de votre parcours.",
    cards: [
      {
        title: "IMMIGRATION",
        body: "Analyse du profil, stratégie, préparation et coordination du dossier. Professionnels autorisés mobilisés lorsque requis.",
      },
      {
        title: "CARRIÈRE & EMPLOI",
        body: "Positionnement métier, CV, entrevue, orientation vers les exigences du marché et réseau professionnel.",
      },
      {
        title: "CONCIERGERIE",
        body: "Logement, accueil, démarches pratiques et installation pour arriver avec des repères concrets.",
      },
    ],
    quote: "Un seul fil conducteur : votre projet de vie au Canada.",
    legal: "Les services exacts dépendent du forfait choisi, de la province et de votre admissibilité.",
  },
  {
    id: 6,
    layout: "journey",
    title: "VOTRE PARCOURS, DE L’IDÉE À L’INSTALLATION",
    lead: "Une méthode simple à comprendre. Chaque étape prépare la suivante.",
    items: [
      { title: "DIAGNOSTIC", body: "Comprendre votre profil, vos objectifs et vos contraintes." },
      { title: "STRATÉGIE", body: "Identifier les options réalistes et les priorités." },
      { title: "PRÉPARATION", body: "Organiser les documents, preuves et échéances." },
      { title: "DÉPÔT & SUIVI", body: "Coordonner le dossier et répondre aux demandes." },
      { title: "DÉPART", body: "Préparer carrière, logement et arrivée." },
      { title: "INTÉGRATION", body: "Soutenir l’installation et les prochaines étapes." },
    ],
    quote: "Une seule question guide tout le parcours : quelle est la prochaine action utile pour votre projet ?",
  },
  {
    id: 7,
    layout: "forms",
    title: "VOTRE CANADA PEUT PRENDRE PLUSIEURS FORMES",
    lead: "Chaque projet est différent. Votre stratégie doit l’être aussi.",
    cards: [
      { title: "ÉTUDIER", body: "", image: slide12a },
      { title: "TRAVAILLER", body: "", image: slide12b },
      { title: "ENTREPRENDRE", body: "", image: slide12c },
      { title: "S’INSTALLER EN FAMILLE", body: "", image: slide12d },
    ],
    quote: "IR vous aide à transformer l’envie en plan d’action réaliste.",
  },
  {
    id: 8,
    layout: "split-left",
    title: "UN STATUT N’EST PAS ENCORE UNE INTÉGRATION",
    lead: "Nous préparons aussi l’après.",
    image: slide08,
    items: [
      { title: "Projet professionnel et ciblage métier" },
      { title: "CV, entrevue et positionnement aux standards canadiens" },
      { title: "Orientation sur reconnaissance, équivalences et formations utiles" },
      { title: "Réseau, employeurs et pistes de développement" },
    ],
    quote: "Objectif : arriver avec un plan professionnel, pas recommencer de zéro.",
  },
  {
    id: 9,
    layout: "split-right",
    title: "VOTRE ARRIVÉE PEUT ÊTRE DÉJÀ ORGANISÉE",
    lead: "Selon le forfait choisi, nous pouvons préparer une grande partie de votre installation avant même votre départ.",
    image: slide09,
    items: [
      { title: "Accueil à l’aéroport" },
      { title: "Recherche et inspection de logement" },
      { title: "Clés et logement prêt" },
      { title: "SIM, premières courses et abonnements" },
      { title: "Démarches essentielles sur place" },
      { title: "Support et orientation après l’arrivée" },
    ],
    legal: "Les démarches varient selon la province, le statut et la situation du client.",
  },
  {
    id: 10,
    layout: "hero",
    title: "IMAGINEZ VOS 90 PREMIERS JOURS",
    lead: "Moins d’improvisation. Plus de repères dès le départ.",
    image: slide10,
    items: [
      { title: "AVANT LE DÉPART", body: "Documents, logement, préparation carrière et plan d’arrivée." },
      { title: "SEMAINE 1", body: "Accueil, clés, démarches prioritaires, repères essentiels." },
      { title: "MOIS 1 À 3", body: "Installation, réseau, carrière, suivi et ajustements." },
    ],
    legal: "Selon les services retenus et votre situation.",
  },
  {
    id: 11,
    layout: "promises",
    title: "CE QUE NOUS PROMETTONS. ET CE QUE NOUS NE PROMETTONS PAS.",
    lead: "La confiance commence par des attentes claires.",
    cards: [
      { title: "NOUS PROMETTONS", body: "yes" },
      { title: "NOUS NE PROMETTONS PAS", body: "no" },
    ],
    items: [
      { title: "Une lecture honnête de votre situation" },
      { title: "Une stratégie personnalisée" },
      { title: "De la rigueur et de la transparence" },
      { title: "Un accompagnement structuré dans la durée" },
      { title: "Une approbation garantie" },
      { title: "Un emploi garanti" },
      { title: "Une résidence permanente garantie" },
      { title: "Des délais irréalistes ou “miracles”" },
    ],
    quote: "Nous ne vendons pas de rêve. Nous construisons une méthode et un chemin sécurisé.",
    legal: "Toute décision appartient aux autorités compétentes. L’admissibilité est évaluée au cas par cas.",
  },
  {
    id: 12,
    layout: "cta",
    title: "ENTAMONS VOTRE PROJET SANS PLUS TARDER",
    lead: "La consultation est déjà payée. Ses frais seront déduits des honoraires de service de la procédure.",
    qr: slide13qr,
    items: [
      { title: "Nous validons la stratégie retenue aujourd’hui" },
      { title: "Nous constituons le dossier et le calendrier" },
      { title: "Nous lançons les démarches sans attendre" },
      { title: "Vous avancez avec un plan d’action clair" },
    ],
    footer: "PARLONS DE VOTRE PROJET",
    legal: "Scannez pour nous écrire sur WhatsApp · 819 919 8683",
  },
  {
    id: 13,
    layout: "hero",
    title: "LE CANADA N’EST PAS UN RÊVE À ACHETER. C’EST UN PROJET À CONSTRUIRE.",
    lead: "Construisons le vôtre avec méthode.",
    image: slide14,
  },
];
