// src/components/display/Divider.tsx
import React from "react";

export interface DividerProps extends React.HTMLAttributes<HTMLHRElement> {
  orientation?: "horizontal" | "vertical";
  color?: React.CSSProperties["borderColor"];
  thickness?: number | string;
  length?: number | string;
  spacing?: number | string;
  style?: React.CSSProperties;
}

export const Divider = React.forwardRef<HTMLHRElement, DividerProps>(
  (
    {
      orientation = "horizontal",
      color = "var(--ui-border)",
      thickness = "1px",
      length,
      spacing,
      style,
      ...rest
    },
    ref
  ) => {
    const isVertical = orientation === "vertical";

    return (
      <hr
        ref={ref}
        aria-orientation={orientation}
        style={{
          border: "none",
          margin: 0,
          flexShrink: 0,
          alignSelf: "stretch",
          backgroundColor: color,
          ...(isVertical
            ? {
                width: thickness,
                height: length ?? "auto",
                minHeight: length ?? "1.25rem",
                marginLeft: spacing,
                marginRight: spacing,
              }
            : {
                height: thickness,
                width: length ?? "100%",
                marginTop: spacing,
                marginBottom: spacing,
              }),
          ...style,
        }}
        {...rest}
      />
    );
  }
);

Divider.displayName = "Divider";