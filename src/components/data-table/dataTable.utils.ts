// src/components/data-table/dataTable.utils.ts

import type {
  DataTableColumn,
  DataTableSortConfig,
  EditableColumnType,
} from "./dataTable.types";

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

export function createExportRows<T extends object>(
  rows: T[],
  columns: DataTableColumn<T>[]
): Record<string, unknown>[] {
  const exportColumns = columns.filter(
    (column) =>
      !column.hidden &&
      (column.accessor !== undefined || typeof column.exportValue === "function")
  );

  return rows.map((row) => {
    const record: Record<string, unknown> = {};

    exportColumns.forEach((column) => {
      record[column.header] =
        typeof column.exportValue === "function"
          ? column.exportValue(row)
          : column.accessor !== undefined
            ? (row as Record<string, unknown>)[column.accessor as string]
            : "";
    });

    return record;
  });
}

function escapeCsvValue(value: unknown): string {
  if (value == null) return "";

  const raw =
    typeof value === "object" && !(value instanceof Date)
      ? getCellText(value)
      : String(value);

  /**
   * Protege contra CSV injection cuando el archivo se abre en Excel,
   * Google Sheets u otras hojas de cálculo.
   */
  const safeRaw = /^[=+\-@]/.test(raw) ? `'${raw}` : raw;

  if (/[",\n\r]/.test(safeRaw)) {
    return `"${safeRaw.replace(/"/g, '""')}"`;
  }

  return safeRaw;
}

export function rowsToCsv(
  rows: Record<string, unknown>[]
): string {
  if (rows.length === 0) return "";

  const headers = Object.keys(rows[0]);

  const lines = [
    headers.map(escapeCsvValue).join(","),
    ...rows.map((row) => headers.map((header) => escapeCsvValue(row[header])).join(",")),
  ];

  return lines.join("\n");
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

export function createFallbackRowId(index: number): string {
  return `row-${index}`;
}