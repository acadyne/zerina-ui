// src/core/dom/useViewportSize.ts
import React from "react";

export interface ViewportSize {
  width: number;
  height: number;
}

export function getViewportSize(): ViewportSize {
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

export function useViewportSize(options: { ssrSafe?: boolean } = {}): ViewportSize {
  const { ssrSafe = false } = options;

  const [viewportSize, setViewportSize] = React.useState<ViewportSize>(() => {
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

    if (window.visualViewport) {
      window.visualViewport.addEventListener("resize", update);
    }

    return () => {
      window.removeEventListener("resize", update);

      if (window.visualViewport) {
        window.visualViewport.removeEventListener("resize", update);
      }
    };
  }, []);

  return viewportSize;
}