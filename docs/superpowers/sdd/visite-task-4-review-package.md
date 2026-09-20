# Review package: Task 4 Visite Voies grid

No project git. Diff reconstructed from the implementer report + current files.

## Commits

SKIPPED_COMMIT (in-place workspace)

## Files changed

- src/features/immigration.tsx (VisitClosingCards + visit-fees named imports)
- src/features/immigration.test.ts (visit source assertions)

## Diff (task-relevant)

### src/features/immigration.tsx

Import added: `biometricsSolo, eta, visitFeesFor, visitorVisa, etaLikelyCountries` from `@/data/visit-fees`

Fix: pill uses `etaLikelyCountries.includes(profile.country.trim() ?? "")` at immigration.tsx:539
Test: `expect(detail).toContain("etaLikelyCountries")`

`VisitClosingCards` now:

```473:599:src/features/immigration.tsx
function VisitClosingCards({
  cost,
  profile,
}: {
  cost: ReturnType<typeof visitCost>;
  profile: Profile;
}) {
  const people = cost.accompanying ? cost.accompanying.adults + cost.accompanying.kids : 1;
  const fees = visitFeesFor(profile.country, people);
  const soloFees = visitFeesFor(profile.country, 1);
  const purpose = visitPurposeById(cost.purpose);
  const accompanyingTravelers = [
    ...(familyHasSpouse(profile.family) && profile.spouse.firstName.trim() ? [profile.spouse.firstName.trim()] : []),
    ...profile.children.map((child) => child.firstName || "Enfant"),
  ];
  // ... durationLabel ...
  return (
    <div className={cn("grid min-h-0 gap-3", cost.accompanying ? "lg:grid-cols-2" : "lg:grid-cols-3")}>
      <Surface className="p-4">
        <SectionLabel>Frais de voyage · Visa / eTA / biométrie</SectionLabel>
        <div className="mt-3 overflow-hidden rounded-xl border border-[#d7e4f3]">
          <table className="w-full text-left text-[12px]">
            <thead className="bg-secondary text-[10px] font-semibold tracking-wide text-primary uppercase">
              <tr>
                <th className="px-3 py-2">Frais</th>
                <th className="px-3 py-2 text-right">Par personne</th>
                <th className="px-3 py-2 text-right">Foyer</th>
              </tr>
            </thead>
            <tbody>
              {/* Visa visiteur / eTA / Biométrie rows: money(visitorVisa|eta|biometricsSolo) vs foyer totals; inactive document type = Non */}
            </tbody>
          </table>
        </div>
        <div className="mt-3 flex flex-wrap gap-1.5">
          <span>{profile.country}</span>
          <span>{fees.documentType === "eta" ? "eTA possible selon le passeport" : "Visa visiteur requis"}</span>
        </div>
      </Surface>
      {/* Séjour · Foyer unchanged */}
      {/* Motif et attaches unchanged */}
      {cost.accompanying ? (
        <Surface className="p-4">
          <SectionLabel>Accompagnants</SectionLabel>
          <dl>
            <FactLine label="Qui voyage" value={accompanyingTravelers.length > 0 ? accompanyingTravelers.join(", ") : "Foyer accompagnant"} />
            <FactLine label="Frais additionnels" value={money(fees.total - soloFees.total)} />
          </dl>
          <ul>
            {accompanyingTravelers.map((traveler, index) => (
              <li key={`${traveler}-${index}`}>· {traveler} · Statut visiteur</li>
            ))}
          </ul>
          <p>Pas de permis de travail, pas d’école sans permis d’études.</p>
        </Surface>
      ) : null}
    </div>
  );
}
```

Read the full function at `src/features/immigration.tsx` lines 473-599 if a hunk is cut off. The table body is complete in that range (rows Visa visiteur, eTA, Biométrie).

### src/features/immigration.test.ts

```128:143:src/features/immigration.test.ts
  it("embeds visit closing cards with no-work copy and accompanying gating", () => {
    expect(source).toContain("function VisitClosingCards");
    expect(source).toContain("visitCost");
    expect(source).toContain("Frais de voyage · Visa / eTA / biométrie");
    expect(source).toContain("Séjour · Foyer");
    expect(source).toContain("Motif et attaches");
    expect(source).toContain("cost.accompanying");
    expect(source).toContain("un visa visiteur n’autorise pas à travailler ni à étudier");
    expect(source).toContain("canWork");
    const detail = extractFunction("VisitClosingCards");
    expect(detail).toContain("Par personne");
    expect(detail).toContain("Foyer");
    expect(detail).toContain("Frais additionnels");
    expect(detail).toContain("Statut visiteur");
    expect(detail).toContain('firstName || "Enfant"');
  });
```

## Implementer test evidence (do not re-run the suite)

RED: visit test failed `expected function VisitClosingCards to contain 'Par personne'`
GREEN: that same visit test passes; `visit-cost.test.ts` 3/3 pass
Pre-existing unrelated failure in the same file: family cards `Résident ou citoyen` — out of this task's scope
