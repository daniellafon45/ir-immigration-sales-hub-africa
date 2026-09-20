import { describe, expect, it } from "vitest";
import { defaultProfile, emptyAdult } from "@/data/profile";
import { jobs } from "@/data/jobs";
import { householdJobs } from "@/lib/household-jobs";

describe("jobs professions", () => {
  it("tags the original five listings as Comptable without changing their demo copy", () => {
    const accountants = jobs.filter((job) => job.profession === "Comptable");
    expect(accountants).toHaveLength(5);
    expect(accountants.map((job) => job.title)).toEqual([
      "Comptable",
      "Technicien comptable",
      "Analyste financier",
      "Commis comptable",
      "Contrôleur adjoint",
    ]);
    expect(accountants.map((job) => job.intl)).toEqual([true, false, true, true, false]);
  });

  it("adds developer and nurse demo jobs", () => {
    expect(jobs.filter((job) => job.profession === "Développeur logiciel")).toHaveLength(3);
    expect(jobs.filter((job) => job.profession === "Infirmier(ère)")).toHaveLength(2);
  });
});

describe("householdJobs", () => {
  it("splits the default couple into Comptable and Développeur logiciel groups", () => {
    const view = householdJobs(defaultProfile);
    expect(view.groups).toHaveLength(2);
    expect(view.groups[0].adult.member.firstName).toBe("Aminata");
    expect(view.groups[0].jobs).toHaveLength(5);
    expect(view.groups[1].adult.member.firstName).toBe("Mamadou");
    expect(view.groups[1].jobs).toHaveLength(3);
    expect(view.totalCount).toBe(8);
    expect(view.intlCount).toBe(5);
  });

  it("keeps a single group when the family is Seul(e)", () => {
    const view = householdJobs({ ...defaultProfile, family: "Seul(e)", spouse: emptyAdult });
    expect(view.groups).toHaveLength(1);
    expect(view.groups[0].jobs).toHaveLength(5);
  });

  it("filters international jobs per adult", () => {
    const view = householdJobs(defaultProfile, { intlOnly: true });
    expect(view.groups[0].jobs).toHaveLength(3);
    expect(view.groups[1].jobs).toHaveLength(2);
    expect(view.groups.every((group) => group.jobs.every((job) => job.intl))).toBe(true);
    expect(view.totalCount).toBe(5);
    expect(view.intlCount).toBe(5);
  });
});

