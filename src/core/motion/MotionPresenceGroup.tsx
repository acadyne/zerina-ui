// src/core/motion/MotionPresenceGroup.tsx
import React from "react";
import {
  AnimatePresence,
  type AnimatePresenceProps,
} from "framer-motion";

export interface MotionPresenceGroupProps {
  children?: React.ReactNode;
  mode?: AnimatePresenceProps["mode"];
  initial?: boolean;
}

export function MotionPresenceGroup({
  children,
  mode = "sync",
  initial = false,
}: MotionPresenceGroupProps) {
  return (
    <AnimatePresence
      mode={mode}
      initial={initial}
    >
      {children}
    </AnimatePresence>
  );
}

MotionPresenceGroup.displayName =
  "MotionPresenceGroup";