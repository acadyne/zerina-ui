// @vitest-environment node

import {
  existsSync,
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

const ROOT =
  resolve(
    process.cwd(),
    ".."
  );

const SRC =
  resolve(
    ROOT,
    "src"
  );

function readSource(
  relativePath: string
): string {
  return readFileSync(
    resolve(
      SRC,
      relativePath
    ),
    "utf8"
  );
}

describe(
  "layout and responsive foundation ownership",
  () => {
    it(
      "keeps a single cssSize implementation",
      () => {
        const sourceFiles = [
          "helpers/css.ts",
          "primitives/layout/Screen.tsx",
          "patterns/scaffold/adaptive-scaffold/adaptiveScaffold.utils.tsx",
        ];

        const declarations =
          sourceFiles.reduce(
            (
              count,
              relativePath
            ) =>
              count +
              (
                readSource(
                  relativePath
                ).match(
                  /function\s+(?:toCssSize|cssSize)\s*\(/g
                )?.length ??
                0
              ),
            0
          );

        expect(
          declarations
        ).toBe(
          1
        );

        expect(
          readSource(
            "patterns/scaffold/adaptive-scaffold/AdaptiveScaffold.tsx"
          )
        ).toContain(
          'cssSize,'
        );
      }
    );

    it(
      "keeps one safe-area owner for TypeScript layout code",
      () => {
        const safeAreaOwner =
          readSource(
            "helpers/safeArea.ts"
          );

        expect(
          safeAreaOwner
        ).toContain(
          "interface SafeAreaEdges"
        );

        expect(
          safeAreaOwner
        ).toContain(
          "resolveSafeAreaEdges"
        );

        expect(
          safeAreaOwner
        ).toContain(
          "getSafeAreaOffset"
        );

        expect(
          safeAreaOwner
        ).toContain(
          "getSafeAreaPadding"
        );

        for (
          const consumer of [
            "primitives/layout/SafeArea.tsx",
            "primitives/layout/Screen.tsx",
            "patterns/scaffold/ScreenContent.tsx",
            "patterns/scaffold/TopAppBar.tsx",
            "patterns/scaffold/FloatingActionButton.tsx",
            "primitives/navigation/bottom-navigation/bottomNavigation.styles.ts",
            "primitives/navigation/navigation-rail/navigationRail.styles.ts",
            "primitives/overlay/Dialog.tsx",
            "primitives/overlay/Drawer.tsx",
            "primitives/overlay/BottomSheet.tsx",
            "components/feedback/ToastProvider.tsx",
          ]
        ) {
          expect(
            readSource(
              consumer
            )
          ).toContain(
            "helpers/safeArea"
          );
        }
      }
    );

    it(
      "does not keep a second PageScroll public path",
      () => {
        expect(
          existsSync(
            resolve(
              SRC,
              "primitives/layout/PageScroll.tsx"
            )
          )
        ).toBe(
          false
        );

        expect(
          readSource(
            "primitives/layout/index.ts"
          )
        ).not.toContain(
          "PageScroll"
        );
      }
    );

    it(
      "uses useAdaptiveViewport as the single component responsive resolver",
      () => {
        const adaptive =
          readSource(
            "patterns/scaffold/adaptive-scaffold/AdaptiveScaffold.tsx"
          );

        const dataTableShell =
          readSource(
            "components/data-table/useDataTableShell.ts"
          );

        expect(
          adaptive
        ).toContain(
          "useAdaptiveViewport"
        );

        expect(
          dataTableShell
        ).toContain(
          "useAdaptiveViewport"
        );

        for (
          const duplicate of [
            "useElementSize",
            "useMediaQuery",
            "resolveAdaptiveScaffoldMode",
            "useDataTableResponsiveMode",
          ]
        ) {
          expect(
            adaptive
          ).not.toContain(
            duplicate
          );

          expect(
            dataTableShell
          ).not.toContain(
            duplicate
          );
        }

        expect(
          existsSync(
            resolve(
              SRC,
              "components/data-table/hooks/useDataTableResponsiveMode.ts"
            )
          )
        ).toBe(
          false
        );
      }
    );
  }
);
