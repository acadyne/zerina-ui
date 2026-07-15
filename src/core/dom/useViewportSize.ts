// src/core/dom/useViewportSize.ts
import React from "react";

export interface ViewportSize {
  width: number;
  height: number;
}

export interface UseViewportSizeOptions {
  ssrSafe?: boolean;
  observeResize?: boolean;
}

export function getViewportSize(): ViewportSize {
  if (
    typeof window ===
    "undefined"
  ) {
    return {
      width: 0,
      height: 0,
    };
  }

  return {
    width:
      window.visualViewport
        ?.width ??
      window.innerWidth,

    height:
      window.visualViewport
        ?.height ??
      window.innerHeight,
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
  }: UseViewportSizeOptions = {}
): ViewportSize {
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

        return getViewportSize();
      }
    );

  React.useEffect(() => {
    if (
      typeof window ===
      "undefined"
    ) {
      return;
    }

    const update = () => {
      const nextSize =
        getViewportSize();

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

    window.addEventListener(
      "resize",
      update
    );

    const visualViewport =
      window.visualViewport;

    visualViewport?.addEventListener(
      "resize",
      update
    );

    return () => {
      window.removeEventListener(
        "resize",
        update
      );

      visualViewport?.removeEventListener(
        "resize",
        update
      );
    };
  }, [observeResize]);

  return viewportSize;
}