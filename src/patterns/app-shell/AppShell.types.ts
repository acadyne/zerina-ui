// src/patterns/app-shell/AppShell.types.ts
import React from "react";
import type {
  SlotPropsMap,
  SlotStyleMap,
} from "../../helpers/css";
import type {
  NavigationLinkMeta,
  NavigationNode,
} from "../navigation";

export type AppShellMobileMode =
  | "auto"
  | "mobile"
  | "desktop";

export type AppShellViewport =
  | "window"
  | "contained";

export type AppShellSlot =
  | "root"
  | "header"
  | "sidebar"
  | "content"
  | "contentPanel"
  | "mobileBar";


  
export type AppShellStyles =
  SlotStyleMap<AppShellSlot>;

export type AppShellSlotProps =
  SlotPropsMap<AppShellSlot>;

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

export interface AppShellCommonProps {
  navigation: NavigationNode<NavigationLinkMeta>[];

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

  /**
   * Reemplaza el bloque default de marca/logo.
   */
  headerStart?: React.ReactNode;

  /**
   * Zona central del header.
   * Útil para search, breadcrumbs, tabs, command bar o estado contextual.
   */
  headerCenter?: React.ReactNode;

  /**
   * Zona adicional antes de las acciones default del header.
   */
  headerEnd?: React.ReactNode;

  activeId?: string | null;

  collapsed?: boolean;
  onCollapsedChange?: (
    collapsed: boolean
  ) => void;

  mobileMode?: AppShellMobileMode;

  onMobileModeChange?: (
    mode: AppShellMobileMode
  ) => void;

  openRouteIds?: string[];

  onOpenRouteIdsChange?: (
    ids: string[]
  ) => void;

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

  styles?: AppShellStyles;

  slotProps?: AppShellSlotProps;
}