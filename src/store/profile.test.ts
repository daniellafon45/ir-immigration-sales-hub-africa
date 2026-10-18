import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { beforeEach, describe, expect, it } from "vitest";
import { defaultProfile } from "@/data/profile";
import { useProfileStore } from "@/store/profile";
import { eeRoundsSnapshot, latestCutoffs } from "@/data/ee-rounds";
import { findBestPrograms } from "@/lib/best-programs";
import { toEngineProfile } from "@/lib/engine-profile";

const snapshotCutoffs = latestCutoffs(eeRoundsSnapshot.rounds);

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

describe("province « Toutes »", () => {
  beforeEach(() => {
    useProfileStore.setState({ profile: structuredClone(defaultProfile), draft: structuredClone(defaultProfile) });
  });

  it("switches to all-provinces mode and fills the province suggested by the pathways", () => {
    useProfileStore.getState().setAllProvinces();
    const draft = useProfileStore.getState().draft;
    expect(draft.provinceMode).toBe("all");
    expect(draft.province).toBe(findBestPrograms(toEngineProfile(draft), { cutoffs: snapshotCutoffs }).suggestedProvince);
  });

  it("leaves all-provinces mode when a specific province is chosen", () => {
    useProfileStore.getState().setAllProvinces();
    useProfileStore.getState().setProject("province", "Alberta");
    expect(useProfileStore.getState().draft.provinceMode).toBe("chosen");
    expect(useProfileStore.getState().draft.province).toBe("Alberta");
  });
});
