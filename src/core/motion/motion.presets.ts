// src/core/motion/motion.presets.ts
import type { Transition, Variants } from "framer-motion";
import type {
  UIMotionIntent,
  UIMotionLevel,
  UIMotionPreset,
} from "./motion.types";
import {
  UI_MOTION_EASINGS,
  getMotionDistance,
  getMotionDuration,
  getMotionScale,
} from "./motion.tokens";
import { createStaticMotionVariants } from "./motion.utils";

export function getMotionTransition(
  level: UIMotionLevel,
  intent: UIMotionIntent = "fade"
): Transition {
  const duration = getMotionDuration(level, intent);

  if (level === "none") {
    return {
      duration: 0,
    };
  }

  if (level === "reduced") {
    return {
      duration,
      ease: "linear",
    };
  }

  return {
    duration,
    ease:
      intent === "press"
        ? UI_MOTION_EASINGS.press
        : intent === "slide" ||
            intent === "expand" ||
            intent === "layout" ||
            intent === "feedback"
          ? UI_MOTION_EASINGS.emphasized
          : UI_MOTION_EASINGS.standard,
  };
}

export function getMotionPresetVariants(
  preset: UIMotionPreset,
  level: UIMotionLevel
): Variants {
  if (level === "none" || preset === "none") {
    return createStaticMotionVariants();
  }

  const distance = getMotionDistance(level);
  const scale = getMotionScale(level);

  switch (preset) {
    case "fade":
      return {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
      };

    case "scale-fade":
      return {
        initial: { opacity: 0, scale },
        animate: { opacity: 1, scale: 1 },
        exit: { opacity: 0, scale },
      };

    case "slide-up":
      return {
        initial: { opacity: 0, y: distance },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: distance },
      };

    case "slide-down":
      return {
        initial: { opacity: 0, y: -distance },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -distance },
      };

    case "slide-left":
      return {
        initial: { opacity: 0, x: distance },
        animate: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: distance },
      };

    case "slide-right":
      return {
        initial: { opacity: 0, x: -distance },
        animate: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: -distance },
      };

    case "dialog":
      return {
        initial: {
          opacity: 0,
          scale,
          y: level === "expressive" ? 10 : 6,
        },
        animate: {
          opacity: 1,
          scale: 1,
          y: 0,
        },
        exit: {
          opacity: 0,
          scale,
          y: level === "expressive" ? 10 : 6,
        },
      };

    case "popover":
    case "menu":
      return {
        initial: {
          opacity: 0,
          scale,
          y: level === "expressive" ? 10 : 6,
        },
        animate: {
          opacity: 1,
          scale: 1,
          y: 0,
        },
        exit: {
          opacity: 0,
          scale,
          y: level === "expressive" ? 10 : 6,
        },
      };

    case "tooltip":
      return {
        initial: {
          opacity: 0,
          scale: level === "expressive" ? 0.94 : 0.98,
          y: 4,
        },
        animate: {
          opacity: 1,
          scale: 1,
          y: 0,
        },
        exit: {
          opacity: 0,
          scale: level === "expressive" ? 0.94 : 0.98,
          y: 4,
        },
      };

    case "feedback":
      return {
        initial: {
          opacity: 0,
          scale: level === "expressive" ? 0.92 : 0.96,
        },
        animate: {
          opacity: 1,
          scale: 1,
        },
        exit: {
          opacity: 0,
          scale: level === "expressive" ? 0.92 : 0.96,
        },
      };

    case "layout":
      return {
        initial: {
          opacity: 0,
          y: distance,
        },
        animate: {
          opacity: 1,
          y: 0,
        },
        exit: {
          opacity: 0,
          y: distance,
        },
      };

    case "press":
      return {
        initial: {
          scale: 1,
          y: 0,
        },
        animate: {
          scale: 1,
          y: 0,
        },
        exit: {
          scale: 1,
          y: 0,
        },
      };

    default:
      return createStaticMotionVariants();
  }
}

export function getProgressIndeterminateTransition(
  level: UIMotionLevel
): Transition {
  if (level === "none" || level === "reduced") {
    return {
      duration: 0,
    };
  }

  return {
    duration: getMotionDuration(level, "progress"),
    ease: "linear",
    repeat: Infinity,
  };
}

export function shouldAnimateProgressIndeterminate(
  level: UIMotionLevel
): boolean {
  return level !== "none" && level !== "reduced";
}


export function getPressMotion(
  level: UIMotionLevel
): { scale: number; y: number } | undefined {
  if (level === "none" || level === "reduced") return undefined;

  return {
    scale: level === "expressive" ? 0.97 : 0.985,
    y: 1,
  };
}