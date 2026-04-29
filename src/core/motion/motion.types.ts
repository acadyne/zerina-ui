// src/core/motion/motion.types.ts

export type UIMotionLevel =
  | "none"
  | "reduced"
  | "subtle"
  | "expressive";

export type UIMotionIntent =
  | "fade"
  | "scale"
  | "slide"
  | "collapse"
  | "expand"
  | "press"
  | "feedback"
  | "layout";

export type UIMotionPreset =
  | "none"
  | "fade"
  | "scale-fade"
  | "slide-up"
  | "slide-down"
  | "slide-left"
  | "slide-right"
  | "dialog"
  | "popover"
  | "menu"
  | "tooltip"
  | "press"
  | "feedback"
  | "layout";

export type UIMotionPreference = "system" | UIMotionLevel;

export interface UIMotionState {
  level: UIMotionLevel;
  effectiveLevel: UIMotionLevel;
  prefersReducedMotion: boolean;
  respectReducedMotion: boolean;
  shouldAnimate: boolean;
}