import { describe, expect, it } from "vitest";
import {
  irccFamilySize,
  irccFundsChip,
  irccFundsFor,
  irccFundsMeta,
  settlementFundsFor,
  studyLivingIrccFor,
  studySubsistenceFor,
} from "@/data/ircc-funds";
import { routes } from "@/data/routes";
import { defaultProfile, emptyAdult } from "@/data/profile";
import { studyFundsCaq, subsistenceFunds } from "@/data/study-funds";
import { familyCost } from "@/lib/family-cost";
import { money } from "@/lib/format";
import { studyCost } from "@/lib/study-cost";
import { visitCost } from "@/lib/visit-cost";
import { workCost } from "@/lib/work-cost";

const solo = { ...defaultProfile, family: "Seul(e)", spouse: emptyAdult } as const;
const coupleChild = {
  ...defaultProfile,
  family: "Couple + enfant(s)",
  children: [{ id: "child-1", firstName: "Léa", age: 6 }],
} as const;
const polygamous = {
  ...defaultProfile,
  family: "Polygame",
  extraSpouses: [{ ...emptyAdult, id: "extra-1" }],
} as const;

describe("irccFunds", () => {
  it("covers every route and sizes the household without extra spouses", () => {
    expect(irccFundsMeta.updatedLabel).toBe("septembre 2026");
    expect(routes.map((route) => irccFundsFor(route.id, defaultProfile).routeId)).toEqual(routes.map((route) => route.id));
    expect(irccFamilySize(solo)).toBe(1);
    expect(irccFamilySize(defaultProfile)).toBe(2);
    expect(irccFamilySize(coupleChild)).toBe(3);
    expect(irccFamilySize(polygamous)).toBe(2);
    expect(irccFundsFor("missing", defaultProfile).headline).toBe("Variable");
  });

  it("uses the July 2025 settlement grid for EE, PNP and business", () => {
    expect(settlementFundsFor(1)).toBe(15263);
    expect(settlementFundsFor(2)).toBe(19001);
    expect(settlementFundsFor(3)).toBe(23360);
    expect(settlementFundsFor(8)).toBe(40392 + 4112);
    expect(irccFundsFor("ee", defaultProfile).amount).toBe(19001);
    expect(irccFundsFor("ee", solo).amount).toBe(15263);
    expect(irccFundsFor("ee", coupleChild).amount).toBe(23360);
    expect(irccFundsFor("ee", polygamous).amount).toBe(19001);
    expect(irccFundsFor("pnp", defaultProfile).amount).toBe(19001);
    expect(irccFundsFor("business", defaultProfile).amount).toBe(19001);
    expect(irccFundsFor("ee", defaultProfile).tracks?.some((track) => track.value === "Non exigé")).toBe(true);
  });

  it("adds tuition to IRCC living funds outside Quebec and keeps CAQ in Quebec", () => {
    expect(studyLivingIrccFor(3)).toBe(35888);
    const ontario = { ...coupleChild, objective: "Études", province: "Ontario" };
    expect(studySubsistenceFor(ontario)).toBe(35888);
    expect(studySubsistenceFor(defaultProfile)).toBe(subsistenceFunds(studyFundsCaq, true, 0));
    const quebecStudy = irccFundsFor("study", { ...defaultProfile, objective: "Études" });
    const ontarioStudy = irccFundsFor("study", ontario);
    expect(quebecStudy.amount).toBe(studyCost({ ...defaultProfile, objective: "Études" }).proofOfFunds);
    expect(ontarioStudy.amount).toBe(studyCost(ontario).proofOfFunds);
    expect(ontarioStudy.tracks?.find((track) => track.label.includes("Subsistance"))?.value).toBe(money(35888));
  });

  it("keeps family as sponsor income, estimates work and visit, and skips asylum", () => {
    const family = irccFundsFor("family", { ...defaultProfile, familyLink: "spouse" });
    expect(family.amount).toBe(familyCost({ ...defaultProfile, familyLink: "spouse" }).incomeRequired);
    expect(family.scope).toMatch(/Revenu minimum/);
    const work = irccFundsFor("work", defaultProfile);
    expect(work.headline).toBe("Selon le dossier");
    expect(work.official).toBe(false);
    expect(work.amount).toBe(workCost(defaultProfile).settlementFunds);
    expect(irccFundsChip(work)).toBe(money(work.amount ?? 0));
    const visit = irccFundsFor("visit", defaultProfile);
    expect(visit.headline).toBe("Selon le dossier");
    expect(visit.amount).toBe(visitCost(defaultProfile).fundsRequired);
    const asylum = irccFundsFor("asylum", defaultProfile);
    expect(asylum.headline).toBe("Non exigé");
    expect(asylum.amount).toBeNull();
    expect(asylum.required).toBe(false);
  });
});
