import { describe, expect, it } from "vitest";
import sample from "@/data/fixtures/ee-rounds-sample.json";
import { latestCutoffs, parseEeRounds } from "@/data/ee-rounds";
import { defaultProfile, type AdultMember, type Profile } from "@/lib/engine-profile";
import { cardWarnings, findBestPrograms, findLevers } from "@/lib/best-programs";

const TODAY = "2026-10-18";
const cutoffs = latestCutoffs(parseEeRounds(sample));

function couple(applicant: Partial<AdultMember> = {}, spouse: Partial<AdultMember> = {}, extra: Partial<Profile> = {}): Profile {
  const p = structuredClone(defaultProfile);
  return {
    ...p,
    family: "Couple",
    ...extra,
    applicant: { ...p.applicant, ...applicant },
    spouse: { ...p.spouse, ...spouse },
  };
}

const run = (p: Profile) => findBestPrograms(p, { cutoffs, today: TODAY });

describe("findBestPrograms", () => {
  it("ignores ticked choices: objective, permit type, study program and chosen province", () => {
    const base = couple();
    const ticked = couple({}, {}, { objective: "Visite", workPermitKind: "lmia", studyLevel: "master", province: "Alberta", visitPurpose: "tourism" });
    const ids = (p: Profile) => run(p).top.map((t) => `${t.program.id}:${t.province}:${t.filer}`);
    expect(ids(ticked)).toEqual(ids(base));
  });

  it("assigns the French-speaking spouse to PSTQ and the English-speaking IT spouse to Express Entry", () => {
    const p = couple(
      { firstName: "Aminata", age: 44, profession: "Analyste financier", french: "Bilingue", english: "Débutant", experience: 5 },
      { firstName: "Mamadou", profession: "Développeur logiciel", sector: "Technologies de l’information", french: "Débutant", english: "Bilingue", experience: 8 },
    );
    const all = run(p).all;
    expect(all.find((t) => t.program.id === "pstq-v1")?.filerName).toBe("Aminata");
    expect(all.find((t) => t.program.id === "ee-fsw")?.filerName).toBe("Mamadou");
  });

  it("suggests the province of an existing job offer", () => {
    const p = couple({ profession: "Analyste financier", french: "Avancé" }, {}, { workHasOffer: true, offerProvince: "Ontario" });
    expect(run(p).all.find((t) => t.program.id === "pnp")?.province).toBe("Ontario");
  });

  it("derives the budget from both adults' financial capacity", () => {
    const p = couple({ salary: "Moyenne" }, { salary: "Bonne" }, { budget: 999999 });
    expect(run(p).budgetUsed).toBe(28000 + 48000);
  });

  it("ranks plans needing an employer below comparable plans that do not", () => {
    const p = couple({ profession: "Analyste financier", french: "Avancé", salary: "Faible" }, { salary: "Faible" });
    const top = run(p).top;
    const firstEmployer = top.findIndex((t) => t.program.needsEmployer);
    const firstFree = top.findIndex((t) => !t.program.needsEmployer);
    expect(firstFree).toBe(0);
    if (firstEmployer >= 0) expect(firstEmployer).toBeGreaterThan(firstFree);
  });

  it("compares the CRS to the latest real IRCC cut-off of the category", () => {
    const p = couple({ profession: "Analyste financier", french: "Bilingue", age: 29, education: "Maîtrise / Master" });
    const ee = run(p).all.find((t) => t.program.id === "ee-french");
    expect(ee?.crsCheck?.cutoff).toBe(435);
    expect(ee?.crsCheck?.date).toBe("2026-10-16");
    expect(typeof ee?.crsCheck?.score).toBe("number");
  });

  it("never lists blocked or closed programs in the top", () => {
    const top = run(couple()).top;
    expect(top.length).toBeGreaterThan(0);
    for (const t of top) expect(["ready", "lever", "bridge"]).toContain(t.status);
  });

  it("returns a plan even for a weak profile", () => {
    const p = couple(
      { profession: "Autre", french: "Débutant", english: "Débutant", experience: 0, salary: "Faible" },
      { profession: "Autre", french: "Débutant", english: "Débutant", experience: 0, salary: "Faible" },
    );
    const result = run(p);
    expect(result.top.length + result.firstSteps.length).toBeGreaterThan(0);
    expect(result.missingInfo.join(" ")).toMatch(/CNP/);
  });

  it("suggests Québec when the best program is a Québec program", () => {
    const p = couple({ profession: "Analyste financier", french: "Bilingue", english: "Débutant" }, { french: "Bilingue", english: "Débutant" });
    const result = run(p);
    if (result.top[0]!.program.authority.startsWith("Québec")) expect(result.suggestedProvince).toBe("Québec");
    expect(result.suggestedProvince).toBe(result.top[0]!.province);
  });

  it("ignores cut-offs older than 12 months (no recent draw in that category)", () => {
    const stale = { general: { date: "2024-04-23", crs: 529, size: 2095, name: "No Program Specified" } };
    const p = couple({ profession: "Analyste financier", french: "Avancé" });
    const fsw = findBestPrograms(p, { cutoffs: stale, today: TODAY }).all.find((t) => t.program.id === "ee-fsw");
    expect(fsw?.crsCheck).toBeNull();
  });

  it("keeps exploration tools like the visitor visa out of the top programs", () => {
    for (const t of run(couple()).top) expect(["visitor", "super-visa"]).not.toContain(t.program.id);
  });

  it("only flags the province as flexible for federal programs outside Québec", () => {
    for (const t of run(couple()).all) {
      if (t.provinceFlexible) expect(t.province).not.toBe("Québec");
    }
  });

  it("does not put Express Entry first when the CRS is far below every recent draw", () => {
    const p = couple(
      { age: 40, experience: 5, profession: "Représentant(e) commercial", sector: "Commerce et vente", salary: "Faible", education: "Secondaire", french: "Avancé", english: "Intermédiaire" },
      { age: 40, experience: 8, profession: "Chauffeur", sector: "Transport et logistique", salary: "Faible", education: "Secondaire", french: "Intermédiaire", english: "Avancé" },
    );
    const result = run(p);
    expect(result.top[0]!.program.id.startsWith("ee-")).toBe(false);
    const trades = result.all.find((t) => t.program.id === "ee-trades")!;
    expect(trades.penalties.join(" ")).toMatch(/loin du dernier seuil/);
  });

  it("penalises an Express Entry program that has had no recent draw", () => {
    const p = couple({ profession: "Analyste financier", french: "Avancé", english: "Bilingue", age: 30, education: "Maîtrise / Master" });
    const fsw = findBestPrograms(p, { cutoffs: {}, today: TODAY }).all.find((t) => t.program.id === "ee-fsw")!;
    expect(fsw.penalties.join(" ")).toMatch(/aucun tirage récent/i);
  });

  it("compares the federal skilled trades program to the trades draws", () => {
    const p = couple({}, { age: 40, experience: 8, profession: "Chauffeur", education: "Secondaire", french: "Intermédiaire", english: "Avancé" });
    const fst = run(p).all.find((t) => t.program.id === "ee-fst")!;
    expect(fst.crsCheck?.drawName).toMatch(/Trade/);
  });

  it("penalises a PNP route that needs an employer for FEER 4-5 occupations", () => {
    const p = couple({ profession: "Représentant(e) commercial", french: "Avancé" }, { profession: "Représentant(e) commercial" });
    const pnp = run(p).all.find((t) => t.program.id === "pnp")!;
    expect(pnp.penalties.join(" ")).toMatch(/Employeur/);
  });

  it("rates PSTQ chances against the real published Arrima threshold", () => {
    const p = couple({ age: 30, education: "Maîtrise / Master", experience: 5, french: "Bilingue", profession: "Analyste financier" }, {}, { family: "Seul(e)" });
    const v1 = run(p).all.find((t) => t.program.id === "pstq-v1")!;
    expect(v1.arrima?.max).toBeGreaterThan(0);
    expect(v1.chance.level).toBe("faible");
    expect(v1.chance.reason).toMatch(/677/);
  });

  it("rates an Express Entry program above the latest cut-off as a high chance", () => {
    const p = couple({ profession: "Analyste financier", french: "Bilingue", age: 29, education: "Maîtrise / Master" });
    expect(run(p).all.find((t) => t.program.id === "ee-french")!.chance.level).toBe("élevée");
  });

  it("never rates an employer-dependent route as high without a job offer", () => {
    for (const t of run(couple({ french: "Avancé" })).all) {
      if (t.needsEmployer) expect(t.chance.level).not.toBe("élevée");
    }
  });

  it("ranks a high-chance program above a low-chance one", () => {
    const p = couple({ profession: "Analyste financier", french: "Bilingue", age: 29, education: "Maîtrise / Master" });
    const all = run(p).all;
    const idx = (id: string) => all.findIndex((t) => t.program.id === id);
    expect(idx("ee-french")).toBeLessThan(idx("pstq-v1"));
  });
});

describe("exact amounts", () => {
  it("uses each adult's exact amount for the CV budget", () => {
    const p = couple({ salary: "Bonne", fundsCad: 12000 }, { salary: "Moyenne", fundsCad: 5000 });
    expect(run(p).budgetUsed).toBe(17000);
  });
});

describe("chance ordering", () => {
  it("lists programs from the highest chance to the lowest", () => {
    const order = { élevée: 0, moyenne: 1, faible: 2 } as const;
    for (const p of [couple(), couple({ french: "Débutant", english: "Avancé" }), couple({ age: 44, education: "Secondaire" })]) {
      const levels = run(p).top.map((t) => order[t.chance.level]);
      expect([...levels].sort((a, b) => a - b)).toEqual(levels);
    }
  });
});

describe("timeline to permanent residence", () => {
  const rounds = parseEeRounds(sample);
  const runT = (p: Profile) => findBestPrograms(p, { cutoffs, rounds, today: TODAY });

  it("estimates a short total delay when the CRS is above the latest cut-off of a frequent category", () => {
    const p = couple({ profession: "Analyste financier", french: "Bilingue", age: 29, education: "Maîtrise / Master" });
    const ee = runT(p).all.find((t) => t.program.id === "ee-french")!;
    expect(ee.timeline.totalMonths).not.toBeNull();
    expect(ee.timeline.totalMonths![1]).toBeLessThanOrEqual(14);
    expect(["Rapide", "Moyen"]).toContain(ee.timeline.speed);
    expect(ee.timeline.detail).toMatch(/tirage/);
  });

  it("marks a route as uncertain when no invitation can be expected", () => {
    const p = couple({ age: 30, education: "Maîtrise / Master", experience: 5, french: "Bilingue", profession: "Analyste financier" }, {}, { family: "Seul(e)" });
    const v1 = runT(p).all.find((t) => t.program.id === "pstq-v1")!;
    expect(v1.timeline.speed).toBe("Incertain");
    expect(v1.timeline.totalMonths).toBeNull();
  });

  it("counts the preliminary step (permit + 12 months of work) for a bridge route like CEC from abroad", () => {
    const cec = runT(couple({ profession: "Analyste financier", french: "Avancé" })).all.find((t) => t.program.id === "ee-cec")!;
    expect(cec.status).toBe("bridge");
    expect(cec.timeline.totalMonths![0]).toBeGreaterThanOrEqual(12);
    expect(cec.timeline.detail).toMatch(/12 mois/);
  });

  it("puts the faster route first when two programs share the same chance level", () => {
    const order = { Rapide: 0, Moyen: 1, Long: 2, Incertain: 3 } as const;
    const top = runT(couple({ french: "Avancé" })).top;
    for (let i = 1; i < top.length; i += 1) {
      if (top[i - 1]!.chance.level === top[i]!.chance.level) {
        expect(order[top[i - 1]!.timeline.speed]).toBeLessThanOrEqual(order[top[i]!.timeline.speed]);
      }
    }
  });
});

describe("findLevers", () => {
  it("quantifies the gain of reaching NCLC 7 in French for an intermediate speaker", () => {
    const p = couple({ firstName: "Awa", profession: "Analyste financier", french: "Intermédiaire", english: "Débutant", age: 29, education: "Maîtrise / Master" });
    const levers = findLevers(p, { cutoffs, today: TODAY });
    const french = levers.find((l) => l.id === "french-applicant");
    expect(french).toBeTruthy();
    expect(french!.label).toMatch(/Awa/);
    expect(french!.newHighChance.length).toBeGreaterThan(0);
  });

  it("returns no lever that brings nothing", () => {
    const p = couple({ french: "Bilingue", english: "Bilingue" }, { french: "Bilingue", english: "Bilingue" });
    for (const l of findLevers(p, { cutoffs, today: TODAY })) {
      expect(l.newHighChance.length + Math.max(0, l.arrimaGain)).toBeGreaterThan(0);
    }
  });
});

describe("cardWarnings", () => {
  it("never repeats the chance reason or the CRS gap already shown by the badge", () => {
    for (const p of [couple(), couple({ age: 44 }), couple({ french: "Débutant" })]) {
      for (const item of run(p).all) {
        const warnings = cardWarnings(item);
        expect(warnings).not.toContain(item.chance.reason);
        expect(new Set(warnings).size).toBe(warnings.length);
        if (item.crsCheck) expect(warnings.some((w) => w.startsWith("CRS estimé"))).toBe(false);
      }
    }
  });
});

describe("Québec / Arrima option", () => {
  it("always surfaces the best open PSTQ stream, with its gap to the latest published threshold", () => {
    const result = run(couple());
    expect(result.quebec?.program.id).toMatch(/^pstq-/);
    expect(result.quebec!.gapToThreshold).toBeGreaterThan(0);
    expect(result.quebec!.threshold?.minScore).toBe(677);
  });

  it("quantifies the Arrima points each improvement would add", () => {
    const result = run(couple({ french: "Avancé" }, { french: "Intermédiaire" }));
    const levers = result.quebec!.levers;
    const offer = levers.find((l) => l.id === "qc-offer");
    expect(offer?.gain).toBe(50);
    const french = levers.find((l) => l.id === "qc-french-principal");
    expect(french?.gain).toBe(20); // niveau 7 → 9 : (40 − 35) × 4 compétences, avec conjoint
    const spouse = levers.find((l) => l.id === "qc-french-spouse");
    expect(spouse?.gain).toBe(8); // conjoint niveau 5 → 7 : (8 − 6) × 4
  });

  it("returns no Québec option when no PSTQ stream is open", () => {
    const p = couple({ french: "Débutant", english: "Bilingue" }, { french: "Débutant" });
    expect(run(p).quebec).toBeNull();
  });
});

describe("Québec option honesty", () => {
  it("says when even all Arrima levers cannot close the gap", () => {
    const q = run(couple({ salary: "Faible" }, { salary: "Faible", french: "Avancé" })).quebec!;
    expect(q.reachableWithLevers).toBe(false);
  });

  it("uses French elision before a vowel in lever labels", () => {
    const q = run(couple({ firstName: "Aminata", french: "Avancé" })).quebec!;
    expect(q.levers.find((l) => l.id === "qc-french-principal")?.label).toMatch(/d’Aminata/);
  });
});
