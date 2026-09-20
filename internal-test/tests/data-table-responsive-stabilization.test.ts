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
  relativePath: string,
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
  "DataTable responsive stabilization after 7B",
  () => {
    it(
      "measures its own container while preserving the shared adaptive viewport owner",
      () => {
        const shell =
          readSource(
            "components/data-table/useDataTableShell.ts",
          );

        const frame =
          readSource(
            "components/data-table/DataTableShellFrame.tsx",
          );

        expect(
          shell,
        ).toContain(
          'source:\n        "container"',
        );

        expect(
          shell,
        ).toContain(
          "rootRef:",
        );

        expect(
          shell,
        ).toContain(
          "responsiveKind:",
        );

        expect(
          frame,
        ).toContain(
          "ref={\n        rootRef",
        );

        expect(
          frame,
        ).toContain(
          "data-ui-data-table-viewport",
        );
      },
    );

    it(
      "routes desktop headers and editable controls through shared slots without hardcoded editor minimum widths",
      () => {
        const desktop =
          readSource(
            "components/data-table/DataTableDesktopBase.tsx",
          );

        const editable =
          readSource(
            "components/data-table/DataTableEditableDesktop.tsx",
          );

        expect(
          desktop,
        ).toContain(
          '"data-ui-data-table-header-cell"',
        );

        expect(
          desktop,
        ).toContain(
          "column.width",
        );

        expect(
          editable,
        ).toContain(
          "fullWidth",
        );

        expect(
          editable,
        ).not.toContain(
          "? 260",
        );

        expect(
          editable,
        ).not.toContain(
          ": 160",
        );
      },
    );

    it(
      "uses the existing SearchInput and density projection instead of adding table-local responsive owners",
      () => {
        const toolbar =
          readSource(
            "components/data-table/DataTableToolbar.tsx",
          );

        const mobile =
          readSource(
            "components/data-table/DataTableMobileCards.tsx",
          );

        expect(
          toolbar,
        ).toContain(
          "SearchInput",
        );

        expect(
          toolbar,
        ).toContain(
          "--ui-density-inline-gap",
        );

        expect(
          mobile,
        ).toContain(
          "--ui-density-content-padding",
        );

        expect(
          mobile,
        ).toContain(
          "--ui-density-block-gap",
        );
      },
    );


    it(
      "keeps CSV resource creation out of render-driven table state",
      () => {
        const exportHook =
          readSource(
            "components/data-table/hooks/useDataTableExport.ts",
          );

        const toolbar =
          readSource(
            "components/data-table/DataTableToolbar.tsx",
          );

        expect(
          exportHook,
        ).not.toContain(
          "useEffect",
        );

        expect(
          exportHook,
        ).not.toContain(
          "useState",
        );

        expect(
          exportHook,
        ).toContain(
          "downloadCsv",
        );

        expect(
          toolbar,
        ).toContain(
          "{enableExportCSV ? (",
        );

        expect(
          toolbar,
        ).toContain(
          "disabled={\n              !canExport",
        );
      },
    );
  },
);
