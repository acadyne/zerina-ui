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
  "Phase D2 navigation entries ownership",
  () => {
    it(
      "keeps IDs, controlled state, normalization and history mutations in one hook",
      () => {
        const owner =
          readSource(
            "patterns/navigation-stack/useNavigationEntries.ts",
          );


        for (
          const semantic of [
            "React.useId",
            "entrySequenceRef",
            "internalEntries",
            "internalTransitionDirection",
            "normalizeEntries",
            "updateEntries",
            "push",
            "replace",
            "pop",
            "popToRoot",
            "reset",
          ]
        ) {
          expect(
            owner,
          ).toContain(
            semantic,
          );
        }
      },
    );


    it.each([
      "patterns/navigation-stack/NavigationStack.tsx",
      "patterns/scaffold/tab-scaffold/TabScaffold.tsx",
    ])(
      "%s consumes the shared navigation history owner",
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
          "useNavigationEntries",
        );


        for (
          const staleOwner of [
            "entrySequenceRef",
            "internalEntries",
            "internalTransitionDirection",
            "setInternalEntries",
            "setInternalTransitionDirection",
          ]
        ) {
          expect(
            source,
          ).not.toContain(
            staleOwner,
          );
        }
      },
    );



    it(
      "does not recompute shared history derivations in TabScaffold",
      () => {
        const source =
          readSource(
            "patterns/scaffold/tab-scaffold/TabScaffold.tsx",
          );


        expect(
          source,
        ).not.toMatch(
          /const\s+canGoBack\s*=/,
        );

        expect(
          source,
        ).not.toMatch(
          /const\s+current\s*=/,
        );
      },
    );


    it(
      "keeps screen registry and motion ownership in NavigationStack",
      () => {
        const source =
          readSource(
            "patterns/navigation-stack/NavigationStack.tsx",
          );


        expect(
          source,
        ).toContain(
          "collectNavigationStackScreens",
        );

        expect(
          source,
        ).toContain(
          "MotionSwitch",
        );

        expect(
          source,
        ).toContain(
          "preset={animation}",
        );

        expect(
          source,
        ).not.toContain(
          "getNavigationStackMotionPreset",
        );
      },
    );


    it(
      "keeps tab selection policy and resetToTab in TabScaffold",
      () => {
        const source =
          readSource(
            "patterns/scaffold/tab-scaffold/TabScaffold.tsx",
          );


        for (
          const semantic of [
            "getInitialTab",
            "getActiveTab",
            "resetToTab",
            "onTabChange",
          ]
        ) {
          expect(
            source,
          ).toContain(
            semantic,
          );
        }
      },
    );



    it(
      "keeps useNavigationEntries internal",
      () => {
        const publicIndex =
          readSource(
            "patterns/navigation-stack/index.ts",
          );


        expect(
          publicIndex,
        ).not.toContain(
          "useNavigationEntries",
        );
      },
    );


    it(
      "retires parallel entry factories from product utils",
      () => {
        const navigationUtils =
          readSource(
            "patterns/navigation-stack/navigationStack.utils.tsx",
          );

        const tabUtils =
          readSource(
            "patterns/scaffold/tab-scaffold/tabScaffold.utils.tsx",
          );


        expect(
          navigationUtils,
        ).not.toContain(
          "createNavigationStackEntry",
        );

        expect(
          tabUtils,
        ).not.toContain(
          "createTabScaffoldEntry",
        );
      },
    );
  },
);
