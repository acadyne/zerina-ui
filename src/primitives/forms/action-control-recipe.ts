import type React from "react";

import type {
  ActionControlColorScheme,
  ActionControlSize,
  ActionControlVariant,
} from "./action-control-types";

type ActionControlVariableStyles =
  React.CSSProperties & {
    "--ui-action-background"?:
      string;

    "--ui-action-hover-background"?:
      string;

    "--ui-action-pressed-background"?:
      string;

    "--ui-action-color"?:
      string;

    "--ui-action-border"?:
      string;

    "--ui-action-shadow"?:
      string;

    "--ui-action-hover-shadow"?:
      string;

    "--ui-action-pressed-shadow"?:
      string;
  };

export interface ActionControlSizeMetrics {
  minHeight: string;
  paddingBlock: string;
  paddingInline: string;
  fontSize: string;
  radius: string;
}

export interface ButtonActionRecipe {
  root:
    ActionControlVariableStyles;

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
    ActionControlVariableStyles;

  icon:
    React.CSSProperties;
}

const ACTION_CONTROL_SIZE_METRICS:
  Record<
    ActionControlSize,
    ActionControlSizeMetrics
  > = {
    sm: {
      minHeight:
        "var(--ui-control-h-sm)",

      paddingBlock:
        "var(--ui-control-padding-y-sm)",

      paddingInline:
        "var(--ui-control-padding-x-sm)",

      fontSize:
        "var(--ui-font-size-sm)",

      radius:
        "var(--ui-radius-sm)",
    },

    md: {
      minHeight:
        "var(--ui-control-h-md)",

      paddingBlock:
        "var(--ui-control-padding-y-md)",

      paddingInline:
        "var(--ui-control-padding-x-md)",

      fontSize:
        "var(--ui-font-size-md)",

      radius:
        "var(--ui-radius-md)",
    },

    lg: {
      minHeight:
        "var(--ui-control-h-lg)",

      paddingBlock:
        "var(--ui-control-padding-y-lg)",

      paddingInline:
        "var(--ui-control-padding-x-lg)",

      fontSize:
        "var(--ui-font-size-lg)",

      radius:
        "var(--ui-radius-lg)",
    },
  };

const SCHEME_MAP = {
  primary: {
    solidBackground:
      "var(--ui-primary)",

    solidHoverBackground:
      "var(--ui-primary-hover)",

    solidColor:
      "var(--ui-primary-contrast)",

    subtleColor:
      "var(--ui-primary)",

    subtleBorder:
      "color-mix(in srgb, var(--ui-primary) 42%, var(--ui-border))",

    subtleBackground:
      "color-mix(in srgb, var(--ui-primary) 10%, transparent)",
  },

  secondary: {
    solidBackground:
      "var(--ui-secondary)",

    solidHoverBackground:
      "var(--ui-secondary-hover)",

    solidColor:
      "var(--ui-secondary-contrast)",

    subtleColor:
      "var(--ui-secondary)",

    subtleBorder:
      "color-mix(in srgb, var(--ui-secondary) 42%, var(--ui-border))",

    subtleBackground:
      "color-mix(in srgb, var(--ui-secondary) 10%, transparent)",
  },

  danger: {
    solidBackground:
      "var(--ui-danger)",

    solidHoverBackground:
      "var(--ui-danger-hover)",

    solidColor:
      "var(--ui-danger-contrast)",

    subtleColor:
      "var(--ui-danger)",

    subtleBorder:
      "color-mix(in srgb, var(--ui-danger) 42%, var(--ui-border))",

    subtleBackground:
      "color-mix(in srgb, var(--ui-danger) 10%, transparent)",
  },
} as const;

function getButtonVariables(
  variant: ActionControlVariant,
  colorScheme:
    ActionControlColorScheme
): ActionControlVariableStyles {
  const scheme =
    SCHEME_MAP[colorScheme];

  if (variant === "outline") {
    return {
      "--ui-action-background":
        "transparent",

      "--ui-action-hover-background":
        scheme.subtleBackground,

      "--ui-action-pressed-background":
        scheme.subtleBackground,

      "--ui-action-color":
        scheme.subtleColor,

      "--ui-action-border":
        `1px solid ${scheme.subtleBorder}`,

      "--ui-action-shadow":
        "none",

      "--ui-action-hover-shadow":
        "var(--ui-shadow-action-outline-hover)",

      "--ui-action-pressed-shadow":
        "var(--ui-shadow-action-outline-hover)",
    };
  }

  if (variant === "ghost") {
    return {
      "--ui-action-background":
        "transparent",

      "--ui-action-hover-background":
        scheme.subtleBackground,

      "--ui-action-pressed-background":
        scheme.subtleBackground,

      "--ui-action-color":
        scheme.subtleColor,

      "--ui-action-border":
        "1px solid transparent",

      "--ui-action-shadow":
        "none",

      "--ui-action-hover-shadow":
        "var(--ui-shadow-action-subtle-hover)",

      "--ui-action-pressed-shadow":
        "var(--ui-shadow-action-subtle-hover)",
    };
  }

  return {
    "--ui-action-background":
      scheme.solidBackground,

    "--ui-action-hover-background":
      scheme.solidHoverBackground,

    "--ui-action-pressed-background":
      scheme.solidHoverBackground,

    "--ui-action-color":
      scheme.solidColor,

    "--ui-action-border":
      "1px solid transparent",

    "--ui-action-shadow":
      "var(--ui-shadow-action)",

    "--ui-action-hover-shadow":
      "var(--ui-shadow-action-hover)",

    "--ui-action-pressed-shadow":
      "var(--ui-shadow-action-hover)",
  };
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
      ...getButtonVariables(
        variant,
        colorScheme
      ),

      appearance:
        "none",

      display:
        "inline-flex",

      alignItems:
        "center",

      justifyContent:
        "center",

      gap:
        "0.55rem",

      lineHeight:
        1.1,

      fontWeight:
        700,

      fontSize:
        metrics.fontSize,

      letterSpacing:
        "0.2px",

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

  const variables:
    ActionControlVariableStyles =
      variant === "solid"
        ? {
            "--ui-action-background":
              "var(--ui-primary)",

            "--ui-action-hover-background":
              "var(--ui-primary-hover)",

            "--ui-action-pressed-background":
              "var(--ui-primary-hover)",

            "--ui-action-color":
              "var(--ui-primary-contrast)",

            "--ui-action-border":
              "1px solid transparent",

            "--ui-action-shadow":
              "none",

            "--ui-action-hover-shadow":
              "var(--ui-shadow-action-subtle-hover)",

            "--ui-action-pressed-shadow":
              "var(--ui-shadow-action-subtle-hover)",
          }
        : variant === "unstyled"
          ? {
              "--ui-action-background":
                "transparent",

              "--ui-action-hover-background":
                "transparent",

              "--ui-action-pressed-background":
                "transparent",

              "--ui-action-color":
                "inherit",

              "--ui-action-border":
                "1px solid transparent",

              "--ui-action-shadow":
                "none",

              "--ui-action-hover-shadow":
                "none",

              "--ui-action-pressed-shadow":
                "none",
            }
          : {
              "--ui-action-background":
                "transparent",

              "--ui-action-hover-background":
                "var(--ui-surface-hover)",

              "--ui-action-pressed-background":
                "var(--ui-surface-hover)",

              "--ui-action-color":
                "var(--ui-text)",

              "--ui-action-border":
                "1px solid var(--ui-border)",

              "--ui-action-shadow":
                "none",

              "--ui-action-hover-shadow":
                "var(--ui-shadow-action-subtle-hover)",

              "--ui-action-pressed-shadow":
                "var(--ui-shadow-action-subtle-hover)",
            };

  return {
    root: {
      ...variables,

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
