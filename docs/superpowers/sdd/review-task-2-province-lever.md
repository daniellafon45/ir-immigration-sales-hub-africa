# Review package: working-tree Task 2 (no git)

Base: Task 1 complete (province-lever helper exists; PrincipalPanel still showed salary vs median)
Head: working tree after Task 2

## Commits

none (git forbidden)

## Files changed

```
src/features/profile.tsx       | modified (imports + PrincipalPanel lever block)
src/features/profile.test.ts   | modified (new describe; 2 readability class strings)
```

## Diff

### src/features/profile.tsx

Removed from `@/data/profile` import: `financialCapacityAmount`.

Removed:
```
import { salaryForProfession } from "@/lib/finance";
import { money } from "@/lib/format";
```

Added:
```
import { provinceLever } from "@/lib/province-lever";
```

In PrincipalPanel, replaced salary/median locals with:
```
  const lever = provinceLever(principal, draft.province);
```

Replaced PanelBlock body (title unchanged `` `Levier ${draft.province}` ``):

```tsx
        <PanelBlock title={`Levier ${draft.province}`}>
          <FactRow label={lever.requirementLabel} value={lever.requirementValue} />
          <FactRow label={lever.candidateLabel} value={lever.candidateValue} />
          {lever.positive ? (
            <p className="pt-0.5 text-[12px] font-semibold text-white">
              {lever.verdict}
            </p>
          ) : (
            <p className="pt-0.5 text-[12px] text-white/80">
              {lever.verdict}
            </p>
          )}
        </PanelBlock>
```

Old block removed:
```
          <FactRow label="Capacité financière" value={principal.salary} />
          <FactRow label="Médiane locale" value={money(medianSalary)} />
          {salaryLift > 0 ? (
            <p className="pt-0.5 text-[12px] font-semibold text-white">
              Potentiel +{money(salaryLift)} / an
            </p>
          ) : (
            <p className="pt-0.5 text-[12px] text-white/70">Le revenu actuel est déjà dans la cible locale.</p>
          )}
```

PersonCard still has the form field labeled "Capacité financière".
SCORE_BARS still includes `{ key: "salary", label: "Capacité", max: 6 }`.

### src/features/profile.test.ts

Appended:

```ts
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
```

Readability describe: two PrincipalPanel class assertions now expect `pt-0.5 text-[12px] font-semibold text-white` and `pt-0.5 text-[12px] text-white/80` (matching the brief's verdict typography).
