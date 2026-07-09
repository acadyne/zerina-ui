// src/core/motion/MotionOverlay.tsx
import React from "react";
import {
  AnimatePresence,
  motion,
  type AnimatePresenceProps,
  type HTMLMotionProps,
} from "framer-motion";
import type {
  UIMotionLevel,
} from "./motion.types";
import type {
  UIOverlayMotionKind,
  UIOverlayPlacement,
} from "./motion.overlay";
import {
  getOverlayBackdropVariants,
  getOverlayBottomSheetVariants,
  getOverlayDialogVariants,
  getOverlayDrawerVariants,
  getOverlayMotionIntent,
} from "./motion.overlay";
import { useOptionalUIMotion } from "./useUIMotion";

export interface MotionOverlayPresenceProps {
  children?: React.ReactNode;
  open: boolean;
  mode?: AnimatePresenceProps["mode"];
  initial?: boolean;
}

export function MotionOverlayPresence({
  children,
  open,
  mode = "sync",
  initial = false,
}: MotionOverlayPresenceProps) {
  return (
    <AnimatePresence mode={mode} initial={initial}>
      {open ? children : null}
    </AnimatePresence>
  );
}

MotionOverlayPresence.displayName = "MotionOverlayPresence";

export interface MotionOverlayRootProps
  extends Omit<
    HTMLMotionProps<"div">,
    "initial" | "animate" | "exit" | "variants" | "transition"
  > {
  children?: React.ReactNode;
}

export function MotionOverlayRoot({
  children,
  style,
  ...rest
}: MotionOverlayRootProps) {
  return (
    <motion.div
      initial={{
        opacity: 1,
      }}
      animate={{
        opacity: 1,
      }}
      exit={{
        opacity: 1,
      }}
      style={style}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

MotionOverlayRoot.displayName = "MotionOverlayRoot";

export interface MotionOverlayBackdropProps
  extends Omit<
    HTMLMotionProps<"div">,
    "children" | "initial" | "animate" | "exit" | "variants" | "transition"
  > {}

export function MotionOverlayBackdrop({
  style,
  ...rest
}: MotionOverlayBackdropProps) {
  const motionState = useOptionalUIMotion();

  const variants = getOverlayBackdropVariants(motionState.effectiveLevel);

  const transition = motionState.getTransition(
    motionState.effectiveLevel,
    getOverlayMotionIntent("backdrop")
  );

  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={variants}
      transition={transition}
      style={style}
      {...rest}
    />
  );
}

MotionOverlayBackdrop.displayName = "MotionOverlayBackdrop";

export type MotionOverlayPanelKind = Exclude<
  UIOverlayMotionKind,
  "backdrop"
>;

export type MotionOverlayPanelAs = "div" | "aside" | "section";

export interface MotionOverlayPanelProps
  extends Omit<
    HTMLMotionProps<"div">,
    "initial" | "animate" | "exit" | "variants" | "transition"
  > {
  as?: MotionOverlayPanelAs;
  kind: MotionOverlayPanelKind;
  placement?: UIOverlayPlacement;
}

function getMotionOverlayPanelVariants({
  kind,
  placement,
  level,
}: {
  kind: MotionOverlayPanelKind;
  placement?: UIOverlayPlacement;
  level: UIMotionLevel;
}) {
  if (kind === "dialog") {
    return getOverlayDialogVariants(level);
  }

  if (kind === "drawer") {
    return getOverlayDrawerVariants({
      placement: placement ?? "right",
      level,
    });
  }

  return getOverlayBottomSheetVariants(level);
}

export function MotionOverlayPanel({
  as = "div",
  kind,
  placement,
  children,
  style,
  ...rest
}: MotionOverlayPanelProps) {
  const motionState = useOptionalUIMotion();

  const variants = getMotionOverlayPanelVariants({
    kind,
    placement,
    level: motionState.effectiveLevel,
  });

  const transition = motionState.getTransition(
    motionState.effectiveLevel,
    getOverlayMotionIntent(kind)
  );

  const commonProps = {
    initial: "initial",
    animate: "animate",
    exit: "exit",
    variants,
    transition,
    style,
    ...rest,
  };

  if (as === "aside") {
    return (
      <motion.aside {...(commonProps as HTMLMotionProps<"aside">)}>
        {children}
      </motion.aside>
    );
  }

  if (as === "section") {
    return (
      <motion.section {...(commonProps as HTMLMotionProps<"section">)}>
        {children}
      </motion.section>
    );
  }

  return (
    <motion.div {...(commonProps as HTMLMotionProps<"div">)}>
      {children}
    </motion.div>
  );
}

MotionOverlayPanel.displayName = "MotionOverlayPanel";