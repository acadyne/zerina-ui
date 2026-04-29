// src/primitives/forms/FormErrorMessage.tsx
import React, { useContext } from "react";
import { FormControlContext } from "./FormControl";

export interface FormErrorMessageProps
  extends React.HTMLAttributes<HTMLParagraphElement> {
  children?: React.ReactNode;
  style?: React.CSSProperties;
}

export const FormErrorMessage: React.FC<FormErrorMessageProps> = ({
  children,
  className = "",
  style,
  ...rest
}) => {
  const ctx = useContext(FormControlContext);

  if (!children) {
    return null;
  }

  const show = ctx ? ctx.isInvalid : true;
  if (!show) {
    return null;
  }

  return (
    <p
      id={ctx?.errorId}
      className={className}
      role="alert"
      style={{
        marginTop: "0.35rem",
        fontSize: "var(--ui-font-size-sm)",
        color: "var(--ui-danger)",
        lineHeight: 1.25,
        wordBreak: "break-word",
        minWidth: 0,
        ...style,
      }}
      {...rest}
    >
      {children}
    </p>
  );
};