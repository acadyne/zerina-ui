// src/primitives/typography/Typography.tsx
import React, { forwardRef } from "react";

export interface TypographyProps extends React.HTMLAttributes<HTMLElement> {
  as?: React.ElementType;
  children?: React.ReactNode;
  className?: string;

  size?: "xs" | "sm" | "md" | "lg" | "xl";
  weight?: React.CSSProperties["fontWeight"];
  color?: React.CSSProperties["color"];
  align?: React.CSSProperties["textAlign"];
  leading?: React.CSSProperties["lineHeight"];
  tracking?: React.CSSProperties["letterSpacing"];

  m?: React.CSSProperties["margin"];
  mt?: React.CSSProperties["marginTop"];
  mb?: React.CSSProperties["marginBottom"];
  ml?: React.CSSProperties["marginLeft"];
  mr?: React.CSSProperties["marginRight"];

  p?: React.CSSProperties["padding"];
  pt?: React.CSSProperties["paddingTop"];
  pb?: React.CSSProperties["paddingBottom"];
  pl?: React.CSSProperties["paddingLeft"];
  pr?: React.CSSProperties["paddingRight"];

  style?: React.CSSProperties;
}

const sizeMap: Record<NonNullable<TypographyProps["size"]>, string> = {
  xs: "var(--ui-font-size-xs)",
  sm: "var(--ui-font-size-sm)",
  md: "var(--ui-font-size-md)",
  lg: "var(--ui-font-size-lg)",
  xl: "var(--ui-font-size-xl)",
};

export const Typography = forwardRef<HTMLElement, TypographyProps>(
  (
    {
      as: Comp = "p",
      children,
      className = "",
      size = "md",
      weight,
      color = "var(--ui-text)",
      align,
      leading = 1.5,
      tracking,

      m,
      mt,
      mb,
      ml,
      mr,

      p,
      pt,
      pb,
      pl,
      pr,

      style,
      ...rest
    },
    ref
  ) => {
    return (
      <Comp
        ref={ref as any}
        className={className}
        style={{
          fontSize: sizeMap[size],
          fontWeight: weight,
          color,
          textAlign: align,
          lineHeight: leading,
          letterSpacing: tracking,
          minWidth: 0,

          margin: m,
          marginTop: mt,
          marginBottom: mb,
          marginLeft: ml,
          marginRight: mr,

          padding: p,
          paddingTop: pt,
          paddingBottom: pb,
          paddingLeft: pl,
          paddingRight: pr,

          ...style,
        }}
        {...rest}
      >
        {children}
      </Comp>
    );
  }
);

Typography.displayName = "Typography";