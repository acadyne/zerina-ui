import React, {
  useContext,
} from "react";

import {
  hasRenderableNode,
} from "../../core/react/nodePresence";

import {
  resolveSlot,
  type SlotPropsMap,
  type SlotStyleMap,
} from "../../helpers/css";

import {
  typographyRecipe,
} from "../../theme/recipes";

import {
  FieldContext,
} from "./field-context";


export type FieldMessageSlot =
  "root";

export type FieldMessageStyles =
  SlotStyleMap<FieldMessageSlot>;

export type FieldMessageSlotProps =
  SlotPropsMap<FieldMessageSlot>;


export interface FieldMessageFrameProps
  extends React.HTMLAttributes<HTMLParagraphElement> {
  kind:
    | "help"
    | "error";

  children?:
    React.ReactNode;

  styles?:
    FieldMessageStyles;

  slotProps?:
    FieldMessageSlotProps;
}


export const FieldMessageFrame =
  React.forwardRef<
    HTMLParagraphElement,
    FieldMessageFrameProps
  >(
    (
      {
        kind,
        children,
        id,
        role,

        className = "",
        style,

        styles,
        slotProps,

        ...rest
      },
      ref
    ) => {
      const field =
        useContext(
          FieldContext
        );


      if (
        !hasRenderableNode(
          children,
        )
      ) {
        return null;
      }


      if (
        kind ===
          "error" &&
        field &&
        !field.invalid
      ) {
        return null;
      }


      const isError =
        kind ===
        "error";


      const rootSlot =
        resolveSlot<FieldMessageSlot>({
          slot:
            "root",

          styles,
          slotProps,

          className,
          style,

          baseStyle: {
            marginTop:
              "0.35rem",

            ...typographyRecipe({
              role:
                "caption",
            }),

            color:
              isError
                ? "var(--ui-danger)"
                : "var(--ui-text-muted)",

            wordBreak:
              "break-word",

            minWidth:
              0,
          },
        });


      return (
        <p
          {...rest}
          {...rootSlot}
          ref={ref}

          id={
            (
              isError
                ? field?.errorMessageId
                : field?.helpTextId
            ) ??
            id
          }

          role={
            role ??
            (
              isError
                ? "alert"
                : undefined
            )
          }
        >
          {children}
        </p>
      );
    }
  );


FieldMessageFrame.displayName =
  "FieldMessageFrame";
