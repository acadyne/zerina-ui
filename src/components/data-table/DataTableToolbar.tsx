// src/components/data-table/DataTableToolbar.tsx

import { Download, Plus, Trash2 } from "lucide-react";
import { Box, Flex } from "../../primitives/layout";
import { Button, Input, Select } from "../../primitives/forms";

interface DataTableToolbarProps {
  search: string;
  onSearchChange: (value: string) => void;

  enableSearch?: boolean;
  enableExportCSV?: boolean;
  canExport?: boolean;
  onExportCSV?: () => void;

  renderActions?: () => React.ReactNode;

  rowsPerPage: number;
  onRowsPerPageChange: (value: number) => void;

  enableAddRow?: boolean;
  onAddRow?: () => void;

  enableDeleteRows?: boolean;
  canDeleteRows?: boolean;
  onDeleteRows?: () => void;
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
}: DataTableToolbarProps) {
  const shouldRender =
    enableSearch ||
    enableExportCSV ||
    renderActions ||
    enableAddRow ||
    enableDeleteRows;

  if (!shouldRender) return null;

  return (
    <Flex
      justify="space-between"
      align="center"
      mb="12px"
      gap="12px"
      wrap="wrap"
      style={{ minWidth: 0 }}
    >
      <Flex align="center" justify="flex-start" gap="8px" wrap="wrap">
        {renderActions ? <Box>{renderActions()}</Box> : null}

        {enableAddRow ? (
          <Button
            type="button"
            size="sm"
            colorScheme="primary"
            leftIcon={<Plus size={14} />}
            onClick={onAddRow}
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
            leftIcon={<Trash2 size={14} />}
            disabled={!canDeleteRows}
            onClick={onDeleteRows}
          >
            Eliminar
          </Button>
        ) : null}
      </Flex>

      <Flex align="center" justify="flex-end" gap="10px" wrap="wrap">
        {enableSearch ? (
          <Input
            type="text"
            placeholder="Buscar…"
            value={search}
            onChange={(event) => onSearchChange(event.currentTarget.value)}
            fullWidth={false}
            style={{ minWidth: 220 }}
          />
        ) : null}

        <Select
          value={String(rowsPerPage)}
          onChange={(event) => onRowsPerPageChange(Number(event.currentTarget.value))}
          fullWidth={false}
          size="sm"
          options={[
            { label: "10", value: "10" },
            { label: "20", value: "20" },
            { label: "50", value: "50" },
            { label: "100", value: "100" },
          ]}
        />

        {enableExportCSV && canExport ? (
          <Button
            type="button"
            onClick={onExportCSV}
            variant="ghost"
            leftIcon={<Download size={16} />}
            px="10px"
            py="6px"
            style={{
              minHeight: 34,
              fontWeight: 700,
              borderRadius: 10,
            }}
            title="Exporta lo filtrado y ordenado"
          >
            CSV
          </Button>
        ) : null}
      </Flex>
    </Flex>
  );
}