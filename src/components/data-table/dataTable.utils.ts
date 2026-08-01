// src/components/data-table/dataTable.utils.ts

import type {
  DataTableColumn,
  DataTableRowId,
  DataTableSortConfig,
  EditableColumnType,
} from "./dataTable.types";

function isValidDataTableRowId(
  value: unknown
): value is DataTableRowId {
  if (typeof value === "string") {
    return value.trim().length > 0;
  }

  return (
    typeof value === "number" &&
    Number.isFinite(value)
  );
}

/**
 * Valida y deduplica selección sin convertir números en strings.
 *
 * La pertenencia a la colección se resuelve aparte porque una selección
 * puede abarcar filas válidas que no están en la página visible.
 */
export function normalizeDataTableRowIds<
  IDType extends DataTableRowId,
>(
  ids: readonly IDType[]
): IDType[] {
  const normalizedIds: IDType[] = [];
  const seen = new Set<DataTableRowId>();

  for (const id of ids) {
    if (!isValidDataTableRowId(id)) {
      throw new Error(
        "DataTable selectedIds must contain non-empty strings or finite numbers."
      );
    }

    if (!seen.has(id)) {
      seen.add(id);
      normalizedIds.push(id);
    }
  }

  return normalizedIds;
}

/**
 * Captura la identidad de cada fila una vez por colección.
 *
 * Además de detectar IDs inválidos o duplicados, evita que un getRowId
 * impuro produzca identidades diferentes entre selección y render.
 */
export function createDataTableRowIdResolver<
  T extends object,
  IDType extends DataTableRowId,
>(
  rows: readonly T[],
  getRowId: (row: T) => IDType
): (row: T) => IDType {
  const idsByRow = new Map<T, IDType>();
  const rowsById = new Map<DataTableRowId, T>();

  for (const row of rows) {
    const id = getRowId(row);

    if (!isValidDataTableRowId(id)) {
      throw new Error(
        "DataTable getRowId must return a non-empty string or finite number."
      );
    }

    if (rowsById.has(id)) {
      throw new Error(
        `DataTable row IDs must be unique. Duplicate ID: ${String(id)}`
      );
    }

    rowsById.set(id, row);
    idsByRow.set(row, id);
  }

  return (row: T): IDType => {
    if (!idsByRow.has(row)) {
      throw new Error(
        "DataTable received a row outside the validated data collection."
      );
    }

    return idsByRow.get(row) as IDType;
  };
}

/**
 * Conserva separados IDs numéricos y textuales que comparten representación.
 */
export function getDataTableRowKey(
  id: DataTableRowId
): string {
  return `${typeof id}:${String(id)}`;
}

export function getDataTableColumnId(
  column: { id: string }
): string {
  const id = column.id.trim();

  if (!id) {
    throw new Error(
      "DataTable column IDs must be non-empty strings."
    );
  }

  return id;
}

export function assertUniqueDataTableColumnIds<
  TColumn extends { id: string },
>(
  columns: readonly TColumn[]
): void {
  const seen = new Set<string>();

  for (const column of columns) {
    const id = getDataTableColumnId(column);

    if (seen.has(id)) {
      throw new Error(
        `DataTable column IDs must be unique. Duplicate ID: ${id}`
      );
    }

    seen.add(id);
  }
}

function toComparable(value: unknown): string | number {
  if (value == null) return "";
  if (typeof value === "number") return value;
  if (typeof value === "boolean") return value ? 1 : 0;
  if (value instanceof Date) return value.getTime();

  if (typeof value === "string") {
    const trimmed = value.trim();

    const asDate = Date.parse(trimmed);
    if (!Number.isNaN(asDate) && trimmed.length >= 8) return asDate;

    const asNumber = Number(trimmed);
    if (!Number.isNaN(asNumber) && trimmed !== "") return asNumber;

    return trimmed.toLowerCase();
  }

  return String(value).toLowerCase();
}

export function getCellText(value: unknown): string {
  if (value == null) return "";
  if (value instanceof Date) return value.toISOString();

  if (
    typeof value === "string" ||
    typeof value === "number" ||
    typeof value === "boolean"
  ) {
    return String(value);
  }

  try {
    return JSON.stringify(value);
  } catch {
    return String(value);
  }
}

export function toRenderableValue(value: unknown): React.ReactNode {
  if (value == null) return "";

  if (
    typeof value === "string" ||
    typeof value === "number" ||
    typeof value === "boolean"
  ) {
    return String(value);
  }

  if (value instanceof Date) return value.toISOString();

  return getCellText(value);
}

export function filterRows<T extends object>(
  data: T[],
  search: string,
  searchKeys?: Array<keyof T>
): T[] {
  const query = search.trim().toLowerCase();
  if (!query) return data;

  if (searchKeys?.length) {
    return data.filter((item) =>
      searchKeys.some((key) =>
        String((item as Record<string, unknown>)[key as string] ?? "")
          .toLowerCase()
          .includes(query)
      )
    );
  }

  return data.filter((item) =>
    Object.values(item as Record<string, unknown>).some((value) =>
      String(value ?? "").toLowerCase().includes(query)
    )
  );
}

export function sortRows<T extends object>(
  data: T[],
  sortConfig: DataTableSortConfig<T>
): T[] {
  if (!sortConfig) return data;

  const { key, direction } = sortConfig;
  const dir = direction === "asc" ? 1 : -1;

  return [...data].sort((a, b) => {
    const left = toComparable((a as Record<string, unknown>)[key as string]);
    const right = toComparable((b as Record<string, unknown>)[key as string]);

    if (left < right) return -1 * dir;
    if (left > right) return 1 * dir;

    return 0;
  });
}

export function getVisibleColumns<
  T extends object,
  TColumn extends DataTableColumn<T> = DataTableColumn<T>,
>(columns: TColumn[]): TColumn[] {
  return columns.filter((column) => !column.hidden);
}

export interface DataTableExportColumn {
  id: string;
  header: string;
}

export interface DataTableExportData {
  columns: DataTableExportColumn[];
  rows: unknown[][];
}

function getDataTableExportValue<
  T extends object,
>(
  row: T,
  column: DataTableColumn<T>
): unknown {
  if (
    typeof column.exportValue ===
    "function"
  ) {
    return column.exportValue(row);
  }

  if (column.accessor !== undefined) {
    return (
      row as Record<string, unknown>
    )[column.accessor as string];
  }

  return "";
}

/**
 * Conserva la identidad y el orden de las columnas separados de sus etiquetas.
 *
 * Dos columnas pueden compartir el mismo encabezado visible sin sobrescribirse:
 * cada fila se representa como una matriz alineada por posición e identidad.
 */
export function createDataTableExportData<
  T extends object,
>(
  rows: T[],
  columns: DataTableColumn<T>[]
): DataTableExportData {
  assertUniqueDataTableColumnIds(
    columns
  );

  const exportColumns = columns
    .filter(
      (column) =>
        !column.hidden &&
        (
          column.accessor !== undefined ||
          typeof column.exportValue ===
            "function"
        )
    )
    .map((column) => ({
      column,
      id: getDataTableColumnId(
        column
      ),
      header: column.header,
    }));

  return {
    columns: exportColumns.map(
      ({ id, header }) => ({
        id,
        header,
      })
    ),

    rows: rows.map(
      (row) =>
        exportColumns.map(
          ({ column }) =>
            getDataTableExportValue(
              row,
              column
            )
        )
    ),
  };
}

function escapeCsvValue(
  value: unknown
): string {
  if (value == null) {
    return "";
  }

  const raw =
    typeof value === "object" &&
    !(value instanceof Date)
      ? getCellText(value)
      : String(value);

  /*
   * trimStart solo participa en la detección. El valor original se conserva,
   * pero se antepone un apóstrofo cuando espacios o controles ocultan una
   * fórmula que una hoja de cálculo podría ejecutar.
   */
  const safeRaw =
    /^[=+\-@]/.test(
      raw.trimStart()
    )
      ? `'${raw}`
      : raw;

  if (/[",\n\r]/.test(safeRaw)) {
    return `"${safeRaw.replace(
      /"/g,
      '""'
    )}"`;
  }

  return safeRaw;
}

/**
 * Usa CRLF y BOM UTF-8 para mantener interoperabilidad con hojas de cálculo.
 */
export function dataTableExportToCsv(
  exportData: DataTableExportData
): string {
  const {
    columns,
    rows,
  } = exportData;

  if (
    columns.length === 0 ||
    rows.length === 0
  ) {
    return "";
  }

  const expectedCellCount =
    columns.length;

  for (const row of rows) {
    if (
      row.length !==
      expectedCellCount
    ) {
      throw new Error(
        "DataTable export rows must align with the exported columns."
      );
    }
  }

  const lines = [
    columns
      .map(
        ({ header }) =>
          escapeCsvValue(header)
      )
      .join(","),

    ...rows.map(
      (row) =>
        row
          .map(escapeCsvValue)
          .join(",")
    ),
  ];

  return `\uFEFF${lines.join(
    "\r\n"
  )}`;
}

export function coerceEditableValue(
  rawValue: string,
  type: EditableColumnType = "string"
): unknown {
  if (type === "number") {
    if (rawValue.trim() === "") return null;

    const value = Number(rawValue);
    return Number.isNaN(value) ? rawValue : value;
  }

  if (type === "boolean") {
    return rawValue === "true";
  }

  if (type === "json") {
    if (!rawValue.trim()) return null;

    try {
      return JSON.parse(rawValue);
    } catch {
      return rawValue;
    }
  }

  return rawValue;
}

/**
 * Mantiene el mismo nombre accesible en tabla y tarjetas móviles sin depender
 * del placeholder ni del valor actual, que pueden cambiar durante la edición.
 */
export function getEditableCellAriaLabel(
  header: string,
  rowIndex: number
): string {
  const normalizedHeader =
    header.trim() ||
    "Campo";

  return `${normalizedHeader}, fila ${rowIndex + 1}`;
}
