// src/patterns/app-shell/AppShellSidebar.tsx
import React from "react";
import { Box } from "../../primitives/layout";
import {
  NavigationList,
  type NavigationItemDef,
} from "../../primitives/navigation";
import type {
  AppShellProcessedRoute,
  AppShellViewport,
} from "./AppShell.types";
import {
  flattenAppShellRoutes,
  getAppShellRouteChildren,
  getAppShellRouteId,
  isAppShellRouteActive,
  isAppShellRouteSelectable,
} from "./AppShellRouteUtils";
import { getScaffoldLayer } from "../scaffold/scaffoldLayers";

export interface AppShellSidebarProps {
  viewport?: AppShellViewport;

  routes: AppShellProcessedRoute[];

  activeRouteId?: string | null;
  activePath?: string;

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

  openRouteIds?: string[];
  onOpenRouteIdsChange?: (ids: string[]) => void;

  onNavigate?: (route: AppShellProcessedRoute) => void;
  onRouteSelect?: (route: AppShellProcessedRoute) => void;

  className?: string;
  style?: React.CSSProperties;
}

function toCssSize(value: number | string | undefined, fallback: string): string {
  if (value === undefined) return fallback;
  return typeof value === "number" ? `${value}px` : value;
}

function getActiveNavigationId({
  routes,
  activeRouteId,
  activePath,
}: {
  routes: AppShellProcessedRoute[];
  activeRouteId?: string | null;
  activePath?: string;
}): string | null {
  if (activeRouteId) {
    return activeRouteId;
  }

  if (!activePath) {
    return null;
  }

  const activeRoutes = flattenAppShellRoutes(routes)
    .filter((route) => isAppShellRouteActive(activePath, route))
    .sort((a, b) => b.depth - a.depth);

  return activeRoutes[0]?.id ?? null;
}

function routeToNavigationItem(
  route: AppShellProcessedRoute
): NavigationItemDef {
  const children = getAppShellRouteChildren(route);
  const routeHasChildren = children.length > 0;

  return {
    id: getAppShellRouteId(route),
    label: route.name,
    icon: route.icon ?? route.emoji ?? "•",
    badge: route.badge,
    disabled: route.disabled,
    selectable: routeHasChildren ? false : isAppShellRouteSelectable(route),
    items: routeHasChildren ? children.map(routeToNavigationItem) : undefined,
    meta: {
      route,
    },
  };
}

function getRouteFromNavigationItem(
  item: NavigationItemDef
): AppShellProcessedRoute | null {
  const route = item.meta?.route;

  if (!route || typeof route !== "object") {
    return null;
  }

  return route as AppShellProcessedRoute;
}

export const AppShellSidebar: React.FC<AppShellSidebarProps> = ({
  viewport = "window",
  routes,
  activeRouteId,
  activePath,
  collapsed = false,

  width,
  sidebarExpandedWidth,
  sidebarCollapsedWidth,
  expandedWidth,
  collapsedWidth,

  headerHeight = 64,

  openRouteIds,
  onOpenRouteIdsChange,

  onNavigate,
  onRouteSelect,

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
  const items = React.useMemo(() => {
    return routes.map(routeToNavigationItem);
  }, [routes]);

  const activeId = React.useMemo(
    () =>
      getActiveNavigationId({
        routes,
        activeRouteId,
        activePath,
      }),
    [activePath, activeRouteId, routes]
  );

  const handleSelect = React.useCallback(
    (item: NavigationItemDef) => {
      const route = getRouteFromNavigationItem(item);

      if (!route) return;
      if (!isAppShellRouteSelectable(route)) return;

      onNavigate?.(route);
      onRouteSelect?.(route);
    },
    [onNavigate, onRouteSelect]
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
        openIds={openRouteIds}
        onOpenIdsChange={onOpenRouteIdsChange}
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