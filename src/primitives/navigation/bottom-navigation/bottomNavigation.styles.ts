import React from "react";
import {
  defineSlotRecipe,
  type SlotStyleMap,
} from "../../../helpers/css";
import {
  cssSize,
  getOffsetTransform,
} from "./bottomNavigation.utils";
import type {
  BottomNavigationBadgeOffset,
  BottomNavigationBadgePlacement,
  BottomNavigationDensity,
  BottomNavigationIconPosition,
  BottomNavigationIndicator,
  BottomNavigationItemShape,
  BottomNavigationPosition,
  BottomNavigationSlot,
  BottomNavigationVariant,
} from "./bottomNavigation.types";

export const BOTTOM_NAVIGATION_DENSITY_MAP: Record<
  BottomNavigationDensity,
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
  position: BottomNavigationPosition
): React.CSSProperties {
  if (position === "fixed") {
    return {
      position: "fixed",
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: "var(--ui-layer-navigation-mobile)",
    };
  }

  if (position === "sticky") {
    return {
      position: "sticky",
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: "var(--ui-layer-navigation-mobile)",
    };
  }

  return {
    position: "relative",
  };
}

export function getRootSurfaceStyles({
  variant,
  translucent,
}: {
  variant: BottomNavigationVariant;
  translucent: boolean;
}): React.CSSProperties {
  if (
    variant === "plain" ||
    variant === "floating"
  ) {
    return {
      background: "transparent",
      borderTop: "1px solid transparent",
      backdropFilter: undefined,
      WebkitBackdropFilter: undefined,
    };
  }

  return {
    background: translucent
      ? "color-mix(in srgb, var(--ui-surface) 92%, transparent)"
      : "var(--ui-surface)",

    borderTop:
      "1px solid var(--ui-border)",

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
  variant: BottomNavigationVariant;
  translucent: boolean;
}): React.CSSProperties {
  if (variant !== "floating") {
    return {};
  }

  return {
    marginTop: "0.45rem",
    marginRight: "0.65rem",
    marginBottom: "0.45rem",
    marginLeft: "0.65rem",

    borderRadius:
      "var(--ui-radius-full)",

    border:
      "1px solid var(--ui-border)",

    background: translucent
      ? "color-mix(in srgb, var(--ui-surface) 88%, transparent)"
      : "var(--ui-surface)",

    boxShadow:
      "var(--ui-shadow-lg)",

    backdropFilter: translucent
      ? "blur(16px)"
      : undefined,

    WebkitBackdropFilter: translucent
      ? "blur(16px)"
      : undefined,
  };
}

type BottomNavigationRecipeVariants = {
  density: BottomNavigationDensity;
};

type BottomNavigationRecipeState = {
  position: BottomNavigationPosition;
  variant: BottomNavigationVariant;
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
          ? "env(safe-area-inset-bottom, 0px)"
          : undefined,

        ...getRootSurfaceStyles({
          variant,
          translucent,
        }),
      },

      list: {
        height: cssSize(height),

        ...getListSurfaceStyles({
          variant,
          translucent,
        }),
      },
    }),
  });

type BottomNavigationItemRecipeVariants = {
  density: BottomNavigationDensity;
};

type BottomNavigationItemRecipeState = {
  active: boolean;
  disabled: boolean;

  indicator:
  BottomNavigationIndicator;

  shape:
  BottomNavigationItemShape;

  iconPosition:
  BottomNavigationIconPosition;

  itemMinWidth?: number | string;

  hasBadge: boolean;

  badgeAnchor:
  | "icon"
  | "content"
  | "item";
};

export const bottomNavigationItemRecipe =
  defineSlotRecipe<
    BottomNavigationSlot,
    BottomNavigationItemRecipeVariants,
    BottomNavigationItemRecipeState
  >({
    base: {
      item: {
        flex: "1 1 0",
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
        minWidth: 0,
        minHeight: 0,

        position: "relative",

        display: "flex",
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
        lineHeight: 1.1,
      },

      dot: {
        position: "absolute",
        left: "50%",
        bottom: "0.18rem",

        width: 18,
        height: 4,

        borderRadius:
          "var(--ui-radius-full)",

        transform:
          "translateX(-50%)",

        background:
          "var(--ui-primary)",

        pointerEvents: "none",
      },
    },

    variants: {
      density: {
        compact: {
          item: {
            paddingTop:
              BOTTOM_NAVIGATION_DENSITY_MAP
                .compact
                .itemPaddingTop,

            paddingRight:
              BOTTOM_NAVIGATION_DENSITY_MAP
                .compact
                .itemPaddingRight,

            paddingBottom:
              BOTTOM_NAVIGATION_DENSITY_MAP
                .compact
                .itemPaddingBottom,

            paddingLeft:
              BOTTOM_NAVIGATION_DENSITY_MAP
                .compact
                .itemPaddingLeft,
          },

          content: {
            gap:
              BOTTOM_NAVIGATION_DENSITY_MAP
                .compact
                .gap,
          },

          icon: {
            fontSize:
              BOTTOM_NAVIGATION_DENSITY_MAP
                .compact
                .iconSize,
          },
        },

        comfortable: {
          item: {
            paddingTop:
              BOTTOM_NAVIGATION_DENSITY_MAP
                .comfortable
                .itemPaddingTop,

            paddingRight:
              BOTTOM_NAVIGATION_DENSITY_MAP
                .comfortable
                .itemPaddingRight,

            paddingBottom:
              BOTTOM_NAVIGATION_DENSITY_MAP
                .comfortable
                .itemPaddingBottom,

            paddingLeft:
              BOTTOM_NAVIGATION_DENSITY_MAP
                .comfortable
                .itemPaddingLeft,
          },

          content: {
            gap:
              BOTTOM_NAVIGATION_DENSITY_MAP
                .comfortable
                .gap,
          },

          icon: {
            fontSize:
              BOTTOM_NAVIGATION_DENSITY_MAP
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
      iconPosition,
      itemMinWidth,
      hasBadge,
      badgeAnchor,
    }): SlotStyleMap<BottomNavigationSlot> => ({
      item: {
        minWidth:
          itemMinWidth !== undefined
            ? cssSize(itemMinWidth)
            : 0,

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

      content: {
        flexDirection:
          iconPosition === "start"
            ? "row"
            : "column",
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
    }),
  });

export function getItemBackground({
  active,
  indicator,
}: {
  active: boolean;
  indicator: BottomNavigationIndicator;
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
  indicator: BottomNavigationIndicator;
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
  indicator: BottomNavigationIndicator;
  shape: BottomNavigationItemShape;
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
  placement:
  BottomNavigationBadgePlacement;

  offset?:
  BottomNavigationBadgeOffset;
}): React.CSSProperties {
  const offsetTransform =
    getOffsetTransform(offset);

  if (placement === "top-center") {
    return {
      position: "absolute",
      top: "-0.9rem",
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
      right: "-0.95rem",
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
    top: "-0.82rem",
    right: "-0.95rem",
    zIndex: 5,
    minWidth: 0,
    pointerEvents: "none",
    transform: offsetTransform,
  };
}

export { cssSize };