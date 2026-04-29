// src/components/feedback/SkeletonText.tsx
import React from "react";
import { Skeleton } from "./Skeleton";

export interface SkeletonTextProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "children"> {
  lines?: number;
  spacing?: number | string;
  height?: number | string;
  width?: string | number;
  lastLineWidth?: string | number;
  animated?: boolean;

  className?: string;
  style?: React.CSSProperties;
  lineStyle?: React.CSSProperties;
}

export const SkeletonText = React.forwardRef<HTMLDivElement, SkeletonTextProps>(
  (
    {
      lines = 3,
      spacing = 6,
      height = 10,
      width = "100%",
      lastLineWidth = "80%",
      animated = true,
      className = "",
      style,
      lineStyle,
      ...rest
    },
    ref
  ) => {
    const safeLines = Math.max(1, lines);

    return (
      <div
        ref={ref}
        className={className}
        aria-hidden="true"
        style={{
          display: "flex",
          flexDirection: "column",
          gap: spacing,
          width,
          minWidth: 0,
          ...style,
        }}
        {...rest}
      >
        {Array.from({ length: safeLines }).map((_, index) => {
          const isLast = index === safeLines - 1;

          return (
            <Skeleton
              key={index}
              variant="text"
              height={height}
              width={isLast ? lastLineWidth : "100%"}
              animated={animated}
              style={lineStyle}
            />
          );
        })}
      </div>
    );
  }
);

SkeletonText.displayName = "SkeletonText";