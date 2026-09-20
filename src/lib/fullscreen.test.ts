import { describe, expect, it, vi } from "vitest";
import { isFullscreenActive, toggleFullscreen } from "@/lib/fullscreen";

describe("toggleFullscreen", () => {
  it("requests fullscreen when nothing is active", async () => {
    const requestFullscreen = vi.fn().mockResolvedValue(undefined);
    const doc = { fullscreenElement: null, exitFullscreen: vi.fn() };
    await toggleFullscreen({ requestFullscreen }, doc);
    expect(requestFullscreen).toHaveBeenCalledOnce();
    expect(doc.exitFullscreen).not.toHaveBeenCalled();
  });

  it("exits fullscreen when already active", async () => {
    const requestFullscreen = vi.fn();
    const doc = {
      fullscreenElement: {} as Element,
      exitFullscreen: vi.fn().mockResolvedValue(undefined),
    };
    await toggleFullscreen({ requestFullscreen }, doc);
    expect(doc.exitFullscreen).toHaveBeenCalledOnce();
    expect(requestFullscreen).not.toHaveBeenCalled();
  });

  it("reports whether fullscreen is active", () => {
    expect(isFullscreenActive({ fullscreenElement: null })).toBe(false);
    expect(isFullscreenActive({ fullscreenElement: {} as Element })).toBe(true);
  });
});
