// src/theme/recipes/interactive-state-recipe.ts

import type React from "react";

import type {
  UIElevation,
  UITone,
} from "../contracts/visual-semantics";

import {
  surfaceRecipe,
} from "./surface-recipe";

import {
  toneRecipe,
  type UIToneEmphasis,
} from "./tone-recipe";


export type UIInteractiveEmphasis =
  | UIToneEmphasis
  | "surface"
  | "plain";


export interface InteractiveStateRecipeOptions {
  tone?:
    UITone;

  emphasis?:
    UIInteractiveEmphasis;

  elevation?:
    UIElevation;

  hoverElevation?:
    UIElevation;

  pressedElevation?:
    UIElevation;

  selectedElevation?:
    UIElevation;
}


export type InteractiveStateRecipeStyle =
  React.CSSProperties & {
    "--ui-interactive-background":
      string;

    "--ui-interactive-color":
      string;

    "--ui-interactive-border-color":
      string;

    "--ui-interactive-shadow":
      string;

    "--ui-interactive-hover-background":
      string;

    "--ui-interactive-hover-shadow":
      string;

    "--ui-interactive-focus-background":
      string;

    "--ui-interactive-focus-shadow":
      string;

    "--ui-interactive-pressed-background":
      string;

    "--ui-interactive-pressed-shadow":
      string;

    "--ui-interactive-selected-background":
      string;

    "--ui-interactive-selected-color":
      string;

    "--ui-interactive-selected-border-color":
      string;

    "--ui-interactive-selected-shadow":
      string;

    "--ui-interactive-selected-hover-background":
      string;

    "--ui-interactive-selected-focus-background":
      string;

    "--ui-interactive-selected-pressed-background":
      string;

    "--ui-interactive-focus-ring-color":
      string;

    "--ui-interactive-disabled-opacity":
      string;
  };


const STATE_LAYER_STRENGTH = {
  hover:
    8,

  focus:
    10,

  pressed:
    14,
} as const;


function elevationShadow(
  elevation:
    UIElevation,
): string {
  return surfaceRecipe({
    elevation,
    border:
      "none",
  }).boxShadow;
}


function stateLayer(
  foreground:
    string,
  background:
    string,
  strength:
    number,
): string {
  return `color-mix(in srgb, ${foreground} ${strength}%, ${background})`;
}


function resolveBaseTone({
  tone,
  emphasis,
}: {
  tone:
    UITone;

  emphasis:
    UIInteractiveEmphasis;
}) {
  if (
    emphasis ===
    "surface"
  ) {
    return {
      background:
        "var(--ui-surface)",

      color:
        "var(--ui-text)",

      borderColor:
        "var(--ui-border)",
    };
  }


  if (
    emphasis ===
    "plain"
  ) {
    return {
      background:
        "transparent",

      color:
        "inherit",

      borderColor:
        "transparent",
    };
  }


  return toneRecipe({
    tone,
    emphasis,
  });
}


function layeredBackground({
  background,
  color,
  strength,
  plain,
}: {
  background:
    string;

  color:
    string;

  strength:
    number;

  plain:
    boolean;
}): string {
  if (plain) {
    return background;
  }


  return stateLayer(
    color,
    background,
    strength,
  );
}


export function interactiveStateRecipe({
  tone =
    "primary",

  emphasis =
    "surface",

  elevation =
    0,

  hoverElevation =
    elevation,

  pressedElevation =
    elevation,

  selectedElevation =
    elevation,
}: InteractiveStateRecipeOptions = {}): InteractiveStateRecipeStyle {
  const base =
    resolveBaseTone({
      tone,
      emphasis,
    });

  const selected =
    emphasis ===
    "plain"
      ? base
      : toneRecipe({
          tone,
          emphasis:
            "container",
        });

  const plain =
    emphasis ===
    "plain";


  return {
    "--ui-interactive-background":
      base.background,

    "--ui-interactive-color":
      base.color,

    "--ui-interactive-border-color":
      base.borderColor,

    "--ui-interactive-shadow":
      elevationShadow(
        elevation,
      ),

    "--ui-interactive-hover-background":
      layeredBackground({
        background:
          base.background,

        color:
          base.color,

        strength:
          STATE_LAYER_STRENGTH
            .hover,

        plain,
      }),

    "--ui-interactive-hover-shadow":
      elevationShadow(
        hoverElevation,
      ),

    "--ui-interactive-focus-background":
      layeredBackground({
        background:
          base.background,

        color:
          base.color,

        strength:
          STATE_LAYER_STRENGTH
            .focus,

        plain,
      }),

    "--ui-interactive-focus-shadow":
      elevationShadow(
        elevation,
      ),

    "--ui-interactive-pressed-background":
      layeredBackground({
        background:
          base.background,

        color:
          base.color,

        strength:
          STATE_LAYER_STRENGTH
            .pressed,

        plain,
      }),

    "--ui-interactive-pressed-shadow":
      elevationShadow(
        pressedElevation,
      ),

    "--ui-interactive-selected-background":
      selected.background,

    "--ui-interactive-selected-color":
      selected.color,

    "--ui-interactive-selected-border-color":
      selected.borderColor,

    "--ui-interactive-selected-shadow":
      elevationShadow(
        selectedElevation,
      ),

    "--ui-interactive-selected-hover-background":
      layeredBackground({
        background:
          selected.background,

        color:
          selected.color,

        strength:
          STATE_LAYER_STRENGTH
            .hover,

        plain,
      }),

    "--ui-interactive-selected-focus-background":
      layeredBackground({
        background:
          selected.background,

        color:
          selected.color,

        strength:
          STATE_LAYER_STRENGTH
            .focus,

        plain,
      }),

    "--ui-interactive-selected-pressed-background":
      layeredBackground({
        background:
          selected.background,

        color:
          selected.color,

        strength:
          STATE_LAYER_STRENGTH
            .pressed,

        plain,
      }),

    "--ui-interactive-focus-ring-color":
      "var(--ui-interaction-focus-ring-color)",

    "--ui-interactive-disabled-opacity":
      "var(--ui-interaction-disabled-opacity)",
  };
}
