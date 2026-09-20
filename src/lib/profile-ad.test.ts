import { describe, expect, it } from "vitest";
import { professionPhotosFor } from "@/data/profession-photos";
import { defaultProfile, emptyAdult } from "@/data/profile";
import { money } from "@/lib/format";
import { profileAdFor } from "@/lib/profile-ad";

const alberta = {
  profession: "Comptable",
  province: "Alberta",
  score: 86,
  median: 66000,
};

describe("profileAdFor", () => {
  it("personalizes a Comptable Alberta permanent-residence ad", () => {
    const ad = profileAdFor({ profile: defaultProfile, ...alberta });
    expect(ad.headline).toBe("Comptable en Alberta : c’est là que votre profil pèse le plus.");
    expect(ad.body).toBe(
      `Médian ${money(66000)}. Ce n’est pas une embauche promise. C’est le marché le plus aligné à ce dossier.`,
    );
    expect(ad.prompt).toBe("Ensuite, on voit les postes qui correspondent.");
    expect(ad.image).toBe(professionPhotosFor("Comptable")[0]?.src);
    expect(ad.alt).toBe("Comptable en Alberta · 86/100");
  });

  it("ties a study file to the diploma and the target occupation", () => {
    const ad = profileAdFor({
      profile: { ...defaultProfile, objective: "Études" },
      ...alberta,
    });
    expect(ad.headline).toContain("diplôme");
    expect(ad.body).toContain("après les études");
    expect(ad.prompt).toContain("métier visé");
  });

  it("refuses a right to work on a visit file", () => {
    const ad = profileAdFor({
      profile: { ...defaultProfile, objective: "Visite" },
      ...alberta,
    });
    expect(ad.headline).toContain("n’ouvre pas ce droit");
    expect(ad.body).toContain("pas un droit de travailler");
    expect(ad.prompt).toContain("pas un emploi");
  });

  it("keeps reunification ahead of the market on a family file", () => {
    const ad = profileAdFor({
      profile: { ...defaultProfile, objective: "Regroupement familial" },
      ...alberta,
    });
    expect(ad.headline).toContain("réunification");
    expect(ad.body).toContain("pas un argument de parrainage");
    expect(ad.prompt).toContain("après l’arrivée");
  });

  it("falls back to the Autre photo when the profession has no set", () => {
    const ad = profileAdFor({
      profile: {
        ...defaultProfile,
        family: "Seul(e)",
        spouse: emptyAdult,
        applicant: { ...defaultProfile.applicant, profession: "Astronaute" },
      },
      profession: "Astronaute",
      province: "Alberta",
      score: 86,
      median: 66000,
    });
    expect(ad.image).toBe(professionPhotosFor("Autre")[0]?.src);
    expect(ad.headline).toContain("Astronaute en Alberta");
  });

  it("does not sell a work right to a business visitor", () => {
    const ad = profileAdFor({
      profile: { ...defaultProfile, objective: "Affaires", businessPath: "visitor" },
      ...alberta,
    });
    expect(ad.headline).toContain("n’a pas un droit de travailler");
    expect(ad.body).toContain("pas un salaire promis");
  });
});
