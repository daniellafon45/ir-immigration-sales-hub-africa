import heroConsult from "@/assets/pitch-africa/hero-family-consult.jpg";
import welcomeWork from "@/assets/pitch-africa/welcome-work.jpg";
import welcomeHome from "@/assets/pitch-africa/welcome-home.jpg";
import welcomeFamily from "@/assets/pitch-africa/welcome-family.jpg";
import welcomeGrow from "@/assets/pitch-africa/welcome-grow.jpg";
import welcomeBgHouse from "@/assets/pitch-africa/welcome-bg-house.jpg";
import pillarImmigration from "@/assets/pitch-africa/pillar-immigration.jpg";
import pillarEmploi from "@/assets/pitch-africa/pillar-emploi.jpg";
import pillarConciergerie from "@/assets/pitch-africa/pillar-conciergerie.jpg";
import focusProject from "@/assets/pitch-africa/focus-project.jpg";
import trapChaos from "@/assets/pitch-africa/trap-chaos.jpg";
import mosaicStudy from "@/assets/pitch-africa/mosaic-study.jpg";
import mosaicBusiness from "@/assets/pitch-africa/mosaic-business.jpg";
import proofMeeting from "@/assets/pitch-africa/proof-meeting.jpg";
import proofKeys from "@/assets/pitch-africa/proof-keys.jpg";
import proofNetwork from "@/assets/pitch-africa/proof-network.jpg";
import proofDeparture from "@/assets/pitch-africa/proof-departure.jpg";
import ctaRdv from "@/assets/pitch-africa/cta-rdv.jpg";
import slide13qr from "@/assets/pitch/slide-13-1.png";
import { PITCH_CONTACT } from "@/data/pitch";

export { PITCH_CONTACT };

export type AfricaPitchLayout =
  | "africa-hero"
  | "africa-welcome"
  | "africa-trio"
  | "africa-focus"
  | "africa-mosaic"
  | "africa-traps"
  | "africa-promises"
  | "africa-proof"
  | "africa-links"
  | "africa-journey"
  | "africa-cta";

export type AfricaPitchBullet = { title: string; body?: string; href?: string };
export type AfricaPitchCard = { title: string; body: string; image?: string; href?: string };
export type AfricaPitchStat = { value: string; label: string; note: string; image?: string };

export type AfricaPitchSlide = {
  id: number;
  layout: AfricaPitchLayout;
  title: string;
  kicker?: string;
  lead?: string;
  image?: string;
  /** Full-bleed atmospheric photo behind light slides (trio / focus / mosaic). */
  backgroundImage?: string;
  bullets?: string[];
  items?: AfricaPitchBullet[];
  cards?: AfricaPitchCard[];
  stats?: AfricaPitchStat[];
  quote?: string;
  legal?: string;
  footer?: string;
  qr?: string;
};

export const africaPitchSlides: AfricaPitchSlide[] = [
  {
    id: 1,
    layout: "africa-hero",
    title: "VOTRE PROJET CANADA COMMENCE ICI",
    lead: "Immigration. Carrière. Installation.",
    image: heroConsult,
    bullets: ["Un seul écosystème pour transformer une ambition en projet de vie structuré."],
    footer: "STRATÉGIE • RIGUEUR • HUMAIN",
  },
  {
    id: 2,
    layout: "africa-welcome",
    title: "On peut vous aider à construire votre projet Canada.",
    lead: "IR Immigration accompagne les familles depuis l’Afrique : statut, carrière et installation. Un seul interlocuteur pour réussir le projet, pas seulement déposer un dossier.",
    image: welcomeBgHouse,
    cards: [
      { title: "Travailler", body: "dans votre domaine", image: welcomeWork },
      { title: "S’installer", body: "avec plus de sérénité", image: welcomeHome },
      { title: "Construire", body: "un avenir familial", image: welcomeFamily },
      { title: "Évoluer", body: "au Canada", image: welcomeGrow },
    ],
  },
  {
    id: 3,
    layout: "africa-trio",
    title: "QUI EST IR : 3 EXPERTISES, 1 SEUL PROJET DE VIE",
    lead: "Vous ne changez pas d’équipe à chaque étape. Nous connectons les enjeux qui décident de la qualité de votre parcours.",
    backgroundImage: welcomeGrow,
    cards: [
      {
        title: "IMMIGRATION",
        body: "Analyse du profil, stratégie, préparation et coordination. Professionnels autorisés mobilisés lorsque requis.",
        image: pillarImmigration,
        href: "https://ir-immigration.com/",
      },
      {
        title: "CARRIÈRE & EMPLOI",
        body: "Positionnement métier, réseau et IR recrutement / Industrielle RH. Pas un emploi « garanti ».",
        image: pillarEmploi,
        href: "https://industriellerh.com/",
      },
      {
        title: "CONCIERGERIE",
        body: "Logement, accueil et démarches pour arriver avec des repères concrets.",
        image: pillarConciergerie,
        href: "https://ir-conciergerie.com/",
      },
    ],
  },
  {
    id: 4,
    layout: "africa-focus",
    title: "LE BUT D’UN PROJET D’IMMIGRATION",
    lead: "Immigrer pour réussir une vie, pas uniquement pour obtenir un papier.",
    backgroundImage: focusProject,
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
    layout: "africa-mosaic",
    title: "LES OPPORTUNITÉS DU CANADA",
    lead: "Étudier, travailler, entreprendre et s’installer en famille, souvent dans la même trajectoire.",
    backgroundImage: mosaicStudy,
    cards: [
      { title: "ÉTUDIER", body: "Campus reliés au marché", image: mosaicStudy },
      { title: "TRAVAILLER", body: "Métiers en demande", image: welcomeWork },
      { title: "ENTREPRENDRE", body: "Écosystème partenaires", image: mosaicBusiness },
      { title: "S’INSTALLER", body: "Foyer et stabilité", image: welcomeFamily },
    ],
  },
  {
    id: 6,
    layout: "africa-traps",
    title: "LES PIÈGES QUI CASSENT LES PROJETS",
    lead: "Une bonne intention ne remplace pas une bonne stratégie.",
    image: trapChaos,
    items: [
      { title: "La mauvaise voie est choisie", body: "Le projet commence sans vraie lecture du profil." },
      { title: "Le dossier manque de cohérence", body: "Documents, preuves et récit ne racontent pas la même histoire." },
      { title: "La carrière est préparée trop tard", body: "Le marché du travail n’est pensé qu’après l’arrivée." },
      { title: "L’installation est laissée au hasard", body: "Logement et démarches deviennent une urgence." },
    ],
    quote: "Chez IR, immigration, carrière et installation sont travaillées ensemble.",
  },
  {
    id: 7,
    layout: "africa-promises",
    title: "NOTRE APPROCHE : RÈGLES, JUSTIFICATIONS, HONNÊTETÉ",
    lead: "La confiance commence par des attentes claires.",
    image: proofMeeting,
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
    layout: "africa-proof",
    title: "POURQUOI IR PLUTÔT QU’UNE AGENCE « VISA ONLY » ?",
    lead: "Les portes existent. La préparation et l’écosystème font la différence.",
    backgroundImage: proofNetwork,
    stats: [
      {
        value: "3",
        label: "expertises dans un seul projet de vie",
        note: "Immigration · Emploi · Conciergerie",
        image: proofMeeting,
      },
      {
        value: "1",
        label: "interlocuteur pour le foyer",
        note: "Pas un vendeur de visa isolé",
        image: proofKeys,
      },
      {
        value: "0",
        label: "promesse miracle",
        note: "Décisions aux autorités",
        image: proofNetwork,
      },
      {
        value: "∞",
        label: "partenaires pour les démarches",
        note: "Études, billet, RP, emploi…",
        image: proofDeparture,
      },
    ],
    quote: "Immigrer pour réussir, pas uniquement pour un dossier.",
  },
  {
    id: 9,
    layout: "africa-links",
    title: "UN ÉCOSYSTÈME DE PARTENAIRES",
    lead: "Visa, billet, études, emploi, RP, installation : un réseau pour chaque étape.",
    backgroundImage: mosaicBusiness,
    cards: [
      {
        title: "IR Immigration",
        body: "Stratégie et dossier",
        image: pillarImmigration,
        href: "https://ir-immigration.com/",
      },
      {
        title: "Industrielle RH",
        body: "Carrière et recrutement",
        image: pillarEmploi,
        href: "https://industriellerh.com/",
      },
      {
        title: "IR Conciergerie",
        body: "Logement et accueil",
        image: pillarConciergerie,
        href: "https://ir-conciergerie.com/",
      },
    ],
  },
  {
    id: 10,
    layout: "africa-journey",
    title: "CE QUE VOUS OBTENEZ EN SIGNANT AVEC IR",
    lead: "Un parcours clair. Le détail opérationnel se précise en consultation.",
    backgroundImage: proofDeparture,
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
    id: 11,
    layout: "africa-cta",
    title: "PRENEZ RENDEZ-VOUS SUR LE SITE",
    lead: "Le détail de votre voie se construit en consultation. Réservez maintenant sur ir-immigration.com.",
    image: ctaRdv,
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
