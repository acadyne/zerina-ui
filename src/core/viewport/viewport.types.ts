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

export interface UIViewportInfo {
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
   * Breakpoints derivados.
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