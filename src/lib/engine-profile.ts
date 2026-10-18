import * as africa from "@/data/profile";

/**
 * Adaptateur entre le profil Afrique (commercial, sans Navigator) et le moteur de pistes
 * partagé avec le Sales Hub Canada. Le client présente sa demande depuis l’étranger :
 * les faits « côté Canada » prennent leurs valeurs par défaut (pas au Canada, aucune
 * expérience ni diplôme canadien). Seul le CV saisi par le commercial alimente le moteur.
 */
export * from "@/data/profile";

export type CanadianCredentialTier = "none" | "one_two_years" | "three_plus_years";

export type AdultMember = africa.AdultMember & {
  workNocCode: string;
  workPermitKind: string;
  workHasOffer: boolean;
};

export type ExtraSpouse = AdultMember & { id: string };

export type HomeTies = {
  employment: boolean;
  business: boolean;
  property: boolean;
  familyLeftBehind: boolean;
  notes: string;
};

export type Profile = Omit<africa.Profile, "applicant" | "spouse" | "extraSpouses"> & {
  applicant: AdultMember;
  spouse: AdultMember;
  extraSpouses: ExtraSpouse[];
  studyProvince: string;
  offerProvince: string;
  currentlyInCanada: boolean;
  canadianExperienceYears: number;
  spouseHasCanadianExperience: boolean;
  hasProvincialNomination: boolean;
  hasSiblingInCanada: boolean;
  canadianCredentialTier: CanadianCredentialTier;
  homeTies: HomeTies;
};

const noWork = { workNocCode: "", workPermitKind: "", workHasOffer: false };

export function toEngineProfile(profile: africa.Profile): Profile {
  return {
    ...profile,
    applicant: {
      ...profile.applicant,
      workNocCode: profile.workNocCode,
      workPermitKind: profile.workPermitKind,
      workHasOffer: profile.workHasOffer,
    },
    spouse: { ...profile.spouse, ...noWork },
    extraSpouses: profile.extraSpouses.map((s) => ({ ...s, ...noWork })),
    studyProvince: profile.province,
    offerProvince: profile.workHasOffer ? profile.province : "",
    currentlyInCanada: false,
    canadianExperienceYears: 0,
    spouseHasCanadianExperience: false,
    hasProvincialNomination: false,
    hasSiblingInCanada: false,
    canadianCredentialTier: "none",
    homeTies: { employment: true, business: false, property: false, familyLeftBehind: true, notes: "" },
  };
}

/** Profil de démonstration au format du moteur (tests et aperçus). */
export const defaultProfile: Profile = toEngineProfile(africa.defaultProfile);
export const defaultApplicant: AdultMember = defaultProfile.applicant;
export const defaultSpouse: AdultMember = defaultProfile.spouse;
