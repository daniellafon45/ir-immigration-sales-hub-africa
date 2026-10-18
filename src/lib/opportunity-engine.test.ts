import { describe, expect, it } from "vitest";
import { arrimaAgePoints } from "@/data/arrima";
import { opportunityPrograms } from "@/data/opportunities";
import { defaultProfile, type AdultMember, type Profile } from "@/lib/engine-profile";
import { fswPoints, runOpportunities } from "@/lib/opportunity-engine";

const TODAY = "2026-10-18";

function base(overrides: Partial<Profile> = {}, applicant: Partial<AdultMember> = {}): Profile {
  return {
    ...structuredClone(defaultProfile),
    principalMode: "applicant",
    ...overrides,
    applicant: { ...defaultProfile.applicant, ...applicant },
  };
}

function statusOf(profile: Profile, id: string) {
  return runOpportunities(profile, TODAY).matches.find((m) => m.program.id === id)?.status;
}

describe("runOpportunities", () => {
  it("evaluates every catalog program with an official source", () => {
    const report = runOpportunities(defaultProfile, TODAY);
    expect(report.matches).toHaveLength(opportunityPrograms.length);
    for (const m of report.matches) {
      expect(m.program.sources.some((s) => /canada\.ca|quebec\.ca/.test(s.url))).toBe(true);
      expect(m.program.steps.length).toBeGreaterThan(0);
    }
  });

  it("marks closed and paused programs as closed with alternatives", () => {
    const report = runOpportunities(defaultProfile, TODAY);
    for (const id of ["pgp", "startup", "self-employed", "caregivers"]) {
      const m = report.matches.find((x) => x.program.id === id)!;
      expect(m.status).toBe("closed");
      expect(m.program.alternatives?.length).toBeGreaterThan(0);
    }
  });

  it("opens PSTQ volet 1 and the francophone category for a French-speaking accountant", () => {
    const profile = base({}, { profession: "Analyste financier", french: "Avancé", experience: 5 });
    expect(statusOf(profile, "pstq-v1")).toBe("ready");
    expect(statusOf(profile, "ee-french")).toBe("ready");
    expect(statusOf(profile, "mobilite-francophone")).toBe("lever");
  });

  it("routes regulated professions to PSTQ volet 3", () => {
    const profile = base({}, { profession: "Infirmier(ère)", sector: "Santé", french: "Avancé" });
    expect(statusOf(profile, "pstq-v1")).toBe("blocked");
    expect(statusOf(profile, "pstq-v3")).toBe("lever");
  });

  it("treats PSTQ volet 2 as a bridge for FEER 3-5 workers abroad", () => {
    const profile = base({}, { profession: "Cuisinier(ère)", french: "Intermédiaire", experience: 4 });
    expect(statusOf(profile, "pstq-v2")).toBe("bridge");
    expect(statusOf(profile, "pstq-v1")).toBe("blocked");
  });

  it("flags the PEQ window as urgent only for people already in Québec", () => {
    const inQc = base({ currentlyInCanada: true, province: "Québec", canadianExperienceYears: 1 });
    const peq = runOpportunities(inQc, TODAY).matches.find((m) => m.program.id === "peq")!;
    expect(peq.status).toBe("ready");
    expect(peq.urgent).toBe(true);
    expect(statusOf(defaultProfile, "peq")).toBe("blocked");
    expect(runOpportunities(inQc, "2026-11-01").matches.find((m) => m.program.id === "peq")!.status).toBe("closed");
  });

  it("checks IEC country and age caps", () => {
    expect(statusOf(base({ country: "France" }, { age: 29 }), "iec")).toBe("ready");
    expect(statusOf(base({ country: "France" }, { age: 38 }), "iec")).toBe("blocked");
    expect(statusOf(base({ country: "Bénin" }, { age: 25 }), "iec")).toBe("blocked");
  });

  it("always proposes at least one step-by-step strategy", () => {
    const weak = base({ budget: 0 }, { french: "Débutant", english: "Débutant", profession: "Autre", experience: 0 });
    expect(runOpportunities(weak, TODAY).strategies.length).toBeGreaterThan(0);
    const fr = base({}, { profession: "Analyste financier", french: "Avancé" });
    const ids = runOpportunities(fr, TODAY).strategies.map((s) => s.id);
    expect(ids).toContain("ee-french");
    expect(ids).toContain("francophone-bridge");
  });

  it("computes the Arrima age points from the official grid", () => {
    expect(arrimaAgePoints(25, false)).toBe(120);
    expect(arrimaAgePoints(35, true)).toBe(68);
    expect(arrimaAgePoints(45, false)).toBe(0);
    const report = runOpportunities(base({ family: "Seul(e)" }, { age: 30, education: "Maîtrise / Master", experience: 4 }), TODAY);
    expect(report.arrima.subtotal).toBe(120 + 117 + 70);
  });

  it("documents conditions, indicative cost and employer dependency for every program", () => {
    for (const p of opportunityPrograms) {
      expect(p.conditions.length, p.id).toBeGreaterThan(0);
      expect(typeof p.costCad, p.id).toBe("number");
      expect(typeof p.needsEmployer, p.id).toBe("boolean");
    }
  });

  it("flags programs the client cannot afford", () => {
    const poor = base({ budget: 3000 }, { profession: "Analyste financier", french: "Avancé" });
    const study = runOpportunities(poor, TODAY).matches.find((m) => m.program.id === "study")!;
    expect(study.affordable).toBe(false);
    expect(study.estimatedCost).toBeGreaterThan(3000);
    const visitor = runOpportunities(poor, TODAY).matches.find((m) => m.program.id === "visitor")!;
    expect(visitor.affordable).toBe(true);
  });

  it("scales the estimated cost with the family size", () => {
    const solo = base({ family: "Seul(e)" }, { profession: "Analyste financier", french: "Avancé" });
    const family = base(
      { family: "Couple + enfant(s)", children: [{ id: "c1", firstName: "A", age: 5 }, { id: "c2", firstName: "B", age: 8 }] },
      { profession: "Analyste financier", french: "Avancé" },
    );
    const cost = (p: Profile) => runOpportunities(p, TODAY).matches.find((m) => m.program.id === "pstq-v1")!.estimatedCost;
    expect(cost(family)).toBeGreaterThan(cost(solo));
  });

  it("puts affordable plans that need no employer first for a low-budget client without an offer", () => {
    const client = base({ family: "Seul(e)", budget: 5000, workHasOffer: false }, { profession: "Analyste financier", french: "Avancé" });
    const [best, ...rest] = runOpportunities(client, TODAY).strategies;
    expect(best!.needsEmployer).toBe(false);
    expect(best!.costCad).toBeLessThanOrEqual(5000);
    expect(best!.best).toBe(true);
    const employerPlans = rest.filter((s) => s.needsEmployer);
    expect(employerPlans.length).toBeGreaterThan(0);
    for (const s of employerPlans) expect(s.barriers.join(" ")).toMatch(/employeur/i);
  });

  it("keeps PSTQ volet 1 open for accountants (only the CPA title is regulated) and offers volet 3 too", () => {
    const profile = base({}, { profession: "Comptable", french: "Avancé", experience: 5 });
    expect(statusOf(profile, "pstq-v1")).toBe("ready");
    expect(statusOf(profile, "pstq-v3")).toBe("lever");
    expect(runOpportunities(profile, TODAY).arrima.volet).toBe(1);
  });

  it("targets the immediately open PSTQ volet in the Arrima strategy", () => {
    const profile = base({}, { profession: "Comptable", french: "Avancé", experience: 5 });
    const plan = runOpportunities(profile, TODAY).strategies.find((s) => s.id === "arrima-direct")!;
    expect(plan.steps[0]!.programId).toBe("pstq-v1");
  });

  it("presents designated-employer pilots as alternatives, not a sequence", () => {
    const profile = base({}, { profession: "Analyste financier", french: "Avancé" });
    const plan = runOpportunities(profile, TODAY).strategies.find((s) => s.id === "community")!;
    expect(plan.mode).toBe("options");
    expect(runOpportunities(profile, TODAY).strategies.find((s) => s.id === "francophone-bridge")!.mode).toBe("sequence");
  });

  it("ranks the visitor visa below permanent pathways when the goal is permanent residence", () => {
    const profile = base({ objective: "Résidence permanente" }, { profession: "Analyste financier", french: "Avancé" });
    const matches = runOpportunities(profile, TODAY).matches;
    const visitorRank = matches.findIndex((m) => m.program.id === "visitor");
    const openPermanent = matches.filter(
      (m) => m.program.family === "permanent" && (m.status === "ready" || m.status === "lever"),
    );
    for (const m of openPermanent) expect(matches.indexOf(m), m.program.id).toBeLessThan(visitorRank);
  });

  it("uses the spouse's own job code when the spouse is the principal applicant", () => {
    const profile = base({ principalMode: "spouse", workNocCode: "" });
    profile.spouse = { ...profile.spouse, profession: "Autre", workNocCode: "63200", french: "Avancé", experience: 4 };
    expect(statusOf(profile, "pstq-v2")).toBe("bridge");
    expect(statusOf(profile, "pstq-v1")).toBe("blocked");
  });

  it("counts permanent residence fees once per strategy", () => {
    const client = base({ family: "Seul(e)" }, { profession: "Analyste financier", french: "Intermédiaire" });
    const report = runOpportunities(client, TODAY);
    const plan = report.strategies.find((s) => s.id === "francophone-bridge")!;
    const cost = (id: string) => report.matches.find((m) => m.program.id === id)!.estimatedCost;
    expect(plan.costCad).toBe(cost("mobilite-francophone") + Math.max(cost("ee-cec"), cost("fcip")));
  });

  it("flags settlement funds to prove as a barrier when the budget is too low", () => {
    const client = base({ family: "Seul(e)", budget: 5000 }, { profession: "Analyste financier", french: "Avancé", education: "Maîtrise / Master" });
    const plan = runOpportunities(client, TODAY).strategies.find((s) => s.id === "ee-french")!;
    expect(plan.fundsToShowCad).toBeGreaterThan(5000);
    expect(plan.barriers.join(" ")).toMatch(/fonds/i);
  });

  it("still presents employer-based plans, without penalty, when the client already has an offer", () => {
    const client = base({ budget: 5000, workHasOffer: true, offerProvince: "Ontario", province: "Ontario" }, { profession: "Analyste financier", french: "Avancé" });
    const plan = runOpportunities(client, TODAY).strategies.find((s) => s.id === "francophone-bridge")!;
    expect(plan.needsEmployer).toBe(true);
    expect(plan.barriers.join(" ")).not.toMatch(/employeur/i);
  });

  it("applies the official 67-point FSW grid (40 y.o., secondary education → not eligible)", () => {
    const p = base({ family: "Couple", principalMode: "spouse" });
    p.spouse = { ...p.spouse, age: 40, experience: 8, profession: "Chauffeur", education: "Secondaire", french: "Intermédiaire", english: "Avancé" };
    p.applicant = { ...p.applicant, french: "Avancé" };
    const fsw = runOpportunities(p, TODAY).matches.find((m) => m.program.id === "ee-fsw")!;
    expect(fsw.status).not.toBe("ready");
    expect(fsw.gaps.join(" ")).toMatch(/67/);
  });

  it("keeps FSW open for a strong profile that reaches 67 points", () => {
    const p = base({ budget: 50000 }, { age: 30, experience: 5, education: "Maîtrise / Master", english: "Bilingue", french: "Avancé", profession: "Analyste financier" });
    expect(statusOf(p, "ee-fsw")).toBe("ready");
  });
});

describe("PNP for intermediate occupations", () => {
  it("warns that FEER 4-5 provincial streams usually need a job offer", () => {
    const p = base({ province: "Ontario" }, { profession: "Représentant(e) commercial" });
    const pnp = runOpportunities(p, TODAY).matches.find((m) => m.program.id === "pnp")!;
    expect(pnp.gaps.join(" ")).toMatch(/FEER 4-5/);
  });

  it("marks that PNP case as needing an employer", () => {
    const p = base({ province: "Ontario" }, { profession: "Représentant(e) commercial" });
    expect(runOpportunities(p, TODAY).matches.find((m) => m.program.id === "pnp")!.needsEmployer).toBe(true);
    const skilledProfile = base({ province: "Ontario" }, { profession: "Analyste financier" });
    expect(runOpportunities(skilledProfile, TODAY).matches.find((m) => m.program.id === "pnp")!.needsEmployer).toBe(false);
  });
});

describe("official Québec regulated professions list", () => {
  it("sends fully regulated professions (nurse) to volet 3 only", () => {
    const p = base({}, { profession: "Infirmier(ère)", sector: "Santé", french: "Avancé" });
    expect(statusOf(p, "pstq-v1")).toBe("blocked");
    expect(statusOf(p, "pstq-v3")).not.toBe("blocked");
  });

  it("keeps volet 1 open and offers volet 3 for partially regulated professions (accountant)", () => {
    const p = base({}, { profession: "Comptable", french: "Avancé", experience: 5 });
    expect(statusOf(p, "pstq-v1")).toBe("ready");
    expect(statusOf(p, "pstq-v3")).toBe("lever");
  });

  it("uses the full official Arrima score in the report", () => {
    const report = runOpportunities(base({ family: "Seul(e)" }, { age: 30, education: "Maîtrise / Master", experience: 5, french: "Avancé" }), TODAY);
    expect(report.arrima.min).toBe(176 + 120 + 70 + 110 + 25);
    expect(report.arrima.max).toBe(176 + 120 + 70 + 117 + 120);
  });
});

describe("fswPoints", () => {
  it("scores the official FSW selection factors", () => {
    // Anglais NCLC 7 (16) + français NCLC 5 (4) + secondaire (5) + 6 ans+ (15) + 40 ans (7) + conjoint NCLC 4+ (5)
    expect(
      fswPoints({
        member: { ...defaultProfile.spouse, age: 40, experience: 8, education: "Secondaire", french: "Intermédiaire", english: "Avancé" },
        spouse: { ...defaultProfile.applicant, french: "Avancé" },
        profile: base({ family: "Couple" }),
      }).total,
    ).toBe(52);
  });
});
