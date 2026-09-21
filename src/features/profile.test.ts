import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const source = readFileSync(join(dirname(fileURLToPath(import.meta.url)), "profile.tsx"), "utf8");

function extractFunction(name: string) {
  const start = source.indexOf(`function ${name}`);
  expect(start).toBeGreaterThan(-1);
  const next = source.indexOf("\nfunction ", start + 1);
  return source.slice(start, next === -1 ? undefined : next);
}

describe("profile shader banners", () => {
  it("uses a photo banner on the Profil client page header", () => {
    const form = extractFunction("ProfileForm");
    expect(form).toContain("personHeroImage(principal)");
    expect(form).toContain("bg-linear-to-r from-primary/92 via-primary/62 to-primary/20");
    expect(form).not.toContain("<IrShaderGradient");
    expect(form).not.toContain("pitchHeroImage");
    expect(form).not.toContain("sectionBanners");
  });

  it("paints Candidat and Conjoint headers with a profile photo and a blue gradient", () => {
    const personCard = extractFunction("PersonCard");
    expect(source).toContain("personHeroImage");
    expect(personCard).toContain("personHeroImage(member)");
    expect(personCard).toContain("object-cover object-[80%_center]");
    expect(personCard).toContain("bg-linear-to-r from-primary/92 via-primary/62 to-primary/20");
    expect(personCard).not.toContain("<IrBlueSign");
    expect(personCard).not.toContain("<IrShaderGradient");
  });

  it("keeps the person card border outside the photo overflow clip", () => {
    const personCard = extractFunction("PersonCard");
    expect(personCard).toContain('<Surface className={cn("flex h-full flex-col p-0 transition duration-200"');
    expect(personCard).not.toMatch(/<Surface className=\{cn\("[^"]*(overflow-hidden|@container)/);
    expect(personCard).toContain("@container flex min-h-0 flex-1 flex-col overflow-hidden rounded-[1.2rem]");
    expect(personCard).toContain("rounded-t-[1.2rem]");
    expect(personCard).toContain("absolute inset-0 z-0 size-full object-cover");
  });

  it("exposes a polygamous household with two wife cards", () => {
    expect(source).toContain('label: "Couple"');
    expect(source).toContain("simple");
    expect(source).not.toContain('label: "Polygame"');
    expect(source).toContain("Épouse 1");
    expect(source).toContain("Épouse ${index + 2}");
    expect(source).toContain("Le Canada ne reconnaît qu’un conjoint");
  });
});

describe("principal mode chips", () => {
  it("stretches Auto / applicant / spouse chips to the Profil retenu width", () => {
    const panel = extractFunction("PrincipalPanel");
    expect(panel).toContain("grid w-full");
    expect(panel).toContain("modeCols");
    expect(panel).toContain('className="w-full min-w-0 justify-center"');
  });

  it("lets Chip accept a className so mode chips can fill their column", () => {
    const chip = extractFunction("Chip");
    expect(chip).toContain("className?: string");
    expect(chip).toMatch(/cn\([\s\S]*className\s*\)/);
    expect(chip).toContain("ir-option-btn");
    expect(chip).toContain("rounded-lg");
    expect(chip).not.toContain("rounded-full");
    expect(chip).not.toContain("whitespace-nowrap");
  });
});

describe("principal panel scroll", () => {
  it("scrolls the inner column without a visible scrollbar", () => {
    const panel = extractFunction("PrincipalPanel");
    expect(panel).toContain(
      "relative mt-3 flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden",
    );
    expect(panel).not.toContain("[scrollbar-width:thin]");
    expect(panel).not.toContain("[scrollbar-gutter:stable]");
  });
});

describe("person card scroll", () => {
  it("scrolls the form body without a visible scrollbar", () => {
    const personCard = extractFunction("PersonCard");
    expect(personCard).toContain(
      "grid min-h-0 min-w-0 flex-1 content-start gap-2 overflow-y-auto p-3 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden",
    );
    expect(personCard).not.toContain("[scrollbar-width:thin]");
    expect(personCard).not.toContain("[scrollbar-gutter:stable]");
  });
});

describe("profile places strip", () => {
  it("does not show Canada landmark cards under the form", () => {
    const form = extractFunction("ProfileForm");
    expect(form).not.toContain("HoverRevealCards");
    expect(form).not.toContain("canadaPlacesFor");
    expect(form).not.toContain("place-strip-wrap");
  });
});

describe("profile form column scroll", () => {
  it("uses PageShell for the two-pane layout instead of a local overflow grid", () => {
    const form = extractFunction("ProfileForm");
    expect(form).toContain("<PageShell");
    expect(form).not.toContain("xl:overflow-y-auto");
    expect(form).not.toContain("xl:grid-cols-[minmax(0,1fr)_300px]");
  });
});

describe("principal panel background", () => {
  it("uses a Canada photo behind the navy overlay on PrincipalPanel", () => {
    expect(source).toContain('import canadaBanner from "@/assets/banners/canada.jpg"');
    const panel = extractFunction("PrincipalPanel");
    expect(panel).toContain("src={canadaBanner}");
    expect(panel).toContain("absolute inset-0 size-full object-cover object-[center_30%]");
    expect(panel).toContain("bg-linear-to-br from-primary/90 via-primary/82 to-ir-deep/88");
    expect(panel).not.toContain("bg-linear-to-br from-primary to-ir-deep p-4");
  });
});

describe("principal panel readability", () => {
  it("uses larger, higher-contrast type on PrincipalPanel copy", () => {
    const panel = extractFunction("PrincipalPanel");
    expect(panel).toContain(
      "text-[12px] font-semibold tracking-[0.16em] text-white/85 uppercase",
    );
    expect(panel).toContain("text-[24px] leading-none font-semibold tracking-tight");
    expect(panel).toContain("mt-1 text-[14px] text-white/85");
    expect(panel).toContain("mt-3 shrink-0 text-[14px] leading-snug text-white/90");
    expect(panel).toContain("text-[14px] leading-relaxed text-white/85");
    expect(panel).toContain("pt-0.5 text-[14px] font-semibold text-white");
    expect(panel).toContain("pt-0.5 text-[14px] text-white/85");
  });

  it("uses larger, higher-contrast type on PanelBlock, FactRow, ScoreBar, and ScorePick", () => {
    expect(extractFunction("PanelBlock")).toContain(
      "text-[12px] font-semibold tracking-[0.14em] text-white/80 uppercase",
    );
    expect(extractFunction("FactRow")).toContain("shrink-0 text-[13px] text-white/80");
    expect(extractFunction("FactRow")).toContain("text-right text-[14px] leading-tight font-medium");
    expect(extractFunction("ScoreBar")).toContain(
      "mb-0.5 flex items-center justify-between text-[12px] text-white/80",
    );
    expect(extractFunction("ScorePick")).toContain(
      "mt-1 block w-full truncate text-[13px] tracking-wide uppercase opacity-75",
    );
  });
});

describe("country of origin flags", () => {
  it("shows a flag next to the selected country and each option", () => {
    const select = extractFunction("CountrySelect");
    expect(select).toContain("<CountryFlag country={value} eager");
    expect(select).toContain("<CountryFlag country={option}");
  });

  it("places a compact waving flag to the right of the country select", () => {
    const form = extractFunction("ProfileForm");
    expect(form).toContain("<CountryHeroFlag country={draft.country} />");
    expect(form).toContain("mt-1.5 flex items-center gap-2");
    expect(form).toContain("min-w-0 flex-1");
    const hero = extractFunction("CountryHeroFlag");
    expect(hero).toContain("countryFlagHeroUrl");
    expect(hero).toContain("ir-flag-wave");
    expect(hero).toContain("key={country}");
    expect(hero).toContain("h-8 w-[4.5rem]");
  });
});

describe("adult sex field", () => {
  it("lets each PersonCard pick Femme or Homme", () => {
    const personCard = extractFunction("PersonCard");
    expect(personCard).toContain('label="Sexe"');
    expect(personCard).toContain("member.sex");
    expect(personCard).toContain("SexPicks");
    expect(personCard).toContain("onChange({ sex:");
    const sexPicks = extractFunction("SexPicks");
    expect(sexPicks).toContain("sexes");
    expect(sexPicks).toContain('role="radio"');
  });

  it("lets each PersonCard type a métier and secteur", () => {
    const personCard = extractFunction("PersonCard");
    expect(personCard).toContain('label="Métier"');
    expect(personCard).toContain('label="Secteur"');
    expect(personCard).toContain("OccupationSearchField");
    expect(personCard).not.toContain('label="Profession"');
    expect(personCard).not.toContain("options={professions}");
  });

  it("hides Portrait picks from each PersonCard", () => {
    const personCard = extractFunction("PersonCard");
    expect(personCard).not.toContain('label="Portrait"');
    expect(personCard).not.toContain("AppearancePicks");
    expect(personCard).not.toContain("onChange({ look:");
  });
});

describe("study program fields", () => {
  it("hides study program closing fields on the Africa simplified profil", () => {
    const form = extractFunction("ProfileForm");
    expect(form).not.toContain("applicantStudy");
    expect(form).toContain("simple");
    const personCard = extractFunction("PersonCard");
    expect(personCard).toContain("simple");
    expect(personCard).toContain("!simple && study");
  });
});

describe("closing profile objective fields", () => {
  it("keeps IRCC closing fields offline from the Africa profil UI", () => {
    const form = extractFunction("ProfileForm");
    expect(form).not.toContain("applicantWork");
    expect(form).not.toContain("applicantVisit");
    expect(form).not.toContain("applicantBusiness");
    expect(form).not.toContain("applicantFamily");
    expect(form).toContain("simple");
    expect(form).toContain("Profil simplifié");
  });

  it("still ships PersonCard closing helpers for offline reuse", () => {
    const personCard = extractFunction("PersonCard");
    expect(personCard).toContain("WorkFields");
    expect(personCard).toContain("VisitFields");
    expect(personCard).toContain("BusinessFields");
    expect(personCard).toContain("FamilyFields");
    expect(personCard).toContain("!simple && work");
  });
});

describe("principal panel provincial lever", () => {
  it("shows a linguistic qualification lever instead of salary vs local median", () => {
    const panel = extractFunction("PrincipalPanel");
    expect(panel).toContain("provinceLever");
    expect(panel).toContain("lever.requirementLabel");
    expect(panel).toContain("lever.candidateLabel");
    expect(panel).toContain("lever.verdict");
    expect(panel).not.toContain("Médiane locale");
    expect(panel).not.toContain("salaryForProfession");
    expect(panel).not.toContain("salaryLift");
    expect(panel).not.toContain("financialCapacityAmount");
  });
});

describe("profile file import and export", () => {
  it("places Importer un profil client above Enregistrer", () => {
    const panel = extractFunction("PrincipalPanel");
    const importAt = panel.indexOf("Importer un profil client");
    const saveAt = panel.indexOf("Enregistrer");
    expect(importAt).toBeGreaterThan(-1);
    expect(saveAt).toBeGreaterThan(importAt);
    expect(panel).toContain('type="file"');
    expect(panel).toContain('accept=".json,application/json"');
    expect(panel).toContain('className="hidden"');
    expect(panel).toContain('aria-label="Importer un profil client"');
    expect(panel).toContain("Upload");
    expect(panel).toContain("Importé");
    expect(panel).toContain("importError");
    expect(panel).toContain("text-[#ffd4d4]");
  });

  it("downloads a portable profile file on save", () => {
    const form = extractFunction("ProfileForm");
    expect(form).toContain("serializeProfileFile");
    expect(form).toContain("profileFileName");
    expect(form).toContain("parseProfileFile");
    expect(form).toContain("importDraft");
    expect(form).toContain("downloadJson");
    expect(form).toContain("useProfileStore.getState().draft");
    expect(source).toContain("function downloadJson");
    expect(source).toContain('type: "application/json"');
    expect(source).toContain("document.body.appendChild");
  });
});

describe("option grid alignment", () => {
  it("uses ir-option-grid and ir-option-btn for adult sex and language picks", () => {
    const sex = extractFunction("SexPicks");
    const language = extractFunction("LanguagePicks");

    for (const fn of [sex, language]) {
      expect(fn).toContain("ir-option-grid");
      expect(fn).toContain("ir-option-btn");
      expect(fn).not.toContain("grid-cols-2");
      expect(fn).not.toContain("grid-cols-3");
      expect(fn).not.toContain("h-8");
      expect(fn).not.toContain("text-[10px]");
    }
    expect(language).toContain('--ir-option-min": "7rem"');
    expect(language).toContain("ir-option-grid--max-3");
    expect(sex).not.toContain("ir-option-grid--max-3");
    expect(source).not.toContain("function AppearancePicks");
  });

  it("lets the couple cards grow so their bottoms can meet the principal panel", () => {
    const form = extractFunction("ProfileForm");
    expect(form).toContain("grid flex-1 items-stretch gap-3 min-w-0");
    expect(form).toContain("grid flex-1 gap-3");
    expect(form).toContain('<div className="h-full min-h-0">');
    expect(form).toContain("ir-rise h-full min-h-0");
    expect(form).not.toContain("grid shrink-0 items-stretch gap-3 min-w-0");
    expect(form).not.toContain('<div className="grid shrink-0 gap-3">');
  });

  it("uses the responsive option grid for the family tiles instead of hard-coded grid-cols breakpoints", () => {
    const form = extractFunction("ProfileForm");
    const familyBlockStart = form.indexOf("Situation familiale");
    expect(familyBlockStart).toBeGreaterThan(-1);
    const familyBlock = form.slice(familyBlockStart, form.indexOf("Objectif", familyBlockStart));

    expect(familyBlock).toContain("familyTiles");
    expect(familyBlock).toContain("ir-option-grid");
    expect(familyBlock).toContain('--ir-option-min": "6.5rem"');
    expect(familyBlock).not.toContain("min-[420px]:grid-cols-3");
  });

  it("aligns Objectif and Destination chips in an option grid with full-width chips", () => {
    const form = extractFunction("ProfileForm");

    const objectifStart = form.indexOf(">Objectif<");
    const destinationStart = form.indexOf(">Destination<", objectifStart);
    const originStart = form.indexOf(">Pays d'origine<", destinationStart);

    expect(objectifStart).toBeGreaterThan(-1);
    expect(destinationStart).toBeGreaterThan(-1);
    expect(originStart).toBeGreaterThan(-1);

    const objectifBlock = form.slice(objectifStart, destinationStart);
    const destinationBlock = form.slice(destinationStart, originStart);
    const originBlock = form.slice(originStart, form.indexOf("</Surface>", originStart));

    expect(objectifBlock).toContain("ir-option-grid");
    expect(objectifBlock).toContain('--ir-option-min": "7.5rem"');
    expect(destinationBlock).toContain("ir-option-grid");
    expect(form).toContain("grid items-start gap-3 @min-[36rem]:grid-cols-2");
    expect(form).not.toContain("@min-[54rem]:grid-cols-[minmax(0,1.2fr)_minmax(0,0.95fr)_minmax(9.25rem,10.5rem)]");
    expect(destinationBlock).not.toContain("flex-1 flex-col justify-center");
    expect(originBlock).toContain("mt-1.5 flex items-center gap-2");
    expect(originBlock).not.toContain("flex-1 items-center");

    for (const block of [objectifBlock, destinationBlock]) {
      expect(block).toContain('className=\"w-full min-w-0 justify-center\"');
      expect(block).not.toContain("flex flex-wrap");
    }
  });

  it("prevents Candidat and Conjoint cards from overflowing their grid at @min-[34rem]:grid-cols-2", () => {
    const form = extractFunction("ProfileForm");
    const personCard = extractFunction("PersonCard");
    const surface = extractFunction("Surface");

    expect(form).toContain("@min-[34rem]:grid-cols-2");
    expect(form).toContain("min-w-0");
    expect(form).toContain("ir-rise h-full min-h-0");
    expect(personCard).toContain("min-w-0");
    expect(personCard).toContain("flex h-full flex-col");
    expect(surface).toContain("min-w-0");
  });

  it("stretches family ChoiceTile buttons and constrains the polygamous spouse grid", () => {
    const choiceTile = extractFunction("ChoiceTile");
    expect(choiceTile).toContain("w-full min-w-0");

    const form = extractFunction("ProfileForm");
    const spousesStart = form.indexOf(">Épouses<");
    expect(spousesStart).toBeGreaterThan(-1);
    const polygamousGrid = form.slice(spousesStart, form.indexOf("title=\"Épouse 1\"", spousesStart));
    expect(polygamousGrid).toContain("min-w-0");
    expect(polygamousGrid).toContain("ir-rise grid min-h-0");
  });
});

