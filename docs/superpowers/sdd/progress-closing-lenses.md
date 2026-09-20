# SDD progress — Closing lenses (hors RP, hors Pitch)

- Workspace: in-place (no project git; do not touch `C:/Users/Admin/.git`)
- Études: already shipped before this ledger
- Profile fields + storage normalize: complete (work/visit/business/family)

Task 1 Travail data: complete (review clean after IEC fix)
Task 2 Visite data: complete (review clean)
Task 3 Affaires data: complete (review clean)
Task 4 Regroupement data: complete (review clean after empty-link + child rprf fix)
Task 5 Profile UI + Voies cards: complete (review clean after permit-neutral + family-delay fix)
Task 6 Menu: complete (review clean after Ecosystem province-pill fix)

Final whole-branch review: **SHIP** (`docs/superpowers/sdd/review-branch-closing-lenses.md`) — 0 Critical, 0 Important
Suite: 512/512
Browser: Profil + Voies Travail FEER 21232 ; Visite bullets/budget ; Affaires C11 ; Couple + Regroupement liens

Deferred minors (post-ship, do not block):
- Affaires startup test is comment-string
- NocSearchField has no interaction test
- Ecosystem pills test does not lock `not.toContain("market.province")`
