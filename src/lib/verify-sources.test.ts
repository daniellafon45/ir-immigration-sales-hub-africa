import { describe, expect, it } from "vitest";
import { catalogSourceUrls, checkSources, fingerprint } from "@/lib/verify-sources";

const page = (body: string, status = 200) => ({ ok: status < 400, status, text: async () => body });

describe("checkSources", () => {
  it("reports dead links, changed pages and unchanged pages", async () => {
    const fetchImpl = (async (url: string) => {
      if (url.endsWith("/dead")) return page("", 404);
      if (url.endsWith("/changed")) return page("<main>Nouvelles règles 2027</main>");
      return page("<main>Règles stables</main>");
    }) as unknown as typeof fetch;
    const previous = {
      "https://x.ca/changed": fingerprint("<main>Anciennes règles</main>"),
      "https://x.ca/same": fingerprint("<main>Règles stables</main>"),
    };
    const report = await checkSources(["https://x.ca/dead", "https://x.ca/changed", "https://x.ca/same", "https://x.ca/new"], {
      fetchImpl,
      previous,
    });
    expect(report.dead.map((d) => d.url)).toEqual(["https://x.ca/dead"]);
    expect(report.changed).toEqual(["https://x.ca/changed"]);
    expect(report.unchanged).toEqual(["https://x.ca/same"]);
    expect(report.firstSeen).toEqual(["https://x.ca/new"]);
    expect(report.state["https://x.ca/changed"]).toBe(fingerprint("<main>Nouvelles règles 2027</main>"));
  });

  it("treats a network error as a dead link without stopping", async () => {
    const fetchImpl = (async (url: string) => {
      if (url.endsWith("/boom")) throw new Error("ECONNRESET");
      return page("ok");
    }) as unknown as typeof fetch;
    const report = await checkSources(["https://x.ca/boom", "https://x.ca/ok"], { fetchImpl, previous: {} });
    expect(report.dead[0]).toMatchObject({ url: "https://x.ca/boom" });
    expect(report.firstSeen).toEqual(["https://x.ca/ok"]);
  });

  it("ignores volatile markup (scripts, dates) when fingerprinting", () => {
    const a = "<main>Règle</main><script>var t=1</script><time>2026-10-18</time>";
    const b = "<main>Règle</main><script>var t=2</script><time>2026-10-19</time>";
    expect(fingerprint(a)).toBe(fingerprint(b));
  });
});

describe("catalogSourceUrls", () => {
  it("collects every official URL of the catalog, without duplicates", () => {
    const urls = catalogSourceUrls();
    expect(urls.length).toBeGreaterThan(20);
    expect(new Set(urls).size).toBe(urls.length);
    expect(urls.every((u) => u.startsWith("https://"))).toBe(true);
  });

  it("also checks the press articles shown in the failures section", () => {
    expect(catalogSourceUrls()).toContain("https://www150.statcan.gc.ca/n1/daily-quotidien/261009/dq261009a-fra.htm");
  });
});
