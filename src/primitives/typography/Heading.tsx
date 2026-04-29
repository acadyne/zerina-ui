// src/primitives/typography/Heading.tsx
import React, { forwardRef } from "react";

export interface HeadingProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "color"> {
  children?: React.ReactNode;

  as?: React.ElementType;
  size?: "sm" | "md" | "lg" | "xl" | "2xl";
  align?: React.CSSProperties["textAlign"];

  w?: React.CSSProperties["width"];
  maxW?: React.CSSProperties["maxWidth"];

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

  color?: React.CSSProperties["color"];
  weight?: React.CSSProperties["fontWeight"];
  leading?: React.CSSProperties["lineHeight"];
  tracking?: React.CSSProperties["letterSpacing"];

  style?: React.CSSProperties;
  className?: string;
}

const fontSizeMap: Record<NonNullable<HeadingProps["size"]>, string> = {
  sm: "1.125rem",
  md: "1.25rem",
  lg: "1.5rem",
  xl: "1.875rem",
  "2xl": "2.25rem",
};

export const Heading = forwardRef<HTMLElement, HeadingProps>(
  (
    {
      children,
      as: Tag = "h2",
      size = "lg",
      align = "left",
      className = "",
      style,

      w,
      maxW,

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

      color = "var(--ui-text)",
      weight = 800,
      leading = 1.2,
      tracking,

      ...rest
    },
    ref
  ) => {
    const { textAlign: _textAlign, ...domProps } = rest as Record<string, unknown>;

    return (
      <Tag
        ref={ref as any}
        className={className}
        style={{
          fontWeight: weight,
          fontSize: fontSizeMap[size],
          textAlign: align,
          color,
          lineHeight: leading,
          letterSpacing: tracking,
          minWidth: 0,

          width: w,
          maxWidth: maxW,

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
        {...(domProps as any)}
      >
        {children}
      </Tag>
    );
  }
);

Heading.displayName = "Heading";