// src/core/viewport/viewport.types.ts

export type UIOrientation = "portrait" | "landscape";

export type UIInputKind =
  | "unknown"
  | "touch"
  | "mouse"
  | "pen"
  | "hybrid";

export type UIDensity = "compact" | "comfortable" | "spacious";

export type UIDensityMode = UIDensity | "auto";

export type UIViewportKind = "mobile" | "tablet" | "desktop";

export type UIViewportMode = "auto" | UIViewportKind;

export interface UIViewportBreakpoints {
  /**
   * width < tablet => mobile
   * width >= tablet && width < desktop => tablet
   * width >= desktop => desktop
   */
  tablet: number;
  desktop: number;
}

export interface UIViewportInfo {
  /**
   * Modo configurado.
   *
   * auto:
   *   Resuelve kind usando breakpoints.
   *
   * mobile/tablet/desktop:
   *   Fuerza el kind efectivo.
   */
  mode: UIViewportMode;

  /**
   * Modo efectivo ya resuelto.
   */
  kind: UIViewportKind;

  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;

  /**
   * Breakpoints oficiales del sistema responsive.
   */
  breakpoints: UIViewportBreakpoints;

  /**
   * Dimensiones actuales del viewport.
   *
   * En SSR ambos valores son 0 hasta que el componente monte en cliente.
   */
  width: number;
  height: number;
  aspectRatio: number;

  /**
   * Orientación resuelta a partir de width/height.
   */
  orientation: UIOrientation;
  isPortrait: boolean;
  isLandscape: boolean;

  /**
   * Señales auxiliares.
   *
   * No son la fuente principal del layout adaptativo.
   * Para decidir mobile/tablet/desktop usa kind/isMobile/isTablet/isDesktop.
   */
  isNarrow: boolean;
  isWide: boolean;
  isShort: boolean;
  isTall: boolean;

  /**
   * Tipo de input detectado desde media queries de pointer/hover.
   */
  inputKind: UIInputKind;
  isTouch: boolean;
  hasHover: boolean;

  /**
   * Density configurada y density efectiva.
   */
  densityMode: UIDensityMode;
  density: UIDensity;
}