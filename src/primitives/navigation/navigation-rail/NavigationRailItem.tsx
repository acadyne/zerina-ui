import {
  createNavigationDestinationItem,
} from "../shared/createNavigationDestinationItem";

import {
  useNavigationRailContext,
  type NavigationRailContextValue,
} from "./NavigationRailContext";

import {
  getNavigationDestinationBadgePlacementStyles,
} from "../shared/navigationDestination.styles";

import {
  NAVIGATION_RAIL_BADGE_METRICS,
  navigationRailItemRecipe,
} from "./navigationRail.styles";

import type {
  NavigationRailItemProps,
  NavigationRailSlot,
} from "./navigationRail.types";

export const NavigationRailItem =
  createNavigationDestinationItem<
    NavigationRailItemProps,
    NavigationRailSlot,
    NavigationRailContextValue
  >({
    displayName:
      "NavigationRail.Item",

    dataAttributeFamily:
      "navigation-rail",

    useContext:
      useNavigationRailContext,

    familyPropKeys: [
      "itemMinHeight",
    ],

    resolveFamilyItem: ({
      props,
      context,
      resolved,
      hasBadge,
    }) => {
      const itemMinHeight =
        props.itemMinHeight ??
        context.itemMinHeight;

      return {
        recipeStyles:
          navigationRailItemRecipe({
            density:
              context.density,

            indicator:
              resolved.indicator,

            shape:
              resolved.itemShape,

            itemMinWidth:
              resolved.itemMinWidth,

            itemMinHeight,

            hasBadge,

            badgeAnchor:
              resolved.badgeAnchor,
          }),

        badgeStyle:
          getNavigationDestinationBadgePlacementStyles({
            placement:
              resolved.badgePlacement,

            offset:
              resolved.badgeOffset,

            metrics:
              NAVIGATION_RAIL_BADGE_METRICS,
          }),
      };
    },
  });
