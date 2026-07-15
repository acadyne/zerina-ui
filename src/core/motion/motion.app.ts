// src/core/motion/motion.app.ts
import type {
  TargetAndTransition,
  Variants,
} from "framer-motion";
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

type DirectionalVariantResolver = (
  custom: UIMotionTransitionDirection | undefined
) => TargetAndTransition;

function resolveDirection(
  custom: UIMotionTransitionDirection | undefined,
  direction: UIMotionTransitionDirection
): UIMotionTransitionDirection {
  return custom ?? direction;
}

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

  const axisDistance =
    level === "expressive"
      ? distance * 2
      : distance * 1.5;

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
    const initialScale =
      level === "expressive"
        ? 0.98
        : 0.995;

    const exitScale =
      level === "expressive"
        ? 1.02
        : 1.005;

    return {
      initial: {
        opacity: 0,
        scale: initialScale,
      },
      animate: {
        opacity: 1,
        scale: 1,
      },
      exit: {
        opacity: 0,
        scale: exitScale,
      },
    };
  }

  if (transition === "shared-axis") {
    const initial: DirectionalVariantResolver = (custom) => {
      const resolvedDirection = resolveDirection(
        custom,
        direction
      );

      if (resolvedDirection === "back") {
        return {
          opacity: 0,
          x: -axisDistance,
        };
      }

      if (resolvedDirection === "replace") {
        return {
          opacity: 0,
          y: axisDistance * 0.5,
          scale,
        };
      }

      return {
        opacity: 0,
        x: axisDistance,
      };
    };

    const exit: DirectionalVariantResolver = (custom) => {
      const resolvedDirection = resolveDirection(
        custom,
        direction
      );

      if (resolvedDirection === "back") {
        return {
          opacity: 0,
          x: axisDistance,
        };
      }

      if (resolvedDirection === "replace") {
        return {
          opacity: 0,
          y: -axisDistance * 0.5,
          scale,
        };
      }

      return {
        opacity: 0,
        x: -axisDistance,
      };
    };

    return {
      initial,
      animate: {
        opacity: 1,
        x: 0,
        y: 0,
        scale: 1,
      },
      exit,
    };
  }

  const initial: DirectionalVariantResolver = (custom) => {
    const resolvedDirection = resolveDirection(
      custom,
      direction
    );

    if (resolvedDirection === "back") {
      return {
        x: "-18%",
        opacity: 0.96,
      };
    }

    if (resolvedDirection === "replace") {
      return {
        opacity: 0.92,
        scale: 0.995,
      };
    }

    return {
      x: "100%",
      opacity: 1,
    };
  };

  const exit: DirectionalVariantResolver = (custom) => {
    const resolvedDirection = resolveDirection(
      custom,
      direction
    );

    if (resolvedDirection === "back") {
      return {
        x: "100%",
        opacity: 1,
      };
    }

    if (resolvedDirection === "replace") {
      return {
        opacity: 0,
        scale: 0.995,
      };
    }

    return {
      x: "-18%",
      opacity: 0.92,
    };
  };

  return {
    initial,
    animate: {
      x: 0,
      opacity: 1,
      scale: 1,
    },
    exit,
  };
}