import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { sections } from "@/catalog";
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
  pitchSlides,
  pitchWelcomeTitle,
} from "@/data/pitch";
import { defaultApplicant, defaultProfile, defaultSpouse, objectives } from "@/data/profile";
import { describe, expect, it } from "vitest";

const jpegMagic = Buffer.from([0xff, 0xd8, 0xff]);
const heroDir = join(dirname(fileURLToPath(import.meta.url)), "../assets/pitch");
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

describe("pitch commercial 2026", () => {
  it("has 13 commercial slides, starting with the hero title", () => {
    expect(pitchSlides).toHaveLength(13);
    expect(pitchSlides[0].title).toBe("VOTRE PROJET CANADA COMMENCE ICI");
    expect(pitchSlides[12].title).toContain("LE CANADA N’EST PAS UN RÊVE À ACHETER");
  });

  it("illustrates each targeting stat with a photo", () => {
    const slide = pitchSlides.find((item) => item.layout === "stats");
    expect(slide?.stats).toHaveLength(4);
    expect(slide?.stats?.every((stat) => Boolean(stat.image))).toBe(true);
  });

  it("illustrates each project-risk card with a dedicated problem photo", () => {
    const slide = pitchSlides.find((item) => item.layout === "problems");
    const images = slide?.items?.map((item) => String(item.image)) ?? [];
    expect(slide?.items).toHaveLength(4);
    expect(images).toHaveLength(4);
    expect(images.every((src) => /problem-(wrong-path|incoherent-file|career-late|settlement-chance)/i.test(src))).toBe(
      true,
    );
    expect(new Set(images).size).toBe(4);
    expect(images.join(" ")).not.toMatch(/slide-02-1|slide-07-2|slide-07-5|pont-metier/i);
  });

  it("closes the CTA after a paid consultation, not a first listening", () => {
    const slide = pitchSlides[11];
    expect(slide.layout).toBe("cta");
    expect(slide.title).toBe("ENTAMONS VOTRE PROJET SANS PLUS TARDER");
    expect(slide.lead).toBe(
      "La consultation est déjà payée. Ses frais seront déduits des honoraires de service de la procédure.",
    );
    expect(slide.items?.map((item) => item.title)).toEqual([
      "Nous validons la stratégie retenue aujourd’hui",
      "Nous constituons le dossier et le calendrier",
      "Nous lançons les démarches sans attendre",
      "Vous avancez avec un plan d’action clair",
    ]);
    expect(slide.lead).not.toMatch(/clarifiez|avant de payer/i);
    expect(slide.items?.map((item) => item.title).join(" ")).not.toMatch(/écoutons|analysons|repartez/i);
  });

  it("registers 13 pitch pages in the hub catalog", () => {
    expect(sections.find((s) => s.id === "pitch")?.slideCount).toBe(13);
  });

  it("no longer uses the generic Faire rêver deck", () => {
    const source = readFileSync(join(dirname(fileURLToPath(import.meta.url)), "../features/pitch.tsx"), "utf8");
    expect(source).toContain("PitchDeck");
    expect(source).not.toContain("Faire rêver");
  });

  it("feeds the live client draft into the opening hero", () => {
    const source = readFileSync(join(dirname(fileURLToPath(import.meta.url)), "../features/pitch.tsx"), "utf8");
    expect(source).toContain("s.draft");
  });

  it("names every adult client in the slide 2 greeting", () => {
    expect(pitchWelcomeTitle(defaultProfile)).toBe(
      "On peut vous aider à construire votre projet Canada, Aminata et Mamadou.",
    );
    expect(pitchWelcomeTitle({ ...defaultProfile, family: "Seul(e)" })).toBe(
      "On peut vous aider à construire votre projet Canada, Aminata.",
    );
    expect(
      pitchWelcomeTitle({
        ...defaultProfile,
        extraSpouses: [{ ...defaultProfile.spouse, id: "extra-awa", firstName: "Awa" }],
      }),
    ).toBe("On peut vous aider à construire votre projet Canada, Aminata et Mamadou.");
    expect(
      pitchWelcomeTitle({
        ...defaultProfile,
        family: "Polygame",
        extraSpouses: [{ ...defaultProfile.spouse, id: "extra-awa", firstName: "Awa" }],
      }),
    ).toBe("On peut vous aider à construire votre projet Canada, Aminata, Mamadou et Awa.");
  });

  it("uses a Canada Live card grid on slide 2, with photo cards", () => {
    const slide = pitchSlides[1];
    expect(slide.layout).toBe("welcome");
    expect(slide.cards?.map((card) => card.title)).toEqual([
      "Travailler",
      "S’installer",
      "Construire",
      "Évoluer",
    ]);
    expect(slide.cards?.every((card) => Boolean(card.image))).toBe(true);
    expect(slide.lead).toMatch(/cabinet/i);
  });

  it("shows the photo forms slide once, in place of the old doors slide", () => {
    const forms = pitchSlides.filter((slide) => slide.layout === "forms");
    expect(forms).toHaveLength(1);
    expect(pitchSlides[6]).toEqual(forms[0]);
    expect(pitchSlides[6].title).toBe("VOTRE CANADA PEUT PRENDRE PLUSIEURS FORMES");
    expect(pitchSlides.some((slide) => slide.title.includes("QUELLE PORTE"))).toBe(false);
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

  it("follows the applicant appearance chip, not the origin country", () => {
    expect(pitchHeroLook({ ...defaultProfile, country: "France" })).toBe("noir");
    expect(
      pitchHeroLook({
        ...defaultProfile,
        country: "France",
        applicant: { ...defaultApplicant, look: "Blanc" },
      }),
    ).toBe("blanc");
  });

  it("uses an East Asian look when the applicant chip is Asiatique", () => {
    expect(pitchHeroLook({ ...defaultProfile, applicant: { ...defaultApplicant, look: "Asiatique" } })).toBe(
      "asiatique",
    );
  });

  it("uses a Latino look when the applicant chip is Latino", () => {
    expect(pitchHeroLook({ ...defaultProfile, applicant: { ...defaultApplicant, look: "Latino" } })).toBe("latino");
  });

  it("uses a Maghrebi look when the applicant chip is Maghrébin", () => {
    expect(pitchHeroLook({ ...defaultProfile, applicant: { ...defaultApplicant, look: "Maghrébin" } })).toBe(
      "maghrebin",
    );
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

  it("returns a White couple photo when both adults are Blanc", () => {
    const france = pitchHeroImage({
      ...defaultProfile,
      country: "France",
      applicant: { ...defaultApplicant, look: "Blanc" },
      spouse: { ...defaultSpouse, look: "Blanc" },
    });
    expect(france).not.toBe(pitchHeroImage(defaultProfile));
    expect(String(france)).toMatch(/blanc/i);
  });

  it("returns an East Asian couple photo when both adults are Asiatique", () => {
    const china = pitchHeroImage({
      ...defaultProfile,
      applicant: { ...defaultApplicant, look: "Asiatique" },
      spouse: { ...defaultSpouse, look: "Asiatique" },
    });
    expect(china).not.toBe(pitchHeroImage(defaultProfile));
    expect(String(china)).toMatch(/asiatique/i);
  });

  it("returns a Latino couple photo when both adults are Latino", () => {
    const mexico = pitchHeroImage({
      ...defaultProfile,
      applicant: { ...defaultApplicant, look: "Latino" },
      spouse: { ...defaultSpouse, look: "Latino" },
    });
    expect(mexico).not.toBe(pitchHeroImage(defaultProfile));
    expect(String(mexico)).toMatch(/latino/i);
  });

  it("uses a mixed couple photo for a Black woman and a White man", () => {
    const mixed = {
      ...defaultProfile,
      applicant: { ...defaultApplicant, sex: "Femme" as const, look: "Noir" as const },
      spouse: { ...defaultSpouse, sex: "Homme" as const, look: "Blanc" as const },
    };
    expect(pitchHeroLooks(mixed)).toEqual({ applicant: "noir", spouse: "blanc" });
    const sources = pitchHeroSources(mixed);
    expect(sources).toHaveLength(1);
    expect(String(sources[0])).toMatch(/hero-couple-hf-noir-blanc/i);
    expect(String(sources[0])).not.toMatch(/hero-single-/i);
    const homog = pitchHeroSources({
      ...mixed,
      spouse: { ...defaultSpouse, sex: "Homme", look: "Noir" },
    });
    expect(sources[0]).not.toBe(homog[0]);
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

  it("uses applicant appearance when it is not the default Noir", () => {
    expect(
      pitchHeroLook({
        ...defaultProfile,
        applicant: { ...defaultApplicant, look: "Blanc" },
      }),
    ).toBe("blanc");
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

  it("returns a White couple photo when both adults are Blanc", () => {
    expect(
      String(
        pitchDaysImage({
          ...defaultProfile,
          applicant: { ...defaultApplicant, look: "Blanc" },
          spouse: { ...defaultSpouse, look: "Blanc" },
        }),
      ),
    ).toMatch(/days-couple-hf-blanc/i);
  });

  it("returns a Maghrebi couple photo when both adults are Maghrébin", () => {
    expect(
      String(
        pitchDaysImage({
          ...defaultProfile,
          applicant: { ...defaultApplicant, look: "Maghrébin" },
          spouse: { ...defaultSpouse, look: "Maghrébin" },
        }),
      ),
    ).toMatch(/days-couple-hf-maghrebin/i);
  });

  it("returns an East Asian couple photo when both adults are Asiatique", () => {
    expect(
      String(
        pitchDaysImage({
          ...defaultProfile,
          applicant: { ...defaultApplicant, look: "Asiatique" },
          spouse: { ...defaultSpouse, look: "Asiatique" },
        }),
      ),
    ).toMatch(/days-couple-hf-asiatique/i);
  });

  it("returns a Latino couple photo when both adults are Latino", () => {
    expect(
      String(
        pitchDaysImage({
          ...defaultProfile,
          applicant: { ...defaultApplicant, look: "Latino" },
          spouse: { ...defaultSpouse, look: "Latino" },
        }),
      ),
    ).toMatch(/days-couple-hf-latino/i);
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

  it("keeps a mixed couple together on the settle card", () => {
    const mixed = {
      ...defaultProfile,
      applicant: { ...defaultApplicant, sex: "Femme" as const, look: "Noir" as const },
      spouse: { ...defaultSpouse, sex: "Homme" as const, look: "Blanc" as const },
    };
    expect(String(pitchFormImage(mixed, "family"))).toMatch(/form-family-hf-noir-blanc/i);
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

  it("follows the applicant appearance chip on every form card", () => {
    const asian = {
      ...defaultProfile,
      applicant: { ...defaultApplicant, look: "Asiatique" as const },
      spouse: { ...defaultSpouse, look: "Asiatique" as const },
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
