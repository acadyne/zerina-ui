// src/primitives/layout/GridItem.tsx
import React, { forwardRef } from "react";

export interface GridItemProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  className?: string;

  colSpan?: number;
  rowSpan?: number;

  colStart?: number;
  colEnd?: number;
  rowStart?: number;
  rowEnd?: number;

  w?: React.CSSProperties["width"];
  h?: React.CSSProperties["height"];
  maxW?: React.CSSProperties["maxWidth"];
  minH?: React.CSSProperties["minHeight"];

  m?: React.CSSProperties["margin"];
  mt?: React.CSSProperties["marginTop"];
  mb?: React.CSSProperties["marginBottom"];
  ml?: React.CSSProperties["marginLeft"];
  mr?: React.CSSProperties["marginRight"];

  p?: React.CSSProperties["padding"];
  px?: React.CSSProperties["paddingLeft"];
  py?: React.CSSProperties["paddingTop"];
  pt?: React.CSSProperties["paddingTop"];
  pb?: React.CSSProperties["paddingBottom"];
  pl?: React.CSSProperties["paddingLeft"];
  pr?: React.CSSProperties["paddingRight"];

  rounded?: React.CSSProperties["borderRadius"];
  shadow?: React.CSSProperties["boxShadow"];
  bg?: React.CSSProperties["backgroundColor"];
  color?: React.CSSProperties["color"];

  style?: React.CSSProperties;
}

export const GridItem = forwardRef<HTMLDivElement, GridItemProps>(
  (
    {
      children,
      className = "",
      style,

      colSpan,
      rowSpan,
      colStart,
      colEnd,
      rowStart,
      rowEnd,

      w,
      h,
      maxW,
      minH,

      m,
      mt,
      mb,
      ml,
      mr,

      p,
      px,
      py,
      pt,
      pb,
      pl,
      pr,

      rounded,
      shadow,
      bg,
      color,

      ...rest
    },
    ref
  ) => {
    const gridColumn =
      colStart || colEnd
        ? `${colStart ?? "auto"} / ${colEnd ?? "auto"}`
        : colSpan
          ? `span ${colSpan} / span ${colSpan}`
          : undefined;

    const gridRow =
      rowStart || rowEnd
        ? `${rowStart ?? "auto"} / ${rowEnd ?? "auto"}`
        : rowSpan
          ? `span ${rowSpan} / span ${rowSpan}`
          : undefined;

    return (
      <div
        ref={ref}
        className={className}
        style={{
          gridColumn,
          gridRow,

          width: w,
          height: h,
          maxWidth: maxW,
          minHeight: minH,
          minWidth: 0,

          marginTop: mt ?? m,
          marginBottom: mb ?? m,
          marginLeft: ml ?? m,
          marginRight: mr ?? m,

          paddingTop: pt ?? py ?? p,
          paddingBottom: pb ?? py ?? p,
          paddingLeft: pl ?? px ?? p,
          paddingRight: pr ?? px ?? p,

          borderRadius: rounded,
          boxShadow: shadow,
          backgroundColor: bg,
          color,

          ...style,
        }}
        {...rest}
      >
        {children}
      </div>
    );
  }
);

GridItem.displayName = "GridItem";