// src/core/layout/layout.types.ts

export type UILayoutMode = "normal" | "mobile" | "auto";

export type UIResolvedLayoutMode = "normal" | "mobile";

export type UIDeviceKind =
  | "unknown"
  | "desktop"
  | "tablet"
  | "phone"
  | "android";

export type UILayoutChangeReason =
  | "provider"
  | "user"
  | "system"
  | "responsive";

export interface UILayoutState {
  mode: UILayoutMode;
  effectiveMode: UIResolvedLayoutMode;
  isMobile: boolean;
  isNormal: boolean;
  mobileBreakpoint: number;
  deviceKind: UIDeviceKind;
  lockMode: boolean;
  canChangeMode: boolean;
}