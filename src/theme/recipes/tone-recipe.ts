// src/theme/recipes/tone-recipe.ts

import type {
  UITone,
} from "../contracts/visual-semantics";


export type UIToneEmphasis =
  | "solid"
  | "container"
  | "outline"
  | "text";


export interface ToneRecipeOptions {
  tone:
    UITone;

  emphasis?:
    UIToneEmphasis;
}


export interface ToneRecipeStyle {
  background:
    string;

  color:
    string;

  borderColor:
    string;
}


interface ToneRecipeTokens {
  accent:
    string;

  onAccent:
    string;

  container:
    string;

  onContainer:
    string;
}


const TONE_TOKENS:
  Record<
    UITone,
    ToneRecipeTokens
  > = {
    neutral: {
      accent:
        "var(--ui-text)",

      onAccent:
        "var(--ui-surface)",

      container:
        "var(--ui-neutral-container)",

      onContainer:
        "var(--ui-on-neutral-container)",
    },

    primary: {
      accent:
        "var(--ui-primary)",

      onAccent:
        "var(--ui-primary-contrast)",

      container:
        "var(--ui-primary-container)",

      onContainer:
        "var(--ui-on-primary-container)",
    },

    secondary: {
      accent:
        "var(--ui-secondary)",

      onAccent:
        "var(--ui-secondary-contrast)",

      container:
        "var(--ui-secondary-container)",

      onContainer:
        "var(--ui-on-secondary-container)",
    },

    info: {
      accent:
        "var(--ui-info)",

      onAccent:
        "var(--ui-info-contrast)",

      container:
        "var(--ui-info-container)",

      onContainer:
        "var(--ui-on-info-container)",
    },

    success: {
      accent:
        "var(--ui-success)",

      onAccent:
        "var(--ui-success-contrast)",

      container:
        "var(--ui-success-container)",

      onContainer:
        "var(--ui-on-success-container)",
    },

    warning: {
      accent:
        "var(--ui-warning)",

      onAccent:
        "var(--ui-warning-contrast)",

      container:
        "var(--ui-warning-container)",

      onContainer:
        "var(--ui-on-warning-container)",
    },

    danger: {
      accent:
        "var(--ui-danger)",

      onAccent:
        "var(--ui-danger-contrast)",

      container:
        "var(--ui-danger-container)",

      onContainer:
        "var(--ui-on-danger-container)",
    },
  };


export function toneRecipe({
  tone,
  emphasis = "container",
}: ToneRecipeOptions): ToneRecipeStyle {
  const tokens =
    TONE_TOKENS[
      tone
    ];


  if (
    emphasis ===
    "solid"
  ) {
    return {
      background:
        tokens.accent,

      color:
        tokens.onAccent,

      borderColor:
        "transparent",
    };
  }


  if (
    emphasis ===
    "outline"
  ) {
    return {
      background:
        "transparent",

      color:
        tokens.accent,

      borderColor:
        `color-mix(in srgb, ${tokens.accent} 38%, var(--ui-border))`,
    };
  }


  if (
    emphasis ===
    "text"
  ) {
    return {
      background:
        "transparent",

      color:
        tokens.accent,

      borderColor:
        "transparent",
    };
  }


  return {
    background:
      tokens.container,

    color:
      tokens.onContainer,

    borderColor:
      `color-mix(in srgb, ${tokens.accent} 24%, var(--ui-border))`,
  };
}
