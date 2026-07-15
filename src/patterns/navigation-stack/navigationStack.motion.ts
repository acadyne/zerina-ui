// src/patterns/navigation-stack/navigationStack.motion.ts
import type { UIMotionAppTransition } from "../../core/motion";
import type { NavigationStackAnimation } from "./navigationStack.types";

export function getNavigationStackMotionPreset(
  animation: NavigationStackAnimation
): UIMotionAppTransition {
  return animation;
}