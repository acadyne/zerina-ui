// src/primitives/forms/FormLabel.tsx
import React, { useContext, useMemo } from "react";
import {
  resolveSlot,
  type SlotPropsMap,
  type SlotStyleMap,
} from "../../helpers/css";
import { FormControlContext } from "./FormControl";

export type FormLabelSlot = "root" | "requiredIndicator";

export type FormLabelStyles = SlotStyleMap<FormLabelSlot>;

export type FormLabelSlotProps = SlotPropsMap<FormLabelSlot>;

export interface FormLabelProps
  extends React.LabelHTMLAttributes<HTMLLabelElement> {
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  htmlFor?: string;

  styles?: FormLabelStyles;
  slotProps?: FormLabelSlotProps;
}

export const FormLabel = React.forwardRef<HTMLLabelElement, FormLabelProps>(
  (
    {
      children,
      className = "",
      style,
      htmlFor,
      styles,
      slotProps,
      ...rest
    },
    ref
  ) => {
    const ctx = useContext(FormControlContext);

    const computedHtmlFor = useMemo(() => {
      return htmlFor ?? ctx?.id;
    }, [htmlFor, ctx?.id]);

    const required = Boolean(ctx?.isRequired);
    const disabled = Boolean(ctx?.isDisabled);

    const rootSlot = resolveSlot<FormLabelSlot>({
      slot: "root",
      styles,
      slotProps,
      className,
      style,
      baseStyle: {
        display: "block",
        marginBottom: "0.35rem",
        fontSize: "var(--ui-font-size-sm)",
        fontWeight: 650,
        color: "var(--ui-text)",
        opacity: disabled ? 0.85 : 1,
        lineHeight: 1.2,
      },
    });

    const requiredIndicatorSlot = resolveSlot<FormLabelSlot>({
      slot: "requiredIndicator",
      styles,
      slotProps,
      baseProps: {
        "aria-hidden": true,
      },
      baseStyle: {
        marginLeft: 6,
        color: "var(--ui-danger)",
      },
    });

    return (
      <label
        {...rootSlot}
        ref={ref}
        id={ctx?.labelId}
        htmlFor={computedHtmlFor}
        {...rest}
      >
        {children}
        {required ? <span {...requiredIndicatorSlot}>*</span> : null}
      </label>
    );
  }
);

FormLabel.displayName = "FormLabel";