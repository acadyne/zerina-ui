// src/patterns/navigation-stack/NavigationStackContext.tsx
import React from "react";
import type { NavigationStackContextValue } from "./navigationStack.types";

export const NavigationStackContext =
  React.createContext<NavigationStackContextValue | null>(null);

export function useNavigationStack(): NavigationStackContextValue {
  const context = React.useContext(NavigationStackContext);

  if (!context) {
    throw new Error("useNavigationStack must be used inside <NavigationStack />");
  }

  return context;
}