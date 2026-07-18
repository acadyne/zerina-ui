// src/patterns/scaffold/adaptive-scaffold/adaptiveScaffold.types.ts

import React from "react";
import type {
  SlotPropsMap,
  SlotStyleMap,
} from "../../../helpers/css";
import type {
  UIViewportKind,
  UIViewportMode,
} from "../../../core/viewport";
import type { BottomNavigationProps } from "../../../primitives/navigation/bottom-navigation";
import type {
  NavigationListProps,
} from "../../../primitives/navigation/NavigationList";
import type { NavigationRailProps } from "../../../primitives/navigation/navigation-rail";
import type {
  ScaffoldProps,
  ScaffoldViewport,
} from "../Scaffold";
import type { TopAppBarProps } from "../TopAppBar";

export type AdaptiveScaffoldMode = UIViewportMode;

export type AdaptiveScaffoldResolvedMode = UIViewportKind;

export type AdaptiveScaffoldMobileNavigation = "bottom" | "none";

export type AdaptiveScaffoldTabletNavigation =
  | "rail"
  | "bottom"
  | "none";

export type AdaptiveScaffoldDesktopNavigation =
  | "sidebar"
  | "rail"
  | "none";

export type AdaptiveScaffoldNavigationPlacement =
  | "start"
  | "end"
  | "top"
  | "bottom";


export interface AdaptiveScaffoldNavigationConfig {
  /**
   * Navegación personalizada.
   */
  content?: React.ReactNode;

  placement?: AdaptiveScaffoldNavigationPlacement;
}


export interface AdaptiveScaffoldNavigationSlots {
  desktop?: AdaptiveScaffoldNavigationConfig;

  tablet?: AdaptiveScaffoldNavigationConfig;

  mobile?: AdaptiveScaffoldNavigationConfig;
}

export type AdaptiveScaffoldSlot =
  | "root"
  | "appBar"
  | "body"
  | "sidebar"
  | "rail"

  | "mobileNavigation"
  | "tabletNavigation"
  | "desktopNavigation"

  | "content"
  | "mobileContent"
  | "tabletContent"
  | "desktopContent";

export type AdaptiveScaffoldStyles =
  SlotStyleMap<AdaptiveScaffoldSlot>;

export type AdaptiveScaffoldSlotProps =
  SlotPropsMap<AdaptiveScaffoldSlot>;

export interface AdaptiveScaffoldItem {
  id: string;
  label: React.ReactNode;

  icon?: React.ReactNode;
  badge?: React.ReactNode;
  disabled?: boolean;

  selectable?: boolean;

  items?: AdaptiveScaffoldItem[];

  meta?: Record<string, unknown>;
}

export interface AdaptiveScaffoldRenderContext {
  mode: AdaptiveScaffoldResolvedMode;
  activeId: string;
  activeItem: AdaptiveScaffoldItem | null;
  items: AdaptiveScaffoldItem[];
  setActiveId: (id: string) => void;
}

export interface AdaptiveScaffoldProps
  extends Omit<
    React.HTMLAttributes<HTMLDivElement>,
    "children" | "defaultValue" | "title"
  > {
  children?:
  | React.ReactNode
  | ((
    context: AdaptiveScaffoldRenderContext
  ) => React.ReactNode);

  viewport?: ScaffoldViewport;

  /**
   * auto:
   *   Usa el modo responsive del viewport.
   *
   * mobile/tablet/desktop:
   *   Fuerza el modo del scaffold.
   */
  mode?: AdaptiveScaffoldMode;

  items: AdaptiveScaffoldItem[];

  activeId?: string | null;
  defaultActiveId?: string | null;

  onActiveIdChange?: (
    id: string,
    item: AdaptiveScaffoldItem
  ) => void;

  mobileNavigation?: AdaptiveScaffoldMobileNavigation;
  tabletNavigation?: AdaptiveScaffoldTabletNavigation;
  desktopNavigation?: AdaptiveScaffoldDesktopNavigation;

  /**
   * Navegación personalizada por viewport.
   *
   * Si existe reemplaza la navegación default.
   */
  navigationSlots?: AdaptiveScaffoldNavigationSlots;

  title?:
  | React.ReactNode
  | ((
    context: AdaptiveScaffoldRenderContext
  ) => React.ReactNode);

  subtitle?:
  | React.ReactNode
  | ((
    context: AdaptiveScaffoldRenderContext
  ) => React.ReactNode);

  leading?:
  | React.ReactNode
  | ((
    context: AdaptiveScaffoldRenderContext
  ) => React.ReactNode);

  actions?:
  | React.ReactNode
  | ((
    context: AdaptiveScaffoldRenderContext
  ) => React.ReactNode);

  floating?:
  | React.ReactNode
  | ((
    context: AdaptiveScaffoldRenderContext
  ) => React.ReactNode);

  showAppBar?: boolean;

  topAppBarProps?: Omit<
    TopAppBarProps,
    "title" | "subtitle" | "leading" | "actions"
  >;

  
scaffoldProps?: Omit<
  ScaffoldProps,
  | "children"
  | "viewport"
  | "appBar"
  | "footer"
  | "floating"
>

  bottomNavigationProps?: Omit<
    BottomNavigationProps,
    "children" | "value" | "defaultValue" | "onValueChange"
  >;

  navigationRailProps?: Omit<
    NavigationRailProps,
    "children" | "value" | "defaultValue" | "onValueChange"
  >;

  navigationListProps?: Omit<
    NavigationListProps,
    "items" | "activeId" | "onSelect"
  >;

  sidebarWidth?: number | string;

  className?: string;
  style?: React.CSSProperties;

  /**
   * API oficial de personalización.
   */
  styles?: AdaptiveScaffoldStyles;
  slotProps?: AdaptiveScaffoldSlotProps;
}

export interface AdaptiveScaffoldNavigationRenderOptions {
  items: AdaptiveScaffoldItem[];
  activeId: string;
  onSelect: (item: AdaptiveScaffoldItem) => void;
}

export interface AdaptiveScaffoldNavigationListOptions {
  items: AdaptiveScaffoldItem[];
}