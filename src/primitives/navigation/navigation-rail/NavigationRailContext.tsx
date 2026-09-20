// src/primitives/navigation/navigation-rail/NavigationRailContext.tsx
import {
  createNavigationDestinationContext,
  type NavigationDestinationContextValue,
} from "../shared/navigationDestinationContext";

import type {
  NavigationRailSlot,
} from "./navigationRail.types";

export interface NavigationRailContextValue
  extends NavigationDestinationContextValue<
    NavigationRailSlot
  > {
  itemMinHeight?:
    number | string;
}

const navigationRailContext =
  createNavigationDestinationContext<
    NavigationRailContextValue
  >(
    "NavigationRail.Item must be used inside <NavigationRail />",
  );

export const NavigationRailContext =
  navigationRailContext.Context;

export const useNavigationRailContext =
  navigationRailContext.useNavigationDestinationContext;
