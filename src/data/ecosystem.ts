import pillarImmigration from "@/assets/pitch-africa/pillar-immigration.jpg";
import pillarEmploi from "@/assets/pitch-africa/pillar-emploi.jpg";
import pillarConciergerie from "@/assets/pitch-africa/pillar-conciergerie.jpg";

export type EcosystemPillar = {
  id: "immigration" | "recruitment" | "concierge";
  tag: string;
  title: string;
  body: string;
  url: string;
  image: string;
};

export const ecosystemPillars: EcosystemPillar[] = [
  {
    id: "immigration",
    tag: "IR Immigration",
    title: "Immigration",
    body: "Stratégie et accompagnement. Le chemin du foyer, pas le visa le plus rapide.",
    url: "https://ir-immigration.com/",
    image: pillarImmigration,
  },
  {
    id: "recruitment",
    tag: "Industrielle RH · IR recrutement",
    title: "Recrutement",
    body: "Emploi, carrière et réseau. Un métier positionné, pas un emploi « garanti ».",
    url: "https://industriellerh.com/",
    image: pillarEmploi,
  },
  {
    id: "concierge",
    tag: "IR Conciergerie",
    title: "Conciergerie",
    body: "Logement, accueil et démarches. Arriver avec un toit, pas avec une recherche en urgence.",
    url: "https://ir-conciergerie.com/",
    image: pillarConciergerie,
  },
];

export type EcosystemPartner = {
  id: string;
  label: string;
  body: string;
};

export const ecosystemPartners: EcosystemPartner[] = [
  { id: "visa", label: "Visa & dossiers", body: "Coordination des démarches avec des professionnels autorisés lorsque requis." },
  { id: "ticket", label: "Billet & départ", body: "Préparation du départ avec des partenaires logistiques." },
  { id: "rp", label: "Résidence permanente", body: "Stratégie long terme quand le profil et le timing le permettent." },
  { id: "study", label: "Études", body: "Orientation programme et campus, pas une brochure générique." },
  { id: "job", label: "Emploi", body: "Positionnement métier via IR recrutement / Industrielle RH." },
  { id: "settle", label: "Installation", body: "Conciergerie : logement, accueil, premières démarches." },
];

export type JourneyStep = {
  id: string;
  title: string;
  body: string;
  items?: string[];
};

export const journeySteps: JourneyStep[] = [
  { id: "diagnostic", title: "Diagnostic", body: "Comprendre le profil, les objectifs et les contraintes du foyer." },
  { id: "strategy", title: "Stratégie", body: "Choisir une voie réaliste, le détail se construit en consultation." },
  {
    id: "prepare",
    title: "Préparation",
    body: "Langue, emploi et preuves, avant le dépôt.",
    items: [
      "Test de français (TEF / TCF)",
      "CV & positionnement emploi",
      "Documents & preuves",
      "Calendrier cohérent",
    ],
  },
  { id: "file", title: "Dépôt & suivi", body: "Coordination du dossier et réponses aux autorités." },
  { id: "settle", title: "Installation", body: "Emploi, logement et repères dès l’arrivée." },
];

export const IR_SITE_LABEL = "ir-immigration.com";
export const IR_SITE_URL = "https://ir-immigration.com/";
export const IR_RH_SITE_LABEL = "industriellerh.com";
export const IR_RH_SITE_URL = "https://industriellerh.com/";
export const IR_CONCIERGERIE_SITE_LABEL = "ir-conciergerie.com";
export const IR_CONCIERGERIE_SITE_URL = "https://ir-conciergerie.com/";
export const IR_WHATSAPP_LABEL = "WhatsApp 819 919 8683";
export const IR_WHATSAPP_URL = "https://wa.me/18199198683";
export const IR_CTA = "Prendre rendez-vous";
export const IR_CTA_SECONDARY = "Écrire sur WhatsApp";
export const IR_FEES_NOTE = "Les honoraires IR sont présentés en rendez-vous, selon le projet.";
