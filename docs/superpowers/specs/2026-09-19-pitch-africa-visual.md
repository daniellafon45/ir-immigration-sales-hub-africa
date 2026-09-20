# Pitch Afrique — refonte visuelle anti déjà-vu

## Intent

Pitch pré-RDV pour partenaires Afrique : **layouts et images distincts** du deck commercial post-RDV, pour éviter le sentiment de déjà-vu.

## Direction

Foyer Afrique → Canada (similarity) : scènes concrètes diaspora ouest-africaine (consultation, logement, emploi, départ).

## Stack

- Data : `src/data/pitch-africa.ts`
- Layouts : `src/features/africa-pitch-deck.tsx` (`africa-*`)
- Assets : `src/assets/pitch-africa/`
- Entry : `PitchSection` → `AfricaPitchDeck`

## Interdits

Ne pas réimporter dans le pitch Afrique : `slide-01`, skyline couple CA, `emploi-sante`, `demo-aines`, cartes `problem-*` du deck CA.

## CTA

Prendre rendez-vous → https://ir-immigration.com/
