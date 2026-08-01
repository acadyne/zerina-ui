// src/components/data-table/hooks/useDataTableSelection.ts
import { useCallback, useMemo } from "react";
import type { DataTableRowId } from "../dataTable.types";
import {
  normalizeDataTableRowIds,
} from "../dataTable.utils";

export interface UseDataTableSelectionOptions<
  T extends Record<string, unknown>,
  IDType extends DataTableRowId,
> {
  rows: T[];
  allRows: T[];
  selectedIds: IDType[];
  onSelectionChange?: (selectedIds: IDType[]) => void;
  getRowId: (row: T) => IDType;
}

export function useDataTableSelection<
  T extends Record<string, unknown>,
  IDType extends DataTableRowId,
>({
  rows,
  allRows,
  selectedIds: controlledSelectedIds,
  onSelectionChange,
  getRowId,
}: UseDataTableSelectionOptions<T, IDType>) {
  const pageIds = useMemo(
    () =>
      rows.map(
        (row) => getRowId(row)
      ),
    [rows, getRowId]
  );

  const allIdSet = useMemo(
    () =>
      new Set(
        allRows.map(
          (row) => getRowId(row)
        )
      ),
    [allRows, getRowId]
  );

  const selectedIds = useMemo(
    () =>
      normalizeDataTableRowIds(
        controlledSelectedIds
      ).filter(
        (id) => allIdSet.has(id)
      ),
    [
      controlledSelectedIds,
      allIdSet,
    ]
  );

  const selectedIdSet = useMemo(
    () => new Set(selectedIds),
    [selectedIds]
  );

  const pageIdSet = useMemo(
    () => new Set(pageIds),
    [pageIds]
  );

  const isAllPageSelected = useMemo(() => {
    if (!pageIds.length) {
      return false;
    }

    return pageIds.every(
      (id) => selectedIdSet.has(id)
    );
  }, [
    pageIds,
    selectedIdSet,
  ]);

  const isSomePageSelected = useMemo(() => {
    if (!pageIds.length) {
      return false;
    }

    const selectedCount =
      pageIds.filter(
        (id) => selectedIdSet.has(id)
      ).length;

    return (
      selectedCount > 0 &&
      selectedCount < pageIds.length
    );
  }, [
    pageIds,
    selectedIdSet,
  ]);

  const toggleSelectAll = useCallback(() => {
    if (
      !onSelectionChange ||
      !pageIds.length
    ) {
      return;
    }

    if (isAllPageSelected) {
      onSelectionChange(
        selectedIds.filter(
          (id) => !pageIdSet.has(id)
        )
      );

      return;
    }

    const nextSelectedIds = [
      ...selectedIds,
    ];

    for (const id of pageIds) {
      if (!selectedIdSet.has(id)) {
        nextSelectedIds.push(id);
      }
    }

    onSelectionChange(
      nextSelectedIds
    );
  }, [
    isAllPageSelected,
    onSelectionChange,
    pageIds,
    pageIdSet,
    selectedIds,
    selectedIdSet,
  ]);

  const toggleSelectRow = useCallback(
    (id: IDType) => {
      if (!onSelectionChange) {
        return;
      }

      onSelectionChange(
        selectedIdSet.has(id)
          ? selectedIds.filter(
              (item) => item !== id
            )
          : [
              ...selectedIds,
              id,
            ]
      );
    },
    [
      onSelectionChange,
      selectedIds,
      selectedIdSet,
    ]
  );

  return {
    pageIds,
    selectedIds,
    selectedIdSet,
    isAllPageSelected,
    isSomePageSelected,
    toggleSelectAll,
    toggleSelectRow,
  };
}
