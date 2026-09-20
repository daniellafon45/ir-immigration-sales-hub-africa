import type { LucideIcon } from "lucide-react";
import {
  AlertTriangle,
  Briefcase,
  Calculator,
  Columns2,
  DollarSign,
  MapPin,
  Network,
  Presentation,
  Radio,
  Signpost,
  TrendingUp,
  User,
} from "lucide-react";

export type SectionId =
  | "profile"
  | "pitch"
  | "canada"
  | "opportunites"
  | "emplois"
  | "salaires"
  | "calculateurs"
  | "provinces"
  | "voies"
  | "comparateur"
  | "echecs"
  | "ecosysteme";

export type SectionMeta = {
  id: SectionId;
  label: string;
  icon: LucideIcon;
  slideCount: number;
};

export const sections: SectionMeta[] = [
  { id: "profile", label: "Profil client", icon: User, slideCount: 1 },
  { id: "pitch", label: "Pitch", icon: Presentation, slideCount: 13 },
  { id: "canada", label: "Canada Live", icon: Radio, slideCount: 4 },
  { id: "opportunites", label: "Opportunités", icon: TrendingUp, slideCount: 3 },
  { id: "emplois", label: "Emplois", icon: Briefcase, slideCount: 2 },
  { id: "salaires", label: "Guide salarial", icon: DollarSign, slideCount: 1 },
  { id: "calculateurs", label: "Calculateurs", icon: Calculator, slideCount: 3 },
  { id: "provinces", label: "Provinces", icon: MapPin, slideCount: 2 },
  { id: "voies", label: "Voies d’immigration", icon: Signpost, slideCount: 2 },
  { id: "comparateur", label: "Comparateur de procédures", icon: Columns2, slideCount: 2 },
  { id: "echecs", label: "Échecs fréquents", icon: AlertTriangle, slideCount: 1 },
  { id: "ecosysteme", label: "Écosystème IR", icon: Network, slideCount: 1 },
];
