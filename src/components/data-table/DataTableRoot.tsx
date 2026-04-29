// src/components/data-table/DataTableRoot.tsx
import React from "react";
import { Box } from "../../primitives/layout";

export interface DataTableRootProps
  extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  loading?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export const DataTableRoot = React.forwardRef<
  HTMLDivElement,
  DataTableRootProps
>(({ children, loading = false, className = "", style, ...rest }, ref) => {
  return (
    <Box
      ref={ref as React.Ref<Element>}
      className={className}
      aria-busy={loading || undefined}
      data-ui="data-table"
      data-loading={loading || undefined}
      style={{
        width: "100%",
        minWidth: 0,
        ...style,
      }}
      {...rest}
    >
      {children}
    </Box>
  );
});

DataTableRoot.displayName = "DataTableRoot";