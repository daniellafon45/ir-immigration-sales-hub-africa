import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { startupVisaNote } from "@/data/business-paths";
import { sections } from "@/catalog";
import { canadaLivePages, canadaLivePagesFor } from "@/data/canada-live";
import { ALL_CANADA, canadaLivePlaceOptions } from "@/data/canada-live-place";
import { defaultProfile } from "@/data/profile";
import { provinceData } from "@/data/provinces";

const feature = readFileSync(join(dirname(fileURLToPath(import.meta.url)), "../features/canada.tsx"), "utf8");

describe("Canada Live briefing pages", () => {
  it("keeps four meeting pages in the data (offline from Africa menu)", () => {
    expect(sections.map((s) => s.id)).not.toContain("canada");
    expect(canadaLivePages).toHaveLength(4);
  });

  it("gives each page its own stats, talking points and recent press", () => {
    for (const page of canadaLivePages) {
      expect(page.stats.length).toBeGreaterThanOrEqual(3);
      expect(page.talks.length).toBeGreaterThanOrEqual(3);
      expect(page.articles.length).toBeGreaterThanOrEqual(2);
      expect(page.ask.length).toBeGreaterThan(20);
      expect(page.heroImage).toMatch(/\.(jpg|jpeg|png)(?:\?|$)/i);
      expect(page.gallery).toHaveLength(4);
    }
  });

  it("covers aging Canada with fertility 1,25 and recent StatCan plus Radio-Canada links", () => {
    const aging = canadaLivePages.find((page) => page.id === "demographie");
    expect(aging?.title).toMatch(/vieill/i);
    expect(aging?.stats.some((stat) => stat.value.includes("1,25"))).toBe(true);
    const urls = aging?.articles.map((article) => article.url) ?? [];
    expect(urls.some((url) => url.includes("statcan.gc.ca"))).toBe(true);
    expect(urls.some((url) => url.includes("radio-canada.ca"))).toBe(true);
  });

  it("anchors overview and jobs pages on official 2025-2026 figures", () => {
    const overview = canadaLivePages.find((page) => page.id === "vue");
    const jobs = canadaLivePages.find((page) => page.id === "emploi");
    expect(overview?.stats.some((stat) => stat.value.includes("380 000"))).toBe(true);
    expect(overview?.stats.some((stat) => stat.value.includes("9 %"))).toBe(true);
    expect(jobs?.stats.some((stat) => stat.value.includes("495 100"))).toBe(true);
    expect(jobs?.articles.some((article) => article.url.includes("statcan.gc.ca"))).toBe(true);
  });

  it("never ships em-dashes in client-facing Canada Live copy", () => {
    const blob = JSON.stringify(canadaLivePages);
    expect(blob).not.toContain("—");
    expect(blob).not.toContain("–");
  });

  it("shows a client-facing overview message instead of a sales script", () => {
    const overview = canadaLivePages.find((page) => page.id === "vue");
    expect(overview?.panelTitle).toBe("Le Canada n'est pas fermé");
    const blob = JSON.stringify(canadaLivePages);
    expect(blob).not.toMatch(/Montrez |dites-le|Ne vendez pas|Proposez /);
  });

  it("adapts hero and gallery photos to each Canada Live page", () => {
    const vue = canadaLivePages.find((page) => page.id === "vue");
    const jobs = canadaLivePages.find((page) => page.id === "emploi");
    const aging = canadaLivePages.find((page) => page.id === "demographie");
    const bridge = canadaLivePages.find((page) => page.id === "pont");
    expect(vue?.gallery.map((item) => item.title)).toEqual(["Québec", "Montréal", "Toronto", "Banff"]);
    expect(jobs?.heroPlace).toBe("Marché du travail");
    expect(jobs?.heroImage).toMatch(/emploi-hero/i);
    expect(jobs?.gallery.map((item) => item.title)).toEqual(["Santé", "Construction", "Bureaux", "Métiers"]);
    expect(aging?.heroPlace).toBe("Relève");
    expect(aging?.gallery.map((item) => item.title)).toEqual(["Aînés", "Famille", "Soins", "École"]);
    expect(bridge?.heroPlace).toBe("Votre projet");
    expect(bridge?.gallery.map((item) => item.title)).toEqual(["Métier", "Ville", "Équipe", "Installation"]);
  });
});

describe("Canada Live layout", () => {
  it("reuses the profil client shell with a photo banner and navy briefing panel", () => {
    expect(feature).toContain("canadaLiveBanner");
    expect(feature).toContain("object-[80%_center]");
    expect(feature).toContain("from-primary/92 via-primary/62 to-primary/20");
    expect(feature).not.toContain("IrShaderGradient");
    expect(feature).not.toContain("HoverRevealCards");
    expect(feature).toContain("PageShell");
    expect(feature).toContain("CanadaBriefingPanel");
    expect(feature).not.toContain('kicker="Canada Live · Vue d’ensemble"');
  });

  it("does not render the page gallery photo strip", () => {
    expect(feature).not.toContain("HoverRevealCards");
    expect(feature).not.toContain("page.gallery");
    expect(feature).not.toContain("canadaPlacesFor()");
    expect(feature).not.toContain("place-strip-wrap");
  });

  it("uses client-facing panel headers, not sales coaching labels", () => {
    expect(feature).toContain("À retenir");
    expect(feature).toContain("Pour votre projet");
    expect(feature).toContain("La question");
    expect(feature).not.toContain("Communication");
    expect(feature).not.toContain("Pendant la rencontre");
    expect(feature).not.toContain("Question à poser");
    expect(feature).toContain("NocSearchField");
    expect(feature).toContain("smart(stat.value, profile)");
    expect(feature).toContain("smart(stat.note, profile)");
    expect(feature).toContain('setProject("workNocCode", suggested)');
    expect(feature).toContain("Province visée");
    expect(feature).toContain('setProject("province", province)');
    expect(feature).toContain("onProvinceChange");
    expect(feature).toContain("page.stats.slice(0, 3)");
    expect(feature).toContain("canadaLivePlaceOptions.map");
    expect(feature).toContain("ALL_CANADA");
    expect(feature).toContain("vue nationale du plan IRCC");
    expect(feature).toContain("livePlace");
  });
});

describe("Canada Live study lens", () => {
  it("keeps four slides and swaps RP stats for student figures", () => {
    const pages = canadaLivePagesFor({ ...defaultProfile, objective: "Études" });
    expect(pages).toHaveLength(4);
    expect(pages[0]?.stats.some((stat) => stat.label.includes("Permis"))).toBe(true);
    expect(pages[0]?.title).toMatch(/études/i);
    expect(JSON.stringify(pages)).not.toContain("—");
    expect(JSON.stringify(pages)).not.toContain("–");
    expect(feature).toContain("canadaLivePagesFor");
    expect(feature).toContain("s.draft");
  });

  it("leaves the default RP briefing unchanged for other objectives", () => {
    const pages = canadaLivePagesFor(defaultProfile);
    expect(pages).toBe(canadaLivePages);
  });
});

describe("Canada Live menu lenses", () => {
  it("overlays work pages with permit, FEER and bridge data", () => {
    const pages = canadaLivePagesFor({
      ...defaultProfile,
      objective: "Travail",
      workNocCode: "21232",
    });

    expect(pages).toHaveLength(4);
    expect(pages).not.toBe(canadaLivePages);
    expect(pages[0]?.title).toMatch(/travail|permis/i);
    expect(pages[0]?.stats.some((stat) => /Permis|FEER/i.test(stat.label))).toBe(true);
    expect(pages[2]?.stats.some((stat) => /EIMT|ouvert/i.test(stat.value) || /EIMT|ouvert/i.test(stat.note))).toBe(true);
    expect(pages[3]?.pills.some((pill) => pill.includes("FEER"))).toBe(true);
    expect(pages[0]?.stats.find((stat) => stat.label === "FEER")?.value).toBe("1");
    expect(pages[0]?.stats.every((stat) => /\d/.test(stat.value))).toBe(true);
    expect(JSON.stringify(pages)).not.toContain("—");
    expect(JSON.stringify(pages)).not.toContain("–");
  });

  it("keeps work pills unique when no CNP is selected", () => {
    const pages = canadaLivePagesFor({
      ...defaultProfile,
      objective: "Travail",
      workNocCode: "",
      applicant: { ...defaultProfile.applicant, profession: "Autre" },
    });

    expect(pages[0]?.pills).toEqual(["Permis de travail"]);
    expect(pages[0]?.stats.find((stat) => stat.label === "FEER")?.value).toBe("n.d.");
  });

  it("fills FEER from the profile profession when the CNP field is empty", () => {
    const pages = canadaLivePagesFor({
      ...defaultProfile,
      objective: "Travail",
      workNocCode: "",
    });

    expect(pages[0]?.stats.find((stat) => stat.label === "FEER")?.value).toBe("1");
    expect(pages[0]?.pills).toContain("CNP · FEER 1");
  });

  it("overlays visit pages with stay-only framing instead of work rights", () => {
    const pages = canadaLivePagesFor({
      ...defaultProfile,
      objective: "Visite",
      visitPurpose: "business",
      visitDuration: "3m",
    });

    expect(pages).toHaveLength(4);
    expect(pages[0]?.title).toMatch(/visite|séjour/i);
    expect(pages[0]?.stats.some((stat) => /visa|eTA/i.test(stat.label) || /visa|eTA/i.test(stat.value))).toBe(true);
    expect(pages[2]?.lead).toContain("pas un droit de travailler");
    expect(pages[3]?.pills).toContain("Voyage d’affaires");
    expect(pages[0]?.stats.every((stat) => /\d/.test(stat.value))).toBe(true);
    expect(pages[0]?.stats.some((stat) => stat.value.includes("100") || /\d/.test(stat.value))).toBe(true);
  });

  it("overlays business pages with C11, provincial paths and the startup pause note", () => {
    const pages = canadaLivePagesFor({
      ...defaultProfile,
      objective: "Affaires",
      businessPath: "c11",
    });

    expect(pages).toHaveLength(4);
    expect(JSON.stringify(pages)).toContain(startupVisaNote);
    expect(pages[0]?.stats.some((stat) => /C11|PNP/i.test(stat.value) || /C11|PNP/i.test(stat.note))).toBe(true);
    expect(pages[2]?.title).toMatch(/projet|capital|crédible/i);
    expect(pages[3]?.pills).toContain("C11");
    expect(pages[0]?.stats.every((stat) => /\d/.test(stat.value))).toBe(true);
    expect(pages[0]?.stats.some((stat) => /C11|PNP/i.test(stat.label) || /C11|PNP/i.test(stat.note))).toBe(true);
  });

  it("recomputes C11 and PNP capital when the profile province changes", () => {
    const quebec = canadaLivePagesFor({
      ...defaultProfile,
      objective: "Affaires",
      businessPath: "c11",
      province: "Québec",
    });
    const ontario = canadaLivePagesFor({
      ...defaultProfile,
      objective: "Affaires",
      businessPath: "c11",
      province: "Ontario",
    });

    const quebecC11 = quebec[0]?.stats.find((stat) => stat.label === "Capital C11")?.value;
    const ontarioC11 = ontario[0]?.stats.find((stat) => stat.label === "Capital C11")?.value;
    const quebecPnp = quebec[0]?.stats.find((stat) => stat.label === "PNP entrepreneur")?.value;
    const ontarioPnp = ontario[0]?.stats.find((stat) => stat.label === "PNP entrepreneur")?.value;

    expect(quebecC11).toBeDefined();
    expect(ontarioC11).toBeDefined();
    expect(quebecC11).not.toBe(ontarioC11);
    expect(quebecPnp).not.toBe(ontarioPnp);
  });

  it("overlays family pages with family category and reunification-first copy", () => {
    const pages = canadaLivePagesFor({
      ...defaultProfile,
      objective: "Regroupement familial",
      familyLink: "parent",
    });

    expect(pages).toHaveLength(4);
    expect(pages[0]?.title).toMatch(/famille|familial|regroupement/i);
    expect(pages[0]?.stats.some((stat) => /catégorie|conjoint|parents/i.test(stat.label) || /conjoint|parents/i.test(stat.note))).toBe(true);
    expect(pages[2]?.stats.some((stat) => /Québec|QC/i.test(stat.value) || /Québec|QC/i.test(stat.note))).toBe(true);
    expect(pages[3]?.pills).toContain("Parent");
    expect(pages[0]?.stats.some((stat) => stat.value.includes("84 000") || stat.value.includes("22 %"))).toBe(true);
    expect(pages[0]?.stats.every((stat) => /\d/.test(stat.value))).toBe(true);
  });
});

describe("Canada Live province lens", () => {
  it("puts Tout le Canada first in the Canada Live selector, without replacing the profile list", () => {
    expect(canadaLivePlaceOptions[0]).toBe(ALL_CANADA);
    expect(canadaLivePlaceOptions).toContain("Manitoba");
    expect(canadaLivePlaceOptions).toContain("Québec");
  });

  it("keeps the national RP briefing on Tout le Canada", () => {
    const pages = canadaLivePagesFor(defaultProfile, ALL_CANADA);
    expect(pages).toBe(canadaLivePages);
    expect(pages[0]?.stats.some((stat) => stat.value.includes("380 000"))).toBe(true);
    expect(pages[0]?.stats.some((stat) => stat.value.includes("9 %"))).toBe(true);
  });

  it("rebuilds stats, talks, articles and hero when a province is selected", () => {
    const manitoba = canadaLivePagesFor(defaultProfile, "Manitoba");
    const quebec = canadaLivePagesFor(defaultProfile, "Québec");
    const ontario = canadaLivePagesFor(defaultProfile, "Ontario");

    expect(manitoba).not.toBe(canadaLivePages);
    expect(manitoba[0]?.stats.some((stat) => stat.label === "Admissions RP prévues")).toBe(true);
    expect(manitoba[0]?.stats.some((stat) => stat.label === "Part économique visée")).toBe(true);
    expect(manitoba[0]?.stats.some((stat) => stat.label === "Francophones hors Québec")).toBe(true);
    expect(quebec[0]?.stats.some((stat) => stat.label === "Francophones hors Québec")).toBe(true);
    expect(manitoba[0]?.stats.some((stat) => stat.label === "Postes vacants")).toBe(false);
    expect(quebec[0]?.stats.some((stat) => stat.label === "Postes vacants")).toBe(false);
    expect(quebec[0]?.stats.find((stat) => stat.label === "Francophones hors Québec")?.note).toMatch(/français structure/i);
    expect(manitoba[2]?.stats.find((stat) => stat.label === "Postes vacants")?.value).toBe(
      String(provinceData.MB.vacancies).replace(/\B(?=(\d{3})+(?!\d))/g, " "),
    );
    expect(manitoba[2]?.stats.find((stat) => stat.label === "Postes vacants")?.value).not.toBe(
      quebec[2]?.stats.find((stat) => stat.label === "Postes vacants")?.value,
    );
    expect(manitoba[3]?.stats.some((stat) => stat.label === "Chômage local")).toBe(false);
    expect(manitoba[3]?.stats.some((stat) => stat.label === "Postes encore vacants")).toBe(false);
    expect(manitoba[3]?.stats.some((stat) => stat.label === "Places RP encore ouvertes")).toBe(true);
    expect(JSON.stringify(manitoba)).not.toContain("118 700");
    expect(JSON.stringify(manitoba)).not.toContain("radio-canada.ca");
    expect(JSON.stringify(quebec)).toContain("radio-canada.ca");
    expect(manitoba[0]?.heroImage).not.toBe(ontario[0]?.heroImage);
    expect(quebec[0]?.heroPlace).toBe("Québec");
    expect(ontario[0]?.heroPlace).toBe("Toronto");
    expect(JSON.stringify(manitoba)).not.toContain("—");
    expect(JSON.stringify(manitoba)).not.toContain("–");
    expect(JSON.stringify(quebec)).not.toContain("—");
    expect(JSON.stringify(quebec)).not.toContain("–");
  });

  it("keeps Études and Travail pathway labels when the province changes", () => {
    const study = { ...defaultProfile, objective: "Études" as const };
    const work = { ...defaultProfile, objective: "Travail" as const };
    const studyMb = canadaLivePagesFor(study, "Manitoba");
    const studyQc = canadaLivePagesFor(study, "Québec");
    const studyAll = canadaLivePagesFor(study, ALL_CANADA);
    const workMb = canadaLivePagesFor(work, "Manitoba");
    const workQc = canadaLivePagesFor(work, "Québec");

    expect(studyAll[0]?.stats.some((stat) => stat.label === "Permis d'études actifs")).toBe(true);
    expect(studyMb[0]?.stats.some((stat) => stat.label === "Permis d'études actifs")).toBe(true);
    expect(studyQc[0]?.stats.some((stat) => stat.label === "Permis d'études actifs")).toBe(true);
    expect(studyMb[0]?.stats.some((stat) => stat.label === "Postes vacants")).toBe(false);
    expect(studyMb[0]?.title).toMatch(/Manitoba|Manitoba reste|Manitoba /i);
    expect(workMb[0]?.stats.some((stat) => stat.label === "Délai permis")).toBe(true);
    expect(workQc[0]?.stats.some((stat) => stat.label === "Délai permis")).toBe(true);
    expect(workMb[0]?.stats.some((stat) => stat.label === "Postes vacants")).toBe(false);
    expect(studyMb[0]?.stats[0]?.note).toMatch(/Manitoba|ancré/i);
    expect(studyQc[0]?.stats[0]?.note).not.toBe(studyMb[0]?.stats[0]?.note);
  });

  it("leaves Affaires capital thresholds alone instead of swapping them for market stats", () => {
    const business = { ...defaultProfile, objective: "Affaires" as const, province: "Ontario" };
    const pages = canadaLivePagesFor(business, "Manitoba");
    expect(pages[0]?.stats.some((stat) => stat.label.includes("Capital") || stat.label.includes("PNP"))).toBe(true);
    expect(pages[0]?.stats.some((stat) => stat.label === "Postes vacants")).toBe(false);
  });
});
