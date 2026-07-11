// src/components/data-table/DataTableDesktop.tsx
import React from "react";
import { Checkbox } from "../../primitives/forms";
import {
  resolveSlot,
} from "../../helpers/css";
import type {
  DataTableColumn,
  DataTableRowId,
  DataTableSlot,
  DataTableSlotProps,
  DataTableSortConfig,
  DataTableStyles,
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

function handleSortableHeaderKeyDown(
  event: React.KeyboardEvent<HTMLTableCellElement>,
  sortable: boolean,
  onSort: (() => void) | undefined
) {
  if (!sortable) return;

  if (event.key !== "Enter" && event.key !== " ") return;

  event.preventDefault();
  onSort?.();
}

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

  styles?: DataTableStyles;
  slotProps?: DataTableSlotProps;
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
  styles,
  slotProps,
}: DataTableDesktopProps<T, IDType>) {
  const [hoveredRowKey, setHoveredRowKey] = React.useState<string | null>(null);

  const cellPad = dense ? "10px" : "14px";
  const fontSize = dense ? "0.90rem" : "0.98rem";

  const colSpan = columns.length + (enableSelection ? 1 : 0);

  const rootSlot = resolveSlot<DataTableSlot>({
    slot: "root",
    styles,
    slotProps,
    baseProps: {
      "data-ui-data-table-desktop": "",
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
                const sortable = !!column.accessor && column.sortable !== false;
                const isSorted =
                  column.accessor && sortConfig?.key === column.accessor;
                const ariaSort = getHeaderAriaSort({
                  sortable,
                  isSorted: Boolean(isSorted),
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
                    key={`${String(column.header)}-${index}`}
                    scope="col"
                    aria-sort={ariaSort}
                    tabIndex={sortable ? 0 : undefined}
                    {...resolveSlot<DataTableSlot>({
                      slot: "headerCell",
                      styles,
                      slotProps,
                      baseProps: {
                        title: sortable ? "Ordenar" : undefined,
                        "data-ui-data-table-column-index": String(index),
                        "data-ui-data-table-sortable": sortable || undefined,
                      },
                      baseStyle: {
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
                      },
                    })}
                    onClick={handleSort}
                    onKeyDown={(event) => {
                      handleSortableHeaderKeyDown(event, sortable, handleSort);
                    }}
                  >
                    {column.header}
                    {arrow}
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
                ? "var(--ui-surface-2)"
                : rowIndex % 2 === 0
                  ? "var(--ui-bg)"
                  : "var(--ui-surface)";

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
      </div>
    </div>
  );
}