// src/patterns/app-shell/AppShell.tsx
import React from "react";
import { Box } from "../../primitives/layout";
import type {
  AppShellCommonProps,
  AppShellProcessedRoute,
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
        viewport={viewport}
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
          viewport={viewport}
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
          style={sidebarStyle}
        />
      ) : null}

      <AppShellContent
        viewport={viewport}
        isMobile={shell.isMobile}
        headerHeight={resolvedHeaderHeight}
        mobileBarHeight={mobileBarHeight}
        sidebarWidth={shell.isMobile ? 0 : resolvedSidebarWidth}
        style={contentStyle}
      >
        {children}
      </AppShellContent>

      {shell.isMobile ? (
        <AppShellMobileBar
          viewport={viewport}
          routes={processedRoutes}
          activePath={activePath}
          height={mobileBarHeight}
          onNavigate={onNavigate}
          style={mobileBarStyle}
        />
      ) : null}
    </Box>
  );
}

AppShell.displayName = "AppShell";