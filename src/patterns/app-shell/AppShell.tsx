// src/patterns/app-shell/AppShell.tsx
import React from "react";
import { cssSize, resolveSlot } from "../../helpers/css";
import { Box } from "../../primitives/layout";
import type {
  AppShellCommonProps,
  AppShellProcessedRoute,
  AppShellSlot,
} from "./AppShell.types";
import { processAppShellRoutes } from "./AppShellRouteUtils";
import { useAppShellState } from "./useAppShellState";
import { AppShellHeader } from "./AppShellHeader";
import { AppShellSidebar } from "./AppShellSidebar";
import { AppShellMobileBar } from "./AppShellMobileBar";
import { AppShellContent } from "./AppShellContent";

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

  headerStart,
  headerCenter,
  headerEnd,

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

  styles,
  slotProps,
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

  const rootSlot = resolveSlot<AppShellSlot>({
    slot: "root",
    styles,
    slotProps,
    className,
    style,
    baseProps: {
      "data-ui-app-shell": "",
      "data-ui-app-shell-viewport": viewport,
      "data-ui-app-shell-mobile": shell.isMobile || undefined,
      "data-ui-app-shell-collapsed": shell.collapsed || undefined,
    },
    baseStyle: {
      width: "100%",
      height: isContained ? "100%" : undefined,
      minHeight: isContained ? 0 : "100dvh",
      minWidth: 0,
      position: "relative",
      overflow: isContained ? "hidden" : undefined,
      background: "var(--ui-bg)",
      color: "var(--ui-text)",
    },
  });

  const headerSlot = resolveSlot<AppShellSlot>({
    slot: "header",
    styles,
    slotProps,
  });

  const sidebarSlot = resolveSlot<AppShellSlot>({
    slot: "sidebar",
    styles,
    slotProps,
  });

  const contentSlot = resolveSlot<AppShellSlot>({
    slot: "content",
    styles,
    slotProps,
  });

  const contentPanelSlot = resolveSlot<AppShellSlot>({
    slot: "contentPanel",
    styles,
    slotProps,
  });

  const mobileBarSlot = resolveSlot<AppShellSlot>({
    slot: "mobileBar",
    styles,
    slotProps,
  });

  return (
    <Box {...rootSlot}>
      <AppShellHeader
        viewport={viewport}
        brand={brand}
        user={user}
        headerStart={headerStart}
        headerCenter={headerCenter}
        headerEnd={headerEnd}
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
        className={headerSlot.className}
        style={headerSlot.style}
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
          className={sidebarSlot.className}
          style={sidebarSlot.style}
        />
      ) : null}

      <AppShellContent
        viewport={viewport}
        isMobile={shell.isMobile}
        headerHeight={resolvedHeaderHeight}
        mobileBarHeight={mobileBarHeight}
        sidebarWidth={shell.isMobile ? 0 : resolvedSidebarWidth}
        className={contentSlot.className}
        style={contentSlot.style}
        styles={{
          panel: contentPanelSlot.style,
        }}
        slotProps={{
          panel: {
            className: contentPanelSlot.className,
          },
        }}
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
          className={mobileBarSlot.className}
          style={mobileBarSlot.style}
        />
      ) : null}
    </Box>
  );
}

AppShell.displayName = "AppShell";