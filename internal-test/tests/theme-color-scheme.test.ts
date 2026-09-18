import {
  describe,
  expect,
  it,
} from "vitest";

import {
  ThemeSystem,
} from "../../src/theme";

import {
  BUILT_IN_THEMES,
} from "../../src/theme/built-in";

import {
  SYSTEM_DEFAULT_TOKENS_BY_COLOR_SCHEME,
} from "../../src/theme/runtime/system-default-tokens";

import {
  validateThemeDefinition,
} from "../../src/theme/validation/theme-validation";


describe(
  "Theme color scheme",
  () => {
    it(
      "rejects a root theme without metadata.colorScheme",
      () => {
        const result =
          validateThemeDefinition({
            name:
              "missing-color-scheme",

            source:
              "custom",

            metadata: {
              label:
                "Missing Color Scheme",
            },
          });


        expect(
          result.valid
        ).toBe(
          false
        );


        expect(
          result.diagnostics
        ).toContainEqual(
          expect.objectContaining({
            level:
              "error",

            code:
              "theme.metadata.color_scheme.required",

            path:
              "metadata.colorScheme",
          })
        );
      }
    );


    it(
      "inherits the color scheme from the nearest ancestor",
      () => {
        const system =
          new ThemeSystem({
            persist:
              false,

            themes: [
              {
                name:
                  "root-light",

                source:
                  "custom",

                metadata: {
                  colorScheme:
                    "light",
                },
              },

              {
                name:
                  "middle-dark",

                source:
                  "custom",

                extends:
                  "root-light",

                metadata: {
                  colorScheme:
                    "dark",
                },
              },

              {
                name:
                  "leaf",

                source:
                  "custom",

                extends:
                  "middle-dark",
              },
            ],
          });


        expect(
          system
            .resolveTheme(
              "leaf"
            )
            .metadata
            ?.colorScheme
        ).toBe(
          "dark"
        );
      }
    );


    it(
      "allows a derived theme to override the inherited color scheme",
      () => {
        const system =
          new ThemeSystem({
            persist:
              false,

            themes: [
              {
                name:
                  "override-root",

                source:
                  "custom",

                metadata: {
                  colorScheme:
                    "light",
                },
              },

              {
                name:
                  "override-child",

                source:
                  "custom",

                extends:
                  "override-root",

                metadata: {
                  colorScheme:
                    "dark",
                },
              },
            ],
          });


        expect(
          system
            .resolveTheme(
              "override-child"
            )
            .metadata
            ?.colorScheme
        ).toBe(
          "dark"
        );
      }
    );


    it(
      "applies light defaults to an incomplete light theme",
      () => {
        const system =
          new ThemeSystem({
            persist:
              false,

            themes: [
              {
                name:
                  "incomplete-light",

                source:
                  "custom",

                metadata: {
                  colorScheme:
                    "light",
                },

                tokens: {
                  color: {
                    primary:
                      "#123456",
                  },
                },
              },
            ],
          });


        const resolved =
          system.resolveTheme(
            "incomplete-light"
          );


        expect(
          resolved.tokens.surface
        ).toEqual(
          SYSTEM_DEFAULT_TOKENS_BY_COLOR_SCHEME
            .light
            .surface
        );


        expect(
          resolved.tokens.text
        ).toEqual(
          SYSTEM_DEFAULT_TOKENS_BY_COLOR_SCHEME
            .light
            .text
        );


        expect(
          resolved.tokens.border
        ).toEqual(
          SYSTEM_DEFAULT_TOKENS_BY_COLOR_SCHEME
            .light
            .border
        );
      }
    );


    it(
      "applies dark defaults to an incomplete dark theme",
      () => {
        const system =
          new ThemeSystem({
            persist:
              false,

            themes: [
              {
                name:
                  "incomplete-dark",

                source:
                  "custom",

                metadata: {
                  colorScheme:
                    "dark",
                },

                tokens: {
                  color: {
                    primary:
                      "#654321",
                  },
                },
              },
            ],
          });


        const resolved =
          system.resolveTheme(
            "incomplete-dark"
          );


        expect(
          resolved.tokens.surface
        ).toEqual(
          SYSTEM_DEFAULT_TOKENS_BY_COLOR_SCHEME
            .dark
            .surface
        );


        expect(
          resolved.tokens.text
        ).toEqual(
          SYSTEM_DEFAULT_TOKENS_BY_COLOR_SCHEME
            .dark
            .text
        );


        expect(
          resolved.tokens.border
        ).toEqual(
          SYSTEM_DEFAULT_TOKENS_BY_COLOR_SCHEME
            .dark
            .border
        );
      }
    );


    it(
      "keeps inherited and own tokens above scheme defaults",
      () => {
        const system =
          new ThemeSystem({
            persist:
              false,

            themes: [
              {
                name:
                  "token-root",

                source:
                  "custom",

                metadata: {
                  colorScheme:
                    "dark",
                },

                tokens: {
                  surface: {
                    bg:
                      "#root-background",
                  },

                  text: {
                    text:
                      "#root-text",
                  },
                },
              },

              {
                name:
                  "token-child",

                source:
                  "custom",

                extends:
                  "token-root",

                tokens: {
                  surface: {
                    surface:
                      "#child-surface",
                  },

                  border: {
                    border:
                      "#child-border",
                  },
                },
              },
            ],
          });


        const resolved =
          system.resolveTheme(
            "token-child"
          );


        expect(
          resolved.tokens.surface
            ?.bg
        ).toBe(
          "#root-background"
        );


        expect(
          resolved.tokens.surface
            ?.surface
        ).toBe(
          "#child-surface"
        );


        expect(
          resolved.tokens.text
            ?.text
        ).toBe(
          "#root-text"
        );


        expect(
          resolved.tokens.border
            ?.border
        ).toBe(
          "#child-border"
        );


        expect(
          resolved.tokens.surface
            ?.surface2
        ).toBe(
          SYSTEM_DEFAULT_TOKENS_BY_COLOR_SCHEME
            .dark
            .surface
            ?.surface2
        );


        expect(
          resolved.tokens.text
            ?.textMuted
        ).toBe(
          SYSTEM_DEFAULT_TOKENS_BY_COLOR_SCHEME
            .dark
            .text
            ?.textMuted
        );
      }
    );


    it(
      "always returns metadata.colorScheme from resolveTheme",
      () => {
        const system =
          new ThemeSystem({
            persist:
              false,

            themes: [
              {
                name:
                  "scheme-root",

                source:
                  "custom",

                metadata: {
                  colorScheme:
                    "light",
                },
              },

              {
                name:
                  "scheme-child",

                source:
                  "custom",

                extends:
                  "scheme-root",
              },

              {
                name:
                  "scheme-override",

                source:
                  "custom",

                extends:
                  "scheme-child",

                metadata: {
                  colorScheme:
                    "dark",
                },
              },
            ],
          });


        for (
          const name of [
            "scheme-root",
            "scheme-child",
            "scheme-override",
          ]
        ) {
          expect(
            system
              .resolveTheme(
                name
              )
              .metadata
              ?.colorScheme
          ).toMatch(
            /^(light|dark)$/
          );
        }
      }
    );


    it(
      "registers and resolves every built-in theme",
      () => {
        const system =
          new ThemeSystem({
            persist:
              false,

            themes:
              BUILT_IN_THEMES,
          });


        expect(
          system.getThemes()
        ).toHaveLength(
          BUILT_IN_THEMES.length
        );


        for (
          const builtIn of
          BUILT_IN_THEMES
        ) {
          const resolved =
            system.resolveTheme(
              builtIn.name
            );


          expect(
            resolved.name
          ).toBe(
            builtIn.name
          );


          expect(
            resolved.source
          ).toBe(
            "builtin"
          );


          expect(
            resolved.metadata
              ?.colorScheme
          ).toBe(
            builtIn.metadata
              ?.colorScheme
          );


          expect(
            resolved.metadata
              ?.colorScheme
          ).toMatch(
            /^(light|dark)$/
          );
        }
      }
    );
  }
);