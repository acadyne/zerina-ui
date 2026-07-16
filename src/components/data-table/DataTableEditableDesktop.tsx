// src/components/data-table/DataTableEditableDesktop.tsx
import React from "react";
import { Checkbox, Input, Select } from "../../primitives/forms";
import {
  resolveSlot,
} from "../../helpers/css";
import type {
  DataTableRowId,
  DataTableSlot,
  DataTableSlotProps,
  DataTableSortConfig,
  DataTableStyles,
  EditableDataTableColumn,
} from "./dataTable.types";
import {
  createFallbackRowId,
  getCellText,
  toRenderableValue,
} from "./dataTable.utils";
import { DataTableEmptyState } from "./DataTableEmptyState";
function getHeaderAriaSort<T extends Record<string, unknown>>({
  sortable,
  isSorted,
  sortConfig,
}: {
  sortable: boolean;
  isSorted: boolean;
  sortConfig: DataTableSortConfig<T>;
}): React.AriaAttributes["aria-sort"] {
  if (!sortable) return undefined;
  if (!isSorted) return "none";

  return sortConfig?.direction === "asc" ? "ascending" : "descending";
}

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

  styles?: DataTableStyles;
  slotProps?: DataTableSlotProps;
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
  styles,
  slotProps,
}: DataTableEditableDesktopProps<T, IDType>) {
  const [hoveredRowKey, setHoveredRowKey] = React.useState<string | null>(null);

  const cellPad = dense ? "8px" : "12px";
  const fontSize = dense ? "0.88rem" : "0.96rem";

  const colSpan = columns.length + (enableSelection ? 1 : 0);

  const rootSlot = resolveSlot<DataTableSlot>({
    slot: "root",
    styles,
    slotProps,
    baseProps: {
      "data-ui-data-table-editable-desktop": "",
    },
    baseStyle: {
      border: "1px solid var(--ui-border)",
      borderRadius: 12,
      overflow: "hidden",
      background: "var(--ui-bg)",
    },
  });

  const viewportSlot = resolveSlot<DataTableSlot>({
    slot: "viewport",
    styles,
    slotProps,
    baseStyle: {
      width: "100%",
      overflowX: "auto",
    },
  });

  const tableSlot = resolveSlot<DataTableSlot>({
    slot: "table",
    styles,
    slotProps,
    baseStyle: {
      width: "100%",
      borderCollapse: "separate",
      borderSpacing: 0,
      minWidth: minTableWidth,
      tableLayout: "fixed",
      fontSize,
    },
  });

  const headSlot = resolveSlot<DataTableSlot>({
    slot: "head",
    styles,
    slotProps,
  });

  const headerRowSlot = resolveSlot<DataTableSlot>({
    slot: "headerRow",
    styles,
    slotProps,
  });

  const bodySlot = resolveSlot<DataTableSlot>({
    slot: "body",
    styles,
    slotProps,
  });

  return (
    <div {...rootSlot}>
      <div {...viewportSlot}>
        <table {...tableSlot}>
          <thead {...headSlot}>
            <tr {...headerRowSlot}>
              {enableSelection ? (
                <th
                  scope="col"
                  aria-label="Selección de filas"
                  {...resolveSlot<DataTableSlot>({
                    slot: "headerCell",
                    styles,
                    slotProps,
                    baseProps: {
                      "data-ui-data-table-selection-header": "",
                    },
                    baseStyle: {
                      padding: cellPad,
                      width: 44,
                      position: "sticky",
                      top: 0,
                      background: "var(--ui-surface)",
                      zIndex: 2,
                      borderBottom: "1px solid var(--ui-border)",
                    },
                  })}
                >
                  <Checkbox
                    checked={isAllPageSelected}
                    indeterminate={isSomePageSelected}
                    aria-label="Seleccionar todas las filas de la página"
                    onChange={onToggleAll}
                  />
                </th>
              ) : null}

              {columns.map((column, index) => {
                const sortable = column.sortable !== false;
                const isSorted = sortConfig?.key === column.accessor;
                const ariaSort = getHeaderAriaSort({
                  sortable,
                  isSorted,
                  sortConfig,
                });

                const handleSort = () => {
                  if (!sortable) return;
                  onSort?.(column);
                };
                const arrow = sortable
                  ? isSorted
                    ? sortConfig?.direction === "asc"
                      ? " ▲"
                      : " ▼"
                    : " ↕"
                  : "";

                return (
                  <th
                    scope="col"
                    aria-sort={ariaSort}
                  >
                    {sortable ? (
                      <button
                        type="button"
                        onClick={handleSort}
                        style={{
                          width: "100%",
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent:
                            column.align === "right"
                              ? "flex-end"
                              : column.align === "center"
                                ? "center"
                                : "flex-start",
                          gap: "0.25rem",
                          padding: 0,
                          border: 0,
                          background: "transparent",
                          color: "inherit",
                          font: "inherit",
                          fontWeight: "inherit",
                          textAlign: "inherit",
                          cursor: "pointer",
                        }}
                      >
                        <span>{column.header}</span>

                        <span aria-hidden="true">
                          {arrow}
                        </span>
                      </button>
                    ) : (
                      column.header
                    )}
                  </th>
                );
              })}
            </tr>
          </thead>

          <tbody {...bodySlot}>
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

              const rowSlot = resolveSlot<DataTableSlot>({
                slot: "row",
                styles,
                slotProps,
                baseProps: {
                  "data-ui-data-table-row": "",
                  "data-ui-data-table-row-index": String(rowIndex),
                  "data-ui-data-table-row-selected": isSelected || undefined,
                },
                baseStyle: {
                  background:
                    hoveredRowKey === rowKey
                      ? "var(--ui-surface-hover)"
                      : baseRowBg,
                  transition: "background 120ms ease",
                },
              });

              return (
                <tr
                  key={rowKey}
                  {...rowSlot}
                  onMouseEnter={() => {
                    setHoveredRowKey(rowKey);
                  }}
                  onMouseLeave={() => {
                    setHoveredRowKey((current) =>
                      current === rowKey ? null : current
                    );
                  }}
                >
                  {enableSelection ? (
                    <td
                      {...resolveSlot<DataTableSlot>({
                        slot: "selectionCell",
                        styles,
                        slotProps,
                        baseStyle: {
                          padding: cellPad,
                          borderBottom: "1px solid var(--ui-border)",
                        },
                      })}
                    >
                      {rowId !== undefined ? (
                        <Checkbox
                          checked={isSelected}
                          aria-label={`Seleccionar fila ${rowIndex + 1}`}
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
                        {...resolveSlot<DataTableSlot>({
                          slot: "cell",
                          styles,
                          slotProps,
                          baseProps: {
                            title: titleText || undefined,
                            "data-ui-data-table-column-index":
                              String(columnIndex),
                          },
                          baseStyle: {
                            padding: cellPad,
                            borderBottom: "1px solid var(--ui-border)",
                            textAlign: column.align ?? "left",
                            whiteSpace: column.nowrap ? "nowrap" : "normal",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            verticalAlign: "middle",
                          },
                        })}
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
      </div>
    </div>
  );
}