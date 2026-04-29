// src/helpers/layout.ts
import React from "react";

export type SpaceProps = {
  p?: React.CSSProperties["padding"];
  px?: React.CSSProperties["paddingLeft"];
  py?: React.CSSProperties["paddingTop"];
  pt?: React.CSSProperties["paddingTop"];
  pb?: React.CSSProperties["paddingBottom"];
  pl?: React.CSSProperties["paddingLeft"];
  pr?: React.CSSProperties["paddingRight"];

  m?: React.CSSProperties["margin"];
  mx?: React.CSSProperties["marginLeft"];
  my?: React.CSSProperties["marginTop"];
  mt?: React.CSSProperties["marginTop"];
  mb?: React.CSSProperties["marginBottom"];
  ml?: React.CSSProperties["marginLeft"];
  mr?: React.CSSProperties["marginRight"];
};

export type SizeProps = {
  w?: React.CSSProperties["width"];
  h?: React.CSSProperties["height"];
  minW?: React.CSSProperties["minWidth"];
  maxW?: React.CSSProperties["maxWidth"];
  minH?: React.CSSProperties["minHeight"];
  maxH?: React.CSSProperties["maxHeight"];
};

export type SurfaceProps = {
  bg?: React.CSSProperties["backgroundColor"];
  color?: React.CSSProperties["color"];
  rounded?: React.CSSProperties["borderRadius"];
  shadow?: React.CSSProperties["boxShadow"];
  border?: React.CSSProperties["border"];
};

export type TextStyleProps = {
  textAlign?: React.CSSProperties["textAlign"];
  fontSize?: React.CSSProperties["fontSize"];
  fontWeight?: React.CSSProperties["fontWeight"];
  lineHeight?: React.CSSProperties["lineHeight"];
  letterSpacing?: React.CSSProperties["letterSpacing"];
};

export function getSpacingStyles(props: SpaceProps): React.CSSProperties {
  const {
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
  } = props;

  return {
    paddingTop: pt ?? py ?? p,
    paddingBottom: pb ?? py ?? p,
    paddingLeft: pl ?? px ?? p,
    paddingRight: pr ?? px ?? p,

    marginTop: mt ?? my ?? m,
    marginBottom: mb ?? my ?? m,
    marginLeft: ml ?? mx ?? m,
    marginRight: mr ?? mx ?? m,
  };
}

export function getSizeStyles(props: SizeProps): React.CSSProperties {
  const { w, h, minW, maxW, minH, maxH } = props;

  return {
    width: w,
    height: h,
    minWidth: minW,
    maxWidth: maxW,
    minHeight: minH,
    maxHeight: maxH,
  };
}

export function getSurfaceStyles(props: SurfaceProps): React.CSSProperties {
  const { bg, color, rounded, shadow, border } = props;

  return {
    backgroundColor: bg,
    color,
    borderRadius: rounded,
    boxShadow: shadow,
    border,
  };
}

export function getTypographyStyles(
  props: TextStyleProps
): React.CSSProperties {
  const { textAlign, fontSize, fontWeight, lineHeight, letterSpacing } = props;

  return {
    textAlign,
    fontSize,
    fontWeight,
    lineHeight,
    letterSpacing,
  };
}

export function getMinWidthFixStyles(): React.CSSProperties {
  return {
    minWidth: 0,
  };
}