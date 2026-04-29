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
      style={{
        width: "100%",
        minHeight: "100dvh",
        minWidth: 0,
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
          collapsed={shell.collapsed}
          sidebarExpandedWidth={sidebarExpandedWidth}
          sidebarCollapsedWidth={sidebarCollapsedWidth}
          headerHeight={resolvedHeaderHeight}
          onRouteSelect={handleSidebarRouteSelect}
          style={{
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
        style={contentStyle}
      >
        {children}
      </AppShellContent>

      {shell.isMobile ? (
        <AppShellMobileBar
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