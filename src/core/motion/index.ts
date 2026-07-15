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
  getCollapsibleContentVariants,
  getCollapsibleTriggerIconVariants,
  getProgressIndeterminateVariants,
} from "./motion.presets";

export {
  MotionSwitch,
  type MotionSwitchProps,
} from "./MotionSwitch";

export {
  MotionPresence,
  type MotionPresenceProps,
} from "./MotionPresence";

export {
  MotionOverlayPresence,
  MotionOverlayRoot,
  MotionOverlayBackdrop,
  MotionOverlayPanel,
  type MotionOverlayPresenceProps,
  type MotionOverlayRootProps,
  type MotionOverlayBackdropProps,
  type MotionOverlayPanelKind,
  type MotionOverlayPanelAs,
  type MotionOverlayPanelProps,
} from "./MotionOverlay";

export {
  UIMotionProvider,
  type UIMotionContextValue,
  type UIMotionProviderProps,
} from "./UIMotionProvider";

export {
  useOptionalUIMotion,
  useUIMotion,
} from "./useUIMotion";