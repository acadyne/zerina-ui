// src/components/feedback/SkeletonCircle.tsx
import React from "react";
import { Skeleton } from "./Skeleton";

export interface SkeletonCircleProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "children"> {
  size?: number | string;
  animated?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export const SkeletonCircle = React.forwardRef<
  HTMLDivElement,
  SkeletonCircleProps
>(({ size = 40, animated = true, className = "", style, ...rest }, ref) => {
  return (
    <Skeleton
      ref={ref}
      variant="circle"
      width={size}
      height={size}
      animated={animated}
      className={className}
      style={{
        flexShrink: 0,
        ...style,
      }}
      {...rest}
    />
  );
});

SkeletonCircle.displayName = "SkeletonCircle";