// src/primitives/layout/Grid.tsx
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

export interface GridProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "color">,
    SizeProps,
    SpaceProps,
    SurfaceProps {
  children?: React.ReactNode;
  className?: string;

  columns?: number | string;
  rows?: number | string;
  gap?: React.CSSProperties["gap"];
  columnGap?: React.CSSProperties["columnGap"];
  rowGap?: React.CSSProperties["rowGap"];

  autoFlow?: React.CSSProperties["gridAutoFlow"];
  autoColumns?: React.CSSProperties["gridAutoColumns"];
  autoRows?: React.CSSProperties["gridAutoRows"];

  inline?: boolean;
  style?: React.CSSProperties;
}

export const Grid = forwardRef<HTMLDivElement, GridProps>(
  (
    {
      children,
      className = "",
      style,

      columns,
      rows,
      gap,
      columnGap,
      rowGap,

      autoFlow,
      autoColumns,
      autoRows,

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

      inline = false,

      ...rest
    },
    ref
  ) => {
    const gridTemplateColumns =
      typeof columns === "number"
        ? `repeat(${columns}, minmax(0, 1fr))`
        : columns;

    const gridTemplateRows =
      typeof rows === "number"
        ? `repeat(${rows}, minmax(0, 1fr))`
        : rows;

    return (
      <div
        ref={ref}
        className={className}
        style={{
          display: inline ? "inline-grid" : "grid",
          gridTemplateColumns,
          gridTemplateRows,
          gap,
          columnGap,
          rowGap,
          gridAutoFlow: autoFlow,
          gridAutoColumns: autoColumns,
          gridAutoRows: autoRows,

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

Grid.displayName = "Grid";