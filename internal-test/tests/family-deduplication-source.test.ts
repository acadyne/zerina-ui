// @vitest-environment node

import {
  readFileSync,
} from "node:fs";

import {
  fileURLToPath,
} from "node:url";

import {
  describe,
  expect,
  it,
} from "vitest";


function readRelative(
  relativePath: string,
): string {
  return readFileSync(
    fileURLToPath(
      new URL(
        relativePath,
        import.meta.url,
      ),
    ),
    "utf8",
  );
}


describe(
  "family implementation ownership",
  () => {
    it(
      "keeps navigation item rendering in one shared engine",
      () => {
        const bottom =
          readRelative(
            "../../src/primitives/navigation/bottom-navigation/BottomNavigationItem.tsx",
          );

        const rail =
          readRelative(
            "../../src/primitives/navigation/navigation-rail/NavigationRailItem.tsx",
          );

        const shared =
          readRelative(
            "../../src/primitives/navigation/shared/NavigationDestinationItem.tsx",
          );

        for (
          const wrapper of [
            bottom,
            rail,
          ]
        ) {
          expect(
            wrapper,
          ).toContain(
            "<NavigationDestinationItem",
          );

          expect(
            wrapper,
          ).not.toContain(
            "resolveLayeredSlot(",
          );

          expect(
            wrapper,
          ).not.toContain(
            "<Pressable",
          );
        }

        expect(
          shared,
        ).toContain(
          "resolveLayeredSlot",
        );

        expect(
          shared,
        ).toContain(
          "<Pressable",
        );
      },
    );


    it(
      "keeps navigation selection state in one hook",
      () => {
        const bottom =
          readRelative(
            "../../src/primitives/navigation/bottom-navigation/BottomNavigation.tsx",
          );

        const rail =
          readRelative(
            "../../src/primitives/navigation/navigation-rail/NavigationRail.tsx",
          );

        for (
          const root of [
            bottom,
            rail,
          ]
        ) {
          expect(
            root,
          ).toContain(
            "useNavigationSelection",
          );

          expect(
            root,
          ).not.toContain(
            "setInternalValue",
          );

          expect(
            root,
          ).not.toContain(
            '"reselect"',
          );
        }
      },
    );


    it(
      "keeps desktop table structure in one renderer",
      () => {
        const standard =
          readRelative(
            "../../src/components/data-table/DataTableDesktop.tsx",
          );

        const editable =
          readRelative(
            "../../src/components/data-table/DataTableEditableDesktop.tsx",
          );

        const shared =
          readRelative(
            "../../src/components/data-table/DataTableDesktopBase.tsx",
          );

        for (
          const wrapper of [
            standard,
            editable,
          ]
        ) {
          expect(
            wrapper,
          ).toContain(
            "<DataTableDesktopBase",
          );

          expect(
            wrapper,
          ).not.toContain(
            "<table",
          );

          expect(
            wrapper,
          ).not.toContain(
            "data-ui-data-table-selection-header",
          );
        }

        expect(
          shared,
        ).toContain(
          "<table",
        );

        expect(
          shared,
        ).toContain(
          "data-ui-data-table-selection-header",
        );
      },
    );


    it(
      "keeps target-dialog structure in one frame",
      () => {
        const confirm =
          readRelative(
            "../../src/patterns/ConfirmDialog.tsx",
          );

        const action =
          readRelative(
            "../../src/patterns/ActionDialog.tsx",
          );

        const frame =
          readRelative(
            "../../src/patterns/shared/TargetDialogFrame.tsx",
          );

        for (
          const wrapper of [
            confirm,
            action,
          ]
        ) {
          expect(
            wrapper,
          ).toContain(
            "<TargetDialogFrame",
          );

          expect(
            wrapper,
          ).not.toContain(
            "<DialogHeader",
          );

          expect(
            wrapper,
          ).not.toContain(
            'role="alert"',
          );
        }

        expect(
          frame,
        ).toContain(
          "<DialogHeader",
        );

        expect(
          frame,
        ).toContain(
          'role="alert"',
        );
      },
    );
  },
);
