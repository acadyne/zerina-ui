// src/primitives/navigation/navigation-rail/NavigationRail.tsx
import React from "react";
import type { UIPressEvent } from "../../../core/interaction";
import { resolveSlot } from "../../../helpers/css";
import { Box } from "../../layout";
import {
  NavigationRailContext,
  type NavigationRailContextValue,
} from "./NavigationRailContext";
import { NavigationRailItem } from "./NavigationRailItem";
import {
  NAVIGATION_RAIL_DENSITY_MAP,
  navigationRailRecipe,
} from "./navigationRail.styles";
import type {
  NavigationRailItemProps,
  NavigationRailProps,
  NavigationRailSlot,
} from "./navigationRail.types";

const NavigationRailRoot = React.forwardRef<
  HTMLElement,
  NavigationRailProps
>(
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
      NAVIGATION_RAIL_DENSITY_MAP[
      density
      ];

    const resolvedWidth =
      width ??
      densityStyles.defaultWidth;

    const [
      internalValue,
      setInternalValue,
    ] = React.useState<string | null>(
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
      React.useMemo<NavigationRailContextValue>(
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

          activeLabelWeight,

          styles,
          slotProps,
        ]
      );

    const recipeStyles =
      navigationRailRecipe({
        density,
        width: resolvedWidth,
        position,
        placement,
        safeArea,
        translucent,
        variant,
        alignment,
      });

    const rootSlot =
      resolveSlot<NavigationRailSlot>({
        slot: "root",
        styles,
        slotProps,
        className,
        style,

        baseProps: {
          "aria-label":
            rest["aria-label"] ??
            "Navegación lateral compacta",

          "data-ui-navigation-rail":
            "",

          "data-ui-navigation-rail-position":
            position,

          "data-ui-navigation-rail-placement":
            placement,

          "data-ui-navigation-rail-variant":
            variant,

          "data-ui-navigation-rail-density":
            density,

          "data-ui-navigation-rail-indicator":
            indicator,

          "data-ui-navigation-rail-label-behavior":
            labelBehavior,
        },

        baseStyle:
          recipeStyles.root,
      });

    const containerSlot =
      resolveSlot<NavigationRailSlot>({
        slot: "container",
        styles,
        slotProps,

        baseProps: {
          "data-ui-navigation-rail-container":
            "",
        },

        baseStyle:
          recipeStyles.container,
      });

    const headerSlot =
      resolveSlot<NavigationRailSlot>({
        slot: "header",
        styles,
        slotProps,

        baseProps: {
          "data-ui-navigation-rail-header":
            "",
        },

        baseStyle:
          recipeStyles.header,
      });

    const listSlot =
      resolveSlot<NavigationRailSlot>({
        slot: "list",
        styles,
        slotProps,

        baseProps: {
          "data-ui-navigation-rail-list":
            "",
        },

        baseStyle:
          recipeStyles.list,
      });

    const footerSlot =
      resolveSlot<NavigationRailSlot>({
        slot: "footer",
        styles,
        slotProps,

        baseProps: {
          "data-ui-navigation-rail-footer":
            "",
        },

        baseStyle:
          recipeStyles.footer,
      });

    return (
      <NavigationRailContext.Provider
        value={contextValue}
      >
        <Box
          as="nav"
          ref={ref}
          {...rest}
          {...rootSlot}
        >
          <Box {...containerSlot}>
            {header ? (
              <Box {...headerSlot}>
                {header}
              </Box>
            ) : null}

            <Box {...listSlot}>
              {children}
            </Box>

            {footer ? (
              <Box {...footerSlot}>
                {footer}
              </Box>
            ) : null}
          </Box>
        </Box>
      </NavigationRailContext.Provider>
    );
  }
);

NavigationRailRoot.displayName =
  "NavigationRail";

type NavigationRailComponent =
  React.ForwardRefExoticComponent<
    NavigationRailProps &
    React.RefAttributes<HTMLElement>
  > & {
    Item: React.ForwardRefExoticComponent<
      NavigationRailItemProps &
      React.RefAttributes<HTMLButtonElement>
    >;
  };

export const NavigationRail =
  Object.assign(
    NavigationRailRoot,
    {
      Item: NavigationRailItem,
    }
  ) as NavigationRailComponent;