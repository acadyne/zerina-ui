// src/components/data-table/DataTableToolbar.tsx
import type React from "react";
import {
  Download,
  Plus,
  Trash2,
} from "lucide-react";
import {
  Button,
  SearchInput,
  Select,
} from "../../primitives/forms";
import {
  resolveSlot,
} from "../../helpers/css";
import type {
  DataTableSlot,
  DataTableSlotProps,
  DataTableStyles,
} from "./dataTable.types";

const DEFAULT_ROWS_PER_PAGE_OPTIONS = [
  10,
  20,
  50,
  100,
] as const;

function getRowsPerPageOptions(
  rowsPerPage: number
): number[] {
  return Array.from(
    new Set([
      ...DEFAULT_ROWS_PER_PAGE_OPTIONS,
      rowsPerPage,
    ])
  ).sort((left, right) => left - right);
}

interface DataTableToolbarProps {
  search: string;

  onSearchChange: (
    value: string
  ) => void;

  enableSearch?: boolean;
  enableExportCSV?: boolean;
  canExport?: boolean;

  onExportCSV?: () => void;

  renderActions?: () =>
    React.ReactNode;

  rowsPerPage: number;

  onRowsPerPageChange: (
    value: number
  ) => void;

  enableAddRow?: boolean;
  onAddRow?: () => void;

  enableDeleteRows?: boolean;
  canDeleteRows?: boolean;
  onDeleteRows?: () => void;

  styles?: DataTableStyles;
  slotProps?: DataTableSlotProps;
}

export function DataTableToolbar({
  search,
  onSearchChange,

  enableSearch = false,

  enableExportCSV = false,
  canExport = false,
  onExportCSV,

  renderActions,

  rowsPerPage,
  onRowsPerPageChange,

  enableAddRow = false,
  onAddRow,

  enableDeleteRows = false,
  canDeleteRows = false,
  onDeleteRows,

  styles,
  slotProps,
}: DataTableToolbarProps) {
  const rowsPerPageOptions =
    getRowsPerPageOptions(
      rowsPerPage
    );

  const toolbarSlot =
    resolveSlot<DataTableSlot>({
      slot: "toolbar",

      styles,
      slotProps,

      baseProps: {
        "data-ui-data-table-toolbar":
          "",
      },

      baseStyle: {
        minWidth: 0,

        display: "flex",
        alignItems: "center",
        justifyContent:
          "space-between",

        gap:
          "var(--ui-density-inline-gap)",
        flexWrap: "wrap",

        marginBottom:
          "var(--ui-density-block-gap)",
      },
    });

  const actionsSlot =
    resolveSlot<DataTableSlot>({
      slot: "toolbarActions",

      styles,
      slotProps,

      baseStyle: {
        display: "flex",
        alignItems: "center",
        justifyContent:
          "flex-start",

        gap:
          "var(--ui-density-inline-gap)",
        flexWrap: "wrap",

        minWidth: 0,
        flex: "0 1 auto",
      },
    });

  const controlsSlot =
    resolveSlot<DataTableSlot>({
      slot: "toolbarControls",

      styles,
      slotProps,

      baseStyle: {
        display: "flex",
        alignItems: "center",
        justifyContent:
          "flex-end",

        gap:
          "var(--ui-density-inline-gap)",
        flexWrap: "wrap",

        minWidth: 0,
        flex: "1 1 320px",
      },
    });

  const searchSlot =
    resolveSlot<DataTableSlot>({
      slot: "search",

      styles,
      slotProps,

      baseStyle: {
        width: "min(100%, 320px)",
        minWidth: "min(100%, 220px)",
        flex: "1 1 220px",
      },
    });

  const rowsPerPageSlot =
    resolveSlot<DataTableSlot>({
      slot: "rowsPerPage",

      styles,
      slotProps,
    });

  const addButtonSlot =
    resolveSlot<DataTableSlot>({
      slot: "addButton",

      styles,
      slotProps,
    });

  const deleteButtonSlot =
    resolveSlot<DataTableSlot>({
      slot: "deleteButton",

      styles,
      slotProps,
    });

  const exportButtonSlot =
    resolveSlot<DataTableSlot>({
      slot: "exportButton",

      styles,
      slotProps,

      baseProps: {
        title:
          canExport
            ? "Exporta lo filtrado y ordenado"
            : "No hay registros para exportar",
      },
    });

  return (
    <div {...toolbarSlot}>
      <div {...actionsSlot}>
        {renderActions ? (
          <div>
            {renderActions()}
          </div>
        ) : null}

        {enableAddRow ? (
          <Button
            type="button"
            size="sm"
            colorScheme="primary"
            leftIcon={
              <Plus size={14} />
            }
            onPress={onAddRow}
            className={
              addButtonSlot.className
            }
            style={
              addButtonSlot.style
            }
          >
            Fila
          </Button>
        ) : null}

        {enableDeleteRows ? (
          <Button
            type="button"
            size="sm"
            variant="outline"
            colorScheme="danger"
            leftIcon={
              <Trash2 size={14} />
            }
            disabled={
              !canDeleteRows
            }
            onPress={
              onDeleteRows
            }
            className={
              deleteButtonSlot.className
            }
            style={
              deleteButtonSlot.style
            }
          >
            Eliminar
          </Button>
        ) : null}
      </div>

      <div {...controlsSlot}>
        {enableSearch ? (
          <SearchInput
            aria-label="Buscar registros"
            placeholder="Buscar…"
            value={search}
            onValueChange={
              onSearchChange
            }
            className={
              searchSlot.className
            }
            style={
              searchSlot.style
            }
          />
        ) : null}

        <Select
          aria-label="Filas por página"
          value={String(
            rowsPerPage
          )}
          onChange={(
            event
          ) =>
            onRowsPerPageChange(
              Number(
                event.currentTarget
                  .value
              )
            )
          }
          fullWidth={false}
          size="sm"
          options={
            rowsPerPageOptions.map(
              (value) => ({
                label: String(value),
                value: String(value),
              })
            )
          }
          className={
            rowsPerPageSlot.className
          }
          style={
            rowsPerPageSlot.style
          }
        />

        {enableExportCSV ? (
          <Button
            type="button"
            size="sm"
            variant="ghost"
            colorScheme="primary"
            leftIcon={
              <Download
                size={16}
                aria-hidden="true"
              />
            }
            disabled={
              !canExport
            }
            onPress={
              onExportCSV
            }
            className={
              exportButtonSlot.className
            }
            style={
              exportButtonSlot.style
            }
            title={
              exportButtonSlot.title
            }
            data-ui-data-table-export=""
          >
            CSV
          </Button>
        ) : null}
      </div>
    </div>
  );
}
