import { describe, expect, it } from "vitest";
import { ALL_CITIES, ALL_PROVINCES } from "@/data/job-demand";
import { defaultProfile, emptyAdult } from "@/data/profile";
import { householdDemand } from "@/lib/household-demand";

describe("householdDemand", () => {
  it("splits the default couple into Comptable and Développeur logiciel groups", () => {
    const view = householdDemand(defaultProfile, { province: "QC", cityId: "montreal" });
    expect(view.groups).toHaveLength(2);
    expect(view.groups[0].adult.member.profession).toBe("Comptable");
    expect(view.groups[1].adult.member.profession).toBe("Développeur logiciel");
    expect(view.groups[0].current.id).toBe("montreal");
    expect(view.groups[0].series.some((point) => point.id === "montreal")).toBe(true);
    expect(view.placeLabel).toBe("Montréal, QC");
  });

  it("keeps a single group when the family is Seul(e)", () => {
    const view = householdDemand(
      { ...defaultProfile, family: "Seul(e)", spouse: emptyAdult },
      { province: "QC", cityId: ALL_CITIES },
    );
    expect(view.groups).toHaveLength(1);
    expect(view.groups[0].current.id).toBe("QC");
    expect(view.placeLabel).toBe("Québec");
  });

  it("filters the series to Ontario cities when the province changes", () => {
    const view = householdDemand(defaultProfile, { province: "ON", cityId: ALL_CITIES });
    expect(view.groups[0].series.map((point) => point.id)).toEqual(
      expect.arrayContaining(["toronto", "ottawa"]),
    );
    expect(view.groups[0].series.some((point) => point.id === "montreal")).toBe(false);
    expect(view.placeLabel).toBe("Ontario");
  });

  it("compares provinces when both filters are open", () => {
    const view = householdDemand(defaultProfile, { province: ALL_PROVINCES, cityId: ALL_CITIES });
    expect(view.groups[0].current.id).toBe("CA");
    expect(view.groups[0].series.map((point) => point.id)).toEqual(expect.arrayContaining(["QC", "ON", "AB"]));
    expect(view.placeLabel).toBe("Canada");
  });

  it("exposes international hiring share when intlOnly is on", () => {
    const local = householdDemand(defaultProfile, { province: "QC", cityId: "montreal" });
    const intl = householdDemand(defaultProfile, { province: "QC", cityId: "montreal", intlOnly: true });
    expect(intl.groups[0].current.intlShare).toBe(local.groups[0].current.intlShare);
    expect(intl.groups[0].metric).toBe("intlShare");
    expect(local.groups[0].metric).toBe("score");
  });
});
