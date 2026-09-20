import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeAll, describe, expect, it } from "vitest";
import HoverRevealCards from "@/components/ui/cards";

beforeAll(() => {
  (globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;
});

describe("HoverRevealCards", () => {
  let root: Root | undefined;
  let host: HTMLDivElement | undefined;

  afterEach(() => {
    act(() => root?.unmount());
    host?.remove();
  });

  it("paints the photo as a CSS background and falls back when the image errors", () => {
    host = document.createElement("div");
    document.body.appendChild(host);
    root = createRoot(host);

    act(() => {
      root!.render(
        <HoverRevealCards
          items={[
            {
              id: 1,
              title: "Québec",
              subtitle: "Château Frontenac",
              imageUrl: "primary.jpg",
              imageFallbacks: ["fallback.jpg"],
            },
          ]}
        />,
      );
    });

    const button = host.querySelector("button")!;
    expect(button.style.backgroundImage).toContain("primary.jpg");

    const img = host.querySelector("img")!;
    expect(img.getAttribute("src")).toContain("primary.jpg");

    act(() => {
      img.dispatchEvent(new Event("error", { bubbles: true }));
    });

    const after = host.querySelector("img")!;
    expect(after.getAttribute("src")).toContain("fallback.jpg");
    expect(host.querySelector("button")!.style.backgroundImage).toContain("fallback.jpg");
  });
});
