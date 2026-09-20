// src/primitives/typography/Typography.tsx
import React from "react";

import {
  typographyRecipe,
} from "../../theme/recipes";

import type {
  UITypographyRole,
} from "../../theme/contracts/visual-semantics";

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

  typographyRole?: UITypographyRole;
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

function getSpacingStyles({
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
}: {
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
}): React.CSSProperties {
  return {
    ...(m !== undefined
      ? {
          margin: m,
        }
      : {}),

    ...(mt !== undefined
      ? {
          marginTop: mt,
        }
      : {}),

    ...(mr !== undefined
      ? {
          marginRight: mr,
        }
      : {}),

    ...(mb !== undefined
      ? {
          marginBottom: mb,
        }
      : {}),

    ...(ml !== undefined
      ? {
          marginLeft: ml,
        }
      : {}),

    ...(p !== undefined
      ? {
          padding: p,
        }
      : {}),

    ...(pt !== undefined
      ? {
          paddingTop: pt,
        }
      : {}),

    ...(pr !== undefined
      ? {
          paddingRight: pr,
        }
      : {}),

    ...(pb !== undefined
      ? {
          paddingBottom: pb,
        }
      : {}),

    ...(pl !== undefined
      ? {
          paddingLeft: pl,
        }
      : {}),
  };
}

function TypographyRender(
  props: TypographyProps<React.ElementType>,
  ref: React.ForwardedRef<Element>
) {
  const {
    as,
    children,
    className = "",

    typographyRole = "body",
    size,
    weight,
    color,
    align,
    leading,
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

        fontSize:
          size === undefined
            ? roleStyle.fontSize
            : sizeMap[size],

        fontWeight:
          weight ??
          roleStyle.fontWeight,

        color,
        textAlign: align,

        lineHeight:
          leading ??
          roleStyle.lineHeight,

        letterSpacing:
          tracking ??
          roleStyle.letterSpacing,
        minWidth: 0,

        ...getSpacingStyles({
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
        }),

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

/*
 * React.forwardRef no preserva la firma genérica polimórfica.
 * La implementación valida props y ref; este cast restaura la API pública.
 */
export const Typography =
  TypographyForwardRef as unknown as TypographyComponent;