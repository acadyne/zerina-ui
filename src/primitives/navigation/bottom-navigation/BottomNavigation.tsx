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
  bottomNavigationRecipe,
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
    const isControlled =
      value !== undefined;

    const densityStyles =
      BOTTOM_NAVIGATION_DENSITY_MAP[density];

    const resolvedHeight =
      height ??
      densityStyles.defaultHeight;

    const [internalValue, setInternalValue] =
      React.useState<string | null>(
        defaultValue
      );

    const currentValue =
      isControlled
        ? value ?? null
        : internalValue;

    const setValue = React.useCallback(
      (
        nextValue: string,
        event: UIPressEvent<HTMLElement>
      ): void => {
        const reason =
          currentValue === nextValue
            ? "reselect"
            : "change";

        if (
          reason === "change" &&
          !isControlled
        ) {
          setInternalValue(nextValue);
        }

        onValueChange?.(
          nextValue,
          event,
          {
            value: nextValue,
            previousValue: currentValue,
            reason,
          }
        );
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

    const recipeStyles =
      bottomNavigationRecipe({
        density,
        position,
        variant,
        translucent,
        safeArea,
        height: resolvedHeight,
      });

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

          "data-ui-bottom-navigation":
            "",

          "data-ui-bottom-navigation-variant":
            variant,

          "data-ui-bottom-navigation-density":
            density,

          "data-ui-bottom-navigation-indicator":
            indicator,

          "data-ui-bottom-navigation-label-behavior":
            labelBehavior,
        },

        baseStyle:
          recipeStyles.root,
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

        baseStyle:
          recipeStyles.list,
      });

    return (
      <BottomNavigationContext.Provider
        value={contextValue}
      >
        <Box
          as="nav"
          ref={ref}
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