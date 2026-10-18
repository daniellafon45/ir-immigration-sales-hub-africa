import { arrimaSources } from "@/data/arrima";
import { EE_ROUNDS_URL } from "@/data/ee-rounds";
import { failurePress } from "@/data/failures";
import { navigatorSources } from "@/data/navigator-sources";
import { opportunityPrograms } from "@/data/opportunities";

/**
 * Vérification des sources officielles : signale liens morts et pages modifiées.
 * Ne modifie jamais les règles — un humain relit les pages signalées.
 */

export type SourceState = Record<string, string>;

export type SourceReport = {
  dead: { url: string; status: number | string }[];
  changed: string[];
  unchanged: string[];
  firstSeen: string[];
  state: SourceState;
  checkedOn: string;
};

export function catalogSourceUrls(): string[] {
  const urls = new Set<string>();
  for (const p of opportunityPrograms) for (const s of p.sources) urls.add(s.url);
  for (const s of Object.values(navigatorSources)) urls.add(s.url);
  for (const s of arrimaSources) urls.add(s.url);
  urls.add(EE_ROUNDS_URL);
  for (const a of failurePress) urls.add(a.url);
  return [...urls];
}

/** Empreinte du texte utile : ignore scripts, styles, balises et dates. */
export function fingerprint(html: string): string {
  const text = html
    .replace(/<(script|style|noscript)[\s\S]*?<\/\1>/gi, " ")
    .replace(/<time[\s\S]*?<\/time>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\d{4}-\d{2}-\d{2}/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  let hash = 0x811c9dc5;
  for (let i = 0; i < text.length; i += 1) {
    hash ^= text.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193) >>> 0;
  }
  return hash.toString(16).padStart(8, "0");
}

export async function checkSources(
  urls: string[],
  { fetchImpl = fetch, previous = {}, today = new Date().toISOString().slice(0, 10) }: {
    fetchImpl?: typeof fetch;
    previous?: SourceState;
    today?: string;
  } = {},
): Promise<SourceReport> {
  const report: SourceReport = { dead: [], changed: [], unchanged: [], firstSeen: [], state: { ...previous }, checkedOn: today };
  for (const url of urls) {
    try {
      const response = await fetchImpl(url);
      if (!response.ok) {
        report.dead.push({ url, status: response.status });
        continue;
      }
      const print = fingerprint(await response.text());
      const before = previous[url];
      if (!before) report.firstSeen.push(url);
      else if (before === print) report.unchanged.push(url);
      else report.changed.push(url);
      report.state[url] = print;
    } catch (error) {
      report.dead.push({ url, status: error instanceof Error ? error.message : "erreur réseau" });
    }
  }
  return report;
}
