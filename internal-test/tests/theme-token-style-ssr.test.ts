import {
  describe,
  expect,
  it,
} from "vitest";

import {
  THEME_TOKEN_MANIFEST,
} from "../../src/theme/contracts/theme-token-contract";

import {
  BUILT_IN_THEMES,
} from "../../src/theme/built-in";

import {
  createThemeStyleDeclarations,
  createThemeStyleRecord,
} from "../../src/theme/runtime/theme-style-declarations";

import {
  SYSTEM_DEFAULT_TOKENS_BY_COLOR_SCHEME,
} from "../../src/theme/runtime/system-default-tokens";

import {
  ThemeSystem,
} from "../../src/theme/runtime/theme-system";

import {
  createThemeDocumentState,
} from "../../src/theme/ssr/theme-document-state";

import {
  collectManifestLeaves,
  readPath,
} from "./theme-token-test-utils";


const leaves =
  collectManifestLeaves(
    THEME_TOKEN_MANIFEST,
  );


describe(
  "createThemeStyleDeclarations",
  () => {
    it(
      "generates exactly one declaration per manifest leaf",
      () => {
        const declarations =
          createThemeStyleDeclarations(
            SYSTEM_DEFAULT_TOKENS_BY_COLOR_SCHEME
              .light,
          );


        expect(
          declarations,
        ).toHaveLength(
          leaves.length,
        );
      },
    );


    it(
      "follows the stable manifest order",
      () => {
        const declarations =
          createThemeStyleDeclarations(
            SYSTEM_DEFAULT_TOKENS_BY_COLOR_SCHEME
              .light,
          );


        expect(
          declarations.map(
            (
              declaration,
            ) =>
              declaration.property,
          ),
        ).toEqual(
          leaves.map(
            (
              leaf,
            ) =>
              leaf.cssVariable,
          ),
        );
      },
    );


    it(
      "uses the correct CSS variable and token value",
      () => {
        const tokens =
          SYSTEM_DEFAULT_TOKENS_BY_COLOR_SCHEME
            .dark;


        const declarations =
          createThemeStyleDeclarations(
            tokens,
          );


        for (
          const [
            index,
            declaration,
          ] of declarations.entries()
        ) {
          const leaf =
            leaves[
              index
            ];


          if (!leaf) {
            throw new Error(
              `Missing manifest leaf at index ${index}.`,
            );
          }


          expect(
            declaration.property,
          ).toBe(
            leaf.cssVariable,
          );


          expect(
            declaration.value,
          ).toBe(
            String(
              readPath(
                tokens,
                leaf.path,
              ),
            ),
          );
        }
      },
    );
  },
);


describe(
  "createThemeStyleRecord",
  () => {
    it(
      "produces every CSS variable without extra properties",
      () => {
        const record =
          createThemeStyleRecord(
            SYSTEM_DEFAULT_TOKENS_BY_COLOR_SCHEME
              .light,
          );


        expect(
          Object.keys(
            record,
          ),
        ).toEqual(
          leaves.map(
            (
              leaf,
            ) =>
              leaf.cssVariable,
          ),
        );


        expect(
          Object.keys(
            record,
          ),
        ).toHaveLength(
          leaves.length,
        );


        expect(
          Object.isFrozen(
            record,
          ),
        ).toBe(
          true,
        );
      },
    );


    it(
      "maps every variable to its exact resolved value",
      () => {
        const tokens =
          SYSTEM_DEFAULT_TOKENS_BY_COLOR_SCHEME
            .light;


        const record =
          createThemeStyleRecord(
            tokens,
          );


        for (
          const leaf of
          leaves
        ) {
          expect(
            record[
              leaf.cssVariable
            ],
          ).toBe(
            String(
              readPath(
                tokens,
                leaf.path,
              ),
            ),
          );
        }
      },
    );
  },
);


describe(
  "runtime and SSR style parity",
  () => {
    it(
      "generates the same variables and values in SSR and runtime",
      () => {
        const system =
          new ThemeSystem({
            persist:
              false,

            initialTheme:
              "dark",

            themes:
              BUILT_IN_THEMES,
          });


        const resolved =
          system.resolveTheme(
            "dark",
          );


        const runtimeRecord =
          createThemeStyleRecord(
            resolved.tokens,
          );


        const documentState =
          createThemeDocumentState({
            initialTheme:
              "dark",

            themes:
              BUILT_IN_THEMES,
          });


        const ssrCustomProperties =
          Object.fromEntries(
            Object.entries(
              documentState.style,
            ).filter(
              (
                [
                  key,
                ],
              ) =>
                key.startsWith(
                  "--ui-",
                ),
            ),
          );


        expect(
          ssrCustomProperties,
        ).toEqual(
          runtimeRecord,
        );


        expect(
          Object.keys(
            ssrCustomProperties,
          ),
        ).toHaveLength(
          leaves.length,
        );


        expect(
          documentState.style
            .colorScheme,
        ).toBe(
          resolved.metadata
            .colorScheme,
        );
      },
    );
  },
);