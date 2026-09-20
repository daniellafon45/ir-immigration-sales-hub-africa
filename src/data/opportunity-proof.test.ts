import { describe, expect, it } from "vitest";
import {
  OPPORTUNITY_THEMES,
  opportunityPress,
  opportunityPressFor,
  opportunityThemeLabel,
  type OpportunityThemeId,
} from "@/data/opportunity-proof";

describe("opportunity-proof", () => {
  it("exposes the six opportunity themes in card order", () => {
    expect(OPPORTUNITY_THEMES.map((t) => t.id)).toEqual([
      "study",
      "employment",
      "salary",
      "nationality",
      "business",
      "flexibility",
    ]);
    expect(opportunityThemeLabel("study")).toBe("Études");
    expect(opportunityThemeLabel("employment")).toBe("Emploi");
    expect(opportunityThemeLabel("salary")).toBe("Salaire & aides");
    expect(opportunityThemeLabel("nationality")).toBe("Nationalité");
    expect(opportunityThemeLabel("business")).toBe("Entrepreneuriat");
    expect(opportunityThemeLabel("flexibility")).toBe("Flexibilité");
    expect(OPPORTUNITY_THEMES.every((t) => Boolean(t.image))).toBe(true);
  });

  it("ships exactly two public press articles per theme", () => {
    const themes: OpportunityThemeId[] = [
      "study",
      "employment",
      "salary",
      "nationality",
      "business",
      "flexibility",
    ];
    for (const theme of themes) {
      const articles = opportunityPressFor(theme);
      expect(articles).toHaveLength(2);
      for (const article of articles) {
        expect(article.theme).toBe(theme);
        expect(article.source.length).toBeGreaterThan(2);
        expect(article.title.length).toBeGreaterThan(10);
        expect(article.excerpt.length).toBeGreaterThan(20);
        expect(article.url).toMatch(/^https:\/\//);
        expect(article.image).toBeTruthy();
      }
    }
    expect(opportunityPress).toHaveLength(12);
    const urls = opportunityPress.map((a) => a.url);
    expect(new Set(urls).size).toBe(urls.length);
  });
});
