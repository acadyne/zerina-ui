// src/components/data-table/dataTable.types.ts
import type React from "react";

export type DataTableAlign = "left" | "center" | "right";

export type DataTableRowId = string | number;

export type DataTableSortDirection = "asc" | "desc";

export type DataTableMobileMode = "inherit" | "auto" | "always" | "never";

export type DataTableSortConfig<T> =
  | {
      key: keyof T;
      direction: DataTableSortDirection;
    }
  | null;

export type DataTableColumn<T> = {
  header: string;
  accessor?: keyof T;
  Cell?: (row: T) => React.ReactNode;
  exportValue?: (row: T) => unknown;
  sortable?: boolean;
  searchable?: boolean;
  width?: number | string;
  align?: DataTableAlign;
  nowrap?: boolean;
  hidden?: boolean;
};

export interface DataTableEmptyStateConfig {
  icon?: React.ReactNode;
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: React.ReactNode;
  actionLabel?: React.ReactNode;
  onAction?: () => void;
}

export interface DataTableLoadingConfig {
  loading?: boolean;
  loadingRows?: number;
  loadingColumns?: number;
  loadingFallback?: React.ReactNode;
}

export interface DataTableProps<T extends object, IDType extends DataTableRowId>
  extends DataTableLoadingConfig {
  data: T[];
  columns: DataTableColumn<T>[] | (() => Promise<DataTableColumn<T>[]>);

  selectedIds?: IDType[];
  onSelectionChange?: (selectedIds: IDType[]) => void;

  exportFilename?: string;
  enableExportCSV?: boolean;
  renderActions?: () => React.ReactNode;
  enableSearch?: boolean;
  initialRowsPerPage?: number;

  searchKeys?: Array<keyof T>;
  getRowId?: (row: T) => IDType;

  dense?: boolean;
  rowKeyFallback?: (row: T, index: number) => string;

  emptyState?: DataTableEmptyStateConfig;

  mobileMode?: DataTableMobileMode;
  mobileBreakpoint?: number;

  enableSelection?: boolean;
}

export type EditableColumnType =
  | "string"
  | "text"
  | "number"
  | "boolean"
  | "date"
  | "datetime"
  | "uuid"
  | "json"
  | "enum";

export type EditableDataTableColumn<T extends object> = DataTableColumn<T> & {
  accessor: keyof T;
  type?: EditableColumnType;
  editable?: boolean;
  required?: boolean;
  options?: Array<{
    label: string;
    value: string;
  }>;
  placeholder?: string;
};

export type EditableDataTableChange<T extends object> = {
  rowId: DataTableRowId;
  column: keyof T;
  previousValue: unknown;
  nextValue: unknown;
  row: T;
};

export interface EditableDataTableProps<
  T extends Record<string, unknown>,
  IDType extends DataTableRowId,
> extends DataTableLoadingConfig {
  data: T[];
  columns: EditableDataTableColumn<T>[];

  onDataChange: (rows: T[]) => void;
  onCellChange?: (change: EditableDataTableChange<T>) => void;

  selectedIds?: IDType[];
  onSelectionChange?: (selectedIds: IDType[]) => void;

  getRowId?: (row: T) => IDType;
  createEmptyRow?: () => T;

  exportFilename?: string;
  enableExportCSV?: boolean;
  enableSearch?: boolean;
  initialRowsPerPage?: number;

  dense?: boolean;

  emptyState?: DataTableEmptyStateConfig;

  mobileMode?: DataTableMobileMode;
  mobileBreakpoint?: number;

  enableAddRow?: boolean;
  enableDeleteRows?: boolean;
  enableSelection?: boolean;
}