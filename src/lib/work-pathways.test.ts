import { describe, expect, it } from "vitest";
import { defaultProfile, emptyAdult } from "@/data/profile";
import { workPathways } from "@/lib/work-pathways";

describe("workPathways", () => {
  it("marks a FEER 1 couple as CEC-eligible after 12 months and spouse-open eligible", () => {
    const pathways = workPathways({
      ...defaultProfile,
      objective: "Travail",
      family: "Couple",
      workNocCode: "21232",
      workPermitKind: "lmia",
      workHasOffer: true,
    });

    expect(pathways.noc).toBe("21232");
    expect(pathways.teer).toBe(1);
    expect(pathways.permits).toHaveLength(5);
    expect(pathways.permits.find((item) => item.kind === "lmia")).toMatchObject({
      kind: "lmia",
      openVsClosed: "closed",
      possible: true,
    });
    expect(pathways.prAfter).toEqual({
      cecEligible: true,
      months: 12,
      label: "Après 12 mois d’expérience autorisée en FEER 1 -> CEC possible (bassin Entrée express, pas une invitation).",
    });
    expect(pathways.spouseOpen).toEqual({
      eligible: true,
      reason:
        "Permis ouvert du conjoint possible: FEER 1 admissible selon IRCC si le permis du demandeur principal reste valide au moins 6 mois.",
    });
  });

  it("does not sell CEC or spouse open for TEER 5 couples", () => {
    const pathways = workPathways({
      ...defaultProfile,
      objective: "Travail",
      family: "Couple",
      workNocCode: "75110",
      workPermitKind: "lmia",
      workHasOffer: true,
    });

    expect(pathways.teer).toBe(5);
    expect(pathways.prAfter).toEqual({
      cecEligible: false,
      months: null,
      label: "CEC ne s’applique pas au FEER 5. Voir PCP / PNP ou programmes pilotes selon la province.",
    });
    expect(pathways.spouseOpen).toEqual({
      eligible: false,
      reason:
        "Pas de permis ouvert du conjoint automatique en FEER 5; voir plutôt une voie RP économique admissible si elle existe.",
    });
  });

  it("omits spouseOpen on solo files", () => {
    const pathways = workPathways({
      ...defaultProfile,
      objective: "Travail",
      family: "Seul(e)",
      spouse: emptyAdult,
      workNocCode: "11100",
      workPermitKind: "open",
      workHasOffer: false,
    });

    expect(pathways.spouseOpen).toBeUndefined();
    expect(pathways.renewal.fees.total).toBe(340);
    expect(pathways.renewal.openCanChangeEmployer).toBe(true);
  });

  it("keeps IEC renewal honest instead of selling it as a closed permit", () => {
    const pathways = workPathways({
      ...defaultProfile,
      objective: "Travail",
      family: "Seul(e)",
      spouse: emptyAdult,
      workNocCode: "21232",
      workPermitKind: "iec",
      workHasOffer: false,
    });

    expect(pathways.permits.find((item) => item.kind === "iec")).toMatchObject({
      kind: "iec",
      openVsClosed: "varies",
      possible: true,
    });
    expect(pathways.renewal.closedKeepsSameEmployer).toBe(false);
    expect(pathways.renewal.openCanChangeEmployer).toBe(true);
  });

  it("allows spouse open for selected TEER 3 occupation 33102", () => {
    const pathways = workPathways({
      ...defaultProfile,
      objective: "Travail",
      family: "Couple",
      workNocCode: "33102",
      workPermitKind: "lmia",
      workHasOffer: true,
    });

    expect(pathways.teer).toBe(3);
    expect(pathways.spouseOpen).toEqual({
      eligible: true,
      reason:
        "Permis ouvert du conjoint possible: la CNP 33102 fait partie des professions FEER 2 ou 3 sélectionnées par l’IRCC, sous réserve du permis valide au moins 6 mois.",
    });
  });
});
