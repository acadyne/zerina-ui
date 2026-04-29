// src/primitives/forms/Field.tsx
import React from "react";
import { FormControl, type FormControlProps } from "./FormControl";
import { FormLabel } from "./FormLabel";
import { HelpText } from "./HelpText";
import { FormErrorMessage } from "./FormErrorMessage";

export interface FieldProps
  extends Omit<
    FormControlProps,
    "children" | "isInvalid" | "isRequired" | "isDisabled"
  > {
  children?: React.ReactNode;
  label?: React.ReactNode;
  helpText?: React.ReactNode;
  error?: React.ReactNode;
  isInvalid?: boolean;
  isRequired?: boolean;
  isDisabled?: boolean;
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
      style,
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
        style={style}
        {...rest}
      >
        {label ? <FormLabel>{label}</FormLabel> : null}
        {children}
        {helpText ? <HelpText>{helpText}</HelpText> : null}
        {error ? <FormErrorMessage>{error}</FormErrorMessage> : null}
      </FormControl>
    );
  }
);

Field.displayName = "Field";