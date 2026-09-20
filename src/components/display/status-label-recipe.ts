import type React from "react";

import {
  defineSlotRecipe,
} from "../../helpers/css";

import {
  toneRecipe,
} from "../../theme/recipes";

import type {
  UITone,
} from "../../theme/contracts/visual-semantics";


export type StatusLabelVariant =
  | "solid"
  | "subtle"
  | "outline";


export type StatusLabelColorScheme =
  Exclude<
    UITone,
    "info"
  >;


export type StatusLabelRecipeSlot =
  | "root"
  | "content";


function getStatusLabelVariantStyle(
  variant:
    StatusLabelVariant,

  colorScheme:
    StatusLabelColorScheme,
): React.CSSProperties {
  const tone =
    toneRecipe({
      tone:
        colorScheme,
      emphasis:
        variant === "solid"
          ? "solid"
          : variant === "outline"
            ? "outline"
            : "container",
    });


  if (
    variant ===
    "outline"
  ) {
    return {
      ...tone,

      border:
        `1px solid ${tone.borderColor}`,
    };
  }


  return {
    ...tone,

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
