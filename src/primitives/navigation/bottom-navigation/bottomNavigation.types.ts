import React from "react";

export type BottomNavigationPosition = "fixed" | "sticky" | "static";

export type BottomNavigationVariant = "plain" | "surface" | "floating";

export type BottomNavigationLabelBehavior = "always" | "active" | "never";

export type BottomNavigationIndicator = "background" | "pill" | "dot" | "none";

export type BottomNavigationDensity = "compact" | "comfortable";

export type BottomNavigationBadgeAnchor = "icon" | "content" | "item";

export type BottomNavigationBadgePlacement =
  | "top-end"
  | "top-center"
  | "inline-end";

export type BottomNavigationItemShape = "rounded" | "pill" | "circle" | "none";

export type BottomNavigationIconPosition = "top" | "start";

export interface BottomNavigationBadgeOffset {
  x?: number | string;
  y?: number | string;
}

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

export type BottomNavigationStyles = Partial<
  Record<BottomNavigationSlot, React.CSSProperties>
>;

export type BottomNavigationSlotProps = Partial<
  Record<BottomNavigationSlot, React.HTMLAttributes<HTMLElement>>
>;

export interface BottomNavigationContextValue {
  value: string | null;
  setValue: (value: string, event: React.MouseEvent<HTMLElement>) => void;

  labelBehavior: BottomNavigationLabelBehavior;
  indicator: BottomNavigationIndicator;
  density: BottomNavigationDensity;

  badgeAnchor: BottomNavigationBadgeAnchor;
  badgePlacement: BottomNavigationBadgePlacement;
  badgeOffset?: BottomNavigationBadgeOffset;

  itemShape: BottomNavigationItemShape;
  itemMinWidth?: number | string;

  iconPosition: BottomNavigationIconPosition;
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

  styles?: BottomNavigationStyles;
  slotProps?: BottomNavigationSlotProps;
}

export interface BottomNavigationProps
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

  height?: number | string;
  position?: BottomNavigationPosition;
  safeArea?: boolean;
  translucent?: boolean;

  variant?: BottomNavigationVariant;
  labelBehavior?: BottomNavigationLabelBehavior;
  indicator?: BottomNavigationIndicator;
  density?: BottomNavigationDensity;

  /**
   * icon:
   *   El badge acompaña el movimiento/escala del icono.
   *
   * content:
   *   El badge acompaña el grupo icono + label.
   *
   * item:
   *   El badge queda fijo respecto al botón completo.
   */
  badgeAnchor?: BottomNavigationBadgeAnchor;

  badgePlacement?: BottomNavigationBadgePlacement;
  badgeOffset?: BottomNavigationBadgeOffset;

  itemShape?: BottomNavigationItemShape;
  itemMinWidth?: number | string;

  iconPosition?: BottomNavigationIconPosition;
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

  styles?: BottomNavigationStyles;
  slotProps?: BottomNavigationSlotProps;
}

export interface BottomNavigationItemProps
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

  labelBehavior?: BottomNavigationLabelBehavior;
  indicator?: BottomNavigationIndicator;

  badgeAnchor?: BottomNavigationBadgeAnchor;
  badgePlacement?: BottomNavigationBadgePlacement;
  badgeOffset?: BottomNavigationBadgeOffset;

  itemShape?: BottomNavigationItemShape;
  itemMinWidth?: number | string;

  iconPosition?: BottomNavigationIconPosition;
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

  styles?: BottomNavigationStyles;
  slotProps?: BottomNavigationSlotProps;
}