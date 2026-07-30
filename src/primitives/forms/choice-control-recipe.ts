import React from "react";

import {
  defineSlotRecipe,
} from "../../helpers/css";

import type {
  ChoiceControlColorScheme,
  ChoiceControlLabelPlacement,
  ChoiceControlSize,
} from "./choice-control-types";


export type ChoiceControlRecipeSlot =
  | "root"
  | "input"
  | "label";


type ChoiceControlRecipeVariants = {
  size:
    ChoiceControlSize;

  colorScheme:
    ChoiceControlColorScheme;

  labelPlacement:
    ChoiceControlLabelPlacement;
};


type ChoiceControlVariables =
  React.CSSProperties & {
    "--ui-choice-accent"?:
      string;

    "--ui-choice-accent-contrast"?:
      string;

    "--ui-choice-control-size"?:
      string;

    "--ui-choice-font-size"?:
      string;

    "--ui-choice-gap"?:
      string;

    "--ui-checkbox-mark-width"?:
      string;

    "--ui-checkbox-mark-height"?:
      string;

    "--ui-checkbox-mark-thickness"?:
      string;

    "--ui-radio-dot-size"?:
      string;

    "--ui-switch-track-width"?:
      string;

    "--ui-switch-track-height"?:
      string;

    "--ui-switch-thumb-size"?:
      string;

    "--ui-switch-offset"?:
      string;
  };


const sizeVariables:
  Record<
    ChoiceControlSize,
    ChoiceControlVariables
  > = {
    sm: {
      "--ui-choice-control-size":
        "0.875rem",

      "--ui-choice-font-size":
        "var(--ui-font-size-sm)",

      "--ui-choice-gap":
        "0.45rem",

      "--ui-checkbox-mark-width":
        "0.25rem",

      "--ui-checkbox-mark-height":
        "0.4375rem",

      "--ui-checkbox-mark-thickness":
        "2px",

      "--ui-radio-dot-size":
        "0.375rem",

      "--ui-switch-track-width":
        "2.125rem",

      "--ui-switch-track-height":
        "1.25rem",

      "--ui-switch-thumb-size":
        "0.875rem",

      "--ui-switch-offset":
        "0.1875rem",
    },

    md: {
      "--ui-choice-control-size":
        "1rem",

      "--ui-choice-font-size":
        "var(--ui-font-size-md)",

      "--ui-choice-gap":
        "0.55rem",

      "--ui-checkbox-mark-width":
        "0.375rem",

      "--ui-checkbox-mark-height":
        "0.5rem",

      "--ui-checkbox-mark-thickness":
        "2px",

      "--ui-radio-dot-size":
        "0.5rem",

      "--ui-switch-track-width":
        "2.625rem",

      "--ui-switch-track-height":
        "1.5rem",

      "--ui-switch-thumb-size":
        "1.125rem",

      "--ui-switch-offset":
        "0.1875rem",
    },

    lg: {
      "--ui-choice-control-size":
        "1.25rem",

      "--ui-choice-font-size":
        "var(--ui-font-size-lg)",

      "--ui-choice-gap":
        "0.65rem",

      "--ui-checkbox-mark-width":
        "0.5rem",

      "--ui-checkbox-mark-height":
        "0.6875rem",

      "--ui-checkbox-mark-thickness":
        "3px",

      "--ui-radio-dot-size":
        "0.625rem",

      "--ui-switch-track-width":
        "3.25rem",

      "--ui-switch-track-height":
        "1.875rem",

      "--ui-switch-thumb-size":
        "1.375rem",

      "--ui-switch-offset":
        "0.25rem",
    },
  };


const schemeVariables:
  Record<
    ChoiceControlColorScheme,
    ChoiceControlVariables
  > = {
    primary: {
      "--ui-choice-accent":
        "var(--ui-primary)",

      "--ui-choice-accent-contrast":
        "var(--ui-primary-contrast)",
    },

    secondary: {
      "--ui-choice-accent":
        "var(--ui-secondary)",

      "--ui-choice-accent-contrast":
        "var(--ui-secondary-contrast)",
    },

    danger: {
      "--ui-choice-accent":
        "var(--ui-danger)",

      "--ui-choice-accent-contrast":
        "var(--ui-danger-contrast)",
    },
  };


export const choiceControlRecipe =
  defineSlotRecipe<
    ChoiceControlRecipeSlot,
    ChoiceControlRecipeVariants
  >({
    base: {
      root: {
        display:
          "inline-flex",

        alignItems:
          "center",

        gap:
          "var(--ui-choice-gap)",

        userSelect:
          "none",

        WebkitTapHighlightColor:
          "transparent",
      },

      input: {
        boxSizing:
          "border-box",

        margin:
          0,

        outline:
          "none",

        font:
          "inherit",
      },

      label: {
        color:
          "var(--ui-text)",

        fontSize:
          "var(--ui-choice-font-size)",

        lineHeight:
          1.15,
      },
    },

    variants: {
      size: {
        sm: {
          root:
            sizeVariables.sm,
        },

        md: {
          root:
            sizeVariables.md,
        },

        lg: {
          root:
            sizeVariables.lg,
        },
      },

      colorScheme: {
        primary: {
          root:
            schemeVariables.primary,
        },

        secondary: {
          root:
            schemeVariables.secondary,
        },

        danger: {
          root:
            schemeVariables.danger,
        },
      },

      labelPlacement: {
        start: {
          root: {
            flexDirection:
              "row-reverse",
          },
        },

        end: {
          root: {
            flexDirection:
              "row",
          },
        },
      },
    },
  });
