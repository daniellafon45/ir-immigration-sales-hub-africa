# Provinces coût de vie Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development.

**Goal:** Transformer Provinces en estimateur + comparateur de coût de vie par ville, chrome foyer, copy prospect.

**Architecture:** Dataset `livingCities` + helper pur `livingBasket`. Réécrire `ProvincesSection` avec `OpportunitiesShell` sans panneau. `slideCount` reste 2.

**Tech Stack:** React 19, TypeScript, Vitest.

## Global Constraints

- Work only in `c:\Users\Admin\Documents\Projets\Projets_Vibe_coding\IR_Immigration_Sale_plateforme`.
- Do not run any git command. Do not commit.
- French UI. English code/types/tests.
- Keep catalog `provinces.slideCount` at `2`.
- Do not modify Opportunities, Jobs, Salaries, or Calculators behavior.
- Reuse `OpportunitiesShell`, `Surface`, `SectionLabel`, `Select`. No `panel=`. No `JobsBriefingPanel`. No `À retenir`. No `La question`.
- No profile store setters. City/compare selection is local `useState`.
- Forbidden copy: `Le commercial`, `le commercial`, `version connectée`.
- Exact copy:
  - Slide 1 kicker `Provinces · Coût de vie`
  - Slide 1 title `Le salaire ne paie pas une moyenne. Il paie une ville.`
  - Slide 1 lead `Logement, épicerie, transport, services. Tout le foyer, pas un célibataire imaginaire.`
  - Labels `Province` `Ville` `Logement` `Épicerie` `Transport` `Services` `Garde d’enfants` `Panier mensuel` `Net du foyer` `Reste estimatif`
  - Disclaimer `Estimation de démonstration.`
  - Slide 2 kicker `Provinces · Comparer`
  - Slide 2 title `La même vie ne coûte pas le même prix.`
  - Slide 2 lead `Trois villes maximum. Celle qui laisse un reste rend le projet possible.`
  - Empty `Choisissez jusqu’à trois villes pour comparer.`
  - Table headers `Ville` `Logement` `Épicerie` `Transport` `Services` `Garde` `Panier` `Reste`
- Max 3 compared cities.
- Hide childcare row/column when `kids.length === 0`.
- Skip git; DONE still applies.
- Vitest source-read pattern in `market.test.ts`.

## File structure

- Create: `src/data/cost-of-living.ts`
- Create: `src/lib/living-basket.ts`
- Create: `src/lib/living-basket.test.ts`
- Modify: `src/features/market.tsx` (`ProvincesSection` only)
- Modify: `src/features/market.test.ts`

---

### Task 1: living cities + basket helper

**Files:** create the three files above (data + helper + tests)

- [ ] **Step 1: failing tests**

Create `src/lib/living-basket.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { defaultProfile, emptyAdult } from "@/data/profile";
import { livingCities } from "@/data/cost-of-living";
import {
  citiesForProvince,
  defaultCityId,
  defaultCompareIds,
  livingBasket,
} from "@/lib/living-basket";

describe("livingCities", () => {
  it("lists twelve demo cities across six provinces", () => {
    expect(livingCities).toHaveLength(12);
    expect(livingCities.map((city) => city.id)).toEqual([
      "montreal",
      "quebec",
      "laval",
      "gatineau",
      "toronto",
      "ottawa",
      "mississauga",
      "calgary",
      "edmonton",
      "winnipeg",
      "moncton",
      "vancouver",
    ]);
  });
});

describe("livingBasket", () => {
  it("uses a two-bedroom basket for the default couple in Montreal", () => {
    const view = livingBasket(defaultProfile, "montreal");
    expect(view.city.name).toBe("Montréal");
    expect(view.adults).toBe(2);
    expect(view.kids).toBe(0);
    expect(view.housing).toBe(2100);
    expect(view.grocery).toBe(840);
    expect(view.transport).toBe(300);
    expect(view.utilities).toBe(220);
    expect(view.childcare).toBe(0);
    expect(view.total).toBe(3460);
    expect(view.netMonthly).toBe(9450);
    expect(view.remainder).toBe(5990);
  });

  it("uses a one-bedroom basket when the family is Seul(e)", () => {
    const view = livingBasket({ ...defaultProfile, family: "Seul(e)", spouse: emptyAdult }, "montreal");
    expect(view.adults).toBe(1);
    expect(view.housing).toBe(1650);
    expect(view.grocery).toBe(420);
    expect(view.transport).toBe(150);
    expect(view.total).toBe(2440);
    expect(view.netMonthly).toBe(4200);
    expect(view.remainder).toBe(1760);
  });

  it("adds child grocery and childcare when the household has a child", () => {
    const view = livingBasket(
      {
        ...defaultProfile,
        family: "Couple + enfant(s)",
        children: [{ id: "c1", firstName: "Léa", age: 6 }],
      },
      "montreal",
    );
    expect(view.kids).toBe(1);
    expect(view.housing).toBe(2100);
    expect(view.grocery).toBe(1050);
    expect(view.childcare).toBe(900);
    expect(view.total).toBe(4570);
    expect(view.remainder).toBe(4880);
  });
});

describe("city defaults", () => {
  it("picks the first city of the profile province and a three-city contrast set", () => {
    expect(citiesForProvince("QC").map((city) => city.id)).toEqual(["montreal", "quebec", "laval", "gatineau"]);
    expect(defaultCityId(defaultProfile)).toBe("montreal");
    expect(defaultCompareIds(defaultProfile)).toEqual(["montreal", "toronto", "moncton"]);
  });
});
```

- [ ] **Step 2: RED** `npx vitest run src/lib/living-basket.test.ts`

- [ ] **Step 3: implementation**

Create `src/data/cost-of-living.ts`:

```ts
export type LivingCity = {
  id: string;
  name: string;
  province: string;
  housing1: number;
  housing2: number;
  grocery: number;
  transport: number;
  utilities: number;
  childcare: number;
};

export const livingCities: LivingCity[] = [
  { id: "montreal", name: "Montréal", province: "QC", housing1: 1650, housing2: 2100, grocery: 420, transport: 150, utilities: 220, childcare: 900 },
  { id: "quebec", name: "Québec", province: "QC", housing1: 1350, housing2: 1700, grocery: 400, transport: 120, utilities: 200, childcare: 850 },
  { id: "laval", name: "Laval", province: "QC", housing1: 1550, housing2: 1950, grocery: 410, transport: 160, utilities: 210, childcare: 880 },
  { id: "gatineau", name: "Gatineau", province: "QC", housing1: 1400, housing2: 1750, grocery: 390, transport: 130, utilities: 200, childcare: 800 },
  { id: "toronto", name: "Toronto", province: "ON", housing1: 2300, housing2: 2900, grocery: 460, transport: 156, utilities: 240, childcare: 1400 },
  { id: "ottawa", name: "Ottawa", province: "ON", housing1: 1800, housing2: 2300, grocery: 430, transport: 135, utilities: 220, childcare: 1200 },
  { id: "mississauga", name: "Mississauga", province: "ON", housing1: 2000, housing2: 2500, grocery: 450, transport: 150, utilities: 230, childcare: 1300 },
  { id: "calgary", name: "Calgary", province: "AB", housing1: 1600, housing2: 2000, grocery: 430, transport: 115, utilities: 230, childcare: 1100 },
  { id: "edmonton", name: "Edmonton", province: "AB", housing1: 1400, housing2: 1750, grocery: 410, transport: 110, utilities: 220, childcare: 1000 },
  { id: "winnipeg", name: "Winnipeg", province: "MB", housing1: 1250, housing2: 1550, grocery: 390, transport: 110, utilities: 210, childcare: 900 },
  { id: "moncton", name: "Moncton", province: "NB", housing1: 1150, housing2: 1450, grocery: 380, transport: 90, utilities: 190, childcare: 750 },
  { id: "vancouver", name: "Vancouver", province: "BC", housing1: 2400, housing2: 3100, grocery: 470, transport: 170, utilities: 250, childcare: 1500 },
];
```

Create `src/lib/living-basket.ts`:

```ts
import { livingCities, type LivingCity } from "@/data/cost-of-living";
import type { Profile } from "@/data/profile";
import { provinceCode } from "@/data/provinces";
import { householdLiving } from "@/lib/household-living";
import { householdMarket } from "@/lib/household-market";

export type LivingBasket = {
  city: LivingCity;
  housing: number;
  grocery: number;
  transport: number;
  utilities: number;
  childcare: number;
  total: number;
  netMonthly: number;
  remainder: number;
  adults: number;
  kids: number;
};

export function citiesForProvince(code: string) {
  return livingCities.filter((city) => city.province === code);
}

export function cityById(id: string) {
  return livingCities.find((city) => city.id === id) ?? livingCities[0];
}

export function defaultCityId(profile: Profile) {
  return citiesForProvince(provinceCode(profile.province))[0]?.id ?? "montreal";
}

export function defaultCompareIds(profile: Profile) {
  const primary = defaultCityId(profile);
  const extras = ["toronto", "moncton", "vancouver", "winnipeg"].filter((id) => id !== primary);
  return [primary, extras[0], extras[1]] as const;
}

export function livingBasket(profile: Profile, cityId: string): LivingBasket {
  const city = cityById(cityId);
  const market = householdMarket(profile);
  const adults = market.adults.length;
  const kids = market.kids.length;
  const familyHome = adults > 1 || kids > 0;
  const housing = familyHome ? city.housing2 : city.housing1;
  const grocery = city.grocery * adults + Math.round(city.grocery * 0.5) * kids;
  const transport = city.transport * adults;
  const utilities = city.utilities;
  const childcare = city.childcare * kids;
  const total = housing + grocery + transport + utilities + childcare;
  const netMonthly = householdLiving(profile).combinedNetMonthly;
  return {
    city,
    housing,
    grocery,
    transport,
    utilities,
    childcare,
    total,
    netMonthly,
    remainder: Math.max(0, netMonthly - total),
    adults,
    kids,
  };
}
```

- [ ] **Step 4: GREEN** same vitest command
- [ ] **Step 5:** no git

---

### Task 2: ProvincesSection UI

**Files:** `src/features/market.tsx`, `src/features/market.test.ts`

- [ ] **Step 1: append tests**

```ts
describe("provinces catalog", () => {
  it("keeps two province slides", () => {
    expect(sections.find((section) => section.id === "provinces")?.slideCount).toBe(2);
  });
});

describe("provinces chrome", () => {
  it("reuses the profil client shell on ProvincesSection", () => {
    expect(source).toContain("export function ProvincesSection");
    expect(source).toContain("livingBasket");
    expect(source).toContain("Le salaire ne paie pas une moyenne. Il paie une ville.");
    expect(source).toContain("Logement, épicerie, transport, services. Tout le foyer, pas un célibataire imaginaire.");
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
  });
});
```

- [ ] **Step 2: RED** `npx vitest run src/features/market.test.ts`

- [ ] **Step 3: implementation**

Add imports:

```ts
import { livingCities } from "@/data/cost-of-living";
import {
  citiesForProvince,
  defaultCityId,
  defaultCompareIds,
  livingBasket,
} from "@/lib/living-basket";
```

Replace `export function ProvincesSection` through its closing `}` before `function Band` with the code below. Keep `Band` and `Hero`. If `Slide` becomes unused, remove its import.

```tsx
export function ProvincesSection() {
  const slide = useDeckStore((s) => s.slideIndex);
  const profile = useProfileStore((s) => s.profile);
  const market = householdMarket(profile);
  if (slide === 1) return <ProvincesCompare market={market} profile={profile} />;
  return <ProvincesEstimator market={market} profile={profile} />;
}

function ProvincesEstimator({
  market,
  profile,
}: {
  market: HouseholdMarket;
  profile: Profile;
}) {
  const initialCode = provinceCode(profile.province);
  const [code, setCode] = useState(initialCode);
  const cities = citiesForProvince(code);
  const [cityId, setCityId] = useState(() => defaultCityId(profile));
  const selectedId = cities.some((city) => city.id === cityId) ? cityId : cities[0]?.id ?? "montreal";
  const basket = livingBasket(profile, selectedId);
  const pills = [market.family, market.province, ...market.adults.map((adult) => adult.member.profession)];
  const rows = [
    ["Logement", basket.housing],
    ["Épicerie", basket.grocery],
    ["Transport", basket.transport],
    ["Services", basket.utilities],
    ...(basket.kids > 0 ? [["Garde d’enfants", basket.childcare] as const] : []),
  ] as Array<[string, number]>;
  return (
    <OpportunitiesShell
      kicker="Provinces · Coût de vie"
      title="Le salaire ne paie pas une moyenne. Il paie une ville."
      lead="Logement, épicerie, transport, services. Tout le foyer, pas un célibataire imaginaire."
      pills={pills}
    >
      <div className="grid shrink-0 gap-3 sm:grid-cols-2">
        <label className="grid gap-1">
          <span className="text-[10px] uppercase text-muted-foreground">Province</span>
          <Select
            value={code}
            onChange={(event) => {
              const next = event.target.value;
              setCode(next);
              setCityId(citiesForProvince(next)[0]?.id ?? "montreal");
            }}
          >
            {Object.entries(provinceData)
              .filter(([item]) => citiesForProvince(item).length > 0)
              .map(([item, province]) => (
                <option key={item} value={item}>
                  {province.name}
                </option>
              ))}
          </Select>
        </label>
        <label className="grid gap-1">
          <span className="text-[10px] uppercase text-muted-foreground">Ville</span>
          <Select value={selectedId} onChange={(event) => setCityId(event.target.value)}>
            {cities.map((city) => (
              <option key={city.id} value={city.id}>
                {city.name}
              </option>
            ))}
          </Select>
        </label>
      </div>
      <Surface className="p-4">
        <SectionLabel>
          {basket.city.name} · {provinceData[basket.city.province]?.name ?? basket.city.province}
        </SectionLabel>
        <div className="mt-3 grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
          {rows.map(([label, value]) => (
            <div key={label} className="rounded-[14px] border border-border bg-white p-5">
              <span className="block text-[10px] uppercase text-muted-foreground">{label}</span>
              <strong className="mt-1.5 block text-[26px]">{money(value)}</strong>
            </div>
          ))}
        </div>
        <div className="mt-3 grid gap-2 sm:grid-cols-3">
          <div className="rounded-[14px] border border-border bg-white p-5">
            <span className="block text-[10px] uppercase text-muted-foreground">Panier mensuel</span>
            <strong className="mt-1.5 block text-[26px]">{money(basket.total)}</strong>
          </div>
          <div className="rounded-[14px] border border-border bg-white p-5">
            <span className="block text-[10px] uppercase text-muted-foreground">Net du foyer</span>
            <strong className="mt-1.5 block text-[26px]">{money(basket.netMonthly)}</strong>
          </div>
          <div className="rounded-[14px] border border-transparent bg-linear-to-br from-primary to-ir-deep p-5 text-white">
            <span className="block text-[10px] uppercase opacity-75">Reste estimatif</span>
            <strong className="mt-1.5 block text-[26px]">{money(basket.remainder)}</strong>
          </div>
        </div>
        <p className="mt-3 text-[12px] text-muted-foreground">Estimation de démonstration.</p>
      </Surface>
    </OpportunitiesShell>
  );
}

function ProvincesCompare({
  market,
  profile,
}: {
  market: HouseholdMarket;
  profile: Profile;
}) {
  const pills = [market.family, market.province];
  const [selected, setSelected] = useState<string[]>(() => [...defaultCompareIds(profile)]);
  const showCare = market.kids.length > 0;
  const baskets = selected.map((id) => livingBasket(profile, id));
  const headers = ["Ville", "Logement", "Épicerie", "Transport", "Services", ...(showCare ? ["Garde"] : []), "Panier", "Reste"];
  return (
    <OpportunitiesShell
      kicker="Provinces · Comparer"
      title="La même vie ne coûte pas le même prix."
      lead="Trois villes maximum. Celle qui laisse un reste rend le projet possible."
      pills={pills}
    >
      <div className="flex flex-wrap gap-2">
        {livingCities.map((city) => {
          const on = selected.includes(city.id);
          return (
            <button
              key={city.id}
              type="button"
              onClick={() =>
                setSelected((current) => {
                  if (current.includes(city.id)) return current.filter((id) => id !== city.id);
                  if (current.length >= 3) return current;
                  return [...current, city.id];
                })
              }
              className={cn(
                "rounded-full border px-3 py-1.5 text-[12px] font-medium transition",
                on ? "border-primary bg-primary text-white" : "border-border bg-white text-[#1a2332]",
              )}
            >
              {city.name}
            </button>
          );
        })}
      </div>
      {baskets.length === 0 ? (
        <p className="text-[13px] text-muted-foreground">Choisissez jusqu’à trois villes pour comparer.</p>
      ) : (
        <Surface className="overflow-x-auto p-3">
          <table className="w-full border-separate border-spacing-y-1.5 text-[11px]">
            <thead>
              <tr className="text-left text-[9px] tracking-wide text-[#89929f] uppercase">
                {headers.map((header) => (
                  <th key={header} className="px-2.5">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {baskets.map((basket) => (
                <tr key={basket.city.id}>
                  <td className="rounded-l-[9px] border border-r-0 border-[#e4e8ee] bg-[#f7fafc] px-2.5 py-2.5 font-semibold">
                    {basket.city.name}
                  </td>
                  <td className="border-y border-[#e4e8ee] bg-[#f7fafc] px-2.5">{money(basket.housing)}</td>
                  <td className="border-y border-[#e4e8ee] bg-[#f7fafc] px-2.5">{money(basket.grocery)}</td>
                  <td className="border-y border-[#e4e8ee] bg-[#f7fafc] px-2.5">{money(basket.transport)}</td>
                  <td className="border-y border-[#e4e8ee] bg-[#f7fafc] px-2.5">{money(basket.utilities)}</td>
                  {showCare ? <td className="border-y border-[#e4e8ee] bg-[#f7fafc] px-2.5">{money(basket.childcare)}</td> : null}
                  <td className="border-y border-[#e4e8ee] bg-[#f7fafc] px-2.5 font-semibold">{money(basket.total)}</td>
                  <td className="rounded-r-[9px] border border-l-0 border-[#e4e8ee] bg-[#f7fafc] px-2.5 font-semibold text-primary">
                    {money(basket.remainder)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Surface>
      )}
    </OpportunitiesShell>
  );
}
```

- [ ] **Step 4: GREEN** `npx vitest run src/features/market.test.ts src/lib/living-basket.test.ts src/lib/household-living.test.ts`
- [ ] **Step 5:** no git

## Self-review

Estimator + comparator, household scaling, max 3 cities, no coaching, chrome without panel.
