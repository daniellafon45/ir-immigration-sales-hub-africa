import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { beforeEach, describe, expect, it } from "vitest";
import { defaultProfile } from "@/data/profile";
import { useProfileStore } from "@/store/profile";

const source = readFileSync(join(dirname(fileURLToPath(import.meta.url)), "profile.ts"), "utf8");

describe("profile store source", () => {
  it("does not persist commit or reset to localStorage", () => {
    expect(source).not.toContain("loadProfile");
    expect(source).not.toContain("saveProfile");
    expect(source).toContain("importDraft");
  });
});

describe("profile store", () => {
  beforeEach(() => {
    useProfileStore.setState({
      profile: structuredClone(defaultProfile),
      draft: structuredClone(defaultProfile),
    });
  });

  it("commit copies draft onto profile without requiring a file", () => {
    useProfileStore.getState().patchApplicant({ firstName: "Awa" });
    expect(useProfileStore.getState().profile.applicant.firstName).toBe("Aminata");
    useProfileStore.getState().commit();
    expect(useProfileStore.getState().profile.applicant.firstName).toBe("Awa");
    expect(useProfileStore.getState().draft.applicant.firstName).toBe("Awa");
  });

  it("importDraft sets draft and live profile immediately", () => {
    const next = structuredClone(defaultProfile);
    next.applicant.firstName = "Nadia";
    next.province = "Ontario";
    useProfileStore.getState().importDraft(next);
    expect(useProfileStore.getState().draft.applicant.firstName).toBe("Nadia");
    expect(useProfileStore.getState().profile.applicant.firstName).toBe("Nadia");
    expect(useProfileStore.getState().profile.province).toBe("Ontario");
    expect(useProfileStore.getState().draft.province).toBe("Ontario");
  });

  it("reset restores the default profile in memory", () => {
    useProfileStore.getState().patchApplicant({ firstName: "Awa" });
    useProfileStore.getState().commit();
    useProfileStore.getState().reset();
    expect(useProfileStore.getState().profile).toEqual(defaultProfile);
    expect(useProfileStore.getState().draft).toEqual(defaultProfile);
  });

  it("setPrincipalMode updates draft and live profile without committing other edits", () => {
    useProfileStore.getState().patchApplicant({ firstName: "Awa" });
    useProfileStore.getState().setPrincipalMode("spouse");
    expect(useProfileStore.getState().profile.principalMode).toBe("spouse");
    expect(useProfileStore.getState().draft.principalMode).toBe("spouse");
    expect(useProfileStore.getState().profile.applicant.firstName).toBe("Aminata");
    expect(useProfileStore.getState().draft.applicant.firstName).toBe("Awa");
  });

  it("updates household appearance when the origin country changes", () => {
    useProfileStore.getState().setProject("country", "France");
    expect(useProfileStore.getState().draft.country).toBe("France");
    expect(useProfileStore.getState().draft.applicant.look).toBe("Blanc");
    expect(useProfileStore.getState().draft.spouse.look).toBe("Blanc");

    useProfileStore.getState().setProject("country", "Maroc");
    expect(useProfileStore.getState().draft.applicant.look).toBe("Maghrébin");
    expect(useProfileStore.getState().draft.spouse.look).toBe("Maghrébin");

    useProfileStore.getState().setProject("country", "Chine");
    expect(useProfileStore.getState().draft.applicant.look).toBe("Asiatique");

    useProfileStore.getState().setProject("country", "Mexique");
    expect(useProfileStore.getState().draft.applicant.look).toBe("Latino");
  });
});

