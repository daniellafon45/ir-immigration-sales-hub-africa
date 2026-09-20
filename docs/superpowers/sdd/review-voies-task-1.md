# Revue — Voies Task 1

Spec : ✅  
Qualité de la tâche : Approved  

Critiques : 0  
Importantes : 0  
Mineures : 0  

## Synthèse

- Les données `routes` contiennent bien 8 voies, incluant `visit` et `asylum`, et chaque voie possède au moins une condition.
- Les données `routeBridges` définissent exactement 8 passerelles, avec le pont `visit-asylum` et l’avertissement textuel exact : « L’asile protège. Ce n’est pas un plan B économique. ».
- Les mappings de `routeForObjective` couvrent les objectifs attendus (`Résidence permanente`, `Études`, `Travail`, `Visite`, `Affaires`, `Regroupement familial`) et renvoient les ids de voies spécifiés.
- `bridgesFrom("visit")` renvoie bien `["study", "work", "asylum"]`, et aucune logique supplémentaire ne modifie cet ordre.
- Aucun fichier d’interface n’a été modifié dans cette tâche ; seules les données (`routes.ts`/`routeBridges`) et le helper pur (`route-paths.ts` + tests) ont été livrés conformément au plan.
