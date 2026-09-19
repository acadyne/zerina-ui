// @vitest-environment node
// Fase F: clases A/B — architecture boundary + public API contract.

import {
  readFileSync,
} from "node:fs";

import {
  fileURLToPath,
} from "node:url";

import {
  describe,
  expect,
  expectTypeOf,
  it,
} from "vitest";

import type {
  CheckboxProps,
  ChoiceControlColorScheme,
  ChoiceControlLabelPlacement,
  ChoiceControlSize,
  RadioProps,
  SwitchProps,
} from "zerina-ui";


type HasKey<
  TValue,
  TKey extends PropertyKey,
> =
  TKey extends keyof TValue
    ? true
    : false;


const CHOICE_SOURCE_PATHS = [
  "../../src/primitives/forms/Checkbox.tsx",
  "../../src/primitives/forms/Radio.tsx",
  "../../src/primitives/forms/RadioGroup.tsx",
  "../../src/primitives/forms/Switch.tsx",
  "../../src/primitives/forms/choice-control-recipe.ts",
  "../../src/primitives/forms/choice-control-types.ts",
  "../../src/primitives/forms/use-choice-control.ts",
  "../../src/primitives/forms/index.ts",
] as const;


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


function readChoiceSource(): string {
  return CHOICE_SOURCE_PATHS
    .map(
      readRelative,
    )
    .join(
      "\n",
    );
}


describe(
  "Block 6 public API",
  () => {
    it(
      "exports the common choice-control unions",
      () => {
        expectTypeOf<
          ChoiceControlSize
        >().toEqualTypeOf<
          "sm" | "md" | "lg"
        >();

        expectTypeOf<
          ChoiceControlColorScheme
        >().toEqualTypeOf<
          "primary" | "secondary" | "danger"
        >();

        expectTypeOf<
          ChoiceControlLabelPlacement
        >().toEqualTypeOf<
          "start" | "end"
        >();
      },
    );

    it(
      "exposes the shared props on Checkbox, Radio and Switch",
      () => {
        expectTypeOf<
          CheckboxProps["size"]
        >().toEqualTypeOf<
          ChoiceControlSize | undefined
        >();

        expectTypeOf<
          RadioProps["size"]
        >().toEqualTypeOf<
          ChoiceControlSize | undefined
        >();

        expectTypeOf<
          SwitchProps["size"]
        >().toEqualTypeOf<
          ChoiceControlSize | undefined
        >();

        expectTypeOf<
          CheckboxProps["colorScheme"]
        >().toEqualTypeOf<
          ChoiceControlColorScheme | undefined
        >();

        expectTypeOf<
          RadioProps["colorScheme"]
        >().toEqualTypeOf<
          ChoiceControlColorScheme | undefined
        >();

        expectTypeOf<
          SwitchProps["colorScheme"]
        >().toEqualTypeOf<
          ChoiceControlColorScheme | undefined
        >();

        expectTypeOf<
          CheckboxProps["labelPlacement"]
        >().toEqualTypeOf<
          ChoiceControlLabelPlacement | undefined
        >();

        expectTypeOf<
          RadioProps["labelPlacement"]
        >().toEqualTypeOf<
          ChoiceControlLabelPlacement | undefined
        >();

        expectTypeOf<
          SwitchProps["labelPlacement"]
        >().toEqualTypeOf<
          ChoiceControlLabelPlacement | undefined
        >();
      },
    );

    it(
      "removes color, boxSize and radius from every public control API",
      () => {
        expectTypeOf<
          HasKey<CheckboxProps, "color">
        >().toEqualTypeOf<false>();

        expectTypeOf<
          HasKey<CheckboxProps, "boxSize">
        >().toEqualTypeOf<false>();

        expectTypeOf<
          HasKey<CheckboxProps, "radius">
        >().toEqualTypeOf<false>();

        expectTypeOf<
          HasKey<RadioProps, "color">
        >().toEqualTypeOf<false>();

        expectTypeOf<
          HasKey<RadioProps, "boxSize">
        >().toEqualTypeOf<false>();

        expectTypeOf<
          HasKey<RadioProps, "radius">
        >().toEqualTypeOf<false>();

        expectTypeOf<
          HasKey<SwitchProps, "color">
        >().toEqualTypeOf<false>();

        expectTypeOf<
          HasKey<SwitchProps, "boxSize">
        >().toEqualTypeOf<false>();

        expectTypeOf<
          HasKey<SwitchProps, "radius">
        >().toEqualTypeOf<false>();
      },
    );
  },
);


describe(
  "Block 6 source ownership",
  () => {
    it(
      "contains no legacy choice-control attributes or removed props",
      () => {
        const source =
          readChoiceSource();

        for (
          const legacy of [
            "data-ui-checkbox-",
            "data-ui-radio-",
            "data-ui-radio-group-",
            "data-ui-switch-",
            "data-ui-checkbox",
            "data-ui-radio",
            "data-ui-switch",
            "boxSize",
            'fontSize: "0.95rem"',
          ]
        ) {
          expect(
            source,
          ).not.toContain(
            legacy,
          );
        }

        expect(
          source,
        ).not.toMatch(
          /\bcolor\?\s*:\s*string/,
        );

        expect(
          source,
        ).not.toMatch(
          /\bradius\?\s*:\s*number/,
        );
      },
    );

    it(
      "keeps interactive visuals out of component inline styles",
      () => {
        const componentSource = [
          readRelative(
            "../../src/primitives/forms/Checkbox.tsx",
          ),
          readRelative(
            "../../src/primitives/forms/Radio.tsx",
          ),
          readRelative(
            "../../src/primitives/forms/Switch.tsx",
          ),
          readRelative(
            "../../src/primitives/forms/choice-control-recipe.ts",
          ),
        ].join(
          "\n",
        );

        expect(
          componentSource,
        ).not.toMatch(
          /\bboxShadow\s*:/,
        );

        expect(
          componentSource,
        ).not.toMatch(
          /\bcursor\s*:/,
        );

        expect(
          componentSource,
        ).not.toMatch(
          /\bbackground\s*:/,
        );

        expect(
          componentSource,
        ).not.toMatch(
          /\btransform\s*:/,
        );

        expect(
          componentSource,
        ).not.toMatch(
          /\bopacity\s*:\s*[^,\n]*(?:disabled|checked|indeterminate|focusVisible)/,
        );
      },
    );

    it(
      "defines state visuals through generic data attributes in CSS",
      () => {
        const css =
          readRelative(
            "../../src/styles/controls.css",
          );

        for (
          const selector of [
            '[data-ui="checkbox"][data-checked]',
            '[data-ui="checkbox"][data-indeterminate]',
            '[data-ui="radio"][data-checked]',
            '[data-ui="switch"][data-checked]',
            '[data-ui="checkbox"][data-focus-visible]',
            '[data-ui="radio"][data-focus-visible]',
            '[data-ui="switch"][data-focus-visible]',
            '[data-ui="checkbox"][data-disabled]',
            '[data-ui="radio"][data-disabled]',
            '[data-ui="switch"][data-disabled]',
          ]
        ) {
          expect(
            css,
          ).toContain(
            selector,
          );
        }
      },
    );

    it(
      "keeps SettingsList and DataTable consumers on the new API",
      () => {
        const consumers = [
          readRelative(
            "../../src/patterns/settings/SettingsList.tsx",
          ),
          readRelative(
            "../../src/components/data-table/DataTableDesktop.tsx",
          ),
          readRelative(
            "../../src/components/data-table/DataTableEditableDesktop.tsx",
          ),
          readRelative(
            "../../src/components/data-table/DataTableMobileCards.tsx",
          ),
        ].join(
          "\n",
        );

        expect(
          consumers,
        ).toContain(
          "<Checkbox",
        );

        expect(
          consumers,
        ).toContain(
          "<Switch",
        );

        expect(
          consumers,
        ).not.toMatch(
          /\bboxSize\s*=/,
        );

        expect(
          consumers,
        ).not.toMatch(
          /\bradius\s*=/,
        );

        expect(
          consumers,
        ).not.toMatch(
          /\blabelPlacement\s*=\s*["'](?:left|right)["']/,
        );
      },
    );
  },
);
