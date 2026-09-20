import {
  AlertTriangle,
  CalendarCheck,
  DollarSign,
  Globe2,
  Network,
  Presentation,
  Scale,
  TrendingUp,
  User,
} from "lucide-react";
import { describe, expect, it } from "vitest";
import { sections } from "@/catalog";

describe("Africa section nav", () => {
  it("uses a distinct icon for every section", () => {
    const icons = sections.map((section) => section.icon);
    expect(new Set(icons).size).toBe(icons.length);
  });

  it("matches the Africa closing funnel catalog", () => {
    expect(sections.map((section) => section.id)).toEqual([
      "profile",
      "pitch",
      "opportunites",
      "comparaison-pays",
      "preuves",
      "risques",
      "pourquoi-nous",
      "ecosysteme",
      "rdv",
    ]);
    const byId = Object.fromEntries(sections.map((section) => [section.id, section.icon]));
    expect(byId.profile).toBe(User);
    expect(byId.pitch).toBe(Presentation);
    expect(byId.opportunites).toBe(TrendingUp);
    expect(byId["comparaison-pays"]).toBe(Globe2);
    expect(byId.preuves).toBe(DollarSign);
    expect(byId.risques).toBe(AlertTriangle);
    expect(byId["pourquoi-nous"]).toBe(Scale);
    expect(byId.ecosysteme).toBe(Network);
    expect(byId.rdv).toBe(CalendarCheck);
  });

  it("keeps pitch at 11 Africa slides and preuves at 2", () => {
    expect(sections.find((s) => s.id === "pitch")?.slideCount).toBe(11);
    expect(sections.find((s) => s.id === "preuves")?.slideCount).toBe(2);
  });
});
