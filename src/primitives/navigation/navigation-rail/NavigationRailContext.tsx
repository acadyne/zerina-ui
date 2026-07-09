// src/primitives/navigation/navigation-rail/NavigationRailContext.tsx
import React from "react";
import type { NavigationRailContextValue } from "./navigationRail.types";

export const NavigationRailContext =
  React.createContext<NavigationRailContextValue | null>(null);

export function useNavigationRailContext(): NavigationRailContextValue {
  const context = React.useContext(NavigationRailContext);

  if (!context) {
    throw new Error("NavigationRail.Item must be used inside <NavigationRail />");
  }

  return context;
}