# Pitch mosaïque clicable — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Sur la slide `africa-mosaic`, chaque carte ouvre un drawer latéral avec stats + presse (même moteur que Opportunités).

**Architecture:** Mapping titre carte → `OpportunityThemeId` ; `opportunityPanel(theme, profile)` ; réutiliser `ProofDrawer` extrait en composant partagé.

**Tech Stack:** React, Vitest, modules existants `opportunity-proof` / `opportunity-panel`

## Global Constraints

- Réutiliser les articles presse et builders existants (pas de nouvelles URLs inventées)
- Disclaimer : `Sources publiques. Aperçu de démonstration, pas un diagnostic.`
- Mapping fixe : ÉTUDIER→study, TRAVAILLER→employment, ENTREPRENDRE→business, S’INSTALLER→nationality
- Pas de tutoiement commercial ; pas de promesse de nationalité automatique

---

### Task 1: Mapping + tests

**Files:**
- Create: `src/lib/pitch-mosaic-theme.ts`
- Create: `src/lib/pitch-mosaic-theme.test.ts`

- [ ] Write failing tests for `pitchMosaicTheme(title)` mapping the 4 titres
- [ ] Implement mapping helper
- [ ] Run tests

### Task 2: Extraire ProofDrawer + brancher AfricaMosaic

**Files:**
- Create: `src/components/ui/proof-drawer.tsx` (extraire depuis africa.tsx)
- Modify: `src/features/africa.tsx` (importer ProofDrawer)
- Modify: `src/features/africa-pitch-deck.tsx` (AfricaMosaic cliquable)
- Modify: `src/features/africa-pitch-deck.test.ts`

- [ ] Extraire ProofDrawer vers composant partagé acceptant `ProofPanel`
- [ ] AfricaMosaic : useState theme, buttons, Escape, drawer, hint « Cliquez une carte… »
- [ ] Tests source : contient opportunityPanel / aria-expanded / ProofDrawer
- [ ] Run tests
