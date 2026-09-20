# Cohérence Travail dans le deck (hors Pitch)

Date: 2026-09-19

## Décision

Rendre le menu (sauf Pitch) pertinent pour closer un dossier **Travail** : recherche CNP / FEER, permis ouvert vs fermé, renouvellement, RP après une période d’expérience canadienne autorisée, puis frais, coût de vie, fonds jusqu’au premier salaire, débouché, et conjoint si le FEER / volet IRCC l’ouvre.

`slideCount` Voies reste **2**. Pitch **inchangé**.

Réutiliser `canadaLivePagesFor(profile)` et `s.draft`. Ne pas créer un parallèle.

## Profil

Champs sur le Candidat seulement, visibles si `objective === "Travail"` :

- `workNocCode`: `""` (code CNP 2021 à 5 chiffres)
- `workPermitKind`: `"" | "lmia" | "imp" | "open" | "ict" | "iec"`
- `workHasOffer`: `boolean`

La barre de recherche FEER est le champ principal. Choisir un résultat écrit `workNocCode`. Le FEER se dérive du catalogue (2e chiffre CNP 2021).

Le métier du profil n’écrase pas la CNP. Le conjoint n’a pas de CNP obligatoire.

Normaliser dans `normalizeProfile` : `workNocCode` vide ou 5 chiffres ; code inconnu → `""`.

## Données

- `noc-2021.ts` : groupes de base CNP 2021, `sourceUrl` + `retrievedAt: "2026-09-19"`
- `work-permits.ts` / `work-fees.ts` / `ircc-work-rules.ts` : permis, frais IRCC, CEC, SOWP
- Helper `workPathways(profile)` : FEER, permis possibles, renouvellement, RP après période, SOWP
- Helper `workCost(profile)` : frais, vie, fonds 3 mois, salaire, écart, conjoint si SOWP

Chaque règle porte `sourceUrl` + `retrievedAt: "2026-09-19"`. Mention : aperçu de closing, pas un avis juridique.

## Fiche Permis de travail

Si `route.id === "work"` :

1. Barre FEER + légende + lien IRCC
2. Permis · Ouvert ou fermé
3. Renouvellement (quand déposer, ce qui reste permis, frais)
4. Vers la RP · Après une période (CEC 12 mois si FEER 0–3, sinon PCP)
5. Année 1 · Foyer
6. Pendant le permis · Conjoint si couple et SOWP IRCC

## Autres rubriques

Draft en direct (`s.draft`) via `closingDeckPills(profile)` : pastille `CNP · FEER n` si une CNP est choisie.

- Canada Live : stats travailleurs (permis, EIMT/ouvert, CEC, CNP du dossier)
- Calculateurs · Budget : Frais de permis, Coût de vie (année 1), Fonds jusqu’au 1er salaire
- Emplois / Salaires : conjoint en `openWork` seulement si SOWP
- Opportunités : garder `WorkBenefitsSection` ; ne pas promettre le SOWP hors règle IRCC
- Échecs : `employability` ; FEER 4–5 : la CEC ne s’applique pas
- Provinces / Comparateur / Écosystème : pastille Travail / FEER

## Hors scope

Pitch. Visite / Regroupement / Affaires / Études / RP comme passe menu dédiée (leurs overlays menu partagent le même helper). Pas de simulateur EIMT, pas de score CRS.
