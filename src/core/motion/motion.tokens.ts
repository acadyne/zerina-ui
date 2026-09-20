// src/core/motion/motion.tokens.ts

import type {
  UIMotionIntent,
  UIMotionLevel,
} from "./motion.types";


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


export const UI_MOTION_DISTANCES = {
  none: 0,
  sm: 4,
  md: 8,
  lg: 14,
} as const;


export const UI_MOTION_SCALES = {
  static: 1,
  subtle: 0.98,
  expressive: 0.96,
} as const;


export const UI_MOTION_POLICY_CSS_VARIABLES = [
  "--ui-motion-token-duration-none",
  "--ui-motion-token-duration-instant",
  "--ui-motion-token-duration-fast",
  "--ui-motion-token-duration-normal",
  "--ui-motion-token-duration-slow",
  "--ui-motion-token-duration-slower",
  "--ui-motion-token-ease-static",
  "--ui-motion-token-ease-standard",
  "--ui-motion-token-ease-emphasized",
  "--ui-motion-token-ease-entrance",
  "--ui-motion-token-ease-exit",
  "--ui-motion-token-ease-press",
  "--ui-motion-token-distance-none",
  "--ui-motion-token-distance-sm",
  "--ui-motion-token-distance-md",
  "--ui-motion-token-distance-lg",
  "--ui-motion-token-scale-static",
  "--ui-motion-token-scale-subtle",
  "--ui-motion-token-scale-expressive",
] as const;


export type UIMotionPolicyCSSVariable =
  (typeof UI_MOTION_POLICY_CSS_VARIABLES)[number];


export type UIMotionCSSProjection =
  Readonly<
    Record<
      UIMotionPolicyCSSVariable,
      string
    >
  >;


function secondsToCSSDuration(
  seconds: number,
): string {
  return `${Math.round(seconds * 1000)}ms`;
}


function easingToCSSValue(
  easing:
    readonly [
      number,
      number,
      number,
      number,
    ],
): string {
  return `cubic-bezier(${easing.join(", ")})`;
}


/**
 * Projects the canonical JS motion policy into CSS source variables.
 *
 * The active variables consumed by component CSS are selected by
 * data-ui-motion-effective in motion.css. This keeps numeric values owned by
 * this module while the document attribute remains the actual CSS switch.
 */
export function getMotionCSSProjection(): UIMotionCSSProjection {
  return {
    "--ui-motion-token-duration-none":
      secondsToCSSDuration(
        UI_MOTION_DURATIONS.none,
      ),

    "--ui-motion-token-duration-instant":
      secondsToCSSDuration(
        UI_MOTION_DURATIONS.instant,
      ),

    "--ui-motion-token-duration-fast":
      secondsToCSSDuration(
        UI_MOTION_DURATIONS.fast,
      ),

    "--ui-motion-token-duration-normal":
      secondsToCSSDuration(
        UI_MOTION_DURATIONS.normal,
      ),

    "--ui-motion-token-duration-slow":
      secondsToCSSDuration(
        UI_MOTION_DURATIONS.slow,
      ),

    "--ui-motion-token-duration-slower":
      secondsToCSSDuration(
        UI_MOTION_DURATIONS.slower,
      ),

    "--ui-motion-token-ease-static":
      "linear",

    "--ui-motion-token-ease-standard":
      easingToCSSValue(
        UI_MOTION_EASINGS.standard,
      ),

    "--ui-motion-token-ease-emphasized":
      easingToCSSValue(
        UI_MOTION_EASINGS.emphasized,
      ),

    "--ui-motion-token-ease-entrance":
      easingToCSSValue(
        UI_MOTION_EASINGS.entrance,
      ),

    "--ui-motion-token-ease-exit":
      easingToCSSValue(
        UI_MOTION_EASINGS.exit,
      ),

    "--ui-motion-token-ease-press":
      easingToCSSValue(
        UI_MOTION_EASINGS.press,
      ),

    "--ui-motion-token-distance-none":
      `${UI_MOTION_DISTANCES.none}px`,

    "--ui-motion-token-distance-sm":
      `${UI_MOTION_DISTANCES.sm}px`,

    "--ui-motion-token-distance-md":
      `${UI_MOTION_DISTANCES.md}px`,

    "--ui-motion-token-distance-lg":
      `${UI_MOTION_DISTANCES.lg}px`,

    "--ui-motion-token-scale-static":
      String(
        UI_MOTION_SCALES.static,
      ),

    "--ui-motion-token-scale-subtle":
      String(
        UI_MOTION_SCALES.subtle,
      ),

    "--ui-motion-token-scale-expressive":
      String(
        UI_MOTION_SCALES.expressive,
      ),
  };
}


export function getMotionDuration(
  level: UIMotionLevel,
  intent: UIMotionIntent = "fade",
): number {
  if (level === "none") {
    return UI_MOTION_DURATIONS.none;
  }

  if (level === "reduced") {
    if (intent === "layout") {
      return UI_MOTION_DURATIONS.fast;
    }

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


export function getMotionDistance(
  level: UIMotionLevel,
): number {
  switch (level) {
    case "none":
    case "reduced":
      return UI_MOTION_DISTANCES.none;

    case "expressive":
      return UI_MOTION_DISTANCES.lg;

    case "subtle":
    default:
      return UI_MOTION_DISTANCES.md;
  }
}


export function getMotionScale(
  level: UIMotionLevel,
): number {
  switch (level) {
    case "none":
    case "reduced":
      return UI_MOTION_SCALES.static;

    case "expressive":
      return UI_MOTION_SCALES.expressive;

    case "subtle":
    default:
      return UI_MOTION_SCALES.subtle;
  }
}
