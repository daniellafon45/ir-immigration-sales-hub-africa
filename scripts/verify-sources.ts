// Usage : npm run verify:sources — à lancer chaque semaine.
// Signale les liens officiels morts et les pages modifiées depuis la dernière vérification.
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { stalePressArticles } from "../src/lib/failure-press";
import { catalogSourceUrls, checkSources, type SourceState } from "../src/lib/verify-sources";

const STATE_FILE = "scripts/sources-state.json";

const previous: SourceState = existsSync(STATE_FILE) ? JSON.parse(readFileSync(STATE_FILE, "utf8")).state ?? {} : {};
const urls = catalogSourceUrls();
console.log(`Vérification de ${urls.length} sources officielles…`);

const report = await checkSources(urls, { previous });
writeFileSync(STATE_FILE, JSON.stringify({ checkedOn: report.checkedOn, state: report.state }, null, 1));

for (const d of report.dead) console.log(`✗ MORT     ${d.status}  ${d.url}`);
for (const u of report.changed) console.log(`△ MODIFIÉE  ${u}  → relire les règles du catalogue`);
console.log(
  `\n${report.unchanged.length} inchangées · ${report.changed.length} modifiées · ${report.dead.length} mortes · ${report.firstSeen.length} nouvelles (référence enregistrée).`,
);
const stale = stalePressArticles(report.checkedOn);
for (const a of stale) console.log(`⌛ ARTICLE > 12 MOIS  ${a.publishedOn}  ${a.title} → remplacer par une source récente`);
process.exitCode = report.dead.length > 0 ? 1 : 0;
