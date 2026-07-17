// src/primitives/overlay/menu/menu.recipe.ts

import {
  defineSlotRecipe,
} from "../../../helpers/css";

import type {
  MenuSlot,
} from "./menu.types";


export type MenuRecipeVariants =
  Record<never, never>;


export type MenuRecipeState = {
  transformOrigin?:
    React.CSSProperties["transformOrigin"];

  hovered?: boolean;

  pressed?: boolean;

  focusVisible?: boolean;

  disabled?: boolean;
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

        padding: "0.4rem",

        borderRadius:
          "var(--ui-radius-lg)",

        border:
          "1px solid var(--ui-border)",

        background:
          "var(--ui-surface)",

        color:
          "var(--ui-text)",

        boxShadow:
          "var(--ui-shadow-lg)",

        outline:
          "none",
      },


      item: {
        display:
          "flex",

        alignItems:
          "center",

        minHeight:
          36,

        padding:
          "0.6rem 0.75rem",

        borderRadius:
          "var(--ui-radius-md)",

        userSelect:
          "none",

        outline:
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
        padding:
          "0.45rem 0.75rem 0.35rem 0.75rem",

        fontSize:
          "var(--ui-font-size-sm)",

        fontWeight:
          700,

        color:
          "var(--ui-text-muted)",
      },
    },


    resolve: ({
      transformOrigin,

      hovered = false,

      pressed = false,

      focusVisible = false,

      disabled = false,
    }) => ({
      content: {
        transformOrigin,
      },


      item: {
        background:
          !disabled &&
          (pressed || hovered)
            ? "var(--ui-surface-hover)"
            : "transparent",


        cursor:
          disabled
            ? "not-allowed"
            : "pointer",


        opacity:
          disabled
            ? 0.55
            : 1,


        boxShadow:
          focusVisible
            ? "0 0 0 3px var(--ui-interaction-focus-ring)"
            : "none",
      },
    }),
  });


export const DEFAULT_MENU_RECIPE_STYLES =
  menuRecipe({});