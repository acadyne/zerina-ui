// @vitest-environment node

import {
  readFileSync,
} from "node:fs";

import {
  resolve,
} from "node:path";

import {
  describe,
  expect,
  it,
} from "vitest";


const SRC =
  resolve(
    process.cwd(),
    "..",
    "src",
  );


function readSource(
  relativePath:
    string,
): string {
  return readFileSync(
    resolve(
      SRC,
      relativePath,
    ),
    "utf8",
  );
}


describe(
  "Phase D1 DataTable shell ownership",
  () => {
    it(
      "centralizes shared DataTable state in useDataTableShell",
      () => {
        const shell =
          readSource(
            "components/data-table/useDataTableShell.ts",
          );


        for (
          const owner of [
            "useDataTableState",
            "useAdaptiveViewport",
            "createDataTableRowIdResolver",
            "useDataTableSelection",
            "useDataTableExport",
          ]
        ) {
          expect(
            shell,
          ).toContain(
            owner,
          );
        }
      },
    );


    it(
      "centralizes root/toolbar/loading/responsive-switch/pagination in one frame",
      () => {
        const frame =
          readSource(
            "components/data-table/DataTableShellFrame.tsx",
          );


        for (
          const component of [
            "DataTableRoot",
            "DataTableToolbar",
            "DataTableSkeleton",
            "DataTablePagination",
          ]
        ) {
          expect(
            frame,
          ).toContain(
            component,
          );
        }


        expect(
          frame,
        ).toContain(
          "isMobile",
        );

        expect(
          frame,
        ).toContain(
          "mobileContent",
        );

        expect(
          frame,
        ).toContain(
          "desktopContent",
        );
      },
    );


    it.each([
      "components/data-table/DataTable.tsx",
      "components/data-table/EditableDataTable.tsx",
    ])(
      "%s consumes the shared state and frame owners",
      (
        relativePath,
      ) => {
        const source =
          readSource(
            relativePath,
          );


        expect(
          source,
        ).toContain(
          "useDataTableShell",
        );

        expect(
          source,
        ).toContain(
          "DataTableShellFrame",
        );


        for (
          const duplicateOwner of [
            "useDataTableState",
            "useAdaptiveViewport",
            "useDataTableSelection",
            "useDataTableExport",
            "<DataTableRoot",
            "<DataTableToolbar",
            "<DataTableSkeleton",
            "<DataTablePagination",
          ]
        ) {
          expect(
            source,
          ).not.toContain(
            duplicateOwner,
          );
        }
      },
    );


    it(
      "keeps editable mutations in EditableDataTable",
      () => {
        const editable =
          readSource(
            "components/data-table/EditableDataTable.tsx",
          );

        const shell =
          readSource(
            "components/data-table/useDataTableShell.ts",
          );

        const frame =
          readSource(
            "components/data-table/DataTableShellFrame.tsx",
          );


        for (
          const semantic of [
            "handleCellChange",
            "handleAddRow",
            "handleDeleteRows",
            "coerceEditableValue",
          ]
        ) {
          expect(
            editable,
          ).toContain(
            semantic,
          );

          expect(
            shell,
          ).not.toContain(
            semantic,
          );

          expect(
            frame,
          ).not.toContain(
            semantic,
          );
        }
      },
    );
  },
);
