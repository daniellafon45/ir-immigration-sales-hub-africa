# Rapport — Task 1 : householdSalaries helper

## Ce qui a été implémenté

Helper pur `householdSalaries(profile: Profile)` qui :

- S’appuie sur `householdMarket(profile)` pour obtenir la liste des adultes et la province.
- Pour chaque adulte, expose un `HouseholdSalaryGroup` avec :
  - `adult` (données marché incluant `low` / `mid` / `high` déjà calculés),
  - `bands` = `salaryData[profession] ?? salaryData.Comptable`,
  - `netAnnual` = `netEstimate(adult.mid, provinceCode(profile.province))`,
  - `netMonthly` = `Math.round(netAnnual / 12)`.
- Retourne `HouseholdSalaries` : `{ groups, province: market.province }`.

Types exportés : `HouseholdSalaryGroup`, `HouseholdSalaries`.

Aucune modification UI, aucun changement aux sections existantes ni à `salaries.ts`.

## Ce qui a été testé

Quatre cas dans `src/lib/household-salaries.test.ts` :

1. Couple par défaut (Loriane Comptable + Marc Développeur logiciel) — bandes, nets QC, province Québec.
2. Famille « Seul(e) » — un seul groupe.
3. Profession absente de `salaryData` (« Aide-soignant(e) ») — repli sur bandes Comptable et mid 72000 (QC).
4. Province Ontario — mid 78000, net annuel 56940, net mensuel 4745.

## TDD Evidence

### RED

Commande :

```text
npx vitest run src/lib/household-salaries.test.ts
```

Sortie (extrait) :

```text
 FAIL  src/lib/household-salaries.test.ts
Error: Failed to resolve import "@/lib/household-salaries" from "src/lib/household-salaries.test.ts". Does the file exist?
 Test Files  1 failed (1)
      Tests  no tests
```

### GREEN

Commande :

```text
npx vitest run src/lib/household-salaries.test.ts
```

Sortie :

```text
 ✓ src/lib/household-salaries.test.ts (4 tests) 13ms

 Test Files  1 passed (1)
      Tests  4 passed (4)
```

## Fichiers modifiés

| Fichier | Action |
|---------|--------|
| `src/lib/household-salaries.test.ts` | Créé (contenu conforme au brief) |
| `src/lib/household-salaries.ts` | Créé (contenu conforme au brief) |

Aucun autre fichier touché. Aucune commande git exécutée.

## Auto-revue

**Complétude** : Interfaces, imports et logique alignés sur le brief et le spec ; même structure que `household-jobs.ts`.

**Qualité** : Pas de logique dupliquée inutile ; réutilisation de `householdMarket`, `netEstimate`, `provinceCode`, `salaryData`.

**YAGNI** : Pas d’options supplémentaires, pas de formatage UI, pas de tests hors brief.

**TDD** : Test créé avant l’implémentation ; échec RED documenté ; GREEN avec 4/4 tests.

**Lint** : Aucune alerte sur les deux fichiers créés.

## Problèmes ou réserves

Aucun blocage. Le helper est prêt pour la Task 2 (UI Guide salarial). Les valeurs numériques des tests dépendent des taux nets dans `finance.ts` (QC 0.7, ON 0.73) et du profil par défaut — cohérent avec le reste du deck.
