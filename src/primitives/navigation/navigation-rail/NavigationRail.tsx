// src/primitives/navigation/navigation-rail/NavigationRail.tsx
import React from "react";
import { cx, getSlotProps, getSlotStyle } from "../../../helpers/css";
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

      itemStyle,
      activeItemStyle,

      contentStyle,
      activeContentStyle,

      iconStyle,
      activeIconStyle,

      labelStyle,
      activeLabelStyle,

      badgeStyle,
      activeBadgeStyle,

      className = "",
      style,
      listStyle,
      headerStyle,
      footerStyle,

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

        itemStyle,
        activeItemStyle,

        contentStyle,
        activeContentStyle,

        iconStyle,
        activeIconStyle,

        labelStyle,
        activeLabelStyle,

        badgeStyle,
        activeBadgeStyle,

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
        itemStyle,
        activeItemStyle,
        contentStyle,
        activeContentStyle,
        iconStyle,
        activeIconStyle,
        labelStyle,
        activeLabelStyle,
        badgeStyle,
        activeBadgeStyle,
        styles,
        slotProps,
      ]
    );

    const rootSlotProps = getSlotProps(slotProps, "root");
    const containerSlotProps = getSlotProps(slotProps, "container");
    const listSlotProps = getSlotProps(slotProps, "list");
    const headerSlotProps = getSlotProps(slotProps, "header");
    const footerSlotProps = getSlotProps(slotProps, "footer");

    const {
      className: rootSlotClassName,
      style: rootSlotStyle,
      ...rootSlotRest
    } = rootSlotProps;

    const {
      className: containerSlotClassName,
      style: containerSlotStyle,
      ...containerSlotRest
    } = containerSlotProps;

    const {
      className: listSlotClassName,
      style: listSlotStyle,
      ...listSlotRest
    } = listSlotProps;

    const {
      className: headerSlotClassName,
      style: headerSlotStyle,
      ...headerSlotRest
    } = headerSlotProps;

    const {
      className: footerSlotClassName,
      style: footerSlotStyle,
      ...footerSlotRest
    } = footerSlotProps;

    return (
      <NavigationRailContext.Provider value={contextValue}>
        <Box
          as="nav"
          ref={ref as React.Ref<Element>}
          className={cx(className, rootSlotClassName)}
          aria-label={rest["aria-label"] ?? "Navegación lateral compacta"}
          data-ui-navigation-rail=""
          data-ui-navigation-rail-position={position}
          data-ui-navigation-rail-placement={placement}
          data-ui-navigation-rail-variant={variant}
          data-ui-navigation-rail-density={density}
          data-ui-navigation-rail-indicator={indicator}
          data-ui-navigation-rail-label-behavior={labelBehavior}
          {...rootSlotRest}
          {...rest}
          style={{
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
            ...getSlotStyle(styles, "root"),
            ...rootSlotStyle,
            ...style,
          }}
        >
          <Box
            className={containerSlotClassName}
            data-ui-navigation-rail-container=""
            {...containerSlotRest}
            style={{
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
              ...getSlotStyle(styles, "container"),
              ...containerSlotStyle,
            }}
          >
            {header ? (
              <Box
                data-ui-navigation-rail-header=""
                className={headerSlotClassName}
                {...headerSlotRest}
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  flexShrink: 0,
                  marginBottom: "0.4rem",
                  ...getSlotStyle(styles, "header"),
                  ...headerSlotStyle,
                  ...headerStyle,
                }}
              >
                {header}
              </Box>
            ) : null}

            <Box
              role="tablist"
              aria-orientation="vertical"
              data-ui-navigation-rail-list=""
              className={listSlotClassName}
              {...listSlotRest}
              style={{
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
                ...getSlotStyle(styles, "list"),
                ...listSlotStyle,
                ...listStyle,
              }}
            >
              {children}
            </Box>

            {footer ? (
              <Box
                data-ui-navigation-rail-footer=""
                className={footerSlotClassName}
                {...footerSlotRest}
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  flexShrink: 0,
                  marginTop: "0.4rem",
                  ...getSlotStyle(styles, "footer"),
                  ...footerSlotStyle,
                  ...footerStyle,
                }}
              >
                {footer}
              </Box>
            ) : null}
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