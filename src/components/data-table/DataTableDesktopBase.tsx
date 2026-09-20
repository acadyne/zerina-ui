import React from "react";

import {
  Checkbox,
} from "../../primitives/forms";

import {
  resolveSlot,
  type SlotElementProps,
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
  getDataTableColumnId,
  getDataTableRowKey,
} from "./dataTable.utils";

import {
  DataTableEmptyState,
} from "./DataTableEmptyState";


export interface DataTableDesktopBaseProps<
  T extends Record<string, unknown>,
  IDType extends DataTableRowId,
  TColumn extends DataTableColumn<T>,
> {
  rows: T[];
  columns: TColumn[];

  selectedIds?: IDType[];
  enableSelection?: boolean;
  getRowId: (row: T) => IDType;
  onToggleRow?: (id: IDType) => void;
  onToggleAll?: () => void;
  isAllPageSelected?: boolean;
  isSomePageSelected?: boolean;

  sortConfig?: DataTableSortConfig<T>;
  onSort?: (column: TColumn) => void;

  minTableWidth: number;
  cellPadding: string;
  fontSize: string;

  emptyState?:
    React.ComponentProps<
      typeof DataTableEmptyState
    >["emptyState"];

  styles?: DataTableStyles;
  slotProps?: DataTableSlotProps;

  rootDataAttribute:
    `data-${string}`;

  renderCell: (
    row: T,
    rowIndex: number,
    column: TColumn,
  ) => React.ReactNode;

  getCellTitle: (
    row: T,
    rowIndex: number,
    column: TColumn,
  ) => string;
}

function getHeaderAriaSort<
  T extends Record<string, unknown>,
>({
  sortable,
  isSorted,
  sortConfig,
}: {
  sortable: boolean;
  isSorted: boolean;
  sortConfig: DataTableSortConfig<T>;
}): React.AriaAttributes["aria-sort"] {
  if (!sortable) {
    return undefined;
  }

  if (!isSorted) {
    return "none";
  }

  return sortConfig?.direction === "asc"
    ? "ascending"
    : "descending";
}

/**
 * Renderer desktop único para DataTable y EditableDataTable.
 *
 * Selección, sorting, slots, filas, celdas, empty-state y estructura de tabla
 * viven aquí. Cada variante sólo aporta cómo renderiza y describe una celda.
 */
export function DataTableDesktopBase<
  T extends Record<string, unknown>,
  IDType extends DataTableRowId,
  TColumn extends DataTableColumn<T>,
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

  minTableWidth,
  cellPadding,
  fontSize,

  emptyState,

  styles,
  slotProps,

  rootDataAttribute,

  renderCell,
  getCellTitle,
}: DataTableDesktopBaseProps<
  T,
  IDType,
  TColumn
>) {
  const colSpan =
    columns.length +
    (enableSelection ? 1 : 0);

  const rootSlot =
    resolveSlot<DataTableSlot>({
      slot: "root",
      styles,
      slotProps,

      baseProps: {
        [rootDataAttribute]:
          "",
      } as SlotElementProps,

      baseStyle: {
        border:
          "1px solid var(--ui-border)",

        borderRadius:
          "var(--ui-radius-xl)",

        overflow:
          "hidden",

        background:
          "var(--ui-surface)",

        boxShadow:
          "var(--ui-elevation-1)",
      },
    });

  const viewportSlot =
    resolveSlot<DataTableSlot>({
      slot: "viewport",
      styles,
      slotProps,

      baseStyle: {
        width:
          "100%",

        overflowX:
          "auto",
      },
    });

  const tableSlot =
    resolveSlot<DataTableSlot>({
      slot: "table",
      styles,
      slotProps,

      baseStyle: {
        width:
          "100%",

        borderCollapse:
          "separate",

        borderSpacing:
          0,

        minWidth:
          minTableWidth,

        tableLayout:
          "fixed",

        fontSize,
      },
    });

  const headSlot =
    resolveSlot<DataTableSlot>({
      slot: "head",
      styles,
      slotProps,
    });

  const headerRowSlot =
    resolveSlot<DataTableSlot>({
      slot: "headerRow",
      styles,
      slotProps,
    });

  const bodySlot =
    resolveSlot<DataTableSlot>({
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
                    slot:
                      "headerCell",

                    styles,
                    slotProps,

                    baseProps: {
                      "data-ui-data-table-selection-header":
                        "",
                    },

                    baseStyle: {
                      padding:
                        cellPadding,

                      width:
                        44,

                      position:
                        "sticky",

                      top:
                        0,

                      background:
                        "var(--ui-surface-container-low)",

                      color:
                        "var(--ui-text-muted)",

                      zIndex:
                        2,

                      borderBottom:
                        "1px solid var(--ui-border)",

                      boxSizing:
                        "border-box",
                    },
                  })}
                >
                  <Checkbox
                    checked={
                      isAllPageSelected
                    }
                    indeterminate={
                      isSomePageSelected
                    }
                    aria-label="Seleccionar todas las filas de la página"
                    onChange={
                      onToggleAll
                    }
                  />
                </th>
              ) : null}

              {columns.map(
                (
                  column,
                ) => {
                  const sortable =
                    column.accessor !==
                      undefined &&
                    column.sortable !==
                      false;

                  const isSorted =
                    column.accessor !==
                      undefined &&
                    sortConfig?.key ===
                      column.accessor;

                  const ariaSort =
                    getHeaderAriaSort({
                      sortable,
                      isSorted,
                      sortConfig,
                    });

                  const handleSort =
                    () => {
                      if (
                        !sortable
                      ) {
                        return;
                      }

                      onSort?.(
                        column,
                      );
                    };

                  const arrow =
                    sortable
                      ? isSorted
                        ? sortConfig
                            ?.direction ===
                          "asc"
                          ? " ▲"
                          : " ▼"
                        : " ↕"
                      : "";

                  return (
                    <th
                      key={
                        getDataTableColumnId(
                          column,
                        )
                      }
                      scope="col"
                      aria-sort={
                        ariaSort
                      }
                      {...resolveSlot<DataTableSlot>({
                        slot:
                          "headerCell",

                        styles,
                        slotProps,

                        baseProps: {
                          "data-ui-data-table-header-cell":
                            "",

                          "data-sortable":
                            sortable ||
                            undefined,
                        },

                        baseStyle: {
                          padding:
                            cellPadding,

                          width:
                            column.width,

                          position:
                            "sticky",

                          top:
                            0,

                          zIndex:
                            1,

                          background:
                            "var(--ui-surface-container-low)",

                          color:
                            "var(--ui-text-muted)",

                          borderBottom:
                            "1px solid var(--ui-border)",

                          textAlign:
                            column.align ??
                            "left",

                          verticalAlign:
                            "middle",

                          boxSizing:
                            "border-box",
                        },
                      })}
                    >
                      {sortable ? (
                        <button
                          type="button"
                          onClick={
                            handleSort
                          }
                          style={{
                            width:
                              "100%",

                            display:
                              "inline-flex",

                            alignItems:
                              "center",

                            justifyContent:
                              column.align ===
                              "right"
                                ? "flex-end"
                                : column.align ===
                                    "center"
                                  ? "center"
                                  : "flex-start",

                            gap:
                              "0.25rem",

                            padding:
                              0,

                            border:
                              0,

                            background:
                              "transparent",

                            color:
                              "inherit",

                            font:
                              "inherit",

                            fontWeight:
                              "inherit",

                            textAlign:
                              "inherit",

                            cursor:
                              "pointer",
                          }}
                        >
                          <span>
                            {
                              column.header
                            }
                          </span>

                          <span
                            aria-hidden="true"
                          >
                            {arrow}
                          </span>
                        </button>
                      ) : (
                        column.header
                      )}
                    </th>
                  );
                },
              )}
            </tr>
          </thead>

          <tbody {...bodySlot}>
            {rows.map(
              (
                row,
                rowIndex,
              ) => {
                const rowId =
                  getRowId(
                    row,
                  );

                const isSelected =
                  selectedIds.includes(
                    rowId,
                  );

                const rowKey =
                  getDataTableRowKey(
                    rowId,
                  );

                const rowSlot =
                  resolveSlot<DataTableSlot>({
                    slot: "row",
                    styles,
                    slotProps,

                    baseProps: {
                      "data-ui-data-table-row":
                        "",

                      "data-ui-data-table-row-index":
                        String(
                          rowIndex,
                        ),

                      "data-selected":
                        isSelected ||
                        undefined,
                    },
                  });

                return (
                  <tr
                    key={
                      rowKey
                    }
                    {...rowSlot}
                  >
                    {enableSelection ? (
                      <td
                        {...resolveSlot<DataTableSlot>({
                          slot:
                            "selectionCell",

                          styles,
                          slotProps,

                          baseStyle: {
                            padding:
                              cellPadding,

                            borderBottom:
                              "1px solid var(--ui-border)",
                          },
                        })}
                      >
                        <Checkbox
                          checked={
                            isSelected
                          }
                          aria-label={`Seleccionar fila ${rowIndex + 1}`}
                          onChange={() =>
                            onToggleRow?.(
                              rowId,
                            )
                          }
                        />
                      </td>
                    ) : null}

                    {columns.map(
                      (
                        column,
                        columnIndex,
                      ) => {
                        const titleText =
                          getCellTitle(
                            row,
                            rowIndex,
                            column,
                          );

                        return (
                          <td
                            key={
                              getDataTableColumnId(
                                column,
                              )
                            }
                            {...resolveSlot<DataTableSlot>({
                              slot:
                                "cell",

                              styles,
                              slotProps,

                              baseProps: {
                                title:
                                  titleText ||
                                  undefined,

                                "data-ui-data-table-column-index":
                                  String(
                                    columnIndex,
                                  ),
                              },

                              baseStyle: {
                                padding:
                                  cellPadding,

                                width:
                                  column.width,

                                borderBottom:
                                  "1px solid var(--ui-border)",

                                boxSizing:
                                  "border-box",

                                textAlign:
                                  column.align ??
                                  "left",

                                whiteSpace:
                                  column.nowrap
                                    ? "nowrap"
                                    : "normal",

                                overflow:
                                  "hidden",

                                textOverflow:
                                  "ellipsis",

                                verticalAlign:
                                  "middle",
                              },
                            })}
                          >
                            {renderCell(
                              row,
                              rowIndex,
                              column,
                            )}
                          </td>
                        );
                      },
                    )}
                  </tr>
                );
              },
            )}

            {rows.length === 0 ? (
              <DataTableEmptyState
                asTableRow
                colSpan={
                  colSpan
                }
                emptyState={
                  emptyState
                }
              />
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
