import React from "react";

export type AppShellRouteId = string;

export interface AppShellRoute {
  id?: AppShellRouteId;
  path: string;
  name: string;

  emoji?: string;
  icon?: React.ReactNode;
  badge?: React.ReactNode;

  disabled?: boolean;
  readonly?: boolean;

  component?: React.ComponentType<any>;
  element?: React.ReactNode;

  subroutes?: AppShellRoute[];

  meta?: Record<string, unknown>;
}

export interface AppShellProcessedRoute extends AppShellRoute {
  id: AppShellRouteId;
  path: string;
  fullPath: string;
  depth: number;
  parentIds: AppShellRouteId[];
  subroutes?: AppShellProcessedRoute[];
}

export type AppShellMobileMode = "auto" | "mobile" | "desktop";

export type AppShellViewport = "window" | "contained";

export interface AppShellUserInfo {
  name?: React.ReactNode;
  role?: React.ReactNode;
  email?: React.ReactNode;
  initials?: string;
}

export interface AppShellBrand {
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  logo?: React.ReactNode;
}

export interface AppShellNavigationPayload {
  route: AppShellProcessedRoute;
  path: string;
}

export interface AppShellCommonProps {
  routes: AppShellRoute[];

  /**
   * window:
   *   App shell de ventana completa.
   *
   * contained:
   *   App shell embebible dentro de cards, sandboxes, docs o previews.
   */
  viewport?: AppShellViewport;

  brand?: AppShellBrand;
  user?: AppShellUserInfo;

  activePath?: string;
  activeRouteId?: string | null;

  collapsed?: boolean;
  onCollapsedChange?: (collapsed: boolean) => void;

  mobileMode?: AppShellMobileMode;
  onMobileModeChange?: (mode: AppShellMobileMode) => void;

  openRouteIds?: string[];
  onOpenRouteIdsChange?: (ids: string[]) => void;

  sidebarExpandedWidth?: number | string;
  sidebarCollapsedWidth?: number | string;
  headerHeight?: number | string;
  mobileBarHeight?: number;

  defaultCollapsed?: boolean;
  defaultMobileMode?: AppShellMobileMode;
  defaultOpenRouteIds?: string[];

  showThemeButton?: boolean;
  showMobileModeButton?: boolean;
  showCollapseButton?: boolean;
  showUserMenu?: boolean;

  logoutLabel?: React.ReactNode;
  onLogout?: () => void | Promise<void>;

  className?: string;
  style?: React.CSSProperties;
  headerStyle?: React.CSSProperties;
  sidebarStyle?: React.CSSProperties;
  contentStyle?: React.CSSProperties;
  mobileBarStyle?: React.CSSProperties;
}

export interface AppShellRenderRouteContext {
  route: AppShellProcessedRoute;
  activePath: string;
}

export type AppShellRouteRenderer = (
  context: AppShellRenderRouteContext
) => React.ReactNode;