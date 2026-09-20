import {
  describe,
  expect,
  it,
} from "vitest";

import {
  THEME_TOKEN_MANIFEST,
} from "../../src/theme/contracts/theme-token-contract";

import type {
  ThemeDefinition,
} from "../../src/theme/contracts/theme.types";

import {
  BUILT_IN_THEMES,
} from "../../src/theme/built-in";

import {
  SYSTEM_DEFAULT_TOKENS_BY_COLOR_SCHEME,
} from "../../src/theme/runtime/system-default-tokens";

import {
  createThemeStyleDeclarations,
  createThemeStyleRecord,
} from "../../src/theme/runtime/theme-style-declarations";

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


const manifestLeaves =
  collectManifestLeaves(
    THEME_TOKEN_MANIFEST,
  );


const interactionLeaves =
  collectManifestLeaves(
    THEME_TOKEN_MANIFEST
      .interaction,
    [
      "interaction",
    ],
  );


const NEW_INTERACTION_KEYS = [
  "focusRingColor",
  "focusRingDangerColor",
  "focusRingWidth",
  "focusRingOffset",
  "disabledOpacity",
] as const;


const EXPECTED_INTERACTION_VARIABLES = {
  focusRingColor:
    "--ui-interaction-focus-ring-color",

  focusRingDangerColor:
    "--ui-interaction-focus-ring-danger-color",

  focusRingWidth:
    "--ui-interaction-focus-ring-width",

  focusRingOffset:
    "--ui-interaction-focus-ring-offset",

  disabledOpacity:
    "--ui-interaction-disabled-opacity",
} as const;


const LEGACY_VARIABLES = [
  "--ui-interaction-focus-ring",
  "--ui-state-focus",
  "--ui-state-focus-danger",
  "--ui-state-disabled-opacity",
] as const;


const ELEVATION_KEYS = [
  "level1",
  "level2",
  "level3",
  "level4",
  "level5",
] as const;


function createCustomTheme(
  name:
    string,
  tokens:
    NonNullable<
      ThemeDefinition[
        "tokens"
      ]
    >,
): ThemeDefinition {
  return {
    name,

    source:
      "custom",

    metadata: {
      colorScheme:
        "light",
    },

    tokens,
  };
}


describe(
  "interaction token manifest",
  () => {
    it(
      "contains six interaction leaves and five new leaves besides overlay",
      () => {
        expect(
          interactionLeaves,
        ).toHaveLength(
          6,
        );


        expect(
          Object.keys(
            THEME_TOKEN_MANIFEST
              .interaction,
          ),
        ).toEqual([
          "overlay",
          ...NEW_INTERACTION_KEYS,
        ]);
      },
    );


    it.each(
      NEW_INTERACTION_KEYS,
    )(
      "maps interaction.%s to its canonical variable",
      (
        key,
      ) => {
        expect(
          THEME_TOKEN_MANIFEST
            .interaction[
              key
            ]
            .cssVariable,
        ).toBe(
          EXPECTED_INTERACTION_VARIABLES[
            key
          ],
        );
      },
    );


    it(
      "assigns a unique CSS variable to every manifest leaf",
      () => {
        const variables =
          manifestLeaves.map(
            (
              leaf,
            ) =>
              leaf.cssVariable,
          );


        expect(
          variables,
        ).toHaveLength(
          manifestLeaves.length,
        );


        expect(
          new Set(
            variables,
          ).size,
        ).toBe(
          manifestLeaves.length,
        );
      },
    );
  },
);


describe(
  "interaction defaults",
  () => {
    it.each([
      "light",
      "dark",
    ] as const)(
      "contains all manifest leaves and extensions for %s",
      (
        scheme,
      ) => {
        const defaults =
          SYSTEM_DEFAULT_TOKENS_BY_COLOR_SCHEME[
            scheme
          ];


        for (
          const leaf of
          manifestLeaves
        ) {
          expect(
            readPath(
              defaults,
              leaf.path,
            ),
            `${scheme}:${leaf.path.join(
              ".",
            )}`,
          ).not.toBeUndefined();
        }


        expect(
          defaults.extensions,
        ).toBeDefined();
      },
    );


    it(
      "derives the normal ring color from primary",
      () => {
        for (
          const scheme of [
            "light",
            "dark",
          ] as const
        ) {
          const value =
            SYSTEM_DEFAULT_TOKENS_BY_COLOR_SCHEME[
              scheme
            ]
              .interaction
              .focusRingColor;


          expect(
            value,
          ).toContain(
            "var(--ui-primary)",
          );


          expect(
            value,
          ).not.toContain(
            "#2f8c79",
          );
        }
      },
    );


    it(
      "derives the danger ring color from danger",
      () => {
        for (
          const scheme of [
            "light",
            "dark",
          ] as const
        ) {
          const value =
            SYSTEM_DEFAULT_TOKENS_BY_COLOR_SCHEME[
              scheme
            ]
              .interaction
              .focusRingDangerColor;


          expect(
            value,
          ).toContain(
            "var(--ui-danger)",
          );


          expect(
            value,
          ).not.toContain(
            "#ef4444",
          );
        }
      },
    );


    it(
      "uses scheme-specific shadows for every raised elevation level",
      () => {
        const light =
          SYSTEM_DEFAULT_TOKENS_BY_COLOR_SCHEME
            .light
            .elevation;


        const dark =
          SYSTEM_DEFAULT_TOKENS_BY_COLOR_SCHEME
            .dark
            .elevation;


        for (
          const key of
          ELEVATION_KEYS
        ) {
          expect(
            light[
              key
            ],
            `elevation.${key}`,
          ).not.toBe(
            dark[
              key
            ],
          );
        }
      },
    );
  },
);


describe(
  "partial interaction overrides",
  () => {
    it(
      "preserves a ring derived from a custom primary color",
      () => {
        const theme =
          createCustomTheme(
            "custom-primary-ring",
            {
              color: {
                primary:
                  "#7c3aed",
              },
            },
          );


        const system =
          new ThemeSystem({
            persist:
              false,

            themes: [
              theme,
            ],
          });


        const resolved =
          system.resolveTheme(
            theme.name,
          );


        expect(
          resolved.tokens
            .color
            .primary,
        ).toBe(
          "#7c3aed",
        );


        expect(
          resolved.tokens
            .interaction
            .focusRingColor,
        ).toContain(
          "var(--ui-primary)",
        );


        expect(
          resolved.tokens
            .interaction
            .focusRingColor,
        ).not.toContain(
          "#2f8c79",
        );
      },
    );


    it(
      "preserves a danger ring derived from a custom danger color",
      () => {
        const theme =
          createCustomTheme(
            "custom-danger-ring",
            {
              color: {
                danger:
                  "#be123c",
              },
            },
          );


        const system =
          new ThemeSystem({
            persist:
              false,

            themes: [
              theme,
            ],
          });


        const resolved =
          system.resolveTheme(
            theme.name,
          );


        expect(
          resolved.tokens
            .color
            .danger,
        ).toBe(
          "#be123c",
        );


        expect(
          resolved.tokens
            .interaction
            .focusRingDangerColor,
        ).toContain(
          "var(--ui-danger)",
        );


        expect(
          resolved.tokens
            .interaction
            .focusRingDangerColor,
        ).not.toContain(
          "#ef4444",
        );
      },
    );


    it(
      "allows width, offset and disabled opacity to be overridden partially",
      () => {
        const theme =
          createCustomTheme(
            "custom-interaction",
            {
              interaction: {
                focusRingWidth:
                  "5px",

                focusRingOffset:
                  "2px",

                disabledOpacity:
                  "0.4",
              },
            },
          );


        const system =
          new ThemeSystem({
            persist:
              false,

            themes: [
              theme,
            ],
          });


        const resolved =
          system.resolveTheme(
            theme.name,
          );


        expect(
          resolved.tokens
            .interaction,
        ).toMatchObject({
          focusRingWidth:
            "5px",

          focusRingOffset:
            "2px",

          disabledOpacity:
            "0.4",
        });


        expect(
          resolved.tokens
            .interaction
            .focusRingColor,
        ).toContain(
          "var(--ui-primary)",
        );
      },
    );
  },
);


describe(
  "runtime and SSR interaction declarations",
  () => {
    it(
      "generates one runtime variable per manifest leaf",
      () => {
        const declarations =
          createThemeStyleDeclarations(
            SYSTEM_DEFAULT_TOKENS_BY_COLOR_SCHEME
              .light,
          );


        expect(
          declarations,
        ).toHaveLength(
          manifestLeaves.length,
        );


        expect(
          new Set(
            declarations.map(
              (
                declaration,
              ) =>
                declaration.property,
            ),
          ).size,
        ).toBe(
          manifestLeaves.length,
        );
      },
    );


    it(
      "does not generate legacy variables at runtime",
      () => {
        const properties =
          createThemeStyleDeclarations(
            SYSTEM_DEFAULT_TOKENS_BY_COLOR_SCHEME
              .light,
          ).map(
            (
              declaration,
            ) =>
              declaration.property,
          );


        for (
          const legacyVariable of
          LEGACY_VARIABLES
        ) {
          expect(
            properties,
          ).not.toContain(
            legacyVariable,
          );
        }
      },
    );


    it(
      "generates the same manifest variables and values in SSR",
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


        const ssrRecord =
          Object.fromEntries(
            Object.entries(
              documentState.style,
            ).filter(
              (
                [
                  property,
                ],
              ) =>
                property.startsWith(
                  "--ui-",
                ),
            ),
          );


        expect(
          Object.keys(
            runtimeRecord,
          ),
        ).toHaveLength(
          manifestLeaves.length,
        );


        expect(
          Object.keys(
            ssrRecord,
          ),
        ).toHaveLength(
          manifestLeaves.length,
        );


        expect(
          ssrRecord,
        ).toEqual(
          runtimeRecord,
        );


        for (
          const legacyVariable of
          LEGACY_VARIABLES
        ) {
          expect(
            ssrRecord,
          ).not.toHaveProperty(
            legacyVariable,
          );
        }
      },
    );
  },
);


describe(
  "built-in interaction resolution",
  () => {
    it(
      "does not declare tokens on the light and dark built-ins",
      () => {
        for (
          const name of [
            "light",
            "dark",
          ]
        ) {
          const theme =
            BUILT_IN_THEMES.find(
              (
                candidate,
              ) =>
                candidate.name ===
                name,
            );


          expect(
            theme,
          ).toBeDefined();


          expect(
            Object.prototype.hasOwnProperty.call(
              theme,
              "tokens",
            ),
          ).toBe(
            false,
          );


          expect(
            theme?.tokens,
          ).toBeUndefined();
        }
      },
    );


    it(
      "resolves light and dark completely from their scheme defaults",
      () => {
        const system =
          new ThemeSystem({
            persist:
              false,

            themes:
              BUILT_IN_THEMES,
          });


        for (
          const name of [
            "light",
            "dark",
          ] as const
        ) {
          const resolved =
            system.resolveTheme(
              name,
            );


          const defaults =
            SYSTEM_DEFAULT_TOKENS_BY_COLOR_SCHEME[
              name
            ];


          for (
            const leaf of
            manifestLeaves
          ) {
            expect(
              readPath(
                resolved.tokens,
                leaf.path,
              ),
              `${name}:${leaf.path.join(
                ".",
              )}`,
            ).toBe(
              readPath(
                defaults,
                leaf.path,
              ),
            );
          }
        }
      },
    );


    it(
      "resolves every built-in as a complete manifest token set",
      () => {
        const system =
          new ThemeSystem({
            persist:
              false,

            themes:
              BUILT_IN_THEMES,
          });


        for (
          const theme of
          BUILT_IN_THEMES
        ) {
          const resolved =
            system.resolveTheme(
              theme.name,
            );


          const resolvedLeaves =
            manifestLeaves.filter(
              (
                leaf,
              ) =>
                readPath(
                  resolved.tokens,
                  leaf.path,
                ) !==
                undefined,
            );


          expect(
            resolvedLeaves,
            theme.name,
          ).toHaveLength(
            manifestLeaves.length,
          );


          expect(
            resolved.tokens
              .extensions,
          ).toBeDefined();
        }
      },
    );
  },
);