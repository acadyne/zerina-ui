// src/components/data-table/DataTableEmptyState.tsx
import React from "react";
import { SearchX } from "lucide-react";
import { EmptyState } from "../feedback/EmptyState";
import { resolveSlot } from "../../helpers/css";
import type {
  DataTableEmptyStateConfig,
  DataTableSlot,
  DataTableSlotProps,
  DataTableStyles,
} from "./dataTable.types";

export interface DataTableEmptyStateProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  emptyState?: DataTableEmptyStateConfig;
  colSpan?: number;
  asTableRow?: boolean;

  styles?: DataTableStyles;
  slotProps?: DataTableSlotProps;
}

export function DataTableEmptyState({
  emptyState,
  colSpan = 1,
  asTableRow = false,
  className = "",
  style,
  styles,
  slotProps,
  ...rest
}: DataTableEmptyStateProps) {
  const emptySlot = resolveSlot<DataTableSlot>({
    slot: "empty",
    styles,
    slotProps,
    className,
    style,
  });

  const emptyCellSlot = resolveSlot<DataTableSlot>({
    slot: "emptyCell",
    styles,
    slotProps,
    baseStyle: {
      padding: "1rem",
      borderBottom: "1px solid var(--ui-border)",
    },
  });

  const content = (
    <EmptyState
      compact
      bordered={false}
      icon={emptyState?.icon ?? <SearchX size={22} />}
      title={emptyState?.title ?? "Sin resultados"}
      description={
        emptyState?.description ??
        "No hay registros que coincidan con los criterios actuales."
      }
      action={emptyState?.action}
      actionLabel={emptyState?.actionLabel}
      onAction={emptyState?.onAction}
      className={emptySlot.className}
      style={emptySlot.style}
      {...rest}
    />
  );

  if (!asTableRow) {
    return content;
  }

  return (
    <td {...emptyCellSlot} colSpan={colSpan}>
      {content}
    </td>
  );
}