import React from "react";

import {
  Input,
  Select,
} from "../../primitives/forms";

import type {
  DataTableRowId,
  DataTableSlotProps,
  DataTableSortConfig,
  DataTableStyles,
  EditableDataTableColumn,
} from "./dataTable.types";

import {
  getCellText,
  getEditableCellAriaLabel,
  toRenderableValue,
} from "./dataTable.utils";

import {
  DataTableEmptyState,
} from "./DataTableEmptyState";

import {
  DataTableDesktopBase,
} from "./DataTableDesktopBase";


export interface DataTableEditableDesktopProps<
  T extends Record<string, unknown>,
  IDType extends DataTableRowId,
> {
  rows: T[];
  columns:
    EditableDataTableColumn<T>[];

  selectedIds?: IDType[];
  enableSelection?: boolean;
  getRowId: (row: T) => IDType;
  onToggleRow?: (id: IDType) => void;
  onToggleAll?: () => void;
  isAllPageSelected?: boolean;
  isSomePageSelected?: boolean;

  sortConfig?: DataTableSortConfig<T>;
  onSort?: (
    column:
      EditableDataTableColumn<T>,
  ) => void;

  dense?: boolean;
  minTableWidth?: number;

  emptyState?:
    React.ComponentProps<
      typeof DataTableEmptyState
    >["emptyState"];

  onCellChange: (
    row: T,
    rowIndex: number,
    column:
      EditableDataTableColumn<T>,
    value: string,
  ) => void;

  styles?: DataTableStyles;
  slotProps?: DataTableSlotProps;
}


function renderCellEditor<
  T extends Record<
    string,
    unknown
  >,
>({
  row,
  rowIndex,
  column,
  onChange,
}: {
  row: T;
  rowIndex: number;

  column:
    EditableDataTableColumn<T>;

  onChange: (
    row: T,
    rowIndex: number,
    column:
      EditableDataTableColumn<T>,
    value: string,
  ) => void;
}) {
  const value =
    row[
      column.accessor
    ];

  const textValue =
    value == null
      ? ""
      : String(
          value,
        );

  const editable =
    column.editable !==
    false;

  const editorAriaLabel =
    getEditableCellAriaLabel(
      column.header,
      rowIndex,
    );

  if (!editable) {
    return toRenderableValue(
      value,
    );
  }

  if (
    column.type ===
    "boolean"
  ) {
    return (
      <Select
        aria-label={
          editorAriaLabel
        }
        value={
          value
            ? "true"
            : "false"
        }
        onChange={(
          event,
        ) =>
          onChange(
            row,
            rowIndex,
            column,
            event
              .currentTarget
              .value,
          )
        }
        size="sm"
        fullWidth
        options={[
          {
            label:
              "true",
            value:
              "true",
          },
          {
            label:
              "false",
            value:
              "false",
          },
        ]}
      />
    );
  }

  if (
    column.type ===
      "enum" &&
    column.options
      ?.length
  ) {
    return (
      <Select
        aria-label={
          editorAriaLabel
        }
        value={
          textValue
        }
        onChange={(
          event,
        ) =>
          onChange(
            row,
            rowIndex,
            column,
            event
              .currentTarget
              .value,
          )
        }
        size="sm"
        fullWidth
        options={
          column.options
        }
      />
    );
  }

  return (
    <Input
      aria-label={
        editorAriaLabel
      }
      value={
        textValue
      }
      placeholder={
        column.placeholder
      }
      size="sm"
      fullWidth
      onChange={(
        event,
      ) =>
        onChange(
          row,
          rowIndex,
          column,
          event
            .currentTarget
            .value,
        )
      }
      style={{
        width: "100%",
        minWidth: 0,
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

  dense,
  minTableWidth = 860,

  emptyState,
  onCellChange,

  styles,
  slotProps,
}: DataTableEditableDesktopProps<
  T,
  IDType
>) {
  const cellPadding =
    dense === true
      ? "var(--ui-density-compact-content-padding)"
      : dense === false
        ? "var(--ui-density-comfortable-content-padding)"
        : "var(--ui-density-content-padding, var(--ui-density-comfortable-content-padding))";

  return (
    <DataTableDesktopBase<
      T,
      IDType,
      EditableDataTableColumn<T>
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
      emptyState={
        emptyState
      }
      styles={styles}
      slotProps={
        slotProps
      }
      rootDataAttribute="data-ui-data-table-editable-desktop"
      renderCell={(
        row,
        rowIndex,
        column,
      ) =>
        renderCellEditor({
          row,
          rowIndex,
          column,
          onChange:
            onCellChange,
        })
      }
      getCellTitle={(
        row,
        _rowIndex,
        column,
      ) =>
        getCellText(
          row[
            column.accessor
          ],
        )
      }
    />
  );
}
