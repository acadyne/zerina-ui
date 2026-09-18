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
  "Phase B2 choice-control ownership",
  () => {
    it(
      "keeps shared choice wiring in one runtime",
      () => {
        const runtime =
          readSource(
            "primitives/forms/use-choice-control-runtime.ts",
          );

        expect(
          runtime,
        ).toContain(
          "useChoiceControl",
        );

        expect(
          runtime,
        ).toContain(
          "composeEventHandlerChain",
        );

        expect(
          runtime,
        ).toContain(
          "rootStateProps",
        );

        expect(
          runtime,
        ).toContain(
          "inputProps",
        );


        for (
          const relativePath of [
            "primitives/forms/Checkbox.tsx",
            "primitives/forms/Radio.tsx",
            "primitives/forms/Switch.tsx",
          ]
        ) {
          const source =
            readSource(
              relativePath,
            );

          expect(
            source,
          ).toContain(
            "useChoiceControlRuntime",
          );

          expect(
            source,
          ).not.toMatch(
            /\buseChoiceControl\s*\(/,
          );

          expect(
            source,
          ).not.toContain(
            "composeEventHandlers",
          );

          expect(
            source,
          ).not.toContain(
            "composeEventHandlerChain",
          );
        }
      },
    );


    it(
      "keeps component-specific semantics in the wrappers",
      () => {
        const checkbox =
          readSource(
            "primitives/forms/Checkbox.tsx",
          );

        const radio =
          readSource(
            "primitives/forms/Radio.tsx",
          );

        const switchSource =
          readSource(
            "primitives/forms/Switch.tsx",
          );


        expect(
          checkbox,
        ).toContain(
          ".indeterminate",
        );

        expect(
          checkbox,
        ).toContain(
          '"mixed"',
        );


        expect(
          radio,
        ).toContain(
          "useRadioGroupContext",
        );

        expect(
          radio,
        ).toContain(
          'type="radio"',
        );


        expect(
          switchSource,
        ).toContain(
          'role="switch"',
        );

        expect(
          switchSource,
        ).toContain(
          '"switch-thumb"',
        );
      },
    );


    it(
      "uses the canonical ReactNode presence owner for labels",
      () => {
        const root =
          readSource(
            "primitives/forms/ChoiceControlRoot.tsx",
          );

        expect(
          root,
        ).toContain(
          "hasRenderableNode",
        );

        expect(
          root,
        ).not.toContain(
          "Boolean(",
        );
      },
    );
  },
);
