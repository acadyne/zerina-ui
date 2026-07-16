// src/components/feedback/SkeletonCircle.tsx
import React from "react";
import {
  Skeleton,
  type SkeletonProps,
} from "./Skeleton";

export interface SkeletonCircleProps
  extends Omit<
    SkeletonProps,
    "children" | "height" | "loading" | "variant" | "width"
  > {
  size?: number | string;
}

export const SkeletonCircle = React.forwardRef<
  HTMLDivElement,
  SkeletonCircleProps
>(
  (
    {
      size = 40,
      animated = true,
      style,
      ...rest
    },
    ref
  ) => {
    return (
      <Skeleton
        {...rest}
        ref={ref}
        variant="circle"
        width={size}
        height={size}
        animated={animated}
        style={{
          flexShrink: 0,
          ...style,
        }}
      />
    );
  }
);

SkeletonCircle.displayName = "SkeletonCircle";