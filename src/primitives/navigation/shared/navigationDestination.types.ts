import React from "react";

import type {
  UIPressEvent,
} from "../../../core/interaction";

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
} from "./navigation-shared.types";

import type {
  NavigationSelectionContext,
} from "./navigationSelection";

export interface NavigationDestinationRootProps<
  TSlot extends string,
> extends Omit<
    React.HTMLAttributes<HTMLElement>,
    "onChange" | "defaultValue"
  > {
  children?:
    React.ReactNode;

  value?:
    string | null;

  defaultValue?:
    string | null;

  onValueChange?: (
    value: string,
    event: UIPressEvent<HTMLButtonElement>,
    context: NavigationSelectionContext,
  ) => void;

  position?:
    NavigationSurfacePosition;

  safeArea?:
    boolean;

  translucent?:
    boolean;

  variant?:
    NavigationSurfaceVariant;

  labelBehavior?:
    NavigationDestinationLabelBehavior;

  indicator?:
    NavigationDestinationIndicator;

  density?:
    NavigationDestinationDensity;

  badgeAnchor?:
    NavigationDestinationBadgeAnchor;

  badgePlacement?:
    NavigationDestinationBadgePlacement;

  badgeOffset?:
    NavigationDestinationBadgeOffset;

  itemShape?:
    NavigationDestinationItemShape;

  itemMinWidth?:
    number | string;

  activeLabelWeight?:
    number;

  styles?:
    SlotStyleMap<TSlot>;

  slotProps?:
    SlotPropsMap<TSlot>;
}

export interface NavigationDestinationPublicItemProps<
  TSlot extends string,
> extends Omit<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    | "children"
    | "onClick"
    | "onSelect"
    | "value"
    | "type"
    | "aria-current"
  > {
  value:
    string;

  children?:
    React.ReactNode;

  label?:
    React.ReactNode;

  icon?:
    React.ReactNode;

  badge?:
    React.ReactNode;

  disabled?:
    boolean;

  onPress?: (
    event: UIPressEvent<HTMLButtonElement>,
  ) => void;

  labelBehavior?:
    NavigationDestinationLabelBehavior;

  indicator?:
    NavigationDestinationIndicator;

  badgeAnchor?:
    NavigationDestinationBadgeAnchor;

  badgePlacement?:
    NavigationDestinationBadgePlacement;

  badgeOffset?:
    NavigationDestinationBadgeOffset;

  itemShape?:
    NavigationDestinationItemShape;

  itemMinWidth?:
    number | string;

  activeLabelWeight?:
    number;

  styles?:
    SlotStyleMap<TSlot>;

  slotProps?:
    SlotPropsMap<TSlot>;
}
