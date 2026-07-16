// src/primitives/typography/Typography.tsx
import React from "react";

export type TypographySize =
  | "xs"
  | "sm"
  | "md"
  | "lg"
  | "xl";

type TypographyOwnProps<
  E extends React.ElementType,
> = {
  as?: E;
  children?: React.ReactNode;
  className?: string;

  size?: TypographySize;
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
};

export type TypographyProps<
  E extends React.ElementType = "p",
> =
  TypographyOwnProps<E> &
  Omit<
    React.ComponentPropsWithoutRef<E>,
    keyof TypographyOwnProps<E> | "color"
  >;

type TypographyRef<
  E extends React.ElementType,
> =
  React.ComponentPropsWithRef<E>["ref"];

type TypographyComponent = <
  E extends React.ElementType = "p",
>(
  props: TypographyProps<E> & {
    ref?: TypographyRef<E>;
  }
) => React.ReactElement | null;

const sizeMap: Record<
  TypographySize,
  string
> = {
  xs: "var(--ui-font-size-xs)",
  sm: "var(--ui-font-size-sm)",
  md: "var(--ui-font-size-md)",
  lg: "var(--ui-font-size-lg)",
  xl: "var(--ui-font-size-xl)",
};

function TypographyRender(
  props: TypographyProps<React.ElementType>,
  ref: React.ForwardedRef<Element>
) {
  const {
    as,
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
  } = props;

  const Component: React.ElementType =
    as ?? "p";

  return React.createElement(
    Component,
    {
      ...rest,
      ref,
      className,

      style: {
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
      },
    },
    children
  );
}

const TypographyForwardRef =
  React.forwardRef<
    Element,
    TypographyProps<React.ElementType>
  >(TypographyRender);

TypographyForwardRef.displayName =
  "Typography";

export const Typography =
  TypographyForwardRef as unknown as TypographyComponent;