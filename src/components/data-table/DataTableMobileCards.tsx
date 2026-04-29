// src/components/data-table/DataTableMobileCards.tsx
import { Button, Checkbox, Input, Select } from "../../primitives/forms";
import { Box, Flex, Stack } from "../../primitives/layout";
import { Typography } from "../../primitives/typography";

import type {
  DataTableColumn,
  DataTableEmptyStateConfig,
  DataTableRowId,
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
      <Typography size="sm" style={{ margin: 0, wordBreak: "break-word" }}>
        {toRenderableValue(value)}
      </Typography>
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
  } = props;

  if (rows.length === 0) {
    return (
      <Box
        rounded="var(--ui-radius-xl)"
        border="1px solid var(--ui-border)"
        bg="var(--ui-surface)"
        style={{ padding: "0.85rem", minWidth: 0 }}
      >
        <DataTableEmptyState emptyState={emptyState} />
      </Box>
    );
  }

  return (
    <Stack spacing="0.75rem" style={{ width: "100%", minWidth: 0 }}>
      {rows.map((row, rowIndex) => {
        const rowId = getRowId(row);
        const selected =
          rowId !== undefined ? selectedIds.includes(rowId) : false;

        return (
          <Box
            key={rowId !== undefined ? String(rowId) : `mobile-row-${rowIndex}`}
            rounded="var(--ui-radius-xl)"
            border={
              selected
                ? "1px solid var(--ui-primary)"
                : "1px solid var(--ui-border)"
            }
            bg="var(--ui-surface)"
            shadow="var(--ui-shadow-sm)"
            style={{
              padding: "0.85rem",
              minWidth: 0,
            }}
          >
            <Flex
              align="center"
              justify="space-between"
              gap="0.75rem"
              style={{ marginBottom: "0.7rem" }}
            >
              <Typography size="sm" weight={800} style={{ margin: 0 }}>
                Registro {rowIndex + 1}
              </Typography>

              {enableSelection && rowId !== undefined ? (
                <Checkbox
                  checked={selected}
                  onChange={() => onToggleRow?.(rowId)}
                />
              ) : null}
            </Flex>

            <Stack spacing="0.65rem">
              {columns
                .filter((column) => !column.hidden)
                .map((column, columnIndex) => {
                  const rawValue = readCellValue(row, column.accessor);

                  const titleText =
                    typeof column.exportValue === "function"
                      ? getCellText(column.exportValue(row))
                      : getCellText(rawValue);

                  return (
                    <Box key={`${column.header}-${columnIndex}`}>
                      <Typography
                        size="sm"
                        weight={800}
                        color="var(--ui-text-muted)"
                        style={{ margin: "0 0 0.25rem" }}
                      >
                        {column.header}
                      </Typography>

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
                        <Typography
                          size="sm"
                          title={titleText || undefined}
                          style={{
                            margin: 0,
                            wordBreak: "break-word",
                          }}
                        >
                          {toRenderableValue(rawValue)}
                        </Typography>
                      )}
                    </Box>
                  );
                })}
            </Stack>

            {rowId !== undefined ? (
              <Typography
                size="sm"
                color="var(--ui-text-soft)"
                style={{
                  margin: "0.75rem 0 0",
                  wordBreak: "break-all",
                }}
              >
                id: {String(rowId)}
              </Typography>
            ) : null}

            {!enableSelection && rowId !== undefined ? (
              <Button type="button" size="sm" variant="ghost" disabled>
                {String(rowId)}
              </Button>
            ) : null}
          </Box>
        );
      })}
    </Stack>
  );
}