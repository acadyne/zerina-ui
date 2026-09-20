// src/primitives/overlay/menu/menu.recipe.ts

import {
  defineSlotRecipe,
} from "../../../helpers/css";

import {
  typographyRecipe,
} from "../../../theme/recipes";

import type {
  MenuSlot,
} from "./menu.types";


export type MenuRecipeVariants =
  Record<never, never>;


export type MenuRecipeState = {
  transformOrigin?:
    React.CSSProperties["transformOrigin"];
};


export const menuRecipe =
  defineSlotRecipe<
    MenuSlot,
    MenuRecipeVariants,
    MenuRecipeState
  >({
    base: {
      content: {
        minWidth: 180,

        maxWidth:
          "min(320px, calc(100vw - 16px))",

        padding:
          "var(--ui-density-inline-gap, var(--ui-space-sm))",

        borderRadius:
          "var(--ui-radius-lg)",

        border:
          "1px solid var(--ui-border)",

        background:
          "var(--ui-surface)",

        color:
          "var(--ui-text)",

        boxShadow:
          "var(--ui-elevation-4)",

        outline:
          "none",
      },


      item: {
        ...typographyRecipe({
          role:
            "label",
        }),

        display:
          "flex",

        alignItems:
          "center",

        minHeight:
          "var(--ui-density-item-min-height, 2.75rem)",

        paddingBlock:
          "var(--ui-density-inline-gap, var(--ui-space-sm))",

        paddingInline:
          "var(--ui-density-content-padding, var(--ui-space-lg))",

        borderRadius:
          "var(--ui-radius-md)",

        userSelect:
          "none",
      },


      separator: {
        height:
          1,

        margin:
          "0.35rem 0",

        background:
          "var(--ui-border)",
      },


      label: {
        ...typographyRecipe({
          role:
            "caption",
        }),

        paddingBlock:
          "var(--ui-space-sm)",

        paddingInline:
          "var(--ui-density-content-padding, var(--ui-space-lg))",

        color:
          "var(--ui-text-muted)",
      },
    },


    resolve: ({
      transformOrigin,
    }) => ({
      content: {
        transformOrigin,
      },
    }),
  });


export const DEFAULT_MENU_RECIPE_STYLES =
  menuRecipe({});