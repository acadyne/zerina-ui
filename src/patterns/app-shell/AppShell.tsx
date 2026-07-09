// src/patterns/app-shell/AppShell.tsx
import React from "react";
import { Box } from "../../primitives/layout";
import type {
  AppShellCommonProps,
  AppShellProcessedRoute,
  AppShellViewport,
} from "./AppShell.types";
import { processAppShellRoutes } from "./AppShellRouteUtils";
import { useAppShellState } from "./useAppShellState";
import { AppShellHeader } from "./AppShellHeader";
import { AppShellSidebar } from "./AppShellSidebar";
import { AppShellMobileBar } from "./AppShellMobileBar";
import { AppShellContent } from "./AppShellContent";

function cssSize(value: number | string): string {
  return typeof value === "number" ? `${value}px` : value;
}

function getShellLengthBase(viewport: AppShellViewport): string {
  return viewport === "contained" ? "100%" : "100dvh";
}

function getContentHeight({
  viewport,
  isMobile,
  headerHeight,
  mobileBarHeight,
}: {
  viewport: AppShellViewport;
  isMobile: boolean;
  headerHeight: string;
  mobileBarHeight: number;
}): string {
  const base = getShellLengthBase(viewport);

  if (isMobile) {
    return `calc(${base} - ${headerHeight} - ${mobileBarHeight}px - env(safe-area-inset-bottom))`;
  }

  return `calc(${base} - ${headerHeight})`;
}

export interface AppShellProps extends AppShellCommonProps {
  children?: React.ReactNode;

  /**
   * Se dispara cuando una ruta navegable es seleccionada.
   *
   * En UncontrolledAppShell cambia la vista interna.
   * En RoutedAppShell puede llamar al navigate del router externo.
   */
  onNavigate?: (route: AppShellProcessedRoute) => void;
}

export function AppShell({
  routes,
  children,

  viewport = "window",

  brand,
  user,

  activePath = "/",
  activeRouteId,

  collapsed,
  onCollapsedChange,

  mobileMode,
  onMobileModeChange,

  openRouteIds,
  onOpenRouteIdsChange,

  sidebarExpandedWidth = 280,
  sidebarCollapsedWidth = 74,
  headerHeight = 64,
  mobileBarHeight = 68,

  defaultCollapsed = false,
  defaultMobileMode = "auto",
  defaultOpenRouteIds = [],

  showThemeButton = true,
  showMobileModeButton = true,
  showCollapseButton = true,
  showUserMenu = true,

  logoutLabel,
  onLogout,

  onNavigate,

  className = "",
  style,
  headerStyle,
  sidebarStyle,
  contentStyle,
  mobileBarStyle,
}: AppShellProps) {
  const isContained = viewport === "contained";

  const processedRoutes = React.useMemo(
    () => processAppShellRoutes(routes),
    [routes]
  );

  const shell = useAppShellState({
    collapsed,
    defaultCollapsed,
    onCollapsedChange,

    mobileMode,
    defaultMobileMode,
    onMobileModeChange,

    openRouteIds,
    defaultOpenRouteIds,
    onOpenRouteIdsChange,

    activeRouteId,
  });

  const sidebarWidth = shell.collapsed
    ? sidebarCollapsedWidth
    : sidebarExpandedWidth;

  const resolvedHeaderHeight = cssSize(headerHeight);
  const resolvedSidebarWidth = cssSize(sidebarWidth);

  const resolvedActiveRouteId = activeRouteId ?? activePath;

  const contentHeight = getContentHeight({
    viewport,
    isMobile: shell.isMobile,
    headerHeight: resolvedHeaderHeight,
    mobileBarHeight,
  });

  const handleSidebarRouteSelect = React.useCallback(
    (route: AppShellProcessedRoute) => {
      onNavigate?.(route);
    },
    [onNavigate]
  );

  return (
    <Box
      className={className}
      data-ui-app-shell-viewport={viewport}
      style={{
        width: "100%",
        height: isContained ? "100%" : undefined,
        minHeight: isContained ? 0 : "100dvh",
        minWidth: 0,
        position: "relative",
        overflow: isContained ? "hidden" : undefined,
        background: "var(--ui-bg)",
        color: "var(--ui-text)",
        ...style,
      }}
    >
      <AppShellHeader
        brand={brand}
        user={user}
        collapsed={shell.collapsed}
        isMobile={shell.isMobile}
        height={resolvedHeaderHeight}
        showCollapseButton={showCollapseButton}
        showMobileModeButton={showMobileModeButton}
        showThemeButton={showThemeButton}
        showUserMenu={showUserMenu}
        onToggleCollapsed={shell.toggleCollapsed}
        onToggleMobileMode={shell.toggleMobileMode}
        logoutLabel={logoutLabel}
        onLogout={onLogout}
        style={headerStyle}
      />

      {!shell.isMobile ? (
        <AppShellSidebar
          routes={processedRoutes}
          activeRouteId={resolvedActiveRouteId}
          activePath={activePath}
          collapsed={shell.collapsed}
          sidebarExpandedWidth={sidebarExpandedWidth}
          sidebarCollapsedWidth={sidebarCollapsedWidth}
          headerHeight={resolvedHeaderHeight}
          openRouteIds={openRouteIds}
          onOpenRouteIdsChange={onOpenRouteIdsChange}
          onRouteSelect={handleSidebarRouteSelect}
          style={{
            position: isContained ? "absolute" : undefined,
            height: isContained
              ? `calc(100% - ${resolvedHeaderHeight})`
              : undefined,
            width: resolvedSidebarWidth,
            ...sidebarStyle,
          }}
        />
      ) : null}

      <AppShellContent
        isMobile={shell.isMobile}
        headerHeight={resolvedHeaderHeight}
        mobileBarHeight={mobileBarHeight}
        sidebarWidth={shell.isMobile ? 0 : resolvedSidebarWidth}
        style={{
          height: contentHeight,
          ...contentStyle,
        }}
      >
        {children}
      </AppShellContent>

      {shell.isMobile ? (
        <AppShellMobileBar
          routes={processedRoutes}
          activePath={activePath}
          height={mobileBarHeight}
          onNavigate={onNavigate}
          style={{
            position: isContained ? "absolute" : undefined,
            ...mobileBarStyle,
          }}
        />
      ) : null}
    </Box>
  );
}

AppShell.displayName = "AppShell";