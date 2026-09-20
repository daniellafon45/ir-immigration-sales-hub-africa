import { describe, expect, it } from "vitest";
import { defaultProfile, extraPrincipalMode, type ExtraSpouse, type Profile } from "@/data/profile";
import { honorairesFor } from "@/lib/honoraires";
import { householdJobs } from "@/lib/household-jobs";
import { householdMarket } from "@/lib/household-market";
import { recommendPrincipal } from "@/lib/principal";
import {
  PROFILE_FILE_KIND,
  PROFILE_FILE_VERSION,
  parseProfileFile,
  profileFileName,
  serializeProfileFile,
} from "@/lib/profile-file";
import { normalizeProfile } from "@/lib/storage";
import { workPathways } from "@/lib/work-pathways";

const extraAwa: ExtraSpouse = {
  id: "spouse-awa",
  firstName: "Awa",
  sex: "Femme",
  look: "Noir",
  age: 28,
  jobTitle: "Infirmier(ère)",
  profession: "Infirmier(ère)",
  sector: "Santé",
  salary: "Bonne",
  experience: 6,
  education: "Baccalauréat / Licence",
  french: "Avancé",
  english: "Intermédiaire",
};

function richClientProfile(): Profile {
  const profile = structuredClone(defaultProfile);
  profile.country = "Côte d'Ivoire";
  profile.family = "Polygame";
  profile.objective = "Travail";
  profile.province = "Ontario";
  profile.principalMode = extraPrincipalMode(extraAwa.id);
  profile.studyLevel = "bachelor";
  profile.studyProgramId = "bac-info";
  profile.workNocCode = "21232";
  profile.workPermitKind = "lmia";
  profile.workHasOffer = true;
  profile.visitPurpose = "family";
  profile.visitDuration = "3m";
  profile.businessPath = "c11";
  profile.familyLink = "spouse";
  profile.sponsorStatus = "citizen";
  profile.applicant = {
    firstName: "Koffi",
    sex: "Homme",
    look: "Noir",
    age: 34,
    jobTitle: "Développeur logiciel",
    profession: "Développeur logiciel",
    sector: "Technologies de l’information",
    salary: "Bonne",
    experience: 7,
    education: "Baccalauréat / Licence",
    french: "Avancé",
    english: "Avancé",
  };
  profile.spouse = {
    firstName: "Aïcha",
    sex: "Femme",
    look: "Noir",
    age: 31,
    jobTitle: "Enseignant(e)",
    profession: "Enseignant(e)",
    sector: "Éducation",
    salary: "Moyenne",
    experience: 5,
    education: "Maîtrise / Master",
    french: "Bilingue",
    english: "Intermédiaire",
  };
  profile.extraSpouses = [structuredClone(extraAwa)];
  profile.children = [{ id: "child-1", firstName: "Noah", age: 6 }];
  return profile;
}

describe("profileFileName", () => {
  it("slugs the applicant first name", () => {
    expect(profileFileName(defaultProfile)).toBe("profil-aminata.json");
  });

  it("falls back when the first name is blank", () => {
    const profile = structuredClone(defaultProfile);
    profile.applicant.firstName = "  ";
    expect(profileFileName(profile)).toBe("profil-client.json");
  });

  it("strips accents", () => {
    const profile = structuredClone(defaultProfile);
    profile.applicant.firstName = "Aïcha";
    expect(profileFileName(profile)).toBe("profil-aicha.json");
  });
});

describe("serializeProfileFile / parseProfileFile", () => {
  it("round-trips the default profile", () => {
    const text = serializeProfileFile(defaultProfile, "2026-09-18T14:30:00.000Z");
    const parsed = JSON.parse(text) as Record<string, unknown>;
    expect(parsed.kind).toBe(PROFILE_FILE_KIND);
    expect(parsed.version).toBe(PROFILE_FILE_VERSION);
    expect(parsed.exportedAt).toBe("2026-09-18T14:30:00.000Z");
    const result = parseProfileFile(text);
    expect(result).toEqual({ ok: true, profile: defaultProfile });
  });

  it("round-trips extra spouses and children", () => {
    const profile = structuredClone(defaultProfile);
    profile.family = "Polygame";
    profile.extraSpouses = [structuredClone(extraAwa)];
    profile.children = [{ id: "child-1", firstName: "Noah", age: 6 }];
    const result = parseProfileFile(serializeProfileFile(profile, "2026-09-18T14:30:00.000Z"));
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.profile.family).toBe("Polygame");
    expect(result.profile.extraSpouses[0]).toEqual(extraAwa);
    expect(result.profile.children[0]).toEqual({ id: "child-1", firstName: "Noah", age: 6 });
  });

  it("round-trips a rich client dossier onto the same platform outputs", () => {
    const original = richClientProfile();
    const normalized = normalizeProfile(original as unknown as Record<string, unknown>);
    expect(normalized).toEqual(original);
    const result = parseProfileFile(serializeProfileFile(original, "2026-09-18T14:30:00.000Z"));
    expect(result).toEqual({ ok: true, profile: normalized });
    if (!result.ok) return;
    expect(recommendPrincipal(result.profile)).toEqual(recommendPrincipal(original));
    expect(householdMarket(result.profile)).toEqual(householdMarket(original));
    expect(householdJobs(result.profile)).toEqual(householdJobs(original));
    expect(honorairesFor(result.profile)).toEqual(honorairesFor(original));
    expect(workPathways(result.profile)).toEqual(workPathways(original));
  });

  it("normalizes dirty fields on export so reimport stays canonical", () => {
    const dirty = structuredClone(defaultProfile);
    dirty.applicant.profession = "Plombier";
    dirty.applicant.sector = "Santé";
    dirty.applicant.jobTitle = "";
    dirty.applicant.french = "Courant";
    dirty.workHasOffer = "false" as unknown as boolean;
    dirty.workPermitKind = "closed-lmia";
    const result = parseProfileFile(serializeProfileFile(dirty, "2026-09-18T14:30:00.000Z"));
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.profile.applicant.profession).toBe("Technicien en maintenance");
    expect(result.profile.applicant.sector).toBe("Construction et métiers");
    expect(result.profile.applicant.jobTitle).toBe("Plombier");
    expect(result.profile.applicant.french).toBe("Intermédiaire");
    expect(result.profile.workHasOffer).toBe(false);
    expect(result.profile.workPermitKind).toBe("");
  });

  it("accepts a missing version and rejects an unknown one", () => {
    const withoutVersion = JSON.stringify({
      kind: PROFILE_FILE_KIND,
      exportedAt: "2026-09-18T14:30:00.000Z",
      profile: { applicant: { firstName: "Awa" } },
    });
    const accepted = parseProfileFile(withoutVersion);
    expect(accepted.ok).toBe(true);
    if (!accepted.ok) return;
    expect(accepted.profile.applicant.firstName).toBe("Awa");

    const error = { ok: false, error: "Ce fichier n'est pas un profil IR Sales Hub." };
    expect(
      parseProfileFile(
        JSON.stringify({
          kind: PROFILE_FILE_KIND,
          version: 2,
          profile: { applicant: { firstName: "Awa" } },
        }),
      ),
    ).toEqual(error);
  });

  it("normalizes a partial wrapped profile", () => {
    const text = JSON.stringify({
      kind: PROFILE_FILE_KIND,
      version: PROFILE_FILE_VERSION,
      exportedAt: "2026-09-18T14:30:00.000Z",
      profile: { applicant: { firstName: "Awa" } },
    });
    const result = parseProfileFile(text);
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.profile.applicant.firstName).toBe("Awa");
    expect(result.profile.country).toBe(defaultProfile.country);
  });

  it("rejects invalid JSON", () => {
    expect(parseProfileFile("")).toEqual({ ok: false, error: "Fichier JSON invalide." });
    expect(parseProfileFile("{")).toEqual({ ok: false, error: "Fichier JSON invalide." });
  });

  it("rejects documents that are not IR profile files", () => {
    const error = { ok: false, error: "Ce fichier n'est pas un profil IR Sales Hub." };
    expect(parseProfileFile("{}")).toEqual(error);
    expect(parseProfileFile(JSON.stringify({ kind: "other", profile: {} }))).toEqual(error);
    expect(parseProfileFile(JSON.stringify({ kind: PROFILE_FILE_KIND }))).toEqual(error);
    expect(parseProfileFile("null")).toEqual(error);
    expect(parseProfileFile("[]")).toEqual(error);
  });
});
