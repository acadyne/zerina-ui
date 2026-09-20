import React, {
  useContext,
} from "react";

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


export type FormLabelSlot =
  | "root"
  | "requiredIndicator";

export type FormLabelStyles =
  SlotStyleMap<FormLabelSlot>;

export type FormLabelSlotProps =
  SlotPropsMap<FormLabelSlot>;


export interface FormLabelProps
  extends React.LabelHTMLAttributes<HTMLLabelElement> {
  children?: React.ReactNode;

  className?: string;
  style?: React.CSSProperties;

  styles?: FormLabelStyles;
  slotProps?: FormLabelSlotProps;
}


export const FormLabel =
  React.forwardRef<
    HTMLLabelElement,
    FormLabelProps
  >(
    (
      {
        children,

        id,
        htmlFor,

        className = "",
        style,

        styles,
        slotProps,

        ...rest
      },
      ref
    ) => {
      // FormControl owns field state. FormLabel reads semantic
      // associations while CSS consumes the ancestor data attributes.
      const field =
        useContext(
          FieldContext
        );

      const resolvedId =
        field?.labelId ??
        id;

      const resolvedHtmlFor =
        htmlFor ??
        (
          field?.labelAssociation ===
            "control"
            ? field.controlId
            : undefined
        );

      const rootSlot =
        resolveSlot<FormLabelSlot>({
          slot:
            "root",

          styles,
          slotProps,

          className,
          style,

          baseProps: {
            "data-ui-form-label":
              "",
          },

          baseStyle: {
            display:
              "block",

            marginBottom:
              "0.35rem",

            ...typographyRecipe({
              role:
                "label",
            }),

            color:
              "var(--ui-text)",
          },
        });

      const requiredIndicatorSlot =
        resolveSlot<FormLabelSlot>({
          slot:
            "requiredIndicator",

          styles,
          slotProps,

          baseProps: {
            "aria-hidden":
              true,
          },

          baseStyle: {
            marginLeft:
              6,

            color:
              "var(--ui-danger)",
          },
        });

      return (
        <label
          {...rest}
          {...rootSlot}
          ref={ref}

          id={resolvedId}
          htmlFor={
            resolvedHtmlFor
          }
        >
          {children}

          {field?.required ? (
            <span
              {...requiredIndicatorSlot}
            >
              *
            </span>
          ) : null}
        </label>
      );
    }
  );


FormLabel.displayName =
  "FormLabel";
