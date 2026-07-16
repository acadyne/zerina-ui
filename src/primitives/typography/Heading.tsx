// src/primitives/typography/Heading.tsx
import React from "react";

export type HeadingSize =
  | "sm"
  | "md"
  | "lg"
  | "xl"
  | "2xl";

type HeadingOwnProps<
  E extends React.ElementType,
> = {
  as?: E;
  children?: React.ReactNode;

  size?: HeadingSize;
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
};

export type HeadingProps<
  E extends React.ElementType = "h2",
> =
  HeadingOwnProps<E> &
  Omit<
    React.ComponentPropsWithoutRef<E>,
    keyof HeadingOwnProps<E> | "color"
  >;

type HeadingRef<
  E extends React.ElementType,
> =
  React.ComponentPropsWithRef<E>["ref"];

type HeadingComponent = <
  E extends React.ElementType = "h2",
>(
  props: HeadingProps<E> & {
    ref?: HeadingRef<E>;
  }
) => React.ReactElement | null;

const fontSizeMap: Record<
  HeadingSize,
  string
> = {
  sm: "1.125rem",
  md: "1.25rem",
  lg: "1.5rem",
  xl: "1.875rem",
  "2xl": "2.25rem",
};

function HeadingRender(
  props: HeadingProps<React.ElementType>,
  ref: React.ForwardedRef<Element>
) {
  const {
    children,
    as,

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
  } = props;

  const Component: React.ElementType =
    as ?? "h2";

  return React.createElement(
    Component,
    {
      ...rest,
      ref,
      className,

      style: {
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
      },
    },
    children
  );
}

const HeadingForwardRef =
  React.forwardRef<
    Element,
    HeadingProps<React.ElementType>
  >(HeadingRender);

HeadingForwardRef.displayName =
  "Heading";

export const Heading =
  HeadingForwardRef as unknown as HeadingComponent;