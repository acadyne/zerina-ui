// src/primitives/navigation/navigation-rail/NavigationRailContext.tsx
import React from "react";
import type { UIPressEvent } from "../../../core/interaction";
import type {
  NavigationRailBadgeAnchor,
  NavigationRailBadgeOffset,
  NavigationRailBadgePlacement,
  NavigationRailDensity,
  NavigationRailIndicator,
  NavigationRailItemShape,
  NavigationRailLabelBehavior,
  NavigationRailSlotProps,
  NavigationRailStyles,
} from "./navigationRail.types";

export interface NavigationRailContextValue {
  value: string | null;

  setValue: (
    value: string,
    event: UIPressEvent<HTMLButtonElement>
  ) => void;

  labelBehavior: NavigationRailLabelBehavior;
  indicator: NavigationRailIndicator;
  density: NavigationRailDensity;

  badgeAnchor: NavigationRailBadgeAnchor;
  badgePlacement: NavigationRailBadgePlacement;
  badgeOffset?: NavigationRailBadgeOffset;

  itemShape: NavigationRailItemShape;
  itemMinWidth?: number | string;
  itemMinHeight?: number | string;

  activeLabelWeight: number;

  styles?: NavigationRailStyles;
  slotProps?: NavigationRailSlotProps;
}

export const NavigationRailContext =
  React.createContext<NavigationRailContextValue | null>(
    null
  );

export function useNavigationRailContext(): NavigationRailContextValue {
  const context = React.useContext(
    NavigationRailContext
  );

  if (!context) {
    throw new Error(
      "NavigationRail.Item must be used inside <NavigationRail />"
    );
  }

  return context;
}