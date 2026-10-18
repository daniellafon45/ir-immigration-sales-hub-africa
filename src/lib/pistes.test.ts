import { describe, expect, it } from "vitest";
import sample from "@/data/fixtures/ee-rounds-sample.json";
import { latestCutoffs, parseEeRounds } from "@/data/ee-rounds";
import { defaultProfile, type AdultMember, type Profile } from "@/data/profile";
import { buildPistes, PISTES_DISCLAIMER } from "@/lib/pistes";

const rounds = parseEeRounds(sample);
const opts = { cutoffs: latestCutoffs(rounds), rounds, today: "2026-10-18" };

function client(applicant: Partial<AdultMember> = {}, extra: Partial<Profile> = {}): Profile {
  const p = structuredClone(defaultProfile);
  return { ...p, family: "Couple", ...extra, applicant: { ...p.applicant, ...applicant } };
}

describe("buildPistes", () => {
  it("shows up to three possible pathways with a positive label", () => {
    const view = buildPistes(client(), opts);
    expect(view.pistes.length).toBeGreaterThan(0);
    expect(view.pistes.length).toBeLessThanOrEqual(3);
    for (const p of view.pistes) expect(["Piste solide", "Piste à préparer"]).toContain(p.label);
  });

  it("counts every open pathway, not only the three shown", () => {
    const view = buildPistes(client(), opts);
    expect(view.count).toBeGreaterThanOrEqual(view.pistes.length);
  });

  it("never shows negative or technical wording to the prospect", () => {
    const text = JSON.stringify(buildPistes(client({ age: 44, education: "Secondaire" }), opts));
    expect(text).not.toMatch(/faible|non admissible|refus|CRS|Arrima \\d/i);
  });

  it("gives an indicative delay or invites to clarify it at the appointment", () => {
    for (const p of buildPistes(client(), opts).pistes) {
      expect(p.delay).toMatch(/mois|rendez-vous/);
    }
  });

  it("still encourages an appointment for a weak profile", () => {
    const weak = client({ french: "Débutant", english: "Débutant", experience: 0, profession: "Autre", salary: "Faible" });
    const view = buildPistes(weak, opts);
    expect(view.headline).toMatch(/rendez-vous|conseiller/i);
  });

  it("states that nothing is guaranteed and that eligibility is confirmed at the appointment", () => {
    expect(PISTES_DISCLAIMER).toMatch(/Aucune garantie/);
    expect(PISTES_DISCLAIMER).toMatch(/rendez-vous/);
  });
});
