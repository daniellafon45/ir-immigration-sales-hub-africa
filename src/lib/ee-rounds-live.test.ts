import { describe, expect, it } from "vitest";
import sample from "@/data/fixtures/ee-rounds-sample.json";
import { eeRoundsSnapshot } from "@/data/ee-rounds";
import { loadEeRounds, type KeyValueStore } from "@/lib/ee-rounds-live";

function memoryStore(): KeyValueStore & { data: Record<string, string> } {
  const data: Record<string, string> = {};
  return {
    data,
    getItem: (k) => data[k] ?? null,
    setItem: (k, v) => {
      data[k] = v;
    },
  };
}

const okFetch = (async () => ({ ok: true, json: async () => sample })) as unknown as typeof fetch;
const failFetch = (async () => {
  throw new Error("offline");
}) as unknown as typeof fetch;

describe("loadEeRounds", () => {
  it("returns live IRCC rounds and caches them", async () => {
    const store = memoryStore();
    const result = await loadEeRounds({ fetchImpl: okFetch, store, today: "2026-10-18" });
    expect(result.source).toBe("live");
    expect(result.rounds[0]!.date).toBe("2026-10-16");
    expect(Object.keys(store.data).length).toBe(1);
  });

  it("falls back to the embedded snapshot when IRCC is unreachable", async () => {
    const result = await loadEeRounds({ fetchImpl: failFetch, store: memoryStore(), today: "2026-10-18" });
    expect(result.source).toBe("snapshot");
    expect(result.rounds).toEqual(eeRoundsSnapshot.rounds);
    expect(result.fetchedOn).toBe(eeRoundsSnapshot.fetchedOn);
  });

  it("uses a same-day cache without calling the network", async () => {
    const store = memoryStore();
    await loadEeRounds({ fetchImpl: okFetch, store, today: "2026-10-18" });
    const result = await loadEeRounds({ fetchImpl: failFetch, store, today: "2026-10-18" });
    expect(result.source).toBe("cache");
  });

  it("falls back to the snapshot when the payload is unreadable", async () => {
    const badFetch = (async () => ({ ok: true, json: async () => ({ nope: true }) })) as unknown as typeof fetch;
    const result = await loadEeRounds({ fetchImpl: badFetch, store: memoryStore(), today: "2026-10-18" });
    expect(result.source).toBe("snapshot");
  });

  it("survives a storage that throws", async () => {
    const throwing: KeyValueStore = {
      getItem: () => {
        throw new Error("blocked");
      },
      setItem: () => {
        throw new Error("blocked");
      },
    };
    const result = await loadEeRounds({ fetchImpl: okFetch, store: throwing, today: "2026-10-18" });
    expect(result.source).toBe("live");
  });

  it("bypasses the same-day cache when a refresh is forced", async () => {
    const store = memoryStore();
    await loadEeRounds({ fetchImpl: okFetch, store, today: "2026-10-18" });
    let calls = 0;
    const counting = (async () => {
      calls += 1;
      return { ok: true, json: async () => sample };
    }) as unknown as typeof fetch;
    const result = await loadEeRounds({ fetchImpl: counting, store, today: "2026-10-18", force: true });
    expect(calls).toBe(1);
    expect(result.source).toBe("live");
  });
});
