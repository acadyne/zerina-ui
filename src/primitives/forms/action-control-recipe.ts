import type React from "react";

import {
  interactiveStateRecipe,
  typographyRecipe,
  type InteractiveStateRecipeStyle,
} from "../../theme/recipes";

import type {
  ActionControlColorScheme,
  ActionControlSize,
  ActionControlVariant,
} from "./action-control-types";


export interface ActionControlSizeMetrics {
  minHeight: string;
  paddingBlock: string;
  paddingInline: string;
  radius: string;
}


export interface ButtonActionRecipe {
  root:
    InteractiveStateRecipeStyle &
    React.CSSProperties;

  spinner:
    React.CSSProperties;

  content:
    React.CSSProperties;

  leftIcon:
    React.CSSProperties;

  rightIcon:
    React.CSSProperties;

  metrics:
    ActionControlSizeMetrics;
}


export interface IconButtonActionRecipe {
  root:
    InteractiveStateRecipeStyle &
    React.CSSProperties;

  icon:
    React.CSSProperties;
}


const ACTIVE_DENSITY_CONTROL_HEIGHT =
  "var(--ui-density-control-height, var(--ui-control-h-md))";


/*
 * Preserve each component size as an offset from the canonical md control
 * height. This keeps the density projection self-contained: styles-only
 * consumers that provide the control height tokens do not also need an
 * unrelated spacing token for the size calculation to remain valid.
 */
function densityAwareControlHeight(
  size:
    ActionControlSize,
): string {
  if (
    size ===
    "sm"
  ) {
    return `max(var(--ui-control-h-sm), calc(${ACTIVE_DENSITY_CONTROL_HEIGHT} - var(--ui-control-h-md) + var(--ui-control-h-sm)))`;
  }


  if (
    size ===
    "lg"
  ) {
    return `max(var(--ui-control-h-lg), calc(${ACTIVE_DENSITY_CONTROL_HEIGHT} - var(--ui-control-h-md) + var(--ui-control-h-lg)))`;
  }


  return `max(var(--ui-control-h-md), ${ACTIVE_DENSITY_CONTROL_HEIGHT})`;
}


const ACTION_CONTROL_SIZE_METRICS:
  Record<
    ActionControlSize,
    ActionControlSizeMetrics
  > = {
    sm: {
      minHeight:
        densityAwareControlHeight(
          "sm",
        ),

      paddingBlock:
        "var(--ui-control-padding-y-sm)",

      paddingInline:
        "var(--ui-control-padding-x-sm)",

      radius:
        "var(--ui-radius-sm)",
    },

    md: {
      minHeight:
        densityAwareControlHeight(
          "md",
        ),

      paddingBlock:
        "var(--ui-control-padding-y-md)",

      paddingInline:
        "var(--ui-control-padding-x-md)",

      radius:
        "var(--ui-radius-md)",
    },

    lg: {
      minHeight:
        densityAwareControlHeight(
          "lg",
        ),

      paddingBlock:
        "var(--ui-control-padding-y-lg)",

      paddingInline:
        "var(--ui-control-padding-x-lg)",

      radius:
        "var(--ui-radius-lg)",
    },
  };


function getButtonInteraction(
  variant:
    ActionControlVariant,
  colorScheme:
    ActionControlColorScheme,
): InteractiveStateRecipeStyle {
  if (
    variant ===
    "outline"
  ) {
    return interactiveStateRecipe({
      tone:
        colorScheme,

      emphasis:
        "outline",

      elevation:
        0,

      hoverElevation:
        1,

      pressedElevation:
        0,
    });
  }


  if (
    variant ===
    "ghost"
  ) {
    return interactiveStateRecipe({
      tone:
        colorScheme,

      emphasis:
        "text",

      elevation:
        0,

      hoverElevation:
        1,

      pressedElevation:
        0,
    });
  }


  return interactiveStateRecipe({
    tone:
      colorScheme,

    emphasis:
      "solid",

    elevation:
      2,

    hoverElevation:
      3,

    pressedElevation:
      1,
  });
}


export function getButtonActionRecipe({
  size,
  variant,
  colorScheme,
}: {
  size:
    ActionControlSize;

  variant:
    ActionControlVariant;

  colorScheme:
    ActionControlColorScheme;
}): ButtonActionRecipe {
  const metrics =
    ACTION_CONTROL_SIZE_METRICS[
      size
    ];


  return {
    root: {
      ...getButtonInteraction(
        variant,
        colorScheme,
      ),

      ...typographyRecipe({
        role:
          "label",
      }),

      appearance:
        "none",

      display:
        "inline-flex",

      alignItems:
        "center",

      justifyContent:
        "center",

      gap:
        "var(--ui-density-inline-gap, var(--ui-space-sm))",

      touchAction:
        "manipulation",

      userSelect:
        "none",

      WebkitTapHighlightColor:
        "transparent",

      whiteSpace:
        "nowrap",

      verticalAlign:
        "middle",

      borderWidth:
        1,

      borderStyle:
        "solid",

      borderRadius:
        metrics.radius,
    },

    spinner: {
      width:
        16,

      height:
        16,

      flexShrink:
        0,

      borderRadius:
        "var(--ui-radius-full)",

      border:
        "2px solid currentColor",

      borderTopColor:
        "transparent",
    },

    content: {
      display:
        "inline-flex",

      alignItems:
        "center",

      justifyContent:
        "center",

      minWidth:
        0,
    },

    leftIcon: {
      display:
        "inline-flex",

      alignItems:
        "center",

      justifyContent:
        "center",

      flexShrink:
        0,

      lineHeight:
        1,
    },

    rightIcon: {
      display:
        "inline-flex",

      alignItems:
        "center",

      justifyContent:
        "center",

      flexShrink:
        0,

      lineHeight:
        1,
    },

    metrics,
  };
}


export function getIconButtonActionRecipe({
  size,
  variant,
}: {
  size:
    ActionControlSize;

  variant:
    "ghost" |
    "solid" |
    "unstyled";
}): IconButtonActionRecipe {
  const metrics =
    ACTION_CONTROL_SIZE_METRICS[
      size
    ];

  const interaction =
    variant === "solid"
      ? interactiveStateRecipe({
          tone:
            "primary",

          emphasis:
            "solid",

          elevation:
            0,

          hoverElevation:
            1,

          pressedElevation:
            0,
        })
      : variant === "unstyled"
        ? interactiveStateRecipe({
            tone:
              "neutral",

            emphasis:
              "plain",
          })
        : interactiveStateRecipe({
            tone:
              "neutral",

            emphasis:
              "text",

            elevation:
              0,

            hoverElevation:
              1,

            pressedElevation:
              0,
          });


  return {
    root: {
      ...interaction,

      appearance:
        "none",

      display:
        "inline-flex",

      alignItems:
        "center",

      justifyContent:
        "center",

      boxSizing:
        "border-box",

      width:
        metrics.minHeight,

      height:
        metrics.minHeight,

      minWidth:
        metrics.minHeight,

      minHeight:
        metrics.minHeight,

      padding:
        0,

      flexShrink:
        0,

      borderWidth:
        1,

      borderStyle:
        "solid",

      borderRadius:
        "var(--ui-radius-full)",

      touchAction:
        "manipulation",

      userSelect:
        "none",

      WebkitTapHighlightColor:
        "transparent",
    },

    icon: {
      display:
        "inline-flex",

      alignItems:
        "center",

      justifyContent:
        "center",

      flexShrink:
        0,

      lineHeight:
        1,
    },
  };
}
