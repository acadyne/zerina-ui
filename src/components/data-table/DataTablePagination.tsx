// src/components/data-table/DataTablePagination.tsx
import React from "react";
import { Button } from "../../primitives/forms";
import { Flex } from "../../primitives/layout";
import { Typography } from "../../primitives/typography";

export interface DataTablePaginationProps
  extends React.HTMLAttributes<HTMLDivElement> {
  page: number;
  totalPages: number;
  totalRows: number;
  previousLabel?: React.ReactNode;
  nextLabel?: React.ReactNode;
  onPreviousPage: () => void;
  onNextPage: () => void;
}

export const DataTablePagination = React.forwardRef<
  HTMLDivElement,
  DataTablePaginationProps
>(
  (
    {
      page,
      totalPages,
      totalRows,
      previousLabel = "Anterior",
      nextLabel = "Siguiente",
      onPreviousPage,
      onNextPage,
      style,
      ...rest
    },
    ref
  ) => {
    return (
      <Flex
        ref={ref}
        justify="space-between"
        align="center"
        gap="12px"
        wrap="wrap"
        data-ui="data-table-pagination"
        style={{
          padding: "12px 2px 0",
          ...style,
        }}
        {...rest}
      >
        <Button
          type="button"
          onClick={onPreviousPage}
          disabled={page <= 1}
        >
          {previousLabel}
        </Button>

        <Typography as="span" size="sm" style={{ margin: 0, opacity: 0.85 }}>
          Página {page} de {totalPages} · {totalRows} registros
        </Typography>

        <Button
          type="button"
          onClick={onNextPage}
          disabled={page >= totalPages}
        >
          {nextLabel}
        </Button>
      </Flex>
    );
  }
);

DataTablePagination.displayName = "DataTablePagination";