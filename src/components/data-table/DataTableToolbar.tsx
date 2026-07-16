// src/components/data-table/DataTableToolbar.tsx
import type React from "react";
import {
  Download,
  Plus,
  Trash2,
} from "lucide-react";
import {
  Button,
  Input,
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

interface DataTableToolbarProps {
  search: string;

  onSearchChange: (
    value: string
  ) => void;

  enableSearch?: boolean;
  enableExportCSV?: boolean;
  canExport?: boolean;

  exportHref?: string;
  exportFilename?: string;

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
  exportHref,
  exportFilename,

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
  const shouldRender =
    enableSearch ||
    enableExportCSV ||
    renderActions ||
    enableAddRow ||
    enableDeleteRows;

  if (!shouldRender) {
    return null;
  }

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

        gap: 12,
        flexWrap: "wrap",

        marginBottom: 12,
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

        gap: 8,
        flexWrap: "wrap",

        minWidth: 0,
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

        gap: 10,
        flexWrap: "wrap",

        minWidth: 0,
      },
    });

  const searchSlot =
    resolveSlot<DataTableSlot>({
      slot: "search",

      styles,
      slotProps,

      baseStyle: {
        minWidth: 220,
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
          "Exporta lo filtrado y ordenado",
      },

      baseStyle: {
        minHeight: 34,

        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",

        gap: 8,

        padding:
          "6px 10px",

        border: 0,
        borderRadius: "var(--ui-radius-md)",
        
        color:
          "inherit",

        background:
          "transparent",

        font: "inherit",
        fontWeight: 700,

        lineHeight: 1,
        textDecoration: "none",

        cursor: "pointer",
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
          <Input
            type="text"
            placeholder="Buscar…"
            value={search}
            onChange={(
              event
            ) =>
              onSearchChange(
                event.currentTarget
                  .value
              )
            }
            fullWidth={false}
            className={
              searchSlot.className
            }
            style={
              searchSlot.style
            }
          />
        ) : null}

        <Select
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
          options={[
            {
              label: "10",
              value: "10",
            },
            {
              label: "20",
              value: "20",
            },
            {
              label: "50",
              value: "50",
            },
            {
              label: "100",
              value: "100",
            },
          ]}
          className={
            rowsPerPageSlot.className
          }
          style={
            rowsPerPageSlot.style
          }
        />

        {enableExportCSV &&
          canExport &&
          exportHref &&
          exportFilename ? (
          <a
            href={exportHref}
            download={
              exportFilename
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
            <Download
              size={16}
              aria-hidden="true"
            />

            <span>CSV</span>
          </a>
        ) : null}
      </div>
    </div>
  );
}