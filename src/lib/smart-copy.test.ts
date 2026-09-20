import { describe, expect, it } from "vitest";
import { defaultProfile } from "@/data/profile";
import { smart } from "@/lib/smart-copy";

describe("smart", () => {
  it("replaces profile tokens", () => {
    expect(smart("Bonjour {name} à {province}", defaultProfile)).toBe("Bonjour Aminata à Québec");
  });
});
