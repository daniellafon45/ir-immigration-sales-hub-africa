import { describe, expect, it } from "vitest";
import { defaultProfile as africaDefault } from "@/data/profile";
import { toEngineProfile } from "@/lib/engine-profile";

describe("toEngineProfile", () => {
  it("keeps the client's CV and fills the Canada-side facts for someone applying from abroad", () => {
    const engine = toEngineProfile({ ...africaDefault, workNocCode: "11100", workHasOffer: true });
    expect(engine.applicant.firstName).toBe(africaDefault.applicant.firstName);
    expect(engine.applicant.workNocCode).toBe("11100");
    expect(engine.applicant.workHasOffer).toBe(true);
    expect(engine.spouse.workNocCode).toBe("");
    expect(engine.currentlyInCanada).toBe(false);
    expect(engine.canadianExperienceYears).toBe(0);
    expect(engine.canadianCredentialTier).toBe("none");
    expect(engine.studyProvince).toBe(africaDefault.province);
  });

  it("keeps the exact amounts entered for each adult", () => {
    const engine = toEngineProfile({ ...africaDefault, applicant: { ...africaDefault.applicant, fundsCad: 9000 } });
    expect(engine.applicant.fundsCad).toBe(9000);
  });
});
