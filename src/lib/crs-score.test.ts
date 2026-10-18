import { describe, expect, it } from "vitest";
import { defaultProfile, type Profile } from "@/lib/engine-profile";
import { computeCrsScore } from "@/lib/crs-score";

function base(overrides: Partial<Profile> = {}): Profile {
  return {
    ...structuredClone(defaultProfile),
    ...overrides,
    applicant: { ...defaultProfile.applicant, ...(overrides.applicant ?? {}) },
    spouse: { ...defaultProfile.spouse, ...(overrides.spouse ?? {}) },
  };
}

describe("computeCrsScore", () => {
  it("never exceeds the official maximum of 1200", () => {
    const profile = base({
      family: "Couple",
      hasProvincialNomination: true,
      hasSiblingInCanada: true,
      canadianCredentialTier: "three_plus_years",
      canadianExperienceYears: 5,
      spouseHasCanadianExperience: true,
      workHasOffer: true,
      workNocCode: "00010",
      applicant: {
        ...defaultProfile.applicant,
        age: 28,
        education: "Doctorat",
        french: "Bilingue",
        english: "Bilingue",
        experience: 5,
      },
      spouse: {
        ...defaultProfile.spouse,
        education: "Doctorat",
        french: "Bilingue",
        english: "Bilingue",
      },
    });
    const result = computeCrsScore(profile);
    expect(result.total).toBeLessThanOrEqual(1200);
    expect(result.maxPossible).toBe(1200);
  });

  it("awards more core points solo than with a spouse, all else equal", () => {
    const solo = computeCrsScore(
      base({
        family: "Seul(e)",
        applicant: { ...defaultProfile.applicant, age: 28, education: "Baccalauréat / Licence" },
      }),
    );
    const withSpouse = computeCrsScore(
      base({
        family: "Couple",
        applicant: { ...defaultProfile.applicant, age: 28, education: "Baccalauréat / Licence" },
      }),
    );
    expect(solo.hasSpouseFactors).toBe(false);
    expect(withSpouse.hasSpouseFactors).toBe(true);
    expect(solo.age).toBeGreaterThan(withSpouse.age);
    expect(solo.education).toBeGreaterThan(withSpouse.education);
  });

  it("adds exactly 600 points for a provincial nomination, with no other additional points", () => {
    const neutral: Partial<Profile> = {
      applicant: { ...defaultProfile.applicant, french: "Intermédiaire", english: "Intermédiaire" },
    };
    const without = computeCrsScore(base({ ...neutral, hasProvincialNomination: false }));
    const withPnp = computeCrsScore(base({ ...neutral, hasProvincialNomination: true }));
    expect(without.additionalPoints).toBe(0);
    expect(withPnp.total - without.total).toBe(600);
  });

  it("gives a TEER 0 job offer more points than a TEER 1 offer", () => {
    const teer0 = computeCrsScore(base({ workHasOffer: true, workNocCode: "00010" }));
    const teer1 = computeCrsScore(base({ workHasOffer: true, workNocCode: "11100" }));
    expect(teer0.jobOffer).toBe(200);
    expect(teer1.jobOffer).toBe(50);
  });

  it("awards the higher French bonus only when English is also functional", () => {
    const frenchOnly = computeCrsScore(
      base({
        applicant: { ...defaultProfile.applicant, french: "Bilingue", english: "Débutant" },
      }),
    );
    const frenchAndEnglish = computeCrsScore(
      base({
        applicant: { ...defaultProfile.applicant, french: "Bilingue", english: "Avancé" },
      }),
    );
    expect(frenchOnly.frenchBonus).toBe(25);
    expect(frenchAndEnglish.frenchBonus).toBe(50);
  });

  it("caps skill transferability at 100", () => {
    const profile = base({
      canadianExperienceYears: 5,
      applicant: {
        ...defaultProfile.applicant,
        education: "Doctorat",
        french: "Bilingue",
        english: "Bilingue",
        experience: 8,
      },
    });
    const result = computeCrsScore(profile);
    expect(result.skillTransferability).toBeLessThanOrEqual(100);
  });

  it("gives zero additional points with no nomination, offer, study, sibling or French bonus", () => {
    const profile = base({
      hasProvincialNomination: false,
      workHasOffer: false,
      canadianCredentialTier: "none",
      hasSiblingInCanada: false,
      applicant: { ...defaultProfile.applicant, french: "Intermédiaire", english: "Intermédiaire" },
    });
    const result = computeCrsScore(profile);
    expect(result.additionalPoints).toBe(0);
  });
});
