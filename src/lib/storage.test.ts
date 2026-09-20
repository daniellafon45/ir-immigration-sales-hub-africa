import { beforeEach, describe, expect, it, vi } from "vitest";
import { defaultProfile } from "@/data/profile";
import { loadProfile, PROFILE_STORAGE_KEY, saveProfile } from "@/lib/storage";

const memory: Record<string, string> = {};

describe("profile storage", () => {
  beforeEach(() => {
    for (const key of Object.keys(memory)) delete memory[key];
    vi.stubGlobal("localStorage", {
      getItem: (key: string) => memory[key] ?? null,
      setItem: (key: string, value: string) => {
        memory[key] = value;
      },
      removeItem: (key: string) => {
        delete memory[key];
      },
    });
  });

  it("returns the default profile when empty", () => {
    expect(loadProfile()).toEqual(defaultProfile);
  });

  it("persists and reloads a nested profile", () => {
    const next = structuredClone(defaultProfile);
    next.applicant.firstName = "Awa";
    saveProfile(next);
    expect(loadProfile().applicant.firstName).toBe("Awa");
    expect(JSON.parse(memory[PROFILE_STORAGE_KEY] ?? "{}").applicant.firstName).toBe("Awa");
  });

  it("migrates a legacy flat profile", () => {
    memory[PROFILE_STORAGE_KEY] = JSON.stringify({
      firstName: "Nadia",
      profession: "Infirmier(ère)",
      family: "Couple",
      province: "Ontario",
    });
    const loaded = loadProfile();
    expect(loaded.applicant.firstName).toBe("Nadia");
    expect(loaded.applicant.profession).toBe("Infirmier(ère)");
    expect(loaded.province).toBe("Ontario");
  });

  it("migrates a numeric salary into a financial capacity", () => {
    memory[PROFILE_STORAGE_KEY] = JSON.stringify({
      applicant: { firstName: "Nadia", salary: 28000 },
      spouse: { firstName: "Mamadou", salary: 92000 },
    });
    const loaded = loadProfile();
    expect(loaded.applicant.salary).toBe("Moyenne");
    expect(loaded.spouse.salary).toBe("Très bonne");
  });

  it("migrates Famille to Couple + enfant(s) and seeds a second spouse for Polygame", () => {
    memory[PROFILE_STORAGE_KEY] = JSON.stringify({
      family: "Famille",
      applicant: { firstName: "Nadia" },
    });
    const family = loadProfile();
    expect(family.family).toBe("Couple + enfant(s)");
    expect(family.children).toHaveLength(1);

    memory[PROFILE_STORAGE_KEY] = JSON.stringify({
      family: "Polygame",
      applicant: { firstName: "Koffi" },
      spouse: { firstName: "Aïcha" },
    });
    const polygame = loadProfile();
    expect(polygame.family).toBe("Polygame");
    expect(polygame.extraSpouses).toHaveLength(1);
    expect(polygame.extraSpouses[0]?.sex).toBe("Femme");
  });

  it("fills missing adult sex from the merge base", () => {
    memory[PROFILE_STORAGE_KEY] = JSON.stringify({
      applicant: { firstName: "Nadia" },
      spouse: { firstName: "Mamadou" },
    });
    const loaded = loadProfile();
    expect(loaded.applicant.sex).toBe("Femme");
    expect(loaded.spouse.sex).toBe("Homme");
    expect(loaded.studyLevel).toBe("");
    expect(loaded.studyProgramId).toBe("");
    expect(loaded.workNocCode).toBe("");
    expect(loaded.workPermitKind).toBe("");
    expect(loaded.workHasOffer).toBe(false);
    expect(loaded.visitPurpose).toBe("");
    expect(loaded.visitDuration).toBe("");
    expect(loaded.businessPath).toBe("");
    expect(loaded.familyLink).toBe("");
    expect(loaded.sponsorStatus).toBe("");
  });

  it("keeps valid work, visit, business and family closing fields", () => {
    memory[PROFILE_STORAGE_KEY] = JSON.stringify({
      workNocCode: "21232",
      workPermitKind: "lmia",
      workHasOffer: true,
      visitPurpose: "family",
      visitDuration: "3m",
      businessPath: "c11",
      familyLink: "spouse",
      sponsorStatus: "citizen",
    });
    const loaded = loadProfile();
    expect(loaded.workNocCode).toBe("21232");
    expect(loaded.workPermitKind).toBe("lmia");
    expect(loaded.workHasOffer).toBe(true);
    expect(loaded.visitPurpose).toBe("family");
    expect(loaded.visitDuration).toBe("3m");
    expect(loaded.businessPath).toBe("c11");
    expect(loaded.familyLink).toBe("spouse");
    expect(loaded.sponsorStatus).toBe("citizen");
  });

  it("clears invalid noc and unknown closing enums", () => {
    memory[PROFILE_STORAGE_KEY] = JSON.stringify({
      workNocCode: "2123",
      workPermitKind: "unknown",
      visitPurpose: "holiday",
      visitDuration: "1y",
      businessPath: "startup",
      familyLink: "cousin",
      sponsorStatus: "visitor",
    });
    const loaded = loadProfile();
    expect(loaded.workNocCode).toBe("");
    expect(loaded.workPermitKind).toBe("");
    expect(loaded.visitPurpose).toBe("");
    expect(loaded.visitDuration).toBe("");
    expect(loaded.businessPath).toBe("");
    expect(loaded.familyLink).toBe("");
    expect(loaded.sponsorStatus).toBe("");
  });

  it("keeps a named study program and clears one that no longer matches the level", () => {
    memory[PROFILE_STORAGE_KEY] = JSON.stringify({
      studyLevel: "bachelor",
      studyProgramId: "bac-info",
    });
    expect(loadProfile().studyProgramId).toBe("bac-info");

    memory[PROFILE_STORAGE_KEY] = JSON.stringify({
      studyLevel: "master",
      studyProgramId: "bac-info",
    });
    expect(loadProfile().studyLevel).toBe("master");
    expect(loadProfile().studyProgramId).toBe("");
  });

  it("resolves a typed profession instead of clamping it to Autre", () => {
    memory[PROFILE_STORAGE_KEY] = JSON.stringify({
      applicant: { firstName: "Nadia", profession: "Plombier", jobTitle: "", sector: "Santé" },
    });
    const loaded = loadProfile();
    expect(loaded.applicant.profession).toBe("Technicien en maintenance");
    expect(loaded.applicant.sector).toBe("Construction et métiers");
    expect(loaded.applicant.jobTitle).toBe("Plombier");
  });

  it("keeps an unmatched métier as Autre with the typed title", () => {
    memory[PROFILE_STORAGE_KEY] = JSON.stringify({
      applicant: { firstName: "Nadia", profession: "Astronaute", jobTitle: "", sector: "Santé" },
    });
    const loaded = loadProfile();
    expect(loaded.applicant.profession).toBe("Autre");
    expect(loaded.applicant.sector).toBe("Autre");
    expect(loaded.applicant.jobTitle).toBe("Astronaute");
  });

  it("treats a string false work offer as absent", () => {
    memory[PROFILE_STORAGE_KEY] = JSON.stringify({
      workHasOffer: "false",
    });
    expect(loadProfile().workHasOffer).toBe(false);
  });

  it("resets an extra principal when the extra spouse is missing", () => {
    memory[PROFILE_STORAGE_KEY] = JSON.stringify({
      family: "Couple",
      principalMode: "extra:ghost",
      extraSpouses: [],
    });
    expect(loadProfile().principalMode).toBe("auto");
  });
});
