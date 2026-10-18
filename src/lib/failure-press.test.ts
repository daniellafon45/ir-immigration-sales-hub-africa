import { describe, expect, it } from "vitest";
import { defaultProfile, emptyAdult } from "@/data/profile";
import { failurePress, failureRisks } from "@/data/failures";
import { highlightedFailureIds, selectPressArticles, stalePressArticles } from "@/lib/failure-press";

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
  it("only keeps sourced articles from the last 12 months, tagged by situation", () => {
    expect(failurePress.length).toBeGreaterThanOrEqual(9);
    for (const article of failurePress) {
      expect(article.url.startsWith("https://")).toBe(true);
      expect(article.publishedOn >= "2025-10-18").toBe(true);
      expect(article.tags.length).toBeGreaterThan(0);
      expect(Boolean(article.image)).toBe(true);
    }
    for (const theme of ["housing", "jobs", "distress"] as const) {
      expect(failurePress.filter((a) => a.theme === theme).length).toBeGreaterThanOrEqual(2);
    }
  });
});

describe("selectPressArticles", () => {
  const TODAY = "2026-10-18";
  const pick = (profile: Parameters<typeof selectPressArticles>[0]) => selectPressArticles(profile, { today: TODAY });

  it("returns two articles per theme", () => {
    const picked = pick(defaultProfile);
    for (const theme of ["housing", "jobs", "distress"] as const) {
      expect(picked.filter((a) => a.theme === theme)).toHaveLength(2);
    }
  });

  it("shows student articles to a student", () => {
    const picked = pick({ ...defaultProfile, objective: "Études" });
    expect(picked.some((a) => a.tags.includes("student"))).toBe(true);
  });

  it("shows the PSTQ end-of-permit article to a temporary worker already in Québec", () => {
    const picked = pick({ ...defaultProfile, objective: "Travail", province: "Québec" });
    expect(picked.some((a) => a.url.includes("lapresse.ca/actualites/2026-05-13"))).toBe(true);
  });

  it("shows francophone-minority news to a French speaker settling outside Québec", () => {
    const picked = pick({ ...defaultProfile, province: "Ontario", applicant: { ...defaultProfile.applicant, french: "Bilingue" } });
    expect(picked.some((a) => a.tags.includes("francophone-outside-qc"))).toBe(true);
  });

  it("explains why each article was chosen", () => {
    for (const a of pick({ ...defaultProfile, objective: "Études" })) expect(a.reason.length).toBeGreaterThan(0);
  });
});

describe("stalePressArticles", () => {
  it("flags articles older than 12 months for replacement", () => {
    expect(stalePressArticles("2026-10-18")).toEqual([]);
    expect(stalePressArticles("2028-01-01").length).toBe(failurePress.length);
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
