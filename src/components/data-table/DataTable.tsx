// src/components/data-table/DataTable.tsx
import type {
  DataTableColumn,
  DataTableProps,
  DataTableRowId,
} from "./dataTable.types";

import {
  useDataTableShell,
} from "./useDataTableShell";

import {
  DataTableShellFrame,
} from "./DataTableShellFrame";

import {
  DataTableDesktop,
} from "./DataTableDesktop";

import {
  DataTableMobileCards,
} from "./DataTableMobileCards";


export function DataTable<
  T extends Record<string, unknown>,
  IDType extends DataTableRowId,
>({
  data,
  columns,

  selectedIds = [],
  onSelectionChange,

  exportFilename =
    "tabla_datos",

  enableExportCSV =
    false,

  renderActions,

  enableSearch =
    false,

  initialRowsPerPage =
    10,

  searchKeys,
  getRowId,

  dense =
    true,

  loading =
    false,

  loadingRows,
  loadingColumns,
  loadingFallback,

  emptyState,

  mobileMode =
    "inherit",

  mobileBreakpoint,

  enableSelection =
    true,

  styles,
  slotProps,
}: DataTableProps<
  T,
  IDType
>) {
  const runtime =
    useDataTableShell<
      T,
      IDType,
      DataTableColumn<T>
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

      renderActions={
        renderActions
      }

      styles={
        styles
      }

      slotProps={
        slotProps
      }

      mobileContent={
        <DataTableMobileCards
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
        <DataTableDesktop
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
