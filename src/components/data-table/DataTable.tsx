// src/components/data-table/DataTable.tsx
import { useMemo } from "react";
import type {
  DataTableColumn,
  DataTableProps,
  DataTableRowId,
} from "./dataTable.types";
import {
  useDataTableExport,
  useDataTableResponsiveMode,
  useDataTableSelection,
  useDataTableState,
} from "./hooks";
import { DataTableRoot } from "./DataTableRoot";
import { DataTableToolbar } from "./DataTableToolbar";
import { DataTableDesktop } from "./DataTableDesktop";
import { DataTableMobileCards } from "./DataTableMobileCards";
import { DataTablePagination } from "./DataTablePagination";
import { DataTableSkeleton } from "./DataTableSkeleton";

export function DataTable<
  T extends Record<string, unknown>,
  IDType extends DataTableRowId,
>({
  data,
  columns,

  selectedIds = [],
  onSelectionChange,

  exportFilename = "tabla_datos",
  enableExportCSV = false,
  renderActions,
  enableSearch = false,
  initialRowsPerPage = 10,

  searchKeys,
  getRowId,

  dense = true,
  rowKeyFallback,

  loading = false,
  loadingRows,
  loadingColumns,
  loadingFallback,

  emptyState,

  mobileMode = "inherit",
  mobileBreakpoint,

  enableSelection = true,

  styles,
  slotProps,
}: DataTableProps<T, IDType>) {
  const table = useDataTableState<T, DataTableColumn<T>>({
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
        renderActions={renderActions}
        rowsPerPage={table.rowsPerPage}
        onRowsPerPageChange={table.setRowsPerPage}
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
          rows={table.paginatedData}
          columns={table.visibleColumns}
          selectedIds={selectedIds}
          enableSelection={enableSelection}
          getRowId={getId}
          onToggleRow={selection.toggleSelectRow}
          emptyState={emptyState}
          styles={styles}
          slotProps={slotProps}
        />
      ) : (
        <DataTableDesktop
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
          rowKeyFallback={rowKeyFallback}
          emptyState={emptyState}
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