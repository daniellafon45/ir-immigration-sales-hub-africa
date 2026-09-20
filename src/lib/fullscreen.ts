type FullscreenTarget = {
  requestFullscreen: () => Promise<void>;
};

type FullscreenDoc = {
  fullscreenElement: Element | null;
  exitFullscreen: () => Promise<void>;
};

export function isFullscreenActive(doc: Pick<FullscreenDoc, "fullscreenElement"> = document) {
  return Boolean(doc.fullscreenElement);
}

export async function toggleFullscreen(
  target: FullscreenTarget = document.documentElement,
  doc: FullscreenDoc = document,
) {
  if (doc.fullscreenElement) {
    await doc.exitFullscreen();
    return;
  }
  await target.requestFullscreen();
}
