// src/components/media/Image.tsx
import React, { forwardRef, useCallback, useMemo } from "react";

export interface ImageProps
  extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, "style"> {
  className?: string;
  style?: React.CSSProperties;

  w?: React.CSSProperties["width"];
  h?: React.CSSProperties["height"];
  maxW?: React.CSSProperties["maxWidth"];
  maxH?: React.CSSProperties["maxHeight"];
  minW?: React.CSSProperties["minWidth"];
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

  fit?: React.CSSProperties["objectFit"];
  objectFit?: React.CSSProperties["objectFit"];
  position?: React.CSSProperties["objectPosition"];
  aspect?: React.CSSProperties["aspectRatio"];

  fallbackSrc?: string;
}

export const Image = forwardRef<HTMLImageElement, ImageProps>(
  (
    {
      className = "",
      style,

      w,
      h,
      maxW,
      maxH,
      minW,
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

      fit,
      objectFit,
      position,
      aspect,

      fallbackSrc,
      onError,
      loading,
      decoding,
      alt = "",
      ...rest
    },
    ref
  ) => {
    const inlineStyle = useMemo<React.CSSProperties>(
      () => ({
        width: w,
        height: h,
        maxWidth: maxW,
        maxHeight: maxH,
        minWidth: minW,
        minHeight: minH,

        margin: m,
        marginTop: mt,
        marginBottom: mb,
        marginLeft: ml,
        marginRight: mr,

        paddingTop: pt ?? py ?? p,
        paddingBottom: pb ?? py ?? p,
        paddingLeft: pl ?? px ?? p,
        paddingRight: pr ?? px ?? p,

        borderRadius: rounded,
        boxShadow: shadow,
        backgroundColor: bg,

        objectFit: objectFit ?? fit,
        objectPosition: position,
        aspectRatio: aspect,

        display: "block",
        ...style,
      }),
      [
        w,
        h,
        maxW,
        maxH,
        minW,
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
        fit,
        objectFit,
        position,
        aspect,
        style,
      ]
    );

    const handleError = useCallback<React.ReactEventHandler<HTMLImageElement>>(
      (e) => {
        const img = e.currentTarget;

        if (fallbackSrc && img.dataset.fallbackApplied !== "1") {
          img.dataset.fallbackApplied = "1";
          img.src = fallbackSrc;
          return;
        }

        onError?.(e);
      },
      [fallbackSrc, onError]
    );

    return (
      <img
        ref={ref}
        className={className}
        alt={alt}
        style={inlineStyle}
        onError={handleError}
        loading={loading ?? "lazy"}
        decoding={decoding ?? "async"}
        {...rest}
      />
    );
  }
);

Image.displayName = "Image";