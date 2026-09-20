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
  ThemeTokens,
} from "../../src/theme/contracts/theme.types";

import {
  BUILT_IN_THEMES,
} from "../../src/theme/built-in";

import {
  resolveThemeTokens,
} from "../../src/theme/runtime/resolve-theme-tokens";

import {
  SYSTEM_DEFAULT_TOKENS_BY_COLOR_SCHEME,
} from "../../src/theme/runtime/system-default-tokens";

import {
  ThemeSystem,
} from "../../src/theme/runtime/theme-system";

import {
  collectManifestLeaves,
  readPath,
} from "./theme-token-test-utils";


const leaves =
  collectManifestLeaves(
    THEME_TOKEN_MANIFEST,
  );


function createTheme(
  name:
    string,
  options: {
    extends?:
      string;

    tokens?:
      ThemeTokens;

    colorScheme?:
      "light" | "dark";
  } = {},
): ThemeDefinition {
  return {
    name,

    source:
      "custom",

    extends:
      options.extends,

    metadata:
      options.extends
        ? undefined
        : {
            colorScheme:
              options.colorScheme ??
              "light",
          },

    tokens:
      options.tokens,
  };
}


describe(
  "resolveThemeTokens completeness",
  () => {
    it(
      "returns every standard group and leaf",
      () => {
        const theme =
          createTheme(
            "complete-root",
          );


        const resolved =
          resolveThemeTokens({
            theme,

            themes:
              new Map([
                [
                  theme.name,
                  theme,
                ],
              ]),

            defaults:
              SYSTEM_DEFAULT_TOKENS_BY_COLOR_SCHEME
                .light,
          });


        expect(
          Object.keys(
            resolved,
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
              resolved,
              leaf.path,
            ),
          ).not.toBeUndefined();
        }
      },
    );
  },
);


describe(
  "standard token precedence",
  () => {
    it(
      "allows a root theme to override defaults",
      () => {
        const theme =
          createTheme(
            "root-override",
            {
              tokens: {
                color: {
                  primary:
                    "#root",
                },
              },
            },
          );


        const resolved =
          resolveThemeTokens({
            theme,

            themes:
              new Map([
                [
                  theme.name,
                  theme,
                ],
              ]),

            defaults:
              SYSTEM_DEFAULT_TOKENS_BY_COLOR_SCHEME
                .light,
          });


        expect(
          resolved.color
            .primary,
        ).toBe(
          "#root",
        );


        expect(
          resolved.color
            .secondary,
        ).toBe(
          SYSTEM_DEFAULT_TOKENS_BY_COLOR_SCHEME
            .light
            .color
            .secondary,
        );
      },
    );


    it(
      "inherits values from its parent",
      () => {
        const parent =
          createTheme(
            "parent",
            {
              tokens: {
                color: {
                  primary:
                    "#parent",
                },

                surface: {
                  canvas:
                    "#parent-bg",
                },
              },
            },
          );


        const child =
          createTheme(
            "child",
            {
              extends:
                "parent",
            },
          );


        const themes =
          new Map([
            [
              parent.name,
              parent,
            ],

            [
              child.name,
              child,
            ],
          ]);


        const resolved =
          resolveThemeTokens({
            theme:
              child,

            themes,

            defaults:
              SYSTEM_DEFAULT_TOKENS_BY_COLOR_SCHEME
                .light,
          });


        expect(
          resolved.color
            .primary,
        ).toBe(
          "#parent",
        );


        expect(
          resolved.surface
            .canvas,
        ).toBe(
          "#parent-bg",
        );
      },
    );


    it(
      "allows a child to override its parent",
      () => {
        const parent =
          createTheme(
            "override-parent",
            {
              tokens: {
                color: {
                  primary:
                    "#parent",
                },
              },
            },
          );


        const child =
          createTheme(
            "override-child",
            {
              extends:
                parent.name,

              tokens: {
                color: {
                  primary:
                    "#child",
                },
              },
            },
          );


        const resolved =
          resolveThemeTokens({
            theme:
              child,

            themes:
              new Map([
                [
                  parent.name,
                  parent,
                ],

                [
                  child.name,
                  child,
                ],
              ]),

            defaults:
              SYSTEM_DEFAULT_TOKENS_BY_COLOR_SCHEME
                .light,
          });


        expect(
          resolved.color
            .primary,
        ).toBe(
          "#child",
        );
      },
    );


    it(
      "maintains defaults, ancestor and child precedence across a chain",
      () => {
        const root =
          createTheme(
            "chain-root",
            {
              tokens: {
                color: {
                  primary:
                    "#root-primary",
                },

                surface: {
                  canvas:
                    "#root-bg",
                },
              },
            },
          );


        const middle =
          createTheme(
            "chain-middle",
            {
              extends:
                root.name,

              tokens: {
                color: {
                  primary:
                    "#middle-primary",

                  secondary:
                    "#middle-secondary",
                },
              },
            },
          );


        const leaf =
          createTheme(
            "chain-leaf",
            {
              extends:
                middle.name,

              tokens: {
                color: {
                  primary:
                    "#leaf-primary",
                },
              },
            },
          );


        const resolved =
          resolveThemeTokens({
            theme:
              leaf,

            themes:
              new Map([
                [
                  root.name,
                  root,
                ],

                [
                  middle.name,
                  middle,
                ],

                [
                  leaf.name,
                  leaf,
                ],
              ]),

            defaults:
              SYSTEM_DEFAULT_TOKENS_BY_COLOR_SCHEME
                .light,
          });


        expect(
          resolved.color
            .primary,
        ).toBe(
          "#leaf-primary",
        );


        expect(
          resolved.color
            .secondary,
        ).toBe(
          "#middle-secondary",
        );


        expect(
          resolved.surface
            .canvas,
        ).toBe(
          "#root-bg",
        );


        expect(
          resolved.text
            .text,
        ).toBe(
          SYSTEM_DEFAULT_TOKENS_BY_COLOR_SCHEME
            .light
            .text
            .text,
        );
      },
    );
  },
);


describe(
  "extension token precedence",
  () => {
    it(
      "merges extensions shallowly by top-level key",
      () => {
        const parent =
          createTheme(
            "extensions-parent",
            {
              tokens: {
                extensions: {
                  parentOnly:
                    "parent",

                  shared:
                    "parent",
                },
              },
            },
          );


        const child =
          createTheme(
            "extensions-child",
            {
              extends:
                parent.name,

              tokens: {
                extensions: {
                  childOnly:
                    "child",

                  shared:
                    "child",
                },
              },
            },
          );


        const resolved =
          resolveThemeTokens({
            theme:
              child,

            themes:
              new Map([
                [
                  parent.name,
                  parent,
                ],

                [
                  child.name,
                  child,
                ],
              ]),

            defaults: {
              ...SYSTEM_DEFAULT_TOKENS_BY_COLOR_SCHEME
                .light,

              extensions: {
                defaultOnly:
                  "default",

                shared:
                  "default",
              },
            },
          });


        expect(
          resolved.extensions,
        ).toEqual({
          defaultOnly:
            "default",

          parentOnly:
            "parent",

          childOnly:
            "child",

          shared:
            "child",
        });
      },
    );


    it(
      "replaces nested extension objects completely",
      () => {
        const theme =
          createTheme(
            "object-replacement",
            {
              tokens: {
                extensions: {
                  nested: {
                    child:
                      true,
                  },
                },
              },
            },
          );


        const resolved =
          resolveThemeTokens({
            theme,

            themes:
              new Map([
                [
                  theme.name,
                  theme,
                ],
              ]),

            defaults: {
              ...SYSTEM_DEFAULT_TOKENS_BY_COLOR_SCHEME
                .light,

              extensions: {
                nested: {
                  default:
                    true,

                  retained:
                    true,
                },
              },
            },
          });


        expect(
          resolved.extensions
            .nested,
        ).toEqual({
          child:
            true,
        });
      },
    );


    it(
      "replaces extension arrays completely",
      () => {
        const theme =
          createTheme(
            "array-replacement",
            {
              tokens: {
                extensions: {
                  values: [
                    "child",
                  ],
                },
              },
            },
          );


        const resolved =
          resolveThemeTokens({
            theme,

            themes:
              new Map([
                [
                  theme.name,
                  theme,
                ],
              ]),

            defaults: {
              ...SYSTEM_DEFAULT_TOKENS_BY_COLOR_SCHEME
                .light,

              extensions: {
                values: [
                  "default-a",
                  "default-b",
                ],
              },
            },
          });


        expect(
          resolved.extensions
            .values,
        ).toEqual([
          "child",
        ]);
      },
    );
  },
);


describe(
  "built-in themes",
  () => {
    it(
      "resolves every built-in as a complete token set",
      () => {
        const system =
          new ThemeSystem({
            persist:
              false,

            themes:
              BUILT_IN_THEMES,
          });


        for (
          const builtIn of
          BUILT_IN_THEMES
        ) {
          const resolved =
            system.resolveTheme(
              builtIn.name,
            );


          for (
            const leaf of
            leaves
          ) {
            expect(
              readPath(
                resolved.tokens,
                leaf.path,
              ),
              `${builtIn.name}:${leaf.path.join(
                ".",
              )}`,
            ).not.toBeUndefined();
          }


          expect(
            resolved.tokens
              .extensions,
          ).toBeDefined();
        }
      },
    );
  },
);


describe(
  "resolved token isolation",
  () => {
    it(
      "keeps resolved tokens independent from defaults, registered themes and previous results",
      () => {
        const originalTheme =
          createTheme(
            "isolated",
            {
              tokens: {
                color: {
                  primary:
                    "#original",
                },

                extensions: {
                  nested: {
                    value:
                      "original",
                  },

                  list: [
                    "original",
                  ],
                },
              },
            },
          );


        const system =
          new ThemeSystem({
            persist:
              false,

            themes: [
              originalTheme,
            ],
          });


        const first =
          system.resolveTheme(
            "isolated",
          );


        const second =
          system.resolveTheme(
            "isolated",
          );


        expect(
          first.tokens,
        ).not.toBe(
          second.tokens,
        );


        expect(
          first.tokens.color,
        ).not.toBe(
          second.tokens.color,
        );


        expect(
          first.tokens.extensions,
        ).not.toBe(
          second.tokens.extensions,
        );


        (
          first.tokens as unknown as {
            color: {
              primary:
                string;
            };

            extensions: {
              nested: {
                value:
                  string;
              };

              list:
                string[];
            };
          }
        ).color.primary =
          "#mutated";


        (
          first.tokens as unknown as {
            extensions: {
              nested: {
                value:
                  string;
              };

              list:
                string[];
            };
          }
        ).extensions.nested
          .value =
          "mutated";


        (
          first.tokens as unknown as {
            extensions: {
              list:
                string[];
            };
          }
        ).extensions.list
          .push(
            "mutated",
          );


        const third =
          system.resolveTheme(
            "isolated",
          );


        expect(
          third.tokens.color
            .primary,
        ).toBe(
          "#original",
        );


        expect(
          third.tokens.extensions
            .nested,
        ).toEqual({
          value:
            "original",
        });


        expect(
          third.tokens.extensions
            .list,
        ).toEqual([
          "original",
        ]);


        expect(
          SYSTEM_DEFAULT_TOKENS_BY_COLOR_SCHEME
            .light
            .color
            .primary,
        ).toBe(
          "#2f8c79",
        );


        expect(
          originalTheme.tokens
            ?.color
            ?.primary,
        ).toBe(
          "#original",
        );
      },
    );
  },
);