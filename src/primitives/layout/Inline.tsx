// src/primitives/layout/Inline.tsx
import React, { forwardRef, useMemo } from "react";
import { getMinWidthFixStyles, getSpacingStyles } from "../../helpers";
import { withDividers } from "../../utils/withDividers";
import { normalizeInlineChild } from "../../utils/layout.utils";

export interface InlineProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;

  gap?: React.CSSProperties["gap"];
  align?: React.CSSProperties["alignItems"];
  justify?: React.CSSProperties["justifyContent"];
  wrap?: React.CSSProperties["flexWrap"];

  divider?: React.ReactNode;

  w?: React.CSSProperties["width"];
  minH?: React.CSSProperties["minHeight"];

  p?: React.CSSProperties["padding"];
  px?: React.CSSProperties["paddingLeft"];
  py?: React.CSSProperties["paddingTop"];
  pt?: React.CSSProperties["paddingTop"];
  pb?: React.CSSProperties["paddingBottom"];
  pl?: React.CSSProperties["paddingLeft"];
  pr?: React.CSSProperties["paddingRight"];

  m?: React.CSSProperties["margin"];
  mt?: React.CSSProperties["marginTop"];
  mb?: React.CSSProperties["marginBottom"];
  ml?: React.CSSProperties["marginLeft"];
  mr?: React.CSSProperties["marginRight"];
}

export const Inline = forwardRef<HTMLDivElement, InlineProps>(
  (
    {
      children,
      className = "",
      style,

      gap = "0.5rem",
      align = "center",
      justify = "flex-start",
      wrap = "nowrap",

      divider,

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
      mt,
      mb,
      ml,
      mr,

      ...rest
    },
    ref
  ) => {
    const content = useMemo(() => {
      const raw = withDividers(children, divider);

      return raw
        .map((child, index) => normalizeInlineChild(child, align, `inline-${index}`))
        .filter(Boolean);
    }, [children, divider, align]);

    return (
      <div
        ref={ref}
        className={className}
        style={{
          display: "inline-flex",
          flexWrap: wrap,
          alignItems: align,
          justifyContent: justify,
          gap: divider ? undefined : gap,

          width: w,
          minHeight: minH,
          maxWidth: "100%",
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
            mt,
            mb,
            ml,
            mr,
          }),

          ...style,
        }}
        {...rest}
      >
        {content}
      </div>
    );
  }
);

Inline.displayName = "Inline";