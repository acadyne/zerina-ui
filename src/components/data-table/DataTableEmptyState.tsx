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

interface DataTableEmptyStateBaseProps
  extends Omit<
    React.HTMLAttributes<HTMLDivElement>,
    "title"
  > {
  emptyState?: DataTableEmptyStateConfig;

  styles?: DataTableStyles;
  slotProps?: DataTableSlotProps;
}

interface DataTableEmptyStateStandaloneProps
  extends DataTableEmptyStateBaseProps {
  asTableRow?: false;
  colSpan?: never;
}

interface DataTableEmptyStateTableRowProps
  extends DataTableEmptyStateBaseProps {
  asTableRow: true;
  colSpan: number;
}

export type DataTableEmptyStateProps =
  | DataTableEmptyStateStandaloneProps
  | DataTableEmptyStateTableRowProps;

export function DataTableEmptyState({
  emptyState,
  asTableRow = false,
  colSpan,
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

  const content = (
    <EmptyState
      compact
      bordered={false}
      icon={
        emptyState?.icon ??
        <SearchX size={22} />
      }
      title={
        emptyState?.title ??
        "Sin resultados"
      }
      description={
        emptyState?.description ??
        "No hay registros que coincidan con los criterios actuales."
      }
      action={emptyState?.action}
      actionLabel={
        emptyState?.actionLabel
      }
      onAction={
        emptyState?.onAction
      }
      className={
        emptySlot.className
      }
      style={emptySlot.style}
      {...rest}
    />
  );

  if (!asTableRow) {
    return content;
  }

  const emptyCellSlot =
    resolveSlot<DataTableSlot>({
      slot: "emptyCell",
      styles,
      slotProps,
      baseStyle: {
        padding: "1rem",
        borderBottom:
          "1px solid var(--ui-border)",
      },
    });

  /*
   * tbody solo admite filas como descendientes directos. La fila permanece
   * estructural y emptyCell conserva la personalización sobre la celda para
   * que el modo móvil no herede elementos ni atributos exclusivos de tabla.
   */
  return (
    <tr
      data-ui-data-table-empty-row=""
    >
      <td
        {...emptyCellSlot}
        colSpan={colSpan}
      >
        {content}
      </td>
    </tr>
  );
}
