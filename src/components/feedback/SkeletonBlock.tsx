// src/components/feedback/SkeletonBlock.tsx
import React from "react";
import { Skeleton } from "./Skeleton";

export interface SkeletonBlockProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "children"> {
  width?: React.CSSProperties["width"];
  height?: React.CSSProperties["height"];
  rounded?: React.CSSProperties["borderRadius"];
  animated?: boolean;

  className?: string;
  style?: React.CSSProperties;
}

export const SkeletonBlock = React.forwardRef<
  HTMLDivElement,
  SkeletonBlockProps
>(
  (
    {
      width = "100%",
      height = 120,
      rounded = "var(--ui-radius-lg)",
      animated = true,
      className = "",
      style,
      ...rest
    },
    ref
  ) => {
    return (
      <Skeleton
        ref={ref}
        variant="rect"
        width={width}
        height={height}
        rounded={rounded}
        animated={animated}
        className={className}
        style={style}
        {...rest}
      />
    );
  }
);

SkeletonBlock.displayName = "SkeletonBlock";