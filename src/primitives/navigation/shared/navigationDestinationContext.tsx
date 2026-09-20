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
} from "./navigation-shared.types";

export interface NavigationDestinationContextValue<
  TSlot extends string,
> {
  value: string | null;

  setValue: (
    value: string,
    event: UIPressEvent<HTMLButtonElement>,
  ) => void;

  labelBehavior:
    NavigationDestinationLabelBehavior;

  indicator:
    NavigationDestinationIndicator;

  density:
    NavigationDestinationDensity;

  badgeAnchor:
    NavigationDestinationBadgeAnchor;

  badgePlacement:
    NavigationDestinationBadgePlacement;

  badgeOffset?:
    NavigationDestinationBadgeOffset;

  itemShape:
    NavigationDestinationItemShape;

  itemMinWidth?:
    number | string;

  activeLabelWeight:
    number;

  styles?:
    SlotStyleMap<TSlot>;

  slotProps?:
    SlotPropsMap<TSlot>;
}

export function createNavigationDestinationContext<
  TValue,
>(
  errorMessage: string,
) {
  const Context =
    React.createContext<
      TValue | null
    >(null);

  function useNavigationDestinationContext(): TValue {
    const value =
      React.useContext(
        Context,
      );

    if (value === null) {
      throw new Error(
        errorMessage,
      );
    }

    return value;
  }

  return {
    Context,
    useNavigationDestinationContext,
  };
}
