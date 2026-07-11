// src/core/dom/useViewportSize.ts

import React from "react";

export interface ViewportSize {
  width: number;
  height: number;
}

function getViewportSize(): ViewportSize {
  if (typeof window === "undefined") {
    return {
      width: 0,
      height: 0,
    };
  }

  return {
    width: window.innerWidth,
    height: window.innerHeight,
  };
}

export interface UseViewportSizeOptions {
  ssrSafe?: boolean;
}

export function useViewportSize(
  options: UseViewportSizeOptions = {}
): ViewportSize {
  const { ssrSafe = false } = options;

  const [viewportSize, setViewportSize] =
    React.useState<ViewportSize>(() => {
      if (ssrSafe) {
        return {
          width: 0,
          height: 0,
        };
      }

      return getViewportSize();
    });

  React.useEffect(() => {
    if (typeof window === "undefined") return;

    const update = () => {
      setViewportSize(getViewportSize());
    };

    update();

    window.addEventListener("resize", update);

    const visualViewport = window.visualViewport;

    visualViewport?.addEventListener("resize", update);

    return () => {
      window.removeEventListener("resize", update);
      visualViewport?.removeEventListener("resize", update);
    };
  }, []);

  return viewportSize;
}