// src/primitives/navigation/navigation-rail/navigationRail.styles.ts
import React from "react";
import { cssSize, getOffsetTransform } from "./navigationRail.utils";
import type {
  NavigationRailAlignment,
  NavigationRailBadgeOffset,
  NavigationRailBadgePlacement,
  NavigationRailDensity,
  NavigationRailIndicator,
  NavigationRailItemShape,
  NavigationRailPlacement,
  NavigationRailPosition,
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
  if (variant === "plain" || variant === "floating") {
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
      placement === "left" ? "1px solid var(--ui-border)" : undefined,
    borderLeft:
      placement === "right" ? "1px solid var(--ui-border)" : undefined,
    backdropFilter: translucent ? "blur(14px)" : undefined,
    WebkitBackdropFilter: translucent ? "blur(14px)" : undefined,
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
    borderRadius: "9999px",
    border: "1px solid var(--ui-border)",
    background: translucent
      ? "color-mix(in srgb, var(--ui-surface) 88%, transparent)"
      : "var(--ui-surface)",
    boxShadow: "var(--ui-shadow-lg)",
    backdropFilter: translucent ? "blur(16px)" : undefined,
    WebkitBackdropFilter: translucent ? "blur(16px)" : undefined,
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

export function getItemBackground({
  active,
  indicator,
}: {
  active: boolean;
  indicator: NavigationRailIndicator;
}): string {
  if (!active) return "transparent";
  if (indicator === "none" || indicator === "dot") return "transparent";

  return "color-mix(in srgb, var(--ui-primary) 16%, transparent)";
}

export function getItemBorderColor({
  active,
  indicator,
}: {
  active: boolean;
  indicator: NavigationRailIndicator;
}): string {
  if (!active) return "transparent";

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
  if (shape === "none") return 0;
  if (shape === "pill" || shape === "circle") return "9999px";
  if (indicator === "pill") return "9999px";

  return "var(--ui-radius-lg)";
}

export function getBadgePlacementStyles({
  placement,
  offset,
}: {
  placement: NavigationRailBadgePlacement;
  offset?: NavigationRailBadgeOffset;
}): React.CSSProperties {
  const offsetTransform = getOffsetTransform(offset);

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