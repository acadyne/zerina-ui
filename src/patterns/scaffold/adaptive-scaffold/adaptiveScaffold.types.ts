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

import type {
  BottomNavigationProps,
} from "../../../primitives/navigation/bottom-navigation";

import type {
  NavigationListProps,
} from "../../../primitives/navigation/NavigationList";

import type {
  NavigationRailProps,
} from "../../../primitives/navigation/navigation-rail";

import type {
  NavigationNode,
} from "../../navigation";

import type {
  ScaffoldProps,
  ScaffoldViewport,
} from "../Scaffold";

import type {
  TopAppBarProps,
} from "../TopAppBar";

export type AdaptiveScaffoldMode =
  UIViewportMode;

export type AdaptiveScaffoldResolvedMode =
  UIViewportKind;

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

export type AdaptiveScaffoldMobileNavigationPlacement =
  | "top"
  | "bottom";

export type AdaptiveScaffoldSideNavigationPlacement =
  | "start"
  | "end";

export type AdaptiveScaffoldTabletNavigationPlacement =
  | AdaptiveScaffoldSideNavigationPlacement
  | "bottom";

export interface AdaptiveScaffoldNavigationConfig<
  TPlacement extends string,
> {
  /**
   * Reemplaza por completo la navegación built-in del modo.
   */
  content?:
    React.ReactNode;

  placement?:
    TPlacement;
}

export interface AdaptiveScaffoldNavigationSlots {
  mobile?:
    AdaptiveScaffoldNavigationConfig<
      AdaptiveScaffoldMobileNavigationPlacement
    >;

  tablet?:
    AdaptiveScaffoldNavigationConfig<
      AdaptiveScaffoldTabletNavigationPlacement
    >;

  desktop?:
    AdaptiveScaffoldNavigationConfig<
      AdaptiveScaffoldSideNavigationPlacement
    >;
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
  TMeta = unknown,
> {
  mode:
    AdaptiveScaffoldResolvedMode;

  activeId:
    string;

  activeItem:
    NavigationNode<TMeta> | null;

  items:
    NavigationNode<TMeta>[];

  setActiveId:
    (
      id: string
    ) => void;
}

/**
 * AdaptiveScaffold especializa Scaffold.
 *
 * Las props del root físico (safeArea, insets, eventos, data/aria,
 * className, style...) se reciben directamente. No existe un segundo
 * canal `scaffoldProps`.
 */
export interface AdaptiveScaffoldProps<
  TMeta = unknown,
>
  extends Omit<
    ScaffoldProps,
    | "children"
    | "viewport"
    | "appBar"
    | "footer"
    | "floating"
    | "styles"
    | "slotProps"
    | "title"
  > {
  children?:
    | React.ReactNode
    | ((
        context:
          AdaptiveScaffoldRenderContext<TMeta>
      ) => React.ReactNode);

  viewport?:
    ScaffoldViewport;

  mode?:
    AdaptiveScaffoldMode;

  items:
    NavigationNode<TMeta>[];

  activeId?:
    string | null;

  defaultActiveId?:
    string | null;

  onActiveIdChange?:
    (
      id: string,
      item: NavigationNode<TMeta>
    ) => void;

  mobileNavigation?:
    AdaptiveScaffoldMobileNavigation;

  tabletNavigation?:
    AdaptiveScaffoldTabletNavigation;

  desktopNavigation?:
    AdaptiveScaffoldDesktopNavigation;

  navigationSlots?:
    AdaptiveScaffoldNavigationSlots;

  title?:
    | React.ReactNode
    | ((
        context:
          AdaptiveScaffoldRenderContext<TMeta>
      ) => React.ReactNode);

  subtitle?:
    | React.ReactNode
    | ((
        context:
          AdaptiveScaffoldRenderContext<TMeta>
      ) => React.ReactNode);

  leading?:
    | React.ReactNode
    | ((
        context:
          AdaptiveScaffoldRenderContext<TMeta>
      ) => React.ReactNode);

  actions?:
    | React.ReactNode
    | ((
        context:
          AdaptiveScaffoldRenderContext<TMeta>
      ) => React.ReactNode);

  floating?:
    | React.ReactNode
    | ((
        context:
          AdaptiveScaffoldRenderContext<TMeta>
      ) => React.ReactNode);

  showAppBar?:
    boolean;

  topAppBarProps?:
    Omit<
      TopAppBarProps,
      | "title"
      | "subtitle"
      | "leading"
      | "actions"
      | "safeAreaTop"
    >;

  bottomNavigationProps?:
    Omit<
      BottomNavigationProps,
      | "children"
      | "value"
      | "defaultValue"
      | "onValueChange"
      | "position"
      | "safeArea"
    >;

  navigationRailProps?:
    Omit<
      NavigationRailProps,
      | "children"
      | "value"
      | "defaultValue"
      | "onValueChange"
      | "position"
      | "placement"
      | "safeArea"
    >;

  navigationListProps?:
    Omit<
      NavigationListProps<TMeta>,
      | "items"
      | "activeId"
      | "onSelect"
    >;

  /**
   * Ancho del sidebar desktop built-in.
   *
   * Rail posee su propio `width` en `navigationRailProps`.
   * Navegaciones custom se dimensionan mediante sus slots.
   */
  sidebarWidth?:
    number | string;

  styles?:
    AdaptiveScaffoldStyles;

  slotProps?:
    AdaptiveScaffoldSlotProps;
}
