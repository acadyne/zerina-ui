import {
  describe,
  expect,
  it,
} from "vitest";

import {
  AdaptiveScaffold,
  DataTable,
} from "zerina-ui";

import type {
  DataTableColumn,
} from "zerina-ui";

import {
  renderDOM,
} from "./react-dom-test-utils";

type Row = {
  id: number;
  name: string;
};

const rows: Row[] = [
  {
    id: 1,
    name: "Ada",
  },
];

const columns: DataTableColumn<Row>[] = [
  {
    id: "name",
    header: "Name",
    accessor: "name",
  },
];

describe(
  "Phase 2A shared responsive resolver behavior",
  () => {
    it(
      "drives AdaptiveScaffold forced modes through the shared resolver",
      () => {
        const mobile =
          renderDOM(
            <AdaptiveScaffold
              mode="mobile"
              showAppBar={false}
              items={[
                {
                  id: "home",
                  label: "Home",
                },
              ]}
            >
              Content
            </AdaptiveScaffold>
          );

        const desktop =
          renderDOM(
            <AdaptiveScaffold
              mode="desktop"
              showAppBar={false}
              items={[
                {
                  id: "home",
                  label: "Home",
                },
              ]}
            >
              Content
            </AdaptiveScaffold>
          );

        expect(
          mobile.querySelector(
            '[data-ui-adaptive-scaffold-root][data-ui-adaptive-scaffold-mode="mobile"]'
          )
        ).not.toBeNull();

        expect(
          mobile.querySelector(
            "[data-ui-bottom-navigation]"
          )
        ).not.toBeNull();

        expect(
          desktop.querySelector(
            '[data-ui-adaptive-scaffold-root][data-ui-adaptive-scaffold-mode="desktop"]'
          )
        ).not.toBeNull();

        expect(
          desktop.querySelector(
            "[data-ui-navigation-list]"
          )
        ).not.toBeNull();
      }
    );

    it(
      "keeps DataTable always/never semantics on the shared resolver",
      () => {
        const mobile =
          renderDOM(
            <DataTable
              data={rows}
              columns={columns}
              getRowId={(row) => row.id}
              mobileMode="always"
            />
          );

        const desktop =
          renderDOM(
            <DataTable
              data={rows}
              columns={columns}
              getRowId={(row) => row.id}
              mobileMode="never"
            />
          );

        expect(
          mobile.querySelector(
            "[data-ui-data-table-mobile-list]"
          )
        ).not.toBeNull();

        expect(
          desktop.querySelector(
            "[data-ui-data-table-desktop]"
          )
        ).not.toBeNull();
      }
    );
  }
);
