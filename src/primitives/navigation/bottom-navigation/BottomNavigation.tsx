import React from "react";
import { Box } from "../../layout";
import { BottomNavigationContext } from "./BottomNavigationContext";
import { BottomNavigationItem } from "./BottomNavigationItem";
import {
  BOTTOM_NAVIGATION_DENSITY_MAP,
  cssSize,
  getListSurfaceStyles,
  getRootPositionStyle,
  getRootSurfaceStyles,
} from "./bottomNavigation.styles";
import type {
  BottomNavigationContextValue,
  BottomNavigationProps,
} from "./bottomNavigation.types";

const BottomNavigationRoot = React.forwardRef<
  HTMLElement,
  BottomNavigationProps
>(
  (
    {
      children,
      value,
      defaultValue = null,
      onValueChange,
      height,
      position = "fixed",
      safeArea = true,
      translucent = true,
      variant = "surface",
      labelBehavior = "always",
      indicator = "background",
      density = "comfortable",

      badgeAnchor = "icon",
      badgePlacement = "top-end",
      badgeOffset,

      itemShape = "rounded",
      itemMinWidth,

      iconPosition = "top",
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
      ...rest
    },
    ref
  ) => {
    const isControlled = value !== undefined;
    const densityStyles = BOTTOM_NAVIGATION_DENSITY_MAP[density];
    const resolvedHeight = height ?? densityStyles.defaultHeight;

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

    const contextValue = React.useMemo<BottomNavigationContextValue>(
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

        iconPosition,
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
        iconPosition,
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
      ]
    );

    return (
      <BottomNavigationContext.Provider value={contextValue}>
        <Box
          as="nav"
          ref={ref as React.Ref<Element>}
          className={className}
          aria-label={rest["aria-label"] ?? "Navegación inferior"}
          data-ui-bottom-navigation=""
          data-ui-bottom-navigation-variant={variant}
          data-ui-bottom-navigation-density={density}
          data-ui-bottom-navigation-indicator={indicator}
          data-ui-bottom-navigation-label-behavior={labelBehavior}
          {...rest}
          style={{
            ...getRootPositionStyle(position),
            minWidth: 0,
            paddingBottom: safeArea
              ? "env(safe-area-inset-bottom, 0px)"
              : undefined,
            boxSizing: "border-box",
            ...getRootSurfaceStyles({ variant, translucent }),
            ...style,
          }}
        >
          <Box
            role="tablist"
            style={{
              height: cssSize(resolvedHeight),
              minWidth: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-around",
              gap: "0.25rem",
              paddingTop: densityStyles.listPaddingTop,
              paddingRight: densityStyles.listPaddingRight,
              paddingBottom: densityStyles.listPaddingBottom,
              paddingLeft: densityStyles.listPaddingLeft,
              boxSizing: "border-box",
              overflow: "visible",
              ...getListSurfaceStyles({ variant, translucent }),
              ...listStyle,
            }}
          >
            {children}
          </Box>
        </Box>
      </BottomNavigationContext.Provider>
    );
  }
);

BottomNavigationRoot.displayName = "BottomNavigation";

export const BottomNavigation = Object.assign(BottomNavigationRoot, {
  Item: BottomNavigationItem,
});

export type BottomNavigationComponent = typeof BottomNavigation;