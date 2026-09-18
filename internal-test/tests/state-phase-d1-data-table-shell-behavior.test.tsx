import {
  describe,
  expect,
  it,
  vi,
} from "vitest";

import {
  DataTable,
  EditableDataTable,
} from "zerina-ui";

import type {
  DataTableColumn,
  EditableDataTableColumn,
} from "zerina-ui";

import {
  renderDOM,
} from "./react-dom-test-utils";


type Row = {
  id:
    number;

  name:
    string;
};


const rows:
  Row[] = [
    {
      id:
        1,

      name:
        "Ada",
    },
  ];


const columns:
  DataTableColumn<Row>[] = [
    {
      id:
        "name",

      header:
        "Name",

      accessor:
        "name",
    },
  ];


const editableColumns:
  EditableDataTableColumn<Row>[] = [
    {
      id:
        "name",

      header:
        "Name",

      accessor:
        "name",

      type:
        "string",
    },
  ];


describe(
  "Phase D1 DataTable shared shell behavior",
  () => {
    it(
      "gives standard and editable tables the same shell lifecycle",
      () => {
        const standard =
          renderDOM(
            <DataTable
              data={
                rows
              }

              columns={
                columns
              }

              getRowId={(
                row,
              ) =>
                row.id
              }

              enableSearch

              mobileMode="never"
            />,
          );


        const editable =
          renderDOM(
            <EditableDataTable
              data={
                rows
              }

              columns={
                editableColumns
              }

              getRowId={(
                row,
              ) =>
                row.id
              }

              createEmptyRow={() => ({
                id:
                  2,

                name:
                  "",
              })}

              onDataChange={
                vi.fn()
              }

              mobileMode="never"
            />,
          );


        for (
          const container of [
            standard,
            editable,
          ]
        ) {
          expect(
            container.querySelector(
              '[data-ui="data-table"]',
            ),
          ).not.toBeNull();

          expect(
            container.querySelector(
              "[data-ui-data-table-toolbar]",
            ),
          ).not.toBeNull();

          expect(
            container.querySelector(
              '[data-ui="data-table-pagination"]',
            ),
          ).not.toBeNull();

          expect(
            container.querySelector(
              '[data-ui="data-table-skeleton"]',
            ),
          ).toBeNull();
        }


        expect(
          standard.querySelector(
            "[data-ui-data-table-desktop]",
          ),
        ).not.toBeNull();

        expect(
          editable.querySelector(
            "[data-ui-data-table-editable-desktop]",
          ),
        ).not.toBeNull();
      },
    );


    it(
      "uses the same loading branch and suppresses pagination for both variants",
      () => {
        const standard =
          renderDOM(
            <DataTable
              data={
                rows
              }

              columns={
                columns
              }

              getRowId={(
                row,
              ) =>
                row.id
              }

              loading
            />,
          );


        const editable =
          renderDOM(
            <EditableDataTable
              data={
                rows
              }

              columns={
                editableColumns
              }

              getRowId={(
                row,
              ) =>
                row.id
              }

              createEmptyRow={() => ({
                id:
                  2,

                name:
                  "",
              })}

              onDataChange={
                vi.fn()
              }

              loading
            />,
          );


        for (
          const container of [
            standard,
            editable,
          ]
        ) {
          expect(
            container.querySelector(
              '[data-ui="data-table-skeleton"]',
            ),
          ).not.toBeNull();

          expect(
            container.querySelector(
              '[data-ui="data-table-pagination"]',
            ),
          ).toBeNull();
        }
      },
    );
  },
);
