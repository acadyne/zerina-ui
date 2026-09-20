import React from "react";

import {
  cssSize,
  type SlotStyleMap,
} from "../../../helpers/css";

import type {
  NavigationDestinationBadgeAnchor,
  NavigationDestinationBadgeOffset,
  NavigationDestinationBadgePlacement,
  NavigationDestinationDensity,
  NavigationDestinationIndicator,
  NavigationDestinationItemShape,
  NavigationSurfaceVariant,
} from "./navigation-shared.types";

import type {
  NavigationDestinationDataAttributes,
  NavigationDestinationSlot,
} from "./NavigationDestinationItem";

export const NAVIGATION_DESTINATION_VISUALLY_HIDDEN_STYLE:
  React.CSSProperties = {
    position: "absolute",

    width: 1,
    height: 1,

    padding: 0,

    marginTop: -1,
    marginRight: -1,
    marginBottom: -1,
    marginLeft: -1,

    overflow: "hidden",

    clip: "rect(0, 0, 0, 0)",
    clipPath: "inset(50%)",

    whiteSpace: "nowrap",

    border: 0,
  };

export type NavigationSurfaceBorder =
  | "top"
  | "left"
  | "right"
  | "none";

export function getNavigationSurfaceStyles({
  variant,
  translucent,
  border,
  transparentBorders = [
    border,
  ],
}: {
  variant:
    NavigationSurfaceVariant;

  translucent:
    boolean;

  border:
    NavigationSurfaceBorder;

  transparentBorders?:
    readonly NavigationSurfaceBorder[];
}): React.CSSProperties {
  const transparent =
    variant === "plain" ||
    variant === "floating";

  const hasBorder = (
    side:
      NavigationSurfaceBorder,
  ) =>
    (
      transparent
        ? transparentBorders
        : [border]
    ).includes(
      side,
    );

  const borderValue =
    transparent
      ? "1px solid transparent"
      : "1px solid var(--ui-border)";

  return {
    background:
      transparent
        ? "transparent"
        : translucent
          ? "color-mix(in srgb, var(--ui-surface) 92%, transparent)"
          : "var(--ui-surface)",

    borderTop:
      hasBorder(
        "top",
      )
        ? borderValue
        : undefined,

    borderRight:
      hasBorder(
        "right",
      )
        ? borderValue
        : undefined,

    borderLeft:
      hasBorder(
        "left",
      )
        ? borderValue
        : undefined,

    backdropFilter:
      transparent
        ? undefined
        : translucent
          ? "blur(14px)"
          : undefined,

    WebkitBackdropFilter:
      transparent
        ? undefined
        : translucent
          ? "blur(14px)"
          : undefined,
  };
}

export function getNavigationFloatingSurfaceStyles({
  variant,
  translucent,
  marginBlock,
  marginInline,
}: {
  variant:
    NavigationSurfaceVariant;

  translucent:
    boolean;

  marginBlock:
    string;

  marginInline:
    string;
}): React.CSSProperties {
  if (
    variant !== "floating"
  ) {
    return {};
  }

  return {
    marginTop:
      marginBlock,

    marginRight:
      marginInline,

    marginBottom:
      marginBlock,

    marginLeft:
      marginInline,

    borderRadius:
      "var(--ui-radius-full)",

    border:
      "1px solid var(--ui-border)",

    background:
      translucent
        ? "color-mix(in srgb, var(--ui-surface) 88%, transparent)"
        : "var(--ui-surface)",

    boxShadow:
      "var(--ui-elevation-4)",

    backdropFilter:
      translucent
        ? "blur(16px)"
        : undefined,

    WebkitBackdropFilter:
      translucent
        ? "blur(16px)"
        : undefined,
  };
}

export interface NavigationDestinationDensityStyles {
  itemPaddingTop: string;
  itemPaddingRight: string;
  itemPaddingBottom: string;
  itemPaddingLeft: string;
  iconSize: string;
  gap: string;
}

export type NavigationDestinationDensityMap =
  Record<
    NavigationDestinationDensity,
    NavigationDestinationDensityStyles
  >;

export const NAVIGATION_DESTINATION_ITEM_BASE_STYLES:
  SlotStyleMap<NavigationDestinationSlot> = {
    item: {
      position: "relative",

      borderWidth: 1,
      borderStyle: "solid",

      display: "flex",
      alignItems: "center",
      justifyContent: "center",

      textAlign: "center",
      overflow: "visible",

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

      marginTop: 0,
      marginRight: 0,
      marginBottom: 0,
      marginLeft: 0,

      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",

      color: "inherit",
    },
  };

export function createNavigationDestinationDensityVariants(
  densityMap:
    NavigationDestinationDensityMap,
) {
  return {
    compact: {
      item: {
        paddingTop:
          densityMap.compact.itemPaddingTop,

        paddingRight:
          densityMap.compact.itemPaddingRight,

        paddingBottom:
          densityMap.compact.itemPaddingBottom,

        paddingLeft:
          densityMap.compact.itemPaddingLeft,
      },

      content: {
        gap:
          densityMap.compact.gap,
      },

      icon: {
        fontSize:
          densityMap.compact.iconSize,
      },
    },

    comfortable: {
      item: {
        paddingTop:
          densityMap.comfortable.itemPaddingTop,

        paddingRight:
          densityMap.comfortable.itemPaddingRight,

        paddingBottom:
          densityMap.comfortable.itemPaddingBottom,

        paddingLeft:
          densityMap.comfortable.itemPaddingLeft,
      },

      content: {
        gap:
          densityMap.comfortable.gap,
      },

      icon: {
        fontSize:
          densityMap.comfortable.iconSize,
      },
    },
  };
}

export function getNavigationDestinationItemBorderRadius({
  indicator,
  shape,
}: {
  indicator:
    NavigationDestinationIndicator;

  shape:
    NavigationDestinationItemShape;
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

export interface ResolveNavigationDestinationItemStylesOptions {
  indicator:
    NavigationDestinationIndicator;

  shape:
    NavigationDestinationItemShape;

  itemMinWidth?:
    number | string;

  itemMinWidthFallback?:
    number | string;

  itemMinHeight?:
    number | string;

  itemMinHeightFallback?:
    number | string;

  hasBadge: boolean;

  badgeAnchor:
    NavigationDestinationBadgeAnchor;

  contentFlexDirection?:
    React.CSSProperties["flexDirection"];
}

export function resolveNavigationDestinationItemStyles({
  indicator,
  shape,
  itemMinWidth,
  itemMinWidthFallback,
  itemMinHeight,
  itemMinHeightFallback,
  hasBadge,
  badgeAnchor,
  contentFlexDirection,
}: ResolveNavigationDestinationItemStylesOptions):
  SlotStyleMap<NavigationDestinationSlot> {
  const resolvedMinWidth =
    itemMinWidth ??
    itemMinWidthFallback;

  const resolvedMinHeight =
    itemMinHeight ??
    itemMinHeightFallback;

  return {
    item: {
      minWidth:
        resolvedMinWidth === undefined
          ? undefined
          : cssSize(
              resolvedMinWidth,
            ),

      minHeight:
        resolvedMinHeight === undefined
          ? undefined
          : cssSize(
              resolvedMinHeight,
            ),

      borderRadius:
        getNavigationDestinationItemBorderRadius({
          indicator,
          shape,
        }),
    },

    content: {
      flexDirection:
        contentFlexDirection,
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
}

export interface NavigationDestinationBadgeMetrics {
  topCenterTop: string;
  inlineEndRight: string;
  topEndTop: string;
  topEndRight: string;
}

function getNavigationDestinationOffsetTransform(
  offset?:
    NavigationDestinationBadgeOffset,
): string | undefined {
  if (
    !offset?.x &&
    !offset?.y
  ) {
    return undefined;
  }

  const x =
    offset.x === undefined
      ? "0px"
      : cssSize(
          offset.x,
        );

  const y =
    offset.y === undefined
      ? "0px"
      : cssSize(
          offset.y,
        );

  return `translate(${x}, ${y})`;
}

export function getNavigationDestinationBadgePlacementStyles({
  placement,
  offset,
  metrics,
}: {
  placement:
    NavigationDestinationBadgePlacement;

  offset?:
    NavigationDestinationBadgeOffset;

  metrics:
    NavigationDestinationBadgeMetrics;
}): React.CSSProperties {
  const offsetTransform =
    getNavigationDestinationOffsetTransform(
      offset,
    );

  if (
    placement === "top-center"
  ) {
    return {
      position: "absolute",
      top:
        metrics.topCenterTop,
      left: "50%",
      zIndex: 5,
      minWidth: 0,
      pointerEvents: "none",

      transform:
        offsetTransform
          ? `translateX(-50%) ${offsetTransform}`
          : "translateX(-50%)",
    };
  }

  if (
    placement === "inline-end"
  ) {
    return {
      position: "absolute",
      top: "50%",
      right:
        metrics.inlineEndRight,
      zIndex: 5,
      minWidth: 0,
      pointerEvents: "none",

      transform:
        offsetTransform
          ? `translateY(-50%) ${offsetTransform}`
          : "translateY(-50%)",
    };
  }

  return {
    position: "absolute",
    top:
      metrics.topEndTop,
    right:
      metrics.topEndRight,
    zIndex: 5,
    minWidth: 0,
    pointerEvents: "none",
    transform:
      offsetTransform,
  };
}

export function createNavigationDestinationDataAttributes(
  family: string,
): NavigationDestinationDataAttributes {
  const prefix =
    `data-ui-${family}-item`;

  return {
    item:
      prefix as `data-${string}`,

    indicator:
      `${prefix}-indicator` as `data-${string}`,

    badgeAnchor:
      `${prefix}-badge-anchor` as `data-${string}`,

    badgePlacement:
      `${prefix}-badge-placement` as `data-${string}`,

    content:
      `${prefix}-content` as `data-${string}`,

    iconWrap:
      `${prefix}-icon-wrap` as `data-${string}`,

    icon:
      `${prefix}-icon` as `data-${string}`,

    label:
      `${prefix}-label` as `data-${string}`,

    badge:
      `${prefix}-badge` as `data-${string}`,

    dot:
      `${prefix}-dot` as `data-${string}`,
  };
}
