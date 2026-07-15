// src/components/data-table/hooks/useDataTableExport.ts
import {
  useEffect,
  useMemo,
  useState,
} from "react";
import type {
  DataTableColumn,
} from "../dataTable.types";
import {
  createExportRows,
  rowsToCsv,
} from "../dataTable.utils";

export interface UseDataTableExportOptions<
  T extends object,
> {
  rows: T[];
  columns: DataTableColumn<T>[];
  filename: string;
}

function normalizeCsvFilename(
  filename: string
): string {
  return filename.endsWith(".csv")
    ? filename
    : `${filename}.csv`;
}

export function useDataTableExport<
  T extends object,
>({
  rows,
  columns,
  filename,
}: UseDataTableExportOptions<T>) {
  const exportRows = useMemo(
    () =>
      createExportRows(
        rows,
        columns
      ),
    [
      rows,
      columns,
    ]
  );

  const csv = useMemo(
    () =>
      rowsToCsv(
        exportRows
      ),
    [exportRows]
  );

  const download =
    useMemo(
      () =>
        normalizeCsvFilename(
          filename
        ),
      [filename]
    );

  const [
    href,
    setHref,
  ] =
    useState<string | undefined>(
      undefined
    );

  useEffect(() => {
    if (
      !csv ||
      typeof URL === "undefined" ||
      typeof URL.createObjectURL !==
      "function"
    ) {
      setHref(undefined);
      return;
    }

    const blob = new Blob(
      [csv],
      {
        type:
          "text/csv;charset=utf-8",
      }
    );

    const nextHref =
      URL.createObjectURL(
        blob
      );

    setHref(nextHref);

    return () => {
      URL.revokeObjectURL(
        nextHref
      );
    };
  }, [csv]);

  return {
    exportRows,

    canExport:
      exportRows.length > 0 &&
      href !== undefined,

    href,
    download,
  };
}