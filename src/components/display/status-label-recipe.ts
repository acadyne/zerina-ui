import type React from "react";

import {
  defineSlotRecipe,
} from "../../helpers/css";


export type StatusLabelVariant =
  | "solid"
  | "subtle"
  | "outline";


export type StatusLabelColorScheme =
  | "primary"
  | "secondary"
  | "success"
  | "warning"
  | "danger"
  | "neutral";


export type StatusLabelRecipeSlot =
  | "root"
  | "content";


interface StatusLabelSchemeTokens {
  solidBg:
    string;

  solidText:
    string;

  subtleBg:
    string;

  subtleText:
    string;

  outlineText:
    string;

  outlineBorder:
    string;
}


const STATUS_LABEL_SCHEMES:
  Record<
    StatusLabelColorScheme,
    StatusLabelSchemeTokens
  > = {
    primary: {
      solidBg:
        "var(--ui-primary)",

      solidText:
        "var(--ui-primary-contrast)",

      subtleBg:
        "color-mix(in srgb, var(--ui-primary) 18%, transparent)",

      subtleText:
        "var(--ui-primary)",

      outlineText:
        "var(--ui-primary)",

      outlineBorder:
        "color-mix(in srgb, var(--ui-primary) 40%, var(--ui-border))",
    },

    secondary: {
      solidBg:
        "var(--ui-secondary)",

      solidText:
        "var(--ui-secondary-contrast)",

      subtleBg:
        "color-mix(in srgb, var(--ui-secondary) 18%, transparent)",

      subtleText:
        "var(--ui-secondary)",

      outlineText:
        "var(--ui-secondary)",

      outlineBorder:
        "color-mix(in srgb, var(--ui-secondary) 40%, var(--ui-border))",
    },

    success: {
      solidBg:
        "var(--ui-success-strong)",

      solidText:
        "var(--ui-success-contrast)",

      subtleBg:
        "color-mix(in srgb, var(--ui-success) 16%, transparent)",

      subtleText:
        "var(--ui-success)",

      outlineText:
        "var(--ui-success)",

      outlineBorder:
        "color-mix(in srgb, var(--ui-success) 35%, var(--ui-border))",
    },

    warning: {
      solidBg:
        "var(--ui-warning-strong)",

      solidText:
        "var(--ui-warning-contrast)",

      subtleBg:
        "color-mix(in srgb, var(--ui-warning) 16%, transparent)",

      subtleText:
        "var(--ui-warning)",

      outlineText:
        "var(--ui-warning)",

      outlineBorder:
        "color-mix(in srgb, var(--ui-warning) 35%, var(--ui-border))",
    },

    danger: {
      solidBg:
        "var(--ui-danger)",

      solidText:
        "var(--ui-danger-contrast)",

      subtleBg:
        "color-mix(in srgb, var(--ui-danger) 16%, transparent)",

      subtleText:
        "var(--ui-danger)",

      outlineText:
        "var(--ui-danger)",

      outlineBorder:
        "color-mix(in srgb, var(--ui-danger) 40%, var(--ui-border))",
    },

    neutral: {
      solidBg:
        "var(--ui-surface-3)",

      solidText:
        "var(--ui-text)",

      subtleBg:
        "var(--ui-surface-2)",

      subtleText:
        "var(--ui-text-muted)",

      outlineText:
        "var(--ui-text-muted)",

      outlineBorder:
        "var(--ui-border)",
    },
  };


function getStatusLabelVariantStyle(
  variant:
    StatusLabelVariant,

  colorScheme:
    StatusLabelColorScheme,
): React.CSSProperties {
  const scheme =
    STATUS_LABEL_SCHEMES[
      colorScheme
    ];


  if (
    variant ===
    "solid"
  ) {
    return {
      background:
        scheme.solidBg,

      color:
        scheme.solidText,

      border:
        "1px solid transparent",
    };
  }


  if (
    variant ===
    "outline"
  ) {
    return {
      background:
        "transparent",

      color:
        scheme.outlineText,

      border:
        `1px solid ${scheme.outlineBorder}`,
    };
  }


  return {
    background:
      scheme.subtleBg,

    color:
      scheme.subtleText,

    border:
      "1px solid transparent",
  };
}


export const statusLabelRecipe =
  defineSlotRecipe<
    StatusLabelRecipeSlot,
    {
      variant:
        StatusLabelVariant;

      colorScheme:
        StatusLabelColorScheme;
    }
  >({
    base: {
      root: {
        display:
          "inline-flex",

        alignItems:
          "center",

        justifyContent:
          "center",

        gap:
          "0.35rem",

        maxWidth:
          "100%",

        lineHeight:
          1,

        whiteSpace:
          "nowrap",
      },

      content: {
        minWidth:
          0,

        overflow:
          "hidden",

        textOverflow:
          "ellipsis",
      },
    },

    resolve: ({
      variant,
      colorScheme,
    }) => ({
      root:
        getStatusLabelVariantStyle(
          variant,
          colorScheme,
        ),
    }),
  });
