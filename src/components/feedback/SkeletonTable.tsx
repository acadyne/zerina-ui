// src/components/feedback/SkeletonTable.tsx
import React from "react";
import {
  resolveSlot,
  type SlotPropsMap,
  type SlotStyleMap,
} from "../../helpers/css";
import { Skeleton } from "./Skeleton";

export type SkeletonTableSlot =
  | "root"
  | "header"
  | "headerCell"
  | "row"
  | "cell";

export type SkeletonTableStyles =
  SlotStyleMap<SkeletonTableSlot>;

export type SkeletonTableSlotProps =
  SlotPropsMap<SkeletonTableSlot>;

export interface SkeletonTableProps
  extends Omit<
    React.HTMLAttributes<HTMLDivElement>,
    "children"
  > {
  rows?: number;
  columns?: number;
  showHeader?: boolean;
  animated?: boolean;
  dense?: boolean;

  className?: string;
  style?: React.CSSProperties;

  styles?: SkeletonTableStyles;
  slotProps?: SkeletonTableSlotProps;
}

export const SkeletonTable = React.forwardRef<
  HTMLDivElement,
  SkeletonTableProps
>(
  (
    {
      rows = 5,
      columns = 4,
      showHeader = true,
      animated = true,
      dense = true,
      className = "",
      style,
      styles,
      slotProps,
      ...rest
    },
    ref
  ) => {
    const safeRows = Math.max(1, rows);
    const safeColumns = Math.max(1, columns);

    const cellHeight = dense
      ? 10
      : 12;

    const cellPadding = dense
      ? "0.75rem"
      : "0.95rem";

    const gridTemplateColumns =
      `repeat(${safeColumns}, minmax(0, 1fr))`;

    const rootSlot = resolveSlot<SkeletonTableSlot>({
      slot: "root",
      styles,
      slotProps,
      className,
      style,

      baseProps: {
        "aria-hidden": true,
        "data-ui-skeleton-table": "",
        "data-ui-skeleton-table-dense":
          dense || undefined,
        "data-ui-skeleton-table-header":
          showHeader || undefined,
      },

      baseStyle: {
        width: "100%",
        minWidth: 0,
        overflow: "hidden",
        borderRadius: "var(--ui-radius-lg)",
        border: "1px solid var(--ui-border)",
        background: "var(--ui-surface)",
      },
    });

    const headerSlot = resolveSlot<SkeletonTableSlot>({
      slot: "header",
      styles,
      slotProps,

      baseProps: {
        "data-ui-skeleton-table-header-row": "",
      },

      baseStyle: {
        display: "grid",
        gridTemplateColumns,
        gap: "0.75rem",
        padding: cellPadding,
        borderBottom: "1px solid var(--ui-border)",
        background: "var(--ui-surface-2)",
      },
    });

    const rowSlot = resolveSlot<SkeletonTableSlot>({
      slot: "row",
      styles,
      slotProps,

      baseProps: {
        "data-ui-skeleton-table-row": "",
      },

      baseStyle: {
        display: "grid",
        gridTemplateColumns,
        gap: "0.75rem",
        padding: cellPadding,
      },
    });

    return (
      <div
        {...rootSlot}
        ref={ref}
        {...rest}
      >
        {showHeader ? (
          <div {...headerSlot}>
            {Array.from({
              length: safeColumns,
            }).map((_, columnIndex) => {
              const headerCellSlot =
                resolveSlot<SkeletonTableSlot>({
                  slot: "headerCell",
                  styles,
                  slotProps,

                  baseProps: {
                    "data-ui-skeleton-table-header-cell": "",
                    "data-column-index": columnIndex,
                  },
                });

              return (
                <Skeleton
                  {...headerCellSlot}
                  key={`header-${columnIndex}`}
                  variant="text"
                  height={cellHeight}
                  width={
                    columnIndex === safeColumns - 1
                      ? "70%"
                      : "88%"
                  }
                  animated={animated}
                />
              );
            })}
          </div>
        ) : null}

        {Array.from({
          length: safeRows,
        }).map((_, rowIndex) => (
          <div
            {...rowSlot}
            key={`row-${rowIndex}`}
            data-row-index={rowIndex}
            style={{
              ...rowSlot.style,
              borderBottom:
                rowIndex === safeRows - 1
                  ? "none"
                  : "1px solid var(--ui-border)",
            }}
          >
            {Array.from({
              length: safeColumns,
            }).map((__, columnIndex) => {
              const cellSlot =
                resolveSlot<SkeletonTableSlot>({
                  slot: "cell",
                  styles,
                  slotProps,

                  baseProps: {
                    "data-ui-skeleton-table-cell": "",
                    "data-row-index": rowIndex,
                    "data-column-index": columnIndex,
                  },
                });

              const cellWidth =
                columnIndex === 0
                  ? "76%"
                  : columnIndex === safeColumns - 1
                    ? "62%"
                    : "88%";

              return (
                <Skeleton
                  {...cellSlot}
                  key={`cell-${rowIndex}-${columnIndex}`}
                  variant="text"
                  height={cellHeight}
                  width={cellWidth}
                  animated={animated}
                />
              );
            })}
          </div>
        ))}
      </div>
    );
  }
);

SkeletonTable.displayName = "SkeletonTable";