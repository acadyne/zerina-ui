// src/components/data-table/DataTableRoot.tsx
import React from "react";
import {
  resolveSlot,
} from "../../helpers/css";
import type {
  DataTableSlot,
  DataTableSlotProps,
  DataTableStyles,
} from "./dataTable.types";

export interface DataTableRootProps
  extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  loading?: boolean;
  className?: string;
  style?: React.CSSProperties;

  styles?: DataTableStyles;
  slotProps?: DataTableSlotProps;
}

export const DataTableRoot = React.forwardRef<
  HTMLDivElement,
  DataTableRootProps
>(
  (
    {
      children,
      loading = false,
      className = "",
      style,
      styles,
      slotProps,
      ...rest
    },
    ref
  ) => {
    const rootSlot = resolveSlot<DataTableSlot>({
      slot: "root",
      styles,
      slotProps,
      className,
      style,
      baseProps: {
        "aria-busy": loading || undefined,
        "data-ui": "data-table",
        "data-loading": loading || undefined,
      },
      baseStyle: {
        width: "100%",
        minWidth: 0,
      },
    });

    return (
      <div {...rootSlot} ref={ref} {...rest}>
        {children}
      </div>
    );
  }
);

DataTableRoot.displayName = "DataTableRoot";