✅ immigration.tsx:350-433 — WorkClosingCards : le bloc « Offre requise » n’utilise pas de fallback vers `pathways.permits[0]`. Quand `workPermitKind` est vide, l’interface affiche une invite neutre « Choisissez un type de permis » plutôt que de tomber sur le premier permis.

✅ immigration.tsx:700-733 — FamilyClosingCards : les cellules « Hors Québec » / « Québec » lisent `cost.delay.tracks` par `label` et affichent `value`. Aucune chaîne hardcodée (« 14-20 mois », « environ 36 mois ») n’est présente.

Strengths
- Les deux points importants signalés dans la première revue ont été corrigés conformément au brief.
- Les tests ciblés ont été ajoutés à `src/features/immigration.test.ts` (assertions d’absence de fallback et d’absence de littéraux de délai) et l’implémenteur déclare 16/16 verts pour ce fichier.
- Les modifications sont localisées : pas d’impact apparent sur d’autres volets (slideCount, pitch, contraintes globales respectées).

Issues
#### Critical
- Aucune.

#### Important
- Les deux problèmes identifiés précédemment (fallback vers `pathways.permits[0]` et délais hardcodés) sont résolus — plus d’éléments ouverts ici.

#### Minor (déférés)
- Test d’exécution pour `NocSearchField` interaction : déféré par le brief.
- Vérification de la chaîne de commentaire startup : déférée.

Assessment
Task quality: Approved
Reasoning: Les deux corrections demandées ont été appliquées dans `src/features/immigration.tsx` et couvertes par assertions dédiées dans `src/features/immigration.test.ts`; l’implémenteur rapporte le passage des tests ciblés (16/16), les contraintes globaux du brief sont respectées.

### Spec Compliance
- ✅ `NocSearchField` respecte l’essentiel du contrat demandé et est bien réutilisé aux deux emplacements prévus: placeholder exact, seuil de recherche à 2 caractères, `Enter` pour choisir le premier résultat, `Escape` pour fermer, pastille sélectionnée, bouton d’effacement et suggestion non bloquante (`src/features/noc-search-field.tsx:22-115`, `src/features/profile.tsx:758-762`, `src/features/immigration.tsx:361-365`).
- ✅ Les nouveaux champs Profil sont bien limités au `Candidat`, câblés sur les champs existants via `setProject`, sans ajout de schéma (`src/features/profile.tsx:149-193`, `src/features/profile.tsx:362-367`, `src/features/profile.tsx:412-417`, `src/data/profile.ts:52-59`).
- ✅ La section Voies reste à `slideCount: 2` et ajoute bien des blocs de closing pour Travail / Visite / Affaires / Regroupement, tout en conservant le bloc Études et la mention légale (`src/catalog.ts:47-48`, `src/features/immigration.tsx:144-162`, `src/features/immigration.tsx:197-198`).
- ✅ Le cas `familyLink` vide ne simule pas un conjoint: la fiche Regroupement affiche un prompt explicite quand aucun lien n’est choisi (`src/features/immigration.tsx:796-799`, `src/lib/family-cost.ts:11-20`).
- ✅ Le package ne contient que les fichiers attendus pour cette tâche; les fichiers pitch et Task 6 exclus n’apparaissent pas dans la liste des fichiers modifiés (`docs/superpowers/sdd/closing-task-5-profile-voies-review-package.md:9-17`).
- ❌ La carte Travail ajoute une guidance par défaut trompeuse: quand aucun type de permis n’est sélectionné, elle affiche quand même la raison du premier permis de la liste, donc la logique LMIA, alors que `workPermitKind` est vide par défaut (`src/features/immigration.tsx:353-355`, `src/features/immigration.tsx:418-419`, `src/data/profile.ts:121-123`, `src/data/work-permits.ts:12-46`).
- ❌ La carte Regroupement contient encore des délais IRCC codés en dur dans l’UI au lieu de dépendre uniquement des helpers/catalogues, ce qui viole la contrainte “Do not invent IRCC numbers in the UI” (`src/features/immigration.tsx:711-712`, `src/lib/family-cost.ts:47`, `src/data/ircc-times.ts:81-90`).
- ⚠️ Cannot verify from diff: l’ordre réel RED puis GREEN, ainsi que l’absence d’usage de git/commits pendant l’implémentation.

### Strengths
- Les coûts et règles métiers sont majoritairement relus depuis les helpers existants au lieu d’être recopiés dans l’UI, y compris le traitement IEC/open holder fee et le renouvellement (`src/features/immigration.tsx:405-430`, `src/lib/work-pathways.ts:135-157`, `src/data/work-fees.ts:17-28`).
- Le gating “Candidat seulement” est proprement séparé entre `ProfileForm` et `PersonCard`, ce qui évite d’injecter ces champs sur le conjoint ou les épouses additionnelles (`src/features/profile.tsx:149-193`, `src/features/profile.tsx:378-398`, `src/features/profile.tsx:420-427`, `src/features/profile.tsx:1037-1056`).
- La fiche Regroupement gère correctement les branches `spouse`, `child`, `parent` et “aucun lien” sans inventer de données salariales pour la mauvaise personne (`src/features/immigration.tsx:760-799`).

### Issues
#### Critical
- Aucun.

#### Important
- Important: la carte `Permis · Ouvert ou fermé` ne reste pas neutre quand aucun permis n’est choisi. `selectedPermit` peut être `undefined`, mais le texte explicatif retombe sur `pathways.permits[0]`, c’est-à-dire la raison LMIA. L’écran donne donc une explication arbitraire avant même qu’un choix utilisateur existe, ce qui rend la guidance métier peu fiable (`src/features/immigration.tsx:353-355`, `src/features/immigration.tsx:418-419`, `src/data/profile.ts:121-123`, `src/data/work-permits.ts:12-46`).
- Important, plan-mandated: la table `Liens admissibles · Délais` embarque encore les littéraux `14-20 mois` et `environ 36 mois` comme fallback UI, alors que `familyCost()` fournit déjà `cost.delay` depuis `irccTimeFor("family")`. Le brief interdisait explicitement d’inventer des nombres IRCC dans l’UI (`src/features/immigration.tsx:711-712`, `src/lib/family-cost.ts:47`, `src/data/ircc-times.ts:81-90`).

#### Minor
- Le test censé verrouiller l’absence d’option `startup` ne vérifie pas le rendu réel. Il se contente de chercher la chaîne `path.id !== "startup"` dans le source, chaîne satisfaite par un commentaire, alors que le composant rend directement `businessPaths.map(...)`. Le comportement est correct aujourd’hui seulement parce que les données n’exposent pas `startup` (`src/features/profile.test.ts:194-203`, `src/features/profile.tsx:843`, `src/features/profile.tsx:848-851`, `src/data/business-paths.ts:1-45`).
- Les nouveaux tests restent des inspections de chaînes source et ne couvrent pas le comportement interactif le plus risqué de `NocSearchField` (recherche après 2 caractères, `Enter`, `Escape`, clear). Les deux suites lisent le fichier brut avec `readFileSync` et valident surtout des `toContain`, tandis que la logique interactive vit ailleurs (`src/features/profile.test.ts:1-260`, `src/features/immigration.test.ts:1-270`, `src/features/noc-search-field.tsx:68-104`).

### Assessment
**Task quality:** Needs fixes
**Reasoning:** Deux écarts bloquants subsistent côté exigences: la carte Travail peut afficher une explication de permis erronée par défaut, et la carte Regroupement garde des délais IRCC codés en dur dans l’UI. La structure générale est sinon plutôt propre et bien adossée aux helpers existants, donc la correction devrait rester ciblée.
