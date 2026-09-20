// src/primitives/navigation/bottom-navigation/BottomNavigationContext.tsx
import {
  createNavigationDestinationContext,
  type NavigationDestinationContextValue,
} from "../shared/navigationDestinationContext";

import type {
  BottomNavigationIconPosition,
  BottomNavigationSlot,
} from "./bottomNavigation.types";

export interface BottomNavigationContextValue
  extends NavigationDestinationContextValue<
    BottomNavigationSlot
  > {
  iconPosition:
    BottomNavigationIconPosition;
}

const bottomNavigationContext =
  createNavigationDestinationContext<
    BottomNavigationContextValue
  >(
    "BottomNavigation.Item must be used inside <BottomNavigation />",
  );

export const BottomNavigationContext =
  bottomNavigationContext.Context;

export const useBottomNavigationContext =
  bottomNavigationContext.useNavigationDestinationContext;
