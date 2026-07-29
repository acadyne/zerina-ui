import React, {
  useContext,
  useId,
  useMemo,
} from "react";

import {
  resolveSlot,
  type SlotPropsMap,
  type SlotStyleMap,
} from "../../helpers/css";

import {
  FieldContext,
  type FieldContextValue,
  type FieldLabelAssociation,
} from "./field-context";

import {
  resolveFieldState,
} from "./field-semantics";


export type {
  FieldLabelAssociation,
} from "./field-context";


export type FormControlSlot = "root";

export type FormControlStyles =
  SlotStyleMap<FormControlSlot>;

export type FormControlSlotProps =
  SlotPropsMap<FormControlSlot>;


export interface FormControlProps
  extends Omit<
    React.HTMLAttributes<HTMLDivElement>,
    "id"
  > {
  children?: React.ReactNode;

  /** ID del contenedor semántico. */
  id?: string;

  /** ID del control singular o grupo asociado. */
  controlId?: string;

  disabled?: boolean;
  invalid?: boolean;
  required?: boolean;
  readOnly?: boolean;

  labelAssociation?:
    FieldLabelAssociation;

  labelId?: string;
  helpTextId?: string;
  errorMessageId?: string;

  className?: string;
  style?: React.CSSProperties;

  styles?: FormControlStyles;
  slotProps?: FormControlSlotProps;
}


export const FormControl =
  React.forwardRef<
    HTMLDivElement,
    FormControlProps
  >(
    (
      {
        children,

        id,
        controlId,

        disabled = false,
        invalid = false,
        required = false,
        readOnly = false,

        labelAssociation =
          "control",

        labelId,
        helpTextId,
        errorMessageId,

        className = "",
        style,

        styles,
        slotProps,

        ...rest
      },
      ref
    ) => {
      const generatedId =
        useId();

      const parent =
        useContext(
          FieldContext
        );

      const resolvedFieldId =
        id ??
        `ui-field-${generatedId}`;

      const resolvedControlId =
        controlId ??
        `${resolvedFieldId}-control`;

      const state =
        resolveFieldState(
          parent,
          {
            disabled,
            invalid,
            required,
            readOnly,
          }
        );

      const contextValue =
        useMemo<FieldContextValue>(
          () => ({
            ...state,

            fieldId:
              resolvedFieldId,

            controlId:
              resolvedControlId,

            labelId,
            helpTextId,
            errorMessageId,

            labelAssociation,
          }),
          [
            state.disabled,
            state.invalid,
            state.required,
            state.readOnly,

            resolvedFieldId,
            resolvedControlId,

            labelId,
            helpTextId,
            errorMessageId,

            labelAssociation,
          ]
        );

      const rootSlot =
        resolveSlot<FormControlSlot>({
          slot:
            "root",

          styles,
          slotProps,

          className,
          style,

          baseProps: {
            id:
              resolvedFieldId,

            "data-ui":
              "form-control",

            "data-invalid":
              state.invalid ||
              undefined,

            "data-required":
              state.required ||
              undefined,

            "data-disabled":
              state.disabled ||
              undefined,

            "data-readonly":
              state.readOnly ||
              undefined,
          },

          baseStyle: {
            width:
              "100%",

            display:
              "block",

            minWidth:
              0,
          },
        });

      return (
        <FieldContext.Provider
          value={contextValue}
        >
          <div
            {...rest}
            {...rootSlot}
            ref={ref}
          >
            {children}
          </div>
        </FieldContext.Provider>
      );
    }
  );


FormControl.displayName =
  "FormControl";
