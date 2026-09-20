import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { MapPin } from "lucide-react";
import { describe, expect, it } from "vitest";
import { sections } from "@/catalog";

const source = readFileSync(join(dirname(fileURLToPath(import.meta.url)), "market.tsx"), "utf8");

function extractFunction(name: string) {
  const start = source.indexOf(`function ${name}`);
  expect(start).toBeGreaterThan(-1);
  const nextFunction = source.indexOf("\nfunction ", start + 1);
  const nextExportFunction = source.indexOf("\nexport function ", start + 1);
  const candidates = [nextFunction, nextExportFunction].filter((index) => index !== -1);
  const next = candidates.length > 0 ? Math.min(...candidates) : -1;
  return source.slice(start, next === -1 ? undefined : next);
}

describe("opportunities catalog", () => {
  it("keeps three opportunity slides", () => {
    expect(sections.find((section) => section.id === "opportunites")?.slideCount).toBe(3);
  });
});

describe("opportunities chrome", () => {
  it("reuses the profil client shell on OpportunitiesSection", () => {
    expect(source).toContain("export function OpportunitiesSection");
    expect(source).toContain("householdMarket");
    expect(source).toContain("sectionBanners.opportunities");
    expect(source).toContain("BrandLogo");
    expect(source).toContain("PageShell");
    expect(source).not.toContain("xl:grid-cols-[minmax(0,1fr)_300px]");
    expect(source).toContain("bg-linear-to-br from-primary to-ir-deep");
    expect(source).toContain("Lecture marché");
    expect(source).not.toContain("Rechercher");
  });

  it("does not add Canada places cards to opportunities", () => {
    const section = extractFunction("OpportunitiesMarket");
    expect(section).not.toContain("HoverRevealCards");
    expect(section).not.toContain("canadaPlacesFor");
  });
});

describe("opportunities household fields", () => {
  it("shows editable métier, secteur and salary band fields on PersonMarketCard", () => {
    const card = extractFunction("PersonMarketCard");
    expect(source).toContain("personHeroImage");
    expect(card).toContain("personHeroImage(adult.member)");
    expect(card).toContain("object-cover object-[80%_center]");
    expect(card).toContain("bg-linear-to-r from-primary/92 via-primary/62 to-primary/20");
    expect(card).not.toContain("<IrBlueSign");
    expect(card).not.toContain("<IrShaderGradient");
    expect(card).toContain('label="Métier"');
    expect(card).toContain('label="Secteur"');
    expect(card).toContain("OccupationSearchField");
    expect(card).not.toContain('label="Offres"');
    expect(card).toContain('label="Bas"');
    expect(card).toContain('label="Médian"');
    expect(card).toContain('label="Élevé"');
    expect(card).toContain("adult.member.profession");
    expect(card).toContain("adult.member.sector");
    expect(card).toContain("onSelect");
    expect(card).toContain("aria-pressed={adult.selected}");
    expect(card).toContain("min-w-0");
    expect(card).toContain("onChange");
    expect(card).toContain("occupationLocked");
  });

  it("renders adult market cards, a spouse grid, and a children strip", () => {
    const market = extractFunction("OpportunitiesMarket");
    expect(market).toContain("PersonMarketCard");
    expect(market).toContain("occupationLocked");
    expect(market).toContain("@min-[34rem]:grid-cols-2");
    expect(market).toContain("Enfants");
    expect(market).toContain("market.polygamous");
    expect(market).toContain("setPrincipalMode");
    expect(market).toContain("onSelect={() => setPrincipalMode(adult.role)}");
    expect(source).toContain("Le Canada ne reconnaît qu’un conjoint");
    expect(source).toContain("Avantages sociaux");
    expect(source).not.toContain('label="Offres"');
  });

  it("chooses the foyer label from the accompanying adult in polygamy", () => {
    const panel = extractFunction("MarketPanel");
    expect(panel).toContain('market.accompanying?.role === "applicant"');
    expect(panel).toContain("ProfessionPhotos");
    expect(panel).toContain("market.principal.member.profession");
    expect(extractFunction("ProfessionPhotos")).not.toContain("grid-cols-2");
    expect(extractFunction("ProfessionPhotos")).toContain("professionPhotosFor(profession, sex)[0]");
  });
});

describe("opportunities later slides", () => {
  it("keeps score ranking and transition destinations inside the same shell", () => {
    expect(source).toContain("Où viser");
    expect(source).toContain("Ensuite");
    expect(source).toContain('id: "emplois"');
    expect(source).toContain("Voies d’immigration");
  });

  it("fills the Où viser panel with a profile ad", () => {
    const score = extractFunction("OpportunitiesScore");
    expect(score).toContain("profileAdFor");
    expect(score).toContain("ad={ad}");
    expect(extractFunction("OpportunitiesNext")).not.toContain("profileAdFor");
    const talk = extractFunction("MarketTalk");
    expect(talk).toContain("ad.headline");
    expect(talk).toContain("ad.image");
    expect(talk).toContain("ad.prompt");
    expect(talk).toContain("bg-linear-to-t from-ir-navy");
  });
});

describe("opportunities prospect copy", () => {
  it("addresses opportunity talks to the prospect", () => {
    expect(source).toContain("Voici ce que le marché dit des métiers du foyer, aujourd’hui.");
    expect(source).toContain("Où votre profil semble-t-il le plus intéressant ?");
    expect(source).toContain("Le marché est là. Voyons la suite.");
    expect(source).toContain("Les postes, les salaires et les procédures qui correspondent à votre profil.");
  });

  it("keeps coaching copy out of opportunity slides", () => {
    for (const name of ["OpportunitiesMarket", "OpportunitiesScore", "OpportunitiesNext"]) {
      const chunk = extractFunction(name);
      expect(chunk).not.toContain("Le commercial");
      expect(chunk).not.toContain("le prospect");
      expect(chunk).not.toContain("Prouver avant de vendre");
    }
  });

  it("branches work benefits away from visit and visitor-business files", () => {
    const chunk = extractFunction("OpportunitiesMarket");
    expect(chunk).toContain('profile.objective === "Visite"');
    expect(chunk).toContain('profile.objective === "Affaires"');
    expect(chunk).toContain('profile.businessPath === "visitor"');
    expect(chunk).toContain("Un visa visiteur autorise le séjour, pas un emploi.");
    expect(chunk).toContain("Pas d’études sans permis d’études.");
    expect(chunk).toContain("Le conjoint voyage comme visiteur, pas comme travailleur.");
    expect(chunk).toContain("Le projet doit être crédible ici.");
    expect(chunk).toContain("<WorkBenefitsSection");
  });

  it("stretches Avantages sociaux to the Lecture marché bottom edge", () => {
    const benefits = extractFunction("WorkBenefitsSection");
    expect(benefits).toContain('<Surface className="flex min-h-0 flex-1 flex-col p-3 sm:px-4 sm:py-3">');
    expect(benefits).not.toContain('<Surface className="shrink-0');
    expect(extractFunction("OpportunitiesMarket")).toContain(
      '<Surface className="flex min-h-0 flex-1 flex-col p-3 sm:px-4 sm:py-3">',
    );
  });
});

describe("provinces catalog", () => {
  it("keeps two province slides", () => {
    expect(sections.find((section) => section.id === "provinces")?.slideCount).toBe(2);
  });

  it("uses a city pin instead of a folded map in the nav", () => {
    expect(sections.find((section) => section.id === "provinces")?.icon).toBe(MapPin);
  });
});

describe("provinces chrome", () => {
  it("reuses the profil client shell on ProvincesSection", () => {
    expect(source).toContain("export function ProvincesSection");
    expect(source).toContain("livingBasket");
    expect(source).toContain("Combien reste-t-il une fois la ville payée ?");
    expect(source).toContain("Logement, épicerie, transport, services du foyer. Ce qui reste décide si la ville tient.");
    expect(source).toContain("defaultProvinceCode");
    expect(source).toContain("La même vie ne coûte pas le même prix.");
    expect(source).toContain("Trois villes maximum. Celle qui laisse un reste rend le projet possible.");
  });

  it("keeps coaching copy out of Provinces helpers", () => {
    for (const name of ["ProvincesSection", "ProvincesEstimator", "ProvincesCompare"]) {
      const chunk = extractFunction(name);
      expect(chunk).not.toContain("Le commercial");
      expect(chunk).not.toContain("version connectée");
      expect(chunk).not.toContain("panel=");
    }
  });

  it("adds a visit pill on province slides", () => {
    expect(extractFunction("ProvincesEstimator")).toContain('"Visite"');
    expect(extractFunction("ProvincesCompare")).toContain('"Visite"');
  });
});

describe("provinces cost of living boards", () => {
  it("renders an estimator basket and a three-city comparator", () => {
    expect(source).toContain("Panier mensuel");
    expect(source).toContain("Net du foyer");
    expect(source).toContain("Reste estimatif");
    expect(source).toContain("Garde d’enfants");
    expect(source).toContain("Choisissez jusqu’à trois villes pour comparer.");
    expect(source).toContain("defaultCompareIds");
    expect(source).toContain("Estimation de démonstration.");
    expect(extractFunction("ProvincesEstimator")).toContain("LivingMoneyField");
    expect(extractFunction("ProvincesEstimator")).toContain("withLivingOverrides");
    expect(extractFunction("ProvincesEstimator")).toContain('label="Net du foyer"');
    expect(extractFunction("ProvincesEstimator")).toContain("{money(basket.total)}");
    expect(extractFunction("ProvincesEstimator")).toContain("{money(basket.remainder)}");
  });

  it("filters compare city chips by the selected province instead of dumping the national list", () => {
    const compare = extractFunction("ProvincesCompare");
    expect(compare).toContain("citiesForProvince");
    expect(compare).toContain("compareIdsForProvince");
    expect(compare).toContain("nextCompareSelected");
    expect(compare).not.toContain("if (current.length >= 3) return current");
    expect(compare).not.toMatch(/livingCities\.map/);
  });

  it("uses a photo banner on every market shell, like the cost-of-living page", () => {
    const shell = extractFunction("OpportunitiesShell");
    expect(source).toContain('from "@/data/section-banners"');
    expect(extractFunction("ProvincesEstimator")).toContain("hero={sectionBanners.provinces}");
    expect(extractFunction("ProvincesCompare")).toContain("hero={sectionBanners.provinces}");
    expect(extractFunction("OpportunitiesMarket")).toContain("hero={sectionBanners.opportunities}");
    expect(extractFunction("JobsToday")).toContain("hero={sectionBanners.jobs}");
    expect(extractFunction("SalariesBands")).toContain("hero={sectionBanners.salaries}");
    expect(extractFunction("CalculatorsNet")).toContain("hero={sectionBanners.calculators}");
    expect(shell).toMatch(/<img[\s\S]*src=\{hero\}/);
    expect(shell).not.toContain("IrShaderGradient");
    expect(shell).toContain("PageShell");
    expect(shell).not.toContain("xl:h-full");
  });
});

describe("jobs catalog", () => {
  it("keeps two employment slides", () => {
    expect(sections.find((section) => section.id === "emplois")?.slideCount).toBe(2);
  });
});

describe("jobs chrome", () => {
  it("reuses the profil client shell on JobsSection", () => {
    expect(source).toContain("export function JobsSection");
    expect(source).toContain("householdDemand");
    expect(source).toContain("Le marché cherche votre métier. Voici où.");
    expect(source).toContain("Le taux de demande par ville. Ça, c’est la pression réelle, pas une liste d’offres.");
    expect(source).toContain("Une part de cette demande se remplit depuis l’étranger.");
  });

  it("reframes visit and family jobs copy around status first", () => {
    expect(source).toContain("pas un droit de travailler");
    expect(source).toContain("La réunification passe d’abord.");
    expect(source).toContain("Le métier reste un plan B si le projet ne tient pas.");
    expect(extractFunction("JobsToday")).toContain('"Pas un droit de travailler"');
    expect(extractFunction("JobsIntl")).toContain('"Pas un droit de travailler"');
  });

  it("keeps coaching copy out of JobsSection and jobs chrome helpers", () => {
    const jobs = extractFunction("JobsSection");
    expect(jobs).not.toContain("Le commercial");
    expect(jobs).not.toContain("version connectée");

    for (const name of ["JobsToday", "JobsIntl"]) {
      const chunk = extractFunction(name);
      expect(chunk).not.toContain("Le commercial");
      expect(chunk).not.toContain("version connectée");
    }
  });
});

describe("jobs household boards", () => {
  it("renders demand charts and place filters per adult group", () => {
    expect(source).toContain("DemandBoard");
    expect(source).toContain("Taux de demande");
    expect(source).toContain("Toutes les provinces");
    expect(source).toContain("Toutes les villes");
    expect(extractFunction("JobsFilters")).toContain("Province");
    expect(extractFunction("JobsFilters")).toContain("Ville");
  });

  it("hides the briefing panel on both jobs slides", () => {
    expect(source).not.toContain("JobsBriefingPanel");
    expect(source).not.toContain("À retenir");
    for (const name of ["JobsToday", "JobsIntl"]) {
      const chunk = extractFunction(name);
      expect(chunk).not.toContain("panel=");
    }
  });

  it("lets demand cards grow with their city lists instead of clipping leftover viewport", () => {
    const board = extractFunction("DemandBoard");
    expect(board).not.toContain("min-h-0 flex-1");
    expect(board).not.toContain("flex-1");
    expect(board).toContain("cn(");
    expect(board).toContain('groups.length > 1 && "@min-[48rem]:grid-cols-2"');
    expect(board).toContain("@container");
    expect(board).toContain("@min-[24rem]:flex-row");
    expect(extractFunction("DemandBars")).toContain("minmax(0,1fr)");
    expect(extractFunction("DemandBars")).toContain("max-h-[min(50vh,28rem)]");
    expect(extractFunction("DemandBars")).toContain("overflow-y-auto");
    expect(extractFunction("DemandBars")).toContain("[scrollbar-width:none]");
    expect(extractFunction("DemandBars")).toContain("[-ms-overflow-style:none]");
    expect(extractFunction("DemandBars")).toContain("[&::-webkit-scrollbar]:hidden");
    expect(extractFunction("DemandBars")).not.toContain("[scrollbar-gutter:stable]");
  });
});

describe("salaries catalog", () => {
  it("keeps one salary slide", () => {
    expect(sections.find((section) => section.id === "salaires")?.slideCount).toBe(1);
  });
});

describe("salaries chrome", () => {
  it("reuses the profil client shell on SalariesSection", () => {
    expect(source).toContain("export function SalariesSection");
    expect(source).toContain("householdSalaries");
    expect(source).toContain('smart("Combien peut gagner un(e) {profession} ?", profile)');
    expect(source).toContain("Le médian n’est pas un salaire promis. Deux métiers, deux fourchettes.");
    expect(source).toContain("Le médian n’est pas un salaire promis. C’est le milieu du marché, ici.");
    expect(source).not.toContain("Le salaire brut ne raconte pas toute l’histoire.");
    expect(source).not.toContain("Ce qui reste après les retenues, c’est ça qui paie le loyer.");
  });

  it("reframes visit and family salary copy around arrival and status", () => {
    expect(source).toContain("Après l’arrivée");
    expect(source).toContain("pas un droit de travailler");
    expect(extractFunction("SalariesBands")).toContain('"Pas un droit de travailler"');
  });

  it("keeps coaching copy out of SalariesSection and salaries chrome helpers", () => {
    for (const name of ["SalariesSection", "SalariesBands"]) {
      const chunk = extractFunction(name);
      expect(chunk).not.toContain("Le commercial");
      expect(chunk).not.toContain("version connectée");
      expect(chunk).not.toContain("panel=");
    }
  });
});

describe("salaries household boards", () => {
  it("renders salary bands per adult group", () => {
    expect(source).toContain("SalariesBoard");
    expect(source).not.toContain("SalariesNetBoard");
    expect(source).not.toContain("Salaire brut médian");
  });

  it("reframes the salary guide for studies, internships and an accompanying spouse", () => {
    expect(source).toContain("Combien pouvez-vous gagner après vos études ?");
    expect(source).toContain("Combien le foyer peut-il gagner pendant et après les études ?");
    expect(source).toContain("Après les études");
    expect(source).toContain("Conjoint parrainé");
    expect(source).toContain("Le conjoint parrainé peut travailler pendant vos études.");
    expect(source).toContain("SalaryPhaseBands");
    expect(source).toContain("s.draft");
  });

  it("renders the recognition ladder and closing facts under salary bands", () => {
    const board = extractFunction("SalariesBoard");
    expect(board).toContain("SalaryRecognitionBlock");
    expect(board).toContain("Deux métiers : deux reconnaissances. L’écart du foyer s’additionne.");
    expect(board).toContain("Sans reconnaissance, on part souvent du palier Bas. Le dossier sert aussi à faire compter ces années.");
    expect(board).not.toContain("sm:grid-cols-3");
    expect(board).not.toContain("flex-1");
    expect(board).toContain("grid shrink-0 gap-3");
  });

  it("marks declared vs recognized seniority and the recognized net echo", () => {
    const block = extractFunction("SalaryRecognitionBlock");
    expect(block).toContain("Années reconnues · fourchette");
    expect(block).toContain("Années déclarées");
    expect(block).toContain("Années reconnues (estim.)");
    expect(block).toContain("Écart salarial");
    expect(block).toContain("Net mensuel à ce palier");
    expect(block).toContain("Déclaré et reconnu");
    expect(block).toContain("Si les années comptent");
    expect(block).toContain("Reconnu");
    expect(block).toContain("ir-equal-row");
    expect(block).toContain("grid-cols-2");
    expect(block).not.toContain("ir-auto-grid-sm");
    expect(block).toContain("Estimation de démonstration. La reconnaissance réelle dépend du permis, du CNP et de l’ordre.");
    expect(block).toContain("ans reconnus");
    expect(block).toContain("net / mois");
    expect(block).not.toContain("sm:grid-cols-3");
  });
});

describe("market layout helpers", () => {
  it("uses the equal-row helper for salary triplets", () => {
    const bands = extractFunction("SalaryPhaseBands");
    expect(bands).toContain("ir-equal-row");
    expect(bands).not.toContain("sm:grid-cols-3");
  });

  it("uses equal-row helper on person salary row, keeps surface unclipped and removes hover translate", () => {
    const card = extractFunction("PersonMarketCard");
    const surfaceOpen = card.slice(card.indexOf("<Surface"), card.indexOf(">", card.indexOf("<Surface")) + 1);
    expect(card).toContain("ir-equal-row");
    expect(card).not.toContain("@min-[24rem]:grid-cols-3");
    expect(card).toMatch(/Surface[\s\S]*className[\s\S]*min-w-0/);
    expect(card).not.toContain("hover:-translate-y-0.5");
    expect(surfaceOpen).toContain("min-w-0");
    expect(surfaceOpen).not.toContain("overflow-hidden");
    expect(surfaceOpen).not.toContain("@container");
    expect(card).toContain("@container overflow-hidden rounded-[1.2rem]");
    expect(card).toContain("rounded-t-[1.2rem]");
    expect(card).toContain("absolute inset-0 z-0 size-full object-cover");
  });

  it("uses option grid helper for province city toggles and equal-row for province metrics", () => {
    const compare = extractFunction("ProvincesCompare");
    const estimator = extractFunction("ProvincesEstimator");
    expect(compare).toContain("ir-option-grid");
    expect(compare).not.toContain("flex flex-wrap");
    expect(estimator).toContain("ir-equal-row");
    expect(estimator).not.toContain("sm:grid-cols-3");
  });

  it("does not keep raw sm:grid-cols-3 on equal triplets", () => {
    expect(source).not.toContain("sm:grid-cols-3");
  });
});

describe("calculators catalog", () => {
  it("keeps three calculator slides between salaries and provinces", () => {
    const ids = sections.map((section) => section.id);
    expect(ids.indexOf("salaires") + 1).toBe(ids.indexOf("calculateurs"));
    expect(ids.indexOf("calculateurs") + 1).toBe(ids.indexOf("provinces"));
    expect(sections.find((section) => section.id === "calculateurs")?.slideCount).toBe(3);
    expect(sections.find((section) => section.id === "calculateurs")?.label).toBe("Calculateurs");
  });
});

describe("calculators chrome", () => {
  it("reuses the profil client shell on CalculatorsSection", () => {
    expect(source).toContain("export function CalculatorsSection");
    expect(source).toContain("householdLiving");
    expect(source).toContain("draftNet");
    expect(source).toContain("Combien reste-t-il réellement après les retenues ?");
    expect(source).toContain("Le brut impressionne. Le net paie le loyer. Deux métiers, deux restes.");
    expect(source).toContain("Le brut impressionne. Le net, c’est ça qui paie le loyer.");
    expect(source).toContain('smart("Que vaut ce salaire à {province} ?", profile)');
    expect(source).toContain("Un salaire n’existe pas tout seul. Il se mesure au loyer.");
    expect(source).toContain("Combien faut-il préparer pour démarrer ?");
    expect(source).toContain("Un projet Canada, ce n’est pas seulement des honoraires.");
  });

  it("keeps coaching copy out of CalculatorsSection helpers", () => {
    for (const name of [
      "CalculatorsSection",
      "CalculatorsNet",
      "CalculatorsLiving",
      "CalculatorsBudget",
      "NetDonut",
      "NetProvinceBars",
      "LivingDonut",
      "LivingProvinceBars",
    ]) {
      const chunk = extractFunction(name);
      expect(chunk).not.toContain("Le commercial");
      expect(chunk).not.toContain("version connectée");
      expect(chunk).not.toContain("panel=");
    }
  });

  it("adds a net donut and clickable province bars on CalculatorsNet", () => {
    const chunk = extractFunction("CalculatorsNet");
    expect(chunk).toContain("compareNetByProvince");
    expect(chunk).toContain("NetDonut");
    expect(chunk).toContain("NetProvinceBars");
    expect(chunk).toContain("@min-[36rem]");
    expect(chunk).toContain("@container");
    expect(extractFunction("NetDonut")).toContain("Retenues");
    expect(extractFunction("NetDonut")).toContain("Taux de retenue");
    expect(extractFunction("NetProvinceBars")).toContain("aria-pressed={active}");
    expect(extractFunction("NetProvinceBars")).toContain("onClick={() => onSelect(row.code)}");
    expect(extractFunction("NetProvinceBars")).toContain("@min-[36rem]:hidden");
    expect(extractFunction("NetProvinceBars")).toContain("@min-[36rem]:flex");
  });

  it("adds a living donut and clickable province bars on CalculatorsLiving", () => {
    const chunk = extractFunction("CalculatorsLiving");
    expect(chunk).toContain("compareLivingByProvince");
    expect(chunk).toContain("LivingDonut");
    expect(chunk).toContain("LivingProvinceBars");
    expect(chunk).toContain("@min-[36rem]");
    expect(chunk).toContain("@container");
    expect(extractFunction("LivingDonut")).toContain("Loyer");
    expect(extractFunction("LivingDonut")).toContain("Autres dépenses");
    expect(extractFunction("LivingProvinceBars")).toContain("aria-pressed={active}");
    expect(extractFunction("LivingProvinceBars")).toContain("onClick={() => onSelect(row.code)}");
    expect(extractFunction("LivingProvinceBars")).toContain("@min-[36rem]:hidden");
    expect(extractFunction("LivingProvinceBars")).toContain("@min-[36rem]:flex");
  });

  it("lets the living board edit net, rent and other expenses", () => {
    const chunk = extractFunction("CalculatorsLiving");
    expect(chunk).toContain("draftLiving");
    expect(chunk).toContain("LivingMoneyField");
    expect(chunk).toContain("rentOverride");
    expect(chunk).toContain('label="Net mensuel"');
    expect(chunk).toContain('label="Loyer indicatif"');
    expect(chunk).toContain('label="Autres dépenses estimées"');
    expect(chunk).toContain("{money(draft.remainder)}");
    expect(extractFunction("LivingMoneyField")).toContain('type="number"');
  });

  it("uses objective-specific budget cards for work, visit, business and family files", () => {
    const chunk = extractFunction("CalculatorsBudget");
    expect(chunk).toContain("workCost(profile)");
    expect(chunk).toContain("visitCost(profile)");
    expect(chunk).toContain("businessCost(profile)");
    expect(chunk).toContain("familyCost(profile)");
    expect(chunk).toContain("honorairesFor(profile)");
    expect(chunk).toContain("honorairesCard");
    expect(chunk).toContain("Frais de permis");
    expect(chunk).toContain("Frais de visa");
    expect(chunk).toContain("Frais de voyage");
    expect(chunk).toContain("Investissement");
    expect(chunk).toContain("Frais de parrainage");
    expect(chunk).toContain("Revenu exigé (MNI)");
    expect(chunk).toContain("Fonds jusqu’au 1er salaire");
    expect(chunk).toContain("Fonds à démontrer");
  });
});

describe("closing deck pills wiring", () => {
  it("reuses a shared closingDeckPills helper across menu sections", () => {
    expect(source).toContain('from "@/lib/closing-pills"');
    expect(source).toContain("closingDeckPills(profile)");
    expect(source).toContain("ce que coûte un mois sur place, pas une installation");
  });
});

describe("calculators household boards", () => {
  it("renders live net drafts, a shared living board, and project budget cards", () => {
    expect(source).toContain("Salaire annuel brut");
    expect(source).toContain("Net annuel estimatif");
    expect(source).toContain(" / mois");
    expect(source).toContain("Loyer indicatif");
    expect(source).toContain("Autres dépenses estimées");
    expect(source).toContain("Reste estimatif");
    expect(source).toContain("Honoraires IR");
    expect(source).toContain("Démarches & tests");
    expect(source).toContain("Preuve de fonds IRCC");
    expect(source).toContain("irccFundsFor");
    expect(source).toContain("À estimer");
    expect(source).toContain("honorairesFor");
    expect(source).toContain("Scolarité (année 1)");
    expect(source).toContain("Coût de vie (année 1)");
    expect(source).toContain("Preuve de fonds");
    expect(source).toContain("studyCost");
    expect(source).toContain("Le conjoint peut travailler pendant les études.");
  });
});

