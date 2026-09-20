import { describe, expect, it } from "vitest";
import { COMPARE_LIMIT, nextCompareSelected } from "@/lib/compare-select";

describe("nextCompareSelected", () => {
  it("adds a route when under the limit", () => {
    expect(nextCompareSelected(["ee"], "work")).toEqual(["ee", "work"]);
  });

  it("unchecks a selected route", () => {
    expect(nextCompareSelected(["ee", "study", "pnp"], "study")).toEqual(["ee", "pnp"]);
  });

  it("replaces the oldest selection so a fourth click always counts", () => {
    expect(nextCompareSelected(["ee", "study", "pnp"], "work")).toEqual(["study", "pnp", "work"]);
    expect(COMPARE_LIMIT).toBe(3);
  });
});
