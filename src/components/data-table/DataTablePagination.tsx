// src/components/data-table/DataTablePagination.tsx
import React from "react";
import { Button } from "../../primitives/forms";
import { resolveSlot } from "../../helpers/css";
import type {
  DataTableSlot,
  DataTableSlotProps,
  DataTableStyles,
} from "./dataTable.types";

export interface DataTablePaginationProps
  extends React.HTMLAttributes<HTMLDivElement> {
  page: number;
  totalPages: number;
  totalRows: number;
  previousLabel?: React.ReactNode;
  nextLabel?: React.ReactNode;
  onPreviousPage: () => void;
  onNextPage: () => void;

  styles?: DataTableStyles;
  slotProps?: DataTableSlotProps;
}

export const DataTablePagination = React.forwardRef<
  HTMLDivElement,
  DataTablePaginationProps
>(
  (
    {
      page,
      totalPages,
      totalRows,
      previousLabel = "Anterior",
      nextLabel = "Siguiente",
      onPreviousPage,
      onNextPage,
      className = "",
      style,
      styles,
      slotProps,
      ...rest
    },
    ref
  ) => {
    const paginationSlot = resolveSlot<DataTableSlot>({
      slot: "pagination",
      styles,
      slotProps,
      className,
      style,
      baseProps: {
        "data-ui": "data-table-pagination",
      },
      baseStyle: {
        padding: "12px 2px 0",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 12,
        flexWrap: "wrap",
        minWidth: 0,
      },
    });

    const infoSlot = resolveSlot<DataTableSlot>({
      slot: "paginationInfo",
      styles,
      slotProps,
      baseStyle: {
        margin: 0,
        opacity: 0.85,
        fontSize: "var(--ui-font-size-sm)",
        color: "var(--ui-text-muted)",
      },
    });

    const actionsSlot = resolveSlot<DataTableSlot>({
      slot: "paginationActions",
      styles,
      slotProps,
      baseStyle: {
        display: "contents",
      },
    });

    return (
      <div {...paginationSlot} ref={ref} {...rest}>
        <div {...actionsSlot}>
          <Button
            type="button"
            onClick={onPreviousPage}
            disabled={page <= 1}
          >
            {previousLabel}
          </Button>

          <span {...infoSlot}>
            Página {page} de {totalPages} · {totalRows} registros
          </span>

          <Button
            type="button"
            onClick={onNextPage}
            disabled={page >= totalPages}
          >
            {nextLabel}
          </Button>
        </div>
      </div>
    );
  }
);

DataTablePagination.displayName = "DataTablePagination";