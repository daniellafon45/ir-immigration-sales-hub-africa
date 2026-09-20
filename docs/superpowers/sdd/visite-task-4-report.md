# Task 4 report — Grille Voies visite

## Statut

Terminé avec une réserve de vérification externe au périmètre: le scénario `visit` est corrigé et son assertion TDD passe, mais la commande demandée continue de signaler un échec préexistant dans le bloc `family`.

## Périmètre respecté

- Fichier production modifié: `src/features/immigration.tsx`
- Fichier test modifié: `src/features/immigration.test.ts`
- Aucun autre fichier produit n’a été modifié
- Aucun commit créé: `SKIPPED_COMMIT`

## Implémentation réalisée

### `VisitClosingCards`

- Remplacement du simple résumé de frais par une grille 3 lignes × 2 colonnes:
  - `Visa visiteur`
  - `eTA`
  - `Biométrie`
  - colonnes `Par personne` et `Foyer`
- Utilisation des valeurs existantes demandées:
  - `visitFeesFor`
  - `visitorVisa`
  - `eta`
  - `biometricsSolo`
- Cas inactif affiché en `Non` sur les deux colonnes pour le document non applicable
- Ajout du pill document:
  - `{country}`
  - `eTA possible selon le passeport` si `fees.documentType === "eta"`
  - sinon `Visa visiteur requis`
- Conservation de `Séjour · Foyer` inchangé
- Conservation de `Motif et attaches` inchangé, y compris l’aperçu/family invitation et la copie sans droit au travail
- Finalisation de la carte `Accompagnants`:
  - liste `Qui voyage` avec prénom du conjoint si présent
  - chaque enfant par prénom, avec fallback `Enfant`
  - ligne `Statut visiteur` pour chaque accompagnant listé
  - `Frais additionnels` calculés par `visitFeesFor(country, people).total - visitFeesFor(country, 1).total`
  - conservation de `Pas de permis de travail, pas d’école sans permis d’études.`

## TDD

### RED

J’ai d’abord étendu le test existant `embeds visit closing cards with no-work copy and accompanying gating` pour exiger:

- `Par personne`
- `Foyer`
- `Frais additionnels`
- `Statut visiteur`
- `firstName || "Enfant"`

Commande lancée:

```bash
npx vitest run src/features/immigration.test.ts src/lib/visit-cost.test.ts
```

Sortie RED pertinente:

```text
✓ src/lib/visit-cost.test.ts (3 tests)
× voies boards > embeds visit closing cards with no-work copy and accompanying gating
  → expected 'function VisitClosingCards({...' to contain 'Par personne'
```

Validation RED:

- l’échec visé porte bien sur `VisitClosingCards`
- la raison est bien l’absence de la nouvelle grille attendue
- ce n’est pas une faute de frappe de test

### GREEN

Après l’implémentation minimale dans `VisitClosingCards`, j’ai relancé la même commande.

Commande relancée:

```bash
npx vitest run src/features/immigration.test.ts src/lib/visit-cost.test.ts
```

Sortie GREEN pertinente pour la tâche:

```text
✓ src/lib/visit-cost.test.ts (3 tests)
✓ voies boards > embeds visit closing cards with no-work copy and accompanying gating
```

Réserve restante sur la même commande:

```text
× voies boards > embeds family closing cards with four titles and a reminder state
  → expected ... to contain 'Résident ou citoyen'
```

## Vérifications complémentaires

- Diagnostics IDE / lint sur les fichiers modifiés: aucun problème relevé
- Relecture manuelle: le changement reste limité à `VisitClosingCards` et aux assertions visite
- YAGNI respecté: pas de refactor hors sujet, pas de reconstruction de la feature

## Concerns

- La commande de vérification prescrite ne devient pas totalement verte à cause d’un échec `family` déjà présent et hors périmètre de cette tâche.

## Fix appliqué et preuve de test (couverture demandée)

- Changement: `VisitClosingCards` utilise désormais `etaLikelyCountries` (importé depuis `src/data/visit-fees`) pour déterminer la pastille eTA vs Visa. Le calcul des grilles et la grille d'accompagnants restent basés sur `visitFeesFor`.

Commande de test exécutée:

```
npx vitest run src/features/immigration.test.ts src/lib/visit-cost.test.ts src/data/visit-fees.test.ts
```

Sortie:

```
 RUN  v3.2.7 C:/Users/Admin/Documents/Projets/Projets_Vibe_coding/IR_Immigration_Sale_plateforme

 ✓ src/data/visit-fees.test.ts (3 tests) 4ms
 ✓ src/lib/visit-cost.test.ts (3 tests) 4ms
 ✓ src/features/immigration.test.ts (16 tests) 14ms

 Test Files  3 passed (3)
      Tests  22 passed (22)
   Start at  17:29:25
   Duration  7.30s (transform 1.91s, setup 0ms, collect 5.60s, tests 22ms, environment 4.76s, prepare 573ms)

```

Rapport mis à jour.
