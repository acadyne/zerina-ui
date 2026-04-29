// src/components/data-table/DataTableSkeleton.tsx
import React from "react";
import { Box } from "../../primitives/layout";
import { SkeletonTable } from "../feedback/SkeletonTable";

export interface DataTableSkeletonProps
  extends React.HTMLAttributes<HTMLDivElement> {
  rows?: number;
  columns?: number;
  animated?: boolean;
  fallback?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export const DataTableSkeleton = React.forwardRef<
  HTMLDivElement,
  DataTableSkeletonProps
>(
  (
    {
      rows = 10,
      columns = 4,
      animated = true,
      fallback,
      className = "",
      style,
      ...rest
    },
    ref
  ) => {
    return (
      <Box
        ref={ref as React.Ref<Element>}
        className={className}
        aria-busy="true"
        aria-live="polite"
        data-ui="data-table-skeleton"
        style={{
          width: "100%",
          minWidth: 0,
          ...style,
        }}
        {...rest}
      >
        {fallback ?? (
          <SkeletonTable rows={rows} columns={columns} animated={animated} />
        )}
      </Box>
    );
  }
);

DataTableSkeleton.displayName = "DataTableSkeleton";