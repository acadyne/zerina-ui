// src/primitives/navigation/bottom-navigation/BottomNavigation.tsx
import React from "react";
import type { UIPressEvent } from "../../../core/interaction";
import { resolveSlot } from "../../../helpers/css";
import { Box } from "../../layout";
import {
  BottomNavigationContext,
  type BottomNavigationContextValue,
} from "./BottomNavigationContext";
import { BottomNavigationItem } from "./BottomNavigationItem";
import {
  BOTTOM_NAVIGATION_DENSITY_MAP,
  cssSize,
  getListSurfaceStyles,
  getRootPositionStyle,
  getRootSurfaceStyles,
} from "./bottomNavigation.styles";
import type {
  BottomNavigationProps,
  BottomNavigationSlot,
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

    const densityStyles =
      BOTTOM_NAVIGATION_DENSITY_MAP[density];

    const resolvedHeight =
      height ?? densityStyles.defaultHeight;

    const [internalValue, setInternalValue] =
      React.useState<string | null>(defaultValue);

    const currentValue = isControlled
      ? value ?? null
      : internalValue;

    const setValue = React.useCallback(
      (
        nextValue: string,
        event: UIPressEvent<HTMLElement>
      ): void => {
        if (currentValue === nextValue) {
          return;
        }

        if (!isControlled) {
          setInternalValue(nextValue);
        }

        onValueChange?.(nextValue, event);
      },
      [
        currentValue,
        isControlled,
        onValueChange,
      ]
    );

    const contextValue =
      React.useMemo<BottomNavigationContextValue>(
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

          iconPosition,
          activeLabelWeight,

          styles,
          slotProps,
        ]
      );

    const rootSlot =
      resolveSlot<BottomNavigationSlot>({
        slot: "root",
        styles,
        slotProps,
        className,
        style,
        baseProps: {
          "aria-label":
            rest["aria-label"] ??
            "Navegación inferior",
          "data-ui-bottom-navigation": "",
          "data-ui-bottom-navigation-variant":
            variant,
          "data-ui-bottom-navigation-density":
            density,
          "data-ui-bottom-navigation-indicator":
            indicator,
          "data-ui-bottom-navigation-label-behavior":
            labelBehavior,
        },
        baseStyle: {
          ...getRootPositionStyle(position),
          minWidth: 0,
          paddingBottom: safeArea
            ? "env(safe-area-inset-bottom, 0px)"
            : undefined,
          boxSizing: "border-box",
          ...getRootSurfaceStyles({
            variant,
            translucent,
          }),
        },
      });

    const listSlot =
      resolveSlot<BottomNavigationSlot>({
        slot: "list",
        styles,
        slotProps,
        baseProps: {
          "data-ui-bottom-navigation-list":
            "",
        },
        baseStyle: {
          height: cssSize(resolvedHeight),
          minWidth: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-around",
          gap: "0.25rem",
          paddingTop:
            densityStyles.listPaddingTop,
          paddingRight:
            densityStyles.listPaddingRight,
          paddingBottom:
            densityStyles.listPaddingBottom,
          paddingLeft:
            densityStyles.listPaddingLeft,
          boxSizing: "border-box",
          overflow: "visible",
          ...getListSurfaceStyles({
            variant,
            translucent,
          }),
        },
      });

    return (
      <BottomNavigationContext.Provider
        value={contextValue}
      >
        <Box
          as="nav"
          ref={ref as React.Ref<Element>}
          {...rest}
          {...rootSlot}
        >
          <Box {...listSlot}>
            {children}
          </Box>
        </Box>
      </BottomNavigationContext.Provider>
    );
  }
);

BottomNavigationRoot.displayName =
  "BottomNavigation";

export const BottomNavigation =
  Object.assign(
    BottomNavigationRoot,
    {
      Item: BottomNavigationItem,
    }
  );

export type BottomNavigationComponent =
  typeof BottomNavigation;