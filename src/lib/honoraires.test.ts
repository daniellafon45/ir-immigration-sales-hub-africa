import { describe, expect, it } from "vitest";
import { honorairesGrid, sourceUrl } from "@/data/honoraires";
import { createExtraSpouse, defaultProfile, emptyAdult } from "@/data/profile";
import { honorairesFor, honorairesTrackFor } from "@/lib/honoraires";

function kids(count: number) {
  return Array.from({ length: count }, (_, index) => ({
    id: `child-${index + 1}`,
    firstName: `Enfant ${index + 1}`,
    age: 6 + index,
  }));
}

describe("honoraires grid", () => {
  it("keeps the extracted IR service tariffs aligned with the sheet", () => {
    expect(sourceUrl).toContain("1xPJHVvXbmSO9cyPPq11QIag0LxyzJ9-m");
    expect(honorairesGrid.rp).toEqual({ service: 5000, extraAdult: 1500, child: 150 });
    expect(honorairesGrid.visa).toEqual({ service: 2000, extraAdult: 500, child: 150 });
    expect(honorairesGrid.studies).toEqual({ service: 6000, extraAdult: 0, child: 0 });
    expect(honorairesGrid.work).toEqual({ service: 2000, extraAdult: 0, child: 0 });
  });

  it("maps objectives to the sheet tracks and skips business or family sponsorship", () => {
    expect(honorairesTrackFor("Résidence permanente")).toBe("rp");
    expect(honorairesTrackFor("Visite")).toBe("visa");
    expect(honorairesTrackFor("Études")).toBe("studies");
    expect(honorairesTrackFor("Travail")).toBe("work");
    expect(honorairesTrackFor("Affaires")).toBeNull();
    expect(honorairesTrackFor("Regroupement familial")).toBeNull();
  });
});

describe("honorairesFor", () => {
  it("prices a solo permanent-residence file at the principal tariff", () => {
    expect(
      honorairesFor({
        ...defaultProfile,
        family: "Seul(e)",
        spouse: emptyAdult,
        children: [],
      }),
    ).toEqual({
      applicable: true,
      service: 5000,
      adults: 0,
      kids: 0,
      total: 5000,
    });
  });

  it("adds the adult supplement for a couple on permanent residence", () => {
    expect(honorairesFor(defaultProfile)).toEqual({
      applicable: true,
      service: 5000,
      adults: 1,
      kids: 0,
      total: 6500,
    });
  });

  it("matches the sheet family-of-five permanent-residence scenario", () => {
    expect(
      honorairesFor({
        ...defaultProfile,
        family: "Couple + enfant(s)",
        children: kids(3),
      }),
    ).toEqual({
      applicable: true,
      service: 5000,
      adults: 1,
      kids: 3,
      total: 6950,
    });
  });

  it("adds visa supplements for extra adults and children", () => {
    expect(
      honorairesFor({
        ...defaultProfile,
        objective: "Visite",
        family: "Couple + enfant(s)",
        children: kids(2),
      }),
    ).toEqual({
      applicable: true,
      service: 2000,
      adults: 1,
      kids: 2,
      total: 2800,
    });
  });

  it("keeps study and work files on the sheet flat packages", () => {
    const family = {
      ...defaultProfile,
      family: "Couple + enfant(s)",
      children: kids(2),
    };
    expect(honorairesFor({ ...family, objective: "Études" }).total).toBe(6000);
    expect(honorairesFor({ ...family, objective: "Travail" }).total).toBe(2000);
  });

  it("counts extra wives on a polygamous permanent-residence file", () => {
    const extra = { ...createExtraSpouse(), firstName: "Awa" };
    expect(
      honorairesFor({
        ...defaultProfile,
        family: "Polygame",
        extraSpouses: [extra],
        children: kids(1),
      }),
    ).toEqual({
      applicable: true,
      service: 5000,
      adults: 2,
      kids: 1,
      total: 8150,
    });
  });

  it("does not quote IR honoraires for business or family-sponsorship files", () => {
    expect(honorairesFor({ ...defaultProfile, objective: "Affaires" }).applicable).toBe(false);
    expect(honorairesFor({ ...defaultProfile, objective: "Regroupement familial" }).total).toBe(0);
  });
});
