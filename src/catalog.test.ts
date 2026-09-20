import {
  AlertTriangle,
  Briefcase,
  Calculator,
  Columns2,
  DollarSign,
  MapPin,
  Network,
  Presentation,
  Radio,
  Signpost,
  TrendingUp,
  User,
} from "lucide-react";
import { describe, expect, it } from "vitest";
import { sections } from "@/catalog";

describe("section nav icons", () => {
  it("uses a distinct icon for every section", () => {
    const icons = sections.map((section) => section.icon);
    expect(new Set(icons).size).toBe(icons.length);
  });

  it("matches each section to a pictogram that reads at a glance", () => {
    const byId = Object.fromEntries(sections.map((section) => [section.id, section.icon]));
    expect(byId.profile).toBe(User);
    expect(byId.pitch).toBe(Presentation);
    expect(byId.canada).toBe(Radio);
    expect(byId.opportunites).toBe(TrendingUp);
    expect(byId.emplois).toBe(Briefcase);
    expect(byId.salaires).toBe(DollarSign);
    expect(byId.calculateurs).toBe(Calculator);
    expect(byId.provinces).toBe(MapPin);
    expect(byId.voies).toBe(Signpost);
    expect(byId.comparateur).toBe(Columns2);
    expect(byId.echecs).toBe(AlertTriangle);
    expect(byId.ecosysteme).toBe(Network);
  });
});
