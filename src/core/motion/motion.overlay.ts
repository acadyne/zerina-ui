// src/core/motion/motion.overlay.ts
import type { Variants } from "framer-motion";
import type { UIMotionIntent, UIMotionLevel } from "./motion.types";
import { getMotionScale } from "./motion.tokens";
import { createStaticMotionVariants } from "./motion.utils";
export type UIOverlayMotionKind =
  | "backdrop"
  | "dialog"
  | "drawer"
  | "bottom-sheet";

export type UIOverlayPlacement = "left" | "right";

export function getOverlayMotionIntent(
  kind: UIOverlayMotionKind
): UIMotionIntent {
  switch (kind) {
    case "dialog":
      return "scale";

    case "drawer":
    case "bottom-sheet":
      return "slide";

    case "backdrop":
    default:
      return "fade";
  }
}

export function getOverlayBackdropVariants(level: UIMotionLevel): Variants {
  if (level === "none") {
    return createStaticMotionVariants();
  }

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

export function getOverlayDialogVariants(level: UIMotionLevel): Variants {
  if (level === "none" || level === "reduced") {
    return createStaticMotionVariants();
  }

  const scale = getMotionScale(level);
  const y = level === "expressive" ? 10 : 6;

  return {
    initial: {
      opacity: 0,
      scale,
      y,
    },
    animate: {
      opacity: 1,
      scale: 1,
      y: 0,
    },
    exit: {
      opacity: 0,
      scale,
      y,
    },
  };
}

export function getOverlayDrawerVariants({
  placement,
  level,
}: {
  placement: UIOverlayPlacement;
  level: UIMotionLevel;
}): Variants {
  if (level === "none" || level === "reduced") {
    return createStaticMotionVariants();
  }

  const x = placement === "left" ? "-100%" : "100%";

  return {
    initial: {
      x,
      opacity: 1,
    },
    animate: {
      x: 0,
      opacity: 1,
    },
    exit: {
      x,
      opacity: 1,
    },
  };
}

export function getOverlayBottomSheetVariants(level: UIMotionLevel): Variants {
  if (level === "none" || level === "reduced") {
    return createStaticMotionVariants();
  }

  return {
    initial: {
      y: "100%",
      opacity: 1,
    },
    animate: {
      y: 0,
      opacity: 1,
    },
    exit: {
      y: "100%",
      opacity: 1,
    },
  };
}