// src/patterns/scaffold/tab-scaffold/tabScaffold.utils.tsx
import React from "react";
import { Box } from "../../../primitives/layout";
import type {
  NavigationStackEntry,
  NavigationStackParams,
} from "../../navigation-stack";
import type {
  TabScaffoldHeaderValue,
  TabScaffoldRenderContext,
  TabScaffoldScreen,
  TabScaffoldTab,
} from "./tabScaffold.types";

export function createTabScaffoldEntry(
  key: string,
  name: string,
  params?: NavigationStackParams
): NavigationStackEntry {
  return {
    key,
    name,
    params,
  };
}

export function resolveTabScaffoldHeaderValue(
  value: TabScaffoldHeaderValue | undefined,
  context: TabScaffoldRenderContext
): React.ReactNode {
  if (typeof value === "function") {
    return value(context);
  }

  return value;
}

export function resolveTabScaffoldSlot(
  value:
    | React.ReactNode
    | ((context: TabScaffoldRenderContext) => React.ReactNode)
    | undefined,
  context: TabScaffoldRenderContext
): React.ReactNode {
  if (typeof value === "function") {
    return value(context);
  }

  return value;
}

export function getInitialTab(
  tabs: TabScaffoldTab[],
  initialTab?: string
): string {
  if (initialTab) {
    const requestedTab = tabs.find(
      (tab) => tab.value === initialTab
    );

    if (requestedTab && !requestedTab.disabled) {
      return requestedTab.value;
    }
  }

  return (
    tabs.find((tab) => !tab.disabled)?.value ??
    ""
  );
}

export function getActiveTab({
  entries,
  tabs,
  initialTab,
}: {
  entries: NavigationStackEntry[];
  tabs: TabScaffoldTab[];
  initialTab: string;
}): string {
  const root = entries[0];

  if (
    root &&
    tabs.some(
      (tab) =>
        tab.value === root.name &&
        !tab.disabled
    )
  ) {
    return root.name;
  }

  return initialTab;
}

export function getTabScaffoldScreenMeta({
  currentName,
  activeTab,
  screens,
}: {
  currentName?: string | null;
  activeTab: string;
  screens: TabScaffoldScreen[];
}): TabScaffoldScreen | null {
  if (currentName) {
    const currentScreen = screens.find(
      (screen) => screen.name === currentName
    );

    if (currentScreen) {
      return currentScreen;
    }
  }

  return (
    screens.find(
      (screen) => screen.name === activeTab
    ) ??
    null
  );
}

export function renderTabScaffoldFallback() {
  return (
    <Box
      style={{
        height: "100%",
        minHeight: 0,
        display: "grid",
        placeItems: "center",
        padding: "1rem",
        color: "var(--ui-text-muted)",
        textAlign: "center",
      }}
    >
      TabScaffold necesita al menos un tab habilitado.
    </Box>
  );
}