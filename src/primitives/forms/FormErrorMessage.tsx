import React, {
  useContext,
} from "react";

import {
  resolveSlot,
  type SlotPropsMap,
  type SlotStyleMap,
} from "../../helpers/css";

import {
  FieldContext,
} from "./field-context";


export type FormErrorMessageSlot =
  "root";

export type FormErrorMessageStyles =
  SlotStyleMap<FormErrorMessageSlot>;

export type FormErrorMessageSlotProps =
  SlotPropsMap<FormErrorMessageSlot>;


export interface FormErrorMessageProps
  extends React.HTMLAttributes<HTMLParagraphElement> {
  children?: React.ReactNode;

  className?: string;
  style?: React.CSSProperties;

  styles?: FormErrorMessageStyles;
  slotProps?: FormErrorMessageSlotProps;
}


export const FormErrorMessage =
  React.forwardRef<
    HTMLParagraphElement,
    FormErrorMessageProps
  >(
    (
      {
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
        children === null ||
        children === undefined ||
        children === false ||
        children === true
      ) {
        return null;
      }

      if (
        field &&
        !field.invalid
      ) {
        return null;
      }

      const rootSlot =
        resolveSlot<FormErrorMessageSlot>({
          slot:
            "root",

          styles,
          slotProps,

          className,
          style,

          baseStyle: {
            marginTop:
              "0.35rem",

            fontSize:
              "var(--ui-font-size-sm)",

            color:
              "var(--ui-danger)",

            lineHeight:
              1.25,

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
            field?.errorMessageId ??
            id
          }

          role={
            role ??
            "alert"
          }
        >
          {children}
        </p>
      );
    }
  );


FormErrorMessage.displayName =
  "FormErrorMessage";
