// src/primitives/navigation/navigation-rail/navigationRail.styles.ts
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
  NavigationRailAlignment,
  NavigationRailPlacement,
  NavigationRailSlot,
} from "./navigationRail.types";

export const NAVIGATION_RAIL_DENSITY_MAP: Record<
  NavigationDestinationDensity,
  {
    defaultWidth: number;
    rootPaddingTop: string;
    rootPaddingRight: string;
    rootPaddingBottom: string;
    rootPaddingLeft: string;
    itemPaddingTop: string;
    itemPaddingRight: string;
    itemPaddingBottom: string;
    itemPaddingLeft: string;
    itemMinWidth: number;
    itemMinHeight: number;
    iconSize: string;
    gap: string;
  }
> = {
  compact: {
    defaultWidth: 72,
    rootPaddingTop: "0.45rem",
    rootPaddingRight: "0.35rem",
    rootPaddingBottom: "0.45rem",
    rootPaddingLeft: "0.35rem",
    itemPaddingTop: "0.35rem",
    itemPaddingRight: "0.3rem",
    itemPaddingBottom: "0.35rem",
    itemPaddingLeft: "0.3rem",
    itemMinWidth: 52,
    itemMinHeight: 52,
    iconSize: "1.1rem",
    gap: "0.18rem",
  },

  comfortable: {
    defaultWidth: 88,
    rootPaddingTop: "0.6rem",
    rootPaddingRight: "0.45rem",
    rootPaddingBottom: "0.6rem",
    rootPaddingLeft: "0.45rem",
    itemPaddingTop: "0.45rem",
    itemPaddingRight: "0.35rem",
    itemPaddingBottom: "0.45rem",
    itemPaddingLeft: "0.35rem",
    itemMinWidth: 60,
    itemMinHeight: 60,
    iconSize: "1.2rem",
    gap: "0.22rem",
  },
};

export function getRootPositionStyle({
  position,
  placement,
}: {
  position: NavigationSurfacePosition;
  placement: NavigationRailPlacement;
}): React.CSSProperties {
  if (position === "fixed") {
    return {
      position: "fixed",
      top: 0,
      bottom: 0,
      left: placement === "left" ? 0 : undefined,
      right: placement === "right" ? 0 : undefined,
      zIndex: getScaffoldLayer("navigation"),
    };
  }

  if (position === "sticky") {
    return {
      position: "sticky",
      top: 0,
      alignSelf: "stretch",
      zIndex: getScaffoldLayer("navigation"),
    };
  }

  return {
    position: "relative",
  };
}


export function getListAlignmentStyle(
  alignment: NavigationRailAlignment
): React.CSSProperties {
  if (alignment === "start") {
    return {
      justifyContent: "flex-start",
    };
  }

  if (alignment === "end") {
    return {
      justifyContent: "flex-end",
    };
  }

  if (alignment === "stretch") {
    return {
      justifyContent: "stretch",
    };
  }

  return {
    justifyContent: "center",
  };
}

type NavigationRailRecipeVariants = {
  density: NavigationDestinationDensity;
};

type NavigationRailRecipeState = {
  width: number | string;
  position: NavigationSurfacePosition;
  placement: NavigationRailPlacement;
  safeArea: boolean;
  translucent: boolean;
  variant: NavigationSurfaceVariant;
  alignment: NavigationRailAlignment;
};

export const navigationRailRecipe =
  defineSlotRecipe<
    NavigationRailSlot,
    NavigationRailRecipeVariants,
    NavigationRailRecipeState
  >({
    base: {
      root: {
        minHeight: 0,
        boxSizing: "border-box",
        color: "var(--ui-text)",
      },

      container: {
        width: "100%",
        height: "100%",
        minWidth: 0,
        minHeight: 0,

        display: "flex",
        flexDirection: "column",

        boxSizing: "border-box",
        overflow: "visible",
      },

      header: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",

        flexShrink: 0,
        marginBottom: "0.4rem",
      },

      list: {
        width: "100%",
        minWidth: 0,
        minHeight: 0,

        display: "flex",
        flexDirection: "column",
        alignItems: "center",

        gap: "0.35rem",

        boxSizing: "border-box",
        overflow: "visible",
        flex: 1,
      },

      footer: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",

        flexShrink: 0,
        marginTop: "0.4rem",
      },
    },

    variants: {
      density: {
        compact: {
          container: {
            paddingTop:
              NAVIGATION_RAIL_DENSITY_MAP
                .compact
                .rootPaddingTop,

            paddingRight:
              NAVIGATION_RAIL_DENSITY_MAP
                .compact
                .rootPaddingRight,

            paddingBottom:
              NAVIGATION_RAIL_DENSITY_MAP
                .compact
                .rootPaddingBottom,

            paddingLeft:
              NAVIGATION_RAIL_DENSITY_MAP
                .compact
                .rootPaddingLeft,
          },
        },

        comfortable: {
          container: {
            paddingTop:
              NAVIGATION_RAIL_DENSITY_MAP
                .comfortable
                .rootPaddingTop,

            paddingRight:
              NAVIGATION_RAIL_DENSITY_MAP
                .comfortable
                .rootPaddingRight,

            paddingBottom:
              NAVIGATION_RAIL_DENSITY_MAP
                .comfortable
                .rootPaddingBottom,

            paddingLeft:
              NAVIGATION_RAIL_DENSITY_MAP
                .comfortable
                .rootPaddingLeft,
          },
        },
      },
    },

    resolve: ({
      width,
      position,
      placement,
      safeArea,
      translucent,
      variant,
      alignment,
    }): SlotStyleMap<NavigationRailSlot> => ({
      root: {
        ...getRootPositionStyle({
          position,
          placement,
        }),

        width: cssSize(width),
        minWidth: cssSize(width),
        maxWidth: cssSize(width),

        height:
          position === "static"
            ? "100%"
            : undefined,

        paddingTop: safeArea
          ? getSafeAreaOffset("top")
          : undefined,

        paddingBottom: safeArea
          ? getSafeAreaOffset("bottom")
          : undefined,

        paddingLeft:
          safeArea &&
            placement === "left"
            ? getSafeAreaOffset("left")
            : undefined,

        paddingRight:
          safeArea &&
            placement === "right"
            ? getSafeAreaOffset("right")
            : undefined,

        ...getNavigationSurfaceStyles({
          variant,
          translucent,
          border:
            placement,

          transparentBorders: [
            "left",
            "right",
          ],
        }),
      },

      container: {
        ...getNavigationFloatingSurfaceStyles({
          variant,
          translucent,
          marginBlock:
            "0.65rem",
          marginInline:
            "0.5rem",
        }),
      },

      list: {
        ...getListAlignmentStyle(
          alignment
        ),
      },
    }),
  });

type NavigationRailItemRecipeVariants = {
  density:
    NavigationDestinationDensity;
};

type NavigationRailItemRecipeState = {
  indicator:
    NavigationDestinationIndicator;

  shape:
    NavigationDestinationItemShape;

  itemMinWidth?:
    number | string;

  itemMinHeight?:
    number | string;

  hasBadge:
    boolean;

  badgeAnchor:
    NavigationDestinationBadgeAnchor;
};

export const NAVIGATION_RAIL_BADGE_METRICS:
  NavigationDestinationBadgeMetrics = {
    topCenterTop:
      "-0.8rem",

    inlineEndRight:
      "-0.9rem",

    topEndTop:
      "-0.72rem",

    topEndRight:
      "-0.88rem",
  };

export const navigationRailItemRecipe =
  defineSlotRecipe<
    NavigationRailSlot,
    NavigationRailItemRecipeVariants,
    NavigationRailItemRecipeState
  >({
    base: {
      ...NAVIGATION_DESTINATION_ITEM_BASE_STYLES,

      item: {
        ...NAVIGATION_DESTINATION_ITEM_BASE_STYLES.item,
        width:
          "100%",
      },

      content: {
        ...NAVIGATION_DESTINATION_ITEM_BASE_STYLES.content,
        width:
          "100%",
        flexDirection:
          "column",
      },

      label: {
        ...NAVIGATION_DESTINATION_ITEM_BASE_STYLES.label,
        lineHeight:
          1.15,
      },

      dot: {
        position:
          "absolute",

        right:
          "0.22rem",

        top:
          "50%",

        width:
          4,

        height:
          18,

        borderRadius:
          "var(--ui-radius-full)",

        transform:
          "translateY(-50%)",

        background:
          "var(--ui-primary)",

        pointerEvents:
          "none",
      },
    },

    variants: {
      density:
        createNavigationDestinationDensityVariants(
          NAVIGATION_RAIL_DENSITY_MAP,
        ),
    },

    resolve: ({
      indicator,
      shape,
      itemMinWidth,
      itemMinHeight,
      hasBadge,
      badgeAnchor,
      density,
    }): SlotStyleMap<NavigationRailSlot> => {
      const densityStyles =
        NAVIGATION_RAIL_DENSITY_MAP[
          density
        ];

      return resolveNavigationDestinationItemStyles({
        indicator,
        shape,

        itemMinWidth,
        itemMinWidthFallback:
          densityStyles.itemMinWidth,

        itemMinHeight,
        itemMinHeightFallback:
          densityStyles.itemMinHeight,

        hasBadge,
        badgeAnchor,
      });
    },
  });
