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
    "src"
  );

function readSource(
  relativePath:
    string
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
  "Phase 2C scaffold ownership",
  () => {
    it(
      "keeps ScrollArea as the scroll engine and ScreenContent as the screen-content composer",
      () => {
        const screen =
          readSource(
            "primitives/layout/Screen.tsx"
          );

        const scaffold =
          readSource(
            "patterns/scaffold/Scaffold.tsx"
          );

        const scaffoldTypes =
          readSource(
            "patterns/scaffold/scaffold.types.ts"
          );

        const screenContent =
          readSource(
            "patterns/scaffold/ScreenContent.tsx"
          );

        expect(
          screenContent
        ).toContain(
          "<ScrollArea"
        );

        expect(
          screenContent
        ).toContain(
          "scrollable"
        );

        for (
          const source of [
            screen,
            scaffold,
            scaffoldTypes,
          ]
        ) {
          expect(
            source
          ).not.toContain(
            "Screen.Scroll"
          );

          expect(
            source
          ).not.toContain(
            "ScreenScroll"
          );
        }

        expect(
          scaffold
        ).not.toContain(
          "<ScrollArea"
        );

        expect(
          scaffold
        ).not.toContain(
          "scrollable"
        );

        expect(
          scaffoldTypes
        ).not.toContain(
          "scrollProps"
        );

        expect(
          scaffoldTypes
        ).not.toContain(
          "\"scroll\""
        );
      }
    );

    it(
      "accepts Screen root capabilities directly instead of a second screenProps channel",
      () => {
        const scaffoldTypes =
          readSource(
            "patterns/scaffold/scaffold.types.ts"
          );

        const scaffold =
          readSource(
            "patterns/scaffold/Scaffold.tsx"
          );

        expect(
          scaffoldTypes
        ).toContain(
          "ScreenProps"
        );

        expect(
          scaffoldTypes
        ).not.toMatch(
          /\bscreenProps\??:/
        );

        expect(
          scaffold
        ).toContain(
          "...screenRootProps"
        );

        expect(
          scaffold
        ).not.toMatch(
          /\bscreenProps\b/
        );
      }
    );

    it(
      "does not expose a parallel scaffoldProps channel from AdaptiveScaffold",
      () => {
        const types =
          readSource(
            "patterns/scaffold/adaptive-scaffold/adaptiveScaffold.types.ts"
          );

        const implementation =
          readSource(
            "patterns/scaffold/adaptive-scaffold/AdaptiveScaffold.tsx"
          );

        expect(
          types
        ).toContain(
          "extends Omit<"
        );

        expect(
          types
        ).toContain(
          "ScaffoldProps"
        );

        expect(
          types
        ).not.toMatch(
          /\bscaffoldProps\??:/
        );

        expect(
          implementation
        ).not.toContain(
          "scaffoldProps"
        );

        expect(
          implementation
        ).not.toContain(
          "scrollable={false}"
        );
      }
    );

    it(
      "separates sidebar width from rail width and lets custom side navigation size itself",
      () => {
        const types =
          readSource(
            "patterns/scaffold/adaptive-scaffold/adaptiveScaffold.types.ts"
          );

        const implementation =
          readSource(
            "patterns/scaffold/adaptive-scaffold/AdaptiveScaffold.tsx"
          );

        expect(
          types
        ).toContain(
          "sidebarWidth?"
        );

        expect(
          types
        ).not.toContain(
          "navigationWidth?"
        );

        expect(
          implementation
        ).toContain(
          "sidebarWidth = 284"
        );

        expect(
          implementation
        ).not.toContain(
          "navigationWidth"
        );

        const customSlotStart =
          implementation.indexOf(
            "const customSideNavigationSlot"
          );

        const customSlotEnd =
          implementation.indexOf(
            "const defaultSideNavigationNode"
          );

        const customSlot =
          implementation.slice(
            customSlotStart,
            customSlotEnd
          );

        expect(
          customSlot
        ).not.toContain(
          "sidebarWidth"
        );
      }
    );

    it(
      "propagates shell height through Scaffold content flex flow instead of percentage chains",
      () => {
        const scaffold =
          readSource(
            "patterns/scaffold/Scaffold.tsx"
          );

        const implementation =
          readSource(
            "patterns/scaffold/adaptive-scaffold/AdaptiveScaffold.tsx"
          );

        const scaffoldContentStart =
          scaffold.indexOf(
            "const contentSlot"
          );

        const scaffoldContentEnd =
          scaffold.indexOf(
            "const floatingSlot"
          );

        const scaffoldContent =
          scaffold.slice(
            scaffoldContentStart,
            scaffoldContentEnd
          );

        expect(
          scaffoldContent
        ).toContain(
          'height:\n              "100%"'
        );

        expect(
          scaffoldContent
        ).toContain(
          'display:\n              "flex"'
        );

        expect(
          scaffoldContent
        ).toContain(
          'flexDirection:\n              "column"'
        );

        const bodyStart =
          implementation.indexOf(
            "const bodySlot"
          );

        const bodyEnd =
          implementation.indexOf(
            "const tabletRailSlot"
          );

        const bodySlot =
          implementation.slice(
            bodyStart,
            bodyEnd
          );

        expect(
          bodySlot
        ).toContain(
          'display:\n          "flex"'
        );

        expect(
          bodySlot
        ).not.toContain(
          'height:\n          "100%"'
        );

        const contentNodeStart =
          implementation.indexOf(
            "const contentNode"
          );

        const contentNodeEnd =
          implementation.indexOf(
            "const footerNavigation"
          );

        const contentNode =
          implementation.slice(
            contentNodeStart,
            contentNodeEnd
          );

        expect(
          contentNode
        ).not.toContain(
          'height:\n          "100%"'
        );

        expect(
          contentNode
        ).toContain(
          'display:\n          "flex"'
        );

        expect(
          contentNode
        ).toContain(
          'flexDirection:\n          "column"'
        );

        expect(
          contentNode
        ).toContain(
          'data-ui-adaptive-scaffold-content-frame=""'
        );

        expect(
          contentNode
        ).toContain(
          '"1 1 0px"'
        );

        expect(
          implementation
        ).not.toContain(
          '"100vh"'
        );

        expect(
          implementation
        ).not.toContain(
          '"100dvh"'
        );

        expect(
          implementation
        ).not.toMatch(
          /position:\s*"fixed"/
        );
      }
    );
  }
);
