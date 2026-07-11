// src/core/motion/index.ts

export type {
  UIMotionAppTransition,
  UIMotionIntent,
  UIMotionLevel,
  UIMotionPreference,
  UIMotionPreset,
  UIMotionState,
  UIMotionTransitionDirection,
} from "./motion.types";

export {
  MotionSwitch,
  type MotionSwitchProps,
} from "./MotionSwitch";

export {
  MotionPresence,
  type MotionPresenceProps,
} from "./MotionPresence";

export {
  UIMotionProvider,
  type UIMotionContextValue,
  type UIMotionProviderProps,
} from "./UIMotionProvider";

export {
  useOptionalUIMotion,
  useUIMotion,
} from "./useUIMotion";