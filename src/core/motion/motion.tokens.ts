// src/core/motion/motion.tokens.ts
import type { UIMotionIntent, UIMotionLevel } from "./motion.types";

export const UI_MOTION_DURATIONS = {
  none: 0,
  instant: 0.001,
  fast: 0.12,
  normal: 0.18,
  slow: 0.26,
  slower: 0.36,

  spinnerSubtle: 0.9,
  spinnerExpressive: 0.75,

  progressSubtle: 1.35,
  progressExpressive: 1.1,
} as const;

export const UI_MOTION_EASINGS = {
  standard: [0.2, 0, 0, 1],
  emphasized: [0.16, 1, 0.3, 1],
  entrance: [0.16, 1, 0.3, 1],
  exit: [0.4, 0, 1, 1],
  press: [0.2, 0, 0, 1],
} as const;

export function getMotionDuration(
  level: UIMotionLevel,
  intent: UIMotionIntent = "fade"
): number {
  if (level === "none") return UI_MOTION_DURATIONS.none;

  if (level === "reduced") {
    if (intent === "layout") return UI_MOTION_DURATIONS.fast;
    return UI_MOTION_DURATIONS.instant;
  }

  if (level === "expressive") {
    switch (intent) {
      case "press":
        return UI_MOTION_DURATIONS.fast;

      case "spinner":
        return UI_MOTION_DURATIONS.spinnerExpressive;

      case "progress":
        return UI_MOTION_DURATIONS.progressExpressive;

      case "feedback":
      case "layout":
        return UI_MOTION_DURATIONS.slower;

      case "collapse":
      case "expand":
      case "slide":
        return UI_MOTION_DURATIONS.slow;

      default:
        return UI_MOTION_DURATIONS.normal;
    }
  }

  switch (intent) {
    case "press":
      return UI_MOTION_DURATIONS.fast;

    case "spinner":
      return UI_MOTION_DURATIONS.spinnerSubtle;

    case "progress":
      return UI_MOTION_DURATIONS.progressSubtle;

    case "feedback":
    case "layout":
      return UI_MOTION_DURATIONS.slow;

    case "collapse":
    case "expand":
    case "slide":
      return UI_MOTION_DURATIONS.normal;

    default:
      return UI_MOTION_DURATIONS.fast;
  }

}

export function getMotionDistance(level: UIMotionLevel): number {
  switch (level) {
    case "none":
    case "reduced":
      return 0;
    case "expressive":
      return 14;
    case "subtle":
    default:
      return 8;
  }
}

export function getMotionScale(level: UIMotionLevel): number {
  switch (level) {
    case "none":
    case "reduced":
      return 1;
    case "expressive":
      return 0.96;
    case "subtle":
    default:
      return 0.98;
  }
}