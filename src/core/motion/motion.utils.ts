// src/core/motion/motion.utils.ts
import type { Variants } from "framer-motion";

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