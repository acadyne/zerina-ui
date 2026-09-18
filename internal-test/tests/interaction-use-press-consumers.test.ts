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


function readSource(
  relativePath: string,
): string {
  const path =
    resolve(
      process.cwd(),
      "..",
      "src",
      relativePath,
    );


  return readFileSync(
    path,
    "utf-8",
  );
}


describe(
  "usePress consumer source contracts",
  () => {

    it(
      "tracks document modality before the first focus event",
      () => {
        const focusSource =
          readSource(
            "core/interaction/focus/useFocusVisible.ts",
          );

        expect(
          focusSource,
        ).toContain(
          "useIsomorphicLayoutEffect",
        );

        expect(
          focusSource,
        ).toMatch(
          /useIsomorphicLayoutEffect\([\s\S]*?retainTrackerForDocument\(\s*document\s*\)/,
        );

        expect(
          focusSource,
        ).toMatch(
          /ownerDocument\.addEventListener\(\s*"pointerdown"/,
        );

        expect(
          focusSource,
        ).toMatch(
          /ownerDocument\.addEventListener\(\s*"keydown"/,
        );
      },
    );


    const directConsumers = [
      {
        name:
          "MenuItem",

        path:
          "primitives/overlay/menu/MenuItem.tsx",
      },

      {
        name:
          "Toast",

        path:
          "components/feedback/Toast.tsx",
      },

      {
        name:
          "Tag",

        path:
          "components/display/Tag.tsx",
      },
    ];


    it.each(
      directConsumers,
    )(
      "$name consumes the canonical usePress hook directly",
      ({
        path,
      }) => {
        const source =
          readSource(
            path,
          );


        expect(
          source,
        ).toMatch(
          /\busePress(?:\s*<|\s*\()/,
        );
      },
    );


    const bridgedConsumers = [
      {
        name:
          "Button",

        path:
          "primitives/forms/Button.tsx",
      },

      {
        name:
          "IconButton",

        path:
          "primitives/forms/IconButton.tsx",
      },

      {
        name:
          "Pressable",

        path:
          "primitives/forms/Pressable.tsx",
      },

      {
        name:
          "Card",

        path:
          "components/display/Card.tsx",
      },
    ];


    it.each(
      bridgedConsumers,
    )(
      "$name consumes usePress through the shared slot bridge",
      ({
        path,
      }) => {
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
        ).not.toMatch(
          /\busePress(?:\s*<|\s*\()/,
        );
      },
    );


    it(
      "MenuItem separates logical focus from focus visibility",
      () => {
        const source =
          readSource(
            "primitives/overlay/menu/MenuItem.tsx",
          );


        expect(
          source,
        ).toMatch(
          /const\s+focused\s*=\s*press\.state\.focused\s*;/s,
        );

        expect(
          source,
        ).not.toMatch(
          /\bisFocused\b/,
        );

        expect(
          source,
        ).toMatch(
          /const\s+focusVisible\s*=\s*press\.state\.focusVisible\s*;/s,
        );

        expect(
          source,
        ).toMatch(
          /"data-focus-visible"\s*:\s*focusVisible\s*(?:\|\|\s*undefined|\?\s*["']{2}\s*:\s*undefined)/s,
        );

        expect(
          source,
        ).not.toMatch(
          /"data-focus-visible"\s*:\s*isFocused/,
        );

        expect(
          source,
        ).not.toMatch(
          /focusVisible\s*:\s*isFocused/,
        );
      },
    );
  },
);
