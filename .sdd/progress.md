# SDD progress

Project has no git repository. Commits are skipped on purpose.

Task 1: complete (no commits; review clean; visual check leftDelta=0 rightDelta=0 vs Profil retenu in 2-col and 3-col)

Minor: Chip `cn(..., className)` without trailing comma to satisfy source regex.

# Hide PrincipalPanel scrollbar (2026-09-18)

Plan: `docs/superpowers/plans/2026-09-18-hide-principal-panel-scrollbar.md`
Workspace: in-place (no project git; do not touch `C:/Users/Admin/.git`)

Task 1: complete (no commits, review clean)

Final review: merge-ready (no Critical/Important). Visual: scrollbarWidth=none, gutterPx=0, overflow still works.

Minor (task 1, accepted): source-read test asserts full className string (brittle). Occupation dropdown still shows a scrollbar (out of scope). WebKit `::-webkit-scrollbar:hidden` follows ProfileForm pattern.
