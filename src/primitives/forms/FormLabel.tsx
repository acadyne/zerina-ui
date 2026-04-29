// src/primitives/forms/FormLabel.tsx
import React, { useContext, useMemo } from "react";
import { FormControlContext } from "./FormControl";

export interface FormLabelProps
  extends React.LabelHTMLAttributes<HTMLLabelElement> {
  children?: React.ReactNode;
  style?: React.CSSProperties;
  htmlFor?: string;
}

export const FormLabel: React.FC<FormLabelProps> = ({
  children,
  className = "",
  style,
  htmlFor,
  ...rest
}) => {
  const ctx = useContext(FormControlContext);

  const computedHtmlFor = useMemo(() => {
    return htmlFor ?? ctx?.id;
  }, [htmlFor, ctx?.id]);

  const required = !!ctx?.isRequired;
  const disabled = !!ctx?.isDisabled;

  return (
    <label
      id={ctx?.labelId}
      htmlFor={computedHtmlFor}
      className={className}
      style={{
        display: "block",
        marginBottom: "0.35rem",
        fontSize: "var(--ui-font-size-sm)",
        fontWeight: 650,
        color: "var(--ui-text)",
        opacity: disabled ? 0.85 : 1,
        lineHeight: 1.2,
        ...style,
      }}
      {...rest}
    >
      {children}
      {required ? (
        <span
          aria-hidden="true"
          style={{ marginLeft: 6, color: "var(--ui-danger)" }}
        >
          *
        </span>
      ) : null}
    </label>
  );
};