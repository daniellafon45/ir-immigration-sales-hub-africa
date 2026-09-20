import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { ecosystemLifeCards } from "@/data/ecosystem-life";
import { defaultApplicant, defaultProfile, defaultSpouse } from "@/data/profile";

const jpegMagic = Buffer.from([0xff, 0xd8, 0xff]);
const dir = join(dirname(fileURLToPath(import.meta.url)), "../assets/ecosystem");
const looks = ["noir", "blanc", "maghrebin", "asiatique", "latino"] as const;
const coupleScenes = ["foyer", "travail", "logement", "ville", "quartier", "arrivee"] as const;
const extraFiles = [
  "life-family-hf-noir.jpg",
  "life-ecole-hf-noir.jpg",
  "life-foyer-femme-noir.jpg",
  "life-foyer-homme-noir.jpg",
] as const;
const files = [
  ...looks.flatMap((look) => coupleScenes.map((scene) => `life-${scene}-hf-${look}.jpg`)),
  ...extraFiles,
];

describe("ecosystem life photos", () => {
  it.each(files)("ships a local JPEG for %s", (name) => {
    const path = join(dir, name);
    expect(existsSync(path), path).toBe(true);
    const bytes = readFileSync(path);
    expect(bytes.subarray(0, 3).equals(jpegMagic)).toBe(true);
    expect(bytes.byteLength).toBeGreaterThan(8_000);
  });
});

describe("ecosystemLifeCards", () => {
  it("returns six outcome cards for the default couple", () => {
    const cards = ecosystemLifeCards(defaultProfile);
    expect(cards).toHaveLength(6);
    expect(cards.map((card) => card.title)).toEqual([
      "Foyer",
      "Le métier",
      "Un toit",
      "La ville",
      "Le quartier",
      "Arrivés",
    ]);
    expect(cards.map((card) => card.subtitle)).toEqual([
      "Réuni",
      "En place",
      "Dès l’arrivée",
      "Une suite",
      "Ancré",
      "Le projet tient",
    ]);
    expect(String(cards[0]?.imageUrl)).toMatch(/life-foyer-hf-noir/i);
    expect(String(cards[3]?.imageUrl)).toMatch(/life-ville-hf-noir/i);
  });

  it("follows a White look when both adults are Blanc", () => {
    const cards = ecosystemLifeCards({
      ...defaultProfile,
      country: "France",
      applicant: { ...defaultApplicant, look: "Blanc" },
      spouse: { ...defaultSpouse, look: "Blanc" },
    });
    expect(String(cards[0]?.imageUrl)).toMatch(/life-foyer-hf-blanc/i);
  });

  it("follows Maghrebi, East Asian and Latino appearance chips", () => {
    expect(
      String(
        ecosystemLifeCards({
          ...defaultProfile,
          applicant: { ...defaultApplicant, look: "Maghrébin" },
          spouse: { ...defaultSpouse, look: "Maghrébin" },
        })[0]?.imageUrl,
      ),
    ).toMatch(/life-foyer-hf-maghrebin/i);
    expect(
      String(
        ecosystemLifeCards({
          ...defaultProfile,
          applicant: { ...defaultApplicant, look: "Asiatique" },
          spouse: { ...defaultSpouse, look: "Asiatique" },
        })[0]?.imageUrl,
      ),
    ).toMatch(/life-foyer-hf-asiatique/i);
    expect(
      String(
        ecosystemLifeCards({
          ...defaultProfile,
          applicant: { ...defaultApplicant, look: "Latino" },
          spouse: { ...defaultSpouse, look: "Latino" },
        })[0]?.imageUrl,
      ),
    ).toMatch(/life-foyer-hf-latino/i);
  });

  it("uses family and school photos when the foyer includes children", () => {
    const cards = ecosystemLifeCards({ ...defaultProfile, family: "Couple + enfant(s)" });
    expect(cards[3]?.title).toBe("L’école");
    expect(String(cards[0]?.imageUrl)).toMatch(/life-family-hf-noir/i);
    expect(String(cards[3]?.imageUrl)).toMatch(/life-ecole-hf-noir/i);
  });

  it("uses a solo adult foyer photo without inventing children", () => {
    const cards = ecosystemLifeCards({ ...defaultProfile, family: "Seul(e)" });
    expect(cards[3]?.title).toBe("La ville");
    expect(String(cards[0]?.imageUrl)).toMatch(/life-foyer-femme-noir/i);
    expect(String(cards[0]?.imageUrl)).not.toMatch(/family|ecole/i);
  });

  it("uses a solo man foyer photo when the applicant is a man living alone", () => {
    const cards = ecosystemLifeCards({
      ...defaultProfile,
      family: "Seul(e)",
      applicant: { ...defaultApplicant, sex: "Homme" },
      spouse: defaultSpouse,
    });
    expect(String(cards[0]?.imageUrl)).toMatch(/life-foyer-homme-noir/i);
  });
});
