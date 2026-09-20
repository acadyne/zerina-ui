import React from "react";

import {
  cssSize,
  defineSlotRecipe,
  type SlotStyleMap,
} from "../../../helpers/css";

import {
  getSafeAreaOffset,
} from "../../../helpers/safeArea";

import {
  getScaffoldLayer,
} from "../../../patterns/scaffold/scaffoldLayers";

import {
  NAVIGATION_DESTINATION_ITEM_BASE_STYLES,
  createNavigationDestinationDensityVariants,
  getNavigationFloatingSurfaceStyles,
  getNavigationSurfaceStyles,
  resolveNavigationDestinationItemStyles,
  type NavigationDestinationBadgeMetrics,
} from "../shared/navigationDestination.styles";

import type {
  NavigationDestinationBadgeAnchor,
  NavigationDestinationDensity,
  NavigationDestinationIndicator,
  NavigationDestinationItemShape,
  NavigationSurfacePosition,
  NavigationSurfaceVariant,
} from "../shared/navigation-shared.types";

import type {
  BottomNavigationIconPosition,
  BottomNavigationSlot,
} from "./bottomNavigation.types";

export const BOTTOM_NAVIGATION_DENSITY_MAP: Record<
  NavigationDestinationDensity,
  {
    defaultHeight: number;
    listPaddingTop: string;
    listPaddingRight: string;
    listPaddingBottom: string;
    listPaddingLeft: string;
    itemPaddingTop: string;
    itemPaddingRight: string;
    itemPaddingBottom: string;
    itemPaddingLeft: string;
    iconSize: string;
    gap: string;
  }
> = {
  compact: {
    defaultHeight: 58,
    listPaddingTop: "0.3rem",
    listPaddingRight: "0.35rem",
    listPaddingBottom: "0.3rem",
    listPaddingLeft: "0.35rem",
    itemPaddingTop: "0.2rem",
    itemPaddingRight: "0.2rem",
    itemPaddingBottom: "0.2rem",
    itemPaddingLeft: "0.2rem",
    iconSize: "1.05rem",
    gap: "0.12rem",
  },

  comfortable: {
    defaultHeight: 68,
    listPaddingTop: "0.4rem",
    listPaddingRight: "0.45rem",
    listPaddingBottom: "0.4rem",
    listPaddingLeft: "0.45rem",
    itemPaddingTop: "0.25rem",
    itemPaddingRight: "0.25rem",
    itemPaddingBottom: "0.25rem",
    itemPaddingLeft: "0.25rem",
    iconSize: "1.15rem",
    gap: "0.2rem",
  },
};

export function getRootPositionStyle(
  position: NavigationSurfacePosition
): React.CSSProperties {
  if (position === "fixed") {
    return {
      position: "fixed",
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: getScaffoldLayer("navigationMobile"),
    };
  }

  if (position === "sticky") {
    return {
      position: "sticky",
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: getScaffoldLayer("navigationMobile"),
    };
  }

  return {
    position: "relative",
  };
}


type BottomNavigationRecipeVariants = {
  density: NavigationDestinationDensity;
};

type BottomNavigationRecipeState = {
  position: NavigationSurfacePosition;
  variant: NavigationSurfaceVariant;
  translucent: boolean;
  safeArea: boolean;
  height: number | string;
};

export const bottomNavigationRecipe =
  defineSlotRecipe<
    BottomNavigationSlot,
    BottomNavigationRecipeVariants,
    BottomNavigationRecipeState
  >({
    base: {
      root: {
        minWidth: 0,
        boxSizing: "border-box",
      },

      list: {
        minWidth: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-around",
        gap: "0.25rem",
        boxSizing: "border-box",
        overflow: "visible",
      },
    },

    variants: {
      density: {
        compact: {
          list: {
            paddingTop:
              BOTTOM_NAVIGATION_DENSITY_MAP
                .compact
                .listPaddingTop,

            paddingRight:
              BOTTOM_NAVIGATION_DENSITY_MAP
                .compact
                .listPaddingRight,

            paddingBottom:
              BOTTOM_NAVIGATION_DENSITY_MAP
                .compact
                .listPaddingBottom,

            paddingLeft:
              BOTTOM_NAVIGATION_DENSITY_MAP
                .compact
                .listPaddingLeft,
          },
        },

        comfortable: {
          list: {
            paddingTop:
              BOTTOM_NAVIGATION_DENSITY_MAP
                .comfortable
                .listPaddingTop,

            paddingRight:
              BOTTOM_NAVIGATION_DENSITY_MAP
                .comfortable
                .listPaddingRight,

            paddingBottom:
              BOTTOM_NAVIGATION_DENSITY_MAP
                .comfortable
                .listPaddingBottom,

            paddingLeft:
              BOTTOM_NAVIGATION_DENSITY_MAP
                .comfortable
                .listPaddingLeft,
          },
        },
      },
    },

    resolve: ({
      position,
      variant,
      translucent,
      safeArea,
      height,
    }): SlotStyleMap<BottomNavigationSlot> => ({
      root: {
        ...getRootPositionStyle(position),

        paddingBottom: safeArea
          ? getSafeAreaOffset("bottom")
          : undefined,

        ...getNavigationSurfaceStyles({
          variant,
          translucent,
          border:
            "top",
        }),
      },

      list: {
        height: cssSize(height),

        ...getNavigationFloatingSurfaceStyles({
          variant,
          translucent,
          marginBlock:
            "0.45rem",
          marginInline:
            "0.65rem",
        }),
      },
    }),
  });

type BottomNavigationItemRecipeVariants = {
  density:
    NavigationDestinationDensity;
};

type BottomNavigationItemRecipeState = {
  indicator:
    NavigationDestinationIndicator;

  shape:
    NavigationDestinationItemShape;

  iconPosition:
    BottomNavigationIconPosition;

  itemMinWidth?:
    number | string;

  hasBadge:
    boolean;

  badgeAnchor:
    NavigationDestinationBadgeAnchor;
};

export const BOTTOM_NAVIGATION_BADGE_METRICS:
  NavigationDestinationBadgeMetrics = {
    topCenterTop:
      "-0.9rem",

    inlineEndRight:
      "-0.95rem",

    topEndTop:
      "-0.82rem",

    topEndRight:
      "-0.95rem",
  };

export const bottomNavigationItemRecipe =
  defineSlotRecipe<
    BottomNavigationSlot,
    BottomNavigationItemRecipeVariants,
    BottomNavigationItemRecipeState
  >({
    base: {
      ...NAVIGATION_DESTINATION_ITEM_BASE_STYLES,

      item: {
        ...NAVIGATION_DESTINATION_ITEM_BASE_STYLES.item,
        flex:
          "1 1 0",
      },

      label: {
        ...NAVIGATION_DESTINATION_ITEM_BASE_STYLES.label,
        lineHeight:
          1.1,
      },

      dot: {
        position:
          "absolute",

        left:
          "50%",

        bottom:
          "0.18rem",

        width:
          18,

        height:
          4,

        borderRadius:
          "var(--ui-radius-full)",

        transform:
          "translateX(-50%)",

        background:
          "var(--ui-primary)",

        pointerEvents:
          "none",
      },
    },

    variants: {
      density:
        createNavigationDestinationDensityVariants(
          BOTTOM_NAVIGATION_DENSITY_MAP,
        ),
    },

    resolve: ({
      indicator,
      shape,
      iconPosition,
      itemMinWidth,
      hasBadge,
      badgeAnchor,
    }): SlotStyleMap<BottomNavigationSlot> =>
      resolveNavigationDestinationItemStyles({
        indicator,
        shape,
        itemMinWidth,
        itemMinWidthFallback:
          0,
        hasBadge,
        badgeAnchor,
        contentFlexDirection:
          iconPosition === "start"
            ? "row"
            : "column",
      }),
  });
