import { describe, expect, it } from "vitest";
import { defaultProfile, emptyAdult } from "@/data/profile";
import { failurePress, failureRisks } from "@/data/failures";
import { highlightedFailureIds } from "@/lib/failure-press";

describe("failureRisks", () => {
  it("lists ten prospect-facing risks", () => {
    expect(failureRisks.map((risk) => risk.id)).toEqual([
      "program",
      "rush",
      "money",
      "employability",
      "housing",
      "job-myth",
      "counsel",
      "urgent",
      "status-myth",
      "language",
    ]);
    expect(failureRisks.find((risk) => risk.id === "housing")?.label).toBe("Arriver sans logement préparé");
    expect(failureRisks.find((risk) => risk.id === "job-myth")?.cost).toBe("Personne n’embauche sur un souhait.");
    expect(failureRisks.find((risk) => risk.id === "status-myth")?.cost).toBe(
      "Un permis temporaire n’ouvre pas automatiquement la RP.",
    );
    expect(failureRisks.find((risk) => risk.id === "language")?.label).toBe(
      "Négliger les exigences linguistiques",
    );
    expect(failureRisks.every((risk) => Boolean(risk.image))).toBe(true);
  });
});

describe("failurePress", () => {
  it("lists six sourced articles across housing, jobs and distress", () => {
    expect(failurePress).toHaveLength(6);
    expect(failurePress.filter((article) => article.theme === "housing")).toHaveLength(2);
    expect(failurePress.filter((article) => article.theme === "jobs")).toHaveLength(2);
    expect(failurePress.filter((article) => article.theme === "distress")).toHaveLength(2);
    expect(failurePress.every((article) => article.url.startsWith("https://"))).toBe(true);
    expect(failurePress.every((article) => Boolean(article.image))).toBe(true);
  });
});

describe("highlightedFailureIds", () => {
  it("picks up to three household risks", () => {
    expect(highlightedFailureIds(defaultProfile)).toEqual(["housing", "job-myth", "money"]);
    expect(
      highlightedFailureIds({
        ...defaultProfile,
        family: "Seul(e)",
        spouse: emptyAdult,
        objective: "Travail",
      }),
    ).toEqual(["housing", "job-myth", "employability"]);
    expect(
      highlightedFailureIds({
        ...defaultProfile,
        family: "Seul(e)",
        spouse: emptyAdult,
        objective: "Études",
      }),
    ).toEqual(["housing", "job-myth", "program"]);
    expect(
      highlightedFailureIds({
        ...defaultProfile,
        family: "Seul(e)",
        spouse: emptyAdult,
        objective: "Visite",
      }),
    ).toEqual(["housing", "job-myth", "counsel"]);
    expect(
      highlightedFailureIds({
        ...defaultProfile,
        family: "Couple + enfant(s)",
        children: [{ id: "c1", firstName: "Léa", age: 6 }],
        objective: "Travail",
      }),
    ).toEqual(["housing", "job-myth", "money"]);
  });

  it("keeps money highlighted for solo business and family sponsorship files", () => {
    expect(
      highlightedFailureIds({
        ...defaultProfile,
        family: "Seul(e)",
        spouse: emptyAdult,
        objective: "Affaires",
      }),
    ).toEqual(["housing", "job-myth", "money"]);

    expect(
      highlightedFailureIds({
        ...defaultProfile,
        family: "Seul(e)",
        spouse: emptyAdult,
        objective: "Regroupement familial",
      }),
    ).toEqual(["housing", "job-myth", "money"]);
  });
});
