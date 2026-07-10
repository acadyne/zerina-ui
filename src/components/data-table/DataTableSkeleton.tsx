// src/components/data-table/DataTableSkeleton.tsx
import React from "react";
import { SkeletonTable } from "../feedback/SkeletonTable";
import { resolveSlot } from "../../helpers/css";
import type {
  DataTableSlot,
  DataTableSlotProps,
  DataTableStyles,
} from "./dataTable.types";

export interface DataTableSkeletonProps
  extends React.HTMLAttributes<HTMLDivElement> {
  rows?: number;
  columns?: number;
  animated?: boolean;
  fallback?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;

  styles?: DataTableStyles;
  slotProps?: DataTableSlotProps;
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
      styles,
      slotProps,
      ...rest
    },
    ref
  ) => {
    const skeletonSlot = resolveSlot<DataTableSlot>({
      slot: "skeleton",
      styles,
      slotProps,
      className,
      style,
      baseProps: {
        "aria-busy": "true",
        "aria-live": "polite",
        "data-ui": "data-table-skeleton",
      },
      baseStyle: {
        width: "100%",
        minWidth: 0,
      },
    });

    return (
      <div {...skeletonSlot} ref={ref} {...rest}>
        {fallback ?? (
          <SkeletonTable rows={rows} columns={columns} animated={animated} />
        )}
      </div>
    );
  }
);

DataTableSkeleton.displayName = "DataTableSkeleton";