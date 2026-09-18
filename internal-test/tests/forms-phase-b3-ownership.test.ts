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
  "Phase B3 press bridge ownership",
  () => {
    it(
      "keeps public/slot press composition in one internal bridge",
      () => {
        const bridge =
          readSource(
            "core/interaction/press/usePressSlotBridge.ts",
          );


        expect(
          bridge,
        ).toContain(
          "usePress",
        );

        expect(
          bridge,
        ).toContain(
          "composeEventHandlers",
        );

        expect(
          bridge,
        ).toContain(
          "checkDefaultPrevented",
        );


        for (
          const path of [
            "primitives/forms/Button.tsx",
            "primitives/forms/IconButton.tsx",
            "primitives/forms/Pressable.tsx",
            "components/display/Card.tsx",
          ]
        ) {
          const source =
            readSource(
              path,
            );


          expect(
            source,
          ).toContain(
            "usePressSlotBridge",
          );

          expect(
            source,
          ).not.toContain(
            "composeEventHandlers",
          );

          expect(
            source,
          ).not.toMatch(
            /\busePress(?:\s*<|\s*\()/,
          );
        }
      },
    );


    it(
      "keeps long press and polymorphic semantics in Pressable",
      () => {
        const source =
          readSource(
            "primitives/forms/Pressable.tsx",
          );


        expect(
          source,
        ).toContain(
          "isNativeInteractiveElement",
        );

        expect(
          source,
        ).toContain(
          "onLongPress",
        );

        expect(
          source,
        ).toContain(
          "longPressDelay",
        );

        expect(
          source,
        ).toContain(
          "const Component",
        );
      },
    );


    it(
      "keeps Card interactivity conditional on onPress",
      () => {
        const source =
          readSource(
            "components/display/Card.tsx",
          );


        expect(
          source,
        ).toMatch(
          /const\s+isInteractive\s*=\s*onPress\s*!==\s*undefined/s,
        );

        expect(
          source,
        ).toContain(
          '"data-ui-card-interactive"',
        );

        expect(
          source,
        ).toMatch(
          /role=\{isInteractive\s*\?\s*role\s*\?\?\s*"button"\s*:\s*role\}/s,
        );
      },
    );
  },
);
