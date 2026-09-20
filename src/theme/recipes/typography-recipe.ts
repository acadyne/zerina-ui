// src/theme/recipes/typography-recipe.ts

import type React from "react";

import type {
  UITypographyRole,
} from "../contracts/visual-semantics";


export interface TypographyRecipeOptions {
  role?:
    UITypographyRole;
}


export type TypographyRecipeStyle =
  Pick<
    React.CSSProperties,
    | "fontFamily"
    | "fontSize"
    | "fontWeight"
    | "lineHeight"
    | "letterSpacing"
  >;


interface TypographyRoleTokens {
  fontFamily:
    string;

  fontSize:
    string;

  fontWeight:
    string;

  lineHeight:
    string;

  letterSpacing:
    string;
}


const TYPOGRAPHY_ROLE_TOKENS:
  Record<
    UITypographyRole,
    TypographyRoleTokens
  > = {
    display: {
      fontFamily:
        "var(--ui-type-display-font-family)",

      fontSize:
        "var(--ui-type-display-font-size)",

      fontWeight:
        "var(--ui-type-display-font-weight)",

      lineHeight:
        "var(--ui-type-display-line-height)",

      letterSpacing:
        "var(--ui-type-display-letter-spacing)",
    },

    headline: {
      fontFamily:
        "var(--ui-type-headline-font-family)",

      fontSize:
        "var(--ui-type-headline-font-size)",

      fontWeight:
        "var(--ui-type-headline-font-weight)",

      lineHeight:
        "var(--ui-type-headline-line-height)",

      letterSpacing:
        "var(--ui-type-headline-letter-spacing)",
    },

    title: {
      fontFamily:
        "var(--ui-type-title-font-family)",

      fontSize:
        "var(--ui-type-title-font-size)",

      fontWeight:
        "var(--ui-type-title-font-weight)",

      lineHeight:
        "var(--ui-type-title-line-height)",

      letterSpacing:
        "var(--ui-type-title-letter-spacing)",
    },

    body: {
      fontFamily:
        "var(--ui-type-body-font-family)",

      fontSize:
        "var(--ui-type-body-font-size)",

      fontWeight:
        "var(--ui-type-body-font-weight)",

      lineHeight:
        "var(--ui-type-body-line-height)",

      letterSpacing:
        "var(--ui-type-body-letter-spacing)",
    },

    label: {
      fontFamily:
        "var(--ui-type-label-font-family)",

      fontSize:
        "var(--ui-type-label-font-size)",

      fontWeight:
        "var(--ui-type-label-font-weight)",

      lineHeight:
        "var(--ui-type-label-line-height)",

      letterSpacing:
        "var(--ui-type-label-letter-spacing)",
    },

    caption: {
      fontFamily:
        "var(--ui-type-caption-font-family)",

      fontSize:
        "var(--ui-type-caption-font-size)",

      fontWeight:
        "var(--ui-type-caption-font-weight)",

      lineHeight:
        "var(--ui-type-caption-line-height)",

      letterSpacing:
        "var(--ui-type-caption-letter-spacing)",
    },
  };


export function typographyRecipe({
  role = "body",
}: TypographyRecipeOptions = {}): TypographyRecipeStyle {
  return {
    ...TYPOGRAPHY_ROLE_TOKENS[
      role
    ],
  };
}
