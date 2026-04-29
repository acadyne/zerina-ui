// src/core/motion/useUIMotion.ts
import React from "react";
import { UIMotionContext, type UIMotionContextValue } from "./UIMotionProvider";
import {
  getMotionPresetVariants,
  getMotionTransition,
  getPressMotion,
} from "./motion.presets";

const fallbackMotion: UIMotionContextValue = {
  level: "subtle",
  effectiveLevel: "subtle",
  prefersReducedMotion: false,
  respectReducedMotion: true,
  shouldAnimate: true,
  setLevel: () => {
    // noop
  },
  getTransition: getMotionTransition,
  getVariants: getMotionPresetVariants,
  getPressMotion,
};

export function useUIMotion(): UIMotionContextValue {
  const ctx = React.useContext(UIMotionContext);

  if (!ctx) {
    throw new Error("useUIMotion must be used inside <UIMotionProvider />");
  }

  return ctx;
}

export function useOptionalUIMotion(): UIMotionContextValue {
  return React.useContext(UIMotionContext) ?? fallbackMotion;
}