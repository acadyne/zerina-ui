// src/primitives/forms/FormControl.tsx
import React, { createContext, useId, useMemo } from "react";

export type FormControlContextValue = {
  id: string;
  isInvalid: boolean;
  isRequired: boolean;
  isDisabled: boolean;
  labelId: string;
  helpTextId: string;
  errorId: string;
};

export const FormControlContext =
  createContext<FormControlContextValue | null>(null);

export interface FormControlProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  id?: string;
  isInvalid?: boolean;
  isRequired?: boolean;
  isDisabled?: boolean;
  style?: React.CSSProperties;
}

export const FormControl = React.forwardRef<HTMLDivElement, FormControlProps>(
  (
    {
      children,
      id,
      isInvalid = false,
      isRequired = false,
      isDisabled = false,
      className = "",
      style,
      ...rest
    },
    ref
  ) => {
    const autoId = useId();
    const baseId = id ?? `fc-${autoId}`;

    const ctx = useMemo<FormControlContextValue>(
      () => ({
        id: baseId,
        isInvalid,
        isRequired,
        isDisabled,
        labelId: `${baseId}-label`,
        helpTextId: `${baseId}-help`,
        errorId: `${baseId}-error`,
      }),
      [baseId, isInvalid, isRequired, isDisabled]
    );

    return (
      <FormControlContext.Provider value={ctx}>
        <div
          ref={ref}
          className={className}
          style={{
            width: "100%",
            display: "block",
            minWidth: 0,
            marginBottom: "1rem",
            opacity: isDisabled ? 0.7 : 1,
            ...style,
          }}
          {...rest}
        >
          {children}
        </div>
      </FormControlContext.Provider>
    );
  }
);

FormControl.displayName = "FormControl";