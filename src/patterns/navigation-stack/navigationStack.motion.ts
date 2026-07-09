// src/patterns/navigation-stack/navigationStack.motion.ts
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

export function getNavigationStackVariants(
  animation: NavigationStackAnimation,
  direction: NavigationStackTransitionDirection
) {
  if (animation === "fade") {
    return {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 },
    };
  }

  if (animation === "none") {
    return {
      initial: { opacity: 1 },
      animate: { opacity: 1 },
      exit: { opacity: 1 },
    };
  }

  if (direction === "back") {
    return {
      initial: { x: "-18%", opacity: 0.96 },
      animate: { x: 0, opacity: 1 },
      exit: { x: "100%", opacity: 1 },
    };
  }

  if (direction === "replace") {
    return {
      initial: { opacity: 0.92, scale: 0.995 },
      animate: { opacity: 1, scale: 1 },
      exit: { opacity: 0, scale: 0.995 },
    };
  }

  return {
    initial: { x: "100%", opacity: 1 },
    animate: { x: 0, opacity: 1 },
    exit: { x: "-18%", opacity: 0.92 },
  };
}