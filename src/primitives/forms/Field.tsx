// src/primitives/forms/Field.tsx
import React from "react";
import {
  type SlotPropsMap,
  type SlotStyleMap,
} from "../../helpers/css";
import { FormControl, type FormControlProps } from "./FormControl";
import { FormLabel } from "./FormLabel";
import { HelpText } from "./HelpText";
import { FormErrorMessage } from "./FormErrorMessage";

export type FieldSlot = "root" | "label" | "helpText" | "errorMessage";

export type FieldStyles = SlotStyleMap<FieldSlot>;

export type FieldSlotProps = SlotPropsMap<FieldSlot>;

export interface FieldProps
  extends Omit<
    FormControlProps,
    | "children"
    | "isInvalid"
    | "isRequired"
    | "isDisabled"
    | "styles"
    | "slotProps"
  > {
  children?: React.ReactNode;
  label?: React.ReactNode;
  helpText?: React.ReactNode;
  error?: React.ReactNode;
  isInvalid?: boolean;
  isRequired?: boolean;
  isDisabled?: boolean;

  styles?: FieldStyles;
  slotProps?: FieldSlotProps;
}

export const Field = React.forwardRef<HTMLDivElement, FieldProps>(
  (
    {
      children,
      label,
      helpText,
      error,
      isInvalid,
      isRequired,
      isDisabled,
      className = "",
      style,
      styles,
      slotProps,
      ...rest
    },
    ref
  ) => {
    const invalid = isInvalid ?? Boolean(error);

    return (
      <FormControl
        ref={ref}
        isInvalid={invalid}
        isRequired={isRequired}
        isDisabled={isDisabled}
        className={className}
        style={style}
        styles={{
          root: styles?.root,
        }}
        slotProps={{
          root: slotProps?.root,
        }}
        {...rest}
      >
        {label ? (
          <FormLabel
            styles={{
              root: styles?.label,
            }}
            slotProps={{
              root: slotProps?.label,
            }}
          >
            {label}
          </FormLabel>
        ) : null}

        {children}

        {helpText ? (
          <HelpText
            styles={{
              root: styles?.helpText,
            }}
            slotProps={{
              root: slotProps?.helpText,
            }}
          >
            {helpText}
          </HelpText>
        ) : null}

        {error ? (
          <FormErrorMessage
            styles={{
              root: styles?.errorMessage,
            }}
            slotProps={{
              root: slotProps?.errorMessage,
            }}
          >
            {error}
          </FormErrorMessage>
        ) : null}
      </FormControl>
    );
  }
);

Field.displayName = "Field";