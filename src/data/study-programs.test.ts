import { describe, expect, it } from "vitest";
import { professions } from "@/data/profile";
import {
  searchStudyPrograms,
  studyDomains,
  studyLevels,
  studyPrograms,
  studyProgramById,
} from "@/data/study-programs";

describe("study program catalog", () => {
  it("covers every faculty domain with more than 100 named programs", () => {
    expect(studyPrograms.length).toBeGreaterThanOrEqual(100);
    expect(studyPrograms.length).toBeLessThanOrEqual(150);
    const ids = studyPrograms.map((program) => program.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const domain of studyDomains) {
      expect(
        studyPrograms.some((program) => program.domain === domain),
        domain,
      ).toBe(true);
    }
    for (const level of studyLevels) {
      expect(studyPrograms.some((program) => program.level === level)).toBe(true);
    }
  });

  it("keeps known closer programs and maps each entry to a profile profession", () => {
    expect(studyProgramById("bac-info")?.name).toMatch(/informatique/i);
    expect(studyProgramById("bac-nursing")?.profession).toBe("Infirmier(ère)");
    const allowed = new Set(professions);
    for (const program of studyPrograms) {
      expect(allowed.has(program.profession as (typeof professions)[number]), program.id).toBe(true);
    }
  });

  it("filters the catalog by program name, domain or level", () => {
    const nursing = searchStudyPrograms("infirm");
    expect(nursing.some((program) => program.id === "bac-nursing")).toBe(true);
    const law = searchStudyPrograms("droit");
    expect(law.some((program) => program.domain === "Droit, justice, administration publique")).toBe(true);
    expect(searchStudyPrograms("xyz-inconnu")).toEqual([]);
  });
});
