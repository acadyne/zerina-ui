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
    defaultHeight: number | string;
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
    defaultHeight:
      "calc(var(--ui-density-compact-item-min-height) + var(--ui-density-compact-block-gap) + var(--ui-density-compact-block-gap))",

    listPaddingTop:
      "var(--ui-density-compact-inline-gap)",

    listPaddingRight:
      "var(--ui-density-compact-inline-gap)",

    listPaddingBottom:
      "var(--ui-density-compact-inline-gap)",

    listPaddingLeft:
      "var(--ui-density-compact-inline-gap)",

    itemPaddingTop:
      "var(--ui-space-xs)",

    itemPaddingRight:
      "var(--ui-space-xs)",

    itemPaddingBottom:
      "var(--ui-space-xs)",

    itemPaddingLeft:
      "var(--ui-space-xs)",

    iconSize:
      "var(--ui-density-compact-icon-size)",

    gap:
      "var(--ui-density-compact-inline-gap)",
  },

  comfortable: {
    defaultHeight:
      "calc(var(--ui-density-comfortable-item-min-height) + var(--ui-density-comfortable-block-gap) + var(--ui-density-comfortable-block-gap))",

    listPaddingTop:
      "var(--ui-density-comfortable-inline-gap)",

    listPaddingRight:
      "var(--ui-density-comfortable-inline-gap)",

    listPaddingBottom:
      "var(--ui-density-comfortable-inline-gap)",

    listPaddingLeft:
      "var(--ui-density-comfortable-inline-gap)",

    itemPaddingTop:
      "var(--ui-space-xs)",

    itemPaddingRight:
      "var(--ui-space-xs)",

    itemPaddingBottom:
      "var(--ui-space-xs)",

    itemPaddingLeft:
      "var(--ui-space-xs)",

    iconSize:
      "var(--ui-density-comfortable-icon-size)",

    gap:
      "var(--ui-density-comfortable-inline-gap)",
  },

  spacious: {
    defaultHeight:
      "calc(var(--ui-density-spacious-item-min-height) + var(--ui-density-spacious-block-gap) + var(--ui-density-spacious-block-gap))",

    listPaddingTop:
      "var(--ui-density-spacious-inline-gap)",

    listPaddingRight:
      "var(--ui-density-spacious-inline-gap)",

    listPaddingBottom:
      "var(--ui-density-spacious-inline-gap)",

    listPaddingLeft:
      "var(--ui-density-spacious-inline-gap)",

    itemPaddingTop:
      "var(--ui-space-sm)",

    itemPaddingRight:
      "var(--ui-space-sm)",

    itemPaddingBottom:
      "var(--ui-space-sm)",

    itemPaddingLeft:
      "var(--ui-space-sm)",

    iconSize:
      "var(--ui-density-spacious-icon-size)",

    gap:
      "var(--ui-density-spacious-inline-gap)",
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

        spacious: {
          list: {
            paddingTop:
              BOTTOM_NAVIGATION_DENSITY_MAP
                .spacious
                .listPaddingTop,

            paddingRight:
              BOTTOM_NAVIGATION_DENSITY_MAP
                .spacious
                .listPaddingRight,

            paddingBottom:
              BOTTOM_NAVIGATION_DENSITY_MAP
                .spacious
                .listPaddingBottom,

            paddingLeft:
              BOTTOM_NAVIGATION_DENSITY_MAP
                .spacious
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
