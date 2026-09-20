import { describe, expect, it } from "vitest";
import { routes } from "@/data/routes";
import { fastestRouteId, irccTimeFor, irccTimes, irccTimesMeta } from "@/data/ircc-times";

describe("irccTimes", () => {
  it("covers every comparable route with an approximate IRCC wait", () => {
    expect(irccTimesMeta.updatedLabel).toBe("septembre 2026");
    expect(Object.keys(irccTimes)).toEqual(routes.map((route) => route.id));
    expect(irccTimeFor("ee").headline).toBe("6-7 mois");
    expect(irccTimeFor("study").headline).toBe("4-16 semaines");
    expect(irccTimeFor("pnp").headline).toBe("7-16 mois");
    expect(irccTimeFor("family").tracks?.some((track) => track.label === "Québec")).toBe(true);
    expect(irccTimeFor("missing").headline).toBe("Variable");
  });

  it("marks the shortest selected wait as fastest", () => {
    expect(fastestRouteId(["ee", "study", "pnp"])).toBe("study");
    expect(fastestRouteId(["family", "work"])).toBe("work");
    expect(fastestRouteId(["ee"])).toBeUndefined();
    expect(fastestRouteId(["business", "asylum"])).toBeUndefined();
  });
});
