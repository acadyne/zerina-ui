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
  createDataTableExportData,
  dataTableExportToCsv,
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
  const withoutExtension =
    filename
      .trim()
      .replace(
        /\.csv$/i,
        ""
      );

  /*
   * El atributo download no debe recibir rutas ni caracteres reservados.
   * Se conserva el texto legible y solo se neutraliza lo que puede cambiar
   * su interpretación entre navegadores y sistemas de archivos.
   */
  const sanitized =
    withoutExtension
      .replace(
        /[\u0000-\u001f\u007f]/g,
        ""
      )
      .replace(
        /[\\/]+/g,
        "-"
      )
      .replace(
        /[<>:"|?*]+/g,
        "-"
      )
      .replace(
        /\s+/g,
        " "
      )
      .replace(
        /^[. ]+|[. ]+$/g,
        ""
      );

  const base =
    sanitized ||
    "data-table";

  /*
   * Estos nombres están reservados en Windows incluso con extensión.
   * El sufijo preserva intención sin producir una descarga inválida.
   */
  const safeBase =
    /^(con|prn|aux|nul|com[1-9]|lpt[1-9])$/i.test(
      base
    )
      ? `${base}-data`
      : base;

  return `${safeBase}.csv`;
}

export function useDataTableExport<
  T extends object,
>({
  rows,
  columns,
  filename,
}: UseDataTableExportOptions<T>) {
  const exportData = useMemo(
    () =>
      createDataTableExportData(
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
      dataTableExportToCsv(
        exportData
      ),
    [exportData]
  );

  const download = useMemo(
    () =>
      normalizeCsvFilename(
        filename
      ),
    [filename]
  );

  const [
    href,
    setHref,
  ] = useState<
    string | undefined
  >(undefined);

  useEffect(() => {
    if (
      !csv ||
      typeof Blob === "undefined" ||
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
    exportData,

    canExport:
      exportData.columns.length > 0 &&
      exportData.rows.length > 0 &&
      href !== undefined,

    href,
    download,
  };
}
