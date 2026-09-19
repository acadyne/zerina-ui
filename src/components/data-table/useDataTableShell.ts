import {
  useMemo,
} from "react";

import {
  useAdaptiveViewport,
  type UIAdaptiveViewportMode,
} from "../../core/viewport";

import type {
  DataTableColumn,
  DataTableMobileMode,
  DataTableRowId,
} from "./dataTable.types";

import {
  createDataTableRowIdResolver,
} from "./dataTable.utils";

import type {
  DataTableColumnsSource,
} from "./hooks/useDataTableColumns";

import {
  useDataTableExport,
  useDataTableSelection,
  useDataTableState,
} from "./hooks";


function resolveDataTableResponsiveMode(
  mobileMode: DataTableMobileMode
): UIAdaptiveViewportMode {
  if (mobileMode === "always") {
    return "mobile";
  }

  if (mobileMode === "never") {
    return "desktop";
  }

  return mobileMode;
}


export interface UseDataTableShellOptions<
  T extends Record<string, unknown>,
  IDType extends DataTableRowId,
  TColumn extends DataTableColumn<T>,
> {
  data:
    T[];

  columns:
    DataTableColumnsSource<
      T,
      TColumn
    >;

  searchKeys?:
    Array<keyof T>;

  initialRowsPerPage?:
    number;

  mobileMode?:
    DataTableMobileMode;

  mobileBreakpoint?:
    number;

  selectedIds:
    IDType[];

  onSelectionChange?: (
    selectedIds:
      IDType[]
  ) => void;

  getRowId: (
    row:
      T
  ) => IDType;

  exportFilename:
    string;

  enableSelection:
    boolean;

  loadingRows?:
    number;

  loadingColumns?:
    number;
}


/**
 * Owner de estado compartido por DataTable y EditableDataTable.
 *
 * No conoce edición, add/delete ni renderers.
 */
export function useDataTableShell<
  T extends Record<string, unknown>,
  IDType extends DataTableRowId,
  TColumn extends DataTableColumn<T>,
>({
  data,
  columns,

  searchKeys,
  initialRowsPerPage =
    10,

  mobileMode =
    "inherit",
  mobileBreakpoint,

  selectedIds,
  onSelectionChange,

  getRowId,

  exportFilename,

  enableSelection,

  loadingRows,
  loadingColumns,
}: UseDataTableShellOptions<
  T,
  IDType,
  TColumn
>) {
  const table =
    useDataTableState<
      T,
      TColumn
    >({
      data,
      columns,
      searchKeys,
      initialRowsPerPage,
    });


  const responsiveBreakpoints =
    useMemo(
      () =>
        mobileBreakpoint === undefined
          ? undefined
          : {
              tablet:
                mobileBreakpoint,
            },
      [
        mobileBreakpoint,
      ],
    );


  const responsive =
    useAdaptiveViewport({
      source:
        "window",

      mode:
        resolveDataTableResponsiveMode(
          mobileMode,
        ),

      breakpoints:
        responsiveBreakpoints,
    });


  const isMobile =
    responsive.isMobile;


  const getId =
    useMemo(
      () =>
        createDataTableRowIdResolver(
          data,
          getRowId,
        ),
      [
        data,
        getRowId,
      ],
    );


  const selection =
    useDataTableSelection<
      T,
      IDType
    >({
      rows:
        table.paginatedData,

      allRows:
        data,

      selectedIds,
      onSelectionChange,

      getRowId:
        getId,
    });


  const csv =
    useDataTableExport<T>({
      rows:
        table.sortedData,

      columns:
        table.visibleColumns,

      filename:
        exportFilename,
    });


  const skeletonColumnCount =
    Math.max(
      3,
      loadingColumns ??
        table.visibleColumns.length +
          (
            enableSelection
              ? 1
              : 0
          ),
    );


  const skeletonRowCount =
    Math.max(
      1,
      loadingRows ??
        table.rowsPerPage,
    );


  return {
    table,
    isMobile,
    getId,
    selection,
    csv,
    skeletonColumnCount,
    skeletonRowCount,
  } as const;
}


export type DataTableShellRuntime<
  T extends Record<string, unknown>,
  IDType extends DataTableRowId,
  TColumn extends DataTableColumn<T>,
> =
  ReturnType<
    typeof useDataTableShell<
      T,
      IDType,
      TColumn
    >
  >;
