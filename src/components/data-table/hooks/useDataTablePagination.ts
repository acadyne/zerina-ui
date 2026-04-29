// src/components/data-table/hooks/useDataTablePagination.ts
import { useCallback, useMemo, useState } from "react";

export interface UseDataTablePaginationOptions<T> {
  data: T[];
  initialRowsPerPage?: number;
}

export function useDataTablePagination<T>({
  data,
  initialRowsPerPage = 10,
}: UseDataTablePaginationOptions<T>) {
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPageState] = useState(initialRowsPerPage);

  const totalPages = Math.max(1, Math.ceil(data.length / rowsPerPage));
  const safeCurrentPage = Math.min(Math.max(1, currentPage), totalPages);

  const paginatedData = useMemo(() => {
    const start = (safeCurrentPage - 1) * rowsPerPage;
    return data.slice(start, start + rowsPerPage);
  }, [data, safeCurrentPage, rowsPerPage]);

  const setRowsPerPage = useCallback((value: number) => {
    setRowsPerPageState(value);
    setCurrentPage(1);
  }, []);

  const goToPreviousPage = useCallback(() => {
    setCurrentPage((page) => Math.max(1, page - 1));
  }, []);

  const goToNextPage = useCallback(() => {
    setCurrentPage((page) => Math.min(totalPages, page + 1));
  }, [totalPages]);

  const resetPage = useCallback(() => {
    setCurrentPage(1);
  }, []);

  return {
    currentPage,
    safeCurrentPage,
    rowsPerPage,
    totalPages,
    paginatedData,
    setCurrentPage,
    setRowsPerPage,
    goToPreviousPage,
    goToNextPage,
    resetPage,
  };
}