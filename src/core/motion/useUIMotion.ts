// src/core/motion/useUIMotion.ts
import React from "react";
import { useMediaQuery } from "../dom";
import {
  UIMotionContext,
  type UIMotionContextValue,
} from "./UIMotionProvider";
import {
  getMotionPresetVariants,
  getMotionTransition,
  getPressMotion,
  getProgressIndeterminateTransition,
  shouldAnimateProgressIndeterminate,
} from "./motion.presets";
import { resolveEffectiveMotionLevel } from "./motion.utils";

const FALLBACK_LEVEL = "subtle" as const;
const FALLBACK_RESPECT_REDUCED_MOTION = true;

const fallbackSetLevel: UIMotionContextValue["setLevel"] = () => {
  // El fallback no tiene estado controlable.
};

export function useUIMotion(): UIMotionContextValue {
  const ctx = React.useContext(UIMotionContext);

  if (!ctx) {
    throw new Error(
      "useUIMotion must be used inside <UIMotionProvider />"
    );
  }

  return ctx;
}

export function useOptionalUIMotion(): UIMotionContextValue {
  const ctx = React.useContext(UIMotionContext);

  const prefersReducedMotion = useMediaQuery(
    "(prefers-reduced-motion: reduce)",
    false
  );

  const effectiveLevel = resolveEffectiveMotionLevel({
    level: FALLBACK_LEVEL,
    prefersReducedMotion,
    respectReducedMotion:
      FALLBACK_RESPECT_REDUCED_MOTION,
  });

  return React.useMemo(
    () =>
      ctx ?? {
        level: FALLBACK_LEVEL,
        effectiveLevel,
        prefersReducedMotion,
        respectReducedMotion:
          FALLBACK_RESPECT_REDUCED_MOTION,
        shouldAnimate:
          effectiveLevel !== "none",
        setLevel: fallbackSetLevel,
        getTransition: getMotionTransition,
        getVariants: getMotionPresetVariants,
        getPressMotion,
        getProgressIndeterminateTransition,
        shouldAnimateProgressIndeterminate,
      },
    [
      ctx,
      effectiveLevel,
      prefersReducedMotion,
    ]
  );
}