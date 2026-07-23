// src/primitives/navigation/bottom-navigation/BottomNavigationContext.tsx
import React from "react";
import type { UIPressEvent } from "../../../core/interaction";
import type {
  BottomNavigationBadgeAnchor,
  BottomNavigationBadgeOffset,
  BottomNavigationBadgePlacement,
  BottomNavigationDensity,
  BottomNavigationIconPosition,
  BottomNavigationIndicator,
  BottomNavigationItemShape,
  BottomNavigationLabelBehavior,
  BottomNavigationSlotProps,
  BottomNavigationStyles,
} from "./bottomNavigation.types";

export interface BottomNavigationContextValue {
  value: string | null;

  setValue: (
    value: string,
    event: UIPressEvent<HTMLButtonElement>
  ) => void;

  labelBehavior: BottomNavigationLabelBehavior;
  indicator: BottomNavigationIndicator;
  density: BottomNavigationDensity;

  badgeAnchor: BottomNavigationBadgeAnchor;
  badgePlacement: BottomNavigationBadgePlacement;
  badgeOffset?: BottomNavigationBadgeOffset;

  itemShape: BottomNavigationItemShape;
  itemMinWidth?: number | string;

  iconPosition: BottomNavigationIconPosition;
  activeLabelWeight: number;

  styles?: BottomNavigationStyles;
  slotProps?: BottomNavigationSlotProps;
}

export const BottomNavigationContext =
  React.createContext<
    BottomNavigationContextValue | null
  >(null);

export function useBottomNavigationContext(): BottomNavigationContextValue {
  const context = React.useContext(
    BottomNavigationContext
  );

  if (!context) {
    throw new Error(
      "BottomNavigation.Item must be used inside <BottomNavigation />"
    );
  }

  return context;
}