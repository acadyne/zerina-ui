// src/primitives/forms/HelpText.tsx
import React from "react";
import { FormControlContext } from "./FormControl";

export interface HelpTextProps
  extends React.HTMLAttributes<HTMLParagraphElement> {
  children?: React.ReactNode;
  style?: React.CSSProperties;
}

export const HelpText = React.forwardRef<HTMLParagraphElement, HelpTextProps>(
  ({ children, className = "", style, ...rest }, ref) => {
    const ctx = React.useContext(FormControlContext);

    if (!children) {
      return null;
    }

    return (
      <p
        ref={ref}
        id={ctx?.helpTextId}
        className={className}
        style={{
          marginTop: "0.35rem",
          fontSize: "var(--ui-font-size-sm)",
          color: "var(--ui-text-muted)",
          lineHeight: 1.35,
          wordBreak: "break-word",
          minWidth: 0,
          ...style,
        }}
        {...rest}
      >
        {children}
      </p>
    );
  }
);

HelpText.displayName = "HelpText";