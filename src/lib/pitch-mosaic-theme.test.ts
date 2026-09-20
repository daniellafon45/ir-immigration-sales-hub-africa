import { describe, expect, it } from "vitest";
import { pitchMosaicTheme } from "@/lib/pitch-mosaic-theme";

describe("pitchMosaicTheme", () => {
  it("maps the four mosaic cards to opportunity themes", () => {
    expect(pitchMosaicTheme("ÉTUDIER")).toBe("study");
    expect(pitchMosaicTheme("TRAVAILLER")).toBe("employment");
    expect(pitchMosaicTheme("ENTREPRENDRE")).toBe("business");
    expect(pitchMosaicTheme("S’INSTALLER")).toBe("nationality");
    expect(pitchMosaicTheme("S'INSTALLER")).toBe("nationality");
  });

  it("returns null for unknown titles", () => {
    expect(pitchMosaicTheme("AUTRE")).toBeNull();
  });
});
