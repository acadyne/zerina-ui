import React from "react";
import type { BottomNavigationContextValue } from "./bottomNavigation.types";

export const BottomNavigationContext =
  React.createContext<BottomNavigationContextValue | null>(null);

export function useBottomNavigationContext(): BottomNavigationContextValue {
  const context = React.useContext(BottomNavigationContext);

  if (!context) {
    throw new Error(
      "BottomNavigation.Item must be used inside <BottomNavigation />"
    );
  }

  return context;
}