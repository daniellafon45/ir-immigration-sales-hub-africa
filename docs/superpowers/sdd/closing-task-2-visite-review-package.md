# Review package: Task 2 Visite data

No project git — package is the new-file snapshot (all added).

## Commits

none (in-place, no git)

## Files changed

- src/data/visit-purposes.ts (added)
- src/data/visit-fees.ts (added)
- src/data/visit-funds.ts (added)
- src/lib/visit-cost.ts (added)
- src/data/visit-fees.test.ts (added)
- src/lib/visit-cost.test.ts (added)

## Diff

Treat the following as the full added files (new file /dev/null → path).

### src/data/visit-purposes.ts
```ts
export type VisitPurposeId = "family" | "tourism" | "business";
export type VisitPurpose = { id: VisitPurposeId; name: string; ties: string[]; hostUseful: boolean };
export const visitPurposes: VisitPurpose[] = [
  { id: "family", name: "Visite familiale", ties: ["famille au pays", "emploi au pays", "biens", "billet retour"], hostUseful: true },
  { id: "tourism", name: "Tourisme", ties: ["emploi au pays", "revenus stables", "biens", "billet retour"], hostUseful: false },
  { id: "business", name: "Voyage d’affaires", ties: ["entreprise au pays", "mission courte", "contrats en cours", "billet retour"], hostUseful: false },
];
export function visitPurposeById(id: string) {
  return visitPurposes.find((purpose) => purpose.id === id);
}
```

### src/data/visit-fees.ts
```ts
export const visitorVisa = 100;
export const eta = 7;
export const biometricsSolo = 85;
export const biometricsFamilyCap = 170;
export const sourceUrl = "https://www.canada.ca/fr/immigration-refugies-citoyennete/services/visiter-canada/frais.html";
export const etaLikelyCountries = ["France", "Allemagne", "Japon"] as const;
export function visitFeesFor(country: string, people: number): VisitFees
```
Full file at src/data/visit-fees.ts: visa vs eTA, biometrics capped at 170, people floored to ≥1.

### src/data/visit-funds.ts
Demo monotonic grid duration × household size 1–5. `visitFundsFor(duration, adults, kids)`.

### src/lib/visit-cost.ts
Empty purpose → tourism assumed; empty duration → 1m assumed.
stayCost = livingBasket.total * factor (15d 0.5, 1m 1, 3m 3, 6m 6).
ticketsDemo = 2400*adults + 1200*kids.
gap = fundsRequired - stayCost.
accompanying undefined if 1 adult 0 kids.
canWork always false.
Adults count: 1 + spouse if familyHasSpouse + extraSpouses if Polygame.

### Tests
visit-fees.test.ts: 100/7/85/170; Bénin visa 185; France 3 people eTA + biometrics cap 191.
visit-cost.test.ts: solo 1m stayCost 2440, canWork false; couple+child 3m stayCost 4570*3, tickets 6000, accompanying {2,1}.
