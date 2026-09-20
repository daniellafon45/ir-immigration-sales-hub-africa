import { describe, expect, it } from "vitest";
import { seasonFromDate } from "@/lib/season";

describe("seasonFromDate", () => {
  it("maps meteorological seasons for Canada", () => {
    expect(seasonFromDate(new Date(2026, 0, 15))).toBe("winter");
    expect(seasonFromDate(new Date(2026, 2, 21))).toBe("spring");
    expect(seasonFromDate(new Date(2026, 6, 1))).toBe("summer");
    expect(seasonFromDate(new Date(2026, 8, 18))).toBe("fall");
    expect(seasonFromDate(new Date(2026, 11, 31))).toBe("winter");
  });
});
