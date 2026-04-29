// src/components/data-table/hooks/useDataTableSorting.ts
import { useCallback, useMemo, useState } from "react";
import type {
  DataTableColumn,
  DataTableSortConfig,
} from "../dataTable.types";
import { sortRows } from "../dataTable.utils";

export interface UseDataTableSortingOptions<T extends object> {
  data: T[];
  initialSortConfig?: DataTableSortConfig<T>;
}

export function useDataTableSorting<T extends object>({
  data,
  initialSortConfig = null,
}: UseDataTableSortingOptions<T>) {
  const [sortConfig, setSortConfig] =
    useState<DataTableSortConfig<T>>(initialSortConfig);

  const sortedData = useMemo(
    () => sortRows(data, sortConfig),
    [data, sortConfig]
  );

  const toggleSort = useCallback((column: DataTableColumn<T>) => {
    const accessor = column.accessor;

    if (!accessor) return;
    if (column.sortable === false) return;

    setSortConfig((prev) => {
      const isSameKey = prev?.key === accessor;

      return {
        key: accessor,
        direction: isSameKey && prev?.direction === "asc" ? "desc" : "asc",
      };
    });
  }, []);

  const clearSort = useCallback(() => {
    setSortConfig(null);
  }, []);

  return {
    sortConfig,
    setSortConfig,
    sortedData,
    toggleSort,
    clearSort,
  };
}