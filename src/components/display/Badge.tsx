// src/components/display/Badge.tsx
import React from "react";

import {
  resolveSlot,
  type SlotPropsMap,
  type SlotStyleMap,
} from "../../helpers/css";

import {
  statusLabelRecipe,
  type StatusLabelColorScheme,
  type StatusLabelRecipeSlot,
  type StatusLabelVariant,
} from "./status-label-recipe";


export type BadgeSlot =
  StatusLabelRecipeSlot;


export type BadgeStyles =
  SlotStyleMap<BadgeSlot>;


export type BadgeSlotProps =
  SlotPropsMap<BadgeSlot>;


export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement> {
  children?:
    React.ReactNode;

  variant?:
    StatusLabelVariant;

  colorScheme?:
    StatusLabelColorScheme;

  rounded?:
    React.CSSProperties["borderRadius"];

  className?:
    string;

  style?:
    React.CSSProperties;

  styles?:
    BadgeStyles;

  slotProps?:
    BadgeSlotProps;
}


export const Badge =
  React.forwardRef<
    HTMLSpanElement,
    BadgeProps
  >(
    (
      {
        children,

        variant =
          "subtle",

        colorScheme =
          "neutral",

        rounded =
          "var(--ui-radius-full)",

        className =
          "",

        style,

        styles,
        slotProps,

        ...rest
      },
      ref,
    ) => {
      const recipeStyles =
        statusLabelRecipe({
          variant,
          colorScheme,
        });


      const rootSlot =
        resolveSlot<BadgeSlot>({
          slot:
            "root",

          styles,
          slotProps,

          className,
          style,

          baseProps: {
            "data-ui-badge":
              "",

            "data-ui-badge-variant":
              variant,

            "data-ui-badge-color-scheme":
              colorScheme,
          },

          baseStyle: {
            ...recipeStyles.root,

            minHeight:
              22,

            padding:
              "0.2rem 0.55rem",

            fontSize:
              "0.75rem",

            fontWeight:
              700,

            borderRadius:
              rounded,

            letterSpacing:
              "0.02em",
          },
        });


      const contentSlot =
        resolveSlot<BadgeSlot>({
          slot:
            "content",

          styles,
          slotProps,

          baseStyle:
            recipeStyles.content,
        });


      return (
        <span
          {...rootSlot}
          ref={ref}
          {...rest}
        >
          <span
            {...contentSlot}
          >
            {children}
          </span>
        </span>
      );
    },
  );


Badge.displayName =
  "Badge";
