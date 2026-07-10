// src/components/data-table/DataTableMobileCards.tsx
import React from "react";
import { Button, Checkbox, Input, Select } from "../../primitives/forms";
import { resolveSlot } from "../../helpers/css";
import type {
  DataTableColumn,
  DataTableEmptyStateConfig,
  DataTableRowId,
  DataTableSlot,
  DataTableSlotProps,
  DataTableStyles,
  EditableDataTableColumn,
} from "./dataTable.types";
import { getCellText, toRenderableValue } from "./dataTable.utils";
import { DataTableEmptyState } from "./DataTableEmptyState";

interface DataTableMobileCardsProps<
  T extends Record<string, unknown>,
  IDType extends DataTableRowId,
> {
  rows: T[];
  columns: DataTableColumn<T>[];

  selectedIds: IDType[];
  enableSelection?: boolean;
  getRowId: (row: T) => IDType | undefined;
  onToggleRow?: (id: IDType) => void;

  emptyState?: DataTableEmptyStateConfig;

  editable?: false;

  styles?: DataTableStyles;
  slotProps?: DataTableSlotProps;
}

interface EditableDataTableMobileCardsProps<
  T extends Record<string, unknown>,
  IDType extends DataTableRowId,
> {
  rows: T[];
  columns: EditableDataTableColumn<T>[];

  selectedIds: IDType[];
  enableSelection?: boolean;
  getRowId: (row: T) => IDType | undefined;
  onToggleRow?: (id: IDType) => void;

  emptyState?: DataTableEmptyStateConfig;

  editable: true;
  onCellChange: (
    row: T,
    rowIndex: number,
    column: EditableDataTableColumn<T>,
    value: string
  ) => void;

  styles?: DataTableStyles;
  slotProps?: DataTableSlotProps;
}

type Props<T extends Record<string, unknown>, IDType extends DataTableRowId> =
  | DataTableMobileCardsProps<T, IDType>
  | EditableDataTableMobileCardsProps<T, IDType>;

function readCellValue<T extends Record<string, unknown>>(
  row: T,
  accessor: keyof T | undefined
): unknown {
  if (!accessor) return undefined;
  return row[accessor];
}

function renderEditableControl<T extends Record<string, unknown>>(
  row: T,
  rowIndex: number,
  column: EditableDataTableColumn<T>,
  onCellChange: (
    row: T,
    rowIndex: number,
    column: EditableDataTableColumn<T>,
    value: string
  ) => void
) {
  const value = readCellValue(row, column.accessor);
  const textValue = value == null ? "" : String(value);
  const editable = column.editable !== false;

  if (!editable) {
    return (
      <span
        style={{
          margin: 0,
          wordBreak: "break-word",
          fontSize: "var(--ui-font-size-sm)",
          color: "var(--ui-text)",
        }}
      >
        {toRenderableValue(value)}
      </span>
    );
  }

  if (column.type === "boolean") {
    return (
      <Select
        value={String(Boolean(value))}
        onChange={(event) =>
          onCellChange(row, rowIndex, column, event.currentTarget.value)
        }
        options={[
          { label: "true", value: "true" },
          { label: "false", value: "false" },
        ]}
      />
    );
  }

  if (column.type === "enum" && column.options?.length) {
    return (
      <Select
        value={textValue}
        onChange={(event) =>
          onCellChange(row, rowIndex, column, event.currentTarget.value)
        }
        options={column.options}
      />
    );
  }

  return (
    <Input
      value={textValue}
      placeholder={column.placeholder}
      onChange={(event) =>
        onCellChange(row, rowIndex, column, event.currentTarget.value)
      }
    />
  );
}

export function DataTableMobileCards<
  T extends Record<string, unknown>,
  IDType extends DataTableRowId,
>(props: Props<T, IDType>) {
  const {
    rows,
    columns,
    selectedIds,
    enableSelection = true,
    getRowId,
    onToggleRow,
    emptyState,
    styles,
    slotProps,
  } = props;

  if (rows.length === 0) {
    const emptyWrapperSlot = resolveSlot<DataTableSlot>({
      slot: "mobileList",
      styles,
      slotProps,
      baseStyle: {
        padding: "0.85rem",
        minWidth: 0,
        borderRadius: "var(--ui-radius-xl)",
        border: "1px solid var(--ui-border)",
        background: "var(--ui-surface)",
      },
    });

    return (
      <div {...emptyWrapperSlot}>
        <DataTableEmptyState
          emptyState={emptyState}
          styles={styles}
          slotProps={slotProps}
        />
      </div>
    );
  }

  const listSlot = resolveSlot<DataTableSlot>({
    slot: "mobileList",
    styles,
    slotProps,
    baseProps: {
      "data-ui-data-table-mobile-list": "",
    },
    baseStyle: {
      width: "100%",
      minWidth: 0,
      display: "flex",
      flexDirection: "column",
      gap: "0.75rem",
    },
  });

  return (
    <div {...listSlot}>
      {rows.map((row, rowIndex) => {
        const rowId = getRowId(row);
        const selected =
          rowId !== undefined ? selectedIds.includes(rowId) : false;

        const cardSlot = resolveSlot<DataTableSlot>({
          slot: "mobileCard",
          styles,
          slotProps,
          baseProps: {
            "data-ui-data-table-mobile-card": "",
            "data-ui-data-table-row-index": String(rowIndex),
            "data-ui-data-table-row-selected": selected || undefined,
          },
          baseStyle: {
            padding: "0.85rem",
            minWidth: 0,
            borderRadius: "var(--ui-radius-xl)",
            border: selected
              ? "1px solid var(--ui-primary)"
              : "1px solid var(--ui-border)",
            background: "var(--ui-surface)",
            boxShadow: "var(--ui-shadow-sm)",
          },
        });

        const headerSlot = resolveSlot<DataTableSlot>({
          slot: "mobileCardHeader",
          styles,
          slotProps,
          baseStyle: {
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "0.75rem",
            marginBottom: "0.7rem",
          },
        });

        const titleSlot = resolveSlot<DataTableSlot>({
          slot: "mobileCardTitle",
          styles,
          slotProps,
          baseStyle: {
            margin: 0,
            fontSize: "var(--ui-font-size-sm)",
            fontWeight: 800,
            color: "var(--ui-text)",
          },
        });

        const bodySlot = resolveSlot<DataTableSlot>({
          slot: "mobileCardBody",
          styles,
          slotProps,
          baseStyle: {
            display: "flex",
            flexDirection: "column",
            gap: "0.65rem",
          },
        });

        const idSlot = resolveSlot<DataTableSlot>({
          slot: "mobileCardId",
          styles,
          slotProps,
          baseStyle: {
            margin: "0.75rem 0 0",
            wordBreak: "break-all",
            fontSize: "var(--ui-font-size-sm)",
            color: "var(--ui-text-soft)",
          },
        });

        return (
          <div
            key={rowId !== undefined ? String(rowId) : `mobile-row-${rowIndex}`}
            {...cardSlot}
          >
            <div {...headerSlot}>
              <div {...titleSlot}>Registro {rowIndex + 1}</div>

              {enableSelection && rowId !== undefined ? (
                <Checkbox
                  checked={selected}
                  onChange={() => onToggleRow?.(rowId)}
                />
              ) : null}
            </div>

            <div {...bodySlot}>
              {columns
                .filter((column) => !column.hidden)
                .map((column, columnIndex) => {
                  const rawValue = readCellValue(row, column.accessor);

                  const titleText =
                    typeof column.exportValue === "function"
                      ? getCellText(column.exportValue(row))
                      : getCellText(rawValue);

                  const fieldSlot = resolveSlot<DataTableSlot>({
                    slot: "mobileCardField",
                    styles,
                    slotProps,
                  });

                  const labelSlot = resolveSlot<DataTableSlot>({
                    slot: "mobileCardLabel",
                    styles,
                    slotProps,
                    baseStyle: {
                      margin: "0 0 0.25rem",
                      fontSize: "var(--ui-font-size-sm)",
                      fontWeight: 800,
                      color: "var(--ui-text-muted)",
                    },
                  });

                  const valueSlot = resolveSlot<DataTableSlot>({
                    slot: "mobileCardValue",
                    styles,
                    slotProps,
                    baseProps: {
                      title: titleText || undefined,
                    },
                    baseStyle: {
                      margin: 0,
                      wordBreak: "break-word",
                      fontSize: "var(--ui-font-size-sm)",
                      color: "var(--ui-text)",
                    },
                  });

                  return (
                    <div key={`${column.header}-${columnIndex}`} {...fieldSlot}>
                      <div {...labelSlot}>{column.header}</div>

                      {"editable" in props && props.editable ? (
                        renderEditableControl(
                          row,
                          rowIndex,
                          column as EditableDataTableColumn<T>,
                          props.onCellChange
                        )
                      ) : typeof column.Cell === "function" ? (
                        column.Cell(row)
                      ) : (
                        <div {...valueSlot}>{toRenderableValue(rawValue)}</div>
                      )}
                    </div>
                  );
                })}
            </div>

            {rowId !== undefined ? (
              <div {...idSlot}>id: {String(rowId)}</div>
            ) : null}

            {!enableSelection && rowId !== undefined ? (
              <Button type="button" size="sm" variant="ghost" disabled>
                {String(rowId)}
              </Button>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}