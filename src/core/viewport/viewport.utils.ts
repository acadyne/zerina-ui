// src/core/viewport/viewport.utils.ts
import type {
  UIDensity,
  UIDensityMode,
  UIInputKind,
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

export function resolveUIDensity({
  densityMode,
  inputKind,
  width,
  height,
  isShort,
  isNarrow,
  isWide,
  isTall,
}: {
  densityMode: UIDensityMode;
  inputKind: UIInputKind;
  width: number;
  height: number;
  isShort: boolean;
  isNarrow: boolean;
  isWide: boolean;
  isTall: boolean;
}): UIDensity {
  if (densityMode !== "auto") {
    return densityMode;
  }

  if (width <= 0 || height <= 0) {
    return "comfortable";
  }

  /*
   * Touch/hybrid and unknown input keep comfortable density semantics.
   * Constrained geometry may compact known fine-pointer environments, but it
   * must not shrink targets merely because the viewport is narrow.
   */
  if (
    inputKind === "touch" ||
    inputKind === "hybrid" ||
    inputKind === "unknown"
  ) {
    return "comfortable";
  }

  if (isShort || isNarrow) {
    return "compact";
  }

  if (isWide && isTall) {
    return "spacious";
  }

  return "comfortable";
}
