// src/patterns/scaffold/tab-scaffold/TabScaffoldContext.tsx
import React from "react";
import type { TabScaffoldContextValue } from "./tabScaffold.types";

export const TabScaffoldContext =
  React.createContext<TabScaffoldContextValue | null>(null);

export function useTabScaffold(): TabScaffoldContextValue {
  const context = React.useContext(TabScaffoldContext);

  if (!context) {
    throw new Error("useTabScaffold must be used inside <TabScaffold />");
  }

  return context;
}