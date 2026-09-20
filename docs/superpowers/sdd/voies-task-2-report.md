## Task 2 — RoutesSection chrome + passerelles + détail

### Contexte et objectifs

- Restyler la section **Voies d’immigration** sur le chrome Emplois / Opportunités existant, sans toucher au comparateur.
- Ajouter deux nouveaux niveaux de lecture : les **passerelles** entre statuts (visiteur, études, travail, RP, famille, asile) et une **vue détail** par voie, en s’appuyant sur les structures déjà définies dans `routes` et `routeBridges`.
- Respecter les contraintes de copy (prospect, pas de coaching « Le commercial… » ni de promesse juridique) et garder `voies.slideCount` à 3.

Les données (`src/data/routes.ts`, `src/lib/route-paths.ts`, `src/lib/route-paths.test.ts`) étaient déjà livrées en Task 1 et n’ont pas été modifiées.

### Approche TDD

1. **Création des tests de surface**
   - Ajout de `src/features/immigration.test.ts` en suivant exactement le plan :
     - Vérification du `slideCount` de la section `voies` dans le `catalog` (reste à `3`).
     - Vérification que `RoutesSection` :
       - est exportée (`export function RoutesSection`),
       - réutilise le chrome client (`OpportunitiesShell`) avec les textes exacts :
         - `Une destination. Plusieurs chemins.`
         - `Le chemin dépend du foyer et de l’objectif, pas d’une brochure.`
         - `Un statut n’est pas encore le suivant.`
         - `Chaque passerelle a des conditions. Les sauter coûte des années.`
       - dépend bien d’un `OpportunitiesShell` exporté dans `market.tsx`.
     - Vérification d’hygiène : les helpers `RoutesSection`, `RoutesOverview`, `RoutesBridges`, `RoutesDetail` ne contiennent pas les copies interdites (`Le commercial`, `version connectée`, `conseil juridique automatisé`, `panel=`).
     - Vérification fonctionnelle de surface : présence dans le code de `Objectif`, `Aucune passerelle pour ce point de départ.`, `Voies · Détail`, du disclaimer `Aperçu de démonstration. Pas un avis juridique.`, et des helpers `routeForObjective`, `bridgesFrom`, `Pour qui :`.
   - Lancement des tests ciblés :
     - `npx vitest run src/features/immigration.test.ts src/lib/route-paths.test.ts`
   - **Résultat initial (RED)** :
     - `route-paths.test.ts` passait déjà (hérité de Task 1).
     - `immigration.test.ts` échouait sur :
       - l’absence de `OpportunitiesShell` dans `RoutesSection`,
       - la présence du texte `conseil juridique automatisé` dans l’ancienne implémentation,
       - l’absence des marqueurs de passerelles et de vue détail (`Aucune passerelle…`, `Voies · Détail`, etc.).

2. **Implémentation guidée par les tests**

   **a. Export du chrome Emplois / Opportunités**

   - Fichier : `src/features/market.tsx`
   - Changement minimal, sans toucher au comportement :
     - Passage des helpers internes au statut exporté :
       - `function OpportunitiesShell` → `export function OpportunitiesShell`
       - `function Surface` → `export function Surface`
       - `function SectionLabel` → `export function SectionLabel`
   - Aucun changement de signature ni de JSX interne, pour ne pas impacter Emplois / Salaires / Provinces / Calculateurs.

   **b. Réécriture de RoutesSection sur le chrome Opportunities**

   - Fichier : `src/features/immigration.tsx`

   - **Imports mis à jour** :
     - Ajout :
       - `import { useState } from "react";`
       - `import { routeBridges, routes } from "@/data/routes";`
       - `import { OpportunitiesShell, SectionLabel, Surface } from "@/features/market";`
       - `import { householdMarket } from "@/lib/household-market";`
       - `import { bridgesFrom, routeById, routeForObjective } from "@/lib/route-paths";`
       - `import { cn } from "@/lib/utils";`
     - Conservation :
       - `Card` (toujours utilisé par `CompareSection`),
       - `Slide`, `Timeline` (timeline réutilisée en détail, Slide pour le comparateur),
       - `smart` (uniquement dans `CompareSection`),
       - `useDeckStore`, `useProfileStore`.

   - **Nouveau `RoutesSection` (piloté par le store deck + profil)** :
     - Récupération :
       - `slide` depuis `useDeckStore` (index de slide dans la section),
       - `profile` via `useProfileStore`,
       - `market` via `householdMarket(profile)` pour les pills,
       - `selectedRoute` et `setRoute` depuis le deck store,
       - voie alignée sur l’objectif via `routeForObjective(profile.objective)`,
       - voie active via `routeById(selectedRoute)`, avec fallback sûr garanti par `routeById`.
     - Comportement par slide :
       - **Slide 0** (par défaut) : vue **carte des voies** via `RoutesOverview`.
       - **Slide 1** : vue **passerelles** via `RoutesBridges`.
       - **Slide 2** : vue **détail** via `RoutesDetail`.

   - **`RoutesOverview` — Slide 1 « carte des voies »**
     - Wrapper :
       - `OpportunitiesShell`
         - `kicker="Voies d’immigration"`
         - `title="Une destination. Plusieurs chemins."`
         - `lead="Le chemin dépend du foyer et de l’objectif, pas d’une brochure."`
         - `pills={[market.family, market.province, objective]}`
     - Grid de cartes (`routes`):
       - 4 colonnes XL (`md:grid-cols-2 xl:grid-cols-4`), cartes cliquables.
       - Contenu carte :
         - Tag voie (`item.tag`, uppercase, super bold),
         - Titre (`item.name`),
         - Fit (`item.fit`).
       - Sélection :
         - Utilisation du helper `cn` pour appliquer :
           - si `item.id === selectedId` → bordure primaire + ombre renforcée,
           - sinon → bordure standard avec hover bleu.
       - Badge **Objectif** :
         - Affiché uniquement si `item.id === alignedId`,
         - Copy exacte : `Objectif`.

   - **`RoutesBridges` — Slide 2 « passerelles »**
     - Données :
       - `starts` = ensemble des `from` uniques issus de `routeBridges`.
       - `fromId` en `useState`, initialisé sur `alignedId` (voie alignée à l’objectif).
       - `selectedFrom` = `fromId` si présent dans `starts`, sinon premier de la liste (robuste si l’objectif ne correspond à aucune passerelle).
       - `bridges` = `bridgesFrom(selectedFrom)` (helper pur).
     - Wrapper :
       - `OpportunitiesShell`
         - `kicker="Voies · Passerelles"`
         - `title="Un statut n’est pas encore le suivant."`
         - `lead="Chaque passerelle a des conditions. Les sauter coûte des années."`
         - `pills={[market.family, objective]}`
     - UI :
       - **Filtres de départ** :
         - Boutons chips sur toutes les voies `starts` :
           - Libellé = `routeById(id).name`.
           - Visuel actif / inactif aligné sur les chips existantes (border + bg primaire pour l’actif).
       - **Zone vide** :
         - Si `bridges.length === 0` :
           - paragraphe simple : `Aucune passerelle pour ce point de départ.`
       - **Cartes de passerelles** :
         - Grid 2 colonnes desktop (`lg:grid-cols-2`).
         - Pour chaque `bridge` :
           - Titre contextuel : `{from.name} → {to.name}` (ligne de contexte),
           - Titre principal : `bridge.title`,
           - Liste des `bridge.conditions`,
           - Si `bridge.caution` présent :
             - bandeau de mise en garde, fond orangé, texte en `[#8c5a1d]`.
           - Clic sur la carte :
             - `onOpen(bridge.to)` → connecté à `setRoute` dans `RoutesSection`.
     - Aucun `panel=` ni copy de coaching (« Le commercial », « version connectée », « conseil juridique automatisé »).

   - **`RoutesDetail` — Slide 3 « détail voie »**
     - Données :
       - `route` est le résultat typé de `routeById`, donc toujours défini.
       - `market` pour les pills et le contexte foyer.
     - Wrapper :
       - `OpportunitiesShell`
         - `kicker="Voies · Détail"`
         - `title={route.name}`
         - `lead={`Pour qui : ${route.fit}.`}`
         - `pills={[market.family, route.tag]}`
     - Contenu :
       - Grid 2 colonnes :
         - `Surface` + `SectionLabel` pour chaque bloc :
           - `Conditions` → `route.conditions` (puces `·`).
           - `Points positifs` → `route.positives` (puces `✓` vertes).
           - `Points d’attention` → `route.attention` (puces `⚠` orange).
           - `Étapes` → `Timeline` alimentée par `route.steps`.
       - Disclaimer en dessous :
         - `Aperçu de démonstration. Pas un avis juridique.`

   - **Comparateur inchangé**
     - Le bloc `export function CompareSection()` et son JSX n’ont pas été modifiés, mis à part le fait qu’ils se trouvent maintenant après les nouveaux helpers.
     - On garde :
       - l’utilisation de `Slide`,
       - la copy existante,
       - les imports (`Card`, `smart`, `routes`, stores Profile/Deck).

3. **Validation finale (GREEN)**

- Commande :
  - `npx vitest run src/features/immigration.test.ts src/lib/route-paths.test.ts`
- Résultat :
  - `src/lib/route-paths.test.ts` : 4 tests **OK** (rappel : 8 routes, 8 passerelles, mapping objectifs → voies, helpers de ponts).
  - `src/features/immigration.test.ts` : 4 tests **OK** :
    - `voies catalog` : `slideCount` de `voies` reste à 3.
    - `voies chrome` :
      - `RoutesSection` est bien exportée.
      - Le code contient les phrases exactes attendues pour les 3 slides.
      - `OpportunitiesShell` est bien exporté depuis `market.tsx` et utilisé.
      - Les helpers `RoutesSection`, `RoutesOverview`, `RoutesBridges`, `RoutesDetail` ne contiennent pas de copy interdite ni de `panel=`.
    - `voies boards` :
      - Présence de `Objectif`, `Aucune passerelle pour ce point de départ.`, `Voies · Détail`, `Aperçu de démonstration. Pas un avis juridique.`, `routeForObjective`, `bridgesFrom`, `Pour qui :`.

### Points d’attention et conformités

- **Chrome réutilisé** :
  - `RoutesSection` utilise désormais le même shell que Emplois / Salaires / Provinces (`OpportunitiesShell`, `Surface`, `SectionLabel`), avec les mêmes patterns de grille, pills, et cohérence visuelle.
- **Stores et side-effects** :
  - Aucun setter du store profil n’est utilisé.
  - Seul effet côté deck : `setRoute` pour sélectionner une voie ou ouvrir une passerelle cible.
- **Texte et apostrophes** :
  - UI en français, avec apostrophes typographiques U+2019 dans toutes les chaînes introduites par cette tâche.
  - Les mentions interdites (`Le commercial`, `version connectée`, `conseil juridique automatisé`) sont absentes des nouveaux helpers.
- **Scope respecté** :
  - Données (`routes`, `routeBridges`, `route-paths`) non modifiées.
  - `CompareSection`, Provinces, Calculators, Jobs, Salaries : aucun changement de comportement.
  - Aucun usage de git ni de commandes de gestion de dépôt.

### Limites / sujets éventuels pour la suite

- Les helpers restent purement UI et s’appuient sur les données de démonstration ; si des données IRCC live sont branchées plus tard, il faudra vérifier que la structure `ImmigrationRoute` reste compatible (notamment `conditions`, `positives`, `attention`, `steps`).
- Le mapping `routeForObjective` dépend de la valeur textuelle de `profile.objective` ; si de nouvelles valeurs d’objectif sont introduites, le helper devra être tenu à jour pour garder l’alignement du badge `Objectif`.

