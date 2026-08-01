// src/core/dom/useViewportSize.ts
import React from "react";

export interface ViewportSize {
  width: number;
  height: number;
}

export interface UseViewportSizeOptions {
  ssrSafe?: boolean;
  observeResize?: boolean;
  ownerWindow?: Window | null;
}

function getDefaultWindow(): Window | null {
  return typeof window === "undefined"
    ? null
    : window;
}

export function getViewportSize(
  ownerWindow: Window | null = getDefaultWindow()
): ViewportSize {
  if (!ownerWindow) {
    return {
      width: 0,
      height: 0,
    };
  }

  return {
    width:
      ownerWindow.visualViewport
        ?.width ??
      ownerWindow.innerWidth,

    height:
      ownerWindow.visualViewport
        ?.height ??
      ownerWindow.innerHeight,
  };
}

function areViewportSizesEqual(
  current: ViewportSize,
  next: ViewportSize
): boolean {
  return (
    current.width === next.width &&
    current.height === next.height
  );
}

export function useViewportSize(
  {
    ssrSafe = false,
    observeResize = true,
    ownerWindow,
  }: UseViewportSizeOptions = {}
): ViewportSize {
  const resolvedOwnerWindow =
    ownerWindow === undefined
      ? getDefaultWindow()
      : ownerWindow;

  const [
    viewportSize,
    setViewportSize,
  ] =
    React.useState<ViewportSize>(
      () => {
        if (ssrSafe) {
          return {
            width: 0,
            height: 0,
          };
        }

        return getViewportSize(
          resolvedOwnerWindow
        );
      }
    );

  React.useEffect(() => {
    if (!resolvedOwnerWindow) {
      return;
    }

    const update = () => {
      const nextSize =
        getViewportSize(
          resolvedOwnerWindow
        );

      setViewportSize(
        (currentSize) =>
          areViewportSizesEqual(
            currentSize,
            nextSize
          )
            ? currentSize
            : nextSize
      );
    };

    update();

    if (!observeResize) {
      return;
    }

    resolvedOwnerWindow.addEventListener(
      "resize",
      update
    );

    const visualViewport =
      resolvedOwnerWindow.visualViewport;

    visualViewport?.addEventListener(
      "resize",
      update
    );

    return () => {
      resolvedOwnerWindow.removeEventListener(
        "resize",
        update
      );

      visualViewport?.removeEventListener(
        "resize",
        update
      );
    };
  }, [observeResize, resolvedOwnerWindow]);

  return viewportSize;
}
