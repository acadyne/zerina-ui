// src/primitives/navigation/bottom-navigation/bottomNavigation.types.ts
import React from "react";
import type { UIPressEvent } from "../../../core/interaction";
import type {
  SlotPropsMap,
  SlotStyleMap,
} from "../../../helpers/css";
import type {
  NavigationDestinationBadgeAnchor,
  NavigationDestinationBadgeOffset,
  NavigationDestinationBadgePlacement,
  NavigationDestinationDensity,
  NavigationDestinationIndicator,
  NavigationDestinationItemShape,
  NavigationDestinationLabelBehavior,
  NavigationSurfacePosition,
  NavigationSurfaceVariant,
} from "../shared/navigation-shared.types";
import type {
  NavigationSelectionContext,
  NavigationSelectionReason,
} from "../shared/navigationSelection";

export type BottomNavigationPosition =
  NavigationSurfacePosition;

export type BottomNavigationVariant =
  NavigationSurfaceVariant;

export type BottomNavigationLabelBehavior =
  NavigationDestinationLabelBehavior;

export type BottomNavigationIndicator =
  NavigationDestinationIndicator;

export type BottomNavigationDensity =
  NavigationDestinationDensity;

export type BottomNavigationBadgeAnchor =
  NavigationDestinationBadgeAnchor;

export type BottomNavigationBadgePlacement =
  NavigationDestinationBadgePlacement;

export type BottomNavigationItemShape =
  NavigationDestinationItemShape;

export type BottomNavigationIconPosition =
  | "top"
  | "start";

export interface BottomNavigationBadgeOffset
  extends NavigationDestinationBadgeOffset {}

export type BottomNavigationSlot =
  | "root"
  | "list"
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

export type BottomNavigationStyles =
  SlotStyleMap<BottomNavigationSlot>;

export type BottomNavigationSlotProps =
  SlotPropsMap<BottomNavigationSlot>;

export interface BottomNavigationProps
  extends Omit<
    React.HTMLAttributes<HTMLElement>,
    "onChange" | "defaultValue"
  > {
  children?: React.ReactNode;

  value?: string | null;
  defaultValue?: string | null;


  /**
 * Se ejecuta cada vez que el usuario selecciona un destino.
 *
 * `context.reason` distingue entre:
 *
 * - "change": se seleccionó un valor diferente
 * - "reselect": se volvió a seleccionar el valor activo
 */
onValueChange?: (
  value: string,
  event: UIPressEvent<HTMLButtonElement>,
  context: BottomNavigationSelectionContext
) => void;

  height?: number | string;
  position?: BottomNavigationPosition;
  safeArea?: boolean;
  translucent?: boolean;

  variant?: BottomNavigationVariant;
  labelBehavior?: BottomNavigationLabelBehavior;
  indicator?: BottomNavigationIndicator;
  density?: BottomNavigationDensity;

  badgeAnchor?: BottomNavigationBadgeAnchor;
  badgePlacement?: BottomNavigationBadgePlacement;
  badgeOffset?: BottomNavigationBadgeOffset;

  itemShape?: BottomNavigationItemShape;
  itemMinWidth?: number | string;

  iconPosition?: BottomNavigationIconPosition;
  activeLabelWeight?: number;

  className?: string;
  style?: React.CSSProperties;

  styles?: BottomNavigationStyles;
  slotProps?: BottomNavigationSlotProps;
}

export interface BottomNavigationItemProps
  extends Omit<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    | "children"
    | "onClick"
    | "onSelect"
    | "value"
    | "type"
    | "aria-current"
  > {
  value: string;

  children?: React.ReactNode;
  label?: React.ReactNode;
  icon?: React.ReactNode;
  badge?: React.ReactNode;

  disabled?: boolean;

  onPress?: (
    event: UIPressEvent<HTMLButtonElement>
  ) => void;

  labelBehavior?: BottomNavigationLabelBehavior;
  indicator?: BottomNavigationIndicator;

  badgeAnchor?: BottomNavigationBadgeAnchor;
  badgePlacement?: BottomNavigationBadgePlacement;
  badgeOffset?: BottomNavigationBadgeOffset;

  itemShape?: BottomNavigationItemShape;
  itemMinWidth?: number | string;

  iconPosition?: BottomNavigationIconPosition;
  activeLabelWeight?: number;

  styles?: BottomNavigationStyles;
  slotProps?: BottomNavigationSlotProps;

  className?: string;
  style?: React.CSSProperties;
}

export type BottomNavigationSelectionReason =
  NavigationSelectionReason;

export interface BottomNavigationSelectionContext
  extends NavigationSelectionContext {}
