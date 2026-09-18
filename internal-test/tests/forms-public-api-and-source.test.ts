// @vitest-environment node

import {
  existsSync,
  readFileSync,
  readdirSync,
} from "node:fs";

import {
  extname,
  join,
} from "node:path";

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
  InputProps,
  RadioGroupProps,
  RadioProps,
  SearchInputProps,
  SelectProps,
  SwitchProps,
  TextareaProps,
} from "zerina-ui";

import type {
  SettingsListSelectProps,
} from "../../src/patterns/settings/SettingsList";


type HasKey<
  TValue,
  TKey extends
    PropertyKey,
> =
  TKey extends keyof TValue
    ? true
    : false;


const FORMS_DIRECTORY =
  fileURLToPath(
    new URL(
      "../../src/primitives/forms/",
      import.meta.url,
    ),
  );


const SETTINGS_LIST_PATH =
  fileURLToPath(
    new URL(
      "../../src/patterns/settings/SettingsList.tsx",
      import.meta.url,
    ),
  );


const INPUT_GROUP_PATH =
  fileURLToPath(
    new URL(
      "../../src/primitives/forms/InputGroup.tsx",
      import.meta.url,
    ),
  );


function collectSourceFiles(
  directory:
    string,
): string[] {
  const files:
    string[] = [];


  for (
    const entry of
    readdirSync(
      directory,
      {
        withFileTypes:
          true,
      },
    )
  ) {
    const path =
      join(
        directory,
        entry.name,
      );


    if (
      entry.isDirectory()
    ) {
      files.push(
        ...collectSourceFiles(
          path,
        ),
      );

      continue;
    }


    if (
      [
        ".ts",
        ".tsx",
      ].includes(
        extname(
          entry.name,
        ),
      )
    ) {
      files.push(
        path,
      );
    }
  }


  return files;
}


function readFormsSource():
  string {
  return [
    ...collectSourceFiles(
      FORMS_DIRECTORY,
    ).map(
      (
        file,
      ) =>
        readFileSync(
          file,
          "utf8",
        ),
    ),

    readFileSync(
      SETTINGS_LIST_PATH,
      "utf8",
    ),
  ].join(
    "\n",
  );
}


describe(
  "canonical public form API",
  () => {
    it(
      "removes Select.error",
      () => {
        expectTypeOf<
          HasKey<
            SelectProps,
            "error"
          >
        >().toEqualTypeOf<
          false
        >();
      },
    );


    it.each([
      "isDisabled",
      "isInvalid",
      "isRequired",
    ] as const)(
      "removes public prop %s from form controls",
      (
        prop,
      ) => {
        type Prop =
          typeof prop;


        expectTypeOf<
          HasKey<
            InputProps,
            Prop
          >
        >().toEqualTypeOf<
          false
        >();


        expectTypeOf<
          HasKey<
            TextareaProps,
            Prop
          >
        >().toEqualTypeOf<
          false
        >();


        expectTypeOf<
          HasKey<
            SelectProps,
            Prop
          >
        >().toEqualTypeOf<
          false
        >();


        expectTypeOf<
          HasKey<
            CheckboxProps,
            Prop
          >
        >().toEqualTypeOf<
          false
        >();


        expectTypeOf<
          HasKey<
            SwitchProps,
            Prop
          >
        >().toEqualTypeOf<
          false
        >();


        expectTypeOf<
          HasKey<
            RadioProps,
            Prop
          >
        >().toEqualTypeOf<
          false
        >();


        expectTypeOf<
          HasKey<
            SearchInputProps,
            Prop
          >
        >().toEqualTypeOf<
          false
        >();


        expectTypeOf<
          HasKey<
            RadioGroupProps,
            Prop
          >
        >().toEqualTypeOf<
          false
        >();
      },
    );


    it(
      "exposes disabled but not isDisabled on SettingsList.Select",
      () => {
        expectTypeOf<
          HasKey<
            SettingsListSelectProps,
            "disabled"
          >
        >().toEqualTypeOf<
          true
        >();


        expectTypeOf<
          HasKey<
            SettingsListSelectProps,
            "isDisabled"
          >
        >().toEqualTypeOf<
          false
        >();
      },
    );


    it(
      "removes the old RadioGroup onChange API",
      () => {
        expectTypeOf<
          HasKey<
            RadioGroupProps,
            "onChange"
          >
        >().toEqualTypeOf<
          false
        >();


        expectTypeOf<
          NonNullable<
            RadioGroupProps[
              "onValueChange"
            ]
          >
        >().toEqualTypeOf<
          (
            value:
              string,
            event:
              React.ChangeEvent<HTMLInputElement>,
          ) => void
        >();
      },
    );
  },
);


describe(
  "removed source residue",
  () => {
    it(
      "contains no removed field context or errorId",
      () => {
        const source =
          readFormsSource();


        expect(
          source,
        ).not.toMatch(
          /\bFormControlContext\b/,
        );


        expect(
          source,
        ).not.toMatch(
          /\.errorId\b/,
        );
      },
    );


    it(
      "contains no removed public prop declarations in forms",
      () => {
        const source =
          readFormsSource();


        expect(
          source,
        ).not.toMatch(
          /\b(?:isDisabled|isInvalid|isRequired)\??\s*:/,
        );
      },
    );


    it(
      "contains no old RadioGroup callback usage",
      () => {
        const source =
          readFormsSource();


        expect(
          source,
        ).not.toMatch(
          /<RadioGroup[^>]*\bonChange=/s,
        );


        expect(
          source,
        ).not.toMatch(
          /group\??\.onChange\b/,
        );
      },
    );


    it(
      "uses context registration instead of inspecting or cloning children",
      () => {
        const source =
          readFileSync(
            INPUT_GROUP_PATH,
            "utf8",
          );


        expect(
          source,
        ).not.toMatch(
          /React\.cloneElement|Children\.(?:map|forEach)/,
        );

        expect(
          source,
        ).toMatch(
          /registerAdornment/,
        );

        expect(
          source,
        ).toMatch(
          /updateDescendantState/,
        );
      },
    );
  },
);


// BLOCK 4: TEXT CONTROL SOURCE CONTRACT

const BLOCK4_SRC_DIRECTORY =
  fileURLToPath(
    new URL(
      "../../src/",
      import.meta.url,
    ),
  );


const BLOCK4_CONTROL_HELPER_PATH =
  fileURLToPath(
    new URL(
      "../../src/helpers/control.ts",
      import.meta.url,
    ),
  );


const BLOCK4_HELPERS_INDEX_PATH =
  fileURLToPath(
    new URL(
      "../../src/helpers/index.ts",
      import.meta.url,
    ),
  );


const BLOCK4_ROOT_INDEX_PATH =
  fileURLToPath(
    new URL(
      "../../src/index.ts",
      import.meta.url,
    ),
  );


const BLOCK4_CONTROLS_CSS_PATH =
  fileURLToPath(
    new URL(
      "../../src/styles/controls.css",
      import.meta.url,
    ),
  );


const BLOCK4_TOKEN_CONTRACT_PATH =
  fileURLToPath(
    new URL(
      "../../src/theme/contracts/theme-token-contract.ts",
      import.meta.url,
    ),
  );


const BLOCK4_DEFAULT_TOKENS_PATH =
  fileURLToPath(
    new URL(
      "../../src/theme/runtime/system-default-tokens.ts",
      import.meta.url,
    ),
  );


const BLOCK4_DIST_DECLARATION_PATH =
  fileURLToPath(
    new URL(
      "../../dist/index.d.ts",
      import.meta.url,
    ),
  );


const BLOCK4_CONTROL_SOURCE_PATHS = [
  fileURLToPath(
    new URL(
      "../../src/primitives/forms/Input.tsx",
      import.meta.url,
    ),
  ),

  fileURLToPath(
    new URL(
      "../../src/primitives/forms/Textarea.tsx",
      import.meta.url,
    ),
  ),

  fileURLToPath(
    new URL(
      "../../src/primitives/forms/Select.tsx",
      import.meta.url,
    ),
  ),
] as const;


const BLOCK4_REMOVED_SYMBOLS = [
  "ControlVisualState",
  "getControlBaseStyles",
  "getControlVariantStyles",
  "getControlDataAttributes",
  "getControlSizeStyles",
  "CONTROL_SIZE_STYLES",
] as const;


const BLOCK4_TOKEN_VARIABLES = [
  "--ui-control-padding-x-sm",
  "--ui-control-padding-x-md",
  "--ui-control-padding-x-lg",
  "--ui-control-padding-y-sm",
  "--ui-control-padding-y-md",
  "--ui-control-padding-y-lg",
  "--ui-control-textarea-min-height-sm",
  "--ui-control-textarea-min-height-md",
  "--ui-control-textarea-min-height-lg",
] as const;


function block4CollectSourceFiles(
  directory:
    string,
): string[] {
  const files:
    string[] = [];


  for (
    const entry of
    readdirSync(
      directory,
      {
        withFileTypes:
          true,
      },
    )
  ) {
    const path =
      join(
        directory,
        entry.name,
      );


    if (
      entry.isDirectory()
    ) {
      files.push(
        ...block4CollectSourceFiles(
          path,
        ),
      );

      continue;
    }


    if (
      [
        ".ts",
        ".tsx",
        ".css",
      ].includes(
        extname(
          entry.name,
        ),
      )
    ) {
      files.push(
        path,
      );
    }
  }


  return files;
}


function block4ReadAllSource():
  string {
  return block4CollectSourceFiles(
    BLOCK4_SRC_DIRECTORY,
  )
    .map(
      (
        path,
      ) =>
        readFileSync(
          path,
          "utf8",
        ),
    )
    .join(
      "\n",
    );
}


describe(
  "Block 4 removed architecture",
  () => {
    it(
      "removes src/helpers/control.ts",
      () => {
        expect(
          existsSync(
            BLOCK4_CONTROL_HELPER_PATH,
          ),
        ).toBe(
          false,
        );
      },
    );


    it(
      "contains no removed helper symbols",
      () => {
        const source =
          block4ReadAllSource();


        for (
          const symbol of
          BLOCK4_REMOVED_SYMBOLS
        ) {
          expect(
            source,
          ).not.toContain(
            symbol,
          );
        }
      },
    );


    it(
      "does not export the removed helper",
      () => {
        const helperIndex =
          readFileSync(
            BLOCK4_HELPERS_INDEX_PATH,
            "utf8",
          );


        const rootIndex =
          readFileSync(
            BLOCK4_ROOT_INDEX_PATH,
            "utf8",
          );


        expect(
          helperIndex,
        ).not.toMatch(
          /(?:from|export\s+\*)\s*["']\.\/control["']/,
        );


        expect(
          rootIndex,
        ).not.toMatch(
          /helpers\/control/,
        );


        if (
          existsSync(
            BLOCK4_DIST_DECLARATION_PATH,
          )
        ) {
          const declaration =
            readFileSync(
              BLOCK4_DIST_DECLARATION_PATH,
              "utf8",
            );


          for (
            const symbol of
            BLOCK4_REMOVED_SYMBOLS
          ) {
            expect(
              declaration,
            ).not.toContain(
              symbol,
            );
          }
        }
      },
    );
  },
);


describe(
  "Block 4 CSS state ownership",
  () => {
    it(
      "contains no legacy data-focus attribute or selector",
      () => {
        const source =
          block4ReadAllSource();


        expect(
          source,
        ).not.toMatch(
          /data-focus(?!-visible)\s*=/,
        );


        expect(
          source,
        ).not.toMatch(
          /\[data-focus(?:\s|[~|^$*]?=|\])/,
        );
      },
    );


    it(
      "does not use standalone :focus as focus-visible",
      () => {
        const css =
          readFileSync(
            BLOCK4_CONTROLS_CSS_PATH,
            "utf8",
          );


        expect(
          css,
        ).not.toMatch(
          /:focus(?!-visible|-within)/,
        );
      },
    );


    it(
      "contains no !important",
      () => {
        expect(
          block4ReadAllSource(),
        ).not.toContain(
          "!important",
        );
      },
    );


    it.each(
      BLOCK4_CONTROL_SOURCE_PATHS,
    )(
      "keeps interactive visual declarations out of %s",
      (
        controlPath,
      ) => {
        const source =
          readFileSync(
            controlPath,
            "utf8",
          );


        expect(
          source,
        ).not.toMatch(
          /\b(?:boxShadow|opacity|cursor|border|borderColor|borderStyle|borderWidth|transition)\s*:/,
        );
      },
    );
  },
);


describe(
  "Block 4 token contract",
  () => {
    it(
      "declares and consumes all new control variables",
      () => {
        const contract =
          readFileSync(
            BLOCK4_TOKEN_CONTRACT_PATH,
            "utf8",
          );


        const css =
          readFileSync(
            BLOCK4_CONTROLS_CSS_PATH,
            "utf8",
          );


        for (
          const variable of
          BLOCK4_TOKEN_VARIABLES
        ) {
          expect(
            contract,
          ).toContain(
            variable,
          );


          expect(
            css,
          ).toContain(
            variable,
          );
        }
      },
    );


    it(
      "provides defaults for padding and textarea minimum heights",
      () => {
        const defaults =
          readFileSync(
            BLOCK4_DEFAULT_TOKENS_PATH,
            "utf8",
          );


        expect(
          defaults,
        ).toMatch(
          /\bpaddingX\s*:/,
        );


        expect(
          defaults,
        ).toMatch(
          /\bpaddingY\s*:/,
        );


        expect(
          defaults,
        ).toMatch(
          /\btextareaMinHeight\s*:/,
        );
      },
    );
  },
);

