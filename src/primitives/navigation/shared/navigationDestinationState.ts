import type {
  NavigationDestinationContextValue,
} from "./navigationDestinationContext";

import type {
  NavigationDestinationBadgeAnchor,
  NavigationDestinationBadgeOffset,
  NavigationDestinationBadgePlacement,
  NavigationDestinationIndicator,
  NavigationDestinationItemShape,
  NavigationDestinationLabelBehavior,
} from "./navigation-shared.types";

export interface NavigationDestinationItemOverrides {
  value: string;

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
}

export interface ResolvedNavigationDestinationItem {
  active: boolean;

  labelBehavior:
    NavigationDestinationLabelBehavior;

  indicator:
    NavigationDestinationIndicator;

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
}

export function resolveNavigationDestinationItem<
  TSlot extends string,
>(
  context:
    NavigationDestinationContextValue<TSlot>,
  {
    value,
    labelBehavior,
    indicator,
    badgeAnchor,
    badgePlacement,
    badgeOffset,
    itemShape,
    itemMinWidth,
    activeLabelWeight,
  }: NavigationDestinationItemOverrides,
): ResolvedNavigationDestinationItem {
  return {
    active:
      context.value === value,

    labelBehavior:
      labelBehavior ??
      context.labelBehavior,

    indicator:
      indicator ??
      context.indicator,

    badgeAnchor:
      badgeAnchor ??
      context.badgeAnchor,

    badgePlacement:
      badgePlacement ??
      context.badgePlacement,

    badgeOffset:
      badgeOffset ??
      context.badgeOffset,

    itemShape:
      itemShape ??
      context.itemShape,

    itemMinWidth:
      itemMinWidth ??
      context.itemMinWidth,

    activeLabelWeight:
      activeLabelWeight ??
      context.activeLabelWeight,
  };
}
