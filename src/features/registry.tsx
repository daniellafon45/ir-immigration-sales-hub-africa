import type { ComponentType } from "react";
import type { SectionId } from "@/catalog";
import {
  AfricaEcosystemSection,
  AfricaOpportunitiesSection,
  CountryCompareSection,
  PreuvesSection,
  RdvSection,
  RisksSection,
  WhyUsSection,
} from "@/features/africa";
import { PitchSection } from "@/features/pitch";
import { ProfileSection } from "@/features/profile";

export const sectionViews: Record<SectionId, ComponentType> = {
  profile: ProfileSection,
  pitch: PitchSection,
  opportunites: AfricaOpportunitiesSection,
  "comparaison-pays": CountryCompareSection,
  preuves: PreuvesSection,
  risques: RisksSection,
  "pourquoi-nous": WhyUsSection,
  ecosysteme: AfricaEcosystemSection,
  rdv: RdvSection,
};
