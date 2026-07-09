// src/primitives/navigation/navigation-rail/navigationRail.types.ts
import React from "react";

export type NavigationRailPosition = "fixed" | "sticky" | "static";

export type NavigationRailPlacement = "left" | "right";

export type NavigationRailVariant = "plain" | "surface" | "floating";

export type NavigationRailLabelBehavior = "always" | "active" | "never";

export type NavigationRailIndicator = "background" | "pill" | "dot" | "none";

export type NavigationRailDensity = "compact" | "comfortable";

export type NavigationRailBadgeAnchor = "icon" | "content" | "item";

export type NavigationRailBadgePlacement =
  | "top-end"
  | "top-center"
  | "inline-end";

export type NavigationRailItemShape = "rounded" | "pill" | "circle" | "none";

export type NavigationRailAlignment = "start" | "center" | "end" | "stretch";

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

export type NavigationRailStyles = Partial<
  Record<NavigationRailSlot, React.CSSProperties>
>;

export type NavigationRailSlotProps = Partial<
  Record<NavigationRailSlot, React.HTMLAttributes<HTMLElement>>
>;

export interface NavigationRailContextValue {
  value: string | null;
  setValue: (value: string, event: React.MouseEvent<HTMLElement>) => void;

  labelBehavior: NavigationRailLabelBehavior;
  indicator: NavigationRailIndicator;
  density: NavigationRailDensity;

  badgeAnchor: NavigationRailBadgeAnchor;
  badgePlacement: NavigationRailBadgePlacement;
  badgeOffset?: NavigationRailBadgeOffset;

  itemShape: NavigationRailItemShape;
  itemMinWidth?: number | string;
  itemMinHeight?: number | string;

  activeIconScale: number;
  activeLabelWeight: number;

  itemStyle?: React.CSSProperties;
  activeItemStyle?: React.CSSProperties;

  contentStyle?: React.CSSProperties;
  activeContentStyle?: React.CSSProperties;

  iconStyle?: React.CSSProperties;
  activeIconStyle?: React.CSSProperties;

  labelStyle?: React.CSSProperties;
  activeLabelStyle?: React.CSSProperties;

  badgeStyle?: React.CSSProperties;
  activeBadgeStyle?: React.CSSProperties;

  styles?: NavigationRailStyles;
  slotProps?: NavigationRailSlotProps;
}

export interface NavigationRailProps
  extends Omit<
    React.HTMLAttributes<HTMLElement>,
    "onChange" | "defaultValue"
  > {
  children?: React.ReactNode;

  value?: string | null;
  defaultValue?: string | null;

  onValueChange?: (
    value: string,
    event: React.MouseEvent<HTMLElement>
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

  activeIconScale?: number;
  activeLabelWeight?: number;

  itemStyle?: React.CSSProperties;
  activeItemStyle?: React.CSSProperties;

  contentStyle?: React.CSSProperties;
  activeContentStyle?: React.CSSProperties;

  iconStyle?: React.CSSProperties;
  activeIconStyle?: React.CSSProperties;

  labelStyle?: React.CSSProperties;
  activeLabelStyle?: React.CSSProperties;

  badgeStyle?: React.CSSProperties;
  activeBadgeStyle?: React.CSSProperties;

  className?: string;
  style?: React.CSSProperties;
  listStyle?: React.CSSProperties;
  headerStyle?: React.CSSProperties;
  footerStyle?: React.CSSProperties;

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
  selectable?: boolean;

  ariaLabel?: string;

  onSelect?: (
    value: string,
    event: React.MouseEvent<HTMLElement>
  ) => void;

  labelBehavior?: NavigationRailLabelBehavior;
  indicator?: NavigationRailIndicator;

  badgeAnchor?: NavigationRailBadgeAnchor;
  badgePlacement?: NavigationRailBadgePlacement;
  badgeOffset?: NavigationRailBadgeOffset;

  itemShape?: NavigationRailItemShape;
  itemMinWidth?: number | string;
  itemMinHeight?: number | string;

  activeIconScale?: number;
  activeLabelWeight?: number;

  itemStyle?: React.CSSProperties;
  activeItemStyle?: React.CSSProperties;

  contentStyle?: React.CSSProperties;
  activeContentStyle?: React.CSSProperties;

  iconStyle?: React.CSSProperties;
  activeIconStyle?: React.CSSProperties;

  labelStyle?: React.CSSProperties;
  activeLabelStyle?: React.CSSProperties;

  badgeStyle?: React.CSSProperties;
  activeBadgeStyle?: React.CSSProperties;

  className?: string;
  style?: React.CSSProperties;

  styles?: NavigationRailStyles;
  slotProps?: NavigationRailSlotProps;
}