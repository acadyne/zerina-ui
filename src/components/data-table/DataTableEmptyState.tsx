// src/components/data-table/DataTableEmptyState.tsx
import React from "react";
import { SearchX } from "lucide-react";
import { EmptyState } from "../feedback/EmptyState";
import type { DataTableEmptyStateConfig } from "./dataTable.types";

export interface DataTableEmptyStateProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  emptyState?: DataTableEmptyStateConfig;
  colSpan?: number;
  asTableRow?: boolean;
}

export function DataTableEmptyState({
  emptyState,
  colSpan = 1,
  asTableRow = false,
  ...rest
}: DataTableEmptyStateProps) {
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
      {...rest}
    />
  );

  if (!asTableRow) {
    return content;
  }

  return (
    <tr>
      <td
        colSpan={colSpan}
        style={{
          padding: "1rem",
          borderBottom: "1px solid var(--ui-border)",
        }}
      >
        {content}
      </td>
    </tr>
  );
}