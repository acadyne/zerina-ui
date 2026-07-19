// src/patterns/app-shell/AppShellSidebar.tsx
import React from "react";
import { Box } from "../../primitives/layout";
import {
  NavigationList,
} from "../../primitives/navigation";

import type {
  NavigationLinkMeta,
  NavigationNode,
} from "../navigation";
import {
  isNavigationNodeSelectable,
} from "../navigation";
import type {
  AppShellViewport,
} from "./AppShell.types";
import { getScaffoldLayer } from "../scaffold/scaffoldLayers";


export interface AppShellSidebarProps {
  viewport?: AppShellViewport;

  items: NavigationNode<NavigationLinkMeta>[];

  activeId?: string | null;

  collapsed?: boolean;

  /**
   * Width final ya resuelto desde AppShell.
   */
  width?: number | string;

  /**
   * También se aceptan estos nombres por si se usa directo.
   */
  sidebarExpandedWidth?: number | string;
  sidebarCollapsedWidth?: number | string;
  expandedWidth?: number | string;
  collapsedWidth?: number | string;

  headerHeight?: number | string;

  openIds?: string[];

  onOpenIdsChange?: (
    ids: string[]
  ) => void;

  onSelect?: (
    item: NavigationNode<NavigationLinkMeta>
  ) => void;

  className?: string;
  style?: React.CSSProperties;
}

function toCssSize(value: number | string | undefined, fallback: string): string {
  if (value === undefined) return fallback;
  return typeof value === "number" ? `${value}px` : value;
}

export const AppShellSidebar: React.FC<AppShellSidebarProps> = ({
  viewport = "window",
  items,
  activeId,
  collapsed = false,

  width,
  sidebarExpandedWidth,
  sidebarCollapsedWidth,
  expandedWidth,
  collapsedWidth,

  headerHeight = 64,

  openIds,
  onOpenIdsChange,

  onSelect,

  className = "",
  style,
}) => {
  const resolvedExpandedWidth = toCssSize(
    sidebarExpandedWidth ?? expandedWidth,
    "286px"
  );

  const resolvedCollapsedWidth = toCssSize(
    sidebarCollapsedWidth ?? collapsedWidth,
    "76px"
  );

  const resolvedHeaderHeight = toCssSize(headerHeight, "64px");

  const resolvedWidth =
    width !== undefined
      ? toCssSize(width, "286px")
      : collapsed
        ? resolvedCollapsedWidth
        : resolvedExpandedWidth;

  const isContained = viewport === "contained";

  const handleSelect = React.useCallback(
    (
      item: NavigationNode<NavigationLinkMeta>
    ) => {
      if (!isNavigationNodeSelectable(item)) {
        return;
      }

      onSelect?.(item);
    },
    [
      onSelect,
    ]
  );

  return (
    <Box
      as="aside"
      className={className}
      style={{
        position: isContained ? "absolute" : "fixed",
        top: resolvedHeaderHeight,
        left: 0,
        width: resolvedWidth,
        height: isContained
          ? `calc(100% - ${resolvedHeaderHeight})`
          : `calc(100dvh - ${resolvedHeaderHeight})`,
        zIndex: getScaffoldLayer("sidebar"),
        display: "flex",
        flexDirection: "column",
        overflowY: "auto",
        overflowX: "hidden",
        padding: collapsed ? "0.75rem 0.5rem" : "0.85rem 0.65rem",
        background:
          "linear-gradient(180deg, color-mix(in srgb, var(--ui-surface) 94%, transparent), color-mix(in srgb, var(--ui-surface-2) 94%, transparent))",
        borderRight: "1px solid var(--ui-border)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        transition:
          "width var(--ui-duration-slow) var(--ui-ease-emphasized), " +
          "padding var(--ui-duration-normal) var(--ui-ease-standard)",
        ...style,
      }}
    >
      <NavigationList
        items={items}
        activeId={activeId}
        openIds={openIds}
        onOpenIdsChange={onOpenIdsChange}
        collapsed={collapsed}
        collapsedBehavior="flyout"
        activeBehavior="contains"
        openActiveParents
        ariaLabel="Navegación principal"
        onSelect={handleSelect}
      />
    </Box>
  );
};

AppShellSidebar.displayName = "AppShellSidebar";