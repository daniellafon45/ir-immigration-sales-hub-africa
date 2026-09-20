import type { LucideIcon } from "lucide-react";
import {
  AlertTriangle,
  CalendarCheck,
  DollarSign,
  Globe2,
  Network,
  Presentation,
  Scale,
  TrendingUp,
  User,
} from "lucide-react";

export type SectionId =
  | "profile"
  | "pitch"
  | "opportunites"
  | "comparaison-pays"
  | "preuves"
  | "risques"
  | "pourquoi-nous"
  | "ecosysteme"
  | "rdv";

export type SectionMeta = {
  id: SectionId;
  label: string;
  icon: LucideIcon;
  slideCount: number;
};

export const sections: SectionMeta[] = [
  { id: "profile", label: "Profil client", icon: User, slideCount: 1 },
  { id: "pitch", label: "Votre projet", icon: Presentation, slideCount: 11 },
  { id: "opportunites", label: "Opportunités Canada", icon: TrendingUp, slideCount: 1 },
  { id: "comparaison-pays", label: "Canada vs pays", icon: Globe2, slideCount: 1 },
  { id: "preuves", label: "Salaires & coût de vie", icon: DollarSign, slideCount: 2 },
  { id: "risques", label: "Pièges & détresse", icon: AlertTriangle, slideCount: 1 },
  { id: "pourquoi-nous", label: "Pourquoi IR", icon: Scale, slideCount: 1 },
  { id: "ecosysteme", label: "Écosystème & parcours", icon: Network, slideCount: 1 },
  { id: "rdv", label: "Prendre RDV", icon: CalendarCheck, slideCount: 1 },
];
