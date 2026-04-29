// src/components/data-table/hooks/useDataTableColumns.ts
import { useEffect, useMemo, useState } from "react";
import type { DataTableColumn } from "../dataTable.types";
import { getVisibleColumns } from "../dataTable.utils";

export type DataTableColumnsSource<
  T extends object,
  TColumn extends DataTableColumn<T> = DataTableColumn<T>,
> = TColumn[] | (() => Promise<TColumn[]>);

export interface UseDataTableColumnsOptions<
  T extends object,
  TColumn extends DataTableColumn<T> = DataTableColumn<T>,
> {
  columns: DataTableColumnsSource<T, TColumn>;
}

function getInitialColumns<
  T extends object,
  TColumn extends DataTableColumn<T> = DataTableColumn<T>,
>(columns: DataTableColumnsSource<T, TColumn>): TColumn[] {
  return typeof columns === "function" ? [] : columns;
}

export function useDataTableColumns<
  T extends object,
  TColumn extends DataTableColumn<T> = DataTableColumn<T>,
>({ columns }: UseDataTableColumnsOptions<T, TColumn>) {
  const [resolvedColumns, setResolvedColumns] = useState<TColumn[]>(() =>
    getInitialColumns(columns)
  );

  useEffect(() => {
    let alive = true;

    const resolveColumns = async () => {
      try {
        const nextColumns =
          typeof columns === "function" ? await columns() : columns;

        if (alive) {
          setResolvedColumns(nextColumns);
        }
      } catch {
        if (alive) {
          setResolvedColumns([]);
        }
      }
    };

    void resolveColumns();

    return () => {
      alive = false;
    };
  }, [columns]);

  const visibleColumns = useMemo(() => {
    return getVisibleColumns<T, TColumn>(resolvedColumns);
  }, [resolvedColumns]);

  return {
    resolvedColumns,
    visibleColumns,
  };
}