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
  NavigationNode,
} from "../../navigation";
import type {
  ScaffoldProps,
  ScaffoldViewport,
} from "../Scaffold";
import type { TopAppBarProps } from "../TopAppBar";


export type AdaptiveScaffoldMode = UIViewportMode;

export type AdaptiveScaffoldResolvedMode = UIViewportKind;


export type AdaptiveScaffoldMobileNavigation =
  | "bottom"
  | "none";


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


export interface AdaptiveScaffoldRenderContext<
  TMeta = unknown
> {
  mode: AdaptiveScaffoldResolvedMode;

  activeId: string;

  activeItem: NavigationNode<TMeta> | null;

  items: NavigationNode<TMeta>[];

  setActiveId: (
    id: string
  ) => void;
}


export interface AdaptiveScaffoldProps<
  TMeta = unknown
>
  extends Omit<
    React.HTMLAttributes<HTMLDivElement>,
    "children" | "defaultValue" | "title"
  > {

  children?:
  | React.ReactNode
  | ((
    context: AdaptiveScaffoldRenderContext<TMeta>
  ) => React.ReactNode);

  viewport?: ScaffoldViewport;


  mode?: AdaptiveScaffoldMode;


  items: NavigationNode<TMeta>[];


  activeId?: string | null;

  defaultActiveId?: string | null;


  onActiveIdChange?: (
    id: string,
    item: NavigationNode<TMeta>
  ) => void;


  mobileNavigation?: AdaptiveScaffoldMobileNavigation;

  tabletNavigation?: AdaptiveScaffoldTabletNavigation;

  desktopNavigation?: AdaptiveScaffoldDesktopNavigation;


  navigationSlots?: AdaptiveScaffoldNavigationSlots;


  title?:
  | React.ReactNode
  | ((
    context: AdaptiveScaffoldRenderContext<TMeta>
  ) => React.ReactNode);


  subtitle?:
  | React.ReactNode
  | ((
    context: AdaptiveScaffoldRenderContext<TMeta>
  ) => React.ReactNode);


  leading?:
  | React.ReactNode
  | ((
    context: AdaptiveScaffoldRenderContext<TMeta>
  ) => React.ReactNode);


  actions?:
  | React.ReactNode
  | ((
    context: AdaptiveScaffoldRenderContext<TMeta>
  ) => React.ReactNode);


  floating?:
  | React.ReactNode
  | ((
    context: AdaptiveScaffoldRenderContext<TMeta>
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
  >;


  bottomNavigationProps?: Omit<
    BottomNavigationProps,
    "children"
    | "value"
    | "defaultValue"
    | "onValueChange"
  >;


  navigationRailProps?: Omit<
    NavigationRailProps,
    "children"
    | "value"
    | "defaultValue"
    | "onValueChange"
  >;


  navigationListProps?: Omit<
    NavigationListProps<TMeta>,
    "items"
    | "activeId"
    | "onSelect"
  >;

  sidebarWidth?: number | string;


  className?: string;

  style?: React.CSSProperties;


  styles?: AdaptiveScaffoldStyles;

  slotProps?: AdaptiveScaffoldSlotProps;
}


export interface AdaptiveScaffoldNavigationRenderOptions<
  TMeta = unknown
> {
  activeId: string;

  items: NavigationNode<TMeta>[];

  onSelect: (
    item: NavigationNode<TMeta>
  ) => void;
}

export interface AdaptiveScaffoldNavigationListOptions<
  TMeta = unknown
> {
  items: NavigationNode<TMeta>[];
}