// src/components/data-table/EditableDataTable.tsx
import { useMemo } from "react";
import type {
  DataTableRowId,
  EditableDataTableColumn,
  EditableDataTableProps,
} from "./dataTable.types";
import { coerceEditableValue } from "./dataTable.utils";
import {
  useDataTableExport,
  useDataTableResponsiveMode,
  useDataTableSelection,
  useDataTableState,
} from "./hooks";
import { DataTableRoot } from "./DataTableRoot";
import { DataTableToolbar } from "./DataTableToolbar";
import { DataTableMobileCards } from "./DataTableMobileCards";
import { DataTablePagination } from "./DataTablePagination";
import { DataTableSkeleton } from "./DataTableSkeleton";
import { DataTableEditableDesktop } from "./DataTableEditableDesktop";

function createDefaultEditableRow<T extends Record<string, unknown>>(
  columns: EditableDataTableColumn<T>[]
): T {
  return columns.reduce((acc, column) => {
    acc[column.accessor as string] =
      column.accessor === "id"
        ? globalThis.crypto?.randomUUID?.() ?? String(Date.now())
        : column.type === "boolean"
          ? false
          : "";

    return acc;
  }, {} as Record<string, unknown>) as T;
}

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

  exportFilename = "tabla_editable",
  enableExportCSV = true,
  enableSearch = true,
  initialRowsPerPage = 10,

  dense = true,

  loading = false,
  loadingRows,
  loadingColumns,
  loadingFallback,

  emptyState,

  mobileMode = "inherit",
  mobileBreakpoint,

  enableAddRow = true,
  enableDeleteRows = true,
  enableSelection = true,

  styles,
  slotProps,
}: EditableDataTableProps<T, IDType>) {
  const searchKeys = useMemo(
    () =>
      columns
        .filter((column) => column.searchable !== false)
        .map((column) => column.accessor),
    [columns]
  );

  const table = useDataTableState<T, EditableDataTableColumn<T>>({
    data,
    columns,
    searchKeys,
    initialRowsPerPage,
  });

  const isMobile = useDataTableResponsiveMode({
    mobileMode,
    mobileBreakpoint,
  });

  const getId = useMemo(() => {
    return (row: T): IDType | undefined => {
      if (getRowId) return getRowId(row);

      const rawId = row.id;
      if (typeof rawId === "string" || typeof rawId === "number") {
        return rawId as IDType;
      }

      return undefined;
    };
  }, [getRowId]);

  const selection = useDataTableSelection<T, IDType>({
    rows: table.paginatedData,
    selectedIds,
    onSelectionChange,
    getRowId: getId,
  });

  const csv = useDataTableExport<T>({
    rows: table.sortedData,
    columns: table.visibleColumns,
    filename: exportFilename,
  });

  const handleCellChange = (
    row: T,
    _visibleRowIndex: number,
    column: EditableDataTableColumn<T>,
    rawValue: string
  ) => {
    const rowId = getId(row);
    const previousValue = row[column.accessor];
    const nextValue = coerceEditableValue(rawValue, column.type);

    const nextRows = data.map((item, index) => {
      const itemId = getId(item);
      const sameById =
        rowId !== undefined && itemId !== undefined && itemId === rowId;
      const sameByReference = item === row;

      if (!sameById && !sameByReference) return item;

      const nextRow = {
        ...item,
        [column.accessor]: nextValue,
      };

      onCellChange?.({
        rowId: rowId ?? index,
        column: column.accessor,
        previousValue,
        nextValue,
        row: nextRow,
      });

      return nextRow;
    });

    onDataChange(nextRows);
  };

  const handleAddRow = () => {
    const nextRow = createEmptyRow?.() ?? createDefaultEditableRow(columns);

    onDataChange([...data, nextRow]);
  };

  const handleDeleteRows = () => {
    if (!selectedIds.length) return;

    const nextRows = data.filter((row) => {
      const id = getId(row);
      return id === undefined || !selectedIds.includes(id);
    });

    onDataChange(nextRows);
    onSelectionChange?.([]);
    table.resetPage();
  };

  const skeletonColumnCount = Math.max(
    3,
    loadingColumns ?? table.visibleColumns.length + (enableSelection ? 1 : 0)
  );

  const skeletonRowCount = Math.max(1, loadingRows ?? table.rowsPerPage);

  return (
    <DataTableRoot loading={loading} styles={styles} slotProps={slotProps}>
      <DataTableToolbar
        search={table.search}
        onSearchChange={table.setSearch}
        enableSearch={enableSearch}
        enableExportCSV={enableExportCSV}
        canExport={csv.canExport}
        onExportCSV={csv.handleExportCSV}
        rowsPerPage={table.rowsPerPage}
        onRowsPerPageChange={table.setRowsPerPage}
        enableAddRow={enableAddRow}
        onAddRow={handleAddRow}
        enableDeleteRows={enableDeleteRows}
        canDeleteRows={selectedIds.length > 0}
        onDeleteRows={handleDeleteRows}
        styles={styles}
        slotProps={slotProps}
      />

      {loading ? (
        <DataTableSkeleton
          rows={skeletonRowCount}
          columns={skeletonColumnCount}
          fallback={loadingFallback}
          styles={styles}
          slotProps={slotProps}
        />
      ) : isMobile ? (
        <DataTableMobileCards
          editable
          rows={table.paginatedData}
          columns={table.visibleColumns}
          selectedIds={selectedIds}
          enableSelection={enableSelection}
          getRowId={getId}
          onToggleRow={selection.toggleSelectRow}
          onCellChange={handleCellChange}
          emptyState={emptyState}
          styles={styles}
          slotProps={slotProps}
        />
      ) : (
        <DataTableEditableDesktop
          rows={table.paginatedData}
          columns={table.visibleColumns}
          selectedIds={selectedIds}
          enableSelection={enableSelection}
          getRowId={getId}
          onToggleRow={selection.toggleSelectRow}
          onToggleAll={selection.toggleSelectAll}
          isAllPageSelected={selection.isAllPageSelected}
          isSomePageSelected={selection.isSomePageSelected}
          sortConfig={table.sortConfig}
          onSort={table.toggleSort}
          dense={dense}
          emptyState={emptyState}
          onCellChange={handleCellChange}
          styles={styles}
          slotProps={slotProps}
        />
      )}

      {!loading ? (
        <DataTablePagination
          page={table.safeCurrentPage}
          totalPages={table.totalPages}
          totalRows={table.sortedData.length}
          onPreviousPage={table.goToPreviousPage}
          onNextPage={table.goToNextPage}
          styles={styles}
          slotProps={slotProps}
        />
      ) : null}
    </DataTableRoot>
  );
}