// src/core/motion/motion.utils.ts
import type { Variants } from "framer-motion";
import type { UIMotionLevel } from "./motion.types";

export function resolveEffectiveMotionLevel({
  level,
  prefersReducedMotion,
  respectReducedMotion,
}: {
  level: UIMotionLevel;
  prefersReducedMotion: boolean;
  respectReducedMotion: boolean;
}): UIMotionLevel {
  if (level === "none") {
    return "none";
  }

  if (
    respectReducedMotion &&
    prefersReducedMotion
  ) {
    return "reduced";
  }

  return level;
}

export function createStaticMotionVariants(): Variants {
  return {
    initial: {
      opacity: 1,
      scale: 1,
      x: 0,
      y: 0,
    },
    animate: {
      opacity: 1,
      scale: 1,
      x: 0,
      y: 0,
    },
    exit: {
      opacity: 1,
      scale: 1,
      x: 0,
      y: 0,
    },
  };
}