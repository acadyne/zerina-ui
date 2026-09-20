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
  "Phase 3 navigation presenter ownership",
  () => {
    it(
      "keeps compact projection in one owner",
      () => {
        const projection =
          readSource(
            "patterns/navigation/navigationProjection.ts",
          );

        const adaptive =
          readSource(
            "patterns/scaffold/adaptive-scaffold/AdaptiveScaffold.tsx",
          );

        expect(
          projection,
        ).toContain(
          "projectCompactNavigation",
        );

        expect(
          projection,
        ).toContain(
          "getNavigationNodeEntries",
        );

        expect(
          adaptive,
        ).not.toContain(
          "items.map",
        );


        const utils =
          readSource(
            "patterns/navigation/navigation.utils.ts",
          );

        expect(
          utils.match(
            /function getNavigationNodeEntries/g,
          )?.length,
        ).toBe(
          1,
        );

        expect(
          projection,
        ).not.toContain(
          "const visit =",
        );
      },
    );

    it(
      "makes AdaptiveScaffold delegate built-in navigation rendering to NavigationPresenter",
      () => {
        const adaptive =
          readSource(
            "patterns/scaffold/adaptive-scaffold/AdaptiveScaffold.tsx",
          );

        expect(
          adaptive,
        ).toContain(
          "<NavigationPresenter",
        );

        expect(
          adaptive,
        ).not.toContain(
          "<BottomNavigation",
        );

        expect(
          adaptive,
        ).not.toContain(
          "<NavigationRail",
        );

        expect(
          adaptive,
        ).not.toContain(
          "<NavigationList",
        );
      },
    );

    it(
      "moves tree ancestry checks out of NavigationList",
      () => {
        const list =
          readSource(
            "primitives/navigation/NavigationList.tsx",
          );

        const utils =
          readSource(
            "patterns/navigation/navigation.utils.ts",
          );

        expect(
          list,
        ).not.toContain(
          "function itemContainsId",
        );

        expect(
          list,
        ).toContain(
          "navigationNodeContainsId",
        );

        expect(
          utils,
        ).toContain(
          "function navigationNodeContainsId",
        );

        expect(
          utils,
        ).toContain(
          "function getNavigationNodePath",
        );
      },
    );

    it(
      "exposes one AdaptiveScaffold navigation configuration channel",
      () => {
        const types =
          readSource(
            "patterns/scaffold/adaptive-scaffold/adaptiveScaffold.types.ts",
          );

        expect(
          types,
        ).toContain(
          "navigation?:",
        );

        for (
          const retired of [
            "mobileNavigation?:",
            "tabletNavigation?:",
            "desktopNavigation?:",
            "navigationSlots?:",
            "bottomNavigationProps?:",
            "navigationRailProps?:",
            "navigationListProps?:",
          ]
        ) {
          expect(
            types,
          ).not.toContain(
            retired,
          );
        }
      },
    );
  },
);
