// src/core/viewport/viewport.utils.ts
import type {
  UIViewportBreakpoints,
  UIViewportKind,
  UIViewportMode,
} from "./viewport.types";

export const DEFAULT_UI_VIEWPORT_BREAKPOINTS: UIViewportBreakpoints = {
  tablet: 768,
  desktop: 1024,
};


export function resolveUIViewportBreakpoints(
  breakpoints?: Partial<UIViewportBreakpoints>,
  base: UIViewportBreakpoints =
    DEFAULT_UI_VIEWPORT_BREAKPOINTS
): UIViewportBreakpoints {
  const tablet = Math.max(
    0,
    breakpoints?.tablet ??
      base.tablet
  );

  const desktop = Math.max(
    tablet,
    breakpoints?.desktop ??
      base.desktop
  );

  return {
    tablet,
    desktop,
  };
}

export function resolveUIViewportKind({
  mode,
  width,
  breakpoints,
  fallbackKind,
}: {
  mode: UIViewportMode;
  width: number;
  breakpoints: UIViewportBreakpoints;
  fallbackKind?: UIViewportKind;
}): UIViewportKind {
  if (mode !== "auto") {
    return mode;
  }

  if (width <= 0 && fallbackKind) {
    return fallbackKind;
  }

  if (width >= breakpoints.desktop) {
    return "desktop";
  }

  if (width >= breakpoints.tablet) {
    return "tablet";
  }

  return "mobile";
}