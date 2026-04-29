// src/components/data-table/hooks/useDataTableExport.ts
import { useCallback, useMemo } from "react";
import type { DataTableColumn } from "../dataTable.types";
import { createExportRows, downloadCsv } from "../dataTable.utils";

export interface UseDataTableExportOptions<T extends object> {
  rows: T[];
  columns: DataTableColumn<T>[];
  filename: string;
}

export function useDataTableExport<T extends object>({
  rows,
  columns,
  filename,
}: UseDataTableExportOptions<T>) {
  const exportRows = useMemo(
    () => createExportRows(rows, columns),
    [rows, columns]
  );

  const handleExportCSV = useCallback(() => {
    downloadCsv(exportRows, filename);
  }, [exportRows, filename]);

  return {
    exportRows,
    canExport: exportRows.length > 0,
    handleExportCSV,
  };
}