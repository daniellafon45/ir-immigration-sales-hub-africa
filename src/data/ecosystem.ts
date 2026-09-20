export type EcosystemPillar = {
  id: "immigration" | "recruitment" | "concierge";
  tag: string;
  title: string;
  body: string;
};

export const ecosystemPillars: EcosystemPillar[] = [
  {
    id: "immigration",
    tag: "IR Immigration",
    title: "Immigration",
    body: "Stratégie et accompagnement. Le chemin du foyer, pas le visa le plus rapide.",
  },
  {
    id: "recruitment",
    tag: "Industrielle RH",
    title: "Recrutement",
    body: "Emploi, carrière et réseau. Un métier positionné, pas un emploi « garanti ».",
  },
  {
    id: "concierge",
    tag: "IR Conciergerie",
    title: "Conciergerie",
    body: "Logement, accueil et démarches. Arriver avec un toit, pas avec une recherche en urgence.",
  },
];

export const IR_SITE_LABEL = "ir-immigration.com";
export const IR_SITE_URL = "https://ir-immigration.com";
export const IR_WHATSAPP_LABEL = "WhatsApp 819 919 8683";
export const IR_WHATSAPP_URL = "https://wa.me/18199198683";
export const IR_CTA = "Parlons de votre projet";
