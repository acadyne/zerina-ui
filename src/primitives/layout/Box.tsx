// src/primitives/layout/Box.tsx
import React from "react";
import {
  type SizeProps,
  type SpaceProps,
  type SurfaceProps,
  type TextStyleProps,
  getMinWidthFixStyles,
  getSizeStyles,
  getSpacingStyles,
  getSurfaceStyles,
  getTypographyStyles,
} from "../../helpers";

export type BoxStyleProps =
  SizeProps &
  SpaceProps &
  SurfaceProps &
  TextStyleProps & {
    flex?: React.CSSProperties["flex"];
    overflow?: React.CSSProperties["overflow"];
    display?: React.CSSProperties["display"];
  };

type BoxOwnProps<
  E extends React.ElementType,
> = {
  as?: E;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
} & BoxStyleProps;

export type BoxProps<
  E extends React.ElementType = "div",
> =
  BoxOwnProps<E> &
  Omit<
    React.ComponentPropsWithoutRef<E>,
    | keyof BoxOwnProps<E>
    | "color"
    | "boxShadow"
    | "textAlign"
  >;

type BoxRef<
  E extends React.ElementType,
> =
  React.ComponentPropsWithRef<E>["ref"];

type BoxComponent = <
  E extends React.ElementType = "div",
>(
  props: BoxProps<E> & {
    ref?: BoxRef<E>;
  }
) => React.ReactElement | null;

function expandBoxShorthand(
  value:
    React.CSSProperties[
      keyof React.CSSProperties
    ]
) {
  if (
    value === undefined ||
    value === null
  ) {
    return null;
  }

  const raw =
    String(value).trim();

  if (!raw) {
    return null;
  }

  const parts =
    raw.split(/\s+/);

  if (parts.length === 1) {
    return {
      top: parts[0],
      right: parts[0],
      bottom: parts[0],
      left: parts[0],
    };
  }

  if (parts.length === 2) {
    return {
      top: parts[0],
      right: parts[1],
      bottom: parts[0],
      left: parts[1],
    };
  }

  if (parts.length === 3) {
    return {
      top: parts[0],
      right: parts[1],
      bottom: parts[2],
      left: parts[1],
    };
  }

  return {
    top: parts[0],
    right: parts[1],
    bottom: parts[2],
    left: parts[3],
  };
}

function normalizeSpacingShorthands(
  style: React.CSSProperties
): React.CSSProperties {
  const normalized:
    React.CSSProperties = {
      ...style,
    };

  const padding =
    expandBoxShorthand(
      normalized.padding
    );

  if (padding) {
    normalized.paddingTop =
      normalized.paddingTop ??
      padding.top;

    normalized.paddingRight =
      normalized.paddingRight ??
      padding.right;

    normalized.paddingBottom =
      normalized.paddingBottom ??
      padding.bottom;

    normalized.paddingLeft =
      normalized.paddingLeft ??
      padding.left;

    delete normalized.padding;
  }

  const margin =
    expandBoxShorthand(
      normalized.margin
    );

  if (margin) {
    normalized.marginTop =
      normalized.marginTop ??
      margin.top;

    normalized.marginRight =
      normalized.marginRight ??
      margin.right;

    normalized.marginBottom =
      normalized.marginBottom ??
      margin.bottom;

    normalized.marginLeft =
      normalized.marginLeft ??
      margin.left;

    delete normalized.margin;
  }

  return normalized;
}

function BoxRender(
  props:
    BoxProps<React.ElementType>,
  ref:
    React.ForwardedRef<Element>
) {
  const {
    as,
    children,
    className = "",
    style,

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

    textAlign,
    fontSize,
    fontWeight,
    lineHeight,
    letterSpacing,

    flex,
    overflow,
    display,

    ...rest
  } = props;

  const Component:
    React.ElementType =
      as ?? "div";

  const inlineStyle =
    normalizeSpacingShorthands({
      ...getSizeStyles({
        w,
        h,
        minW,
        maxW,
        minH,
        maxH,
      }),

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

      ...getTypographyStyles({
        textAlign,
        fontSize,
        fontWeight,
        lineHeight,
        letterSpacing,
      }),

      flex,
      overflow,
      display,

      ...style,
    });

  return React.createElement(
    Component,
    {
      ...rest,
      ref,
      className,
      style: inlineStyle,
    },
    children
  );
}

const BoxForwardRef =
  React.forwardRef<
    Element,
    BoxProps<React.ElementType>
  >(BoxRender);

BoxForwardRef.displayName = "Box";

export const Box =
  BoxForwardRef as unknown as BoxComponent;