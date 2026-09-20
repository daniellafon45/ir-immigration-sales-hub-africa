# Fix brief — estimator province outside demo set

Read this first — exact values to use verbatim.

## Where this fits

Final whole-branch review of Provinces COL found one Important defect. Fix that defect only. Do not remove `Hero`. Do not convert source-string tests into RTL tests.

## Finding (fix this)

`ProvincesEstimator` initializes `code` from `provinceCode(profile.province)`. The province `<Select>` only lists provinces that have cities in `livingCities`. If the profile is Saskatchewan, Nouvelle-Écosse, Île-du-Prince-Édouard, Yukon, etc.:

- `citiesForProvince(code)` is `[]` → empty city dropdown
- `selectedId` falls back to `"montreal"` → Montréal basket with a mismatched province

## Required behavior

Add a pure helper `defaultProvinceCode(profile)` in `src/lib/living-basket.ts`:

- If `citiesForProvince(provinceCode(profile.province)).length > 0`, return that code.
- Else return `cityById(defaultCityId(profile)).province` (Montréal → `QC`).

`ProvincesEstimator` must initialize `useState` with `defaultProvinceCode(profile)`, not raw `provinceCode(profile.province)`.

## TDD

Append to `src/lib/living-basket.test.ts` BEFORE editing production code (RED then GREEN):

```ts
it("uses the profile province when it has demo cities, otherwise the fallback city province", () => {
  expect(defaultProvinceCode(defaultProfile)).toBe("QC");
  expect(defaultProvinceCode({ ...defaultProfile, province: "Ontario" })).toBe("ON");
  expect(defaultProvinceCode({ ...defaultProfile, province: "Saskatchewan" })).toBe("QC");
});
```

Import `defaultProvinceCode`. Also add a source-string assertion in `src/features/market.test.ts` provinces chrome test:

```ts
expect(source).toContain("defaultProvinceCode");
```

RED/GREEN:

```
npx vitest run src/lib/living-basket.test.ts src/features/market.test.ts
```

## Constraints

- Project folder only. No git. No commits.
- Do not change Opportunities, Jobs, Salaries, Calculators behavior.
- Do not add profile store setters.
- Do not remove Hero or Band.
- French UI unchanged except the estimator now starts on a listed province.

## Report

Append to `docs/superpowers/sdd/provinces-task-2-report.md` a section `## Fix: defaultProvinceCode` with tests command + output.

Return: Status, commits none, test summary, concerns.
