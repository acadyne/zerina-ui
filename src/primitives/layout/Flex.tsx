// src/primitives/layout/Flex.tsx
import React, { forwardRef } from "react";
import {
  type SizeProps,
  type SpaceProps,
  type SurfaceProps,
  getMinWidthFixStyles,
  getSizeStyles,
  getSpacingStyles,
  getSurfaceStyles,
} from "../../helpers";

export interface FlexProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "color">,
    SizeProps,
    SpaceProps,
    SurfaceProps {
  children?: React.ReactNode;
  className?: string;

  justify?: React.CSSProperties["justifyContent"];
  align?: React.CSSProperties["alignItems"];
  direction?: React.CSSProperties["flexDirection"];
  wrap?: React.CSSProperties["flexWrap"];
  gap?: React.CSSProperties["gap"];

  overflow?: React.CSSProperties["overflow"];
  inline?: boolean;

  style?: React.CSSProperties;
}

export const Flex = forwardRef<HTMLDivElement, FlexProps>(
  (
    {
      children,
      className = "",
      justify = "center",
      align = "center",
      direction = "row",
      wrap = "nowrap",
      gap,

      w,
      h,
      minW,
      maxW,
      minH,
      maxH,

      p,
      px,
      py,
      pt,
      pb,
      pl,
      pr,

      m,
      mx,
      my,
      mt,
      mb,
      ml,
      mr,

      rounded,
      shadow,
      bg,
      color,
      border,

      overflow,
      inline = false,

      style,
      ...rest
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={className}
        style={{
          display: inline ? "inline-flex" : "flex",
          justifyContent: justify,
          alignItems: align,
          flexDirection: direction,
          flexWrap: wrap,
          gap,
          overflow,

          ...getSizeStyles({ w, h, minW, maxW, minH, maxH }),
          ...getMinWidthFixStyles(),
          ...getSpacingStyles({
            p,
            px,
            py,
            pt,
            pb,
            pl,
            pr,
            m,
            mx,
            my,
            mt,
            mb,
            ml,
            mr,
          }),
          ...getSurfaceStyles({
            bg,
            color,
            rounded,
            shadow,
            border,
          }),
          ...style,
        }}
        {...rest}
      >
        {children}
      </div>
    );
  }
);

Flex.displayName = "Flex";