// src/components/data-table/hooks/useDataTableExport.ts
import {
  useCallback,
  useMemo,
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

  const download =
    useMemo(
      () =>
        normalizeCsvFilename(
          filename
        ),
      [filename]
    );

  const canExport =
    exportData.columns.length > 0 &&
    exportData.rows.length > 0;

  /*
   * El recurso Blob pertenece a la acción de exportar, no al ciclo de render.
   *
   * Antes se recreaba un ObjectURL en un effect cada vez que cambiaban rows
   * (por ejemplo, cada tecla durante edición o búsqueda). Mientras el effect
   * publicaba el siguiente href, el botón CSV desaparecía y hacía reflow de
   * los controles vecinos. Crear el recurso sólo al activar la exportación
   * mantiene estable la toolbar y evita churn de ObjectURLs.
   */
  const downloadCsv =
    useCallback(
      () => {
        if (
          !canExport ||
          !csv ||
          typeof document ===
            "undefined" ||
          typeof Blob ===
            "undefined" ||
          typeof URL ===
            "undefined" ||
          typeof URL.createObjectURL !==
            "function"
        ) {
          return;
        }

        const blob =
          new Blob(
            [csv],
            {
              type:
                "text/csv;charset=utf-8",
            }
          );

        const href =
          URL.createObjectURL(
            blob
          );

        const anchor =
          document.createElement(
            "a"
          );

        anchor.href =
          href;

        anchor.download =
          download;

        anchor.style.display =
          "none";

        document.body.append(
          anchor
        );

        anchor.click();
        anchor.remove();

        /*
         * La revocación se difiere un tick para no invalidar el recurso antes
         * de que el navegador procese la navegación de descarga.
         */
        globalThis.setTimeout(
          () => {
            URL.revokeObjectURL(
              href
            );
          },
          0
        );
      },
      [
        canExport,
        csv,
        download,
      ]
    );

  return {
    exportData,
    canExport,
    downloadCsv,
    download,
  };
}
