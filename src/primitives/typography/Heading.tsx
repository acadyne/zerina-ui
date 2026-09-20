// src/primitives/typography/Heading.tsx
import React from "react";

import {
  typographyRecipe,
} from "../../theme/recipes";

import type {
  UITypographyRole,
} from "../../theme/contracts/visual-semantics";

export type HeadingTypographyRole =
  Extract<
    UITypographyRole,
    | "display"
    | "headline"
    | "title"
  >;

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

  typographyRole?: HeadingTypographyRole;
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
  sm: "var(--ui-heading-font-size-sm)",
  md: "var(--ui-heading-font-size-md)",
  lg: "var(--ui-heading-font-size-lg)",
  xl: "var(--ui-heading-font-size-xl)",
  "2xl":
    "var(--ui-heading-font-size-2xl)",
};

function HeadingRender(
  props: HeadingProps<React.ElementType>,
  ref: React.ForwardedRef<Element>
) {
  const {
    children,
    as,

    typographyRole = "headline",
    size,
    align,

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

    color,
    weight,
    leading,
    tracking,

    ...rest
  } = props;

  const Component: React.ElementType =
    as ?? "h2";

  const roleStyle =
    typographyRecipe({
      role:
        typographyRole,
    });

  return React.createElement(
    Component,
    {
      ...rest,
      ref,
      className,

      "data-ui-typography-role":
        typographyRole,

      style: {
        fontFamily:
          roleStyle.fontFamily,

        fontWeight:
          weight ??
          roleStyle.fontWeight,

        fontSize:
          size === undefined
            ? roleStyle.fontSize
            : fontSizeMap[size],

        textAlign: align,
        color,

        lineHeight:
          leading ??
          roleStyle.lineHeight,

        letterSpacing:
          tracking ??
          roleStyle.letterSpacing,
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

/*
 * React.forwardRef no preserva la firma genérica polimórfica.
 * La implementación valida props y ref; este cast restaura la API pública.
 */
export const Heading =
  HeadingForwardRef as unknown as HeadingComponent;
