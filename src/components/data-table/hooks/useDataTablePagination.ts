// src/components/data-table/hooks/useDataTablePagination.ts
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

export interface UseDataTablePaginationOptions<T> {
  data: T[];
  initialRowsPerPage?: number;
}

function requireRowsPerPage(
  value: number
): number {
  if (
    !Number.isFinite(value) ||
    !Number.isInteger(value) ||
    value <= 0
  ) {
    throw new RangeError(
      "DataTable rowsPerPage must be a positive finite integer."
    );
  }

  return value;
}

function clampPage(
  page: number,
  totalPages: number
): number {
  return Math.min(
    Math.max(1, page),
    totalPages
  );
}

export function useDataTablePagination<T>({
  data,
  initialRowsPerPage = 10,
}: UseDataTablePaginationOptions<T>) {
  const [
    currentPage,
    setCurrentPage,
  ] = useState(1);

  const [
    rowsPerPage,
    setRowsPerPageState,
  ] = useState(
    () =>
      requireRowsPerPage(
        initialRowsPerPage
      )
  );

  const totalPages = Math.max(
    1,
    Math.ceil(
      data.length / rowsPerPage
    )
  );

  const safeCurrentPage = clampPage(
    currentPage,
    totalPages
  );

  /*
   * safeCurrentPage protege el render inmediato; el efecto también corrige
   * el estado propietario para que las acciones siguientes no usen una
   * página obsoleta después de filtrar o reducir los datos.
   */
  useEffect(() => {
    setCurrentPage((page) => {
      const nextPage = clampPage(
        page,
        totalPages
      );

      return nextPage === page
        ? page
        : nextPage;
    });
  }, [totalPages]);

  const paginatedData = useMemo(() => {
    const start =
      (safeCurrentPage - 1) *
      rowsPerPage;

    return data.slice(
      start,
      start + rowsPerPage
    );
  }, [
    data,
    safeCurrentPage,
    rowsPerPage,
  ]);

  const setRowsPerPage = useCallback(
    (value: number) => {
      const nextRowsPerPage =
        requireRowsPerPage(value);

      setRowsPerPageState(
        nextRowsPerPage
      );

      setCurrentPage(1);
    },
    []
  );

  const goToPreviousPage = useCallback(() => {
    setCurrentPage((page) =>
      Math.max(
        1,
        clampPage(
          page,
          totalPages
        ) - 1
      )
    );
  }, [totalPages]);

  const goToNextPage = useCallback(() => {
    setCurrentPage((page) =>
      Math.min(
        totalPages,
        clampPage(
          page,
          totalPages
        ) + 1
      )
    );
  }, [totalPages]);

  const resetPage = useCallback(() => {
    setCurrentPage(1);
  }, []);

  return {
    safeCurrentPage,
    rowsPerPage,
    totalPages,
    paginatedData,
    setRowsPerPage,
    goToPreviousPage,
    goToNextPage,
    resetPage,
  };
}
