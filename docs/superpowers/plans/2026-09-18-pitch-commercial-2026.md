# Pitch commercial 2026 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remplacer le Pitch du hub par les 14 diapositives de la présentation commerciale IR 2026, textes identiques, photos actuelles conservées.

**Architecture:** Extraire les photos larges du HTML vers `src/assets/pitch/`. Le copy vit dans `src/data/pitch.ts`. `PitchSection` rend un canvas plein écran (pas le `Slide` kicker générique). Les helpers `RiskGrid`, `TwoFutures`, `Installments` restent exportés pour `sales.tsx`.

**Tech Stack:** React 19, Vite 7, Vitest 3, TypeScript, Tailwind 4.

## Global Constraints

- 14 slides, copy verbatim de la présentation 2026.
- Pas de personnalisation `{name}` / métier / province dans le Pitch.
- Photos actuelles du HTML ; pas de nouvelles images.
- Conserver `export function RiskGrid`, `TwoFutures`, `Installments` dans `src/features/pitch.tsx`.
- `catalog.ts` : `pitch.slideCount` = 14.
- Pas de commit git. Pas de nouvelle dépendance npm.

---

### Task 1: Données + photos

**Files:**
- Create: `src/data/pitch.ts`
- Create: `src/data/pitch.test.ts`
- Create: `src/assets/pitch/*.jpg` (photos larges extraites)
- Modify: `src/catalog.ts` (`slideCount: 14`)

**Produces:** `pitchSlides` array length 14, `pitchSlides[0].title === "VOTRE PROJET CANADA COMMENCE ICI"`

- [ ] Test: 14 slides, premier titre, catalog = 14
- [ ] Extraire les images width >= 200 px du HTML
- [ ] Implémenter `src/data/pitch.ts`

### Task 2: Rendu Pitch

**Files:**
- Modify: `src/features/pitch.tsx`
- Create: `src/features/pitch-deck.tsx` si le fichier dépasse ~400 lignes

**Produces:** `PitchSection` affiche `pitchSlides[slideIndex]` en plein canvas, logo IR, contact.

- [ ] Test source: plus de « Faire rêver » dans PitchSection
- [ ] Layouts hero / split / stats / grid / cta
- [ ] Vérifier dans le navigateur les 14 slides + flèches + `1 / 14`
