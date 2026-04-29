// src/components/data-table/hooks/useDataTableSelection.ts
import { useCallback, useMemo } from "react";
import type { DataTableRowId } from "../dataTable.types";

export interface UseDataTableSelectionOptions<
  T extends Record<string, unknown>,
  IDType extends DataTableRowId,
> {
  rows: T[];
  selectedIds: IDType[];
  onSelectionChange?: (selectedIds: IDType[]) => void;
  getRowId: (row: T) => IDType | undefined;
}

export function useDataTableSelection<
  T extends Record<string, unknown>,
  IDType extends DataTableRowId,
>({
  rows,
  selectedIds,
  onSelectionChange,
  getRowId,
}: UseDataTableSelectionOptions<T, IDType>) {
  const pageIds = useMemo(
    () =>
      rows
        .map((row) => getRowId(row))
        .filter((id): id is IDType => id !== undefined),
    [rows, getRowId]
  );

  const isAllPageSelected = useMemo(() => {
    if (!pageIds.length) return false;
    return pageIds.every((id) => selectedIds.includes(id));
  }, [pageIds, selectedIds]);

  const isSomePageSelected = useMemo(() => {
    if (!pageIds.length) return false;

    const selectedCount = pageIds.filter((id) =>
      selectedIds.includes(id)
    ).length;

    return selectedCount > 0 && selectedCount < pageIds.length;
  }, [pageIds, selectedIds]);

  const toggleSelectAll = useCallback(() => {
    if (!onSelectionChange || !pageIds.length) return;

    if (isAllPageSelected) {
      onSelectionChange(selectedIds.filter((id) => !pageIds.includes(id)));
      return;
    }

    const toAdd = pageIds.filter((id) => !selectedIds.includes(id));
    onSelectionChange([...selectedIds, ...toAdd]);
  }, [
    isAllPageSelected,
    onSelectionChange,
    pageIds,
    selectedIds,
  ]);

  const toggleSelectRow = useCallback(
    (id: IDType) => {
      if (!onSelectionChange) return;

      onSelectionChange(
        selectedIds.includes(id)
          ? selectedIds.filter((item) => item !== id)
          : [...selectedIds, id]
      );
    },
    [onSelectionChange, selectedIds]
  );

  return {
    pageIds,
    isAllPageSelected,
    isSomePageSelected,
    toggleSelectAll,
    toggleSelectRow,
  };
}