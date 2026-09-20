// src/primitives/navigation/navigation-rail/navigationRail.types.ts
import React from "react";

import type {
  SlotPropsMap,
  SlotStyleMap,
} from "../../../helpers/css";

import type {
  NavigationDestinationPublicItemProps,
  NavigationDestinationRootProps,
} from "../shared/navigationDestination.types";

export type NavigationRailPlacement =
  | "left"
  | "right";

export type NavigationRailAlignment =
  | "start"
  | "center"
  | "end"
  | "stretch";

export type NavigationRailSlot =
  | "root"
  | "container"
  | "list"
  | "header"
  | "footer"
  | "item"
  | "activeItem"
  | "content"
  | "activeContent"
  | "iconWrap"
  | "activeIconWrap"
  | "icon"
  | "activeIcon"
  | "label"
  | "activeLabel"
  | "badge"
  | "activeBadge"
  | "dot";

export type NavigationRailStyles =
  SlotStyleMap<NavigationRailSlot>;

export type NavigationRailSlotProps =
  SlotPropsMap<NavigationRailSlot>;

export interface NavigationRailProps
  extends NavigationDestinationRootProps<
    NavigationRailSlot
  > {
  width?:
    number | string;

  placement?:
    NavigationRailPlacement;

  header?:
    React.ReactNode;

  footer?:
    React.ReactNode;

  alignment?:
    NavigationRailAlignment;

  itemMinHeight?:
    number | string;
}

export interface NavigationRailItemProps
  extends NavigationDestinationPublicItemProps<
    NavigationRailSlot
  > {
  itemMinHeight?:
    number | string;
}
