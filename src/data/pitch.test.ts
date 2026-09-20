import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { sections } from "@/catalog";
import { africaPitchSlides } from "@/data/pitch-africa";
import {
  personHeroImage,
  pitchDaysImage,
  pitchFormCards,
  pitchFormImage,
  pitchFormPeople,
  pitchHeroImage,
  pitchHeroLook,
  pitchHeroLooks,
  pitchHeroPeople,
  pitchHeroScene,
  pitchHeroSources,
  pitchWelcomeTitle,
} from "@/data/pitch";
import { defaultApplicant, defaultProfile, defaultSpouse, objectives } from "@/data/profile";
import { describe, expect, it } from "vitest";

const jpegMagic = Buffer.from([0xff, 0xd8, 0xff]);
const heroDir = join(dirname(fileURLToPath(import.meta.url)), "../assets/pitch");
const africaDir = join(dirname(fileURLToPath(import.meta.url)), "../assets/pitch-africa");
const heroLooks = ["noir", "blanc"] as const;
const allLooks = ["noir", "blanc", "maghrebin", "asiatique", "latino"] as const;
const extraHeroFiles = [
  "hero-couple-hf-maghrebin.jpg",
  "hero-couple-hf-asiatique.jpg",
  "hero-couple-hf-latino.jpg",
  "hero-couple-hh-maghrebin.jpg",
  "hero-couple-hh-asiatique.jpg",
  "hero-couple-hh-latino.jpg",
  "hero-couple-ff-maghrebin.jpg",
  "hero-couple-ff-asiatique.jpg",
  "hero-couple-ff-latino.jpg",
  "hero-family-hf-maghrebin.jpg",
  "hero-family-hf-asiatique.jpg",
  "hero-family-hf-latino.jpg",
  "hero-family-hh-maghrebin.jpg",
  "hero-family-hh-asiatique.jpg",
  "hero-family-hh-latino.jpg",
  "hero-family-ff-maghrebin.jpg",
  "hero-family-ff-asiatique.jpg",
  "hero-family-ff-latino.jpg",
  "hero-single-femme-asiatique.jpg",
  "hero-single-femme-latino.jpg",
  "hero-single-homme-asiatique.jpg",
  "hero-single-homme-latino.jpg",
  ...allLooks.flatMap((femme) =>
    allLooks
      .filter((homme) => homme !== femme)
      .flatMap((homme) => [`hero-couple-hf-${femme}-${homme}.jpg`, `hero-family-hf-${femme}-${homme}.jpg`]),
  ),
  ...allLooks.flatMap((lookA, index) =>
    allLooks.slice(index + 1).flatMap((lookB) =>
      ["couple", "family"].flatMap((scene) =>
        ["hh", "ff"].map((people) => `hero-${scene}-${people}-${lookA}-${lookB}.jpg`),
      ),
    ),
  ),
];
const soloPeople = ["femme", "homme"] as const;
const pairPeople = ["hf", "hh", "ff"] as const;
const soloScenes = ["single", "student", "worker", "business", "visit", "single-parent"] as const;
const pairScenes = ["couple", "family"] as const;
const heroFiles = [
  ...heroLooks.flatMap((look) => [
    ...soloScenes.flatMap((scene) => soloPeople.map((people) => `hero-${scene}-${people}-${look}.jpg`)),
    ...pairScenes.flatMap((scene) => pairPeople.map((people) => `hero-${scene}-${people}-${look}.jpg`)),
  ]),
];

describe("pitch Afrique pré-RDV anti déjà-vu", () => {
  it("has 11 Africa layouts distinct from the post-RDV commercial deck", () => {
    expect(africaPitchSlides).toHaveLength(11);
    expect(africaPitchSlides[0].title).toBe("VOTRE PROJET CANADA COMMENCE ICI");
    expect(africaPitchSlides.every((slide) => slide.layout.startsWith("africa-"))).toBe(true);
    expect(africaPitchSlides.map((s) => s.layout)).not.toContain("hero");
    expect(africaPitchSlides.map((s) => s.layout)).not.toContain("stats");
    expect(africaPitchSlides.map((s) => s.layout)).not.toContain("problems");
  });

  it("ships dedicated pitch-africa assets and bans commercial déjà-vu photos", () => {
    const source = readFileSync(join(dirname(fileURLToPath(import.meta.url)), "pitch-africa.ts"), "utf8");
    expect(source).toContain("@/assets/pitch-africa/");
    expect(source).not.toMatch(/slide-01-1|emploi-sante|demo-aines|problem-wrong-path|slide-14-1/);
    for (const name of [
      "hero-family-consult.jpg",
      "welcome-work.jpg",
      "pillar-immigration.jpg",
      "trap-chaos.jpg",
      "proof-meeting.jpg",
      "cta-rdv.jpg",
    ]) {
      const path = join(africaDir, name);
      expect(existsSync(path), path).toBe(true);
      const bytes = readFileSync(path);
      expect(bytes.subarray(0, 3).equals(jpegMagic)).toBe(true);
    }
  });

  it("closes with a web RDV CTA, not a paid consultation", () => {
    const slide = africaPitchSlides[10];
    expect(slide.layout).toBe("africa-cta");
    expect(slide.title).toMatch(/RENDEZ-VOUS/i);
    expect(slide.lead).toMatch(/ir-immigration\.com/i);
    expect(slide.lead).not.toMatch(/déjà payée/i);
  });

  it("registers 11 pitch pages and wires AfricaPitchDeck", () => {
    expect(sections.find((s) => s.id === "pitch")?.slideCount).toBe(11);
    const source = readFileSync(join(dirname(fileURLToPath(import.meta.url)), "../features/pitch.tsx"), "utf8");
    expect(source).toContain("AfricaPitchDeck");
    expect(source).toContain("africaPitchSlides");
    expect(source).toContain("s.draft");
    expect(source).not.toContain("Faire rêver");
  });

  it("names every adult client in the welcome greeting", () => {
    expect(pitchWelcomeTitle(defaultProfile)).toBe(
      "On peut vous aider à construire votre projet Canada, Aminata et Mamadou.",
    );
  });

  it("uses africa-welcome cards with dedicated photos", () => {
    const slide = africaPitchSlides[1];
    expect(slide.layout).toBe("africa-welcome");
    expect(slide.cards?.map((card) => card.title)).toEqual([
      "Travailler",
      "S’installer",
      "Construire",
      "Évoluer",
    ]);
    expect(slide.cards?.every((card) => Boolean(card.image))).toBe(true);
    expect(String(slide.image)).toMatch(/welcome-bg-house/);
  });

  it("uses africa-proof scene vignettes instead of mismatched portraits", () => {
    const slide = africaPitchSlides.find((item) => item.layout === "africa-proof");
    expect(slide?.stats).toHaveLength(4);
    expect(slide?.stats?.every((stat) => Boolean(stat.image))).toBe(true);
    expect(String(slide?.stats?.map((s) => s.image).join(" "))).toMatch(/proof-/);
  });
});

describe("pitch hero adapts to the client profile", () => {
  it("uses a couple scene for the default couple", () => {
    expect(pitchHeroScene(defaultProfile)).toBe("couple");
  });

  it("uses a single adult when the client is alone", () => {
    expect(pitchHeroScene({ ...defaultProfile, family: "Seul(e)" })).toBe("single");
  });

  it("uses a student scene when the objective is studies", () => {
    expect(pitchHeroScene({ ...defaultProfile, family: "Seul(e)", objective: "Études" })).toBe("student");
  });

  it("uses a worker scene for a solo work project", () => {
    expect(pitchHeroScene({ ...defaultProfile, family: "Seul(e)", objective: "Travail" })).toBe("worker");
  });

  it("uses a business scene for a business objective", () => {
    expect(pitchHeroScene({ ...defaultProfile, family: "Seul(e)", objective: "Affaires" })).toBe("business");
  });

  it("uses a visit scene for a visit objective", () => {
    expect(pitchHeroScene({ ...defaultProfile, family: "Seul(e)", objective: "Visite" })).toBe("visit");
  });

  it("uses a family scene when the household includes children", () => {
    expect(pitchHeroScene({ ...defaultProfile, family: "Couple + enfant(s)" })).toBe("family");
  });

  it("uses a single-parent scene for a solo parent", () => {
    expect(pitchHeroScene({ ...defaultProfile, family: "Parent seul + enfant(s)" })).toBe("single-parent");
  });

  it("keeps the family scene for a polygamous household", () => {
    expect(pitchHeroScene({ ...defaultProfile, family: "Polygame" })).toBe("family");
  });

  it.each(objectives)("keeps the couple scene for a couple with objective %s", (objective) => {
    expect(pitchHeroScene({ ...defaultProfile, family: "Couple", objective })).toBe("couple");
    expect(String(pitchHeroImage({ ...defaultProfile, family: "Couple", objective }))).toMatch(
      /hero-couple-hf-noir/i,
    );
  });

  it.each(objectives)("keeps the family scene for a couple with children and objective %s", (objective) => {
    expect(pitchHeroScene({ ...defaultProfile, family: "Couple + enfant(s)", objective })).toBe("family");
  });

  it.each(objectives)("keeps the family scene for a polygamous household with objective %s", (objective) => {
    expect(pitchHeroScene({ ...defaultProfile, family: "Polygame", objective })).toBe("family");
  });

  it.each(objectives)("keeps the single-parent scene for a solo parent with objective %s", (objective) => {
    expect(pitchHeroScene({ ...defaultProfile, family: "Parent seul + enfant(s)", objective })).toBe(
      "single-parent",
    );
  });

  it("uses a woman-man pair for the default couple", () => {
    expect(pitchHeroPeople(defaultProfile)).toBe("hf");
  });

  it("uses two men when both adults are Homme", () => {
    expect(
      pitchHeroPeople({
        ...defaultProfile,
        applicant: { ...defaultApplicant, sex: "Homme" },
        spouse: { ...defaultSpouse, sex: "Homme" },
      }),
    ).toBe("hh");
  });

  it("uses two women when both adults are Femme", () => {
    expect(pitchHeroPeople({ ...defaultProfile, spouse: { ...defaultSpouse, sex: "Femme" } })).toBe("ff");
  });

  it("uses a solo man when the applicant is Homme and alone", () => {
    expect(
      pitchHeroPeople({
        ...defaultProfile,
        family: "Seul(e)",
        applicant: { ...defaultApplicant, sex: "Homme" },
      }),
    ).toBe("homme");
  });

  it("defaults to a Black West African look", () => {
    expect(pitchHeroLook(defaultProfile)).toBe("noir");
  });

  it("follows the origin country, not a stored appearance chip", () => {
    expect(pitchHeroLook({ ...defaultProfile, country: "France" })).toBe("blanc");
    expect(
      pitchHeroLook({
        ...defaultProfile,
        country: "France",
        applicant: { ...defaultApplicant, look: "Noir" },
      }),
    ).toBe("blanc");
  });

  it("uses an East Asian look when the origin country is China", () => {
    expect(pitchHeroLook({ ...defaultProfile, country: "Chine" })).toBe("asiatique");
  });

  it("uses a Latino look when the origin country is Mexico", () => {
    expect(pitchHeroLook({ ...defaultProfile, country: "Mexique" })).toBe("latino");
  });

  it("uses a Maghrebi look when the origin country is Morocco", () => {
    expect(pitchHeroLook({ ...defaultProfile, country: "Maroc" })).toBe("maghrebin");
  });

  it("picks a solo woman photo for Aminata and a solo man photo for Mamadou", () => {
    expect(String(personHeroImage(defaultApplicant))).toMatch(/hero-single-femme-noir/i);
    expect(String(personHeroImage(defaultSpouse))).toMatch(/hero-single-homme-noir/i);
    expect(personHeroImage(defaultApplicant)).not.toBe(personHeroImage(defaultSpouse));
  });

  it("follows the adult appearance on the person banner", () => {
    expect(String(personHeroImage({ ...defaultApplicant, look: "Blanc" }))).toMatch(/hero-single-femme-blanc/i);
    expect(String(personHeroImage({ ...defaultSpouse, look: "Asiatique" }))).toMatch(/hero-single-homme-asiatique/i);
  });

  it("returns a distinct photo for two men vs a mixed couple", () => {
    const twoMen = pitchHeroImage({
      ...defaultProfile,
      applicant: { ...defaultApplicant, sex: "Homme" },
      spouse: { ...defaultSpouse, sex: "Homme" },
    });
    expect(twoMen).not.toBe(pitchHeroImage(defaultProfile));
  });

  it("returns a White couple photo when the origin country is France", () => {
    const france = pitchHeroImage({
      ...defaultProfile,
      country: "France",
    });
    expect(france).not.toBe(pitchHeroImage(defaultProfile));
    expect(String(france)).toMatch(/blanc/i);
  });

  it("returns an East Asian couple photo when the origin country is China", () => {
    const china = pitchHeroImage({
      ...defaultProfile,
      country: "Chine",
    });
    expect(china).not.toBe(pitchHeroImage(defaultProfile));
    expect(String(china)).toMatch(/asiatique/i);
  });

  it("returns a Latino couple photo when the origin country is Mexico", () => {
    const mexico = pitchHeroImage({
      ...defaultProfile,
      country: "Mexique",
    });
    expect(mexico).not.toBe(pitchHeroImage(defaultProfile));
    expect(String(mexico)).toMatch(/latino/i);
  });

  it("uses the same country look for both adults on a couple hero", () => {
    const couple = {
      ...defaultProfile,
      country: "Bénin",
      applicant: { ...defaultApplicant, sex: "Femme" as const },
      spouse: { ...defaultSpouse, sex: "Homme" as const },
    };
    expect(pitchHeroLooks(couple)).toEqual({ applicant: "noir", spouse: "noir" });
    const sources = pitchHeroSources(couple);
    expect(sources).toHaveLength(1);
    expect(String(sources[0])).toMatch(/hero-couple-hf-noir/i);
    expect(String(sources[0])).not.toMatch(/hero-couple-hf-noir-/);
    expect(String(sources[0])).not.toMatch(/hero-single-/i);
  });

  it.each([...heroFiles, ...extraHeroFiles])("ships a local JPEG for %s", (name) => {
    const path = join(heroDir, name);
    expect(existsSync(path), path).toBe(true);
    const bytes = readFileSync(path);
    expect(bytes.subarray(0, 3).equals(jpegMagic)).toBe(true);
    expect(bytes.byteLength).toBeGreaterThan(8_000);
  });

  it("returns a distinct image for a solo client vs the default couple", () => {
    expect(pitchHeroImage({ ...defaultProfile, family: "Seul(e)" })).not.toBe(pitchHeroImage(defaultProfile));
  });
});

const daysFiles = [
  "days-couple-hf-noir.jpg",
  "days-couple-hf-blanc.jpg",
  "days-couple-hf-maghrebin.jpg",
  "days-couple-hf-asiatique.jpg",
  "days-couple-hf-latino.jpg",
  "days-couple-hh-noir.jpg",
  "days-couple-ff-noir.jpg",
  "days-family-hf-noir.jpg",
  "days-single-femme-noir.jpg",
  "days-single-parent-femme-noir.jpg",
  "days-single-parent-homme-noir.jpg",
  "days-student-femme-noir.jpg",
  "days-worker-femme-noir.jpg",
  "days-business-femme-noir.jpg",
  "days-visit-femme-noir.jpg",
];

describe("pitch 90-days hero adapts to every client profile", () => {
  it("reuses the same scene, people and look keys as the opening hero", () => {
    expect(pitchHeroScene(defaultProfile)).toBe("couple");
    expect(pitchHeroPeople(defaultProfile)).toBe("hf");
    expect(pitchHeroLook(defaultProfile)).toBe("noir");
  });

  it("uses origin country appearance when it is not the default Noir", () => {
    expect(pitchHeroLook({ ...defaultProfile, country: "France" })).toBe("blanc");
  });

  it("returns a family unpacking photo for a couple with children", () => {
    expect(String(pitchDaysImage({ ...defaultProfile, family: "Couple + enfant(s)" }))).toMatch(
      /days-family-hf-noir/i,
    );
  });

  it("returns a couple unpacking photo without children", () => {
    expect(String(pitchDaysImage(defaultProfile))).toMatch(/days-couple-hf-noir/i);
    expect(String(pitchDaysImage(defaultProfile))).not.toMatch(/family/i);
  });

  it("returns a solo adult unpacking photo", () => {
    expect(String(pitchDaysImage({ ...defaultProfile, family: "Seul(e)" }))).toMatch(/days-single-femme-noir/i);
  });

  it("returns a student housing photo for studies", () => {
    expect(
      String(pitchDaysImage({ ...defaultProfile, family: "Seul(e)", objective: "Études" })),
    ).toMatch(/days-student-femme-noir/i);
  });

  it("returns a worker photo for a solo work project", () => {
    expect(
      String(pitchDaysImage({ ...defaultProfile, family: "Seul(e)", objective: "Travail" })),
    ).toMatch(/days-worker-femme-noir/i);
  });

  it("returns a business photo for a business objective", () => {
    expect(
      String(pitchDaysImage({ ...defaultProfile, family: "Seul(e)", objective: "Affaires" })),
    ).toMatch(/days-business-femme-noir/i);
  });

  it("returns a visitor photo for a visit objective", () => {
    expect(
      String(pitchDaysImage({ ...defaultProfile, family: "Seul(e)", objective: "Visite" })),
    ).toMatch(/days-visit-femme-noir/i);
  });

  it.each(["Études", "Travail", "Visite", "Affaires"] as const)(
    "returns a couple unpacking photo when a couple chooses %s",
    (objective) => {
      expect(String(pitchDaysImage({ ...defaultProfile, family: "Couple", objective }))).toMatch(
        /days-couple-hf-noir/i,
      );
      expect(String(pitchDaysImage({ ...defaultProfile, family: "Couple", objective }))).not.toMatch(
        /days-(student|worker|visit|business)/i,
      );
    },
  );

  it("returns a single-parent unpacking photo", () => {
    expect(
      String(pitchDaysImage({ ...defaultProfile, family: "Parent seul + enfant(s)" })),
    ).toMatch(/days-single-parent-femme-noir/i);
  });

  it("returns two men unpacking when both adults are Homme", () => {
    expect(
      String(
        pitchDaysImage({
          ...defaultProfile,
          applicant: { ...defaultApplicant, sex: "Homme" },
          spouse: { ...defaultSpouse, sex: "Homme" },
        }),
      ),
    ).toMatch(/days-couple-hh-noir/i);
  });

  it("returns two women unpacking when both adults are Femme", () => {
    expect(
      String(pitchDaysImage({ ...defaultProfile, spouse: { ...defaultSpouse, sex: "Femme" } })),
    ).toMatch(/days-couple-ff-noir/i);
  });

  it("returns a White couple photo when the origin country is France", () => {
    expect(String(pitchDaysImage({ ...defaultProfile, country: "France" }))).toMatch(/days-couple-hf-blanc/i);
  });

  it("returns a Maghrebi couple photo when the origin country is Morocco", () => {
    expect(String(pitchDaysImage({ ...defaultProfile, country: "Maroc" }))).toMatch(/days-couple-hf-maghrebin/i);
  });

  it("returns an East Asian couple photo when the origin country is China", () => {
    expect(String(pitchDaysImage({ ...defaultProfile, country: "Chine" }))).toMatch(/days-couple-hf-asiatique/i);
  });

  it("returns a Latino couple photo when the origin country is Mexico", () => {
    expect(String(pitchDaysImage({ ...defaultProfile, country: "Mexique" }))).toMatch(/days-couple-hf-latino/i);
  });

  it("returns a father-and-child photo for a solo dad", () => {
    expect(
      String(
        pitchDaysImage({
          ...defaultProfile,
          family: "Parent seul + enfant(s)",
          applicant: { ...defaultApplicant, sex: "Homme" },
        }),
      ),
    ).toMatch(/days-single-parent-homme-noir/i);
  });

  it.each(daysFiles)("ships a local JPEG for %s", (name) => {
    const path = join(heroDir, name);
    expect(existsSync(path), path).toBe(true);
    const bytes = readFileSync(path);
    expect(bytes.subarray(0, 3).equals(jpegMagic)).toBe(true);
    expect(bytes.byteLength).toBeGreaterThan(8_000);
  });
});

const formLooks = ["noir", "blanc", "maghrebin", "asiatique", "latino"] as const;
const formSoloFiles = ["student", "worker", "business"].flatMap((kind) =>
  ["femme", "homme"].flatMap((people) => formLooks.map((look) => `form-${kind}-${people}-${look}.jpg`)),
);
const formFamilyHomog = ["hf", "hh", "ff", "femme", "homme"].flatMap((people) =>
  formLooks.map((look) => `form-family-${people}-${look}.jpg`),
);
const formFamilyMixedHf = formLooks.flatMap((femme) =>
  formLooks.filter((homme) => homme !== femme).map((homme) => `form-family-hf-${femme}-${homme}.jpg`),
);
const formFamilyMixedPairs = formLooks.flatMap((lookA, index) =>
  formLooks.slice(index + 1).flatMap((lookB) => [
    `form-family-hh-${lookA}-${lookB}.jpg`,
    `form-family-ff-${lookA}-${lookB}.jpg`,
  ]),
);
const formFiles = [...formSoloFiles, ...formFamilyHomog, ...formFamilyMixedHf, ...formFamilyMixedPairs];

describe("pitch forms slide adapts to the client profile", () => {
  it("uses Aminata on study, work and business for the default couple", () => {
    expect(pitchFormPeople(defaultProfile, "student")).toBe("femme");
    expect(String(pitchFormImage(defaultProfile, "student"))).toMatch(/form-student-femme-noir/i);
    expect(String(pitchFormImage(defaultProfile, "worker"))).toMatch(/form-worker-femme-noir/i);
    expect(String(pitchFormImage(defaultProfile, "business"))).toMatch(/form-business-femme-noir/i);
  });

  it("uses a family-together photo for the settle card", () => {
    expect(pitchFormPeople(defaultProfile, "family")).toBe("hf");
    expect(String(pitchFormImage(defaultProfile, "family"))).toMatch(/form-family-hf-noir/i);
    expect(String(pitchFormImage(defaultProfile, "family"))).not.toMatch(/form-family-hf-noir-/);
  });

  it("keeps a mixed-sex couple together on the settle card", () => {
    const mixed = {
      ...defaultProfile,
      applicant: { ...defaultApplicant, sex: "Femme" as const },
      spouse: { ...defaultSpouse, sex: "Homme" as const },
    };
    expect(String(pitchFormImage(mixed, "family"))).toMatch(/form-family-hf-noir/i);
    expect(String(pitchFormImage(mixed, "family"))).not.toMatch(/form-family-hf-noir-/);
    expect(String(pitchFormImage(mixed, "student"))).toMatch(/form-student-femme-noir/i);
    expect(String(pitchFormImage(mixed, "worker"))).toMatch(/form-worker-femme-noir/i);
  });

  it("uses a man on study, work and business when the applicant is Homme", () => {
    const man = {
      ...defaultProfile,
      family: "Seul(e)" as const,
      applicant: { ...defaultApplicant, sex: "Homme" as const },
    };
    expect(String(pitchFormImage(man, "student"))).toMatch(/form-student-homme-noir/i);
    expect(String(pitchFormImage(man, "worker"))).toMatch(/form-worker-homme-noir/i);
    expect(String(pitchFormImage(man, "business"))).toMatch(/form-business-homme-noir/i);
    expect(String(pitchFormImage(man, "family"))).toMatch(/form-family-homme-noir/i);
  });

  it("follows the origin country appearance on every form card", () => {
    const asian = {
      ...defaultProfile,
      country: "Chine",
    };
    expect(String(pitchFormImage(asian, "student"))).toMatch(/asiatique/i);
    expect(String(pitchFormImage(asian, "worker"))).toMatch(/asiatique/i);
    expect(String(pitchFormImage(asian, "business"))).toMatch(/asiatique/i);
    expect(String(pitchFormImage(asian, "family"))).toMatch(/form-family-hf-asiatique/i);
  });

  it("returns the four titled form cards from the live profile", () => {
    expect(pitchFormCards(defaultProfile).map((card) => card.title)).toEqual([
      "ÉTUDIER",
      "TRAVAILLER",
      "ENTREPRENDRE",
      "S’INSTALLER EN FAMILLE",
    ]);
    expect(pitchFormCards(defaultProfile).every((card) => Boolean(card.image))).toBe(true);
  });

  it.each(formFiles)("ships a local JPEG for %s", (name) => {
    const path = join(heroDir, name);
    expect(existsSync(path), path).toBe(true);
    const bytes = readFileSync(path);
    expect(bytes.subarray(0, 3).equals(jpegMagic)).toBe(true);
    expect(bytes.byteLength).toBeGreaterThan(8_000);
  });
});
