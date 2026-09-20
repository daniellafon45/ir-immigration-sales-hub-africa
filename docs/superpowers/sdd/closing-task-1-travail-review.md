## Spec Compliance
Conforme au brief de re-review ciblee. Les deux findings Important precedents sont corriges dans le code actuellement sur disque, et le gap de couverture Minor demande a bien ete comble. Verdict fonde sur le brief, le package de re-review, le report mis a jour et la lecture du code/tests presents, sans relancer la suite conformement a l’instruction.

## Strengths
- `src/lib/work-pathways.ts` ne vend plus `iec` comme un permis ferme au renouvellement: `closedKeepsSameEmployer` est desormais `false` et `openCanChangeEmployer` `true`, tout en conservant `permits[].openVsClosed === "varies"` dans le catalogue retourne.
- `src/data/work-fees.ts` applique desormais `openHolderFee` a `iec`, ce qui aligne bien le defaut sales deck sur `155 + 100 + biometrics`.
- Les tests ajoutes sont cibles et utiles: un test dedie au renouvellement IEC, un test dedie aux frais IEC, et un test positif SOWP sur la CNP `33102`, exactement sur les branches qui avaient manque au premier passage.

## Issues Critical
- Aucun.

## Issues Important
- Aucun.

## Issues Minor
- Aucun dans le perimetre de cette re-review.

## Assessment
Approved.
