// src/components/feedback/SkeletonBlock.tsx
import React from "react";
import {
  Skeleton,
  type SkeletonProps,
} from "./Skeleton";

export interface SkeletonBlockProps
  extends Omit<
    SkeletonProps,
    "children" | "loading" | "variant"
  > {}

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
      ...rest
    },
    ref
  ) => {
    return (
      <Skeleton
        {...rest}
        ref={ref}
        variant="rect"
        width={width}
        height={height}
        rounded={rounded}
        animated={animated}
      />
    );
  }
);

SkeletonBlock.displayName = "SkeletonBlock";