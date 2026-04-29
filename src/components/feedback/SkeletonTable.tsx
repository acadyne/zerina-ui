// src/components/feedback/SkeletonTable.tsx
import React from "react";
import { Skeleton } from "./Skeleton";

export interface SkeletonTableProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "children"> {
  rows?: number;
  columns?: number;
  showHeader?: boolean;
  animated?: boolean;
  dense?: boolean;

  className?: string;
  style?: React.CSSProperties;
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
      ...rest
    },
    ref
  ) => {
    const safeRows = Math.max(1, rows);
    const safeColumns = Math.max(1, columns);
    const cellHeight = dense ? 10 : 12;
    const cellPadding = dense ? "0.75rem" : "0.95rem";

    return (
      <div
        ref={ref}
        className={className}
        aria-hidden="true"
        style={{
          width: "100%",
          minWidth: 0,
          overflow: "hidden",
          borderRadius: "var(--ui-radius-lg)",
          border: "1px solid var(--ui-border)",
          background: "var(--ui-surface)",
          ...style,
        }}
        {...rest}
      >
        {showHeader ? (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: `repeat(${safeColumns}, minmax(0, 1fr))`,
              gap: "0.75rem",
              padding: cellPadding,
              borderBottom: "1px solid var(--ui-border)",
              background: "var(--ui-surface-2)",
            }}
          >
            {Array.from({ length: safeColumns }).map((_, columnIndex) => (
              <Skeleton
                key={`header-${columnIndex}`}
                variant="text"
                height={cellHeight}
                width={columnIndex === safeColumns - 1 ? "70%" : "88%"}
                animated={animated}
              />
            ))}
          </div>
        ) : null}

        {Array.from({ length: safeRows }).map((_, rowIndex) => (
          <div
            key={`row-${rowIndex}`}
            style={{
              display: "grid",
              gridTemplateColumns: `repeat(${safeColumns}, minmax(0, 1fr))`,
              gap: "0.75rem",
              padding: cellPadding,
              borderBottom:
                rowIndex === safeRows - 1
                  ? "none"
                  : "1px solid var(--ui-border)",
            }}
          >
            {Array.from({ length: safeColumns }).map((__, columnIndex) => (
              <Skeleton
                key={`cell-${rowIndex}-${columnIndex}`}
                variant="text"
                height={cellHeight}
                width={
                  columnIndex === 0
                    ? "76%"
                    : columnIndex === safeColumns - 1
                      ? "62%"
                      : "88%"
                }
                animated={animated}
              />
            ))}
          </div>
        ))}
      </div>
    );
  }
);

SkeletonTable.displayName = "SkeletonTable";