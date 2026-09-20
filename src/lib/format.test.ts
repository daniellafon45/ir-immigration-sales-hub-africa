import { describe, expect, it } from "vitest";
import { CURRENCY_RATES_AS_OF, cadToLocal, currencyForCountry } from "@/data/currencies";
import { money, moneyLocal, moneyPair, num } from "@/lib/format";

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

describe("local currency", () => {
  it("maps Benin to XOF / FCFA", () => {
    expect(currencyForCountry("Bénin")?.code).toBe("XOF");
    expect(currencyForCountry("Canada")).toBeNull();
    expect(currencyForCountry("")).toBeNull();
  });

  it("converts CAD to local with indicative rates", () => {
    expect(cadToLocal(100, "Bénin")).toBe(48000);
    expect(cadToLocal(100, "Cameroun")).toBe(48000);
    expect(cadToLocal(100, "France")).toBeNull();
    expect(CURRENCY_RATES_AS_OF).toMatch(/2026/);
  });

  it("formats a local line for Africa profiles", () => {
    expect(moneyLocal(1000, "Bénin")).toMatch(/FCFA/);
    expect(moneyLocal(1000, "Canada")).toBeNull();
    const pair = moneyPair(1000, "Bénin");
    expect(pair.cad).toContain("1");
    expect(pair.local).toMatch(/^≈ /);
    expect(pair.local).toMatch(/FCFA/);
  });
});
