// src/core/dom/useElementSize.ts
import React from "react";

export interface ElementSize {
  width: number;
  height: number;
}

const EMPTY_ELEMENT_SIZE: ElementSize = {
  width: 0,
  height: 0,
};

export function getElementSize(
  node: HTMLElement | null
): ElementSize {
  if (!node) {
    return EMPTY_ELEMENT_SIZE;
  }

  const rect = node.getBoundingClientRect();

  return {
    width: rect.width,
    height: rect.height,
  };
}

/**
 * Obtiene el tamaño de layout sin incorporar transformaciones CSS.
 *
 * Es útil para elementos escalados o trasladados mediante transform.
 */
export function getElementLayoutSize(
  node: HTMLElement | null
): ElementSize {
  if (!node) {
    return EMPTY_ELEMENT_SIZE;
  }

  const rect = node.getBoundingClientRect();

  return {
    width: node.offsetWidth || rect.width,
    height: node.offsetHeight || rect.height,
  };
}

export function observeElementSizes(
  nodes: Iterable<HTMLElement>,
  onChange: () => void
): () => void {
  const elements = Array.from(nodes);

  if (
    elements.length === 0 ||
    typeof ResizeObserver === "undefined"
  ) {
    return () => {
      // noop
    };
  }

  const observer = new ResizeObserver(() => {
    onChange();
  });

  elements.forEach((element) => {
    observer.observe(element);
  });

  return () => {
    observer.disconnect();
  };
}

function areElementSizesEqual(
  current: ElementSize,
  next: ElementSize
): boolean {
  return (
    current.width === next.width &&
    current.height === next.height
  );
}

export function useElementSize<
  TElement extends HTMLElement,
>() {
  const ref = React.useRef<TElement | null>(null);

  const [size, setSize] =
    React.useState<ElementSize>(
      EMPTY_ELEMENT_SIZE
    );

  const update = React.useCallback(() => {
    const nextSize = getElementSize(
      ref.current
    );

    setSize((currentSize) =>
      areElementSizesEqual(
        currentSize,
        nextSize
      )
        ? currentSize
        : nextSize
    );
  }, []);

  React.useLayoutEffect(() => {
    const node = ref.current;

    if (!node) {
      return;
    }

    update();

    return observeElementSizes(
      [node],
      update
    );
  }, [update]);

  return [ref, size] as const;
}