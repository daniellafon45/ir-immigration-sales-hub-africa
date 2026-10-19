import { describe, expect, it } from "vitest";
import sample from "@/data/fixtures/ee-rounds-sample.json";
import { latestCutoffs, parseEeRounds } from "@/data/ee-rounds";
import { defaultProfile, type Profile } from "@/lib/engine-profile";
import { findBestPrograms } from "@/lib/best-programs";
import { fswPoints } from "@/lib/opportunity-engine";
import { computeCrsScore } from "@/lib/crs-score";

const TODAY = "2026-10-18";
const cutoffs = latestCutoffs(parseEeRounds(sample));

/** Profil réel signalé : parent seul, enseignante, FR avancé, EN débutant, Ontario, RP. */
function aminataTeacher(): Profile {
  const p = structuredClone(defaultProfile);
  return {
    ...p,
    family: "Parent seul + enfant(s)",
    objective: "Résidence permanente",
    province: "Ontario",
    studyProvince: "Ontario",
    budget: 10000,
    applicant: {
      ...p.applicant,
      firstName: "Aminata",
      age: 34,
      profession: "Enseignant(e)",
      sector: "Éducation",
      french: "Avancé",
      english: "Débutant",
      education: "Baccalauréat / Licence",
      experience: 5,
      salary: "Moyenne",
    },
    children: [
      { id: "c1", firstName: "", age: 6 },
      { id: "c2", firstName: "", age: 6 },
    ],
  };
}

describe("Aminata enseignante — Entrée express doit apparaître", () => {
  it("is close to the FSW pass mark (not far from the grid)", () => {
    const p = aminataTeacher();
    const fsw = fswPoints({ member: p.applicant, spouse: null, profile: p });
    expect(fsw.total).toBeGreaterThanOrEqual(57);
    expect(fsw.total).toBeLessThan(67);
  });

  it("keeps ee-french open as ready or lever (not blocked)", () => {
    const result = findBestPrograms(aminataTeacher(), { cutoffs, today: TODAY });
    const french = result.all.find((t) => t.program.id === "ee-french");
    expect(french).toBeTruthy();
    expect(["ready", "lever"]).toContain(french!.status);
  });

  it("surfaces an Express Entry program in the top recommendations", () => {
    const result = findBestPrograms(aminataTeacher(), { cutoffs, today: TODAY });
    const eeInTop = result.top.some((t) => t.program.id.startsWith("ee-"));
    expect(eeInTop).toBe(true);
  });

  it("ranks French Express Entry above employer-only pilots for a skilled francophone", () => {
    const result = findBestPrograms(aminataTeacher(), { cutoffs, today: TODAY });
    const ids = result.top.map((t) => t.program.id);
    expect(ids).toContain("ee-french");
    const eeIdx = ids.indexOf("ee-french");
    const employerPilot = ids.findIndex((id) => id === "fcip" || id === "rcip" || id === "aip");
    if (employerPilot >= 0) expect(eeIdx).toBeLessThan(employerPilot);
    // Sans offre, la voie francophone EE doit être dans le trio de tête.
    expect(eeIdx).toBeLessThan(3);
  });

  it("compares CRS to the French-category cut-off when French is NCLC 7", () => {
    const p = aminataTeacher();
    const crs = computeCrsScore(p).total;
    const result = findBestPrograms(p, { cutoffs, today: TODAY });
    const french = result.all.find((t) => t.program.id === "ee-french");
    expect(french?.crsCheck?.cutoff).toBeDefined();
    expect(typeof crs).toBe("number");
    expect(crs).toBeGreaterThan(250);
    expect(crs).toBeLessThan(520);
  });
});
