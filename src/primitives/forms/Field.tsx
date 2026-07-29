import React, {
  useId,
} from "react";

import {
  type SlotPropsMap,
  type SlotStyleMap,
} from "../../helpers/css";

import {
  FormControl,
  type FormControlProps,
} from "./FormControl";

import {
  FormLabel,
} from "./FormLabel";

import {
  HelpText,
} from "./HelpText";

import {
  FormErrorMessage,
} from "./FormErrorMessage";


export type FieldSlot =
  | "root"
  | "label"
  | "helpText"
  | "errorMessage";

export type FieldStyles =
  SlotStyleMap<FieldSlot>;

export type FieldSlotProps =
  SlotPropsMap<FieldSlot>;


export interface FieldProps
  extends Omit<
    FormControlProps,
    | "children"
    | "labelId"
    | "helpTextId"
    | "errorMessageId"
    | "styles"
    | "slotProps"
  > {
  children?: React.ReactNode;

  label?: React.ReactNode;
  helpText?: React.ReactNode;
  error?: React.ReactNode;

  styles?: FieldStyles;
  slotProps?: FieldSlotProps;
}


function hasRenderableNode(
  node: React.ReactNode
): boolean {
  return (
    node !== null &&
    node !== undefined &&
    node !== false &&
    node !== true &&
    node !== ""
  );
}


export const Field =
  React.forwardRef<
    HTMLDivElement,
    FieldProps
  >(
    (
      {
        children,

        id,
        controlId,

        label,
        helpText,
        error,

        disabled = false,
        invalid = false,
        required = false,
        readOnly = false,

        labelAssociation =
          "control",

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

      const resolvedFieldId =
        id ??
        `ui-field-${generatedId}`;

      const resolvedControlId =
        controlId ??
        `${resolvedFieldId}-control`;

      const hasLabel =
        hasRenderableNode(
          label
        );

      const hasHelpText =
        hasRenderableNode(
          helpText
        );

      const hasError =
        hasRenderableNode(
          error
        );

      const resolvedInvalid =
        invalid ||
        hasError;

      const labelId =
        hasLabel
          ? `${resolvedFieldId}-label`
          : undefined;

      const helpTextId =
        hasHelpText
          ? `${resolvedFieldId}-help`
          : undefined;

      const errorMessageId =
        hasError
          ? `${resolvedFieldId}-error`
          : undefined;

      return (
        <FormControl
          {...rest}
          ref={ref}

          id={resolvedFieldId}
          controlId={
            resolvedControlId
          }

          disabled={disabled}
          invalid={
            resolvedInvalid
          }
          required={required}
          readOnly={readOnly}

          labelAssociation={
            labelAssociation
          }

          labelId={labelId}
          helpTextId={
            helpTextId
          }
          errorMessageId={
            errorMessageId
          }

          className={
            className
          }
          style={style}

          styles={{
            root:
              styles?.root,
          }}

          slotProps={{
            root:
              slotProps?.root,
          }}
        >
          {hasLabel ? (
            <FormLabel
              styles={{
                root:
                  styles?.label,
              }}

              slotProps={{
                root:
                  slotProps?.label,
              }}
            >
              {label}
            </FormLabel>
          ) : null}

          {children}

          {hasHelpText ? (
            <HelpText
              styles={{
                root:
                  styles?.helpText,
              }}

              slotProps={{
                root:
                  slotProps?.helpText,
              }}
            >
              {helpText}
            </HelpText>
          ) : null}

          {hasError ? (
            <FormErrorMessage
              styles={{
                root:
                  styles?.errorMessage,
              }}

              slotProps={{
                root:
                  slotProps?.errorMessage,
              }}
            >
              {error}
            </FormErrorMessage>
          ) : null}
        </FormControl>
      );
    }
  );


Field.displayName =
  "Field";
