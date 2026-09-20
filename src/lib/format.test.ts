import { describe, expect, it } from "vitest";
import { money, num } from "@/lib/format";

describe("money", () => {
  it("formats CAD without cents", () => {
    expect(money(72000)).toContain("72");
    expect(money(0)).toContain("0");
  });
});

describe("num", () => {
  it("formats thousands for fr-CA", () => {
    expect(num(104000)).toMatch(/104/);
  });
});
