// src/components/data-table/DataTableDesktop.tsx
import React from "react";
import { Checkbox } from "../../primitives/forms";
import { Box } from "../../primitives/layout";
import type {
  DataTableColumn,
  DataTableRowId,
  DataTableSortConfig,
} from "./dataTable.types";
import {
  createFallbackRowId,
  getCellText,
  toRenderableValue,
} from "./dataTable.utils";
import { DataTableEmptyState } from "./DataTableEmptyState";

export interface DataTableDesktopProps<
  T extends Record<string, unknown>,
  IDType extends DataTableRowId,
> {
  rows: T[];
  columns: DataTableColumn<T>[];

  selectedIds?: IDType[];
  enableSelection?: boolean;
  getRowId: (row: T) => IDType | undefined;
  onToggleRow?: (id: IDType) => void;
  onToggleAll?: () => void;
  isAllPageSelected?: boolean;
  isSomePageSelected?: boolean;

  sortConfig?: DataTableSortConfig<T>;
  onSort?: (column: DataTableColumn<T>) => void;

  dense?: boolean;
  minTableWidth?: number;
  rowKeyFallback?: (row: T, index: number) => string;

  emptyState?: React.ComponentProps<typeof DataTableEmptyState>["emptyState"];
}

export function DataTableDesktop<
  T extends Record<string, unknown>,
  IDType extends DataTableRowId,
>({
  rows,
  columns,
  selectedIds = [],
  enableSelection = true,
  getRowId,
  onToggleRow,
  onToggleAll,
  isAllPageSelected = false,
  isSomePageSelected = false,
  sortConfig = null,
  onSort,
  dense = true,
  minTableWidth = 760,
  rowKeyFallback,
  emptyState,
}: DataTableDesktopProps<T, IDType>) {
  const cellPad = dense ? "10px" : "14px";
  const fontSize = dense ? "0.90rem" : "0.98rem";

  const colSpan = columns.length + (enableSelection ? 1 : 0);

  return (
    <Box
      style={{
        border: "1px solid var(--ui-border)",
        borderRadius: 12,
        overflow: "hidden",
        background: "var(--ui-bg)",
      }}
    >
      <Box style={{ width: "100%", overflowX: "auto" }}>
        <table
          style={{
            width: "100%",
            borderCollapse: "separate",
            borderSpacing: 0,
            minWidth: minTableWidth,
            tableLayout: "fixed",
            fontSize,
          }}
        >
          <thead>
            <tr>
              {enableSelection ? (
                <th
                  style={{
                    padding: cellPad,
                    width: 44,
                    position: "sticky",
                    top: 0,
                    background: "var(--ui-surface)",
                    zIndex: 2,
                    borderBottom: "1px solid var(--ui-border)",
                  }}
                >
                  <Checkbox
                    checked={isAllPageSelected}
                    indeterminate={isSomePageSelected}
                    onChange={onToggleAll}
                  />
                </th>
              ) : null}

              {columns.map((column, index) => {
                const sortable = !!column.accessor && column.sortable !== false;
                const isSorted =
                  column.accessor && sortConfig?.key === column.accessor;

                const arrow = sortable
                  ? isSorted
                    ? sortConfig?.direction === "asc"
                      ? " ▲"
                      : " ▼"
                    : " ↕"
                  : "";

                return (
                  <th
                    key={`${String(column.header)}-${index}`}
                    onClick={() => onSort?.(column)}
                    title={sortable ? "Ordenar" : undefined}
                    style={{
                      padding: cellPad,
                      textAlign: column.align ?? "left",
                      background: "var(--ui-surface)",
                      color: "var(--ui-text)",
                      userSelect: "none",
                      cursor: sortable ? "pointer" : "default",
                      position: "sticky",
                      top: 0,
                      zIndex: 2,
                      borderBottom: "1px solid var(--ui-border)",
                      width: column.width ?? "auto",
                      whiteSpace: column.nowrap ? "nowrap" : undefined,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {column.header}
                    {arrow}
                  </th>
                );
              })}
            </tr>
          </thead>

          <tbody>
            {rows.map((row, rowIndex) => {
              const rowId = getRowId(row);
              const isSelected =
                rowId !== undefined ? selectedIds.includes(rowId) : false;

              const rowKey =
                rowId !== undefined
                  ? String(rowId)
                  : rowKeyFallback?.(row, rowIndex) ??
                  createFallbackRowId(rowIndex);

              const baseRowBg = isSelected
                ? "var(--ui-surface-2)"
                : rowIndex % 2 === 0
                  ? "var(--ui-bg)"
                  : "var(--ui-surface)";

              return (
                <tr
                  key={rowKey}
                  style={{
                    background: baseRowBg,
                    transition: "background 120ms ease",
                  }}
                  onMouseEnter={(event) => {
                    event.currentTarget.style.background = "var(--ui-surface-hover)";
                  }}
                  onMouseLeave={(event) => {
                    event.currentTarget.style.background = baseRowBg;
                  }}
                >
                  {enableSelection ? (
                    <td
                      style={{
                        padding: cellPad,
                        borderBottom: "1px solid var(--ui-border)",
                      }}
                    >
                      {rowId !== undefined ? (
                        <Checkbox
                          checked={isSelected}
                          onChange={() => onToggleRow?.(rowId)}
                        />
                      ) : null}
                    </td>
                  ) : null}

                  {columns.map((column, columnIndex) => {
                    const rawValue =
                      column.accessor !== undefined
                        ? row[column.accessor as keyof T]
                        : undefined;

                    const renderedContent =
                      typeof column.Cell === "function"
                        ? column.Cell(row)
                        : toRenderableValue(rawValue);

                    const titleText =
                      typeof column.exportValue === "function"
                        ? getCellText(column.exportValue(row))
                        : getCellText(rawValue);

                    return (
                      <td
                        key={`${String(column.header)}-${columnIndex}`}
                        title={titleText || undefined}
                        style={{
                          padding: cellPad,
                          borderBottom: "1px solid var(--ui-border)",
                          textAlign: column.align ?? "left",
                          whiteSpace: column.nowrap ? "nowrap" : "normal",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          verticalAlign: "middle",
                        }}
                      >
                        {renderedContent}
                      </td>
                    );
                  })}
                </tr>
              );
            })}

            {rows.length === 0 ? (
              <DataTableEmptyState
                asTableRow
                colSpan={colSpan}
                emptyState={emptyState}
              />
            ) : null}
          </tbody>
        </table>
      </Box>
    </Box>
  );
}