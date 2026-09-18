// src/core/motion/MotionSwitch.tsx
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
  children?:
    React.ReactNode;

  motionKey:
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


export function MotionSwitch({
  children,

  motionKey,

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
}: MotionSwitchProps) {
  return (
    <MotionAppFrame
      {...rest}

      present

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


MotionSwitch.displayName =
  "MotionSwitch";
