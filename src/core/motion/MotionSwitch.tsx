// src/core/motion/MotionSwitch.tsx
import React from "react";
import {
  AnimatePresence,
  motion,
  type AnimatePresenceProps,
  type HTMLMotionProps,
} from "framer-motion";
import type {
  UIMotionAppTransition,
  UIMotionIntent,
  UIMotionTransitionDirection,
} from "./motion.types";
import {
  getAppTransitionIntent,
  getAppTransitionVariants,
} from "./motion.app";
import { useOptionalUIMotion } from "./useUIMotion";

export interface MotionSwitchProps
  extends Omit<
    HTMLMotionProps<"div">,
    | "children"
    | "initial"
    | "animate"
    | "exit"
    | "variants"
    | "transition"
    | "custom"
  > {
  children?: React.ReactNode;

  motionKey: React.Key;

  preset?: UIMotionAppTransition;
  direction?: UIMotionTransitionDirection;

  mode?: AnimatePresenceProps["mode"];
  initial?: boolean;

  transitionIntent?: UIMotionIntent;
}

export function MotionSwitch({
  children,

  motionKey,

  preset = "fade",
  direction = "replace",

  mode = "wait",
  initial = false,

  transitionIntent,

  className,
  style,

  ...rest
}: MotionSwitchProps) {
  const motionState =
    useOptionalUIMotion();

  const effectivePreset =
    motionState.shouldAnimate &&
      preset !== "none"
      ? preset
      : "none";

  const variants =
    getAppTransitionVariants({
      transition:
        effectivePreset,

      direction,

      level:
        motionState.effectiveLevel,
    });

  const transition =
    motionState.getTransition(
      motionState.effectiveLevel,

      transitionIntent ??
      getAppTransitionIntent(
        effectivePreset
      )
    );

  return (
    <AnimatePresence
      mode={mode}
      initial={initial}
      custom={direction}
    >
      <motion.div
        {...rest}
        key={motionKey}
        custom={direction}
        className={className}
        style={style}
        initial="initial"
        animate="animate"
        exit="exit"
        variants={variants}
        transition={transition}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

MotionSwitch.displayName =
  "MotionSwitch";