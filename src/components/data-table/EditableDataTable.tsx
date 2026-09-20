// src/components/data-table/EditableDataTable.tsx
import {
  useMemo,
} from "react";

import type {
  DataTableRowId,
  EditableDataTableColumn,
  EditableDataTableProps,
} from "./dataTable.types";

import {
  coerceEditableValue,
  createDataTableRowIdResolver,
} from "./dataTable.utils";

import {
  useDataTableShell,
} from "./useDataTableShell";

import {
  DataTableShellFrame,
} from "./DataTableShellFrame";

import {
  DataTableMobileCards,
} from "./DataTableMobileCards";

import {
  DataTableEditableDesktop,
} from "./DataTableEditableDesktop";


export function EditableDataTable<
  T extends Record<string, unknown>,
  IDType extends DataTableRowId,
>({
  data,
  columns,

  onDataChange,
  onCellChange,

  selectedIds = [],
  onSelectionChange,

  getRowId,
  createEmptyRow,

  exportFilename =
    "tabla_editable",

  enableExportCSV =
    true,

  enableSearch =
    true,

  initialRowsPerPage =
    10,

  dense,

  loading =
    false,

  loadingRows,
  loadingColumns,
  loadingFallback,

  emptyState,

  mobileMode =
    "inherit",

  mobileBreakpoint,

  enableAddRow =
    true,

  enableDeleteRows =
    true,

  enableSelection =
    true,

  styles,
  slotProps,
}: EditableDataTableProps<
  T,
  IDType
>) {
  const searchKeys =
    useMemo(
      () =>
        columns
          .filter(
            (
              column,
            ) =>
              column.searchable !==
              false,
          )
          .map(
            (
              column,
            ) =>
              column.accessor,
          ),
      [
        columns,
      ],
    );


  const runtime =
    useDataTableShell<
      T,
      IDType,
      EditableDataTableColumn<T>
    >({
      data,
      columns,

      searchKeys,
      initialRowsPerPage,

      mobileMode,
      mobileBreakpoint,

      selectedIds,
      onSelectionChange,

      getRowId,

      exportFilename,
      enableSelection,

      loadingRows,
      loadingColumns,
    });


  const {
    table,
    selection,
    getId,
  } = runtime;


  const handleCellChange = (
    row:
      T,

    _visibleRowIndex:
      number,

    column:
      EditableDataTableColumn<T>,

    rawValue:
      string,
  ) => {
    const rowId =
      getId(
        row,
      );


    const rowIndex =
      data.findIndex(
        (
          item,
        ) =>
          getId(
            item,
          ) ===
          rowId,
      );


    if (
      rowIndex <
      0
    ) {
      throw new Error(
        "EditableDataTable could not locate the edited row by its ID.",
      );
    }


    const previousValue =
      data[
        rowIndex
      ][
        column.accessor
      ];


    const nextValue =
      coerceEditableValue(
        rawValue,
        column.type,
      );


    const nextRow = {
      ...data[
        rowIndex
      ],

      [
        column.accessor
      ]:
        nextValue,
    };


    const nextRows = [
      ...data,
    ];

    nextRows[
      rowIndex
    ] =
      nextRow;


    const nextGetId =
      createDataTableRowIdResolver(
        nextRows,
        getRowId,
      );


    const nextRowId =
      nextGetId(
        nextRow,
      );


    if (
      nextRowId !==
      rowId
    ) {
      throw new Error(
        "EditableDataTable row identity cannot change during cell editing.",
      );
    }


    onCellChange?.({
      rowId,

      column:
        column.accessor,

      previousValue,
      nextValue,

      row:
        nextRow,
    });


    onDataChange(
      nextRows,
    );
  };


  const handleAddRow =
    () => {
      const nextRow =
        createEmptyRow();

      const nextRows = [
        ...data,
        nextRow,
      ];


      createDataTableRowIdResolver(
        nextRows,
        getRowId,
      );


      onDataChange(
        nextRows,
      );
    };


  const handleDeleteRows =
    () => {
      if (
        !selection
          .selectedIds
          .length
      ) {
        return;
      }


      const nextRows =
        data.filter(
          (
            row,
          ) =>
            !selection
              .selectedIdSet
              .has(
                getId(
                  row,
                ),
              ),
        );


      onDataChange(
        nextRows,
      );

      onSelectionChange?.(
        [],
      );

      table.resetPage();
    };


  return (
    <DataTableShellFrame
      runtime={
        runtime
      }

      loading={
        loading
      }

      loadingFallback={
        loadingFallback
      }

      enableSearch={
        enableSearch
      }

      enableExportCSV={
        enableExportCSV
      }

      enableAddRow={
        enableAddRow
      }

      onAddRow={
        handleAddRow
      }

      enableDeleteRows={
        enableDeleteRows
      }

      canDeleteRows={
        selection
          .selectedIds
          .length >
        0
      }

      onDeleteRows={
        handleDeleteRows
      }

      styles={
        styles
      }

      slotProps={
        slotProps
      }

      mobileContent={
        <DataTableMobileCards
          editable

          rows={
            table.paginatedData
          }

          columns={
            table.visibleColumns
          }

          selectedIds={
            selection.selectedIds
          }

          enableSelection={
            enableSelection
          }

          getRowId={
            getId
          }

          onToggleRow={
            selection
              .toggleSelectRow
          }

          onCellChange={
            handleCellChange
          }

          emptyState={
            emptyState
          }

          styles={
            styles
          }

          slotProps={
            slotProps
          }
        />
      }

      desktopContent={
        <DataTableEditableDesktop
          rows={
            table.paginatedData
          }

          columns={
            table.visibleColumns
          }

          selectedIds={
            selection.selectedIds
          }

          enableSelection={
            enableSelection
          }

          getRowId={
            getId
          }

          onToggleRow={
            selection
              .toggleSelectRow
          }

          onToggleAll={
            selection
              .toggleSelectAll
          }

          isAllPageSelected={
            selection
              .isAllPageSelected
          }

          isSomePageSelected={
            selection
              .isSomePageSelected
          }

          sortConfig={
            table.sortConfig
          }

          onSort={
            table.toggleSort
          }

          dense={
            dense
          }

          emptyState={
            emptyState
          }

          onCellChange={
            handleCellChange
          }

          styles={
            styles
          }

          slotProps={
            slotProps
          }
        />
      }
    />
  );
}
