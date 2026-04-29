// src/primitives/layout/Container.tsx
import React, { forwardRef } from "react";

type ContainerSize = "sm" | "md" | "lg" | "xl" | "full" | number | string;

export interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;

  size?: ContainerSize;
  centered?: boolean;
  fluid?: boolean;

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
}

const sizeMap: Record<Exclude<ContainerSize, number | string>, string> = {
  sm: "640px",
  md: "768px",
  lg: "1024px",
  xl: "1280px",
  full: "100%",
};

function resolveMaxWidth(size: ContainerSize): string | number {
  if (typeof size === "number") return `${size}px`;
  if (typeof size === "string" && !(size in sizeMap)) return size;
  return sizeMap[size as Exclude<ContainerSize, number | string>];
}

export const Container = forwardRef<HTMLDivElement, ContainerProps>(
  (
    {
      children,
      className = "",
      style,

      size = "xl",
      centered = true,
      fluid = false,

      w = "100%",
      minH,

      p,
      px = "clamp(12px, 2vw, 20px)",
      py,
      pt,
      pb,
      pl,
      pr,

      m,
      mt,
      mb,

      ...rest
    },
    ref
  ) => {
    const maxWidth = fluid ? "100%" : resolveMaxWidth(size);

    return (
      <div
        ref={ref}
        className={className}
        style={{
          width: w,
          maxWidth,
          minHeight: minH,
          minWidth: 0,
          boxSizing: "border-box",

          margin: m,
          marginTop: mt,
          marginBottom: mb,
          marginLeft: centered ? "auto" : undefined,
          marginRight: centered ? "auto" : undefined,

          paddingTop: pt ?? py ?? p,
          paddingBottom: pb ?? py ?? p,
          paddingLeft: pl ?? px ?? p,
          paddingRight: pr ?? px ?? p,

          ...style,
        }}
        {...rest}
      >
        {children}
      </div>
    );
  }
);

Container.displayName = "Container";