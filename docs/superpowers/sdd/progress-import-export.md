# SDD progress — Import / export profil client

- Plan: `docs/superpowers/plans/2026-09-18-import-export-profil-client.md`
- Spec: `docs/superpowers/specs/2026-09-18-import-export-profil-client-design.md`
- Workspace: in-place (no project git; do not touch `C:/Users/Admin/.git`)
- Tasks: 1 codec, 2 store, 3 UI
- Task 1: complete (no commits; review clean)
- Minors to carry to final review: parse n’exige pas `version === 1` (aligné spec: kind + objet profile suffisent)
- Task 2: complete (no commits; review clean)
- Task 3: complete (no commits; review clean)
- Minors: tests source-inspection; downloadJson DOM-only; importError persiste jusqu’au prochain succès
- Final review: ready (no Critical/Important)
- Verification: `npx vitest run` 145/145 pass; import Nadia visible dans le formulaire et le Pitch

