import { describe, expect, it } from "vitest";
import { arrimaRounds2026, arrimaScore, latestArrimaThreshold, quebecAutonomyFunds } from "@/data/arrima";
import { defaultProfile, type AdultMember, type Profile } from "@/lib/engine-profile";

const adult = (patch: Partial<AdultMember>): AdultMember => ({ ...defaultProfile.applicant, ...patch });
const profile = (patch: Partial<Profile> = {}): Profile => ({ ...structuredClone(defaultProfile), ...patch });

describe("arrimaScore (grille officielle du 26 juin 2026)", () => {
  it("scores a single applicant abroad: French, age, experience, education and the labour-diagnostic range", () => {
    const score = arrimaScore({
      principal: adult({ age: 30, education: "Maîtrise / Master", experience: 5, french: "Avancé" }),
      partner: null,
      profile: profile({ family: "Seul(e)" }),
    });
    expect(score.parts.french).toBe(176); // 44 × 4 compétences (niveau 7)
    expect(score.parts.age).toBe(120);
    expect(score.parts.experience).toBe(70);
    expect(score.min).toBe(176 + 120 + 70 + 110 + 25);
    expect(score.max).toBe(176 + 120 + 70 + 117 + 120);
  });

  it("uses the accompanied-applicant columns and adds the spouse factors", () => {
    const score = arrimaScore({
      principal: adult({ age: 35, education: "Baccalauréat / Licence", experience: 4, french: "Bilingue" }),
      partner: adult({ age: 32, education: "Baccalauréat / Licence", french: "Intermédiaire" }),
      profile: profile({ family: "Couple" }),
    });
    expect(score.parts.french).toBe(160); // 40 × 4
    expect(score.parts.age).toBe(68);
    expect(score.parts.experience).toBe(50);
    expect(score.parts.education).toEqual([88, 88]);
    expect(score.parts.spouse).toBe(24 + 17 + 16); // français 6×4, âge 32, bac 3-4 ans
    expect(score.min).toBe(160 + 68 + 50 + 88 + 25 + 57);
    expect(score.max).toBe(160 + 68 + 50 + 88 + 120 + 57);
  });

  it("gives no French points below level 5 and no age points from 45", () => {
    const score = arrimaScore({
      principal: adult({ age: 46, french: "Débutant", experience: 0, education: "Secondaire" }),
      partner: null,
      profile: profile({ family: "Seul(e)" }),
    });
    expect(score.parts.french).toBe(0);
    expect(score.parts.age).toBe(0);
    expect(score.parts.diagnostic).toEqual([0, 0]);
  });

  it("adds Québec experience and a validated job offer for someone already working in Québec", () => {
    const score = arrimaScore({
      principal: adult({ age: 30, education: "Baccalauréat / Licence", experience: 3, french: "Avancé" }),
      partner: null,
      profile: profile({ family: "Seul(e)", currentlyInCanada: true, province: "Québec", canadianExperienceYears: 2, workHasOffer: true, offerProvince: "Québec" }),
    });
    expect(score.parts.quebecExperience).toBe(80);
    expect(score.parts.offer).toEqual([30, 50]);
  });
});

describe("arrimaRounds2026", () => {
  it("keeps the official minimum scores where they were published", () => {
    expect(arrimaRounds2026.find((r) => r.date === "2026-06-04" && r.volet === 1)?.minScore).toBe(677);
    expect(latestArrimaThreshold(1, { abroad: false })?.minScore).toBeGreaterThan(0);
  });
});

describe("quebecAutonomyFunds (barème 2026)", () => {
  it("returns the official 3-month amounts", () => {
    expect(quebecAutonomyFunds({ adults: 1, minors: 0, adultDependants: 0 })).toBe(3957);
    expect(quebecAutonomyFunds({ adults: 2, minors: 3, adultDependants: 0 })).toBe(7531);
    expect(quebecAutonomyFunds({ adults: 2, minors: 0, adultDependants: 1 })).toBe(5803 + 1845);
  });
});
