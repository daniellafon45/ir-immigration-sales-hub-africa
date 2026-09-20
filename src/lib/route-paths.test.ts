import { describe, expect, it } from "vitest";
import { defaultProfile, emptyAdult } from "@/data/profile";
import { routeBridges, routes } from "@/data/routes";
import { bridgesFrom, recommendedScenarioId, routeById, routeForObjective } from "@/lib/route-paths";

describe("routes", () => {
  it("lists eight demo pathways including visitor and asylum", () => {
    expect(routes).toHaveLength(8);
    expect(routes.map((route) => route.id)).toEqual([
      "ee",
      "study",
      "pnp",
      "work",
      "family",
      "business",
      "visit",
      "asylum",
    ]);
    expect(routes.every((route) => route.conditions.length > 0)).toBe(true);
  });
});

describe("routeBridges", () => {
  it("lists eight bridges and warns that asylum is not an economic plan B", () => {
    expect(routeBridges).toHaveLength(8);
    const asylum = routeBridges.find((bridge) => bridge.id === "visit-asylum");
    expect(asylum?.from).toBe("visit");
    expect(asylum?.to).toBe("asylum");
    expect(asylum?.caution).toBe("L’asile protège. Ce n’est pas un plan B économique.");
  });
});

describe("route paths", () => {
  it("maps the profile objective to a starting route", () => {
    expect(routeForObjective("Résidence permanente").id).toBe("ee");
    expect(routeForObjective("Études").id).toBe("study");
    expect(routeForObjective("Travail").id).toBe("work");
    expect(routeForObjective("Visite").id).toBe("visit");
    expect(routeForObjective("Affaires").id).toBe("business");
    expect(routeForObjective("Regroupement familial").id).toBe("family");
    expect(routeById("study")?.name).toBe("Permis d’études");
  });

  it("returns visitor bridges toward study, work and asylum", () => {
    expect(bridgesFrom("visit").map((bridge) => bridge.to)).toEqual(["study", "work", "asylum"]);
    expect(bridgesFrom("work").map((bridge) => bridge.to)).toEqual(["pnp", "ee"]);
    expect(bridgesFrom("family")).toEqual([]);
  });
});

describe("recommendedScenarioId", () => {
  it("picks a household scenario from the profile", () => {
    expect(recommendedScenarioId(defaultProfile)).toBe("A");
    expect(recommendedScenarioId({ ...defaultProfile, objective: "Études" })).toBe("B");
    expect(recommendedScenarioId({ ...defaultProfile, objective: "Travail" })).toBe("B");
    expect(recommendedScenarioId({ ...defaultProfile, objective: "Visite" })).toBe("B");
    expect(recommendedScenarioId({ ...defaultProfile, objective: "Affaires" })).toBe("C");
    expect(recommendedScenarioId({ ...defaultProfile, objective: "Regroupement familial" })).toBe("D");
    expect(
      recommendedScenarioId({
        ...defaultProfile,
        family: "Couple + enfant(s)",
        children: [{ id: "c1", firstName: "Léa", age: 6 }],
      }),
    ).toBe("D");
    expect(recommendedScenarioId({ ...defaultProfile, family: "Seul(e)", spouse: emptyAdult, objective: "Affaires" })).toBe("C");
  });
});
