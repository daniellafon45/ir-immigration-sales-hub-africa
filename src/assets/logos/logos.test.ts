import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const logosDir = resolve(process.cwd(), "src/assets/logos");
const PNG_MAGIC = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

const files = ["logo-ir-bleu.png", "logo-ir-blanc.png", "logo-ir-noir.png"] as const;

describe("official IR logos", () => {
  it.each(files)("stores %s as a real PNG", (name) => {
    const path = resolve(logosDir, name);
    expect(existsSync(path)).toBe(true);
    const buf = readFileSync(path);
    expect(buf.subarray(0, 8).equals(PNG_MAGIC)).toBe(true);
    expect(buf.byteLength).toBeGreaterThan(8_000);
  });
});
