import {
  describe,
  expect,
  expectTypeOf,
  it,
} from "vitest";

import {
  THEME_TOKEN_MANIFEST,
} from "../../src/theme/contracts/theme-token-contract";

import type {
  ResolvedThemeTokens,
  ThemeTokens,
} from "../../src/theme/contracts/theme-token-contract";

import type {
  ResolvedTheme,
} from "../../src/theme/runtime/theme-system";

import {
  SYSTEM_DEFAULT_TOKENS_BY_COLOR_SCHEME,
} from "../../src/theme/runtime/system-default-tokens";

import {
  validateThemeDefinition,
} from "../../src/theme/validation/theme-validation";

import {
  collectManifestBranchPaths,
  collectManifestLeaves,
  createValidationTheme,
  createValidManifestValue,
  createValueAtPath,
  readPath,
} from "./theme-token-test-utils";


const leaves =
  collectManifestLeaves(
    THEME_TOKEN_MANIFEST,
  );


describe(
  "theme token type contract",
  () => {
    it(
      "allows partial ThemeTokens inputs",
      () => {
        const partial:
          ThemeTokens = {
          color: {
            primary:
              "#123456",
          },
        };


        expect(
          partial.color
            ?.primary,
        ).toBe(
          "#123456",
        );
      },
    );


    it(
      "types ResolvedTheme.tokens as ResolvedThemeTokens",
      () => {
        expectTypeOf<
          ResolvedTheme[
            "tokens"
          ]
        >().toEqualTypeOf<
          ResolvedThemeTokens
        >();
      },
    );
  },
);


describe(
  "THEME_TOKEN_MANIFEST",
  () => {
    it(
      "contains exactly 69 leaves",
      () => {
        expect(
          leaves,
        ).toHaveLength(
          69,
        );
      },
    );


    it(
      "assigns a CSS variable to every leaf",
      () => {
        for (
          const leaf of
          leaves
        ) {
          expect(
            leaf.cssVariable,
          ).toMatch(
            /^--ui-/,
          );
        }
      },
    );


    it(
      "contains no duplicate CSS variables",
      () => {
        const variables =
          leaves.map(
            (
              leaf,
            ) =>
              leaf.cssVariable,
          );


        expect(
          new Set(
            variables,
          ).size,
        ).toBe(
          variables.length,
        );
      },
    );
  },
);


describe(
  "resolved system defaults",
  () => {
    it.each([
      "light",
      "dark",
    ] as const)(
      "contains every group and leaf for %s",
      (
        scheme,
      ) => {
        const defaults =
          SYSTEM_DEFAULT_TOKENS_BY_COLOR_SCHEME[
            scheme
          ];


        expect(
          Object.keys(
            defaults,
          ).sort(),
        ).toEqual(
          [
            ...Object.keys(
              THEME_TOKEN_MANIFEST,
            ),

            "extensions",
          ].sort(),
        );


        for (
          const leaf of
          leaves
        ) {
          expect(
            readPath(
              defaults,
              leaf.path,
            ),
            leaf.path.join(
              ".",
            ),
          ).not.toBeUndefined();
        }


        expect(
          defaults.extensions,
        ).toBeDefined();
      },
    );
  },
);


describe(
  "manifest-driven validation",
  () => {
    it(
      "accepts every key declared by the manifest",
      () => {
        const result =
          validateThemeDefinition(
            createValidationTheme(
              createValidManifestValue(
                THEME_TOKEN_MANIFEST,
              ),
            ),
          );


        expect(
          result.valid,
        ).toBe(
          true,
        );
      },
    );


    it(
      "rejects unknown keys at every standard branch level",
      () => {
        const branchPaths =
          collectManifestBranchPaths(
            THEME_TOKEN_MANIFEST,
          );


        for (
          const branchPath of
          branchPaths
        ) {
          const unknownPath = [
            ...branchPath,
            "__unknown",
          ];


          const tokens =
            createValueAtPath(
              unknownPath,
              "invalid",
            );


          const result =
            validateThemeDefinition(
              createValidationTheme(
                tokens,
              ),
            );


          expect(
            result.valid,
            `Expected rejection at tokens.${unknownPath.join(
              ".",
            )}`,
          ).toBe(
            false,
          );


          expect(
            result.diagnostics,
          ).toContainEqual(
            expect.objectContaining({
              code:
                "theme.property.unknown",

              path:
                `tokens.${unknownPath.join(
                  ".",
                )}`,
            }),
          );
        }
      },
    );


    it(
      "accepts non-empty strings for every string leaf",
      () => {
        const stringLeaves =
          leaves.filter(
            (
              leaf,
            ) =>
              leaf.kind ===
              "string",
          );


        for (
          const leaf of
          stringLeaves
        ) {
          const result =
            validateThemeDefinition(
              createValidationTheme(
                createValueAtPath(
                  leaf.path,
                  "valid",
                ),
              ),
            );


          expect(
            result.valid,
            leaf.path.join(
              ".",
            ),
          ).toBe(
            true,
          );
        }
      },
    );


    it(
      "rejects empty strings and non-string values for every string leaf",
      () => {
        const stringLeaves =
          leaves.filter(
            (
              leaf,
            ) =>
              leaf.kind ===
              "string",
          );


        for (
          const leaf of
          stringLeaves
        ) {
          for (
            const invalidValue of [
              "",
              "   ",
              123,
              false,
              null,
            ]
          ) {
            const result =
              validateThemeDefinition(
                createValidationTheme(
                  createValueAtPath(
                    leaf.path,
                    invalidValue,
                  ),
                ),
              );


            expect(
              result.valid,
              `${leaf.path.join(
                ".",
              )}: ${String(
                invalidValue,
              )}`,
            ).toBe(
              false,
            );


            expect(
              result.diagnostics,
            ).toContainEqual(
              expect.objectContaining({
                code:
                  "theme.token.invalid",

                path:
                  `tokens.${leaf.path.join(
                    ".",
                  )}`,
              }),
            );
          }
        }
      },
    );


    it(
      "accepts non-empty strings and finite numbers for fontWeight",
      () => {
        const fontWeightLeaves =
          leaves.filter(
            (
              leaf,
            ) =>
              leaf.kind ===
              "fontWeight",
          );


        for (
          const leaf of
          fontWeightLeaves
        ) {
          for (
            const validValue of [
              "600",
              "bold",
              500,
              700.5,
            ]
          ) {
            const result =
              validateThemeDefinition(
                createValidationTheme(
                  createValueAtPath(
                    leaf.path,
                    validValue,
                  ),
                ),
              );


            expect(
              result.valid,
              `${leaf.path.join(
                ".",
              )}: ${String(
                validValue,
              )}`,
            ).toBe(
              true,
            );


            if (
              result.valid
            ) {
              expect(
                readPath(
                  result.value
                    .tokens,
                  leaf.path,
                ),
              ).toBe(
                validValue,
              );
            }
          }
        }
      },
    );


    it(
      "rejects empty strings, NaN and Infinity for fontWeight",
      () => {
        const fontWeightLeaves =
          leaves.filter(
            (
              leaf,
            ) =>
              leaf.kind ===
              "fontWeight",
          );


        for (
          const leaf of
          fontWeightLeaves
        ) {
          for (
            const invalidValue of [
              "",
              "   ",
              Number.NaN,
              Number.POSITIVE_INFINITY,
              Number.NEGATIVE_INFINITY,
            ]
          ) {
            const result =
              validateThemeDefinition(
                createValidationTheme(
                  createValueAtPath(
                    leaf.path,
                    invalidValue,
                  ),
                ),
              );


            expect(
              result.valid,
              leaf.path.join(
                ".",
              ),
            ).toBe(
              false,
            );


            expect(
              result.diagnostics,
            ).toContainEqual(
              expect.objectContaining({
                code:
                  "theme.typography.font_weight.invalid",

                path:
                  `tokens.${leaf.path.join(
                    ".",
                  )}`,
              }),
            );
          }
        }
      },
    );
  },
);