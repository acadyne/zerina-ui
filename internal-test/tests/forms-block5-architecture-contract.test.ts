// @vitest-environment node
// Fase F: clases A/B — architecture boundary + public API contract.

import {
  readFileSync,
} from "node:fs";

import {
  resolve,
} from "node:path";

import {
  describe,
  expect,
  expectTypeOf,
  it,
} from "vitest";

import type {
  InputAdornmentPosition,
  InputAdornmentProps,
} from "zerina-ui";


const SRC =
  resolve(
    process.cwd(),
    "..",
    "src",
  );


function readSource(
  relativePath: string,
): string {
  return readFileSync(
    resolve(
      SRC,
      relativePath,
    ),
    "utf-8",
  );
}


describe(
  "Block 5 public API and source contracts",
  () => {
    const formsIndex =
      readSource(
        "primitives/forms/index.ts",
      );

    const inputAdornment =
      readSource(
        "primitives/forms/InputAdornment.tsx",
      );

    const inputGroup =
      readSource(
        "primitives/forms/InputGroup.tsx",
      );

    const controlAction =
      readSource(
        "primitives/forms/ControlAction.tsx",
      );

    const searchInput =
      readSource(
        "primitives/forms/SearchInput.tsx",
      );

    const passwordInput =
      readSource(
        "primitives/forms/PasswordInput.tsx",
      );

    const controlsCss =
      readSource(
        "styles/controls.css",
      );

    const block5Source = [
      formsIndex,
      inputAdornment,
      inputGroup,
      controlAction,
      searchInput,
      passwordInput,
      readSource(
        "primitives/forms/Input.tsx",
      ),
      readSource(
        "primitives/forms/Textarea.tsx",
      ),
      readSource(
        "primitives/forms/Select.tsx",
      ),
      controlsCss,
    ].join(
      "\n",
    );


    it(
      "exports InputAdornment with start and end positions",
      () => {
        expectTypeOf<
          InputAdornmentPosition
        >().toEqualTypeOf<
          "start" | "end"
        >();

        expectTypeOf<
          InputAdornmentProps[
            "position"
          ]
        >().toEqualTypeOf<
          | "start"
          | "end"
          | undefined
        >();

        expect(
          formsIndex,
        ).toContain(
          'export * from "./InputAdornment";',
        );
      },
    );


    it(
      "keeps ControlAction internal and removes InputRightElement",
      () => {
        expect(
          formsIndex,
        ).not.toMatch(
          /ControlAction|InputRightElement/,
        );

        expect(
          block5Source,
        ).not.toMatch(
          /InputRightElement/,
        );
      },
    );


    it(
      "contains no legacy child inspection or static markers",
      () => {
        expect(
          block5Source,
        ).not.toMatch(
          /__UI_CONTROL_KIND|__UI_SLOT_KIND|React\.cloneElement|Children\.(?:map|forEach)/,
        );
      },
    );


    it(
      "registers dynamic adornments and observes their size",
      () => {
        expect(
          inputAdornment,
        ).toMatch(
          /registerAdornment\(\s*adornmentId,\s*position,\s*node\s*\)/s,
        );

        expect(
          inputGroup,
        ).toMatch(
          /observeElementSizes\(\s*\[node\],\s*update\s*\)/s,
        );

        expect(
          inputGroup,
        ).toMatch(
          /compareDocumentPosition/,
        );

        expect(
          inputGroup,
        ).toMatch(
          /recalculateAdornmentLayout/,
        );
      },
    );


    it(
      "uses InputGroup as the canonical frame and focus owner",
      () => {
        expect(
          controlsCss,
        ).not.toContain(
          ":focus-within",
        );

        expect(
          controlsCss,
        ).toMatch(
          /\[data-ui="input-group"\]\[data-focus-visible\]/,
        );

        expect(
          controlsCss,
        ).toMatch(
          /\[data-ui="input-group"\]\[data-invalid\]\[data-focus-visible\]/,
        );

        expect(
          controlsCss,
        ).toMatch(
          /\[data-ui="input-group"\]\s+\[data-ui-control\]\[data-in-group\]/s,
        );

        expect(
          controlsCss,
        ).toMatch(
          /background:\s*transparent[\s\S]*?border:\s*none[\s\S]*?border-radius:\s*0[\s\S]*?box-shadow:\s*none[\s\S]*?opacity:\s*1/,
        );
      },
    );


    it(
      "applies disabled opacity once inside a group",
      () => {
        expect(
          controlsCss,
        ).toMatch(
          /\[data-ui="input-group"\]\[data-disabled\][\s\S]*?opacity:\s*var\(/,
        );

        expect(
          controlsCss,
        ).toMatch(
          /\[data-ui="input-group"\]\[data-disabled\][\s\S]*?\[data-ui="control-action"\]\[data-disabled\][\s\S]*?opacity:\s*1/,
        );
      },
    );


    it(
      "adds measured adornment widths to controls and Select indicator",
      () => {
        expect(
          controlsCss,
        ).toMatch(
          /--ui-input-group-start-inset/,
        );

        expect(
          controlsCss,
        ).toMatch(
          /--ui-input-group-end-inset/,
        );

        expect(
          controlsCss,
        ).toMatch(
          /var\(--ui-control-padding-x-md\)[\s\S]*?var\(--ui-input-group-start-inset\)/,
        );

        expect(
          controlsCss,
        ).toMatch(
          /\[data-ui="select-indicator"\][\s\S]*?var\(--ui-input-group-end-inset\)/,
        );
      },
    );


    it(
      "composes SearchInput change handlers and uses internal actions",
      () => {
        expect(
          searchInput,
        ).toMatch(
          /composeEventHandlers<[\s\S]*?slotOnChange[\s\S]*?onValueChange\?\.\([\s\S]*?onChange\?\.\(/,
        );

        expect(
          searchInput,
        ).toMatch(
          /const\s+handleClearPress\s*=\s*composeEventHandlers<[\s\S]*?clearButtonSlotOnPress[\s\S]*?handleClear[\s\S]*?<ControlAction[\s\S]*?onPress=\{\s*handleClearPress\s*\}/,
        );

        expect(
          passwordInput,
        ).toMatch(
          /const\s+handleTogglePress\s*=\s*composeEventHandlers<[\s\S]*?toggleButtonSlotOnPress[\s\S]*?handleToggle[\s\S]*?<ControlAction[\s\S]*?onPress=\{\s*handleTogglePress\s*\}/,
        );
      },
    );


    it(
      "contains no Block 5 legacy padding or hover residues",
      () => {
        expect(
          block5Source,
        ).not.toMatch(
          /CONTROL_BASE_RIGHT_PADDING|toggleHovered|clearHovered|setToggleHovered|setClearHovered|data-ui-search-input-invalid|data-ui-password-input-invalid/,
        );

        expect(
          searchInput,
        ).not.toMatch(
          /onMouseEnter|onMouseLeave/,
        );

        expect(
          passwordInput,
        ).not.toMatch(
          /onMouseEnter|onMouseLeave/,
        );
      },
    );
  },
);
