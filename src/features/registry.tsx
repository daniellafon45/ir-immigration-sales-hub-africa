import type { ComponentType } from "react";
import type { SectionId } from "@/catalog";
import {
  CompareSection,
  RoutesSection,
} from "@/features/immigration";
import { CanadaSection } from "@/features/canada";
import {
  CalculatorsSection,
  JobsSection,
  OpportunitiesSection,
  ProvincesSection,
  SalariesSection,
} from "@/features/market";
import { PitchSection } from "@/features/pitch";
import { ProfileSection } from "@/features/profile";
import {
  EcosystemSection,
  FailuresSection,
} from "@/features/sales";

export const sectionViews: Record<SectionId, ComponentType> = {
  profile: ProfileSection,
  pitch: PitchSection,
  canada: CanadaSection,
  opportunites: OpportunitiesSection,
  emplois: JobsSection,
  salaires: SalariesSection,
  calculateurs: CalculatorsSection,
  provinces: ProvincesSection,
  voies: RoutesSection,
  comparateur: CompareSection,
  echecs: FailuresSection,
  ecosysteme: EcosystemSection,
};
