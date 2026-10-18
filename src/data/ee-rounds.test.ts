import { describe, expect, it } from "vitest";
import sample from "@/data/fixtures/ee-rounds-sample.json";
import { drawCadence, eeCategoryOf, eeRoundsSnapshot, latestCutoffs, parseEeRounds } from "@/data/ee-rounds";

describe("parseEeRounds", () => {
  it("parses the official IRCC JSON into typed rounds, newest first", () => {
    const rounds = parseEeRounds(sample);
    expect(rounds.length).toBeGreaterThan(10);
    const first = rounds[0]!;
    expect(first.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(typeof first.size).toBe("number");
    expect(typeof first.crs).toBe("number");
    for (let i = 1; i < rounds.length; i += 1) expect(rounds[i - 1]!.date >= rounds[i]!.date).toBe(true);
  });

  it("removes thousands separators from sizes", () => {
    const [round] = parseEeRounds({ rounds: [{ drawNumber: "1", drawDate: "2026-10-16", drawName: "Canadian Experience Class", drawSize: "5,000", drawCRS: "435" }] });
    expect(round!.size).toBe(5000);
  });

  it("skips malformed rows instead of producing wrong cut-offs", () => {
    const rounds = parseEeRounds({
      rounds: [
        { drawDate: "2026-10-16", drawName: "Canadian Experience Class", drawSize: "2,000", drawCRS: "519" },
        { drawDate: "pas une date", drawName: "Canadian Experience Class", drawSize: "x", drawCRS: "?" },
        null,
      ],
    });
    expect(rounds).toHaveLength(1);
  });

  it("returns an empty list for an unexpected payload", () => {
    expect(parseEeRounds(null)).toEqual([]);
    expect(parseEeRounds({ foo: 1 })).toEqual([]);
  });
});

describe("eeCategoryOf", () => {
  it("maps IRCC draw names to categories", () => {
    expect(eeCategoryOf("French-Language proficiency 2026-Version 2")).toBe("french");
    expect(eeCategoryOf("French language proficiency (Version 1)")).toBe("french");
    expect(eeCategoryOf("Canadian Experience Class")).toBe("cec");
    expect(eeCategoryOf("Provincial Nominee Program")).toBe("pnp");
    expect(eeCategoryOf("Trades Occupations, 2026-Version 3")).toBe("trades");
    expect(eeCategoryOf("Trade occupations (Version 2)")).toBe("trades");
    expect(eeCategoryOf("Healthcare and Social Services Occupations, 2026-Version 3")).toBe("health");
    expect(eeCategoryOf("Education occupations (Version 1)")).toBe("education");
    expect(eeCategoryOf("Transport Occupations, 2026-Version 2")).toBe("transport");
    expect(eeCategoryOf("No Program Specified")).toBe("general");
    expect(eeCategoryOf("Skilled Military Recruits, 2026-Version 1")).toBe("other");
  });
});

describe("latestCutoffs", () => {
  it("keeps the most recent round per category", () => {
    const cutoffs = latestCutoffs(parseEeRounds(sample));
    expect(cutoffs.french?.date).toBe("2026-10-16");
    expect(cutoffs.french?.crs).toBe(435);
    expect(cutoffs.cec?.crs).toBe(519);
  });
});

describe("eeRoundsSnapshot", () => {
  it("ships an embedded snapshot for offline fallback", () => {
    expect(eeRoundsSnapshot.rounds.length).toBeGreaterThan(10);
    expect(eeRoundsSnapshot.fetchedOn).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });
});

describe("drawCadence", () => {
  it("measures how often a category is drawn from real IRCC rounds", () => {
    const cadence = drawCadence(parseEeRounds(sample), "french", "2026-10-18");
    expect(cadence.count).toBeGreaterThanOrEqual(2);
    expect(cadence.avgGapDays).toBeGreaterThan(0);
    expect(cadence.lastDate).toBe("2026-10-16");
  });

  it("returns no cadence for a category without recent draws", () => {
    const cadence = drawCadence(parseEeRounds(sample), "stem", "2026-10-18");
    expect(cadence.count).toBe(0);
    expect(cadence.avgGapDays).toBeNull();
  });
});
