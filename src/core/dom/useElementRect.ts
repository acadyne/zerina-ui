// src/core/dom/useElementRect.ts
import React from "react";
import { useIsomorphicLayoutEffect } from "../react/useIsomorphicLayoutEffect";

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
  observeResize?: boolean;
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
    observeResize = true,
    observeScroll = true,
  }: UseElementRectOptions = {}
): ElementRect {
  const [rect, setRect] =
    React.useState<ElementRect>(
      EMPTY_ELEMENT_RECT
    );

  const frameRef = React.useRef<{
    ownerWindow: Window;
    id: number;
  } | null>(null);

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
      const ownerWindow =
        ref.current?.ownerDocument.defaultView;

      if (!ownerWindow) {
        return;
      }

      if (
        frameRef.current !==
        null
      ) {
        return;
      }

      const id = ownerWindow.requestAnimationFrame(() => {
        frameRef.current = null;
        update();
      });

      frameRef.current = {
        ownerWindow,
        id,
      };
    }, [ref, update]);

  useIsomorphicLayoutEffect(() => {
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

    const ownerWindow =
      node.ownerDocument.defaultView;

    if (!ownerWindow) {
      setRect(
        EMPTY_ELEMENT_RECT
      );

      return;
    }

    update();

    const ResizeObserverConstructor =
      ownerWindow.ResizeObserver;

    const resizeObserver =
      observeResize &&
      typeof ResizeObserverConstructor !==
        "undefined"
        ? new ResizeObserverConstructor(
            scheduleUpdate
          )
        : null;

    resizeObserver?.observe(node);

    if (observeResize) {
      ownerWindow.addEventListener(
        "resize",
        scheduleUpdate
      );
    }

    const visualViewport =
      ownerWindow.visualViewport;

    if (observeResize) {
      visualViewport?.addEventListener(
        "resize",
        scheduleUpdate
      );
    }

    if (observeScroll) {
      ownerWindow.addEventListener(
        "scroll",
        scheduleUpdate,
        true
      );

      visualViewport?.addEventListener(
        "scroll",
        scheduleUpdate
      );
    }

    return () => {
      resizeObserver?.disconnect();

      if (observeResize) {
        ownerWindow.removeEventListener(
          "resize",
          scheduleUpdate
        );

        visualViewport?.removeEventListener(
          "resize",
          scheduleUpdate
        );
      }

      if (observeScroll) {
        ownerWindow.removeEventListener(
          "scroll",
          scheduleUpdate,
          true
        );

        visualViewport?.removeEventListener(
          "scroll",
          scheduleUpdate
        );
      }

      const pendingFrame =
        frameRef.current;

      if (pendingFrame !== null) {
        pendingFrame.ownerWindow.cancelAnimationFrame(
          pendingFrame.id
        );

        frameRef.current =
          null;
      }
    };
  }, [
    enabled,
    observeResize,
    observeScroll,
    ref,
    scheduleUpdate,
    update,
  ]);

  return rect;
}
