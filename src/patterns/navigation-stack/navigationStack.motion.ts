// src/patterns/navigation-stack/navigationStack.motion.ts
import type { UIMotionAppTransition } from "../../core/motion";
import type {
  NavigationStackAnimation,
  NavigationStackEntry,
  NavigationStackTransitionDirection,
} from "./navigationStack.types";

export function inferNavigationStackTransitionDirection({
  previousEntries,
  nextEntries,
}: {
  previousEntries: NavigationStackEntry[];
  nextEntries: NavigationStackEntry[];
}): NavigationStackTransitionDirection {
  if (nextEntries.length > previousEntries.length) {
    return "forward";
  }

  if (nextEntries.length < previousEntries.length) {
    return "back";
  }

  const previousCurrent = previousEntries[previousEntries.length - 1] ?? null;
  const nextCurrent = nextEntries[nextEntries.length - 1] ?? null;

  if (previousCurrent?.key !== nextCurrent?.key) {
    return "replace";
  }

  return "replace";
}

export function getNavigationStackMotionPreset(
  animation: NavigationStackAnimation
): UIMotionAppTransition {
  return animation;
}