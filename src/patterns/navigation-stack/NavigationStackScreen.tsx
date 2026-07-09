// src/patterns/navigation-stack/NavigationStackScreen.tsx
import type { NavigationStackScreenProps } from "./navigationStack.types";
import { NAVIGATION_STACK_SCREEN_MARKER } from "./navigationStack.utils";

export const NavigationStackScreen = function NavigationStackScreen(
  _props: NavigationStackScreenProps
) {
  return null;
};

Object.defineProperty(NavigationStackScreen, NAVIGATION_STACK_SCREEN_MARKER, {
  value: true,
});

NavigationStackScreen.displayName = "NavigationStack.Screen";