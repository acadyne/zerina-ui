// src/components/data-table/hooks/useDataTableColumns.ts
import { useEffect, useMemo, useState } from "react";
import type { DataTableColumn } from "../dataTable.types";
import {
  assertUniqueDataTableColumnIds,
  getVisibleColumns,
} from "../dataTable.utils";

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

interface AsyncColumnsState<
  TColumn extends object,
> {
  source: () => Promise<TColumn[]>;
  columns: TColumn[];
  error: Error | null;
}

function normalizeColumnsError(
  error: unknown
): Error {
  return error instanceof Error
    ? error
    : new Error(
        `DataTable column source failed: ${String(error)}`
      );
}

export function useDataTableColumns<
  T extends object,
  TColumn extends DataTableColumn<T> = DataTableColumn<T>,
>({ columns }: UseDataTableColumnsOptions<T, TColumn>) {
  const [
    asyncState,
    setAsyncState,
  ] = useState<AsyncColumnsState<TColumn> | null>(
    null
  );

  useEffect(() => {
    if (typeof columns !== "function") {
      return undefined;
    }

    let active = true;
    const source = columns;

    // Una fuente nueva no conserva columnas de la anterior: hacerlo
    // mezclaría datos actuales con una estructura que ya perdió ownership.
    setAsyncState({
      source,
      columns: [],
      error: null,
    });

    const resolveColumns = async () => {
      try {
        const nextColumns = await source();

        if (active) {
          setAsyncState({
            source,
            columns: nextColumns,
            error: null,
          });
        }
      } catch (error) {
        if (active) {
          setAsyncState({
            source,
            columns: [],
            error: normalizeColumnsError(error),
          });
        }
      }
    };

    void resolveColumns();

    return () => {
      active = false;
    };
  }, [columns]);

  const resolvedColumns = useMemo((): TColumn[] => {
    if (typeof columns !== "function") {
      return columns;
    }

    if (
      asyncState === null ||
      asyncState.source !== columns
    ) {
      return [];
    }

    /*
     * El error se propaga durante render para que el Error Boundary del
     * consumidor pueda distinguir un fallo real de una tabla sin columnas.
     */
    if (asyncState.error !== null) {
      throw asyncState.error;
    }

    return asyncState.columns;
  }, [asyncState, columns]);

  const visibleColumns = useMemo(() => {
    // La identidad se valida sobre todas las columnas, incluidas las ocultas,
    // para que mostrarlas después no cambie silenciosamente el ownership.
    assertUniqueDataTableColumnIds(resolvedColumns);

    return getVisibleColumns<T, TColumn>(resolvedColumns);
  }, [resolvedColumns]);

  return {
    resolvedColumns,
    visibleColumns,
  };
}
