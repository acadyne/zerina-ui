// src/core/viewport/useAdaptiveViewport.ts

import React from "react";
import {
  useElementSize,
  useViewportSize,
} from "../dom";
import {
  useOptionalUIViewport,
} from "./UIViewportProvider";
import type {
  UIViewportBreakpoints,
  UIViewportKind,
  UIViewportMode,
} from "./viewport.types";
import {
  resolveUIViewportBreakpoints,
  resolveUIViewportKind,
} from "./viewport.utils";

export type UIAdaptiveViewportSource =
  | "window"
  | "container";

export type UIAdaptiveViewportMode =
  | UIViewportMode
  | "inherit";

export interface UseAdaptiveViewportOptions {
  source?: UIAdaptiveViewportSource;
  mode?: UIAdaptiveViewportMode;
  breakpoints?: Partial<UIViewportBreakpoints>;
  fallbackKind?: UIViewportKind;
}

export interface UIAdaptiveViewportResult<
  TElement extends HTMLElement,
> {
  ref: React.MutableRefObject<TElement | null>;

  source: UIAdaptiveViewportSource;
  mode: UIViewportMode;

  kind: UIViewportKind;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;

  width: number;
  height: number;

  breakpoints: UIViewportBreakpoints;
}

/**
 * Único owner de resolución responsive local de componentes.
 *
 * - window:
 *   usa el UIViewportProvider si existe y cae a window cuando no existe.
 *
 * - container:
 *   mide el elemento propietario mediante ResizeObserver.
 *
 * - inherit:
 *   hereda el modo configurado del UIViewportProvider; sin provider equivale
 *   a auto.
 *
 * Este hook resuelve solamente el kind responsive. La configuración global
 * de document/density/input sigue perteneciendo a UIViewportProvider.
 */
export function useAdaptiveViewport<
  TElement extends HTMLElement = HTMLDivElement,
>({
  source = "window",
  mode = "inherit",
  breakpoints,
  fallbackKind,
}: UseAdaptiveViewportOptions = {}): UIAdaptiveViewportResult<TElement> {
  const viewport =
    useOptionalUIViewport();

  const [
    containerRef,
    containerSize,
  ] =
    useElementSize<TElement>();

  const windowSize =
    useViewportSize({
      observeResize:
        source === "window" &&
        viewport === null,
    });

  const resolvedMode: UIViewportMode =
    mode === "inherit"
      ? viewport?.mode ?? "auto"
      : mode;

  const baseBreakpoints =
    viewport?.breakpoints;

  const resolvedBreakpoints =
    React.useMemo(
      () =>
        resolveUIViewportBreakpoints(
          breakpoints,
          baseBreakpoints
        ),
      [
        breakpoints,
        baseBreakpoints,
      ]
    );

  const windowWidth =
    viewport?.width ??
    windowSize.width;

  const windowHeight =
    viewport?.height ??
    windowSize.height;

  const width =
    source === "container"
      ? containerSize.width
      : windowWidth;

  const height =
    source === "container"
      ? containerSize.height
      : windowHeight;

  const resolvedFallbackKind =
    fallbackKind ??
    (
      source === "container"
        ? "mobile"
        : viewport?.kind ??
          "mobile"
    );

  const kind =
    resolveUIViewportKind({
      mode: resolvedMode,
      width,
      breakpoints:
        resolvedBreakpoints,
      fallbackKind:
        resolvedFallbackKind,
    });

  return {
    ref:
      containerRef,

    source,
    mode:
      resolvedMode,

    kind,
    isMobile:
      kind === "mobile",
    isTablet:
      kind === "tablet",
    isDesktop:
      kind === "desktop",

    width,
    height,

    breakpoints:
      resolvedBreakpoints,
  };
}
