// src/primitives/navigation/navigation-rail/navigationRail.styles.ts
import React from "react";
import {
  defineSlotRecipe,
  type SlotStyleMap,
} from "../../../helpers/css";
import {
  cssSize,
  getOffsetTransform,
} from "./navigationRail.utils";
import type {
  NavigationRailAlignment,
  NavigationRailBadgeAnchor,
  NavigationRailBadgeOffset,
  NavigationRailBadgePlacement,
  NavigationRailDensity,
  NavigationRailIndicator,
  NavigationRailItemShape,
  NavigationRailPlacement,
  NavigationRailPosition,
  NavigationRailSlot,
  NavigationRailVariant,
} from "./navigationRail.types";

export const NAVIGATION_RAIL_DENSITY_MAP: Record<
  NavigationRailDensity,
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
  position: NavigationRailPosition;
  placement: NavigationRailPlacement;
}): React.CSSProperties {
  if (position === "fixed") {
    return {
      position: "fixed",
      top: 0,
      bottom: 0,
      left: placement === "left" ? 0 : undefined,
      right: placement === "right" ? 0 : undefined,
      zIndex: 1300,
    };
  }

  if (position === "sticky") {
    return {
      position: "sticky",
      top: 0,
      alignSelf: "stretch",
      zIndex: 10,
    };
  }

  return {
    position: "relative",
  };
}

export function getRootSurfaceStyles({
  variant,
  translucent,
  placement,
}: {
  variant: NavigationRailVariant;
  translucent: boolean;
  placement: NavigationRailPlacement;
}): React.CSSProperties {
  if (
    variant === "plain" ||
    variant === "floating"
  ) {
    return {
      background: "transparent",
      borderRight: "1px solid transparent",
      borderLeft: "1px solid transparent",
      backdropFilter: undefined,
      WebkitBackdropFilter: undefined,
    };
  }

  return {
    background: translucent
      ? "color-mix(in srgb, var(--ui-surface) 92%, transparent)"
      : "var(--ui-surface)",

    borderRight:
      placement === "left"
        ? "1px solid var(--ui-border)"
        : undefined,

    borderLeft:
      placement === "right"
        ? "1px solid var(--ui-border)"
        : undefined,

    backdropFilter: translucent
      ? "blur(14px)"
      : undefined,

    WebkitBackdropFilter: translucent
      ? "blur(14px)"
      : undefined,
  };
}

export function getListSurfaceStyles({
  variant,
  translucent,
}: {
  variant: NavigationRailVariant;
  translucent: boolean;
}): React.CSSProperties {
  if (variant !== "floating") {
    return {};
  }

  return {
    marginTop: "0.65rem",
    marginRight: "0.5rem",
    marginBottom: "0.65rem",
    marginLeft: "0.5rem",

    borderRadius: "var(--ui-radius-full)",
    border: "1px solid var(--ui-border)",

    background: translucent
      ? "color-mix(in srgb, var(--ui-surface) 88%, transparent)"
      : "var(--ui-surface)",

    boxShadow: "var(--ui-shadow-lg)",

    backdropFilter: translucent
      ? "blur(16px)"
      : undefined,

    WebkitBackdropFilter: translucent
      ? "blur(16px)"
      : undefined,
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
  density: NavigationRailDensity;
};

type NavigationRailRecipeState = {
  width: number | string;
  position: NavigationRailPosition;
  placement: NavigationRailPlacement;
  safeArea: boolean;
  translucent: boolean;
  variant: NavigationRailVariant;
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
          ? "env(safe-area-inset-top, 0px)"
          : undefined,

        paddingBottom: safeArea
          ? "env(safe-area-inset-bottom, 0px)"
          : undefined,

        paddingLeft:
          safeArea &&
          placement === "left"
            ? "env(safe-area-inset-left, 0px)"
            : undefined,

        paddingRight:
          safeArea &&
          placement === "right"
            ? "env(safe-area-inset-right, 0px)"
            : undefined,

        ...getRootSurfaceStyles({
          variant,
          translucent,
          placement,
        }),
      },

      container: {
        ...getListSurfaceStyles({
          variant,
          translucent,
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
  density: NavigationRailDensity;
};

type NavigationRailItemRecipeState = {
  active: boolean;
  disabled: boolean;

  indicator:
    NavigationRailIndicator;

  shape:
    NavigationRailItemShape;

  itemMinWidth?: number | string;
  itemMinHeight?: number | string;

  hasBadge: boolean;

  badgeAnchor:
    NavigationRailBadgeAnchor;
};

export const navigationRailItemRecipe =
  defineSlotRecipe<
    NavigationRailSlot,
    NavigationRailItemRecipeVariants,
    NavigationRailItemRecipeState
  >({
    base: {
      item: {
        width: "100%",
        position: "relative",

        border: "1px solid",

        display: "flex",
        alignItems: "center",
        justifyContent: "center",

        textAlign: "center",
        overflow: "visible",

        transition:
          "background var(--ui-duration-normal) var(--ui-ease-standard), " +
          "border-color var(--ui-duration-normal) var(--ui-ease-standard), " +
          "color var(--ui-duration-normal) var(--ui-ease-standard), " +
          "opacity var(--ui-duration-normal) var(--ui-ease-standard), " +
          "box-shadow var(--ui-duration-normal) var(--ui-ease-standard)",
      },

      content: {
        width: "100%",
        minWidth: 0,
        minHeight: 0,

        position: "relative",

        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",

        overflow: "visible",

        borderRadius: "inherit",
        boxSizing: "border-box",
      },

      iconWrap: {
        position: "relative",

        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",

        minWidth: 0,
        lineHeight: 1,
        flexShrink: 0,
        overflow: "visible",
      },

      icon: {
        lineHeight: 1,

        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
      },

      label: {
        maxWidth: "100%",
        minWidth: 0,
        margin: 0,

        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",

        color: "inherit",
        lineHeight: 1.15,
      },

      dot: {
        position: "absolute",
        right: "0.22rem",
        top: "50%",

        width: 4,
        height: 18,

        borderRadius: "var(--ui-radius-full)",

        transform: "translateY(-50%)",

        background: "var(--ui-primary)",

        pointerEvents: "none",
      },
    },

    variants: {
      density: {
        compact: {
          item: {
            paddingTop:
              NAVIGATION_RAIL_DENSITY_MAP
                .compact
                .itemPaddingTop,

            paddingRight:
              NAVIGATION_RAIL_DENSITY_MAP
                .compact
                .itemPaddingRight,

            paddingBottom:
              NAVIGATION_RAIL_DENSITY_MAP
                .compact
                .itemPaddingBottom,

            paddingLeft:
              NAVIGATION_RAIL_DENSITY_MAP
                .compact
                .itemPaddingLeft,
          },

          content: {
            gap:
              NAVIGATION_RAIL_DENSITY_MAP
                .compact
                .gap,
          },

          icon: {
            fontSize:
              NAVIGATION_RAIL_DENSITY_MAP
                .compact
                .iconSize,
          },
        },

        comfortable: {
          item: {
            paddingTop:
              NAVIGATION_RAIL_DENSITY_MAP
                .comfortable
                .itemPaddingTop,

            paddingRight:
              NAVIGATION_RAIL_DENSITY_MAP
                .comfortable
                .itemPaddingRight,

            paddingBottom:
              NAVIGATION_RAIL_DENSITY_MAP
                .comfortable
                .itemPaddingBottom,

            paddingLeft:
              NAVIGATION_RAIL_DENSITY_MAP
                .comfortable
                .itemPaddingLeft,
          },

          content: {
            gap:
              NAVIGATION_RAIL_DENSITY_MAP
                .comfortable
                .gap,
          },

          icon: {
            fontSize:
              NAVIGATION_RAIL_DENSITY_MAP
                .comfortable
                .iconSize,
          },
        },
      },
    },

    resolve: ({
      active,
      disabled,
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

      return {
        item: {
          minWidth:
            itemMinWidth !== undefined
              ? cssSize(itemMinWidth)
              : densityStyles.itemMinWidth,

          minHeight:
            itemMinHeight !== undefined
              ? cssSize(itemMinHeight)
              : densityStyles.itemMinHeight,

          borderColor:
            getItemBorderColor({
              active,
              indicator,
            }),

          borderRadius:
            getItemBorderRadius({
              indicator,
              shape,
            }),

          background:
            getItemBackground({
              active,
              indicator,
            }),

          color: active
            ? "var(--ui-text)"
            : "var(--ui-text-muted)",

          opacity: disabled
            ? "var(--ui-state-disabled-opacity)"
            : 1,
        },

        iconWrap: {
          width:
            hasBadge &&
            badgeAnchor === "icon"
              ? "1.65rem"
              : undefined,

          height:
            hasBadge &&
            badgeAnchor === "icon"
              ? "1.35rem"
              : undefined,
        },
      };
    },
  });

export function getItemBackground({
  active,
  indicator,
}: {
  active: boolean;
  indicator: NavigationRailIndicator;
}): string {
  if (!active) {
    return "transparent";
  }

  if (
    indicator === "none" ||
    indicator === "dot"
  ) {
    return "transparent";
  }

  return "color-mix(in srgb, var(--ui-primary) 16%, transparent)";
}

export function getItemBorderColor({
  active,
  indicator,
}: {
  active: boolean;
  indicator: NavigationRailIndicator;
}): string {
  if (!active) {
    return "transparent";
  }

  if (indicator === "pill") {
    return "color-mix(in srgb, var(--ui-primary) 32%, transparent)";
  }

  return "transparent";
}

export function getItemBorderRadius({
  indicator,
  shape,
}: {
  indicator: NavigationRailIndicator;
  shape: NavigationRailItemShape;
}): string | number {
  if (shape === "none") {
    return 0;
  }

  if (
    shape === "pill" ||
    shape === "circle" ||
    indicator === "pill"
  ) {
    return "var(--ui-radius-full)";
  }

  return "var(--ui-radius-lg)";
}

export function getBadgePlacementStyles({
  placement,
  offset,
}: {
  placement: NavigationRailBadgePlacement;
  offset?: NavigationRailBadgeOffset;
}): React.CSSProperties {
  const offsetTransform =
    getOffsetTransform(offset);

  if (placement === "top-center") {
    return {
      position: "absolute",
      top: "-0.8rem",
      left: "50%",
      zIndex: 5,
      minWidth: 0,
      pointerEvents: "none",

      transform: offsetTransform
        ? `translateX(-50%) ${offsetTransform}`
        : "translateX(-50%)",
    };
  }

  if (placement === "inline-end") {
    return {
      position: "absolute",
      top: "50%",
      right: "-0.9rem",
      zIndex: 5,
      minWidth: 0,
      pointerEvents: "none",

      transform: offsetTransform
        ? `translateY(-50%) ${offsetTransform}`
        : "translateY(-50%)",
    };
  }

  return {
    position: "absolute",
    top: "-0.72rem",
    right: "-0.88rem",
    zIndex: 5,
    minWidth: 0,
    pointerEvents: "none",
    transform: offsetTransform,
  };
}

export { cssSize };