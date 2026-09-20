### Spec Compliance
- ✅ Spec compliant
- ⚠️ Cannot verify from diff: the claimed RED/GREEN execution order, the exact failing/passing Vitest runs, and the reported lint status are supported only by the implementer's report, not by the diff itself.

### Strengths
- The implementation matches the brief exactly: correct file paths, exported types, `householdSalaries(profile)` signature, and the required per-adult mapping from `householdMarket(profile).adults`.
- The salary-band fallback and net calculations are wired exactly as requested: `salaryData[profession] ?? salaryData.Comptable`, `netEstimate(adult.mid, provinceCode(profile.province))`, and `Math.round(netAnnual / 12)`.
- The tests cover all required scenarios from the brief: default couple Comptable/Développeur, `Seul(e)`, unknown profession fallback, and Ontario net-rate behavior.
- The helper is well factored because it reuses existing domain helpers from `household-market`, `finance`, and `provinces` instead of duplicating market or salary logic.
- Based on the provided diff, none of the forbidden files were modified, and `src/data/salaries.ts` remains unchanged.

### Issues (Critical / Important / Minor)
- Critical: None.
- Important: None.
- Minor: None.

### Assessment
**Task quality:** Approved
