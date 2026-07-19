// src/primitives/navigation/navigation-rail/navigationRail.types.ts
import React from "react";
import type { UIPressEvent } from "../../../core/interaction";
import type {
  SlotPropsMap,
  SlotStyleMap,
} from "../../../helpers/css";

export type NavigationRailPosition =
  | "fixed"
  | "sticky"
  | "static";

export type NavigationRailPlacement =
  | "left"
  | "right";

export type NavigationRailVariant =
  | "plain"
  | "surface"
  | "floating";

export type NavigationRailLabelBehavior =
  | "always"
  | "active"
  | "never";

export type NavigationRailIndicator =
  | "background"
  | "pill"
  | "dot"
  | "none";

export type NavigationRailDensity =
  | "compact"
  | "comfortable";

export type NavigationRailBadgeAnchor =
  | "icon"
  | "content"
  | "item";

export type NavigationRailBadgePlacement =
  | "top-end"
  | "top-center"
  | "inline-end";

export type NavigationRailItemShape =
  | "rounded"
  | "pill"
  | "circle"
  | "none";

export type NavigationRailAlignment =
  | "start"
  | "center"
  | "end"
  | "stretch";

export interface NavigationRailBadgeOffset {
  x?: number | string;
  y?: number | string;
}

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
  extends Omit<
    React.HTMLAttributes<HTMLElement>,
    "onChange" | "defaultValue"
  > {
  children?: React.ReactNode;

  value?: string | null;
  defaultValue?: string | null;

  /**
   * Se ejecuta cuando el usuario selecciona un destino.
   *
   * `context.reason` distingue entre:
   *
   * - "change": se seleccionó un destino diferente
   * - "reselect": se volvió a seleccionar el destino activo
   */
  onValueChange?: (
    value: string,
    event: UIPressEvent<HTMLElement>,
    context: NavigationRailSelectionContext
  ) => void;

  width?: number | string;
  position?: NavigationRailPosition;
  placement?: NavigationRailPlacement;
  safeArea?: boolean;
  translucent?: boolean;

  header?: React.ReactNode;
  footer?: React.ReactNode;

  variant?: NavigationRailVariant;
  labelBehavior?: NavigationRailLabelBehavior;
  indicator?: NavigationRailIndicator;
  density?: NavigationRailDensity;
  alignment?: NavigationRailAlignment;

  badgeAnchor?: NavigationRailBadgeAnchor;
  badgePlacement?: NavigationRailBadgePlacement;
  badgeOffset?: NavigationRailBadgeOffset;

  itemShape?: NavigationRailItemShape;
  itemMinWidth?: number | string;
  itemMinHeight?: number | string;

  activeLabelWeight?: number;

  className?: string;
  style?: React.CSSProperties;

  styles?: NavigationRailStyles;
  slotProps?: NavigationRailSlotProps;
}

export interface NavigationRailItemProps
  extends Omit<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    "children" | "onClick" | "onSelect" | "value"
  > {
  value: string;

  children?: React.ReactNode;
  label?: React.ReactNode;
  icon?: React.ReactNode;
  badge?: React.ReactNode;

  disabled?: boolean;

  onPress?: (
    event: UIPressEvent<HTMLElement>
  ) => void;

  labelBehavior?: NavigationRailLabelBehavior;
  indicator?: NavigationRailIndicator;

  badgeAnchor?: NavigationRailBadgeAnchor;
  badgePlacement?: NavigationRailBadgePlacement;
  badgeOffset?: NavigationRailBadgeOffset;

  itemShape?: NavigationRailItemShape;
  itemMinWidth?: number | string;
  itemMinHeight?: number | string;

  activeLabelWeight?: number;

  styles?: NavigationRailStyles;
  slotProps?: NavigationRailSlotProps;

  className?: string;
  style?: React.CSSProperties;
}


export type NavigationRailSelectionReason =
  | "change"
  | "reselect";

export interface NavigationRailSelectionContext {
  value: string;
  previousValue: string | null;
  reason: NavigationRailSelectionReason;
}