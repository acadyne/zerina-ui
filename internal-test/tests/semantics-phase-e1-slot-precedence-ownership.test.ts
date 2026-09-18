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
  "Phase E1 slot precedence ownership",
  () => {
    it(
      "provides a single-slot contextual resolver over the layered owner",
      () => {
        const css =
          readSource(
            "helpers/css.ts",
          );


        expect(
          css,
        ).toContain(
          "resolveContextualSlot",
        );

        expect(
          css,
        ).toContain(
          "return resolveLayeredSlot",
        );
      },
    );


    it.each([
      "components/display/Card.tsx",
      "primitives/disclosure/Accordion.tsx",
      "primitives/overlay/Drawer.tsx",
      "primitives/overlay/BottomSheet.tsx",
      "primitives/overlay/Popover.tsx",
      "primitives/overlay/Tooltip.tsx",
      "primitives/overlay/Dialog.tsx",
    ])(
      "%s does not use whole-map context fallback",
      (
        relativePath,
      ) => {
        const source =
          readSource(
            relativePath,
          );


        expect(
          source,
        ).not.toMatch(
          /styles\s*\?\?\s*ctx/,
        );

        expect(
          source,
        ).not.toMatch(
          /slotProps\s*\?\?\s*ctx/,
        );
      },
    );



    it(
      "supports explicit N-layer resolution for nested compound contexts",
      () => {
        const css =
          readSource(
            "helpers/css.ts",
          );

        const accordion =
          readSource(
            "primitives/disclosure/Accordion.tsx",
          );


        expect(
          css,
        ).toContain(
          "resolveSlotLayers",
        );

        expect(
          accordion,
        ).toContain(
          "resolveSlotLayers",
        );

        expect(
          accordion,
        ).toContain(
          "accordion?.styles",
        );

        expect(
          accordion,
        ).toContain(
          "item.styles",
        );
      },
    );


    it(
      "keeps trigger event layers explicit as local before context",
      () => {
        for (
          const relativePath of [
            "primitives/overlay/Popover.tsx",
            "primitives/overlay/Tooltip.tsx",
          ]
        ) {
          const source =
            readSource(
              relativePath,
            );


          const localIndex =
            source.indexOf(
              "slotProps?.trigger",
            );

          const contextIndex =
            source.indexOf(
              "ctx.slotProps",
              localIndex,
            );


          expect(
            localIndex,
          ).toBeGreaterThanOrEqual(
            0,
          );

          expect(
            contextIndex,
          ).toBeGreaterThan(
            localIndex,
          );
        }
      },
    );


    it(
      "aligns text controls to public then slot event precedence",
      () => {
        const source =
          readSource(
            "primitives/forms/use-text-control-runtime.ts",
          );


        expect(
          source,
        ).toContain(
          "prop pública -> slot local -> conducta interna",
        );


        const focusChain =
          source.indexOf(
            "composeEventHandlers(\n          onFocus,\n          slotOnFocus,",
          );

        const blurChain =
          source.indexOf(
            "composeEventHandlers(\n          onBlur,\n          slotOnBlur,",
          );


        expect(
          focusChain,
        ).toBeGreaterThanOrEqual(
          0,
        );

        expect(
          blurChain,
        ).toBeGreaterThanOrEqual(
          0,
        );
      },
    );
  },
);
