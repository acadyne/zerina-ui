// src/core/dom/useElementRect.ts
import React from "react";

export interface ElementRect {
  top: number;
  right: number;
  bottom: number;
  left: number;
  width: number;
  height: number;
}

export interface UseElementRectOptions {
  enabled?: boolean;
  observeScroll?: boolean;
}

export const EMPTY_ELEMENT_RECT: ElementRect = {
  top: 0,
  right: 0,
  bottom: 0,
  left: 0,
  width: 0,
  height: 0,
};

export function getElementRect(
  node: HTMLElement | null
): ElementRect {
  if (!node) {
    return EMPTY_ELEMENT_RECT;
  }

  const rect =
    node.getBoundingClientRect();

  return {
    top: rect.top,
    right: rect.right,
    bottom: rect.bottom,
    left: rect.left,
    width: rect.width,
    height: rect.height,
  };
}

function areElementRectsEqual(
  current: ElementRect,
  next: ElementRect
): boolean {
  return (
    current.top === next.top &&
    current.right === next.right &&
    current.bottom === next.bottom &&
    current.left === next.left &&
    current.width === next.width &&
    current.height === next.height
  );
}

export function useElementRect<
  TElement extends HTMLElement,
>(
  ref: React.RefObject<TElement | null>,
  {
    enabled = true,
    observeScroll = true,
  }: UseElementRectOptions = {}
): ElementRect {
  const [rect, setRect] =
    React.useState<ElementRect>(
      EMPTY_ELEMENT_RECT
    );

  const frameRef =
    React.useRef<number | null>(
      null
    );

  const update = React.useCallback(() => {
    const nextRect =
      getElementRect(
        ref.current
      );

    setRect((currentRect) =>
      areElementRectsEqual(
        currentRect,
        nextRect
      )
        ? currentRect
        : nextRect
    );
  }, [ref]);

  const scheduleUpdate =
    React.useCallback(() => {
      if (
        typeof window ===
        "undefined"
      ) {
        return;
      }

      if (
        frameRef.current !==
        null
      ) {
        return;
      }

      frameRef.current =
        window.requestAnimationFrame(
          () => {
            frameRef.current =
              null;

            update();
          }
        );
    }, [update]);

  React.useLayoutEffect(() => {
    if (!enabled) {
      setRect(
        EMPTY_ELEMENT_RECT
      );

      return;
    }

    const node =
      ref.current;

    if (!node) {
      setRect(
        EMPTY_ELEMENT_RECT
      );

      return;
    }

    update();

    const resizeObserver =
      typeof ResizeObserver !==
      "undefined"
        ? new ResizeObserver(
            scheduleUpdate
          )
        : null;

    resizeObserver?.observe(node);

    window.addEventListener(
      "resize",
      scheduleUpdate
    );

    const visualViewport =
      window.visualViewport;

    visualViewport?.addEventListener(
      "resize",
      scheduleUpdate
    );

    visualViewport?.addEventListener(
      "scroll",
      scheduleUpdate
    );

    if (observeScroll) {
      window.addEventListener(
        "scroll",
        scheduleUpdate,
        true
      );
    }

    return () => {
      resizeObserver?.disconnect();

      window.removeEventListener(
        "resize",
        scheduleUpdate
      );

      visualViewport?.removeEventListener(
        "resize",
        scheduleUpdate
      );

      visualViewport?.removeEventListener(
        "scroll",
        scheduleUpdate
      );

      if (observeScroll) {
        window.removeEventListener(
          "scroll",
          scheduleUpdate,
          true
        );
      }

      if (
        frameRef.current !==
        null
      ) {
        window.cancelAnimationFrame(
          frameRef.current
        );

        frameRef.current =
          null;
      }
    };
  }, [
    enabled,
    observeScroll,
    ref,
    scheduleUpdate,
    update,
  ]);

  return rect;
}