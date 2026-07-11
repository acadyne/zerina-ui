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
  | "layout"
  | "progress";

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

export type UIMotionAppTransition =
  | "none"
  | "fade"
  | "scale"
  | "slide"
  | "shared-axis"
  | "fade-through";

export type UIMotionTransitionDirection =
  | "enter"
  | "exit"
  | "forward"
  | "back"
  | "replace";

export type UIMotionPreference = "system" | UIMotionLevel;

export interface UIMotionState {
  level: UIMotionLevel;
  effectiveLevel: UIMotionLevel;
  prefersReducedMotion: boolean;
  respectReducedMotion: boolean;
  shouldAnimate: boolean;
}