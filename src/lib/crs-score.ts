import {
  CRS_SOURCE,
  agePoints,
  canadianCredentialPoints,
  canadianExperiencePoints,
  educationCanadianExperienceTransfer,
  educationLanguageTransfer,
  educationPoints,
  firstLanguagePoints,
  foreignExperienceCanadianExperienceTransfer,
  foreignExperienceLanguageTransfer,
  frenchBonusPoints,
  jobOfferPoints,
  secondLanguagePoints,
  spouseCanadianExperiencePoints,
  spouseEducationPoints,
  spouseLanguagePoints,
  PNP_NOMINATION_POINTS,
  SIBLING_IN_CANADA_POINTS,
} from "@/data/crs-grid";
import { familyHasSpouse, type Profile } from "@/lib/engine-profile";
import { teerOf } from "@/data/noc-2021";
import { recommendPrincipal } from "@/lib/principal";

const LANGUAGE_RANK: Record<string, number> = {
  Débutant: 0,
  Intermédiaire: 1,
  Avancé: 2,
  Bilingue: 3,
};

function strongerLanguage(a: string, b: string) {
  return (LANGUAGE_RANK[a] ?? 0) >= (LANGUAGE_RANK[b] ?? 0) ? a : b;
}

function weakerLanguage(a: string, b: string) {
  return (LANGUAGE_RANK[a] ?? 0) >= (LANGUAGE_RANK[b] ?? 0) ? b : a;
}

export type CrsResult = {
  hasSpouseFactors: boolean;
  age: number;
  education: number;
  firstLanguage: number;
  secondLanguage: number;
  canadianExperience: number;
  coreHumanCapital: number;
  spouseEducation: number;
  spouseLanguage: number;
  spouseExperience: number;
  spouseFactors: number;
  transferEducationLanguage: number;
  transferEducationExperience: number;
  transferForeignExperienceLanguage: number;
  transferForeignExperienceCanadian: number;
  skillTransferability: number;
  provincialNomination: number;
  jobOffer: number;
  canadianStudy: number;
  sibling: number;
  frenchBonus: number;
  additionalPoints: number;
  total: number;
  maxPossible: number;
  sourceUrl: string;
  sourceLabel: string;
  verifiedOn: string;
};

export const CRS_DISCLAIMER =
  "Estimation indicative du Système de classement global (SCG), calculée à partir des niveaux déclarés " +
  "(pas de résultats officiels TEF/IELTS/CELPIP, pas d’ÉÉDC validée). À confirmer avec un test linguistique " +
  "reconnu et une évaluation des diplômes avant de s’appuyer sur ce chiffre.";

export function computeCrsScore(profile: Profile): CrsResult {
  const analysis = recommendPrincipal(profile);
  const principal = analysis.selectedAdult.member;
  const hasSpouse = familyHasSpouse(profile.family);
  const spouse = hasSpouse ? analysis.accompanying?.member ?? profile.spouse : null;

  const principalFirstLang = strongerLanguage(principal.french, principal.english);
  const principalSecondLang = weakerLanguage(principal.french, principal.english);

  const age = agePoints(principal.age, hasSpouse);
  const education = educationPoints(principal.education, hasSpouse);
  const firstLanguage = firstLanguagePoints(principalFirstLang, hasSpouse);
  const secondLanguage = secondLanguagePoints(principalSecondLang, hasSpouse);
  const canadianExperience = canadianExperiencePoints(profile.canadianExperienceYears, hasSpouse);
  const coreHumanCapital = age + education + firstLanguage + secondLanguage + canadianExperience;

  const spouseEducation = spouse ? spouseEducationPoints[spouse.education] ?? 0 : 0;
  const spouseLanguage = spouse ? spouseLanguagePoints(strongerLanguage(spouse.french, spouse.english)) : 0;
  const spouseExperience = spouse ? spouseCanadianExperiencePoints(profile.spouseHasCanadianExperience) : 0;
  const spouseFactors = Math.min(40, spouseEducation + spouseLanguage + spouseExperience);

  const transferEducationLanguage = educationLanguageTransfer(principal.education, principalFirstLang);
  const transferEducationExperience = educationCanadianExperienceTransfer(
    principal.education,
    profile.canadianExperienceYears,
  );
  const transferForeignExperienceLanguage = foreignExperienceLanguageTransfer(
    principal.experience,
    principalFirstLang,
  );
  const transferForeignExperienceCanadian = foreignExperienceCanadianExperienceTransfer(
    principal.experience,
    profile.canadianExperienceYears,
  );
  const skillTransferability = Math.min(
    100,
    transferEducationLanguage +
      transferEducationExperience +
      transferForeignExperienceLanguage +
      transferForeignExperienceCanadian,
  );

  const provincialNomination = profile.hasProvincialNomination ? PNP_NOMINATION_POINTS : 0;
  const teer = profile.workNocCode ? teerOf(profile.workNocCode) : null;
  const jobOffer = jobOfferPoints(profile.workHasOffer, teer);
  const canadianStudy = canadianCredentialPoints(profile.canadianCredentialTier);
  const sibling = profile.hasSiblingInCanada ? SIBLING_IN_CANADA_POINTS : 0;
  const frenchBonus = frenchBonusPoints(principal.french, principal.english);
  const additionalPoints = Math.min(600, provincialNomination + jobOffer + canadianStudy + sibling + frenchBonus);

  const total = coreHumanCapital + spouseFactors + skillTransferability + additionalPoints;

  return {
    hasSpouseFactors: hasSpouse,
    age,
    education,
    firstLanguage,
    secondLanguage,
    canadianExperience,
    coreHumanCapital,
    spouseEducation,
    spouseLanguage,
    spouseExperience,
    spouseFactors,
    transferEducationLanguage,
    transferEducationExperience,
    transferForeignExperienceLanguage,
    transferForeignExperienceCanadian,
    skillTransferability,
    provincialNomination,
    jobOffer,
    canadianStudy,
    sibling,
    frenchBonus,
    additionalPoints,
    total,
    maxPossible: 1200,
    sourceUrl: CRS_SOURCE.url,
    sourceLabel: CRS_SOURCE.label,
    verifiedOn: CRS_SOURCE.verifiedOn,
  };
}
