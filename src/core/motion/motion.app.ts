// src/core/motion/motion.app.ts
import type { Variants } from "framer-motion";
import type {
  UIMotionAppTransition,
  UIMotionIntent,
  UIMotionLevel,
  UIMotionTransitionDirection,
} from "./motion.types";
import {
  getMotionDistance,
  getMotionScale,
} from "./motion.tokens";
import { createStaticMotionVariants } from "./motion.utils";

export function getAppTransitionIntent(
  transition: UIMotionAppTransition
): UIMotionIntent {
  switch (transition) {
    case "scale":
      return "scale";

    case "slide":
    case "shared-axis":
      return "slide";

    case "fade-through":
      return "feedback";

    case "none":
    case "fade":
    default:
      return "fade";
  }
}

export function getAppTransitionVariants({
  transition,
  direction,
  level,
}: {
  transition: UIMotionAppTransition;
  direction: UIMotionTransitionDirection;
  level: UIMotionLevel;
}): Variants {
  if (transition === "none" || level === "none") {
    return createStaticMotionVariants();
  }

  const distance = getMotionDistance(level);
  const axisDistance = level === "expressive" ? distance * 2 : distance * 1.5;
  const scale = getMotionScale(level);

  if (transition === "fade") {
    return {
      initial: {
        opacity: 0,
      },
      animate: {
        opacity: 1,
      },
      exit: {
        opacity: 0,
      },
    };
  }

  if (transition === "scale") {
    return {
      initial: {
        opacity: 0,
        scale,
      },
      animate: {
        opacity: 1,
        scale: 1,
      },
      exit: {
        opacity: 0,
        scale,
      },
    };
  }

  if (transition === "fade-through") {
    return {
      initial: {
        opacity: 0,
        scale: level === "expressive" ? 0.98 : 0.995,
      },
      animate: {
        opacity: 1,
        scale: 1,
      },
      exit: {
        opacity: 0,
        scale: level === "expressive" ? 1.02 : 1.005,
      },
    };
  }

  if (transition === "shared-axis") {
    if (direction === "back") {
      return {
        initial: {
          opacity: 0,
          x: -axisDistance,
        },
        animate: {
          opacity: 1,
          x: 0,
        },
        exit: {
          opacity: 0,
          x: axisDistance,
        },
      };
    }

    if (direction === "replace") {
      return {
        initial: {
          opacity: 0,
          y: axisDistance * 0.5,
          scale,
        },
        animate: {
          opacity: 1,
          y: 0,
          scale: 1,
        },
        exit: {
          opacity: 0,
          y: -axisDistance * 0.5,
          scale,
        },
      };
    }

    return {
      initial: {
        opacity: 0,
        x: axisDistance,
      },
      animate: {
        opacity: 1,
        x: 0,
      },
      exit: {
        opacity: 0,
        x: -axisDistance,
      },
    };
  }

  if (direction === "back") {
    return {
      initial: {
        x: "-18%",
        opacity: 0.96,
      },
      animate: {
        x: 0,
        opacity: 1,
      },
      exit: {
        x: "100%",
        opacity: 1,
      },
    };
  }

  if (direction === "replace") {
    return {
      initial: {
        opacity: 0.92,
        scale: 0.995,
      },
      animate: {
        opacity: 1,
        scale: 1,
      },
      exit: {
        opacity: 0,
        scale: 0.995,
      },
    };
  }

  return {
    initial: {
      x: "100%",
      opacity: 1,
    },
    animate: {
      x: 0,
      opacity: 1,
    },
    exit: {
      x: "-18%",
      opacity: 0.92,
    },
  };
}