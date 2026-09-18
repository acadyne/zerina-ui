import {
  describe,
  expect,
  it,
  vi,
} from "vitest";

import {
  BottomNavigation,
  NavigationRail,
} from "zerina-ui";

import {
  DataTableDesktop,
} from "../../src/components/data-table/DataTableDesktop";

import {
  DataTableEditableDesktop,
} from "../../src/components/data-table/DataTableEditableDesktop";

import type {
  DataTableColumn,
  EditableDataTableColumn,
} from "../../src/components/data-table/dataTable.types";

import {
  hasDialogTarget,
  resolveRenderableWithTarget,
} from "../../src/patterns/shared/TargetDialogFrame";

import {
  clickElement,
  renderDOM,
  setNativeInputValue,
} from "./react-dom-test-utils";


describe(
  "shared navigation destination engine",
  () => {
    it(
      "preserves BottomNavigation change/reselect semantics",
      () => {
        const onValueChange =
          vi.fn();

        const container =
          renderDOM(
            <BottomNavigation
              defaultValue="home"
              onValueChange={
                onValueChange
              }
            >
              <BottomNavigation.Item
                value="home"
                label="Home"
              />

              <BottomNavigation.Item
                value="settings"
                label="Settings"
              />
            </BottomNavigation>,
          );

        const items =
          Array.from(
            container.querySelectorAll<HTMLButtonElement>(
              "[data-ui-bottom-navigation-item]",
            ),
          );

        expect(
          items,
        ).toHaveLength(
          2,
        );

        expect(
          items[0]?.getAttribute(
            "aria-current",
          ),
        ).toBe(
          "page",
        );

        clickElement(
          items[1]!,
        );

        expect(
          onValueChange,
        ).toHaveBeenCalledTimes(
          1,
        );

        expect(
          onValueChange.mock
            .calls[0]?.[2],
        ).toEqual({
          value:
            "settings",

          previousValue:
            "home",

          reason:
            "change",
        });

        expect(
          items[1]?.getAttribute(
            "aria-current",
          ),
        ).toBe(
          "page",
        );

        clickElement(
          items[1]!,
        );

        expect(
          onValueChange.mock
            .calls[1]?.[2],
        ).toEqual({
          value:
            "settings",

          previousValue:
            "settings",

          reason:
            "reselect",
        });
      },
    );


    it(
      "preserves NavigationRail change/reselect semantics",
      () => {
        const onValueChange =
          vi.fn();

        const container =
          renderDOM(
            <NavigationRail
              defaultValue="home"
              onValueChange={
                onValueChange
              }
            >
              <NavigationRail.Item
                value="home"
                label="Home"
              />

              <NavigationRail.Item
                value="settings"
                label="Settings"
              />
            </NavigationRail>,
          );

        const items =
          Array.from(
            container.querySelectorAll<HTMLButtonElement>(
              "[data-ui-navigation-rail-item]",
            ),
          );

        expect(
          items,
        ).toHaveLength(
          2,
        );

        clickElement(
          items[1]!,
        );

        expect(
          onValueChange.mock
            .calls[0]?.[2],
        ).toEqual({
          value:
            "settings",

          previousValue:
            "home",

          reason:
            "change",
        });

        clickElement(
          items[1]!,
        );

        expect(
          onValueChange.mock
            .calls[1]?.[2],
        ).toEqual({
          value:
            "settings",

          previousValue:
            "settings",

          reason:
            "reselect",
        });
      },
    );


    it(
      "keeps public onPress cancellation ahead of selection",
      () => {
        const onValueChange =
          vi.fn();

        const container =
          renderDOM(
            <BottomNavigation
              defaultValue="home"
              onValueChange={
                onValueChange
              }
            >
              <BottomNavigation.Item
                value="home"
                label="Home"
              />

              <BottomNavigation.Item
                value="blocked"
                label="Blocked"
                onPress={(
                  event,
                ) => {
                  event.preventDefault();
                }}
              />
            </BottomNavigation>,
          );

        const blocked =
          container.querySelector<HTMLButtonElement>(
            '[data-ui-bottom-navigation-item][data-active="true"] + *',
          ) ??
          Array.from(
            container.querySelectorAll<HTMLButtonElement>(
              "[data-ui-bottom-navigation-item]",
            ),
          )[1];

        if (!blocked) {
          throw new Error(
            "Blocked navigation item was not found.",
          );
        }

        clickElement(
          blocked,
        );

        expect(
          onValueChange,
        ).not.toHaveBeenCalled();

        expect(
          blocked.getAttribute(
            "aria-current",
          ),
        ).toBeNull();
      },
    );
  },
);


type TableRow = {
  id: number;
  name: string;
  status: string;
};


describe(
  "shared DataTable desktop renderer",
  () => {
    const rows:
      TableRow[] = [
        {
          id: 1,
          name: "Ada",
          status: "active",
        },
      ];

    const columns:
      DataTableColumn<TableRow>[] = [
        {
          id: "name",
          header: "Name",
          accessor: "name",
          sortable: true,
        },
        {
          id: "status",
          header: "Status",
          accessor: "status",
        },
      ];


    it(
      "keeps static table sorting, metadata and cell rendering",
      () => {
        const onSort =
          vi.fn();

        const container =
          renderDOM(
            <DataTableDesktop
              rows={rows}
              columns={
                columns
              }
              getRowId={(
                row,
              ) =>
                row.id
              }
              enableSelection={
                false
              }
              onSort={onSort}
            />,
          );

        expect(
          container.querySelector(
            "[data-ui-data-table-desktop]",
          ),
        ).not.toBeNull();

        const row =
          container.querySelector(
            "[data-ui-data-table-row]",
          );

        expect(
          row?.textContent,
        ).toContain(
          "Ada",
        );

        const cells =
          Array.from(
            container.querySelectorAll<HTMLTableCellElement>(
              "tbody td",
            ),
          );

        expect(
          cells[0]?.title,
        ).toBe(
          "Ada",
        );

        const sortButton =
          container.querySelector<HTMLButtonElement>(
            "thead button",
          );

        if (!sortButton) {
          throw new Error(
            "Sortable header button was not found.",
          );
        }

        clickElement(
          sortButton,
        );

        expect(
          onSort,
        ).toHaveBeenCalledWith(
          columns[0],
        );
      },
    );


    it(
      "keeps editable cell rendering and change propagation",
      () => {
        const onCellChange =
          vi.fn();

        const editableColumns:
          EditableDataTableColumn<TableRow>[] = [
            {
              id: "name",
              header: "Name",
              accessor: "name",
              type: "string",
            },
          ];

        const container =
          renderDOM(
            <DataTableEditableDesktop
              rows={rows}
              columns={
                editableColumns
              }
              getRowId={(
                row,
              ) =>
                row.id
              }
              enableSelection={
                false
              }
              onCellChange={
                onCellChange
              }
            />,
          );

        expect(
          container.querySelector(
            "[data-ui-data-table-editable-desktop]",
          ),
        ).not.toBeNull();

        const input =
          container.querySelector<HTMLInputElement>(
            'input[aria-label="Name, fila 1"]',
          );

        if (!input) {
          throw new Error(
            "Editable DataTable input was not found.",
          );
        }

        setNativeInputValue(
          input,
          "Grace",
        );

        expect(
          onCellChange,
        ).toHaveBeenCalledWith(
          rows[0],
          0,
          editableColumns[0],
          "Grace",
        );
      },
    );
  },
);


describe(
  "shared target-dialog contract",
  () => {
    it(
      "treats falsy non-null targets as valid",
      () => {
        expect(
          hasDialogTarget(
            0,
          ),
        ).toBe(
          true,
        );

        expect(
          hasDialogTarget(
            "",
          ),
        ).toBe(
          true,
        );

        expect(
          hasDialogTarget(
            false,
          ),
        ).toBe(
          true,
        );

        expect(
          hasDialogTarget(
            null,
          ),
        ).toBe(
          false,
        );
      },
    );


    it(
      "resolves function renderables for zero and false targets",
      () => {
        expect(
          resolveRenderableWithTarget(
            (
              target:
                number,
            ) =>
              `target:${target}`,
            0,
          ),
        ).toBe(
          "target:0",
        );

        expect(
          resolveRenderableWithTarget(
            (
              target:
                boolean,
            ) =>
              target
                ? "yes"
                : "no",
            false,
          ),
        ).toBe(
          "no",
        );
      },
    );
  },
);
