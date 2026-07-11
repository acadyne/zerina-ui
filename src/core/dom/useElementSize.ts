// src/core/dom/useElementSize.ts
import React from "react";

export interface ElementSize {
  width: number;
  height: number;
}

function measureElement(node: HTMLElement | null): ElementSize {
  if (!node) {
    return {
      width: 0,
      height: 0,
    };
  }

  const rect = node.getBoundingClientRect();

  return {
    width: Math.round(rect.width),
    height: Math.round(rect.height),
  };
}

function areElementSizesEqual(a: ElementSize, b: ElementSize): boolean {
  return a.width === b.width && a.height === b.height;
}

export function useElementSize<TElement extends HTMLElement>() {
  const ref = React.useRef<TElement | null>(null);
  const [size, setSize] = React.useState<ElementSize>({
    width: 0,
    height: 0,
  });

  const update = React.useCallback(() => {
    const nextSize = measureElement(ref.current);

    setSize((currentSize) =>
      areElementSizesEqual(currentSize, nextSize) ? currentSize : nextSize
    );
  }, []);

  React.useLayoutEffect(() => {
    const node = ref.current;
    if (!node) return;

    update();

    if (typeof ResizeObserver === "undefined") {
      return;
    }

    const observer = new ResizeObserver(() => {
      update();
    });

    observer.observe(node);

    return () => {
      observer.disconnect();
    };
  }, [update]);

  return [ref, size] as const;
}