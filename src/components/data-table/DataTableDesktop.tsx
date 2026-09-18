import React from "react";

import type {
  DataTableColumn,
  DataTableRowId,
  DataTableSlotProps,
  DataTableSortConfig,
  DataTableStyles,
} from "./dataTable.types";

import {
  getCellText,
  toRenderableValue,
} from "./dataTable.utils";

import {
  DataTableEmptyState,
} from "./DataTableEmptyState";

import {
  DataTableDesktopBase,
} from "./DataTableDesktopBase";


export interface DataTableDesktopProps<
  T extends Record<string, unknown>,
  IDType extends DataTableRowId,
> {
  rows: T[];
  columns: DataTableColumn<T>[];

  selectedIds?: IDType[];
  enableSelection?: boolean;
  getRowId: (row: T) => IDType;
  onToggleRow?: (id: IDType) => void;
  onToggleAll?: () => void;
  isAllPageSelected?: boolean;
  isSomePageSelected?: boolean;

  sortConfig?: DataTableSortConfig<T>;
  onSort?: (
    column: DataTableColumn<T>,
  ) => void;

  dense?: boolean;
  minTableWidth?: number;

  emptyState?:
    React.ComponentProps<
      typeof DataTableEmptyState
    >["emptyState"];

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

  emptyState,

  styles,
  slotProps,
}: DataTableDesktopProps<
  T,
  IDType
>) {
  const cellPadding =
    dense
      ? "10px"
      : "14px";

  const fontSize =
    dense
      ? "0.90rem"
      : "0.98rem";

  return (
    <DataTableDesktopBase<
      T,
      IDType,
      DataTableColumn<T>
    >
      rows={rows}
      columns={columns}
      selectedIds={
        selectedIds
      }
      enableSelection={
        enableSelection
      }
      getRowId={
        getRowId
      }
      onToggleRow={
        onToggleRow
      }
      onToggleAll={
        onToggleAll
      }
      isAllPageSelected={
        isAllPageSelected
      }
      isSomePageSelected={
        isSomePageSelected
      }
      sortConfig={
        sortConfig
      }
      onSort={onSort}
      minTableWidth={
        minTableWidth
      }
      cellPadding={
        cellPadding
      }
      fontSize={
        fontSize
      }
      emptyState={
        emptyState
      }
      styles={styles}
      slotProps={
        slotProps
      }
      rootDataAttribute="data-ui-data-table-desktop"
      renderCell={(
        row,
        _rowIndex,
        column,
      ) => {
        const rawValue =
          column.accessor !==
          undefined
            ? row[
                column.accessor
              ]
            : undefined;

        return typeof column.Cell ===
          "function"
          ? column.Cell(
              row,
            )
          : toRenderableValue(
              rawValue,
            );
      }}
      getCellTitle={(
        row,
        _rowIndex,
        column,
      ) => {
        const rawValue =
          column.accessor !==
          undefined
            ? row[
                column.accessor
              ]
            : undefined;

        return typeof column.exportValue ===
          "function"
          ? getCellText(
              column.exportValue(
                row,
              ),
            )
          : getCellText(
              rawValue,
            );
      }}
    />
  );
}
