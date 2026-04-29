// src/components/data-table/DataTableEditableDesktop.tsx
import React from "react";
import { Checkbox, Input, Select } from "../../primitives/forms";
import { Box } from "../../primitives/layout";
import type {
  DataTableRowId,
  DataTableSortConfig,
  EditableDataTableColumn,
} from "./dataTable.types";
import {
  createFallbackRowId,
  getCellText,
  toRenderableValue,
} from "./dataTable.utils";
import { DataTableEmptyState } from "./DataTableEmptyState";

export interface DataTableEditableDesktopProps<
  T extends Record<string, unknown>,
  IDType extends DataTableRowId,
> {
  rows: T[];
  columns: EditableDataTableColumn<T>[];

  selectedIds?: IDType[];
  enableSelection?: boolean;
  getRowId: (row: T) => IDType | undefined;
  onToggleRow?: (id: IDType) => void;
  onToggleAll?: () => void;
  isAllPageSelected?: boolean;
  isSomePageSelected?: boolean;

  sortConfig?: DataTableSortConfig<T>;
  onSort?: (column: EditableDataTableColumn<T>) => void;

  dense?: boolean;
  minTableWidth?: number;
  rowKeyFallback?: (row: T, index: number) => string;

  emptyState?: React.ComponentProps<typeof DataTableEmptyState>["emptyState"];

  onCellChange: (
    row: T,
    rowIndex: number,
    column: EditableDataTableColumn<T>,
    value: string
  ) => void;
}

function readCellValue<T extends Record<string, unknown>>(
  row: T,
  accessor: keyof T
): unknown {
  return row[accessor];
}

function renderCellEditor<T extends Record<string, unknown>>({
  row,
  rowIndex,
  column,
  onChange,
}: {
  row: T;
  rowIndex: number;
  column: EditableDataTableColumn<T>;
  onChange: (
    row: T,
    rowIndex: number,
    column: EditableDataTableColumn<T>,
    value: string
  ) => void;
}) {
  const value = readCellValue(row, column.accessor);
  const textValue = value == null ? "" : String(value);
  const editable = column.editable !== false;

  if (!editable) {
    return toRenderableValue(value);
  }

  if (column.type === "boolean") {
    return (
      <Select
        value={String(Boolean(value))}
        onChange={(event) =>
          onChange(row, rowIndex, column, event.currentTarget.value)
        }
        fullWidth={false}
        options={[
          { label: "true", value: "true" },
          { label: "false", value: "false" },
        ]}
      />
    );
  }

  if (column.type === "enum" && column.options?.length) {
    return (
      <Select
        value={textValue}
        onChange={(event) =>
          onChange(row, rowIndex, column, event.currentTarget.value)
        }
        fullWidth={false}
        options={column.options}
      />
    );
  }

  return (
    <Input
      value={textValue}
      placeholder={column.placeholder}
      fullWidth={false}
      onChange={(event) =>
        onChange(row, rowIndex, column, event.currentTarget.value)
      }
      style={{
        minWidth: column.type === "text" ? 260 : 160,
      }}
    />
  );
}

export function DataTableEditableDesktop<
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
  minTableWidth = 860,
  rowKeyFallback,
  emptyState,
  onCellChange,
}: DataTableEditableDesktopProps<T, IDType>) {
  const cellPad = dense ? "8px" : "12px";
  const fontSize = dense ? "0.88rem" : "0.96rem";

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
                const sortable = column.sortable !== false;
                const isSorted = sortConfig?.key === column.accessor;

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
                ? "var(--ui-surface)"
                : rowIndex % 2 === 0
                  ? "var(--ui-bg)"
                  : "rgba(255,255,255,0.02)";

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
                    const rawValue = row[column.accessor];
                    const titleText = getCellText(rawValue);

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
                        {renderCellEditor({
                          row,
                          rowIndex,
                          column,
                          onChange: onCellChange,
                        })}
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