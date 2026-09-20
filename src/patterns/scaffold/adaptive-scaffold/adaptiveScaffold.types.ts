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
  NavigationCompactPolicy,
  NavigationNode,
  NavigationPresentation,
  NavigationPresenterBottomProps,
  NavigationPresenterDrawerProps,
  NavigationPresenterListProps,
  NavigationPresenterRailProps,
  NavigationSide,
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


export type AdaptiveScaffoldMobilePresentation =
  | Extract<
      NavigationPresentation,
      "bottom"
    >
  | "none";


export type AdaptiveScaffoldTabletPresentation =
  | Extract<
      NavigationPresentation,
      "rail" | "bottom"
    >
  | "none";


export type AdaptiveScaffoldDesktopPresentation =
  | Extract<
      NavigationPresentation,
      "sidebar" | "rail"
    >
  | "none";


export type AdaptiveScaffoldMobileNavigationPlacement =
  | "top"
  | "bottom";


export type AdaptiveScaffoldTabletNavigationPlacement =
  | NavigationSide
  | "bottom";


export interface AdaptiveScaffoldNavigationModeConfig<
  TPresentation extends string,
  TPlacement extends string,
> {
  presentation?:
    TPresentation;

  placement?:
    TPlacement;

  /**
   * Cuando existe, reemplaza por completo la presentación built-in
   * de este modo.
   */
  content?:
    React.ReactNode;
}


export type AdaptiveScaffoldMobileNavigationConfig =
  AdaptiveScaffoldNavigationModeConfig<
    AdaptiveScaffoldMobilePresentation,
    AdaptiveScaffoldMobileNavigationPlacement
  >;


export type AdaptiveScaffoldTabletNavigationConfig =
  AdaptiveScaffoldNavigationModeConfig<
    AdaptiveScaffoldTabletPresentation,
    AdaptiveScaffoldTabletNavigationPlacement
  >;


export type AdaptiveScaffoldDesktopNavigationConfig =
  AdaptiveScaffoldNavigationModeConfig<
    AdaptiveScaffoldDesktopPresentation,
    NavigationSide
  >;


/**
 * Un único contrato contiene la política responsive y la configuración
 * de todas las presentaciones de navegación.
 */
export interface AdaptiveScaffoldNavigation<
  TMeta = unknown,
> {
  mobile?:
    AdaptiveScaffoldMobileNavigationConfig;

  tablet?:
    AdaptiveScaffoldTabletNavigationConfig;

  desktop?:
    AdaptiveScaffoldDesktopNavigationConfig;

  compact?:
    NavigationCompactPolicy;

  bottom?:
    NavigationPresenterBottomProps;

  rail?:
    NavigationPresenterRailProps;

  list?:
    NavigationPresenterListProps<TMeta>;

  drawer?:
    NavigationPresenterDrawerProps<TMeta>;
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
 * Las props del root físico se reciben directamente.
 * La navegación responsive se configura únicamente mediante `navigation`.
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

  navigation?:
    AdaptiveScaffoldNavigation<TMeta>;

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

  /**
   * Ancho del sidebar desktop built-in.
   *
   * Rail posee su propio `width` en `navigation.rail`.
   * Navegaciones custom se dimensionan mediante sus slots.
   */
  sidebarWidth?:
    number | string;

  styles?:
    AdaptiveScaffoldStyles;

  slotProps?:
    AdaptiveScaffoldSlotProps;
}
