import {
  createNavigationDestinationItem,
} from "../shared/createNavigationDestinationItem";

import {
  useBottomNavigationContext,
  type BottomNavigationContextValue,
} from "./BottomNavigationContext";

import {
  getNavigationDestinationBadgePlacementStyles,
} from "../shared/navigationDestination.styles";

import {
  BOTTOM_NAVIGATION_BADGE_METRICS,
  bottomNavigationItemRecipe,
} from "./bottomNavigation.styles";

import type {
  BottomNavigationItemProps,
  BottomNavigationSlot,
} from "./bottomNavigation.types";

export const BottomNavigationItem =
  createNavigationDestinationItem<
    BottomNavigationItemProps,
    BottomNavigationSlot,
    BottomNavigationContextValue
  >({
    displayName:
      "BottomNavigation.Item",

    dataAttributeFamily:
      "bottom-navigation",

    useContext:
      useBottomNavigationContext,

    familyPropKeys: [
      "iconPosition",
    ],

    resolveFamilyItem: ({
      props,
      context,
      resolved,
      hasBadge,
    }) => {
      const iconPosition =
        props.iconPosition ??
        context.iconPosition;

      return {
        recipeStyles:
          bottomNavigationItemRecipe({
            density:
              context.density,

            indicator:
              resolved.indicator,

            shape:
              resolved.itemShape,

            iconPosition,

            itemMinWidth:
              resolved.itemMinWidth,

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
              BOTTOM_NAVIGATION_BADGE_METRICS,
          }),
      };
    },
  });
