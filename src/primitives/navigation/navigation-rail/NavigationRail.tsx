// src/primitives/navigation/navigation-rail/NavigationRail.tsx
import React from "react";
import { resolveSlot } from "../../../helpers/css";
import { Box } from "../../layout";
import { NavigationRailContext } from "./NavigationRailContext";
import { NavigationRailItem } from "./NavigationRailItem";
import {
  NAVIGATION_RAIL_DENSITY_MAP,
  cssSize,
  getListAlignmentStyle,
  getListSurfaceStyles,
  getRootPositionStyle,
  getRootSurfaceStyles,
} from "./navigationRail.styles";
import type {
  NavigationRailContextValue,
  NavigationRailItemProps,
  NavigationRailProps,
  NavigationRailSlot,
} from "./navigationRail.types";

const NavigationRailRoot = React.forwardRef<HTMLElement, NavigationRailProps>(
  (
    {
      children,
      value,
      defaultValue = null,
      onValueChange,

      width,
      position = "static",
      placement = "left",
      safeArea = true,
      translucent = true,

      header,
      footer,

      variant = "surface",
      labelBehavior = "always",
      indicator = "background",
      density = "comfortable",
      alignment = "start",

      badgeAnchor = "icon",
      badgePlacement = "top-end",
      badgeOffset,

      itemShape = "rounded",
      itemMinWidth,
      itemMinHeight,

      activeIconScale = 1,
      activeLabelWeight = 800,

      className = "",
      style,

      styles,
      slotProps,

      ...rest
    },
    ref
  ) => {
    const isControlled = value !== undefined;
    const densityStyles = NAVIGATION_RAIL_DENSITY_MAP[density];
    const resolvedWidth = width ?? densityStyles.defaultWidth;

    const [internalValue, setInternalValue] =
      React.useState<string | null>(defaultValue);

    const currentValue = isControlled ? value ?? null : internalValue;

    const setValue = React.useCallback(
      (nextValue: string, event: React.MouseEvent<HTMLElement>) => {
        if (!isControlled) {
          setInternalValue(nextValue);
        }

        onValueChange?.(nextValue, event);
      },
      [isControlled, onValueChange]
    );

    const contextValue = React.useMemo<NavigationRailContextValue>(
      () => ({
        value: currentValue,
        setValue,

        labelBehavior,
        indicator,
        density,

        badgeAnchor,
        badgePlacement,
        badgeOffset,

        itemShape,
        itemMinWidth,
        itemMinHeight,

        activeIconScale,
        activeLabelWeight,

        styles,
        slotProps,
      }),
      [
        currentValue,
        setValue,
        labelBehavior,
        indicator,
        density,
        badgeAnchor,
        badgePlacement,
        badgeOffset,
        itemShape,
        itemMinWidth,
        itemMinHeight,
        activeIconScale,
        activeLabelWeight,
        styles,
        slotProps,
      ]
    );

    const rootSlot = resolveSlot<NavigationRailSlot>({
      slot: "root",
      styles,
      slotProps,
      className,
      style,
      baseProps: {
        "aria-label": rest["aria-label"] ?? "Navegación lateral compacta",
        "data-ui-navigation-rail": "",
        "data-ui-navigation-rail-position": position,
        "data-ui-navigation-rail-placement": placement,
        "data-ui-navigation-rail-variant": variant,
        "data-ui-navigation-rail-density": density,
        "data-ui-navigation-rail-indicator": indicator,
        "data-ui-navigation-rail-label-behavior": labelBehavior,
      },
      baseStyle: {
        ...getRootPositionStyle({ position, placement }),
        width: cssSize(resolvedWidth),
        minWidth: cssSize(resolvedWidth),
        maxWidth: cssSize(resolvedWidth),
        height: position === "static" ? "100%" : undefined,
        minHeight: 0,
        paddingTop: safeArea
          ? "env(safe-area-inset-top, 0px)"
          : undefined,
        paddingBottom: safeArea
          ? "env(safe-area-inset-bottom, 0px)"
          : undefined,
        paddingLeft:
          safeArea && placement === "left"
            ? "env(safe-area-inset-left, 0px)"
            : undefined,
        paddingRight:
          safeArea && placement === "right"
            ? "env(safe-area-inset-right, 0px)"
            : undefined,
        boxSizing: "border-box",
        color: "var(--ui-text)",
        ...getRootSurfaceStyles({ variant, translucent, placement }),
      },
    });

    const containerSlot = resolveSlot<NavigationRailSlot>({
      slot: "container",
      styles,
      slotProps,
      baseProps: {
        "data-ui-navigation-rail-container": "",
      },
      baseStyle: {
        width: "100%",
        height: "100%",
        minWidth: 0,
        minHeight: 0,
        display: "flex",
        flexDirection: "column",
        boxSizing: "border-box",
        overflow: "visible",
        paddingTop: densityStyles.rootPaddingTop,
        paddingRight: densityStyles.rootPaddingRight,
        paddingBottom: densityStyles.rootPaddingBottom,
        paddingLeft: densityStyles.rootPaddingLeft,
        ...getListSurfaceStyles({ variant, translucent }),
      },
    });

    const headerSlot = resolveSlot<NavigationRailSlot>({
      slot: "header",
      styles,
      slotProps,
      baseProps: {
        "data-ui-navigation-rail-header": "",
      },
      baseStyle: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexShrink: 0,
        marginBottom: "0.4rem",
      },
    });

    const listSlot = resolveSlot<NavigationRailSlot>({
      slot: "list",
      styles,
      slotProps,
      baseProps: {
        role: "tablist",
        "aria-orientation": "vertical",
        "data-ui-navigation-rail-list": "",
      },
      baseStyle: {
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
        ...getListAlignmentStyle(alignment),
      },
    });

    const footerSlot = resolveSlot<NavigationRailSlot>({
      slot: "footer",
      styles,
      slotProps,
      baseProps: {
        "data-ui-navigation-rail-footer": "",
      },
      baseStyle: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexShrink: 0,
        marginTop: "0.4rem",
      },
    });

    return (
      <NavigationRailContext.Provider value={contextValue}>
        <Box
          as="nav"
          ref={ref as React.Ref<Element>}
          {...rest}
          {...rootSlot}
        >
          <Box {...containerSlot}>
            {header ? <Box {...headerSlot}>{header}</Box> : null}

            <Box {...listSlot}>{children}</Box>

            {footer ? <Box {...footerSlot}>{footer}</Box> : null}
          </Box>
        </Box>
      </NavigationRailContext.Provider>
    );
  }
);

NavigationRailRoot.displayName = "NavigationRail";

type NavigationRailComponent = React.ForwardRefExoticComponent<
  NavigationRailProps & React.RefAttributes<HTMLElement>
> & {
  Item: React.ForwardRefExoticComponent<
    NavigationRailItemProps & React.RefAttributes<HTMLButtonElement>
  >;
};

export const NavigationRail = Object.assign(NavigationRailRoot, {
  Item: NavigationRailItem,
}) as NavigationRailComponent;