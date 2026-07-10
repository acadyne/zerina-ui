// src/primitives/forms/FormErrorMessage.tsx
import React, { useContext } from "react";
import {
  resolveSlot,
  type SlotPropsMap,
  type SlotStyleMap,
} from "../../helpers/css";
import { FormControlContext } from "./FormControl";

export type FormErrorMessageSlot = "root";

export type FormErrorMessageStyles = SlotStyleMap<FormErrorMessageSlot>;

export type FormErrorMessageSlotProps = SlotPropsMap<FormErrorMessageSlot>;

export interface FormErrorMessageProps
  extends React.HTMLAttributes<HTMLParagraphElement> {
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;

  styles?: FormErrorMessageStyles;
  slotProps?: FormErrorMessageSlotProps;
}

export const FormErrorMessage = React.forwardRef<
  HTMLParagraphElement,
  FormErrorMessageProps
>(
  (
    {
      children,
      className = "",
      style,
      styles,
      slotProps,
      ...rest
    },
    ref
  ) => {
    const ctx = useContext(FormControlContext);

    if (!children) {
      return null;
    }

    const show = ctx ? ctx.isInvalid : true;
    if (!show) {
      return null;
    }

    const rootSlot = resolveSlot<FormErrorMessageSlot>({
      slot: "root",
      styles,
      slotProps,
      className,
      style,
      baseStyle: {
        marginTop: "0.35rem",
        fontSize: "var(--ui-font-size-sm)",
        color: "var(--ui-danger)",
        lineHeight: 1.25,
        wordBreak: "break-word",
        minWidth: 0,
      },
    });

    return (
      <p
        {...rootSlot}
        ref={ref}
        id={ctx?.errorId}
        role="alert"
        {...rest}
      >
        {children}
      </p>
    );
  }
);

FormErrorMessage.displayName = "FormErrorMessage";