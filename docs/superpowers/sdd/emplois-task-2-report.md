Status: DONE (JobsSection chrome + messages commerciaux implémentés)
Commits: aucun (git non utilisé)
TDD: RED puis GREEN sur `src/features/market.test.ts`
RED tests: après mise à jour des tests (nouveaux blocs `jobs catalog`, `jobs chrome`, `jobs household boards`), `npx vitest run src/features/market.test.ts` échoue sur 3 tests (JobsSection encore sur `<Slide>`, coaching copy toujours présente, aucun `JobsBoard`).
Implémentation: remplacement de `JobsSection` par le shell profil client (`OpportunitiesShell`) en 2 vues (`JobsToday`, `JobsIntl`) consommant `householdJobs`, ajout de `JobsBoard`/`JobTable`/`JobsBriefingPanel`, import de `householdJobs`, suppression de l’usage de `jobs`.
GREEN tests: `npx vitest run src/features/market.test.ts src/lib/household-jobs.test.ts src/lib/household-market.test.ts` passe (19 tests verts).
Commandes: `npx vitest run src/features/market.test.ts` puis `npx vitest run src/features/market.test.ts src/lib/household-jobs.test.ts src/lib/household-market.test.ts`.
Sortie clé: dernière exécution affiche `Test Files  3 passed (3)` et `Tests  19 passed (19)`.
Contraintes: sections Opportunités/Salaires/Calculators/Provinces laissées inchangées, copies exactes respectant les apostrophes courbes, helper `extractFunction` étendu pour couper aussi sur `export function`.
Concerns: aucun bloquant identifié; garder en tête que d’autres fichiers pourraient encore contenir le texte coaching historique selon futures tâches.
Report path: `docs/superpowers/sdd/emplois-task-2-report.md`
