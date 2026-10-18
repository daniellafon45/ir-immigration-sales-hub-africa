import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const here = dirname(fileURLToPath(import.meta.url));
const panel = readFileSync(join(here, "pistes-panel.tsx"), "utf8");
const profile = readFileSync(join(here, "profile.tsx"), "utf8");

describe("PistesPanel", () => {
  it("is shown on the client profile", () => {
    expect(profile).toContain("<PistesPanel />");
  });

  it("pushes to book an appointment and never gives legal detail", () => {
    expect(panel).toMatch(/goToSectionId\("rdv"\)/);
    expect(panel).toContain("Prendre RDV pour confirmer l’éligibilité");
    expect(panel).toContain("PISTES_DISCLAIMER");
    expect(panel).not.toMatch(/chance\.level|crsCheck|arrima|penalties|gaps/);
  });

  it("keeps its natural height in the page column", () => {
    expect(panel).toMatch(/<Surface className="[^"]*!flex-none/);
  });

  it("asks the 5 questions the pathways depend on, for each adult, and saves them in the profile", () => {
    expect(panel).toContain("Le profil en 5 questions");
    for (const label of ["Français", "Anglais", "Expérience (ans)", "Diplôme", "Budget (tranche)", "Montant exact ($)"]) {
      expect(panel).toContain(`label="${label}"`);
    }
    expect(panel).toMatch(/patchApplicant/);
    expect(panel).toMatch(/patchSpouse/);
  });
});
