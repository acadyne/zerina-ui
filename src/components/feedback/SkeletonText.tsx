// src/components/feedback/SkeletonText.tsx
import React from "react";
import {
  resolveSlot,
  type SlotPropsMap,
  type SlotStyleMap,
} from "../../helpers/css";
import { Skeleton } from "./Skeleton";

export type SkeletonTextSlot =
  | "root"
  | "line"
  | "lastLine";

export type SkeletonTextStyles =
  SlotStyleMap<SkeletonTextSlot>;

export type SkeletonTextSlotProps =
  SlotPropsMap<SkeletonTextSlot>;

export interface SkeletonTextProps
  extends Omit<
    React.HTMLAttributes<HTMLDivElement>,
    "children"
  > {
  lines?: number;
  spacing?: number | string;
  height?: number | string;
  width?: string | number;
  lastLineWidth?: string | number;
  animated?: boolean;

  className?: string;
  style?: React.CSSProperties;

  styles?: SkeletonTextStyles;
  slotProps?: SkeletonTextSlotProps;
}

export const SkeletonText = React.forwardRef<
  HTMLDivElement,
  SkeletonTextProps
>(
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
      styles,
      slotProps,
      ...rest
    },
    ref
  ) => {
    const safeLines = Math.max(1, lines);

    const rootSlot = resolveSlot<SkeletonTextSlot>({
      slot: "root",
      styles,
      slotProps,
      className,
      style,
      baseStyle: {
        display: "flex",
        flexDirection: "column",
        gap: spacing,
        width,
        minWidth: 0,
      },
    });

    return (
      <div
        {...rootSlot}
        ref={ref}
        aria-hidden="true"
        {...rest}
      >
        {Array.from({
          length: safeLines,
        }).map((_, index) => {
          const isLast =
            index === safeLines - 1;

          const lineSlot =
            resolveSlot<SkeletonTextSlot>({
              slot: isLast
                ? "lastLine"
                : "line",
              styles,
              slotProps,
            });

          return (
            <Skeleton
              key={index}
              variant="text"
              height={height}
              width={
                isLast
                  ? lastLineWidth
                  : "100%"
              }
              animated={animated}
              {...lineSlot}
            />
          );
        })}
      </div>
    );
  }
);

SkeletonText.displayName = "SkeletonText";