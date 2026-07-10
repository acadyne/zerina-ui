// src/primitives/forms/FormControl.tsx
import React, { createContext, useId, useMemo } from "react";
import {
  resolveSlot,
  type SlotPropsMap,
  type SlotStyleMap,
} from "../../helpers/css";

export type FormControlSlot = "root";

export type FormControlStyles = SlotStyleMap<FormControlSlot>;

export type FormControlSlotProps = SlotPropsMap<FormControlSlot>;

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
  className?: string;
  style?: React.CSSProperties;

  styles?: FormControlStyles;
  slotProps?: FormControlSlotProps;
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
      styles,
      slotProps,
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

    const rootSlot = resolveSlot<FormControlSlot>({
      slot: "root",
      styles,
      slotProps,
      className,
      style,
      baseProps: {
        "data-ui": "form-control",
        "data-invalid": isInvalid || undefined,
        "data-required": isRequired || undefined,
        "data-disabled": isDisabled || undefined,
      },
      baseStyle: {
        width: "100%",
        display: "block",
        minWidth: 0,
        marginBottom: "1rem",
        opacity: isDisabled ? 0.7 : 1,
      },
    });

    return (
      <FormControlContext.Provider value={ctx}>
        <div {...rootSlot} ref={ref} {...rest}>
          {children}
        </div>
      </FormControlContext.Provider>
    );
  }
);

FormControl.displayName = "FormControl";