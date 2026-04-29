// src/components/data-table/hooks/useDataTableState.ts
import React from "react";
import type {
  DataTableColumn,
  DataTableSortConfig,
} from "../dataTable.types";
import { filterRows } from "../dataTable.utils";
import {
  useDataTableColumns,
  type DataTableColumnsSource,
} from "./useDataTableColumns";
import { useDataTableSorting } from "./useDataTableSorting";
import { useDataTablePagination } from "./useDataTablePagination";

export interface UseDataTableStateOptions<
  T extends object,
  TColumn extends DataTableColumn<T> = DataTableColumn<T>,
> {
  data: T[];
  columns: DataTableColumnsSource<T, TColumn>;
  searchKeys?: Array<keyof T>;
  initialRowsPerPage?: number;
  initialSortConfig?: DataTableSortConfig<T>;
}

export function useDataTableState<
  T extends object,
  TColumn extends DataTableColumn<T> = DataTableColumn<T>,
>({
  data,
  columns,
  searchKeys,
  initialRowsPerPage = 10,
  initialSortConfig = null,
}: UseDataTableStateOptions<T, TColumn>) {
  const [search, setSearchState] = React.useState("");

  const { resolvedColumns, visibleColumns } = useDataTableColumns<T, TColumn>({
    columns,
  });

  const filteredData = React.useMemo(() => {
    return filterRows(data, search, searchKeys);
  }, [data, search, searchKeys]);

  const {
    sortConfig,
    setSortConfig,
    sortedData,
    toggleSort,
    clearSort,
  } = useDataTableSorting<T>({
    data: filteredData,
    initialSortConfig,
  });

  const {
    currentPage,
    safeCurrentPage,
    rowsPerPage,
    totalPages,
    paginatedData,
    setCurrentPage,
    setRowsPerPage,
    goToPreviousPage,
    goToNextPage,
    resetPage,
  } = useDataTablePagination({
    data: sortedData,
    initialRowsPerPage,
  });

  const setSearch = React.useCallback(
    (value: string) => {
      setSearchState(value);
      resetPage();
    },
    [resetPage]
  );

  React.useEffect(() => {
    resetPage();
  }, [sortConfig, resetPage]);

  return {
    resolvedColumns,
    visibleColumns,

    search,
    setSearch,

    filteredData,
    sortedData,

    sortConfig,
    setSortConfig,
    toggleSort,
    clearSort,

    currentPage,
    safeCurrentPage,
    rowsPerPage,
    totalPages,
    paginatedData,
    setCurrentPage,
    setRowsPerPage,
    goToPreviousPage,
    goToNextPage,
    resetPage,
  };
}