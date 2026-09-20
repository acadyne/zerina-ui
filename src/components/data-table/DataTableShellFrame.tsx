import type React from "react";

import type {
  DataTableColumn,
  DataTableRowId,
  DataTableSlotProps,
  DataTableStyles,
} from "./dataTable.types";

import type {
  DataTableShellRuntime,
} from "./useDataTableShell";

import {
  DataTableRoot,
} from "./DataTableRoot";

import {
  DataTableToolbar,
} from "./DataTableToolbar";

import {
  DataTablePagination,
} from "./DataTablePagination";

import {
  DataTableSkeleton,
} from "./DataTableSkeleton";


export interface DataTableShellFrameProps<
  T extends Record<string, unknown>,
  IDType extends DataTableRowId,
  TColumn extends DataTableColumn<T>,
> {
  runtime:
    DataTableShellRuntime<
      T,
      IDType,
      TColumn
    >;

  loading:
    boolean;

  loadingFallback?:
    React.ReactNode;

  enableSearch:
    boolean;

  enableExportCSV:
    boolean;

  renderActions?: () =>
    React.ReactNode;

  enableAddRow?:
    boolean;

  onAddRow?: () =>
    void;

  enableDeleteRows?:
    boolean;

  onDeleteRows?: () =>
    void;

  canDeleteRows?:
    boolean;

  mobileContent:
    React.ReactNode;

  desktopContent:
    React.ReactNode;

  styles?:
    DataTableStyles;

  slotProps?:
    DataTableSlotProps;
}


/**
 * Shell visual único de DataTable/EditableDataTable.
 *
 * Posee toolbar, loading, responsive switch y pagination.
 * Los renderers mobile/desktop siguen perteneciendo a cada variante.
 */
export function DataTableShellFrame<
  T extends Record<string, unknown>,
  IDType extends DataTableRowId,
  TColumn extends DataTableColumn<T>,
>({
  runtime,

  loading,
  loadingFallback,

  enableSearch,
  enableExportCSV,

  renderActions,

  enableAddRow =
    false,
  onAddRow,

  enableDeleteRows =
    false,
  onDeleteRows,
  canDeleteRows =
    false,

  mobileContent,
  desktopContent,

  styles,
  slotProps,
}: DataTableShellFrameProps<
  T,
  IDType,
  TColumn
>) {
  const {
    table,
    isMobile,
    csv,
    skeletonColumnCount,
    skeletonRowCount,
    rootRef,
    responsiveKind,
  } = runtime;


  return (
    <DataTableRoot
      ref={
        rootRef
      }

      data-ui-data-table-viewport={
        responsiveKind
      }

      loading={
        loading
      }
      styles={
        styles
      }
      slotProps={
        slotProps
      }
    >
      <DataTableToolbar
        search={
          table.search
        }

        onSearchChange={
          table.setSearch
        }

        enableSearch={
          enableSearch
        }

        enableExportCSV={
          enableExportCSV
        }

        canExport={
          csv.canExport
        }

        onExportCSV={
          csv.downloadCsv
        }

        renderActions={
          renderActions
        }

        rowsPerPage={
          table.rowsPerPage
        }

        onRowsPerPageChange={
          table.setRowsPerPage
        }

        enableAddRow={
          enableAddRow
        }

        onAddRow={
          onAddRow
        }

        enableDeleteRows={
          enableDeleteRows
        }

        canDeleteRows={
          canDeleteRows
        }

        onDeleteRows={
          onDeleteRows
        }

        styles={
          styles
        }

        slotProps={
          slotProps
        }
      />


      {
        loading
          ? (
              <DataTableSkeleton
                rows={
                  skeletonRowCount
                }

                columns={
                  skeletonColumnCount
                }

                fallback={
                  loadingFallback
                }

                styles={
                  styles
                }

                slotProps={
                  slotProps
                }
              />
            )
          : isMobile
            ? mobileContent
            : desktopContent
      }


      {
        !loading
          ? (
              <DataTablePagination
                page={
                  table
                    .safeCurrentPage
                }

                totalPages={
                  table.totalPages
                }

                totalRows={
                  table
                    .sortedData
                    .length
                }

                onPreviousPage={
                  table
                    .goToPreviousPage
                }

                onNextPage={
                  table
                    .goToNextPage
                }

                styles={
                  styles
                }

                slotProps={
                  slotProps
                }
              />
            )
          : null
      }
    </DataTableRoot>
  );
}
