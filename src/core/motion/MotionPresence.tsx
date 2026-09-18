// src/core/motion/MotionPresence.tsx
import React from "react";

import type {
  AnimatePresenceProps,
  HTMLMotionProps,
} from "framer-motion";

import type {
  UIMotionAppTransition,
  UIMotionIntent,
  UIMotionTransitionDirection,
} from "./motion.types";

import {
  MotionAppFrame,
} from "./MotionAppFrame";


export interface MotionPresenceProps
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
  children?:
    React.ReactNode;

  present:
    boolean;

  motionKey?:
    React.Key;

  preset?:
    UIMotionAppTransition;

  direction?:
    UIMotionTransitionDirection;

  mode?:
    AnimatePresenceProps["mode"];

  initial?:
    boolean;

  transitionIntent?:
    UIMotionIntent;
}


export function MotionPresence({
  children,

  present,

  motionKey =
    "motion-presence",

  preset =
    "fade",

  direction =
    "replace",

  mode =
    "wait",

  initial =
    false,

  transitionIntent,

  className,
  style,

  ...rest
}: MotionPresenceProps) {
  return (
    <MotionAppFrame
      {...rest}

      present={
        present
      }

      motionKey={
        motionKey
      }

      preset={
        preset
      }

      direction={
        direction
      }

      mode={
        mode
      }

      initial={
        initial
      }

      transitionIntent={
        transitionIntent
      }

      className={
        className
      }

      style={
        style
      }
    >
      {children}
    </MotionAppFrame>
  );
}


MotionPresence.displayName =
  "MotionPresence";
