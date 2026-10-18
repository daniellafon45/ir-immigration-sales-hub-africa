import { useCallback, useEffect, useState } from "react";
import { EE_ROUNDS_URL, eeRoundsSnapshot, parseEeRounds, type EeRound } from "@/data/ee-rounds";

export type KeyValueStore = Pick<Storage, "getItem" | "setItem">;

export type EeRoundsResult = {
  rounds: EeRound[];
  /** live : lu chez IRCC ; cache : lu aujourd’hui ; snapshot : données intégrées. */
  source: "live" | "cache" | "snapshot";
  fetchedOn: string;
};

const CACHE_KEY = "ir-ee-rounds-v1";
const TIMEOUT_MS = 8000;

function readCache(store: KeyValueStore | undefined, today: string): EeRoundsResult | null {
  try {
    const raw = store?.getItem(CACHE_KEY);
    if (!raw) return null;
    const cached = JSON.parse(raw) as { fetchedOn?: string; rounds?: EeRound[] };
    if (cached.fetchedOn !== today || !Array.isArray(cached.rounds) || cached.rounds.length === 0) return null;
    return { rounds: cached.rounds, source: "cache", fetchedOn: today };
  } catch {
    return null;
  }
}

function writeCache(store: KeyValueStore | undefined, today: string, rounds: EeRound[]) {
  try {
    store?.setItem(CACHE_KEY, JSON.stringify({ fetchedOn: today, rounds }));
  } catch {
    // Stockage indisponible (navigation privée, quota) : on continue sans cache.
  }
}

const snapshot = (): EeRoundsResult => ({
  rounds: eeRoundsSnapshot.rounds,
  source: "snapshot",
  fetchedOn: eeRoundsSnapshot.fetchedOn,
});

export async function loadEeRounds({
  fetchImpl = fetch,
  store,
  today = new Date().toISOString().slice(0, 10),
  force = false,
}: { fetchImpl?: typeof fetch; store?: KeyValueStore; today?: string; force?: boolean } = {}): Promise<EeRoundsResult> {
  // `force` : relire IRCC même si les tirages du jour sont déjà en cache (bouton « Actualiser »).
  const cached = force ? null : readCache(store, today);
  if (cached) return cached;
  try {
    const controller = typeof AbortController !== "undefined" ? new AbortController() : null;
    const timer = setTimeout(() => controller?.abort(), TIMEOUT_MS);
    const response = await fetchImpl(EE_ROUNDS_URL, { signal: controller?.signal });
    clearTimeout(timer);
    if (!response.ok) return snapshot();
    const rounds = parseEeRounds(await response.json());
    if (rounds.length === 0) return snapshot();
    writeCache(store, today, rounds);
    return { rounds, source: "live", fetchedOn: today };
  } catch {
    return snapshot();
  }
}

function browserStore(): KeyValueStore | undefined {
  try {
    return typeof localStorage !== "undefined" ? localStorage : undefined;
  } catch {
    return undefined;
  }
}

/** Charge les tirages IRCC une fois ; `refresh` les relit en direct à la demande. */
export function useEeRounds(): EeRoundsResult & { refresh: () => Promise<void>; loading: boolean } {
  const [result, setResult] = useState<EeRoundsResult>(snapshot);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    let alive = true;
    void loadEeRounds({ store: browserStore() }).then((r) => {
      if (alive) setResult(r);
    });
    return () => {
      alive = false;
    };
  }, []);
  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      setResult(await loadEeRounds({ store: browserStore(), force: true }));
    } finally {
      setLoading(false);
    }
  }, []);
  return { ...result, refresh, loading };
}
