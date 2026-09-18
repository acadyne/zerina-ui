// src/primitives/layout/Wrap.tsx
import React, { forwardRef, useMemo } from "react";
import {
  getMinWidthFixStyles,
  getSpacingStyles,
} from "../../helpers";
import type {
  FlowLayoutFrameProps,
} from "./layoutFrame.types";

export interface WrapProps
  extends
    React.HTMLAttributes<HTMLDivElement>,
    FlowLayoutFrameProps {
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;

  spacing?: React.CSSProperties["gap"];
  rowSpacing?: React.CSSProperties["rowGap"];
  columnSpacing?: React.CSSProperties["columnGap"];

  align?: React.CSSProperties["alignItems"];
  justify?: React.CSSProperties["justifyContent"];

  shouldWrapChildren?: boolean;

}

export interface WrapItemProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export const Wrap = forwardRef<HTMLDivElement, WrapProps>(
  (
    {
      children,
      className = "",
      style,

      spacing = "0.75rem",
      rowSpacing,
      columnSpacing,

      align = "center",
      justify = "flex-start",

      shouldWrapChildren = false,

      w,
      minH,

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

      ...rest
    },
    ref
  ) => {
    const items = useMemo(() => React.Children.toArray(children).filter(Boolean), [children]);

    return (
      <div
        ref={ref}
        className={className}
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: align,
          justifyContent: justify,

          gap: spacing,
          rowGap: rowSpacing,
          columnGap: columnSpacing,

          width: w,
          minHeight: minH,
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

          ...style,
        }}
        {...rest}
      >
        {shouldWrapChildren
          ? items.map((child, index) => (
              <WrapItem key={`wrap-item-${index}`}>{child}</WrapItem>
            ))
          : items}
      </div>
    );
  }
);

Wrap.displayName = "Wrap";

export const WrapItem = forwardRef<HTMLDivElement, WrapItemProps>(
  ({ children, className = "", style, ...rest }, ref) => {
    return (
      <div
        ref={ref}
        className={className}
        style={{
          display: "inline-flex",
          minWidth: 0,
          maxWidth: "100%",
          ...style,
        }}
        {...rest}
      >
        {children}
      </div>
    );
  }
);

WrapItem.displayName = "WrapItem";